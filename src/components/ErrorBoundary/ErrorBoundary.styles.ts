import styled from "styled-components";
import { getColor } from "@/utils/colorHelpers";

export const ErrorBoundaryContainer = styled.div`
  max-width: var(--size-content);
  padding: var(--space-5);
  text-align: center;
  margin: 0 auto;
`;

export const ErrorBoundaryIcon = styled.div`
  color: ${getColor("foreground", "danger")};
  margin-bottom: var(--space-3);
  display: flex;
  justify-content: center;
`;

export const ErrorBoundaryTitle = styled.h1`
  color: ${getColor("foreground", "danger")};
  margin-bottom: var(--space-3);
  font-family: var(--font-family-display);
  font-size: var(--font-size-xl);
`;

export const ErrorBoundaryDescription = styled.p`
  margin-bottom: var(--space-4);
  text-wrap: balance;
`;

export const ErrorBoundaryActions = styled.div`
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
`;

export const ErrorBoundaryHelp = styled.div`
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: var(--border-width-surface) solid
    ${getColor("border", "neutral", true)};
`;

export const ErrorBoundaryHelpText = styled.p`
  margin-bottom: var(--space-2);
`;

export const ErrorBoundaryDetailsContent = styled.pre<{ $isError?: boolean }>`
  font-family: var(--font-family-monospace);
  text-align: start;
  font-size: var(--font-size-sm);
  background: ${(props) =>
    props.$isError
      ? getColor("background", "danger", true)
      : getColor("background", "neutral", true)};
  border: var(--border-width-surface) solid
    ${(props) =>
      props.$isError
        ? getColor("border", "danger", true)
        : getColor("border", "neutral", true)};
  border-radius: calc(var(--space-1) / 2);
  padding: var(--space-2);
  margin: var(--space-2) 0;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  color: ${(props) =>
    props.$isError
      ? getColor("foreground", "danger")
      : getColor("foreground", "neutral")};
  line-height: ${(props) =>
    props.$isError ? "var(--line-height-normal)" : "var(--line-height-loose)"};
  pre {
    font-family: inherit;
  }
`;
