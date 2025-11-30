import styled from "styled-components";
import { getColor, getInteractiveColor } from "@/utils/colorHelpers";

export const DropAreaContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const DropAreaOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${getInteractiveColor({
    type: "background",
    variant: "neutral",
    state: "hover",
  })};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border: var(--border-width-interactive) dashed
    ${getColor({ type: "foreground", variant: "neutral" })};
  border-radius: var(--space-1);
  margin: var(--space-4);
`;

export const DropAreaContent = styled.div`
  font-weight: 500;
  color: ${getInteractiveColor({
    type: "foreground",
    variant: "neutral",
    state: "hover",
  })};
  padding: var(--space-2);
`;
