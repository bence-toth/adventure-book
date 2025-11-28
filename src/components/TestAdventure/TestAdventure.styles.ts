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
  background: ${getColor("background", "neutral")};
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

export const Choices = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;
