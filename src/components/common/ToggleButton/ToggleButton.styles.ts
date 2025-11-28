import styled from "styled-components";
import { getColor, getInteractiveColor } from "@/utils/colorHelpers";

export const ToggleButtonContainer = styled.label`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  user-select: none;
`;

export const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

export const ToggleTrack = styled.span<{ $checked: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: var(--size-toggle-button-width);
  height: var(--size-toggle-button-height);
  border-radius: calc(var(--size-toggle-button-height) * 0.5);
  background: ${(props) =>
    props.$checked
      ? getInteractiveColor("neutral", "background", "active")
      : getInteractiveColor("neutral", "background", "default")};
  border: var(--border-width-interactive) solid
    ${(props) =>
      props.$checked
        ? getInteractiveColor("neutral", "border", "active")
        : getInteractiveColor("neutral", "border", "default")};
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  ${ToggleButtonContainer}:hover & {
    background: ${(props) =>
      props.$checked
        ? getInteractiveColor("neutral", "background", "active")
        : getInteractiveColor("neutral", "background", "hover")};
    border-color: ${(props) =>
      props.$checked
        ? getInteractiveColor("neutral", "border", "active")
        : getInteractiveColor("neutral", "border", "hover")};
  }

  ${HiddenCheckbox}:focus-visible + & {
    outline: var(--border-width-interactive) solid
      ${getInteractiveColor("neutral", "outline", "focus")};
    outline-offset: var(--space-1);
  }
`;

export const ToggleThumb = styled.span<{ $checked: boolean }>`
  position: absolute;
  aspect-ratio: 1 / 1;
  height: calc(100% - calc(2 * var(--border-width-interactive)));
  border-radius: 50%;
  background: ${getInteractiveColor("neutral", "foreground", "default")};
  box-shadow: 0 var(--space-0-25) var(--space-0-5)
    ${getColor("shadow", "neutral", true)};
  transform: ${(props) =>
    props.$checked
      ? `
        translateX(var(--size-toggle-button-width))
        translateX(-100%)
        translateX(calc(-3 * var(--border-width-interactive)))
        `
      : "translateX(var(--border-width-interactive))"};
  transition: transform 0.2s ease;
`;

export const LabelText = styled.span`
  line-height: var(--line-height-dense);
  color: ${getColor("foreground", "neutral")};
`;
