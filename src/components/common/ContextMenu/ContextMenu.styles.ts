import styled from "styled-components";

export const MenuContainer = styled.div`
  box-shadow: var(--shadow-surface-elevated-neutral);
  min-width: 150px;
  z-index: 1000;
`;

export const MenuItem = styled.button<{ $variant: "default" | "danger" }>`
  display: block;
  width: 100%;
  padding: var(--space-2) var(--space-3);
  text-align: left;
  cursor: pointer;
  font-size: inherit;
  border-radius: var(--space-1);
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
