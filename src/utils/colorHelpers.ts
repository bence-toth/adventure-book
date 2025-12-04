type ColorVariant = "neutral" | "danger" | "primary";

type ColorType =
  | "background"
  | "foreground"
  | "foreground-muted"
  | "border"
  | "shadow";

interface GetColorParams {
  type: ColorType;
  variant: ColorVariant;
  isSurface?: boolean;
  isElevated?: boolean;
}

// Function overloads to enforce validation rules
// border type must have isSurface = true
export function getColor(params: {
  type: "border";
  variant: ColorVariant;
  isSurface: true;
  isElevated?: boolean;
}): string;

// shadow type must have isSurface = true
export function getColor(params: {
  type: "shadow";
  variant: ColorVariant;
  isSurface: true;
  isElevated?: boolean;
}): string;

// foreground and foreground-muted must have isSurface = false or undefined
export function getColor(params: {
  type: "foreground" | "foreground-muted";
  variant: ColorVariant;
  isSurface?: false;
  isElevated?: boolean;
}): string;

// background can have any isSurface value
export function getColor(params: {
  type: "background";
  variant: ColorVariant;
  isSurface?: boolean;
  isElevated?: boolean;
}): string;

export function getColor({
  type,
  variant,
  isSurface = false,
  isElevated = false,
}: GetColorParams): string {
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
type InteractiveColorState = "default" | "hover" | "active" | "focus" | "input";

interface GetInteractiveColorParams {
  variant: ColorVariant;
  type: InteractiveColorType;
  state: InteractiveColorState;
}

export const getInteractiveColor = ({
  variant,
  type,
  state,
}: GetInteractiveColorParams): string => {
  return `var(--color-interactive-${type}-${state}-${variant})`;
};
