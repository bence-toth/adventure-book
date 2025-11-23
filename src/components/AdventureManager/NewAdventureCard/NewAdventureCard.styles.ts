import styled from "styled-components";

export const AdventureCardNew = styled.button`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3);
  gap: var(--space-2);
  background: var(--color-interactive-background-default-neutral);
  color: var(--color-interactive-foreground-default-neutral);
  border: var(--border-width-interactive) solid
    var(--color-interactive-border-default-neutral);
  cursor: pointer;
  border-radius: var(--space-1);
  width: 100%;
  aspect-ratio: 1 / 1.414;

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
`;

export const AdventureCardTitle = styled.h2`
  font-size: var(--font-size-lg);
  line-height: var(--line-height-normal);
  color: var(--color-foreground);
  overflow-wrap: break-word;
  font-family: var(--font-family-display);
`;
