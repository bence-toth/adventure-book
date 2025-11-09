import type { ReactNode, ComponentType } from "react";
import { createElement } from "react";
import { Link } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import "./Button.css";

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
    <Link className={classes} {...props}>
      {iconElement && <span className="button-icon">{iconElement}</span>}
      <span className="button-text">{children}</span>
    </Link>
  );
};
