import styled from "styled-components";

export const AdventureManagerContainer = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
`;

export const AdventureManagerLoading = styled.div`
  text-align: center;
`;

export const AdventureManagerList = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--size-adventure-card), 1fr)
  );
  gap: var(--space-4);
`;
