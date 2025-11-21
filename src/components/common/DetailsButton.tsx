import type { ReactNode, ComponentType, DetailsHTMLAttributes } from "react";
import { createElement } from "react";
import styled from "styled-components";

const StyledDetails = styled.details``;

const StyledSummary = styled.summary<{ $variant: "primary" }>`
  list-style: none;
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  font-family: inherit;
  font-size: inherit;
  font-weight: 400;
  line-height: var(--line-height-dense);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--space-1);
  text-decoration: none;
  background: var(--color-interactive-background-default-neutral);
  color: var(--color-interactive-foreground-default-neutral);
  border: var(--border-width-hairline) solid
    var(--color-interactive-border-default-neutral);

  &::-webkit-details-marker,
  &::marker {
    display: none;
  }

  &:hover {
    background: var(--color-interactive-background-hover-neutral);
    color: var(--color-interactive-foreground-hover-neutral);
    border-color: var(--color-interactive-border-hover-neutral);
  }

  &:active {
    background: var(--color-interactive-background-active-neutral);
    color: var(--color-interactive-foreground-active-neutral);
    border-color: var(--color-interactive-border-active-neutral);
  }

  &:focus-visible {
    background: var(--color-interactive-background-focus-neutral);
    color: var(--color-interactive-foreground-focus-neutral);
    border-color: var(--color-interactive-border-focus-neutral);
    outline-offset: var(--space-1);
  }

  ${StyledDetails}[open] > & {
    background: var(--color-interactive-background-default-neutral);
    color: var(--color-interactive-foreground-default-neutral);
    border-color: var(--color-interactive-border-default-neutral);

    &:hover {
      background: var(--color-interactive-background-hover-neutral);
      color: var(--color-interactive-foreground-hover-neutral);
      border-color: var(--color-interactive-border-hover-neutral);
    }

    &:active {
      background: var(--color-interactive-background-active-neutral);
      color: var(--color-interactive-foreground-active-neutral);
      border-color: var(--color-interactive-border-active-neutral);
    }

    &:focus-visible {
      background: var(--color-interactive-background-focus-neutral);
      color: var(--color-interactive-foreground-focus-neutral);
      border-color: var(--color-interactive-border-focus-neutral);
      outline-offset: var(--space-1);
    }
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

const TextWrapper = styled.span`
  display: inline-block;
`;

export interface DetailsButtonProps
  extends DetailsHTMLAttributes<HTMLDetailsElement> {
  summary: string;
  children: ReactNode;
  icon?: ComponentType<Record<string, unknown>>;
  className?: string;
  summaryClassName?: string;
  variant?: "primary";
}

export const DetailsButton = ({
  summary,
  children,
  icon,
  className = "",
  summaryClassName = "",
  variant = "primary",
  ...props
}: DetailsButtonProps) => {
  const iconElement = icon
    ? createElement(icon, {
        size: 20,
        strokeWidth: 1.5,
        "aria-hidden": true,
      })
    : null;

  return (
    <StyledDetails className={className} {...props}>
      <StyledSummary $variant={variant} className={summaryClassName}>
        {iconElement && <IconWrapper>{iconElement}</IconWrapper>}
        <TextWrapper>{summary}</TextWrapper>
      </StyledSummary>
      {children}
    </StyledDetails>
  );
};
