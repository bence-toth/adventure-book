import { describe, it, expect } from "vitest";
import { getColor, getInteractiveColor } from "../colorHelpers";

describe("getColor", () => {
  describe("background type", () => {
    it("returns background color without surface", () => {
      expect(getColor("background", "neutral")).toBe(
        "var(--color-background-neutral)"
      );
      expect(getColor("background", "primary")).toBe(
        "var(--color-background-primary)"
      );
      expect(getColor("background", "danger")).toBe(
        "var(--color-background-danger)"
      );
    });

    it("returns background surface color when isSurface is true", () => {
      expect(getColor("background", "neutral", true)).toBe(
        "var(--color-background-surface-neutral)"
      );
      expect(getColor("background", "primary", true)).toBe(
        "var(--color-background-surface-primary)"
      );
      expect(getColor("background", "danger", true)).toBe(
        "var(--color-background-surface-danger)"
      );
    });

    it("returns background color when isSurface is explicitly false", () => {
      expect(getColor("background", "neutral", false)).toBe(
        "var(--color-background-neutral)"
      );
    });

    it("ignores isElevated parameter for background colors", () => {
      expect(getColor("background", "neutral", false, true)).toBe(
        "var(--color-background-neutral)"
      );
      expect(getColor("background", "primary", true, true)).toBe(
        "var(--color-background-surface-primary)"
      );
    });
  });

  describe("foreground type", () => {
    it("returns foreground color", () => {
      expect(getColor("foreground", "neutral")).toBe(
        "var(--color-foreground-neutral)"
      );
      expect(getColor("foreground", "primary")).toBe(
        "var(--color-foreground-primary)"
      );
      expect(getColor("foreground", "danger")).toBe(
        "var(--color-foreground-danger)"
      );
    });

    it("returns foreground color when isSurface is explicitly false", () => {
      expect(getColor("foreground", "neutral", false)).toBe(
        "var(--color-foreground-neutral)"
      );
    });

    it("ignores isElevated parameter for foreground colors", () => {
      expect(getColor("foreground", "primary", false, true)).toBe(
        "var(--color-foreground-primary)"
      );
    });
  });

  describe("foreground-muted type", () => {
    it("returns foreground-muted color", () => {
      expect(getColor("foreground-muted", "neutral")).toBe(
        "var(--color-foreground-muted-neutral)"
      );
      expect(getColor("foreground-muted", "primary")).toBe(
        "var(--color-foreground-muted-primary)"
      );
      expect(getColor("foreground-muted", "danger")).toBe(
        "var(--color-foreground-muted-danger)"
      );
    });

    it("returns foreground-muted color when isSurface is explicitly false", () => {
      expect(getColor("foreground-muted", "danger", false)).toBe(
        "var(--color-foreground-muted-danger)"
      );
    });

    it("ignores isElevated parameter for foreground-muted colors", () => {
      expect(getColor("foreground-muted", "neutral", false, true)).toBe(
        "var(--color-foreground-muted-neutral)"
      );
    });
  });

  describe("border type", () => {
    it("returns border surface color (requires isSurface = true)", () => {
      expect(getColor("border", "neutral", true)).toBe(
        "var(--color-border-surface-neutral)"
      );
      expect(getColor("border", "primary", true)).toBe(
        "var(--color-border-surface-primary)"
      );
      expect(getColor("border", "danger", true)).toBe(
        "var(--color-border-surface-danger)"
      );
    });

    it("ignores isElevated parameter for border colors", () => {
      expect(getColor("border", "neutral", true, true)).toBe(
        "var(--color-border-surface-neutral)"
      );
    });
  });

  describe("shadow type", () => {
    it("returns shadow surface without elevation", () => {
      expect(getColor("shadow", "neutral", true)).toBe(
        "var(--shadow-surface-neutral)"
      );
      expect(getColor("shadow", "primary", true)).toBe(
        "var(--shadow-surface-primary)"
      );
      expect(getColor("shadow", "danger", true)).toBe(
        "var(--shadow-surface-danger)"
      );
    });

    it("returns shadow surface with elevation when isElevated is true", () => {
      expect(getColor("shadow", "neutral", true, true)).toBe(
        "var(--shadow-surface-elevated-neutral)"
      );
      expect(getColor("shadow", "primary", true, true)).toBe(
        "var(--shadow-surface-elevated-primary)"
      );
      expect(getColor("shadow", "danger", true, true)).toBe(
        "var(--shadow-surface-elevated-danger)"
      );
    });

    it("returns non-elevated shadow when isElevated is false", () => {
      expect(getColor("shadow", "neutral", true, false)).toBe(
        "var(--shadow-surface-neutral)"
      );
    });
  });

  describe("all variants", () => {
    it("works with all three color variants for background", () => {
      const variants: Array<"neutral" | "primary" | "danger"> = [
        "neutral",
        "primary",
        "danger",
      ];

      variants.forEach((variant) => {
        const result = getColor("background", variant);
        expect(result).toMatch(/^var\(--color-[a-z-]+-[a-z]+\)$/);
        expect(result).toContain(variant);
      });
    });

    it("works with all three color variants for foreground", () => {
      const variants: Array<"neutral" | "primary" | "danger"> = [
        "neutral",
        "primary",
        "danger",
      ];

      variants.forEach((variant) => {
        const result = getColor("foreground", variant);
        expect(result).toMatch(/^var\(--color-[a-z-]+-[a-z]+\)$/);
        expect(result).toContain(variant);
      });
    });

    it("works with all three color variants for foreground-muted", () => {
      const variants: Array<"neutral" | "primary" | "danger"> = [
        "neutral",
        "primary",
        "danger",
      ];

      variants.forEach((variant) => {
        const result = getColor("foreground-muted", variant);
        expect(result).toMatch(/^var\(--color-[a-z-]+-[a-z]+\)$/);
        expect(result).toContain(variant);
      });
    });
  });

  describe("CSS variable format", () => {
    it("produces valid CSS custom property syntax", () => {
      expect(getColor("background", "neutral")).toMatch(/^var\(--[a-z-]+\)$/);
      expect(getColor("foreground", "primary")).toMatch(/^var\(--[a-z-]+\)$/);
      expect(getColor("shadow", "danger", true)).toMatch(/^var\(--[a-z-]+\)$/);
    });

    it("follows naming pattern for color types", () => {
      expect(getColor("background", "neutral")).toMatch(
        /^var\(--color-[a-z-]+-[a-z]+\)$/
      );
      expect(getColor("background", "neutral", true)).toMatch(
        /^var\(--color-[a-z-]+-surface-[a-z]+\)$/
      );
    });

    it("follows naming pattern for shadow types", () => {
      expect(getColor("shadow", "neutral", true)).toMatch(
        /^var\(--shadow-surface-[a-z]+\)$/
      );
      expect(getColor("shadow", "neutral", true, true)).toMatch(
        /^var\(--shadow-surface-elevated-[a-z]+\)$/
      );
    });
  });
});

