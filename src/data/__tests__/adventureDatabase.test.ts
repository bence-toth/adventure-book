import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import {
  saveAdventure,
  getAdventure,
  listStories,
  deleteAdventure,
  updateAdventureContent,
  updateAdventureTitle,
  createAdventure,
  type StoredAdventure,
} from "../adventureDatabase";

describe("adventureDatabase", () => {
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

  describe("saveAdventure", () => {
    it("should save an adventure to IndexedDB", async () => {
      const adventure: StoredAdventure = {
        id: "test-1",
        title: "Test Adventure",
        content: "metadata:\n  title: Test",
        lastEdited: new Date(),
        createdAt: new Date(),
      };

      await saveAdventure(adventure);

      const result = await getAdventure("test-1");
      expect(result).toBeDefined();
      expect(result?.id).toBe("test-1");
      expect(result?.title).toBe("Test Adventure");
    });

    it("should update an existing adventure", async () => {
      const adventure: StoredAdventure = {
        id: "test-1",
        title: "Test Adventure",
        content: "old content",
        lastEdited: new Date(),
        createdAt: new Date(),
      };

      await saveAdventure(adventure);

      const updatedAdventure: StoredAdventure = {
        ...adventure,
        content: "new content",
      };

      await saveAdventure(updatedAdventure);

      const result = await getAdventure("test-1");
      expect(result?.content).toBe("new content");
    });
  });

  describe("getAdventure", () => {
    it("should retrieve an adventure by ID", async () => {
      const adventure: StoredAdventure = {
        id: "test-1",
        title: "Test Adventure",
        content: "metadata:\n  title: Test",
        lastEdited: new Date(),
        createdAt: new Date(),
      };

      await saveAdventure(adventure);

      const result = await getAdventure("test-1");

      expect(result).toBeDefined();
      expect(result?.id).toBe("test-1");
      expect(result?.title).toBe("Test Adventure");
      expect(result?.content).toBe("metadata:\n  title: Test");
    });

    it("should return undefined for non-existent adventure", async () => {
      const result = await getAdventure("non-existent");
      expect(result).toBeUndefined();
    });
  });

  describe("listStories", () => {
    it("should return all stories sorted by lastEdited", async () => {
      const now = new Date();
      const earlier = new Date(now.getTime() - 1000);

      const adventure1: StoredAdventure = {
        id: "test-1",
        title: "First Adventure",
        content: "content1",
        lastEdited: earlier,
        createdAt: earlier,
      };

      const adventure2: StoredAdventure = {
        id: "test-2",
        title: "Second Adventure",
        content: "content2",
        lastEdited: now,
        createdAt: now,
      };

      await saveAdventure(adventure1);
      await saveAdventure(adventure2);

      const stories = await listStories();

      expect(Array.isArray(stories)).toBe(true);
      expect(stories.length).toBe(2);

      // Should be sorted with most recent first
      expect(new Date(stories[0].lastEdited).getTime()).toBeGreaterThanOrEqual(
        new Date(stories[1].lastEdited).getTime()
      );
    });

    it("should return empty array when no stories exist", async () => {
      const stories = await listStories();
      expect(Array.isArray(stories)).toBe(true);
      expect(stories.length).toBe(0);
    });

    it("should handle multiple stories correctly", async () => {
      const adventures = Array.from({ length: 5 }, (_, i) => ({
        id: `test-${i}`,
        title: `Adventure ${i}`,
        content: `content ${i}`,
        lastEdited: new Date(Date.now() - i * 1000),
        createdAt: new Date(Date.now() - i * 1000),
      }));

      for (const adventure of adventures) {
        await saveAdventure(adventure);
      }

      const stories = await listStories();

      expect(stories.length).toBe(5);
      // Verify sorting
      for (let i = 0; i < stories.length - 1; i++) {
        expect(
          new Date(stories[i].lastEdited).getTime()
        ).toBeGreaterThanOrEqual(new Date(stories[i + 1].lastEdited).getTime());
      }
    });
  });

  describe("deleteAdventure", () => {
    it("should delete an adventure by ID", async () => {
      const adventure: StoredAdventure = {
        id: "test-1",
        title: "Test Adventure",
        content: "content",
        lastEdited: new Date(),
        createdAt: new Date(),
      };

      await saveAdventure(adventure);

      let result = await getAdventure("test-1");
      expect(result).toBeDefined();

      await deleteAdventure("test-1");

      result = await getAdventure("test-1");
      expect(result).toBeUndefined();
    });

    it("should not throw when deleting non-existent adventure", async () => {
      await expect(deleteAdventure("non-existent")).resolves.not.toThrow();
    });
  });

  describe("updateAdventureContent", () => {
    it("should update adventure content and lastEdited", async () => {
      const adventure: StoredAdventure = {
        id: "test-1",
        title: "Test Adventure",
        content: "old content",
        lastEdited: new Date(Date.now() - 1000),
        createdAt: new Date(),
      };

      await saveAdventure(adventure);

      const newContent = "new content";
      const beforeUpdate = Date.now();
      await updateAdventureContent("test-1", newContent);
      const afterUpdate = Date.now();

      const result = await getAdventure("test-1");
      expect(result?.content).toBe(newContent);
      expect(result?.title).toBe("Test Adventure"); // Title unchanged

      const lastEditedTime = new Date(result!.lastEdited).getTime();
      expect(lastEditedTime).toBeGreaterThanOrEqual(beforeUpdate);
      expect(lastEditedTime).toBeLessThanOrEqual(afterUpdate);
    });

    it("should throw error when adventure not found", async () => {
      await expect(
        updateAdventureContent("non-existent", "new content")
      ).rejects.toThrow("Adventure with id non-existent not found");
    });
  });

  describe("updateAdventureTitle", () => {
    it("should update adventure title and lastEdited", async () => {
      const adventure: StoredAdventure = {
        id: "test-1",
        title: "Old Title",
        content: "content",
        lastEdited: new Date(Date.now() - 1000),
        createdAt: new Date(),
      };

      await saveAdventure(adventure);

      const newTitle = "New Title";
      const beforeUpdate = Date.now();
      await updateAdventureTitle("test-1", newTitle);
      const afterUpdate = Date.now();

      const result = await getAdventure("test-1");
      expect(result?.title).toBe(newTitle);
      expect(result?.content).toBe("content"); // Content unchanged

      const lastEditedTime = new Date(result!.lastEdited).getTime();
      expect(lastEditedTime).toBeGreaterThanOrEqual(beforeUpdate);
      expect(lastEditedTime).toBeLessThanOrEqual(afterUpdate);
    });

    it("should throw error when adventure not found", async () => {
      await expect(
        updateAdventureTitle("non-existent", "New Title")
      ).rejects.toThrow("Adventure with id non-existent not found");
    });
  });

  describe("createAdventure", () => {
    it("should create a new adventure with unique ID", async () => {
      const title = "New Adventure";
      const content = "metadata:\n  title: New";

      const id = await createAdventure(title, content);

      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);

      const result = await getAdventure(id);
      expect(result).toBeDefined();
      expect(result?.title).toBe(title);
      expect(result?.content).toBe(content);
    });

    it("should set createdAt and lastEdited to same time", async () => {
      const title = "New Adventure";
      const content = "metadata:\n  title: New";

      const beforeCreate = Date.now();
      const id = await createAdventure(title, content);
      const afterCreate = Date.now();

      const result = await getAdventure(id);

      expect(result).toBeDefined();

      const createdTime = new Date(result!.createdAt).getTime();
      const editedTime = new Date(result!.lastEdited).getTime();

      expect(createdTime).toBe(editedTime);
      expect(createdTime).toBeGreaterThanOrEqual(beforeCreate);
      expect(createdTime).toBeLessThanOrEqual(afterCreate);
    });

    it("should create multiple adventures with different IDs", async () => {
      const id1 = await createAdventure("Adventure 1", "content1");
      const id2 = await createAdventure("Adventure 2", "content2");

      expect(id1).not.toBe(id2);

      const result1 = await getAdventure(id1);
      const result2 = await getAdventure(id2);

      expect(result1?.title).toBe("Adventure 1");
      expect(result2?.title).toBe("Adventure 2");
    });
  });
});
