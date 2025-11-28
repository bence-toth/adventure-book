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
  color: ${getColor({ type: "foreground", variant: "neutral" })};
  min-width: var(--size-title-input-min-width);
  field-sizing: content;

  &:hover {
    border-color: ${getInteractiveColor({
      variant: "neutral",
      type: "border",
      state: "hover",
    })};
  }

  &:focus-visible {
    border-color: ${getInteractiveColor({
      variant: "neutral",
      type: "border",
      state: "focus",
    })};
    outline-offset: var(--space-1);
  }
`;
