import type { ReactNode, ButtonHTMLAttributes, ComponentType } from "react";
import { createElement, forwardRef } from "react";
import styled from "styled-components";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  selected?: boolean;
  icon?: ComponentType<Record<string, unknown>>;
  className?: string;
  variant?: "primary" | "danger";
  size?: "default" | "small";
}

const StyledButton = styled.button<{
  $variant: "primary" | "danger";
  $size: "default" | "small";
  $selected: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  font-family: inherit;
  font-size: inherit;
  font-weight: 400;
  line-height: var(--line-height-dense);
  padding: ${(props) =>
    props.$size === "small"
      ? "var(--space-1) var(--space-2)"
      : "var(--space-2) var(--space-3)"};
  border-radius: var(--space-1);
  cursor: pointer;
  text-decoration: none;
  background: ${(props) =>
    props.$variant === "danger"
      ? "var(--color-interactive-background-default-danger)"
      : "var(--color-interactive-background-default-neutral)"};
  color: ${(props) =>
    props.$variant === "danger"
      ? "var(--color-interactive-foreground-default-danger)"
      : "var(--color-interactive-foreground-default-neutral)"};
  border: var(--border-width-hairline) solid
    ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-border-default-danger)"
        : "var(--color-interactive-border-default-neutral)"};

  &:hover {
    background: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-background-hover-danger)"
        : "var(--color-interactive-background-hover-neutral)"};
    color: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-foreground-hover-danger)"
        : "var(--color-interactive-foreground-hover-neutral)"};
    border-color: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-border-hover-danger)"
        : "var(--color-interactive-border-hover-neutral)"};
  }

  &:active {
    background: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-background-active-danger)"
        : "var(--color-interactive-background-active-neutral)"};
    color: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-foreground-active-danger)"
        : "var(--color-interactive-foreground-active-neutral)"};
    border-color: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-border-active-danger)"
        : "var(--color-interactive-border-active-neutral)"};
  }

  &:focus-visible {
    background: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-background-focus-danger)"
        : "var(--color-interactive-background-focus-neutral)"};
    color: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-foreground-focus-danger)"
        : "var(--color-interactive-foreground-focus-neutral)"};
    border-color: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-border-focus-danger)"
        : "var(--color-interactive-border-focus-neutral)"};
    outline-offset: var(--space-1);
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
