import styled from "styled-components";
import { getColor } from "@/utils/colorHelpers";

export const SidebarContainer = styled.div`
  position: relative;
  z-index: 1;
  background-color: ${getColor("background", "neutral", true)};
  border-inline-end: var(--border-width-surface) solid
    ${getColor("border", "neutral", true)};
  box-shadow: ${getColor("shadow", "neutral", true)};
  overflow-y: auto;
  min-height: 0;
  padding: var(--space-2);
`;
