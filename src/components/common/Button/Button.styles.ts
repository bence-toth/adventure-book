import styled from "styled-components";
import { getInteractiveColor } from "@/utils/colorHelpers";

type ButtonVariant = "neutral" | "danger" | "primary";

export const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: "default" | "small";
  $hasChildren: boolean;
}>`
  display: inline-flex;
  font-weight: 500;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  line-height: var(--line-height-dense);
  padding: ${(props) => {
    if (props.$size === "small") {
      return props.$hasChildren
        ? "var(--space-1) var(--space-2)"
        : "var(--space-1)";
    }
    return props.$hasChildren
      ? "var(--space-2) var(--space-3)"
      : "var(--space-2)";
  }};
  border-radius: var(--space-1);
  cursor: pointer;
  text-decoration: none;
  background: ${(props) =>
    getInteractiveColor(props.$variant, "background", "default")};
  color: ${(props) =>
    getInteractiveColor(props.$variant, "foreground", "default")};
  border: var(--border-width-interactive) solid
    ${(props) => getInteractiveColor(props.$variant, "border", "default")};

  &:hover {
    background: ${(props) =>
      getInteractiveColor(props.$variant, "background", "hover")};
    color: ${(props) =>
      getInteractiveColor(props.$variant, "foreground", "hover")};
    border-color: ${(props) =>
      getInteractiveColor(props.$variant, "border", "hover")};
  }

  &:active {
    background: ${(props) =>
      getInteractiveColor(props.$variant, "background", "active")};
    color: ${(props) =>
      getInteractiveColor(props.$variant, "foreground", "active")};
    border-color: ${(props) =>
      getInteractiveColor(props.$variant, "border", "active")};
  }

  &:focus-visible {
    background: ${(props) =>
      getInteractiveColor(props.$variant, "background", "focus")};
    color: ${(props) =>
      getInteractiveColor(props.$variant, "foreground", "focus")};
    border-color: ${(props) =>
      getInteractiveColor(props.$variant, "border", "focus")};
    outline-offset: var(--space-1);
    ${(props) =>
      props.$variant !== "neutral"
        ? `outline-color: ${getInteractiveColor(
            props.$variant,
            "outline",
            "focus"
          )};`
        : ""};
  }
`;

export const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: var(--line-height-dense);
`;

export const TextWrapper = styled.span`
  display: inline-block;
`;
