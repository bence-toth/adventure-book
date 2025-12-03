import styled from "styled-components";
import { getColor } from "@/utils/colorHelpers";

export const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-3);
  width: 100%;
  max-width: var(--size-content);
`;

export const EditTitle = styled.h1`
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: ${getColor({ type: "foreground", variant: "neutral" })};
  margin: 0;
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-1);
  justify-content: flex-start;
`;
