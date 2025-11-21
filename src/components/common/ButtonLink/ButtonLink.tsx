import type { ReactNode, ComponentType } from "react";
import { createElement } from "react";
import type { LinkProps } from "react-router-dom";
import { StyledLink, IconWrapper, TextWrapper } from "./ButtonLink.styles";

export interface ButtonLinkProps extends Omit<LinkProps, "className"> {
  children: ReactNode;
  selected?: boolean;
  icon?: ComponentType<Record<string, unknown>>;
  className?: string;
  variant?: "primary";
  size?: "default" | "small";
}

export const ButtonLink = ({
  children,
  selected = false,
  icon,
  className = "",
  variant = "primary",
  size = "default",
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
      $size={size}
      $selected={selected}
      {...props}
    >
      {iconElement && <IconWrapper>{iconElement}</IconWrapper>}
      <TextWrapper>{children}</TextWrapper>
    </StyledLink>
  );
};
