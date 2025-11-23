import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "fake-indexeddb/auto";
import { AdventureProvider, AdventureContext } from "../AdventureContext";
import { saveAdventure, type StoredAdventure } from "@/data/adventureDatabase";
import * as adventureLoader from "@/data/adventureLoader";
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

  const { adventure, adventureId, loading, error } = context;

  return (
    <div>
      <div data-testid="loading-state">
        {loading ? "loading" : "not-loading"}
      </div>
      <div data-testid="adventure-id">{adventureId || "no-id"}</div>
      <div data-testid="error-state">{error || "no-error"}</div>
      {adventure && (
        <div data-testid="adventure-data">
          <div data-testid="adventure-title">{adventure.metadata.title}</div>
          <div data-testid="adventure-author">{adventure.metadata.author}</div>
        </div>
      )}
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
});
