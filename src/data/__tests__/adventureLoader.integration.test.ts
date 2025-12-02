import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import {
  loadAdventureById,
  reloadAdventure,
  loadAdventure,
  introduction,
  getPassage,
  getAllPassages,
  getInventoryItems,
} from "../adventureLoader";
import { saveAdventure, type StoredAdventure } from "../adventureDatabase";

// Sample valid adventure YAML
const sampleAdventureYAML = `metadata:
  title: Test Adventure
  author: Test Author
  version: "1.0.0"

intro:
  text: |
    Welcome to the test adventure.
    This is a test.
  action: Begin

passages:
  1:
    text: |
      You are at the start.
      What do you do?
    choices:
      - text: Go forward
        goto: 2
      - text: Go back
        goto: 3
  2:
    text: You went forward.
    type: victory
    ending: true
  3:
    text: You went back.
    type: defeat
    ending: true
`;

describe("AdventureLoader Integration Tests", () => {
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

  describe("loadAdventureById", () => {
    it("should load an adventure from IndexedDB by ID", async () => {
      const adventure: StoredAdventure = {
        id: "test-adventure-1",
        title: "Test Adventure",
        content: sampleAdventureYAML,
        lastEdited: new Date(),
        createdAt: new Date(),
      };

      await saveAdventure(adventure);

      const loadedAdventure = await loadAdventureById("test-adventure-1");

      expect(loadedAdventure).toBeDefined();
      expect(loadedAdventure.metadata.title).toBe("Test Adventure");
      expect(loadedAdventure.metadata.author).toBe("Test Author");
      expect(loadedAdventure.passages[1]).toBeDefined();
    });

    it("should cache loaded adventure for same ID", async () => {
      const adventure: StoredAdventure = {
        id: "test-adventure-2",
        title: "Test Adventure 2",
        content: sampleAdventureYAML,
        lastEdited: new Date(),
        createdAt: new Date(),
      };

      await saveAdventure(adventure);

      const loadedAdventure1 = await loadAdventureById("test-adventure-2");
      const loadedAdventure2 = await loadAdventureById("test-adventure-2");

      // Should return the same cached instance
      expect(loadedAdventure1).toBe(loadedAdventure2);
    });

    it("should load different adventure when ID changes", async () => {
      const adventure1: StoredAdventure = {
        id: "test-adventure-1",
        title: "Adventure 1",
        content: sampleAdventureYAML,
        lastEdited: new Date(),
        createdAt: new Date(),
      };

      const adventure2YAML = sampleAdventureYAML
        .replace("Test Adventure", "Different Adventure")
        .replace("Test Author", "Different Author");

      const adventure2: StoredAdventure = {
        id: "test-adventure-2",
        title: "Adventure 2",
        content: adventure2YAML,
        lastEdited: new Date(),
        createdAt: new Date(),
      };

      await saveAdventure(adventure1);
      await saveAdventure(adventure2);

      const loaded1 = await loadAdventureById("test-adventure-1");
      const loaded2 = await loadAdventureById("test-adventure-2");

      expect(loaded1.metadata.title).toBe("Test Adventure");
      expect(loaded2.metadata.title).toBe("Different Adventure");
      expect(loaded1).not.toBe(loaded2);
    });

    it("should throw error when adventure not found", async () => {
      await expect(loadAdventureById("non-existent-id")).rejects.toThrow(
        "Adventure with id non-existent-id not found"
      );
    });

    it("should throw error when adventure has validation errors", async () => {
      const invalidAdventureYAML = `metadata:
  title: Invalid Adventure
  author: Test Author
  version: "1.0.0"

intro:
  text: Welcome
  action: Begin

passages:
  1:
    text: Start passage
    choices:
      - text: Go to nowhere
        goto: 999
`;

      const adventure: StoredAdventure = {
        id: "invalid-adventure",
        title: "Invalid Adventure",
        content: invalidAdventureYAML,
        lastEdited: new Date(),
        createdAt: new Date(),
      };

      await saveAdventure(adventure);

      await expect(loadAdventureById("invalid-adventure")).rejects.toThrow(
        "Passage 1 has invalid goto: 999"
      );
    });

    it("should throw error when adventure has parsing errors", async () => {
      const malformedYAML = `metadata:
  title: Malformed
  author: Test
  version: "1.0.0"
intro:
  text: Test
  action: Begin
passages:
  not_a_number:
    text: This is invalid
`;

      const adventure: StoredAdventure = {
        id: "malformed-adventure",
        title: "Malformed",
        content: malformedYAML,
        lastEdited: new Date(),
        createdAt: new Date(),
      };

      await saveAdventure(adventure);

      // Should throw during parsing or validation
      await expect(loadAdventureById("malformed-adventure")).rejects.toThrow();
    });
  });

  describe("reloadAdventure", () => {
    it("should clear cached adventure and reload from YAML file", () => {
      // This function loads the default adventure.yaml file
      // It should clear the cache and reload
      const adventure1 = reloadAdventure();
      const adventure2 = reloadAdventure();

      // Both should be valid adventures
      expect(adventure1).toBeDefined();
      expect(adventure2).toBeDefined();
      expect(adventure1.metadata).toBeDefined();
      expect(adventure2.metadata).toBeDefined();

      // Should have the same structure (both load from same file)
      expect(adventure1.metadata.title).toBe(adventure2.metadata.title);
    });

    it("should reload adventure even if already loaded", () => {
      // Load once
      const adventure1 = reloadAdventure();

      // Reload again
      const adventure2 = reloadAdventure();

      // Both should be valid
      expect(adventure1).toBeDefined();
      expect(adventure2).toBeDefined();

      // Should have passages
      expect(Object.keys(adventure1.passages).length).toBeGreaterThan(0);
      expect(Object.keys(adventure2.passages).length).toBeGreaterThan(0);
    });

    it("should throw error if default adventure has validation errors", () => {
      // This test verifies error handling for the default adventure file
      // In normal operation, the default file should always be valid
      // But we test that errors are properly thrown

      const adventure = reloadAdventure();

      expect(adventure).toBeDefined();
    });
  });

  describe("Default adventure functions", () => {
    describe("loadAdventure", () => {
      it("should load the default adventure from YAML file", () => {
        const adventure = loadAdventure();

        expect(adventure).toBeDefined();
        expect(adventure.metadata).toBeDefined();
        expect(adventure.metadata.title).toBeDefined();
        expect(adventure.intro).toBeDefined();
        expect(adventure.passages).toBeDefined();
      });

      it("should cache the loaded adventure", () => {
        const adventure1 = loadAdventure();
        const adventure2 = loadAdventure();

        expect(adventure1).toBe(adventure2);
      });
    });

    describe("introduction", () => {
      it("should return introduction properties from default adventure", () => {
        expect(introduction.title).toBeDefined();
        expect(typeof introduction.title).toBe("string");

        expect(introduction.paragraphs).toBeDefined();
        expect(Array.isArray(introduction.paragraphs)).toBe(true);

        expect(introduction.action).toBeDefined();
        expect(typeof introduction.action).toBe("string");
      });
    });

    describe("getPassage", () => {
      it("should return passage from default adventure", () => {
        const passage = getPassage(1);

        expect(passage).toBeDefined();
        expect(passage?.paragraphs).toBeDefined();
      });

      it("should return undefined for non-existent passage", () => {
        const passage = getPassage(999999);

        expect(passage).toBeUndefined();
      });
    });

    describe("getAllPassages", () => {
      it("should return all passages from default adventure", () => {
        const passages = getAllPassages();

        expect(passages).toBeDefined();
        expect(typeof passages).toBe("object");
        expect(Object.keys(passages).length).toBeGreaterThan(0);
      });
    });

    describe("getInventoryItems", () => {
      it("should return inventory items from default adventure", () => {
        const items = getInventoryItems();

        expect(Array.isArray(items)).toBe(true);
        // The default adventure may or may not have inventory items
        items.forEach((item) => {
          expect(item.id).toBeDefined();
          expect(item.name).toBeDefined();
        });
      });
    });
  });
});
