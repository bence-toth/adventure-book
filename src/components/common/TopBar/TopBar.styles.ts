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

export const TopBarStart = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex-grow: 1;
`;

export const TopBarEnd = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;
