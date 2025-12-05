import styled from "styled-components";
import { getColor } from "@/utils/colorHelpers";

export const EditFooter = styled.div`
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
  display: flex;
  flex-direction: row-reverse;
  gap: var(--space-1);
  justify-content: flex-start;
`;
