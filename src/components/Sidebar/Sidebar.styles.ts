import styled from "styled-components";

export const SidebarContainer = styled.div`
  position: relative;
  z-index: 1;
  background-color: var(--color-background-surface-neutral);
  border-right: var(--border-width-surface) solid
    var(--color-border-surface-neutral);
  box-shadow: var(--shadow-surface-neutral);
  overflow-y: auto;
  min-height: 0;
  padding: var(--space-2);
`;

export const SidebarTitle = styled.h2`
  margin-top: 0;
  margin-bottom: var(--space-2);
  font-size: var(--font-size-lg);
`;

export const SidebarInventoryEmpty = styled.p`
  margin: var(--space-2) 0;
`;

export const SidebarInventory = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: var(--space-2) 0;
`;
