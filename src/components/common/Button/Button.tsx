import type { ReactNode, ButtonHTMLAttributes, ComponentType } from "react";
import { createElement, forwardRef } from "react";
import { StyledButton, IconWrapper, TextWrapper } from "./Button.styles";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  selected?: boolean;
  icon?: ComponentType<Record<string, unknown>>;
  className?: string;
  variant?: "primary" | "danger";
  size?: "default" | "small";
  "data-testid"?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      selected = false,
      icon,
      className = "",
      variant = "primary",
      size = "default",
      ...props
    },
    ref
  ) => {
    const iconElement = icon
      ? createElement(icon, {
          size: 20,
          strokeWidth: 1.5,
          "aria-hidden": true,
        })
      : null;

    return (
      <StyledButton
        ref={ref}
        className={className}
        $variant={variant}
        $size={size}
        $selected={selected}
        {...props}
      >
        {iconElement && <IconWrapper>{iconElement}</IconWrapper>}
        <TextWrapper>{children}</TextWrapper>
      </StyledButton>
    );
  }
);

Button.displayName = "Button";
