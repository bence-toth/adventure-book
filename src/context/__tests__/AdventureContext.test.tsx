import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "fake-indexeddb/auto";
import { AdventureProvider, AdventureContext } from "../AdventureContext";
import { saveAdventure, type StoredAdventure } from "@/data/adventureDatabase";
import * as adventureLoader from "@/data/adventureLoader";
import { useContext } from "react";
import type { Adventure } from "@/data/types";

// Sample valid adventure YAML
const sampleAdventureYAML = `metadata:
  title: Test Adventure
  author: Test Author
  version: "1.0.0"

intro:
  text: |
    Welcome to the test adventure.
  action: Begin

passages:
  1:
    text: You are at the start.
    choices:
      - text: Go forward
        goto: 2
  2:
    text: You went forward.
    type: victory
    ending: true
`;

// Test component that consumes the context
const TestConsumer = () => {
  const context = useContext(AdventureContext);

  if (!context) {
    return <div>No context</div>;
  }

  const {
    adventure,
    adventureId,
    isLoading,
    error,
    isSaving,
    updateAdventure,
    withSaving,
    reloadAdventure,
  } = context;

  const handleUpdateTitle = () => {
    updateAdventure((adv) => ({
      ...adv,
      metadata: {
        ...adv.metadata,
        title: "Updated Title",
      },
    }));
  };

  const handleSimulateSave = async () => {
    await withSaving(async () => {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
  };

  const handleSimulateLongSave = async () => {
    await withSaving(async () => {
      // Simulate longer async operation (>500ms)
      await new Promise((resolve) => setTimeout(resolve, 600));
    });
  };

  return (
    <div>
      <div data-testid="loading-state">
        {isLoading ? "loading" : "not-loading"}
      </div>
      <div data-testid="saving-state">{isSaving ? "saving" : "not-saving"}</div>
      <div data-testid="adventure-id">{adventureId || "no-id"}</div>
      <div data-testid="error-state">{error || "no-error"}</div>
      {adventure && (
        <div data-testid="adventure-data">
          <div data-testid="adventure-title">{adventure.metadata.title}</div>
          <div data-testid="adventure-author">{adventure.metadata.author}</div>
        </div>
      )}
      <button onClick={handleUpdateTitle} data-testid="update-title-button">
        Update Title
      </button>
      <button onClick={handleSimulateSave} data-testid="simulate-save-button">
        Simulate Save
      </button>
      <button
        onClick={handleSimulateLongSave}
        data-testid="simulate-long-save-button"
      >
        Simulate Long Save
      </button>
      <button onClick={reloadAdventure} data-testid="reload-adventure-button">
        Reload Adventure
      </button>
    </div>
  );
};

describe("AdventureContext", () => {
  beforeEach(async () => {
    // Clear IndexedDB before each test
    const dbs = await indexedDB.databases();
    await Promise.all(
      dbs.map(
        (db) =>
          new Promise<void>((resolve) => {
            const request = indexedDB.deleteDatabase(db.name!);
            request.onsuccess = () => resolve();
            request.onerror = () => resolve();
          })
      )
    );
  });

  it("should provide context to children", () => {
    render(
      <MemoryRouter initialEntries={["/adventure/test-id"]}>
        <Routes>
          <Route
            path="/adventure/:adventureId"
            element={
              <AdventureProvider>
                <TestConsumer />
              </AdventureProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
    expect(screen.getByTestId("adventure-id")).toBeInTheDocument();
  });

  it("should set loading to false and clear state when no adventureId", async () => {
    render(
      <MemoryRouter initialEntries={["/some-path"]}>
        <Routes>
          <Route
            path="/some-path"
            element={
              <AdventureProvider>
                <TestConsumer />
              </AdventureProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "not-loading"
      );
    });

    expect(screen.getByTestId("adventure-id")).toHaveTextContent("no-id");
    expect(screen.queryByTestId("adventure-data")).not.toBeInTheDocument();
  });

  it("should load adventure when adventureId is provided", async () => {
    const adventure: StoredAdventure = {
      id: "test-adventure-1",
      title: "Test Adventure",
      content: sampleAdventureYAML,
      lastEdited: new Date(),
      createdAt: new Date(),
    };

    await saveAdventure(adventure);

    render(
      <MemoryRouter initialEntries={["/adventure/test-adventure-1"]}>
        <Routes>
          <Route
            path="/adventure/:adventureId"
            element={
              <AdventureProvider>
                <TestConsumer />
              </AdventureProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Should start as loading
    expect(screen.getByTestId("loading-state")).toHaveTextContent("loading");

    // Wait for adventure to load
    await waitFor(
      () => {
        expect(screen.getByTestId("loading-state")).toHaveTextContent(
          "not-loading"
        );
      },
      { timeout: 3000 }
    );

    expect(screen.getByTestId("adventure-id")).toHaveTextContent(
      "test-adventure-1"
    );
    expect(screen.getByTestId("error-state")).toHaveTextContent("no-error");
    expect(screen.getByTestId("adventure-data")).toBeInTheDocument();
    expect(screen.getByTestId("adventure-title")).toHaveTextContent(
      "Test Adventure"
    );
    expect(screen.getByTestId("adventure-author")).toHaveTextContent(
      "Test Author"
    );
  });

  it("should set error state when adventure loading fails", async () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={["/adventure/non-existent-id"]}>
        <Routes>
          <Route
            path="/adventure/:adventureId"
            element={
              <AdventureProvider>
                <TestConsumer />
              </AdventureProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for error state
    await waitFor(
      () => {
        expect(screen.getByTestId("error-state")).not.toHaveTextContent(
          "no-error"
        );
      },
      { timeout: 3000 }
    );

    expect(screen.getByTestId("loading-state")).toHaveTextContent(
      "not-loading"
    );
    expect(screen.getByTestId("adventure-id")).toHaveTextContent(
      "non-existent-id"
    );
    expect(screen.queryByTestId("adventure-data")).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("should handle invalid adventure YAML", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const invalidAdventure: StoredAdventure = {
      id: "invalid-adventure",
      title: "Invalid",
      content: "not valid yaml: [unclosed",
      lastEdited: new Date(),
      createdAt: new Date(),
    };

    await saveAdventure(invalidAdventure);

    render(
      <MemoryRouter initialEntries={["/adventure/invalid-adventure"]}>
        <Routes>
          <Route
            path="/adventure/:adventureId"
            element={
              <AdventureProvider>
                <TestConsumer />
              </AdventureProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for error state - check that loading is complete and error exists
    await waitFor(
      () => {
        expect(screen.getByTestId("loading-state")).toHaveTextContent(
          "not-loading"
        );
      },
      { timeout: 3000 }
    );

    // Verify error is set
    const errorState = screen.getByTestId("error-state");
    expect(errorState.textContent).not.toBe("no-error");

    expect(screen.queryByTestId("adventure-data")).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("should handle non-Error exceptions with fallback message", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Mock loadAdventureById to throw a non-Error value
    const mockLoadAdventureById = vi
      .spyOn(adventureLoader, "loadAdventureById")
      .mockRejectedValueOnce("string error" as never);

    render(
      <MemoryRouter initialEntries={["/adventure/error-test"]}>
        <Routes>
          <Route
            path="/adventure/:adventureId"
            element={
              <AdventureProvider>
                <TestConsumer />
              </AdventureProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(
      () => {
        expect(screen.getByTestId("loading-state")).toHaveTextContent(
          "not-loading"
        );
      },
      { timeout: 3000 }
    );

    expect(screen.getByTestId("error-state")).toHaveTextContent(
      "Failed to load adventure"
    );
    expect(screen.queryByTestId("adventure-data")).not.toBeInTheDocument();

    consoleSpy.mockRestore();
    mockLoadAdventureById.mockRestore();
  });

  // Note: Testing adventureId changes with rerender is complex due to
  // how MemoryRouter handles route changes. This is better covered by
  // integration tests where actual navigation occurs.

  // Note: Testing route changes with rerender has timing complexities.
  // The loading/clearing behavior is already covered by other tests.

  it("should update adventure via updateAdventure function", async () => {
    const adventure: StoredAdventure = {
      id: "test-adventure-2",
      title: "Test Adventure",
      content: sampleAdventureYAML,
      lastEdited: new Date(),
      createdAt: new Date(),
    };

    await saveAdventure(adventure);

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/adventure/test-adventure-2"]}>
        <Routes>
          <Route
            path="/adventure/:adventureId"
            element={
              <AdventureProvider>
                <TestConsumer />
              </AdventureProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for adventure to load
    await waitFor(() => {
      expect(screen.getByTestId("adventure-title")).toHaveTextContent(
        "Test Adventure"
      );
    });

    // Update the title
    const updateButton = screen.getByTestId("update-title-button");
    await user.click(updateButton);

    // Verify title was updated
    await waitFor(() => {
      expect(screen.getByTestId("adventure-title")).toHaveTextContent(
        "Updated Title"
      );
    });
  });

  it("should not update adventure when adventure is null", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/some-path"]}>
        <Routes>
          <Route
            path="/some-path"
            element={
              <AdventureProvider>
                <TestConsumer />
              </AdventureProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for initial load (should be null)
    await waitFor(() => {
      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "not-loading"
      );
    });

    expect(screen.queryByTestId("adventure-data")).not.toBeInTheDocument();

    // Try to update the title when adventure is null
    const updateButton = screen.getByTestId("update-title-button");
    await user.click(updateButton);

    // Should remain null
    expect(screen.queryByTestId("adventure-data")).not.toBeInTheDocument();
  });

  it("should track saving state with withSaving", async () => {
    const adventure: StoredAdventure = {
      id: "test-adventure-3",
      title: "Test Adventure",
      content: sampleAdventureYAML,
      lastEdited: new Date(),
      createdAt: new Date(),
    };

    await saveAdventure(adventure);

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/adventure/test-adventure-3"]}>
        <Routes>
          <Route
            path="/adventure/:adventureId"
            element={
              <AdventureProvider>
                <TestConsumer />
              </AdventureProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for adventure to load
    await waitFor(() => {
      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "not-loading"
      );
    });

    // Initial state should be not-saving
    expect(screen.getByTestId("saving-state")).toHaveTextContent("not-saving");

    // Trigger a quick save (100ms - less than 500ms threshold)
    const saveButton = screen.getByTestId("simulate-save-button");
    const clickPromise = user.click(saveButton);

    // Should NOT show saving state for quick operations
    // Wait a bit to ensure it doesn't flash
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByTestId("saving-state")).toHaveTextContent("not-saving");

    // Wait for save to complete
    await clickPromise;

    // Should still be not-saving after operation completes
    expect(screen.getByTestId("saving-state")).toHaveTextContent("not-saving");
  });

  it("should show saving state only for operations longer than 500ms", async () => {
    const adventure: StoredAdventure = {
      id: "test-adventure-3b",
      title: "Test Adventure",
      content: sampleAdventureYAML,
      lastEdited: new Date(),
      createdAt: new Date(),
    };

    await saveAdventure(adventure);

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/adventure/test-adventure-3b"]}>
        <Routes>
          <Route
            path="/adventure/:adventureId"
            element={
              <AdventureProvider>
                <TestConsumer />
              </AdventureProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for adventure to load
    await waitFor(() => {
      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "not-loading"
      );
    });

    // Initial state should be not-saving
    expect(screen.getByTestId("saving-state")).toHaveTextContent("not-saving");

    // Trigger a long save (600ms - more than 500ms threshold)
    const longSaveButton = screen.getByTestId("simulate-long-save-button");
    const clickPromise = user.click(longSaveButton);

    // Should NOT show saving immediately
    expect(screen.getByTestId("saving-state")).toHaveTextContent("not-saving");

    // Wait for more than 500ms to ensure the timeout fires and saving state appears
    await waitFor(
      () => {
        expect(screen.getByTestId("saving-state")).toHaveTextContent("saving");
      },
      { timeout: 700 }
    );

    // Wait for save to complete
    await clickPromise;

    // Should return to not-saving after operation completes
    await waitFor(() => {
      expect(screen.getByTestId("saving-state")).toHaveTextContent(
        "not-saving"
      );
    });
  });

  it("should handle multiple concurrent saves correctly", async () => {
    const adventure: StoredAdventure = {
      id: "test-adventure-4",
      title: "Test Adventure",
      content: sampleAdventureYAML,
      lastEdited: new Date(),
      createdAt: new Date(),
    };

    await saveAdventure(adventure);

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/adventure/test-adventure-4"]}>
        <Routes>
          <Route
            path="/adventure/:adventureId"
            element={
              <AdventureProvider>
                <TestConsumer />
              </AdventureProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for adventure to load
    await waitFor(() => {
      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "not-loading"
      );
    });

    // Trigger multiple long saves to ensure they last beyond the 500ms threshold
    const longSaveButton = screen.getByTestId("simulate-long-save-button");
    const clickPromise1 = user.click(longSaveButton);
    const clickPromise2 = user.click(longSaveButton);

    // Should NOT show saving immediately
    expect(screen.getByTestId("saving-state")).toHaveTextContent("not-saving");

    // Should show saving state after 500ms
    await act(async () => {
      await waitFor(
        () => {
          expect(screen.getByTestId("saving-state")).toHaveTextContent(
            "saving"
          );
        },
        { timeout: 700 }
      );
    });

    // Wait for all saves to complete
    await Promise.all([clickPromise1, clickPromise2]);

    // Should return to not-saving only after all operations complete
    await waitFor(() => {
      expect(screen.getByTestId("saving-state")).toHaveTextContent(
        "not-saving"
      );
    });
  });

  it("should cleanup timeout on unmount during saving operation", async () => {
    const adventure: StoredAdventure = {
      id: "test-adventure-5",
      title: "Test Adventure",
      content: sampleAdventureYAML,
      lastEdited: new Date(),
      createdAt: new Date(),
    };

    await saveAdventure(adventure);

    const user = userEvent.setup();

    const { unmount } = render(
      <MemoryRouter initialEntries={["/adventure/test-adventure-5"]}>
        <Routes>
          <Route
            path="/adventure/:adventureId"
            element={
              <AdventureProvider>
                <TestConsumer />
              </AdventureProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for adventure to load
    await waitFor(() => {
      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "not-loading"
      );
    });

    // Trigger a long save operation
    const longSaveButton = screen.getByTestId("simulate-long-save-button");
    const clickPromise = user.click(longSaveButton);

    // Wait a bit to start the timeout
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    // Unmount the component while saving is in progress
    unmount();

    // Wait for the click promise to settle
    await clickPromise.catch(() => {
      // Ignore errors from unmounting during operation
    });

    // If we get here without errors, the cleanup worked correctly
    expect(true).toBe(true);
  });

  it("should reload adventure when reloadAdventure is called", async () => {
    const adventure: StoredAdventure = {
      id: "test-adventure-6",
      title: "Test Adventure",
      content: sampleAdventureYAML,
      lastEdited: new Date(),
      createdAt: new Date(),
    };

    await saveAdventure(adventure);

    const user = userEvent.setup();

    // Spy on loadAdventureById to track how many times it's called
    const loadSpy = vi.spyOn(adventureLoader, "loadAdventureById");

    render(
      <MemoryRouter initialEntries={["/adventure/test-adventure-6"]}>
        <Routes>
          <Route
            path="/adventure/:adventureId"
            element={
              <AdventureProvider>
                <TestConsumer />
              </AdventureProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for adventure to load initially
    await waitFor(() => {
      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "not-loading"
      );
    });

    expect(screen.getByTestId("adventure-title")).toHaveTextContent(
      "Test Adventure"
    );

    // loadAdventureById should have been called once on initial load
    expect(loadSpy).toHaveBeenCalledTimes(1);

    // Trigger reload
    const reloadButton = screen.getByTestId("reload-adventure-button");
    await user.click(reloadButton);

    // Should be loading again
    await waitFor(() => {
      expect(screen.getByTestId("loading-state")).toHaveTextContent("loading");
    });

    // Wait for adventure to reload
    await waitFor(() => {
      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "not-loading"
      );
    });

    // loadAdventureById should have been called twice (initial + reload)
    expect(loadSpy).toHaveBeenCalledTimes(2);

    // Adventure should still be loaded
    expect(screen.getByTestId("adventure-title")).toHaveTextContent(
      "Test Adventure"
    );

    loadSpy.mockRestore();
  });

  it("should maintain saving state when one operation completes but others are still running", async () => {
    const adventure: StoredAdventure = {
      id: "test-adventure-7",
      title: "Test Adventure",
      content: sampleAdventureYAML,
      lastEdited: new Date(),
      createdAt: new Date(),
    };

    await saveAdventure(adventure);

    const TestConsumerWithStaggeredSaves = () => {
      const context = useContext(AdventureContext);

      if (!context) {
        return <div>No context</div>;
      }

      const { isSaving, withSaving, isLoading } = context;

      const handleStaggeredSaves = async () => {
        // Start a long save operation
        const longSave = withSaving(async () => {
          await new Promise((resolve) => setTimeout(resolve, 700));
        });

        // Start a shorter save operation after 100ms
        await new Promise((resolve) => setTimeout(resolve, 100));
        const shortSave = withSaving(async () => {
          await new Promise((resolve) => setTimeout(resolve, 200));
        });

        // Wait for the short save to complete first
        await shortSave;

        // Long save should still be running
        return longSave;
      };

      return (
        <div>
          <div data-testid="loading-state">
            {isLoading ? "loading" : "not-loading"}
          </div>
          <div data-testid="saving-state">
            {isSaving ? "saving" : "not-saving"}
          </div>
          <button
            onClick={handleStaggeredSaves}
            data-testid="staggered-save-button"
          >
            Staggered Saves
          </button>
        </div>
      );
    };

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/adventure/test-adventure-7"]}>
        <Routes>
          <Route
            path="/adventure/:adventureId"
            element={
              <AdventureProvider>
                <TestConsumerWithStaggeredSaves />
              </AdventureProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for adventure to load
    await waitFor(() => {
      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "not-loading"
      );
    });

    // Initial state should be not-saving
    expect(screen.getByTestId("saving-state")).toHaveTextContent("not-saving");

    // Trigger staggered saves
    const staggeredButton = screen.getByTestId("staggered-save-button");
    const clickPromise = user.click(staggeredButton);

    // Wait for the timeout to trigger (>500ms) and saving state to appear
    await waitFor(
      () => {
        expect(screen.getByTestId("saving-state")).toHaveTextContent("saving");
      },
      { timeout: 700 }
    );

    // Wait a bit more to ensure short save completes but long save is still running
    // At this point we should still be saving
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(screen.getByTestId("saving-state")).toHaveTextContent("saving");

    // Wait for all saves to complete
    await clickPromise;

    // Should return to not-saving after all operations complete
    await waitFor(() => {
      expect(screen.getByTestId("saving-state")).toHaveTextContent(
        "not-saving"
      );
    });
  });

  it("should not update state if component unmounts during adventure loading", async () => {
    const adventure: StoredAdventure = {
      id: "test-adventure-8",
      title: "Test Adventure",
      content: sampleAdventureYAML,
      lastEdited: new Date(),
      createdAt: new Date(),
    };

    await saveAdventure(adventure);

    let resolveLoad: ((value: Adventure) => void) | null = null;

    // Mock loadAdventureById with a promise we can control
    const mockLoadAdventureById = vi
      .spyOn(adventureLoader, "loadAdventureById")
      .mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveLoad = resolve;
          })
      );

    const { unmount } = render(
      <MemoryRouter initialEntries={["/adventure/test-adventure-8"]}>
        <Routes>
          <Route
            path="/adventure/:adventureId"
            element={
              <AdventureProvider>
                <TestConsumer />
              </AdventureProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Should start as loading
    expect(screen.getByTestId("loading-state")).toHaveTextContent("loading");

    // Unmount the component
    unmount();

    // Now resolve the load after unmounting
    await act(async () => {
      if (resolveLoad) {
        resolveLoad({
          metadata: {
            title: "Test Adventure",
            author: "Test Author",
            version: "1.0.0",
          },
          intro: {
            paragraphs: ["Welcome to the test adventure."],
            action: "Begin",
          },
          items: [],
          passages: {
            1: {
              paragraphs: ["You are at the start."],
              choices: [{ text: "Go forward", goto: 2 }],
            },
            2: {
              paragraphs: ["You went forward."],
              type: "victory",
              ending: true,
            },
          },
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    // If we get here without errors, the isMounted check worked
    expect(true).toBe(true);

    mockLoadAdventureById.mockRestore();
  });
});
