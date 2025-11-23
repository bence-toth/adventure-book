import styled from "styled-components";

export const AdventureManagerContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: var(--space-4);
`;

export const AdventureManagerLoading = styled.div`
  text-align: center;
`;

export const AdventureManagerError = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const AdventureManagerList = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--size-adventure-card), 1fr)
  );
  gap: var(--space-4);
`;
