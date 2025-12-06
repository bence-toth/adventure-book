import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import "fake-indexeddb/auto";
import { useAdventureLoader } from "../useAdventureLoader";
import { saveAdventure, type StoredAdventure } from "@/data/adventureDatabase";
import * as adventureLoader from "@/data/adventureLoader";
import { invalidateAdventureCache } from "@/data/adventureLoader";

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

describe("useAdventureLoader", () => {
  beforeEach(async () => {
    // Clear adventure cache first
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

    // Clear cache again after clearing DB to ensure clean state
    invalidateAdventureCache();

    vi.clearAllMocks();
  });

  it("should initialize with loading state when adventureId is undefined", () => {
    const { result } = renderHook(() => useAdventureLoader(undefined));

    expect(result.current.adventure).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
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

    const { result } = renderHook(() => useAdventureLoader("test-adventure-1"));

    // Should start as loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.adventure).toBeNull();

    // Wait for adventure to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.adventure).not.toBeNull();
    expect(result.current.adventure?.metadata.title).toBe("Test Adventure");
    expect(result.current.error).toBeNull();
  });

  it("should set error state when adventure loading fails", async () => {
    const { result } = renderHook(() =>
      useAdventureLoader("non-existent-adventure")
    );

    // Should start as loading
    expect(result.current.isLoading).toBe(true);

    // Wait for error state
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.adventure).toBeNull();
    expect(result.current.error).toBe(
      "Adventure with id non-existent-adventure not found"
    );
  });

  it("should handle Error instances correctly", async () => {
    vi.spyOn(adventureLoader, "loadAdventureById").mockRejectedValueOnce(
      new Error("Custom error message")
    );

    const { result } = renderHook(() => useAdventureLoader("test-id"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Custom error message");
  });

  it("should handle non-Error exceptions with fallback message", async () => {
    vi.spyOn(adventureLoader, "loadAdventureById").mockRejectedValueOnce(
      "String error"
    );

    const { result } = renderHook(() => useAdventureLoader("test-id"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to load adventure");
  });

  it("should reload adventure when reloadAdventure is called", async () => {
    const adventure: StoredAdventure = {
      id: "test-adventure-2",
      title: "Test Adventure",
      content: sampleAdventureYAML,
      lastEdited: new Date(),
      createdAt: new Date(),
    };

    await saveAdventure(adventure);

    const { result } = renderHook(() => useAdventureLoader("test-adventure-2"));

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.adventure?.metadata.title).toBe("Test Adventure");

    // Update the adventure in the database
    const updatedYAML = sampleAdventureYAML.replace(
      "Test Adventure",
      "Updated Title"
    );
    await saveAdventure({
      ...adventure,
      title: "Updated Title",
      content: updatedYAML,
    });

    // Trigger reload wrapped in act
    act(() => {
      result.current.reloadAdventure();
    });

    // Wait for reload to complete (skip checking loading state as it may be too fast)
    await waitFor(
      () => {
        expect(result.current.adventure?.metadata.title).toBe("Updated Title");
      },
      { timeout: 1000 }
    );
  });

  it("should not update state if component unmounts during loading", async () => {
    const adventure: StoredAdventure = {
      id: "test-adventure-3",
      title: "Test Adventure",
      content: sampleAdventureYAML,
      lastEdited: new Date(),
      createdAt: new Date(),
    };

    await saveAdventure(adventure);

    // Mock loadAdventureById to delay the response
    const loadSpy = vi
      .spyOn(adventureLoader, "loadAdventureById")
      .mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                metadata: {
                  title: "Test Adventure",
                  author: "Test Author",
                  version: "1.0.0",
                },
                intro: {
                  paragraphs: ["Welcome to the test adventure."],
                  action: "Begin",
                },
                passages: {
                  1: {
                    paragraphs: ["You are at the start."],
                    choices: [
                      {
                        text: "Go forward",
                        goto: 2,
                      },
                    ],
                  },
                  2: {
                    paragraphs: ["You went forward."],
                    type: "victory",
                    ending: true,
                  },
                },
                items: [],
              });
            }, 100);
          })
      );

    const { result, unmount } = renderHook(() =>
      useAdventureLoader("test-adventure-3")
    );

    expect(result.current.isLoading).toBe(true);

    // Unmount before loading completes
    unmount();

    // Wait a bit to ensure the async operation would have completed
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Verify that loadAdventureById was called
    expect(loadSpy).toHaveBeenCalledWith("test-adventure-3");

    // No errors should be thrown due to state updates after unmount
  });

  it("should clear state when adventureId changes to undefined", async () => {
    const adventure: StoredAdventure = {
      id: "test-adventure-4",
      title: "Test Adventure",
      content: sampleAdventureYAML,
      lastEdited: new Date(),
      createdAt: new Date(),
    };

    await saveAdventure(adventure);

    const { result, rerender } = renderHook(
      ({ adventureId }: { adventureId: string | undefined }) =>
        useAdventureLoader(adventureId),
      {
        initialProps: { adventureId: "test-adventure-4" as string | undefined },
      }
    );

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.adventure).not.toBeNull();

    // Change adventureId to undefined
    rerender({ adventureId: undefined });

    // Should clear state immediately
    expect(result.current.adventure).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
