import type { ReactNode, ButtonHTMLAttributes, ComponentType } from "react";
import { createElement } from "react";
import "./Button.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  selected?: boolean;
  icon?: ComponentType<Record<string, unknown>>;
  className?: string;
  variant?: "primary";
  size?: "default" | "small";
}

export const Button = ({
  children,
  selected = false,
  icon,
  className = "",
  variant = "primary",
  size = "default",
  ...props
}: ButtonProps) => {
  const classes = [
    "button",
    `button-${variant}`,
    size === "small" && "button-small",
    selected && "button-selected",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const iconElement = icon
    ? createElement(icon, {
        size: 20,
        strokeWidth: 1.5,
        "aria-hidden": true,
      })
    : null;

  return (
    <button className={classes} {...props}>
      {iconElement && <span className="button-icon">{iconElement}</span>}
      <span className="button-text">{children}</span>
    </button>
  );
};
