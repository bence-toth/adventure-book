import type { ReactNode, ComponentType } from "react";
import { createElement } from "react";
import type { LinkProps } from "react-router-dom";
import { StyledLink, IconWrapper, TextWrapper } from "./ButtonLink.styles";

export interface ButtonLinkProps extends Omit<LinkProps, "className"> {
  children: ReactNode;
  selected?: boolean;
  icon?: ComponentType<Record<string, unknown>>;
  className?: string;
  size?: "default" | "small";
  "data-testid"?: string;
}

export const ButtonLink = ({
  children,
  selected = false,
  icon,
  className = "",
  size = "default",
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
      $size={size}
      $selected={selected}
      data-testid={dataTestId}
      aria-current={selected ? "page" : undefined}
      {...props}
    >
      {iconElement && <IconWrapper>{iconElement}</IconWrapper>}
      <TextWrapper>{children}</TextWrapper>
    </StyledLink>
  );
};
