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

export const ToggleTrack = styled.span<{ $isChecked: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: var(--size-toggle-button-width);
  height: var(--size-toggle-button-height);
  border-radius: calc(var(--size-toggle-button-height) * 0.5);
  background: ${(props) =>
    props.$isChecked
      ? getInteractiveColor({
          variant: "neutral",
          type: "background",
          state: "active",
        })
      : getInteractiveColor({
          variant: "neutral",
          type: "background",
          state: "default",
        })};
  border: var(--border-width-interactive) solid
    ${(props) =>
      props.$isChecked
        ? getInteractiveColor({
            variant: "neutral",
            type: "border",
            state: "active",
          })
        : getInteractiveColor({
            variant: "neutral",
            type: "border",
            state: "default",
          })};
  transition:
    background-color var(--duration-medium) ease,
    border-color var(--duration-medium) ease;

  ${ToggleButtonContainer}:hover & {
    background: ${(props) =>
      props.$isChecked
        ? getInteractiveColor({
            variant: "neutral",
            type: "background",
            state: "active",
          })
        : getInteractiveColor({
            variant: "neutral",
            type: "background",
            state: "hover",
          })};
    border-color: ${(props) =>
      props.$isChecked
        ? getInteractiveColor({
            variant: "neutral",
            type: "border",
            state: "active",
          })
        : getInteractiveColor({
            variant: "neutral",
            type: "border",
            state: "hover",
          })};
  }

  ${HiddenCheckbox}:focus-visible + & {
    outline: var(--border-width-interactive) solid
      ${getInteractiveColor({
        variant: "neutral",
        type: "outline",
        state: "focus",
      })};
    outline-offset: var(--space-1);
  }
`;

export const ToggleThumb = styled.span<{ $isChecked: boolean }>`
  position: absolute;
  aspect-ratio: 1 / 1;
  height: calc(100% - calc(2 * var(--border-width-interactive)));
  border-radius: 50%;
  background: ${getInteractiveColor({
    variant: "neutral",
    type: "foreground",
    state: "default",
  })};
  box-shadow: 0 var(--space-0-25) var(--space-0-5)
    ${getColor({ type: "shadow", variant: "neutral", isSurface: true })};
  transform: ${(props) =>
    props.$isChecked
      ? `
        translateX(var(--size-toggle-button-width))
        translateX(-100%)
        translateX(calc(-3 * var(--border-width-interactive)))
        `
      : "translateX(var(--border-width-interactive))"};
  transition: transform var(--duration-medium) ease;
`;

export const LabelText = styled.span`
  line-height: var(--line-height-dense);
  color: ${getColor({ type: "foreground", variant: "neutral" })};
`;
