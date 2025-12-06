import styled from "styled-components";
import { getColor, getInteractiveColor } from "@/utils/colorHelpers";

export const TopBarStartContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-1);
`;

export const SavingIndicator = styled.span`
  color: ${getColor({ type: "foreground-muted", variant: "neutral" })};
`;

export const TopBarEndContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

export const ContextMenuButton = styled.button`
  cursor: pointer;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-1);
  flex-shrink: 0;
  border-radius: var(--space-1);
  background: ${getInteractiveColor({
    variant: "neutral",
    type: "background",
    state: "default",
  })};
  color: ${getInteractiveColor({
    variant: "neutral",
    type: "foreground",
    state: "default",
  })};
  border: var(--border-width-interactive) solid
    ${getInteractiveColor({
      variant: "neutral",
      type: "border",
      state: "default",
    })};

  &:hover {
    background: ${getInteractiveColor({
      variant: "neutral",
      type: "background",
      state: "hover",
    })};
    color: ${getInteractiveColor({
      variant: "neutral",
      type: "foreground",
      state: "hover",
    })};
    border-color: ${getInteractiveColor({
      variant: "neutral",
      type: "border",
      state: "hover",
    })};
  }

  &:active {
    background: ${getInteractiveColor({
      variant: "neutral",
      type: "background",
      state: "active",
    })};
    color: ${getInteractiveColor({
      variant: "neutral",
      type: "foreground",
      state: "active",
    })};
    border-color: ${getInteractiveColor({
      variant: "neutral",
      type: "border",
      state: "active",
    })};
  }

  &:focus-visible {
    background: ${getInteractiveColor({
      variant: "neutral",
      type: "background",
      state: "focus",
    })};
    color: ${getInteractiveColor({
      variant: "neutral",
      type: "foreground",
      state: "focus",
    })};
    border-color: ${getInteractiveColor({
      variant: "neutral",
      type: "border",
      state: "focus",
    })};
    outline-offset: var(--space-1);
  }
`;
