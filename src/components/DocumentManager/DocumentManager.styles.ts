import styled from "styled-components";

export const DocumentManagerContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: var(--space-4);
`;

export const DocumentManagerLoading = styled.div`
  text-align: center;
`;

export const DocumentManagerError = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const DocumentManagerList = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--size-document-card), 1fr)
  );
  gap: var(--space-4);
`;
