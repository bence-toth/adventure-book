import styled from "styled-components";

export const TopBarContainer = styled.div`
  background: var(--color-background-surface-neutral);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  border-bottom: var(--border-width-surface) solid
    var(--color-border-surface-neutral);
  box-shadow: var(--shadow-surface-neutral);
  position: relative;
  z-index: 2;
  height: var(--size-top-bar);
`;

export const TopBarLogo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex-grow: 1;
`;

export const TopBarLogoIcon = styled.div`
  display: flex;
  font-size: var(--font-size-xl);
  line-height: 1;
`;

export const TopBarTitle = styled.h1`
  font-family: var(--font-family-display);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-dense);
`;

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

export const TopBarNav = styled.nav`
  display: flex;
  gap: var(--space-2);
`;
