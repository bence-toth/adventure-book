import type { ReactNode, ButtonHTMLAttributes, ComponentType } from "react";
import { createElement, forwardRef } from "react";
import { StyledButton, IconWrapper, TextWrapper } from "./Button.styles";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  selected?: boolean;
  icon?: ComponentType<Record<string, unknown>>;
  className?: string;
  variant?: "neutral" | "danger";
  size?: "default" | "small";
  "data-testid"?: string;
  "aria-label"?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, selected, icon, className, variant, size, ...props }, ref) => {
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
        $variant={variant ?? "neutral"}
        $size={size ?? "default"}
        $selected={selected ?? false}
        $hasChildren={!!children}
        {...props}
      >
        {iconElement && <IconWrapper>{iconElement}</IconWrapper>}
        {children && <TextWrapper>{children}</TextWrapper>}
      </StyledButton>
    );
  }
);

Button.displayName = "Button";
