type ColorVariant = "neutral" | "danger" | "primary";
type ColorType = "background" | "foreground" | "border" | "outline";
type ColorState = "default" | "hover" | "active" | "focus";

export const getInteractiveColor = (
  variant: ColorVariant,
  type: ColorType,
  state: ColorState
): string => {
  return `var(--color-interactive-${type}-${state}-${variant})`;
};
