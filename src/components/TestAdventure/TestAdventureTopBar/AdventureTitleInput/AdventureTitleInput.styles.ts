import styled from "styled-components";
import { getColor, getInteractiveColor } from "@/utils/colorHelpers";

export const TopBarTitleInput = styled.input`
  font-family: var(--font-family-display);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-dense);
  background: transparent;
  border: var(--border-width-interactive) solid transparent;
  padding: var(--space-0) var(--space-1);
  margin: calc(-1 * var(--space-0)) calc(-1 * var(--space-1));
  color: ${getColor("foreground", "neutral")};
  min-width: var(--size-title-input-min-width);
  field-sizing: content;

  &:hover {
    border-color: ${getInteractiveColor("neutral", "border", "hover")};
  }

  &:focus-visible {
    border-color: ${getInteractiveColor("neutral", "border", "focus")};
    outline-offset: var(--space-1);
  }
`;
