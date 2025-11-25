import { describe, it, expect } from "vitest";
import { getInteractiveColor } from "../colorHelpers";

describe("getInteractiveColor", () => {
  describe("Background colors", () => {
    it("returns correct CSS variable for neutral background default state", () => {
      expect(getInteractiveColor("neutral", "background", "default")).toBe(
        "var(--color-interactive-background-default-neutral)"
      );
    });

    it("returns correct CSS variable for primary background hover state", () => {
      expect(getInteractiveColor("primary", "background", "hover")).toBe(
        "var(--color-interactive-background-hover-primary)"
      );
    });

    it("returns correct CSS variable for danger background active state", () => {
      expect(getInteractiveColor("danger", "background", "active")).toBe(
        "var(--color-interactive-background-active-danger)"
      );
    });

    it("returns correct CSS variable for neutral background focus state", () => {
      expect(getInteractiveColor("neutral", "background", "focus")).toBe(
        "var(--color-interactive-background-focus-neutral)"
      );
    });
  });

  describe("Foreground colors", () => {
    it("returns correct CSS variable for neutral foreground default state", () => {
      expect(getInteractiveColor("neutral", "foreground", "default")).toBe(
        "var(--color-interactive-foreground-default-neutral)"
      );
    });

    it("returns correct CSS variable for primary foreground hover state", () => {
      expect(getInteractiveColor("primary", "foreground", "hover")).toBe(
        "var(--color-interactive-foreground-hover-primary)"
      );
    });

    it("returns correct CSS variable for danger foreground active state", () => {
      expect(getInteractiveColor("danger", "foreground", "active")).toBe(
        "var(--color-interactive-foreground-active-danger)"
      );
    });

    it("returns correct CSS variable for primary foreground focus state", () => {
      expect(getInteractiveColor("primary", "foreground", "focus")).toBe(
        "var(--color-interactive-foreground-focus-primary)"
      );
    });
  });

  describe("Border colors", () => {
    it("returns correct CSS variable for neutral border default state", () => {
      expect(getInteractiveColor("neutral", "border", "default")).toBe(
        "var(--color-interactive-border-default-neutral)"
      );
    });

    it("returns correct CSS variable for primary border hover state", () => {
      expect(getInteractiveColor("primary", "border", "hover")).toBe(
        "var(--color-interactive-border-hover-primary)"
      );
    });

    it("returns correct CSS variable for danger border active state", () => {
      expect(getInteractiveColor("danger", "border", "active")).toBe(
        "var(--color-interactive-border-active-danger)"
      );
    });

    it("returns correct CSS variable for neutral border focus state", () => {
      expect(getInteractiveColor("neutral", "border", "focus")).toBe(
        "var(--color-interactive-border-focus-neutral)"
      );
    });
  });

  describe("Outline colors", () => {
    it("returns correct CSS variable for danger outline focus state", () => {
      expect(getInteractiveColor("danger", "outline", "focus")).toBe(
        "var(--color-interactive-outline-focus-danger)"
      );
    });

    it("returns correct CSS variable for primary outline focus state", () => {
      expect(getInteractiveColor("primary", "outline", "focus")).toBe(
        "var(--color-interactive-outline-focus-primary)"
      );
    });

    it("returns correct CSS variable for neutral outline focus state", () => {
      expect(getInteractiveColor("neutral", "outline", "focus")).toBe(
        "var(--color-interactive-outline-focus-neutral)"
      );
    });
  });

  describe("All variants", () => {
    it("generates correct variables for all neutral states", () => {
      expect(getInteractiveColor("neutral", "background", "default")).toBe(
        "var(--color-interactive-background-default-neutral)"
      );
      expect(getInteractiveColor("neutral", "background", "hover")).toBe(
        "var(--color-interactive-background-hover-neutral)"
      );
      expect(getInteractiveColor("neutral", "background", "active")).toBe(
        "var(--color-interactive-background-active-neutral)"
      );
      expect(getInteractiveColor("neutral", "background", "focus")).toBe(
        "var(--color-interactive-background-focus-neutral)"
      );
    });

    it("generates correct variables for all danger states", () => {
      expect(getInteractiveColor("danger", "foreground", "default")).toBe(
        "var(--color-interactive-foreground-default-danger)"
      );
      expect(getInteractiveColor("danger", "foreground", "hover")).toBe(
        "var(--color-interactive-foreground-hover-danger)"
      );
      expect(getInteractiveColor("danger", "foreground", "active")).toBe(
        "var(--color-interactive-foreground-active-danger)"
      );
      expect(getInteractiveColor("danger", "foreground", "focus")).toBe(
        "var(--color-interactive-foreground-focus-danger)"
      );
    });

    it("generates correct variables for all primary states", () => {
      expect(getInteractiveColor("primary", "border", "default")).toBe(
        "var(--color-interactive-border-default-primary)"
      );
      expect(getInteractiveColor("primary", "border", "hover")).toBe(
        "var(--color-interactive-border-hover-primary)"
      );
      expect(getInteractiveColor("primary", "border", "active")).toBe(
        "var(--color-interactive-border-active-primary)"
      );
      expect(getInteractiveColor("primary", "border", "focus")).toBe(
        "var(--color-interactive-border-focus-primary)"
      );
    });
  });

  describe("Variable naming convention", () => {
    it("follows the pattern: --color-interactive-{type}-{state}-{variant}", () => {
      const result = getInteractiveColor("primary", "background", "hover");
      expect(result).toMatch(
        /^var\(--color-interactive-[a-z]+-[a-z]+-[a-z]+\)$/
      );
    });

    it("produces valid CSS custom property syntax", () => {
      const result = getInteractiveColor("neutral", "foreground", "default");
      expect(result).toMatch(/^var\(--[a-z-]+\)$/);
    });
  });
});
