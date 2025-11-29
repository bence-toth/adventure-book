import styled from "styled-components";
import { getColor, getInteractiveColor } from "@/utils/colorHelpers";

export const MenuContainer = styled.div`
  box-shadow: ${getColor({
    type: "shadow",
    variant: "neutral",
    isSurface: true,
    isElevated: true,
  })};
  min-width: var(--size-context-menu-min-width);
  border-radius: var(--space-1);
  z-index: 2;
`;

export const MenuItem = styled.button<{ $variant: "default" | "danger" }>`
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-weight: 500;
  width: 100%;
  padding: var(--space-2) var(--space-3);
  text-align: start;
  cursor: pointer;
  font-size: inherit;
  border-radius: var(--space-1);
  background: ${(props) =>
    getInteractiveColor({
      variant: props.$variant === "danger" ? "danger" : "neutral",
      type: "background",
      state: "default",
    })};
  color: ${(props) =>
    getInteractiveColor({
      variant: props.$variant === "danger" ? "danger" : "neutral",
      type: "foreground",
      state: "default",
    })};
  border: var(--border-width-interactive) solid
    ${(props) =>
      getInteractiveColor({
        variant: props.$variant === "danger" ? "danger" : "neutral",
        type: "border",
        state: "default",
      })};

  &:hover {
    background: ${(props) =>
      getInteractiveColor({
        variant: props.$variant === "danger" ? "danger" : "neutral",
        type: "background",
        state: "hover",
      })};
    color: ${(props) =>
      getInteractiveColor({
        variant: props.$variant === "danger" ? "danger" : "neutral",
        type: "foreground",
        state: "hover",
      })};
    border-color: ${(props) =>
      getInteractiveColor({
        variant: props.$variant === "danger" ? "danger" : "neutral",
        type: "border",
        state: "hover",
      })};
  }

  &:active {
    background: ${(props) =>
      getInteractiveColor({
        variant: props.$variant === "danger" ? "danger" : "neutral",
        type: "background",
        state: "active",
      })};
    color: ${(props) =>
      getInteractiveColor({
        variant: props.$variant === "danger" ? "danger" : "neutral",
        type: "foreground",
        state: "active",
      })};
    border-color: ${(props) =>
      getInteractiveColor({
        variant: props.$variant === "danger" ? "danger" : "neutral",
        type: "border",
        state: "active",
      })};
  }

  &:focus-visible {
    background: ${(props) =>
      getInteractiveColor({
        variant: props.$variant === "danger" ? "danger" : "neutral",
        type: "background",
        state: "focus",
      })};
    color: ${(props) =>
      getInteractiveColor({
        variant: props.$variant === "danger" ? "danger" : "neutral",
        type: "foreground",
        state: "focus",
      })};
    border-color: ${(props) =>
      getInteractiveColor({
        variant: props.$variant === "danger" ? "danger" : "neutral",
        type: "border",
        state: "focus",
      })};
    outline-offset: var(--space-1);
  }
`;

export const MenuItemIcon = styled.span`
  display: flex;
`;
