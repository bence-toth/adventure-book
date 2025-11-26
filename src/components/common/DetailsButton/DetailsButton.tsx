import type { ReactNode, ComponentType, DetailsHTMLAttributes } from "react";
import { createElement } from "react";
import {
  StyledDetails,
  StyledSummary,
  IconWrapper,
  TextWrapper,
} from "./DetailsButton.styles";

interface DetailsButtonProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
  summary: string;
  children: ReactNode;
  icon?: ComponentType<Record<string, unknown>>;
  className?: string;
  summaryClassName?: string;
  "data-testid"?: string;
}

export const DetailsButton = ({
  summary,
  children,
  icon,
  className,
  summaryClassName,
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
      <StyledSummary className={summaryClassName}>
        {iconElement && <IconWrapper>{iconElement}</IconWrapper>}
        <TextWrapper>{summary}</TextWrapper>
      </StyledSummary>
      {children}
    </StyledDetails>
  );
};
