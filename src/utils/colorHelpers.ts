type ColorVariant = "neutral" | "danger" | "primary";

type ColorType =
  | "background"
  | "foreground"
  | "foreground-muted"
  | "border"
  | "shadow";

// Function overloads to enforce validation rules
// border type must have isSurface = true
export function getColor(
  type: "border",
  variant: ColorVariant,
  isSurface: true,
  isElevated?: boolean
): string;

// shadow type must have isSurface = true
export function getColor(
  type: "shadow",
  variant: ColorVariant,
  isSurface: true,
  isElevated?: boolean
): string;

// foreground and foreground-muted must have isSurface = false or undefined
export function getColor(
  type: "foreground" | "foreground-muted",
  variant: ColorVariant,
  isSurface?: false,
  isElevated?: boolean
): string;

// background can have any isSurface value
export function getColor(
  type: "background",
  variant: ColorVariant,
  isSurface?: boolean,
  isElevated?: boolean
): string;

export function getColor(
  type: ColorType,
  variant: ColorVariant,
  isSurface = false,
  isElevated = false
): string {
  const surface = isSurface ? "surface-" : "";

  // Shadow types
  if (type === "shadow") {
    const elevation = isElevated ? "elevated-" : "";
    return `var(--shadow-${surface}${elevation}${variant})`;
  }

  // Handle color types
  return `var(--color-${type}-${surface}${variant})`;
}

type InteractiveColorType = "background" | "foreground" | "border" | "outline";
type InteractiveColorState = "default" | "hover" | "active" | "focus";

export const getInteractiveColor = (
  variant: ColorVariant,
  type: InteractiveColorType,
  state: InteractiveColorState
): string => {
  return `var(--color-interactive-${type}-${state}-${variant})`;
};
