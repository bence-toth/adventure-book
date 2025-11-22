import styled from "styled-components";

export const StyledDetails = styled.details``;

export const StyledSummary = styled.summary<{ $variant: "primary" }>`
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
  background: var(--color-interactive-background-default-neutral);
  color: var(--color-interactive-foreground-default-neutral);
  border: var(--border-width-interactive) solid
    var(--color-interactive-border-default-neutral);

  &::-webkit-details-marker,
  &::marker {
    display: none;
  }

  &:hover {
    background: var(--color-interactive-background-hover-neutral);
    color: var(--color-interactive-foreground-hover-neutral);
    border-color: var(--color-interactive-border-hover-neutral);
  }

  &:active {
    background: var(--color-interactive-background-active-neutral);
    color: var(--color-interactive-foreground-active-neutral);
    border-color: var(--color-interactive-border-active-neutral);
  }

  &:focus-visible {
    background: var(--color-interactive-background-focus-neutral);
    color: var(--color-interactive-foreground-focus-neutral);
    border-color: var(--color-interactive-border-focus-neutral);
    outline-offset: var(--space-1);
  }

  ${StyledDetails}[open] > & {
    background: var(--color-interactive-background-default-neutral);
    color: var(--color-interactive-foreground-default-neutral);
    border-color: var(--color-interactive-border-default-neutral);

    &:hover {
      background: var(--color-interactive-background-hover-neutral);
      color: var(--color-interactive-foreground-hover-neutral);
      border-color: var(--color-interactive-border-hover-neutral);
    }

    &:active {
      background: var(--color-interactive-background-active-neutral);
      color: var(--color-interactive-foreground-active-neutral);
      border-color: var(--color-interactive-border-active-neutral);
    }

    &:focus-visible {
      background: var(--color-interactive-background-focus-neutral);
      color: var(--color-interactive-foreground-focus-neutral);
      border-color: var(--color-interactive-border-focus-neutral);
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
`;
