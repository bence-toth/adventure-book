import styled from "styled-components";

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

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;
