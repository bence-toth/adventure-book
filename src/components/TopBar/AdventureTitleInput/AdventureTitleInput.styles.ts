import styled from "styled-components";

export const TopBarTitleInput = styled.input`
  font-family: var(--font-family-display);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-dense);
  background: transparent;
  border: var(--border-width-interactive) solid transparent;
  padding: var(--space-0) var(--space-1);
  margin: calc(-1 * var(--space-0)) calc(-1 * var(--space-1));
  color: var(--color-foreground-neutral);
  min-width: var(--size-title-input-min-width);
  field-sizing: content;

  &:hover {
    border-color: var(--color-interactive-border-hover-neutral);
  }

  &:focus-visible {
    border-color: var(--color-interactive-border-focus-neutral);
    outline-offset: var(--space-1);
  }
`;
