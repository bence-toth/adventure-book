import styled from "styled-components";

export const AppContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
  overflow: hidden;
`;

export const AppMain = styled.main`
  display: grid;
  grid-template-columns: var(--size-sidebar) 1fr;
  overflow: hidden;
  min-height: 0;
`;

export const AppContent = styled.main`
  overflow-y: auto;
  display: grid;
  place-items: stretch;
  background: var(--color-background-neutral);
  min-height: 0;
`;
