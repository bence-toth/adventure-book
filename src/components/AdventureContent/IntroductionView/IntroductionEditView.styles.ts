import styled from "styled-components";
import { getColor } from "@/utils/colorHelpers";

export const EditViewLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

export const EditScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  display: grid;
  place-items: center;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: var(--size-content);
`;

export const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-3);
`;

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

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;
