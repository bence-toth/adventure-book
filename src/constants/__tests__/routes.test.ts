import { describe, it, expect } from "vitest";
import {
  getAdventureTestRoute,
  getAdventureContentRoute,
  getAdventureTestPassageRoute,
} from "../routes";

describe("Route Helper Functions", () => {
  describe("getAdventureTestRoute", () => {
    it("returns correct route for valid adventureId", () => {
      expect(getAdventureTestRoute("test-adventure-123")).toBe(
        "/adventure/test-adventure-123/test"
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
        "/adventure/test-adventure-456/content"
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
