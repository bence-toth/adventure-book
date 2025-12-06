import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "fake-indexeddb/auto";
import { AdventureProvider, AdventureContext } from "../AdventureContext";
import { saveAdventure, type StoredAdventure } from "@/data/adventureDatabase";
import { invalidateAdventureCache } from "@/data/adventureLoader";
import { useContext } from "react";

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
    // Clear adventure cache
    invalidateAdventureCache();

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

  describe("Context Integration", () => {
    it("should provide all context values to children", () => {
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
      expect(screen.getByTestId("error-state")).toBeInTheDocument();
      expect(screen.getByTestId("saving-state")).toBeInTheDocument();
    });

    it("should extract adventureId from route params", async () => {
      const adventure: StoredAdventure = {
        id: "test-adventure-route",
        title: "Test Adventure",
        content: sampleAdventureYAML,
        lastEdited: new Date(),
        createdAt: new Date(),
      };

      await saveAdventure(adventure);

      render(
        <MemoryRouter initialEntries={["/adventure/test-adventure-route"]}>
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

      await waitFor(() => {
        expect(screen.getByTestId("adventure-id")).toHaveTextContent(
          "test-adventure-route"
        );
      });
    });
  });

  describe("useAdventureLoader Integration", () => {
    it("should load adventure using useAdventureLoader hook", async () => {
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

      // Wait for adventure to load and sync to local state
      await waitFor(
        () => {
          expect(screen.getByTestId("loading-state")).toHaveTextContent(
            "not-loading"
          );
          expect(screen.getByTestId("adventure-data")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      expect(screen.getByTestId("adventure-title")).toHaveTextContent(
        "Test Adventure"
      );
    });

    it("should handle loading errors from useAdventureLoader", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

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

      await waitFor(
        () => {
          expect(screen.getByTestId("error-state")).not.toHaveTextContent(
            "no-error"
          );
        },
        { timeout: 3000 }
      );

      expect(screen.queryByTestId("adventure-data")).not.toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("should reload adventure when reloadAdventure is called", async () => {
      const adventure: StoredAdventure = {
        id: "test-adventure-reload",
        title: "Test Adventure",
        content: sampleAdventureYAML,
        lastEdited: new Date(),
        createdAt: new Date(),
      };

      await saveAdventure(adventure);

      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={["/adventure/test-adventure-reload"]}>
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

      await waitFor(() => {
        expect(screen.getByTestId("loading-state")).toHaveTextContent(
          "not-loading"
        );
      });

      const reloadButton = screen.getByTestId("reload-adventure-button");
      await user.click(reloadButton);

      // Should be loading again
      await waitFor(() => {
        expect(screen.getByTestId("loading-state")).toHaveTextContent(
          "loading"
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId("loading-state")).toHaveTextContent(
          "not-loading"
        );
      });
    });
  });

  describe("useSavingState Integration", () => {
    it("should provide withSaving function from useSavingState hook", async () => {
      const adventure: StoredAdventure = {
        id: "test-adventure-saving",
        title: "Test Adventure",
        content: sampleAdventureYAML,
        lastEdited: new Date(),
        createdAt: new Date(),
      };

      await saveAdventure(adventure);

      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={["/adventure/test-adventure-saving"]}>
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

      await waitFor(() => {
        expect(screen.getByTestId("loading-state")).toHaveTextContent(
          "not-loading"
        );
      });

      expect(screen.getByTestId("saving-state")).toHaveTextContent(
        "not-saving"
      );

      const longSaveButton = screen.getByTestId("simulate-long-save-button");
      const clickPromise = user.click(longSaveButton);

      // Should show saving after delay
      await waitFor(
        () => {
          expect(screen.getByTestId("saving-state")).toHaveTextContent(
            "saving"
          );
        },
        { timeout: 700 }
      );

      await clickPromise;

      await waitFor(() => {
        expect(screen.getByTestId("saving-state")).toHaveTextContent(
          "not-saving"
        );
      });
    });
  });

  describe("updateAdventure Integration", () => {
    it("should update adventure state locally", async () => {
      const adventure: StoredAdventure = {
        id: "test-adventure-update",
        title: "Test Adventure",
        content: sampleAdventureYAML,
        lastEdited: new Date(),
        createdAt: new Date(),
      };

      await saveAdventure(adventure);

      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={["/adventure/test-adventure-update"]}>
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

      await waitFor(() => {
        expect(screen.getByTestId("adventure-title")).toHaveTextContent(
          "Test Adventure"
        );
      });

      const updateButton = screen.getByTestId("update-title-button");
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByTestId("adventure-title")).toHaveTextContent(
          "Updated Title"
        );
      });
    });

    it("should not update when adventure is null", async () => {
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

      await waitFor(() => {
        expect(screen.getByTestId("loading-state")).toHaveTextContent(
          "not-loading"
        );
      });

      expect(screen.queryByTestId("adventure-data")).not.toBeInTheDocument();

      const updateButton = screen.getByTestId("update-title-button");
      await user.click(updateButton);

      expect(screen.queryByTestId("adventure-data")).not.toBeInTheDocument();
    });
  });

  describe("Full Integration Flow", () => {
    it("should handle complete adventure lifecycle with all hooks", async () => {
      const adventure: StoredAdventure = {
        id: "test-adventure-full",
        title: "Test Adventure",
        content: sampleAdventureYAML,
        lastEdited: new Date(),
        createdAt: new Date(),
      };

      await saveAdventure(adventure);

      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={["/adventure/test-adventure-full"]}>
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

      // 1. Load adventure (useAdventureLoader)
      expect(screen.getByTestId("loading-state")).toHaveTextContent("loading");

      await waitFor(
        () => {
          expect(screen.getByTestId("loading-state")).toHaveTextContent(
            "not-loading"
          );
          expect(screen.getByTestId("adventure-title")).toHaveTextContent(
            "Test Adventure"
          );
        },
        { timeout: 3000 }
      );

      // 2. Update adventure locally (updateAdventure)
      const updateButton = screen.getByTestId("update-title-button");
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByTestId("adventure-title")).toHaveTextContent(
          "Updated Title"
        );
      });

      // 3. Simulate long save operation (useSavingState via withSaving)
      const longSaveButton = screen.getByTestId("simulate-long-save-button");
      const clickPromise = user.click(longSaveButton);

      await waitFor(
        () => {
          expect(screen.getByTestId("saving-state")).toHaveTextContent(
            "saving"
          );
        },
        { timeout: 700 }
      );

      await clickPromise;

      await waitFor(() => {
        expect(screen.getByTestId("saving-state")).toHaveTextContent(
          "not-saving"
        );
      });

      // 4. Reload adventure (useAdventureLoader reloadAdventure)
      const reloadButton = screen.getByTestId("reload-adventure-button");
      await user.click(reloadButton);

      await waitFor(
        () => {
          expect(screen.getByTestId("loading-state")).toHaveTextContent(
            "loading"
          );
        },
        { timeout: 500 }
      );

      await waitFor(
        () => {
          expect(screen.getByTestId("loading-state")).toHaveTextContent(
            "not-loading"
          );
          // After reload, adventure should be back to original from database
          expect(screen.getByTestId("adventure-title")).toHaveTextContent(
            "Test Adventure"
          );
        },
        { timeout: 3000 }
      );
    });
  });
});
