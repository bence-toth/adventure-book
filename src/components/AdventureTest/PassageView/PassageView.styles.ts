import styled from "styled-components";

export const ContentContainer = styled.div`
  max-width: var(--size-content);
  padding: var(--space-5);
`;

export const ContentText = styled.div`
  margin-bottom: var(--space-4);
`;

export const ContentParagraph = styled.p`
  margin-bottom: var(--space-2);
`;

export const PassageNotes = styled.div`
  background: var(--color-background-surface-info);
  border: var(--border-width-surface) solid var(--color-border-surface-info);
  padding: var(--space-2);
  margin-bottom: var(--space-4);
  color: var(--color-foreground-info);
  line-height: var(--line-height-relaxed);
`;

export const Choices = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;
