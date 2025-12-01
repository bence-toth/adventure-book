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

  &::-webkit-details-marker,
  &::marker {
    display: none;
  }

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

  ${StyledDetails}[open] > & {
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
    border-color: ${getInteractiveColor({
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
