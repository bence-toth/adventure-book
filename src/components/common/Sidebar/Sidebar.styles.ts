import styled from "styled-components";

export const SidebarContainer = styled.div`
  position: relative;
  z-index: 1;
  background-color: var(--color-background-surface-neutral);
  border-inline-end: var(--border-width-surface) solid
    var(--color-border-surface-neutral);
  box-shadow: var(--shadow-surface-neutral);
  overflow-y: auto;
  min-height: 0;
  padding: var(--space-2);
`;
