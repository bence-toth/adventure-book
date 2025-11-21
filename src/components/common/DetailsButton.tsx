import type { ReactNode, ComponentType, DetailsHTMLAttributes } from "react";
import { createElement } from "react";
import "./DetailsButton.css";

export interface DetailsButtonProps
  extends DetailsHTMLAttributes<HTMLDetailsElement> {
  summary: string;
  children: ReactNode;
  icon?: ComponentType<Record<string, unknown>>;
  className?: string;
  summaryClassName?: string;
  variant?: "primary";
}

export const DetailsButton = ({
  summary,
  children,
  icon,
  className = "",
  summaryClassName = "",
  variant = "primary",
  ...props
}: DetailsButtonProps) => {
  const summaryClasses = ["button", `button-${variant}`, summaryClassName]
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
    <details className={className} {...props}>
      <summary className={summaryClasses}>
        {iconElement && <span className="button-icon">{iconElement}</span>}
        <span className="button-text">{summary}</span>
      </summary>
      {children}
    </details>
  );
};
