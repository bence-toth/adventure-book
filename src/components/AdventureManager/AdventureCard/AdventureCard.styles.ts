import styled from "styled-components";
import { getInteractiveColor } from "@/utils/colorHelpers";

export const AdventureCardContainer = styled.div`
  background: var(--color-background-surface);
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
  background: ${getInteractiveColor("neutral", "background", "default")};
  color: ${getInteractiveColor("neutral", "foreground", "default")};
  border: var(--border-width-interactive) solid
    ${getInteractiveColor("neutral", "border", "default")};

  &:hover {
    background: ${getInteractiveColor("neutral", "background", "hover")};
    color: ${getInteractiveColor("neutral", "foreground", "hover")};
    border-color: ${getInteractiveColor("neutral", "border", "hover")};
  }

  &:active {
    background: ${getInteractiveColor("neutral", "background", "active")};
    color: ${getInteractiveColor("neutral", "foreground", "active")};
    border-color: ${getInteractiveColor("neutral", "border", "active")};
  }

  &:focus-visible {
    background: ${getInteractiveColor("neutral", "background", "focus")};
    color: ${getInteractiveColor("neutral", "foreground", "focus")};
    border-color: ${getInteractiveColor("neutral", "border", "focus")};
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
  background: ${getInteractiveColor("neutral", "background", "default")};
  color: ${getInteractiveColor("neutral", "foreground", "default")};
  border: var(--border-width-interactive) solid
    ${getInteractiveColor("neutral", "border", "default")};

  &:hover {
    background: ${getInteractiveColor("neutral", "background", "hover")};
    color: ${getInteractiveColor("neutral", "foreground", "hover")};
    border-color: ${getInteractiveColor("neutral", "border", "hover")};
  }

  &:active {
    background: ${getInteractiveColor("neutral", "background", "active")};
    color: ${getInteractiveColor("neutral", "foreground", "active")};
    border-color: ${getInteractiveColor("neutral", "border", "active")};
  }

  &:focus-visible {
    background: ${getInteractiveColor("neutral", "background", "focus")};
    color: ${getInteractiveColor("neutral", "foreground", "focus")};
    border-color: ${getInteractiveColor("neutral", "border", "focus")};
    outline-offset: var(--space-1);
  }
`;
