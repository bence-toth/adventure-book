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
    ${getColor("border", "neutral", true)};
  background-color: ${getColor("background", "neutral", true)};
  box-shadow: ${getColor("shadow", "neutral", true)};
`;
