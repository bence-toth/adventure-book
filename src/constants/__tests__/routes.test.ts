import { describe, it, expect } from "vitest";
import {
  getAdventureTestRoute,
  getAdventureContentRoute,
  getAdventureStructureRoute,
  getAdventureTestPassageRoute,
} from "../routes";

describe("Route Helper Functions", () => {
  describe("getAdventureTestRoute", () => {
    it("returns correct route for valid adventureId", () => {
      expect(getAdventureTestRoute("test-adventure-123")).toBe(
        "/adventure/test-adventure-123/test/introduction"
      );
    });

    it("returns empty string for null adventureId", () => {
      expect(getAdventureTestRoute(null)).toBe("");
    });

    it("returns empty string for undefined adventureId", () => {
      expect(getAdventureTestRoute(undefined)).toBe("");
    });

    it("returns empty string for empty string adventureId", () => {
      expect(getAdventureTestRoute("")).toBe("");
    });
  });

  describe("getAdventureContentRoute", () => {
    it("returns correct route for valid adventureId", () => {
      expect(getAdventureContentRoute("test-adventure-456")).toBe(
        "/adventure/test-adventure-456/content/introduction"
      );
    });

    it("returns empty string for null adventureId", () => {
      expect(getAdventureContentRoute(null)).toBe("");
    });

    it("returns empty string for undefined adventureId", () => {
      expect(getAdventureContentRoute(undefined)).toBe("");
    });

    it("returns empty string for empty string adventureId", () => {
      expect(getAdventureContentRoute("")).toBe("");
    });
  });

  describe("getAdventureStructureRoute", () => {
    it("returns correct route for valid adventureId", () => {
      expect(getAdventureStructureRoute("test-adventure-789")).toBe(
        "/adventure/test-adventure-789/structure"
      );
    });

    it("returns empty string for null adventureId", () => {
      expect(getAdventureStructureRoute(null)).toBe("");
    });

    it("returns empty string for undefined adventureId", () => {
      expect(getAdventureStructureRoute(undefined)).toBe("");
    });

    it("returns empty string for empty string adventureId", () => {
      expect(getAdventureStructureRoute("")).toBe("");
    });
  });

  describe("getAdventureTestPassageRoute", () => {
    it("returns correct route for valid adventureId and passageId", () => {
      expect(getAdventureTestPassageRoute("test-adventure-789", 1)).toBe(
        "/adventure/test-adventure-789/test/passage/1"
      );
    });

    it("handles string passageId", () => {
      expect(getAdventureTestPassageRoute("test-adventure-abc", "5")).toBe(
        "/adventure/test-adventure-abc/test/passage/5"
      );
    });

    it("returns empty string for null adventureId", () => {
      expect(getAdventureTestPassageRoute(null, 1)).toBe("");
    });

    it("returns empty string for undefined adventureId", () => {
      expect(getAdventureTestPassageRoute(undefined, 2)).toBe("");
    });

    it("returns empty string for empty string adventureId", () => {
      expect(getAdventureTestPassageRoute("", 3)).toBe("");
    });
  });
});
