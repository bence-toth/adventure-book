import type { ReactNode, ButtonHTMLAttributes, ComponentType } from "react";
import { createElement, forwardRef } from "react";
import { StyledButton, IconWrapper, TextWrapper } from "./Button.styles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  icon?: ComponentType<Record<string, unknown>>;
  className?: string;
  variant?: "neutral" | "danger" | "primary";
  size?: "default" | "small";
  "data-testid"?: string;
  "aria-label"?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, icon, className, variant, size, ...props }, ref) => {
    const iconElement = icon
      ? createElement(icon, {
          size: 20,
          strokeWidth: 2,
          "aria-hidden": true,
        })
      : null;

    return (
      <StyledButton
        ref={ref}
        className={className}
        $variant={variant ?? "neutral"}
        $size={size ?? "default"}
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
