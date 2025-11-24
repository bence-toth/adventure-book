import styled from "styled-components";

export const InventoryTitle = styled.h2`
  margin-top: 0;
  margin-bottom: var(--space-2);
  font-size: var(--font-size-lg);
`;

export const InventoryEmpty = styled.p`
  margin: var(--space-2) 0;
`;

export const InventoryList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: var(--space-2) 0;
`;
