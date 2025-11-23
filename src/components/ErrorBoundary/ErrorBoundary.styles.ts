import styled from "styled-components";

export const ErrorBoundaryContainer = styled.div`
  max-width: var(--size-content);
  padding: var(--space-5);
  text-align: center;
  margin: 0 auto;
`;

export const ErrorBoundaryIcon = styled.div`
  color: var(--color-foreground-danger);
  margin-bottom: var(--space-3);
  display: flex;
  justify-content: center;
`;

export const ErrorBoundaryTitle = styled.h1`
  color: var(--color-foreground-danger);
  margin-bottom: var(--space-3);
  font-family: var(--font-family-display);
  font-size: var(--font-size-xl);
`;

export const ErrorBoundaryDescription = styled.p`
  margin-bottom: var(--space-4);
  color: var(--color-foreground);
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
    var(--color-border-surface-neutral);
`;

export const ErrorBoundaryHelpText = styled.p`
  margin-bottom: var(--space-2);
`;

export const ErrorBoundaryDetails = styled.div`
  text-align: center;
  margin-block: var(--space-3);
`;

export const ErrorBoundaryDetailsContent = styled.pre<{ isError?: boolean }>`
  font-family: var(--font-family-monospace);
  text-align: start;
  font-size: var(--font-size-sm);
  background: ${(props) =>
    props.isError
      ? "var(--color-background-surface-danger)"
      : "var(--color-background-surface-neutral)"};
  border: var(--border-width-surface) solid
    ${(props) =>
      props.isError
        ? "var(--color-border-surface-danger)"
        : "var(--color-border-surface-neutral)"};
  border-radius: calc(var(--space-1) / 2);
  padding: var(--space-2);
  margin: var(--space-2) 0;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  color: ${(props) =>
    props.isError
      ? "var(--color-foreground-danger)"
      : "var(--color-foreground)"};
  line-height: ${(props) =>
    props.isError ? "var(--line-height-normal)" : "var(--line-height-loose)"};

  pre {
    font-family: inherit;
  }
`;

export const ErrorBoundaryDetailsStack = styled.div`
  color: var(--color-foreground);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-loose);
`;
