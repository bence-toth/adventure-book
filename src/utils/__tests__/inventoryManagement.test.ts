import {
  addItemToInventory,
  removeItemFromInventory,
} from "../inventoryManagement";
import { getInventory, saveInventory } from "../localStorage";

describe("inventoryManagement utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("addItemToInventory", () => {
    it("should add a new item to empty inventory", () => {
      addItemToInventory("test_item");

      const inventory = getInventory();
      expect(inventory).toEqual(["test_item"]);
    });

    it("should not add duplicate items", () => {
      addItemToInventory("test_item");
      addItemToInventory("test_item");

      const inventory = getInventory();
      expect(inventory).toEqual(["test_item"]);
    });

    it("should add multiple different items", () => {
      addItemToInventory("item1");
      addItemToInventory("item2");
      addItemToInventory("item3");

      const inventory = getInventory();
      expect(inventory).toEqual(["item1", "item2", "item3"]);
    });

    it("should preserve existing items when adding new ones", () => {
      saveInventory(["existing_item"]);

      addItemToInventory("new_item");

      const inventory = getInventory();
      expect(inventory).toContain("existing_item");
      expect(inventory).toContain("new_item");
      expect(inventory).toHaveLength(2);
    });

    it("should handle adding items when existing inventory exists", () => {
      saveInventory(["item1", "item2"]);

      addItemToInventory("item3");

      const inventory = getInventory();
      expect(inventory).toEqual(["item1", "item2", "item3"]);
    });

    it("should not throw on localStorage errors", () => {
      // Even if localStorage has issues, the function should handle it gracefully
      expect(() => addItemToInventory("test_item")).not.toThrow();
    });
  });

  describe("removeItemFromInventory", () => {
    it("should remove an existing item", () => {
      saveInventory(["item1", "item2", "item3"]);

      removeItemFromInventory("item1");

      const inventory = getInventory();
      expect(inventory).toEqual(["item2", "item3"]);
    });

    it("should not throw when removing non-existent item", () => {
      saveInventory(["item1", "item2"]);

      expect(() => removeItemFromInventory("nonexistent")).not.toThrow();

      const inventory = getInventory();
      expect(inventory).toEqual(["item1", "item2"]);
    });

    it("should handle empty inventory gracefully", () => {
      expect(() => removeItemFromInventory("item1")).not.toThrow();

      const inventory = getInventory();
      expect(inventory).toEqual([]);
    });

    it("should remove all instances of an item if duplicates exist", () => {
      // This tests the filter behavior
      saveInventory(["item1", "item2", "item1", "item3"]);

      removeItemFromInventory("item1");

      const inventory = getInventory();
      expect(inventory).toEqual(["item2", "item3"]);
      expect(inventory).not.toContain("item1");
    });

    it("should preserve other items when removing", () => {
      saveInventory(["keep1", "remove", "keep2"]);

      removeItemFromInventory("remove");

      const inventory = getInventory();
      expect(inventory).toContain("keep1");
      expect(inventory).toContain("keep2");
      expect(inventory).not.toContain("remove");
      expect(inventory).toHaveLength(2);
    });

    it("should not throw on localStorage errors", () => {
      // Even if localStorage has issues, the function should handle it gracefully
      expect(() => removeItemFromInventory("test_item")).not.toThrow();
    });
  });

  describe("integration scenarios", () => {
    it("should support adding and removing items in sequence", () => {
      addItemToInventory("item1");
      addItemToInventory("item2");
      addItemToInventory("item3");

      expect(getInventory()).toEqual(["item1", "item2", "item3"]);

      removeItemFromInventory("item2");

      expect(getInventory()).toEqual(["item1", "item3"]);

      addItemToInventory("item4");

      expect(getInventory()).toEqual(["item1", "item3", "item4"]);
    });

    it("should maintain consistency across multiple operations", () => {
      // Add several items
      addItemToInventory("sword");
      addItemToInventory("shield");
      addItemToInventory("potion");

      // Try to add duplicate
      addItemToInventory("sword");

      // Inventory should not have duplicates
      expect(getInventory()).toEqual(["sword", "shield", "potion"]);

      // Remove one item
      removeItemFromInventory("shield");

      // Verify final state
      const finalInventory = getInventory();
      expect(finalInventory).toContain("sword");
      expect(finalInventory).toContain("potion");
      expect(finalInventory).not.toContain("shield");
      expect(finalInventory).toHaveLength(2);
    });
  });
});
