import { describe, it, expect } from "vitest";
import { getColor, getInteractiveColor } from "../colorHelpers";

describe("getColor", () => {
  describe("background type", () => {
    it("returns background color without surface", () => {
      expect(getColor({ type: "background", variant: "neutral" })).toBe(
        "var(--color-background-neutral)"
      );
      expect(getColor({ type: "background", variant: "primary" })).toBe(
        "var(--color-background-primary)"
      );
      expect(getColor({ type: "background", variant: "danger" })).toBe(
        "var(--color-background-danger)"
      );
    });

    it("returns background surface color when isSurface is true", () => {
      expect(
        getColor({ type: "background", variant: "neutral", isSurface: true })
      ).toBe("var(--color-background-surface-neutral)");
      expect(
        getColor({ type: "background", variant: "primary", isSurface: true })
      ).toBe("var(--color-background-surface-primary)");
      expect(
        getColor({ type: "background", variant: "danger", isSurface: true })
      ).toBe("var(--color-background-surface-danger)");
    });

    it("returns background color when isSurface is explicitly false", () => {
      expect(
        getColor({ type: "background", variant: "neutral", isSurface: false })
      ).toBe("var(--color-background-neutral)");
    });

    it("ignores isElevated parameter for background colors", () => {
      expect(
        getColor({
          type: "background",
          variant: "neutral",
          isSurface: false,
          isElevated: true,
        })
      ).toBe("var(--color-background-neutral)");
      expect(
        getColor({
          type: "background",
          variant: "primary",
          isSurface: true,
          isElevated: true,
        })
      ).toBe("var(--color-background-surface-primary)");
    });
  });

  describe("foreground type", () => {
    it("returns foreground color", () => {
      expect(getColor({ type: "foreground", variant: "neutral" })).toBe(
        "var(--color-foreground-neutral)"
      );
      expect(getColor({ type: "foreground", variant: "primary" })).toBe(
        "var(--color-foreground-primary)"
      );
      expect(getColor({ type: "foreground", variant: "danger" })).toBe(
        "var(--color-foreground-danger)"
      );
    });

    it("returns foreground color when isSurface is explicitly false", () => {
      expect(
        getColor({ type: "foreground", variant: "neutral", isSurface: false })
      ).toBe("var(--color-foreground-neutral)");
    });

    it("ignores isElevated parameter for foreground colors", () => {
      expect(
        getColor({
          type: "foreground",
          variant: "primary",
          isSurface: false,
          isElevated: true,
        })
      ).toBe("var(--color-foreground-primary)");
    });
  });

  describe("foreground-muted type", () => {
    it("returns foreground-muted color", () => {
      expect(getColor({ type: "foreground-muted", variant: "neutral" })).toBe(
        "var(--color-foreground-muted-neutral)"
      );
      expect(getColor({ type: "foreground-muted", variant: "primary" })).toBe(
        "var(--color-foreground-muted-primary)"
      );
      expect(getColor({ type: "foreground-muted", variant: "danger" })).toBe(
        "var(--color-foreground-muted-danger)"
      );
    });

    it("returns foreground-muted color when isSurface is explicitly false", () => {
      expect(
        getColor({
          type: "foreground-muted",
          variant: "danger",
          isSurface: false,
        })
      ).toBe("var(--color-foreground-muted-danger)");
    });

    it("ignores isElevated parameter for foreground-muted colors", () => {
      expect(
        getColor({
          type: "foreground-muted",
          variant: "neutral",
          isSurface: false,
          isElevated: true,
        })
      ).toBe("var(--color-foreground-muted-neutral)");
    });
  });

  describe("border type", () => {
    it("returns border surface color (requires isSurface = true)", () => {
      expect(
        getColor({ type: "border", variant: "neutral", isSurface: true })
      ).toBe("var(--color-border-surface-neutral)");
      expect(
        getColor({ type: "border", variant: "primary", isSurface: true })
      ).toBe("var(--color-border-surface-primary)");
      expect(
        getColor({ type: "border", variant: "danger", isSurface: true })
      ).toBe("var(--color-border-surface-danger)");
    });

    it("ignores isElevated parameter for border colors", () => {
      expect(
        getColor({
          type: "border",
          variant: "neutral",
          isSurface: true,
          isElevated: true,
        })
      ).toBe("var(--color-border-surface-neutral)");
    });
  });

  describe("shadow type", () => {
    it("returns shadow surface without elevation", () => {
      expect(
        getColor({ type: "shadow", variant: "neutral", isSurface: true })
      ).toBe("var(--shadow-surface-neutral)");
      expect(
        getColor({ type: "shadow", variant: "primary", isSurface: true })
      ).toBe("var(--shadow-surface-primary)");
      expect(
        getColor({ type: "shadow", variant: "danger", isSurface: true })
      ).toBe("var(--shadow-surface-danger)");
    });

    it("returns shadow surface with elevation when isElevated is true", () => {
      expect(
        getColor({
          type: "shadow",
          variant: "neutral",
          isSurface: true,
          isElevated: true,
        })
      ).toBe("var(--shadow-surface-elevated-neutral)");
      expect(
        getColor({
          type: "shadow",
          variant: "primary",
          isSurface: true,
          isElevated: true,
        })
      ).toBe("var(--shadow-surface-elevated-primary)");
      expect(
        getColor({
          type: "shadow",
          variant: "danger",
          isSurface: true,
          isElevated: true,
        })
      ).toBe("var(--shadow-surface-elevated-danger)");
    });

    it("returns non-elevated shadow when isElevated is false", () => {
      expect(
        getColor({
          type: "shadow",
          variant: "neutral",
          isSurface: true,
          isElevated: false,
        })
      ).toBe("var(--shadow-surface-neutral)");
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
        const result = getColor({ type: "background", variant });
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
        const result = getColor({ type: "foreground", variant });
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
        const result = getColor({ type: "foreground-muted", variant });
        expect(result).toMatch(/^var\(--color-[a-z-]+-[a-z]+\)$/);
        expect(result).toContain(variant);
      });
    });
  });

  describe("CSS variable format", () => {
    it("produces valid CSS custom property syntax", () => {
      expect(getColor({ type: "background", variant: "neutral" })).toMatch(
        /^var\(--[a-z-]+\)$/
      );
      expect(getColor({ type: "foreground", variant: "primary" })).toMatch(
        /^var\(--[a-z-]+\)$/
      );
      expect(
        getColor({ type: "shadow", variant: "danger", isSurface: true })
      ).toMatch(/^var\(--[a-z-]+\)$/);
    });

    it("follows naming pattern for color types", () => {
      expect(getColor({ type: "background", variant: "neutral" })).toMatch(
        /^var\(--color-[a-z-]+-[a-z]+\)$/
      );
      expect(
        getColor({ type: "background", variant: "neutral", isSurface: true })
      ).toMatch(/^var\(--color-[a-z-]+-surface-[a-z]+\)$/);
    });

    it("follows naming pattern for shadow types", () => {
      expect(
        getColor({ type: "shadow", variant: "neutral", isSurface: true })
      ).toMatch(/^var\(--shadow-surface-[a-z]+\)$/);
      expect(
        getColor({
          type: "shadow",
          variant: "neutral",
          isSurface: true,
          isElevated: true,
        })
      ).toMatch(/^var\(--shadow-surface-elevated-[a-z]+\)$/);
    });
  });
});

