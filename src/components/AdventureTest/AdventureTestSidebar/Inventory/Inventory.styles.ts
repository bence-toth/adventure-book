import styled from "styled-components";
import { getColor } from "@/utils/colorHelpers";

export const InventoryTitle = styled.h2`
  margin: 0 0 var(--space-3) 0;
  font-size: var(--font-size-lg);
`;

export const InventoryEmpty = styled.p`
  margin: 0;
  color: ${getColor({ type: "foreground-muted", variant: "neutral" })};
`;

export const InventoryList = styled.ul`
  list-style-type: "❖";
  padding: 0;
  margin-inline-start: var(--space-2);

  li {
    padding: 0 var(--space-2) var(--space-2);
    margin-bottom: var(--space-2);
  }
`;
