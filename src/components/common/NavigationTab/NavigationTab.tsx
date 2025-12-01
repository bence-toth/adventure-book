import type { ReactNode, ComponentType } from "react";
import { createElement } from "react";
import type { LinkProps } from "react-router-dom";
import { StyledLink, IconWrapper, TextWrapper } from "./NavigationTab.styles";

interface NavigationTabProps extends Omit<LinkProps, "className"> {
  children: ReactNode;
  icon?: ComponentType<Record<string, unknown>>;
  className?: string;
  variant?: "neutral" | "primary";
  "data-testid"?: string;
}

export const NavigationTab = ({
  children,
  icon,
  className,
  variant,
  "data-testid": dataTestId,
  ...props
}: NavigationTabProps) => {
  const iconElement = icon
    ? createElement(icon, {
        size: 20,
        strokeWidth: 2,
        "aria-hidden": true,
      })
    : null;

  return (
    <StyledLink
      className={className}
      $variant={variant ?? "neutral"}
      data-testid={dataTestId}
      aria-current={variant === "primary" ? "page" : undefined}
      {...props}
    >
      {iconElement && <IconWrapper>{iconElement}</IconWrapper>}
      <TextWrapper>{children}</TextWrapper>
    </StyledLink>
  );
};