describe("getInteractiveColor", () => {
  describe("background type", () => {
    it("returns correct CSS variables for all states", () => {
      expect(
        getInteractiveColor({
          variant: "neutral",
          type: "background",
          state: "default",
        })
      ).toBe("var(--color-interactive-background-default-neutral)");
      expect(
        getInteractiveColor({
          variant: "neutral",
          type: "background",
          state: "hover",
        })
      ).toBe("var(--color-interactive-background-hover-neutral)");
      expect(
        getInteractiveColor({
          variant: "neutral",
          type: "background",
          state: "active",
        })
      ).toBe("var(--color-interactive-background-active-neutral)");
      expect(
        getInteractiveColor({
          variant: "neutral",
          type: "background",
          state: "focus",
        })
      ).toBe("var(--color-interactive-background-focus-neutral)");
    });

    it("works with all variants", () => {
      expect(
        getInteractiveColor({
          variant: "neutral",
          type: "background",
          state: "hover",
        })
      ).toBe("var(--color-interactive-background-hover-neutral)");
      expect(
        getInteractiveColor({
          variant: "primary",
          type: "background",
          state: "hover",
        })
      ).toBe("var(--color-interactive-background-hover-primary)");
      expect(
        getInteractiveColor({
          variant: "danger",
          type: "background",
          state: "hover",
        })
      ).toBe("var(--color-interactive-background-hover-danger)");
    });
  });

  describe("foreground type", () => {
    it("returns correct CSS variables for all states", () => {
      expect(
        getInteractiveColor({
          variant: "primary",
          type: "foreground",
          state: "default",
        })
      ).toBe("var(--color-interactive-foreground-default-primary)");
      expect(
        getInteractiveColor({
          variant: "primary",
          type: "foreground",
          state: "hover",
        })
      ).toBe("var(--color-interactive-foreground-hover-primary)");
      expect(
        getInteractiveColor({
          variant: "primary",
          type: "foreground",
          state: "active",
        })
      ).toBe("var(--color-interactive-foreground-active-primary)");
      expect(
        getInteractiveColor({
          variant: "primary",
          type: "foreground",
          state: "focus",
        })
      ).toBe("var(--color-interactive-foreground-focus-primary)");
    });
  });

  describe("border type", () => {
    it("returns correct CSS variables for all states", () => {
      expect(
        getInteractiveColor({
          variant: "danger",
          type: "border",
          state: "default",
        })
      ).toBe("var(--color-interactive-border-default-danger)");
      expect(
        getInteractiveColor({
          variant: "danger",
          type: "border",
          state: "hover",
        })
      ).toBe("var(--color-interactive-border-hover-danger)");
      expect(
        getInteractiveColor({
          variant: "danger",
          type: "border",
          state: "active",
        })
      ).toBe("var(--color-interactive-border-active-danger)");
      expect(
        getInteractiveColor({
          variant: "danger",
          type: "border",
          state: "focus",
        })
      ).toBe("var(--color-interactive-border-focus-danger)");
    });
  });

  describe("outline type", () => {
    it("returns correct CSS variables for all states", () => {
      expect(
        getInteractiveColor({
          variant: "neutral",
          type: "outline",
          state: "default",
        })
      ).toBe("var(--color-interactive-outline-default-neutral)");
      expect(
        getInteractiveColor({
          variant: "neutral",
          type: "outline",
          state: "hover",
        })
      ).toBe("var(--color-interactive-outline-hover-neutral)");
      expect(
        getInteractiveColor({
          variant: "neutral",
          type: "outline",
          state: "active",
        })
      ).toBe("var(--color-interactive-outline-active-neutral)");
      expect(
        getInteractiveColor({
          variant: "neutral",
          type: "outline",
          state: "focus",
        })
      ).toBe("var(--color-interactive-outline-focus-neutral)");
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
            const result = getInteractiveColor({ variant, type, state });
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
      expect(
        getInteractiveColor({
          variant: "neutral",
          type: "background",
          state: "hover",
        })
      ).toMatch(/^var\(--[a-z-]+\)$/);
    });

    it("follows naming pattern: --color-interactive-{type}-{state}-{variant}", () => {
      const result = getInteractiveColor({
        variant: "primary",
        type: "background",
        state: "hover",
      });
      expect(result).toBe("var(--color-interactive-background-hover-primary)");
    });
  });
});
