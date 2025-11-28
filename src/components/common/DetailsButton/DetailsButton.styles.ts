import styled from "styled-components";
import { getInteractiveColor } from "@/utils/colorHelpers";

export const StyledDetails = styled.details``;

export const StyledSummary = styled.summary`
  list-style: none;
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  line-height: var(--line-height-dense);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--space-1);
  text-decoration: none;
  background: ${getInteractiveColor("neutral", "background", "default")};
  color: ${getInteractiveColor("neutral", "foreground", "default")};
  border: var(--border-width-interactive) solid
    ${getInteractiveColor("neutral", "border", "default")};

  &::-webkit-details-marker,
  &::marker {
    display: none;
  }

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

  ${StyledDetails}[open] > & {
    background: ${getInteractiveColor("neutral", "background", "default")};
    color: ${getInteractiveColor("neutral", "foreground", "default")};
    border-color: ${getInteractiveColor("neutral", "border", "default")};

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
  font-weight: 500;
`;
