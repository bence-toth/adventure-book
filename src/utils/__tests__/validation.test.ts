import { describe, expect, it } from "vitest";
import {
  validateChoiceTarget,
  validateChoiceText,
  validateEffects,
  validateEndingType,
  validateIntroductionText,
  validatePassageText,
  validateTitle,
} from "../validation";
import type { Effect } from "@/data/types";

describe("validation utilities", () => {
  describe("validateTitle", () => {
    it("returns undefined for valid title", () => {
      expect(validateTitle("A Valid Title")).toBeUndefined();
    });

    it("returns error for empty string", () => {
      expect(validateTitle("")).toBe("Title must not be blank");
    });

    it("returns error for whitespace-only string", () => {
      expect(validateTitle("   ")).toBe("Title must not be blank");
    });
  });

  describe("validateIntroductionText", () => {
    it("returns undefined for valid text", () => {
      expect(
        validateIntroductionText("Some introduction text")
      ).toBeUndefined();
    });

    it("returns error for empty string", () => {
      expect(validateIntroductionText("")).toBe(
        "Introduction content must not be blank"
      );
    });

    it("returns error for whitespace-only string", () => {
      expect(validateIntroductionText("   \n  ")).toBe(
        "Introduction content must not be blank"
      );
    });
  });

  describe("validatePassageText", () => {
    it("returns undefined for valid text", () => {
      expect(validatePassageText("Some passage text")).toBeUndefined();
    });

    it("returns error for empty string", () => {
      expect(validatePassageText("")).toBe("Passage content must not be blank");
    });

    it("returns error for whitespace-only string", () => {
      expect(validatePassageText("  \t  ")).toBe(
        "Passage content must not be blank"
      );
    });
  });

  describe("validateChoiceText", () => {
    it("returns undefined for valid text", () => {
      expect(validateChoiceText("Go north")).toBeUndefined();
    });

    it("returns error for empty string", () => {
      expect(validateChoiceText("")).toBe("Choice content must not be blank");
    });

    it("returns error for whitespace-only string", () => {
      expect(validateChoiceText("  ")).toBe("Choice content must not be blank");
    });
  });

  describe("validateChoiceTarget", () => {
    it("returns undefined for valid positive number", () => {
      expect(validateChoiceTarget(1)).toBeUndefined();
      expect(validateChoiceTarget(42)).toBeUndefined();
    });

    it("returns error for null", () => {
      expect(validateChoiceTarget(null)).toBe("Go to passage must be selected");
    });

    it("returns error for zero", () => {
      expect(validateChoiceTarget(0)).toBe("Go to passage must be selected");
    });

    it("returns error for negative number", () => {
      expect(validateChoiceTarget(-1)).toBe("Go to passage must be selected");
    });
  });

  describe("validateEffects", () => {
    it("returns undefined for empty effects array", () => {
      expect(validateEffects([])).toBeUndefined();
    });

    it("returns undefined for single add_item effect", () => {
      const effects: Effect[] = [{ type: "add_item", item: "key" }];
      expect(validateEffects(effects)).toBeUndefined();
    });

    it("returns undefined for single remove_item effect", () => {
      const effects: Effect[] = [{ type: "remove_item", item: "key" }];
      expect(validateEffects(effects)).toBeUndefined();
    });

    it("returns undefined for different items being added", () => {
      const effects: Effect[] = [
        { type: "add_item", item: "key" },
        { type: "add_item", item: "sword" },
      ];
      expect(validateEffects(effects)).toBeUndefined();
    });

    it("returns undefined for different items being removed", () => {
      const effects: Effect[] = [
        { type: "remove_item", item: "key" },
        { type: "remove_item", item: "sword" },
      ];
      expect(validateEffects(effects)).toBeUndefined();
    });

    it("returns error when adding same item multiple times", () => {
      const effects: Effect[] = [
        { type: "add_item", item: "key" },
        { type: "add_item", item: "key" },
      ];
      expect(validateEffects(effects)).toBe(
        'Cannot add the same inventory item "key" multiple times'
      );
    });

    it("returns error when removing same item multiple times", () => {
      const effects: Effect[] = [
        { type: "remove_item", item: "torch" },
        { type: "remove_item", item: "torch" },
      ];
      expect(validateEffects(effects)).toBe(
        'Cannot remove the same inventory item "torch" multiple times'
      );
    });

    it("returns error when adding then removing same item", () => {
      const effects: Effect[] = [
        { type: "add_item", item: "potion" },
        { type: "remove_item", item: "potion" },
      ];
      expect(validateEffects(effects)).toBe(
        'Cannot add and remove the same inventory item "potion" in the same passage'
      );
    });

    it("returns error when removing then adding same item", () => {
      const effects: Effect[] = [
        { type: "remove_item", item: "coin" },
        { type: "add_item", item: "coin" },
      ];
      expect(validateEffects(effects)).toBe(
        'Cannot add and remove the same inventory item "coin" in the same passage'
      );
    });

    it("catches duplicate add after multiple valid effects", () => {
      const effects: Effect[] = [
        { type: "add_item", item: "key" },
        { type: "remove_item", item: "map" },
        { type: "add_item", item: "key" },
      ];
      expect(validateEffects(effects)).toBe(
        'Cannot add the same inventory item "key" multiple times'
      );
    });

    it("catches duplicate remove after multiple valid effects", () => {
      const effects: Effect[] = [
        { type: "remove_item", item: "map" },
        { type: "add_item", item: "key" },
        { type: "remove_item", item: "map" },
      ];
      expect(validateEffects(effects)).toBe(
        'Cannot remove the same inventory item "map" multiple times'
      );
    });
  });

  describe("validateEndingType", () => {
    it("returns undefined when there are choices", () => {
      expect(validateEndingType(true, undefined)).toBeUndefined();
    });

    it("returns undefined when ending type is provided without choices", () => {
      expect(validateEndingType(false, "victory")).toBeUndefined();
    });

    it("returns error when no choices and no ending type", () => {
      expect(validateEndingType(false, undefined)).toBe(
        "If there are no choices, ending type must be selected"
      );
    });

    it("returns undefined when both choices and ending type are provided", () => {
      expect(validateEndingType(true, "victory")).toBeUndefined();
    });
  });
});
