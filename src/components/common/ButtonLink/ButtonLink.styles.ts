import styled from "styled-components";
import { Link } from "react-router-dom";

export const StyledLink = styled(Link)<{
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
  background: var(--color-interactive-background-default-neutral);
  color: var(--color-interactive-foreground-default-neutral);
  border: var(--border-width-hairline) solid
    var(--color-interactive-border-default-neutral);

  &:hover {
    background: var(--color-interactive-background-hover-neutral);
    color: var(--color-interactive-foreground-hover-neutral);
    border-color: var(--color-interactive-border-hover-neutral);
  }

  &:active {
    background: var(--color-interactive-background-active-neutral);
    color: var(--color-interactive-foreground-active-neutral);
    border-color: var(--color-interactive-border-active-neutral);
  }

  &:focus-visible {
    background: var(--color-interactive-background-focus-neutral);
    color: var(--color-interactive-foreground-focus-neutral);
    border-color: var(--color-interactive-border-focus-neutral);
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
