import styled from "styled-components";

export const SidebarLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: var(--space-2);
`;
