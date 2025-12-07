import styled from "styled-components";
import { getColor } from "@/utils/colorHelpers";

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

export const SidebarFooter = styled.div`
  padding: var(--space-2);
  border-block-start: var(--border-width-surface) solid
    ${getColor({ type: "border", variant: "neutral", isSurface: true })};
  background-color: ${getColor({
    type: "background",
    variant: "neutral",
    isSurface: true,
  })};
  box-shadow: ${getColor({
    type: "shadow",
    variant: "neutral",
    isSurface: true,
  })};
`;
