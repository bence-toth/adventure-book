import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useTestAdventureState } from "../useTestAdventureState";
import type { Adventure } from "@/data/types";

const createMockAdventure = (): Adventure => ({
  metadata: {
    title: "Test Adventure",
    author: "Test Author",
    version: "1.0.0",
  },
  intro: {
    paragraphs: ["Welcome to the test adventure"],
    action: "Start",
  },
  passages: {
    1: {
      paragraphs: ["Basic passage with no effects"],
      choices: [{ text: "Continue", goto: 2 }],
    },
    2: {
      paragraphs: ["Passage with add_item effect"],
      choices: [{ text: "Continue", goto: 3 }],
      effects: [{ type: "add_item", item: "sword" }],
    },
    3: {
      paragraphs: ["Passage with remove_item effect"],
      choices: [{ text: "Continue", goto: 4 }],
      effects: [{ type: "remove_item", item: "sword" }],
    },
    4: {
      paragraphs: ["Ending passage"],
      ending: true,
    },
    5: {
      paragraphs: ["Passage with multiple effects"],
      choices: [{ text: "Continue", goto: 1 }],
      effects: [
        { type: "add_item", item: "shield" },
        { type: "add_item", item: "helmet" },
      ],
    },
    6: {
      paragraphs: ["Passage that adds same item twice"],
      choices: [{ text: "Continue", goto: 1 }],
      effects: [
        { type: "add_item", item: "coin" },
        { type: "add_item", item: "coin" },
      ],
    },
  },
  items: [
    { id: "sword", name: "Iron Sword" },
    { id: "shield", name: "Wooden Shield" },
    { id: "helmet", name: "Leather Helmet" },
    { id: "coin", name: "Gold Coin" },
  ],
});

