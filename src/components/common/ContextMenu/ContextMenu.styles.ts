import styled from "styled-components";
import { getColor, getInteractiveColor } from "@/utils/colorHelpers";

export const MenuContainer = styled.div`
  box-shadow: ${getColor("shadow", "neutral", true, true)};
  min-width: var(--size-context-menu-min-width);
  border-radius: var(--space-1);
  z-index: 1;
`;

export const MenuItem = styled.button<{ $variant: "default" | "danger" }>`
  display: block;
  font-weight: 500;
  width: 100%;
  padding: var(--space-2) var(--space-3);
  text-align: start;
  cursor: pointer;
  font-size: inherit;
  border-radius: var(--space-1);
  background: ${(props) =>
    getInteractiveColor(
      props.$variant === "danger" ? "danger" : "neutral",
      "background",
      "default"
    )};
  color: ${(props) =>
    getInteractiveColor(
      props.$variant === "danger" ? "danger" : "neutral",
      "foreground",
      "default"
    )};
  border: var(--border-width-interactive) solid
    ${(props) =>
      getInteractiveColor(
        props.$variant === "danger" ? "danger" : "neutral",
        "border",
        "default"
      )};

  &:hover {
    background: ${(props) =>
      getInteractiveColor(
        props.$variant === "danger" ? "danger" : "neutral",
        "background",
        "hover"
      )};
    color: ${(props) =>
      getInteractiveColor(
        props.$variant === "danger" ? "danger" : "neutral",
        "foreground",
        "hover"
      )};
    border-color: ${(props) =>
      getInteractiveColor(
        props.$variant === "danger" ? "danger" : "neutral",
        "border",
        "hover"
      )};
  }

  &:active {
    background: ${(props) =>
      getInteractiveColor(
        props.$variant === "danger" ? "danger" : "neutral",
        "background",
        "active"
      )};
    color: ${(props) =>
      getInteractiveColor(
        props.$variant === "danger" ? "danger" : "neutral",
        "foreground",
        "active"
      )};
    border-color: ${(props) =>
      getInteractiveColor(
        props.$variant === "danger" ? "danger" : "neutral",
        "border",
        "active"
      )};
  }

  &:focus-visible {
    background: ${(props) =>
      getInteractiveColor(
        props.$variant === "danger" ? "danger" : "neutral",
        "background",
        "focus"
      )};
    color: ${(props) =>
      getInteractiveColor(
        props.$variant === "danger" ? "danger" : "neutral",
        "foreground",
        "focus"
      )};
    border-color: ${(props) =>
      getInteractiveColor(
        props.$variant === "danger" ? "danger" : "neutral",
        "border",
        "focus"
      )};
    outline-offset: var(--space-1);
  }
`;
