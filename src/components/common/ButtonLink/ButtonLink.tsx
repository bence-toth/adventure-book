import type { ReactNode, ComponentType } from "react";
import { createElement } from "react";
import type { LinkProps } from "react-router-dom";
import { StyledLink, IconWrapper, TextWrapper } from "./ButtonLink.styles";

export interface ButtonLinkProps extends Omit<LinkProps, "className"> {
  children: ReactNode;
  icon?: ComponentType<Record<string, unknown>>;
  className?: string;
  variant?: "neutral" | "primary";
  size?: "default" | "small";
  "data-testid"?: string;
}

export const ButtonLink = ({
  children,
  icon,
  className,
  variant,
  size,
  "data-testid": dataTestId,
  ...props
}: ButtonLinkProps) => {
  const iconElement = icon
    ? createElement(icon, {
        size: 20,
        strokeWidth: 1.5,
        "aria-hidden": true,
      })
    : null;

  return (
    <StyledLink
      className={className}
      $size={size ?? "default"}
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