describe("useTestAdventureState", () => {
  let mockAdventure: Adventure;

  beforeEach(() => {
    mockAdventure = createMockAdventure();
  });

  describe("Initialization", () => {
    it("initializes with empty inventory", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: 1,
          isIntroduction: false,
        })
      );

      expect(result.current.inventory).toEqual([]);
    });

    it("initializes with empty inventory when in introduction", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: null,
          isIntroduction: true,
        })
      );

      expect(result.current.inventory).toEqual([]);
    });
  });

  describe("Inventory Reset on Route Change", () => {
    it("resets inventory when navigating from passage to introduction", () => {
      const { result, rerender } = renderHook(
        ({
          adventure,
          passageId,
          isIntroduction,
        }: {
          adventure: Adventure;
          passageId: number | null;
          isIntroduction: boolean;
        }) => useTestAdventureState({ adventure, passageId, isIntroduction }),
        {
          initialProps: {
            adventure: mockAdventure,
            passageId: 2 as number | null,
            isIntroduction: false,
          },
        }
      );

      // Wait for effect to add item
      expect(result.current.inventory).toContain("sword");

      // Navigate to introduction
      rerender({
        adventure: mockAdventure,
        passageId: null,
        isIntroduction: true,
      });

      // Inventory should be reset
      expect(result.current.inventory).toEqual([]);
    });

    it("maintains inventory when navigating between passages", () => {
      const { result, rerender } = renderHook(
        ({
          adventure,
          passageId,
          isIntroduction,
        }: {
          adventure: Adventure;
          passageId: number | null;
          isIntroduction: boolean;
        }) => useTestAdventureState({ adventure, passageId, isIntroduction }),
        {
          initialProps: {
            adventure: mockAdventure,
            passageId: 2 as number | null,
            isIntroduction: false,
          },
        }
      );

      // Wait for effect to add item
      expect(result.current.inventory).toContain("sword");

      // Navigate to another passage
      rerender({
        adventure: mockAdventure,
        passageId: 1,
        isIntroduction: false,
      });

      // Inventory should be maintained
      expect(result.current.inventory).toContain("sword");
    });

    it("does not reset inventory when passageId changes", () => {
      const { result, rerender } = renderHook(
        ({
          adventure,
          passageId,
          isIntroduction,
        }: {
          adventure: Adventure;
          passageId: number | null;
          isIntroduction: boolean;
        }) => useTestAdventureState({ adventure, passageId, isIntroduction }),
        {
          initialProps: {
            adventure: mockAdventure,
            passageId: 5 as number | null,
            isIntroduction: false,
          },
        }
      );

      // Wait for effects to add items
      expect(result.current.inventory).toContain("shield");
      expect(result.current.inventory).toContain("helmet");

      // Navigate to another passage
      rerender({
        adventure: mockAdventure,
        passageId: 1,
        isIntroduction: false,
      });

      // Inventory should still contain items
      expect(result.current.inventory).toContain("shield");
      expect(result.current.inventory).toContain("helmet");
    });
  });

  describe("Effect Processing - add_item", () => {
    it("adds item to inventory when passage has add_item effect", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: 2,
          isIntroduction: false,
        })
      );

      expect(result.current.inventory).toContain("sword");
    });

    it("does not duplicate items when add_item effect adds same item twice", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: 6,
          isIntroduction: false,
        })
      );

      // Item should only appear once
      expect(result.current.inventory).toEqual(["coin"]);
    });

    it("processes multiple add_item effects in sequence", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: 5,
          isIntroduction: false,
        })
      );

      expect(result.current.inventory).toContain("shield");
      expect(result.current.inventory).toContain("helmet");
      expect(result.current.inventory).toHaveLength(2);
    });

    it("does not add item if it already exists in inventory", () => {
      const { result, rerender } = renderHook(
        ({
          adventure,
          passageId,
          isIntroduction,
        }: {
          adventure: Adventure;
          passageId: number | null;
          isIntroduction: boolean;
        }) => useTestAdventureState({ adventure, passageId, isIntroduction }),
        {
          initialProps: {
            adventure: mockAdventure,
            passageId: 2 as number | null,
            isIntroduction: false,
          },
        }
      );

      // First visit adds the item
      expect(result.current.inventory).toEqual(["sword"]);

      // Navigate away and back
      rerender({
        adventure: mockAdventure,
        passageId: 1,
        isIntroduction: false,
      });

      rerender({
        adventure: mockAdventure,
        passageId: 2,
        isIntroduction: false,
      });

      // Item should still only appear once
      expect(result.current.inventory).toEqual(["sword"]);
    });
  });

  describe("Effect Processing - remove_item", () => {
    it("removes item from inventory when passage has remove_item effect", () => {
      const { result, rerender } = renderHook(
        ({
          adventure,
          passageId,
          isIntroduction,
        }: {
          adventure: Adventure;
          passageId: number | null;
          isIntroduction: boolean;
        }) => useTestAdventureState({ adventure, passageId, isIntroduction }),
        {
          initialProps: {
            adventure: mockAdventure,
            passageId: 2 as number | null,
            isIntroduction: false,
          },
        }
      );

      // First add the item
      expect(result.current.inventory).toContain("sword");

      // Navigate to passage that removes the item
      rerender({
        adventure: mockAdventure,
        passageId: 3,
        isIntroduction: false,
      });

      // Item should be removed
      expect(result.current.inventory).not.toContain("sword");
      expect(result.current.inventory).toEqual([]);
    });

    it("handles remove_item when item does not exist in inventory", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: 3, // Has remove_item for sword, but we never added it
          isIntroduction: false,
        })
      );

      // Should not throw error, inventory remains empty
      expect(result.current.inventory).toEqual([]);
    });
  });

  describe("Edge Cases", () => {
    it("does not process effects when adventure is null", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: null,
          passageId: 2,
          isIntroduction: false,
        })
      );

      // Should not throw error, inventory remains empty
      expect(result.current.inventory).toEqual([]);
    });

    it("does not process effects when in introduction mode", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: null,
          isIntroduction: true,
        })
      );

      // Should not process any effects
      expect(result.current.inventory).toEqual([]);
    });

    it("does not process effects when passageId is null", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: null,
          isIntroduction: false,
        })
      );

      expect(result.current.inventory).toEqual([]);
    });

    it("does not process effects when passageId is NaN", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: NaN,
          isIntroduction: false,
        })
      );

      expect(result.current.inventory).toEqual([]);
    });

    it("does not process effects for ending passages", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: 4,
          isIntroduction: false,
        })
      );

      // Ending passages don't have effects, inventory remains empty
      expect(result.current.inventory).toEqual([]);
    });

    it("does not process effects when passage has no effects", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: 1,
          isIntroduction: false,
        })
      );

      expect(result.current.inventory).toEqual([]);
    });

    it("handles passage not found gracefully", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: 999, // Non-existent passage
          isIntroduction: false,
        })
      );

      // Should not throw error
      expect(result.current.inventory).toEqual([]);
    });
  });

  describe("Manual Inventory Management", () => {
    it("adds item manually via handleAddItem", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: 1,
          isIntroduction: false,
        })
      );

      act(() => {
        result.current.handleAddItem("sword");
      });

      expect(result.current.inventory).toContain("sword");
    });

    it("does not duplicate item when adding manually", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: 1,
          isIntroduction: false,
        })
      );

      act(() => {
        result.current.handleAddItem("sword");
        result.current.handleAddItem("sword");
      });

      // Should only contain one instance
      expect(result.current.inventory).toEqual(["sword"]);
    });

    it("removes item manually via handleRemoveItem", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: 1,
          isIntroduction: false,
        })
      );

      act(() => {
        result.current.handleAddItem("sword");
        result.current.handleAddItem("shield");
      });

      expect(result.current.inventory).toContain("sword");
      expect(result.current.inventory).toContain("shield");

      act(() => {
        result.current.handleRemoveItem("sword");
      });

      expect(result.current.inventory).not.toContain("sword");
      expect(result.current.inventory).toContain("shield");
    });

    it("handles removing item that does not exist", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: 1,
          isIntroduction: false,
        })
      );

      act(() => {
        result.current.handleRemoveItem("sword");
      });

      // Should not throw error
      expect(result.current.inventory).toEqual([]);
    });

    it("adds multiple items manually", () => {
      const { result } = renderHook(() =>
        useTestAdventureState({
          adventure: mockAdventure,
          passageId: 1,
          isIntroduction: false,
        })
      );

      act(() => {
        result.current.handleAddItem("sword");
        result.current.handleAddItem("shield");
        result.current.handleAddItem("helmet");
      });

      expect(result.current.inventory).toEqual(["sword", "shield", "helmet"]);
    });
  });

  describe("Callback Stability", () => {
    it("maintains stable callback references", () => {
      const { result, rerender } = renderHook(
        ({
          adventure,
          passageId,
          isIntroduction,
        }: {
          adventure: Adventure;
          passageId: number | null;
          isIntroduction: boolean;
        }) => useTestAdventureState({ adventure, passageId, isIntroduction }),
        {
          initialProps: {
            adventure: mockAdventure,
            passageId: 1 as number | null,
            isIntroduction: false,
          },
        }
      );

      const initialHandleAddItem = result.current.handleAddItem;
      const initialHandleRemoveItem = result.current.handleRemoveItem;

      // Rerender with different props
      rerender({
        adventure: mockAdventure,
        passageId: 2,
        isIntroduction: false,
      });

      // Callbacks should remain the same reference
      expect(result.current.handleAddItem).toBe(initialHandleAddItem);
      expect(result.current.handleRemoveItem).toBe(initialHandleRemoveItem);
    });
  });
});
