import styled from "styled-components";

export const PageLayout = styled.div`
  display: grid;
  grid-template-columns: var(--size-sidebar) 1fr;
  overflow: hidden;
  min-height: 0;
  height: 100%;
`;

export const PageContent = styled.div`
  overflow-y: auto;
  display: grid;
  place-items: center;
  background: var(--color-background-neutral);
  min-height: 0;
  padding: var(--space-4);
`;

export const PassageContainer = styled.div`
  max-width: var(--size-content);
  padding: var(--space-5);
`;

export const PassageText = styled.div`
  margin-bottom: var(--space-4);
`;

export const PassageParagraph = styled.p`
  margin-bottom: var(--space-2);
`;

export const Choices = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

export const ErrorContainer = styled.div`
  text-align: center;
  padding: var(--space-4);
  max-width: var(--size-content);
`;

export const ErrorTitle = styled.h2`
  font-family: var(--font-family-display);
  font-size: var(--font-size-xl);
  color: var(--color-foreground-danger);
  margin-top: 0;
  margin-bottom: var(--space-3);
`;

export const ErrorMessage = styled.p`
  margin-bottom: var(--space-4);
`;
