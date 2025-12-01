import styled from "styled-components";
import { getColor } from "@/utils/colorHelpers";

export const PageLayout = styled.div`
  display: grid;
  grid-template-columns: var(--size-sidebar) 1fr;
  overflow: hidden;
  min-height: 0;
  flex: 1;
`;

export const PageContent = styled.div`
  overflow-y: auto;
  display: grid;
  place-items: center;
  background: ${getColor({ type: "background", variant: "neutral" })};
  min-height: 0;
  padding: var(--space-4);
`;

export const ContentContainer = styled.div`
  max-width: var(--size-content);
  padding: var(--space-5);
`;

export const ContentTitle = styled.h1`
  font-family: var(--font-family-display);
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-4);
  text-wrap: balance;
  text-align: center;
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
