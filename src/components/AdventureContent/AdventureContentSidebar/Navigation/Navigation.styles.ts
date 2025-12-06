import styled from "styled-components";

export const NavigationWrapper = styled.nav``;

export const NavigationTitle = styled.h2`
  margin-block-end: var(--space-3);
  font-size: var(--font-size-lg);
`;

export const NavigationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const NavigationItem = styled.li`
  margin-bottom: var(--space-1);
  display: flex;
  flex-direction: column;
  align-items: stretch;

  button {
    justify-content: flex-start;
  }
`;
