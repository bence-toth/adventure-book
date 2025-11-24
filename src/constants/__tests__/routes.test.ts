import { describe, it, expect } from "vitest";
import {
  getAdventureTestRoute,
  getAdventureEditRoute,
  getPassageRoute,
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

  describe("getAdventureEditRoute", () => {
    it("returns correct route for valid adventureId", () => {
      expect(getAdventureEditRoute("test-adventure-456")).toBe(
        "/adventure/test-adventure-456/edit"
      );
    });

    it("returns empty string for null adventureId", () => {
      expect(getAdventureEditRoute(null)).toBe("");
    });

    it("returns empty string for undefined adventureId", () => {
      expect(getAdventureEditRoute(undefined)).toBe("");
    });

    it("returns empty string for empty string adventureId", () => {
      expect(getAdventureEditRoute("")).toBe("");
    });
  });

  describe("getPassageRoute", () => {
    it("returns correct route for valid adventureId and passageId", () => {
      expect(getPassageRoute("test-adventure-789", 1)).toBe(
        "/adventure/test-adventure-789/test/passage/1"
      );
    });

    it("handles string passageId", () => {
      expect(getPassageRoute("test-adventure-abc", "5")).toBe(
        "/adventure/test-adventure-abc/test/passage/5"
      );
    });

    it("returns empty string for null adventureId", () => {
      expect(getPassageRoute(null, 1)).toBe("");
    });

    it("returns empty string for undefined adventureId", () => {
      expect(getPassageRoute(undefined, 2)).toBe("");
    });

    it("returns empty string for empty string adventureId", () => {
      expect(getPassageRoute("", 3)).toBe("");
    });
  });
});
