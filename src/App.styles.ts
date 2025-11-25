import styled from "styled-components";

export const AppContainer = styled.div`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const AppMain = styled.main`
  display: grid;
  grid-template-columns: var(--size-sidebar) 1fr;
  overflow: hidden;
  min-height: 0;
`;

export const AppContent = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-background-neutral);
`;
