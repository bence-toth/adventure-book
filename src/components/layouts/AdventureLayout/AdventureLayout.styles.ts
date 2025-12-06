import styled from "styled-components";
import { getColor } from "@/utils/colorHelpers";

export const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: var(--size-sidebar) 1fr;
  overflow: hidden;
  min-height: 0;
  flex: 1;
`;

export const MainContent = styled.main`
  overflow-y: auto;
  display: grid;
  place-items: center;
  background: ${getColor({ type: "background", variant: "neutral" })};
  min-height: 0;
`;
