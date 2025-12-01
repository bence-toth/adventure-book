import styled from "styled-components";
import { getInteractiveColor } from "@/utils/colorHelpers";

export const AdventureCardNew = styled.button`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3);
  gap: var(--space-2);
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
  cursor: pointer;
  border-radius: var(--space-1);
  width: 100%;
  aspect-ratio: 1 / 1.414;

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

export const AdventureCardTitle = styled.h2`
  font-size: var(--font-size-lg);
  line-height: var(--line-height-normal);
  overflow-wrap: break-word;
  font-family: var(--font-family-display);
`;
