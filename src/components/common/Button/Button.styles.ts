import styled from "styled-components";

export const StyledButton = styled.button<{
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

export const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

export const TextWrapper = styled.span`
  display: inline-block;
`;
