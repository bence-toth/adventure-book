import styled from "styled-components";

export const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-3);
  width: 100%;
  max-width: var(--size-content);
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