describe("getInteractiveColor", () => {
  describe("background type", () => {
    it("returns correct CSS variables for all states", () => {
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

    it("works with all variants", () => {
      expect(getInteractiveColor("neutral", "background", "hover")).toBe(
        "var(--color-interactive-background-hover-neutral)"
      );
      expect(getInteractiveColor("primary", "background", "hover")).toBe(
        "var(--color-interactive-background-hover-primary)"
      );
      expect(getInteractiveColor("danger", "background", "hover")).toBe(
        "var(--color-interactive-background-hover-danger)"
      );
    });
  });

  describe("foreground type", () => {
    it("returns correct CSS variables for all states", () => {
      expect(getInteractiveColor("primary", "foreground", "default")).toBe(
        "var(--color-interactive-foreground-default-primary)"
      );
      expect(getInteractiveColor("primary", "foreground", "hover")).toBe(
        "var(--color-interactive-foreground-hover-primary)"
      );
      expect(getInteractiveColor("primary", "foreground", "active")).toBe(
        "var(--color-interactive-foreground-active-primary)"
      );
      expect(getInteractiveColor("primary", "foreground", "focus")).toBe(
        "var(--color-interactive-foreground-focus-primary)"
      );
    });
  });

  describe("border type", () => {
    it("returns correct CSS variables for all states", () => {
      expect(getInteractiveColor("danger", "border", "default")).toBe(
        "var(--color-interactive-border-default-danger)"
      );
      expect(getInteractiveColor("danger", "border", "hover")).toBe(
        "var(--color-interactive-border-hover-danger)"
      );
      expect(getInteractiveColor("danger", "border", "active")).toBe(
        "var(--color-interactive-border-active-danger)"
      );
      expect(getInteractiveColor("danger", "border", "focus")).toBe(
        "var(--color-interactive-border-focus-danger)"
      );
    });
  });

  describe("outline type", () => {
    it("returns correct CSS variables for all states", () => {
      expect(getInteractiveColor("neutral", "outline", "default")).toBe(
        "var(--color-interactive-outline-default-neutral)"
      );
      expect(getInteractiveColor("neutral", "outline", "hover")).toBe(
        "var(--color-interactive-outline-hover-neutral)"
      );
      expect(getInteractiveColor("neutral", "outline", "active")).toBe(
        "var(--color-interactive-outline-active-neutral)"
      );
      expect(getInteractiveColor("neutral", "outline", "focus")).toBe(
        "var(--color-interactive-outline-focus-neutral)"
      );
    });
  });

  describe("all combinations", () => {
    it("generates correct variables for all type/state/variant combinations", () => {
      const types = ["background", "foreground", "border", "outline"] as const;
      const states = ["default", "hover", "active", "focus"] as const;
      const variants = ["neutral", "primary", "danger"] as const;

      types.forEach((type) => {
        states.forEach((state) => {
          variants.forEach((variant) => {
            const result = getInteractiveColor(variant, type, state);
            expect(result).toMatch(
              /^var\(--color-interactive-[a-z]+-[a-z]+-[a-z]+\)$/
            );
            expect(result).toContain(type);
            expect(result).toContain(state);
            expect(result).toContain(variant);
          });
        });
      });
    });
  });

  describe("CSS variable format", () => {
    it("produces valid CSS custom property syntax", () => {
      expect(getInteractiveColor("neutral", "background", "hover")).toMatch(
        /^var\(--[a-z-]+\)$/
      );
    });

    it("follows naming pattern: --color-interactive-{type}-{state}-{variant}", () => {
      const result = getInteractiveColor("primary", "background", "hover");
      expect(result).toBe("var(--color-interactive-background-hover-primary)");
    });
  });
});
