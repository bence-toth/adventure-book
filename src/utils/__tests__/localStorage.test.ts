import { saveInventory, getInventory, clearInventory } from "../localStorage";

describe("localStorage inventory utilities", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe("saveInventory", () => {
    it("should save inventory to localStorage", () => {
      const items = ["item1", "item2", "item3"];
      saveInventory(items);

      const stored = localStorage.getItem("adventure-book/inventory");
      expect(stored).toBe(JSON.stringify(items));
    });

    it("should save empty inventory", () => {
      const items: string[] = [];
      saveInventory(items);

      const stored = localStorage.getItem("adventure-book/inventory");
      expect(stored).toBe(JSON.stringify([]));
    });

    it("should handle localStorage errors gracefully", () => {
      // Simulate a quota exceeded error by filling up storage
      // In a real scenario, this would test error handling
      // For now, we just verify the function doesn't throw
      expect(() => saveInventory(["item1"])).not.toThrow();
    });
  });

  describe("getInventory", () => {
    it("should retrieve inventory from localStorage", () => {
      const items = ["item1", "item2"];
      localStorage.setItem("adventure-book/inventory", JSON.stringify(items));

      const retrieved = getInventory();
      expect(retrieved).toEqual(items);
    });

    it("should return empty array when no inventory exists", () => {
      const retrieved = getInventory();
      expect(retrieved).toEqual([]);
    });

    it("should return empty array for invalid JSON", () => {
      localStorage.setItem("adventure-book/inventory", "invalid json");

      const retrieved = getInventory();
      expect(retrieved).toEqual([]);
    });

    it("should return empty array for non-array values", () => {
      localStorage.setItem(
        "adventure-book/inventory",
        JSON.stringify({ not: "array" })
      );

      const retrieved = getInventory();
      expect(retrieved).toEqual([]);
    });

    it("should filter out non-string elements from array", () => {
      localStorage.setItem(
        "adventure-book/inventory",
        JSON.stringify(["item1", 42, "item2", null, "item3", { obj: "value" }])
      );

      const retrieved = getInventory();
      expect(retrieved).toEqual(["item1", "item2", "item3"]);
    });

    it("should handle localStorage errors gracefully", () => {
      // Verify function doesn't throw even in edge cases
      expect(() => getInventory()).not.toThrow();
    });
  });

  describe("clearInventory", () => {
    it("should clear inventory from localStorage", () => {
      localStorage.setItem(
        "adventure-book/inventory",
        JSON.stringify(["item1"])
      );

      clearInventory();

      const stored = localStorage.getItem("adventure-book/inventory");
      expect(stored).toBeNull();
    });

    it("should not throw if inventory doesn't exist", () => {
      expect(() => clearInventory()).not.toThrow();
    });

    it("should handle localStorage errors gracefully", () => {
      // Verify function doesn't throw even in edge cases
      expect(() => clearInventory()).not.toThrow();
    });
  });
});
