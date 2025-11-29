import styled from "styled-components";
import { getColor } from "@/utils/colorHelpers";

export const SidebarContainer = styled.div`
  position: relative;
  z-index: 1;
  background-color: ${getColor({
    type: "background",
    variant: "neutral",
    isSurface: true,
  })};
  border-inline-end: var(--border-width-surface) solid
    ${getColor({ type: "border", variant: "neutral", isSurface: true })};
  box-shadow: ${getColor({
    type: "shadow",
    variant: "neutral",
    isSurface: true,
  })};
  overflow: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;
