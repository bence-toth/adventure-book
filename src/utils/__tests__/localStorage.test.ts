import {
  saveInventory,
  getInventory,
  clearInventory,
  saveCurrentPassageId,
  getCurrentPassageId,
  clearCurrentPassageId,
} from "../localStorage";

describe("localStorage utilities", () => {
  const testStoryId = "test-story-id";
  const anotherStoryId = "another-story-id";

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe("saveInventory", () => {
    it("should save inventory to localStorage for a specific story", () => {
      const items = ["item1", "item2", "item3"];
      saveInventory(testStoryId, items);

      const stored = localStorage.getItem("adventure-book/progress");
      const data = JSON.parse(stored!);
      expect(data[testStoryId].inventory).toEqual(items);
    });

    it("should save empty inventory", () => {
      const items: string[] = [];
      saveInventory(testStoryId, items);

      const stored = localStorage.getItem("adventure-book/progress");
      const data = JSON.parse(stored!);
      expect(data[testStoryId].inventory).toEqual([]);
    });

    it("should not affect other stories", () => {
      saveInventory(testStoryId, ["item1"]);
      saveInventory(anotherStoryId, ["item2"]);

      expect(getInventory(testStoryId)).toEqual(["item1"]);
      expect(getInventory(anotherStoryId)).toEqual(["item2"]);
    });

    it("should handle localStorage errors gracefully", () => {
      expect(() => saveInventory(testStoryId, ["item1"])).not.toThrow();
    });
  });

  describe("getInventory", () => {
    it("should retrieve inventory from localStorage for a specific story", () => {
      const items = ["item1", "item2"];
      saveInventory(testStoryId, items);

      const retrieved = getInventory(testStoryId);
      expect(retrieved).toEqual(items);
    });

    it("should return empty array when no inventory exists for the story", () => {
      const retrieved = getInventory(testStoryId);
      expect(retrieved).toEqual([]);
    });

    it("should return empty array for invalid JSON", () => {
      localStorage.setItem("adventure-book/progress", "invalid json");

      const retrieved = getInventory(testStoryId);
      expect(retrieved).toEqual([]);
    });

    it("should filter out non-string elements from array", () => {
      const data = {
        [testStoryId]: {
          passageId: null,
          inventory: ["item1", 42, "item2", null, "item3", { obj: "value" }],
        },
      };
      localStorage.setItem("adventure-book/progress", JSON.stringify(data));

      const retrieved = getInventory(testStoryId);
      expect(retrieved).toEqual(["item1", "item2", "item3"]);
    });

    it("should handle localStorage errors gracefully", () => {
      expect(() => getInventory(testStoryId)).not.toThrow();
    });
  });

  describe("clearInventory", () => {
    it("should clear inventory from localStorage for a specific story", () => {
      saveInventory(testStoryId, ["item1"]);

      clearInventory(testStoryId);

      const inventory = getInventory(testStoryId);
      expect(inventory).toEqual([]);
    });

    it("should not affect other stories when clearing", () => {
      saveInventory(testStoryId, ["item1"]);
      saveInventory(anotherStoryId, ["item2"]);

      clearInventory(testStoryId);

      expect(getInventory(testStoryId)).toEqual([]);
      expect(getInventory(anotherStoryId)).toEqual(["item2"]);
    });

    it("should not throw if inventory doesn't exist", () => {
      expect(() => clearInventory(testStoryId)).not.toThrow();
    });

    it("should handle localStorage errors gracefully", () => {
      expect(() => clearInventory(testStoryId)).not.toThrow();
    });
  });

  describe("saveCurrentPassageId", () => {
    it("should save passage ID to localStorage for a specific story", () => {
      saveCurrentPassageId(testStoryId, 5);

      const stored = localStorage.getItem("adventure-book/progress");
      const data = JSON.parse(stored!);
      expect(data[testStoryId].passageId).toBe(5);
    });

    it("should not affect other stories", () => {
      saveCurrentPassageId(testStoryId, 5);
      saveCurrentPassageId(anotherStoryId, 10);

      expect(getCurrentPassageId(testStoryId)).toBe(5);
      expect(getCurrentPassageId(anotherStoryId)).toBe(10);
    });

    it("should preserve existing inventory when saving passage ID", () => {
      saveInventory(testStoryId, ["item1"]);
      saveCurrentPassageId(testStoryId, 5);

      expect(getInventory(testStoryId)).toEqual(["item1"]);
      expect(getCurrentPassageId(testStoryId)).toBe(5);
    });

    it("should handle localStorage errors gracefully", () => {
      expect(() => saveCurrentPassageId(testStoryId, 5)).not.toThrow();
    });
  });

  describe("getCurrentPassageId", () => {
    it("should retrieve passage ID from localStorage for a specific story", () => {
      saveCurrentPassageId(testStoryId, 7);

      const retrieved = getCurrentPassageId(testStoryId);
      expect(retrieved).toBe(7);
    });

    it("should return null when no passage ID exists for the story", () => {
      const retrieved = getCurrentPassageId(testStoryId);
      expect(retrieved).toBeNull();
    });

    it("should return null for invalid JSON", () => {
      localStorage.setItem("adventure-book/progress", "invalid json");

      const retrieved = getCurrentPassageId(testStoryId);
      expect(retrieved).toBeNull();
    });

    it("should handle localStorage errors gracefully", () => {
      expect(() => getCurrentPassageId(testStoryId)).not.toThrow();
    });
  });

  describe("clearCurrentPassageId", () => {
    it("should clear passage ID from localStorage for a specific story", () => {
      saveCurrentPassageId(testStoryId, 5);

      clearCurrentPassageId(testStoryId);

      const passageId = getCurrentPassageId(testStoryId);
      expect(passageId).toBeNull();
    });

    it("should not affect other stories when clearing", () => {
      saveCurrentPassageId(testStoryId, 5);
      saveCurrentPassageId(anotherStoryId, 10);

      clearCurrentPassageId(testStoryId);

      expect(getCurrentPassageId(testStoryId)).toBeNull();
      expect(getCurrentPassageId(anotherStoryId)).toBe(10);
    });

    it("should preserve inventory when clearing passage ID", () => {
      saveInventory(testStoryId, ["item1"]);
      saveCurrentPassageId(testStoryId, 5);

      clearCurrentPassageId(testStoryId);

      expect(getInventory(testStoryId)).toEqual(["item1"]);
      expect(getCurrentPassageId(testStoryId)).toBeNull();
    });

    it("should not throw if passage ID doesn't exist", () => {
      expect(() => clearCurrentPassageId(testStoryId)).not.toThrow();
    });

    it("should handle localStorage errors gracefully", () => {
      expect(() => clearCurrentPassageId(testStoryId)).not.toThrow();
    });
  });
});
