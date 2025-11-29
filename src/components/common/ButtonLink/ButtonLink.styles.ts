import styled from "styled-components";
import { Link } from "react-router-dom";
import { getInteractiveColor } from "@/utils/colorHelpers";

type LinkVariant = "neutral" | "primary";

export const StyledLink = styled(Link)<{
  $size: "default" | "small";
  $variant: LinkVariant;
}>`
  display: inline-flex;
  font-weight: 500;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  line-height: var(--line-height-dense);
  padding: ${(props) =>
    props.$size === "small"
      ? "var(--space-1) var(--space-2)"
      : "var(--space-2) var(--space-3)"};
  border-radius: var(--space-1);
  cursor: pointer;
  text-decoration: none;
  background: ${(props) =>
    getInteractiveColor({
      variant: props.$variant,
      type: "background",
      state: "default",
    })};
  color: ${(props) =>
    getInteractiveColor({
      variant: props.$variant,
      type: "foreground",
      state: "default",
    })};
  border: var(--border-width-interactive) solid
    ${(props) =>
      getInteractiveColor({
        variant: props.$variant,
        type: "border",
        state: "default",
      })};

  &:hover {
    background: ${(props) =>
      getInteractiveColor({
        variant: props.$variant,
        type: "background",
        state: "hover",
      })};
    color: ${(props) =>
      getInteractiveColor({
        variant: props.$variant,
        type: "foreground",
        state: "hover",
      })};
    border-color: ${(props) =>
      getInteractiveColor({
        variant: props.$variant,
        type: "border",
        state: "hover",
      })};
  }

  &:active {
    background: ${(props) =>
      getInteractiveColor({
        variant: props.$variant,
        type: "background",
        state: "active",
      })};
    color: ${(props) =>
      getInteractiveColor({
        variant: props.$variant,
        type: "foreground",
        state: "active",
      })};
    border-color: ${(props) =>
      getInteractiveColor({
        variant: props.$variant,
        type: "border",
        state: "active",
      })};
  }

  &:focus-visible {
    background: ${(props) =>
      getInteractiveColor({
        variant: props.$variant,
        type: "background",
        state: "focus",
      })};
    color: ${(props) =>
      getInteractiveColor({
        variant: props.$variant,
        type: "foreground",
        state: "focus",
      })};
    border-color: ${(props) =>
      getInteractiveColor({
        variant: props.$variant,
        type: "border",
        state: "focus",
      })};
    outline-offset: var(--space-1);
    ${(props) =>
      props.$variant === "primary"
        ? `outline-color: ${getInteractiveColor({ variant: props.$variant, type: "outline", state: "focus" })};`
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
