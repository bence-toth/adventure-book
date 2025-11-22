import styled from "styled-components";

export const IntroductionPageContent = styled.div`
  display: grid;
  place-items: center;
  padding: var(--space-4);
`;

export const IntroductionContainer = styled.div`
  max-width: var(--size-content);
  padding: var(--space-5);
  text-align: center;
`;

export const IntroductionTitle = styled.h1`
  font-family: var(--font-family-display);
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-4);
  text-wrap: balance;
`;

export const IntroText = styled.div`
  margin-bottom: var(--space-5);
  text-align: start;
`;

export const IntroParagraph = styled.p`
  margin-bottom: var(--space-2);
`;

export const IntroAction = styled.div`
  text-align: center;
`;
