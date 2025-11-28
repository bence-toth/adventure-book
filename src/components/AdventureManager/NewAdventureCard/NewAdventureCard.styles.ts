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
  background: ${getInteractiveColor("neutral", "background", "default")};
  color: ${getInteractiveColor("neutral", "foreground", "default")};
  border: var(--border-width-interactive) solid
    ${getInteractiveColor("neutral", "border", "default")};
  cursor: pointer;
  border-radius: var(--space-1);
  width: 100%;
  aspect-ratio: 1 / 1.414;

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

export const AdventureCardTitle = styled.h2`
  font-size: var(--font-size-lg);
  line-height: var(--line-height-normal);
  overflow-wrap: break-word;
  font-family: var(--font-family-display);
`;
