import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import "fake-indexeddb/auto";
import { useAdventureLoader } from "../useAdventureLoader";
import { saveAdventure, type StoredAdventure } from "@/data/adventureDatabase";
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

describe("useAdventureLoader - Adventure ID Changes", () => {
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

    // Clear all mocks
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("should load new adventure when adventureId changes", async () => {
    const adventure1YAML = sampleAdventureYAML.replace(
      "title: Test Adventure",
      "title: Adventure 1"
    );
    const adventure1: StoredAdventure = {
      id: "test-adventure-change-1",
      title: "Adventure 1",
      content: adventure1YAML,
      lastEdited: new Date(),
      createdAt: new Date(),
    };

    const adventure2YAML = sampleAdventureYAML.replace(
      "title: Test Adventure",
      "title: Adventure 2"
    );
    const adventure2: StoredAdventure = {
      id: "test-adventure-change-2",
      title: "Adventure 2",
      content: adventure2YAML,
      lastEdited: new Date(),
      createdAt: new Date(),
    };

    await saveAdventure(adventure1);
    await saveAdventure(adventure2);

    // Wait for IndexedDB operations to fully complete
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Clear cache completely before loading
    invalidateAdventureCache();

    const { result, rerender } = renderHook(
      ({ adventureId }) => useAdventureLoader(adventureId),
      {
        initialProps: { adventureId: "test-adventure-change-1" },
      }
    );

    // Wait for initial load with correct title
    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.adventure).not.toBeNull();
        expect(result.current.adventure?.metadata.title).toBe("Adventure 1");
      },
      { timeout: 5000 }
    );

    // Clear cache completely before changing adventures
    invalidateAdventureCache();

    // Change adventureId
    rerender({ adventureId: "test-adventure-change-2" });

    // Should start loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    // Wait for new adventure to load with correct title
    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.adventure?.metadata.title).toBe("Adventure 2");
      },
      { timeout: 3000 }
    );
  });
});
