import {
  saveInventory,
  getInventory,
  clearInventory,
  saveCurrentPassageId,
  getCurrentPassageId,
  clearCurrentPassageId,
} from "../localStorage";

describe("localStorage utilities", () => {
  const testAdventureId = "test-adventure-id";
  const anotherAdventureId = "another-adventure-id";

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe("saveInventory", () => {
    it("should save inventory to localStorage for a specific adventure", () => {
      const items = ["item1", "item2", "item3"];
      saveInventory(testAdventureId, items);

      const stored = localStorage.getItem("adventure-book/progress");
      const data = JSON.parse(stored!);
      expect(data[testAdventureId].inventory).toEqual(items);
    });

    it("should save empty inventory", () => {
      const items: string[] = [];
      saveInventory(testAdventureId, items);

      const stored = localStorage.getItem("adventure-book/progress");
      const data = JSON.parse(stored!);
      expect(data[testAdventureId].inventory).toEqual([]);
    });

    it("should not affect other stories", () => {
      saveInventory(testAdventureId, ["item1"]);
      saveInventory(anotherAdventureId, ["item2"]);

      expect(getInventory(testAdventureId)).toEqual(["item1"]);
      expect(getInventory(anotherAdventureId)).toEqual(["item2"]);
    });

    it("should handle localStorage errors gracefully", () => {
      expect(() => saveInventory(testAdventureId, ["item1"])).not.toThrow();
    });
  });

  describe("getInventory", () => {
    it("should retrieve inventory from localStorage for a specific adventure", () => {
      const items = ["item1", "item2"];
      saveInventory(testAdventureId, items);

      const retrieved = getInventory(testAdventureId);
      expect(retrieved).toEqual(items);
    });

    it("should return empty array when no inventory exists for the adventure", () => {
      const retrieved = getInventory(testAdventureId);
      expect(retrieved).toEqual([]);
    });

    it("should return empty array for invalid JSON", () => {
      localStorage.setItem("adventure-book/progress", "invalid json");

      const retrieved = getInventory(testAdventureId);
      expect(retrieved).toEqual([]);
    });

    it("should filter out non-string elements from array", () => {
      const data = {
        [testAdventureId]: {
          passageId: null,
          inventory: ["item1", 42, "item2", null, "item3", { obj: "value" }],
        },
      };
      localStorage.setItem("adventure-book/progress", JSON.stringify(data));

      const retrieved = getInventory(testAdventureId);
      expect(retrieved).toEqual(["item1", "item2", "item3"]);
    });

    it("should handle localStorage errors gracefully", () => {
      expect(() => getInventory(testAdventureId)).not.toThrow();
    });
  });

  describe("clearInventory", () => {
    it("should clear inventory from localStorage for a specific adventure", () => {
      saveInventory(testAdventureId, ["item1"]);

      clearInventory(testAdventureId);

      const inventory = getInventory(testAdventureId);
      expect(inventory).toEqual([]);
    });

    it("should not affect other stories when clearing", () => {
      saveInventory(testAdventureId, ["item1"]);
      saveInventory(anotherAdventureId, ["item2"]);

      clearInventory(testAdventureId);

      expect(getInventory(testAdventureId)).toEqual([]);
      expect(getInventory(anotherAdventureId)).toEqual(["item2"]);
    });

    it("should not throw if inventory doesn't exist", () => {
      expect(() => clearInventory(testAdventureId)).not.toThrow();
    });

    it("should handle localStorage errors gracefully", () => {
      expect(() => clearInventory(testAdventureId)).not.toThrow();
    });
  });

  describe("saveCurrentPassageId", () => {
    it("should save passage ID to localStorage for a specific adventure", () => {
      saveCurrentPassageId(testAdventureId, 5);

      const stored = localStorage.getItem("adventure-book/progress");
      const data = JSON.parse(stored!);
      expect(data[testAdventureId].passageId).toBe(5);
    });

    it("should not affect other stories", () => {
      saveCurrentPassageId(testAdventureId, 5);
      saveCurrentPassageId(anotherAdventureId, 10);

      expect(getCurrentPassageId(testAdventureId)).toBe(5);
      expect(getCurrentPassageId(anotherAdventureId)).toBe(10);
    });

    it("should preserve existing inventory when saving passage ID", () => {
      saveInventory(testAdventureId, ["item1"]);
      saveCurrentPassageId(testAdventureId, 5);

      expect(getInventory(testAdventureId)).toEqual(["item1"]);
      expect(getCurrentPassageId(testAdventureId)).toBe(5);
    });

    it("should handle localStorage errors gracefully", () => {
      expect(() => saveCurrentPassageId(testAdventureId, 5)).not.toThrow();
    });
  });

  describe("getCurrentPassageId", () => {
    it("should retrieve passage ID from localStorage for a specific adventure", () => {
      saveCurrentPassageId(testAdventureId, 7);

      const retrieved = getCurrentPassageId(testAdventureId);
      expect(retrieved).toBe(7);
    });

    it("should return null when no passage ID exists for the adventure", () => {
      const retrieved = getCurrentPassageId(testAdventureId);
      expect(retrieved).toBeNull();
    });

    it("should return null for invalid JSON", () => {
      localStorage.setItem("adventure-book/progress", "invalid json");

      const retrieved = getCurrentPassageId(testAdventureId);
      expect(retrieved).toBeNull();
    });

    it("should handle localStorage errors gracefully", () => {
      expect(() => getCurrentPassageId(testAdventureId)).not.toThrow();
    });
  });

  describe("clearCurrentPassageId", () => {
    it("should clear passage ID from localStorage for a specific adventure", () => {
      saveCurrentPassageId(testAdventureId, 5);

      clearCurrentPassageId(testAdventureId);

      const passageId = getCurrentPassageId(testAdventureId);
      expect(passageId).toBeNull();
    });

    it("should not affect other stories when clearing", () => {
      saveCurrentPassageId(testAdventureId, 5);
      saveCurrentPassageId(anotherAdventureId, 10);

      clearCurrentPassageId(testAdventureId);

      expect(getCurrentPassageId(testAdventureId)).toBeNull();
      expect(getCurrentPassageId(anotherAdventureId)).toBe(10);
    });

    it("should preserve inventory when clearing passage ID", () => {
      saveInventory(testAdventureId, ["item1"]);
      saveCurrentPassageId(testAdventureId, 5);

      clearCurrentPassageId(testAdventureId);

      expect(getInventory(testAdventureId)).toEqual(["item1"]);
      expect(getCurrentPassageId(testAdventureId)).toBeNull();
    });

    it("should not throw if passage ID doesn't exist", () => {
      expect(() => clearCurrentPassageId(testAdventureId)).not.toThrow();
    });

    it("should handle localStorage errors gracefully", () => {
      expect(() => clearCurrentPassageId(testAdventureId)).not.toThrow();
    });
  });

  describe("error handling with mock failures", () => {
    it("should handle JSON.parse errors for invalid data", () => {
      localStorage.setItem("adventure-book/progress", "not valid json {");

      expect(() => getInventory(testAdventureId)).not.toThrow();
      expect(getInventory(testAdventureId)).toEqual([]);

      expect(() => getCurrentPassageId(testAdventureId)).not.toThrow();
      expect(getCurrentPassageId(testAdventureId)).toBeNull();
    });

    it("should handle non-object data in localStorage", () => {
      localStorage.setItem("adventure-book/progress", "null");

      expect(getInventory(testAdventureId)).toEqual([]);
      expect(getCurrentPassageId(testAdventureId)).toBeNull();

      localStorage.setItem("adventure-book/progress", "42");

      expect(getInventory(testAdventureId)).toEqual([]);
      expect(getCurrentPassageId(testAdventureId)).toBeNull();

      localStorage.setItem("adventure-book/progress", '"string value"');

      expect(getInventory(testAdventureId)).toEqual([]);
      expect(getCurrentPassageId(testAdventureId)).toBeNull();
    });

    it("should handle corrupted adventure data structure", () => {
      // Missing inventory array
      localStorage.setItem(
        "adventure-book/progress",
        JSON.stringify({
          [testAdventureId]: {
            passageId: 5,
            // inventory field missing
          },
        })
      );

      expect(getInventory(testAdventureId)).toEqual([]);
      expect(getCurrentPassageId(testAdventureId)).toBe(5);

      // Inventory is not an array
      localStorage.setItem(
        "adventure-book/progress",
        JSON.stringify({
          [testAdventureId]: {
            passageId: 5,
            inventory: "not an array",
          },
        })
      );

      expect(getInventory(testAdventureId)).toEqual([]);
    });

    it("should handle localStorage.setItem errors in saveProgressData", () => {
      const originalWarn = vi.fn();
      vi.spyOn(console, "warn").mockImplementation(originalWarn);

      // Mock setItem directly on the localStorage instance (not prototype)
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error("QuotaExceededError");
      });

      // This should catch the error and log a warning
      saveInventory(testAdventureId, ["item1"]);

      // Restore
      localStorage.setItem = originalSetItem;

      // Verify the error was handled
      expect(originalWarn).toHaveBeenCalledWith(
        "Failed to save progress data to localStorage:",
        expect.any(Error)
      );

      vi.restoreAllMocks();
    });
  });
});
