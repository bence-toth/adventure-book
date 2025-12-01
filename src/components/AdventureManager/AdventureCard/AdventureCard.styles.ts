import styled from "styled-components";
import { getColor, getInteractiveColor } from "@/utils/colorHelpers";

export const AdventureCardContainer = styled.div`
  background: ${getColor({
    type: "background",
    variant: "neutral",
    isSurface: true,
  })};
  border-radius: var(--space-1);
  position: relative;
  display: flex;
  flex-direction: column;
  aspect-ratio: 1 / 1.414;
`;

export const AdventureCardClickable = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--space-3);
  cursor: pointer;
  text-align: left;
  width: 100%;
  min-height: 0;
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

export const AdventureCardContent = styled.div`
  flex: 1;
`;

export const AdventureCardTitle = styled.h2`
  font-size: var(--font-size-lg);
  line-height: var(--line-height-normal);
  overflow-wrap: break-word;
  font-family: var(--font-family-display);
`;

export const AdventureCardFooter = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  gap: var(--space-2);
`;

export const AdventureCardDate = styled.time`
  font-size: var(--font-size-sm);
  flex: 1;
`;

export const AdventureCardMenu = styled.button`
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
