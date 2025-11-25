import styled from "styled-components";

export const NavigationWrapper = styled.nav``;

export const DebugNavigationTitle = styled.h2`
  margin: var(--space-4) 0 var(--space-3) 0;
  font-size: var(--font-size-lg);
`;

export const DebugNavigationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const DebugNavigationItem = styled.li`
  margin-bottom: var(--space-1);
  display: flex;
  flex-direction: column;
  align-items: stretch;

  button {
    justify-content: flex-start;
  }
`;
