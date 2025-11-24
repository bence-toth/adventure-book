import styled from "styled-components";

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
      ? "var(--color-interactive-background-active-neutral)"
      : "var(--color-interactive-background-default-neutral)"};
  border: var(--border-width-interactive) solid
    ${(props) =>
      props.$checked
        ? "var(--color-interactive-border-active-neutral)"
        : "var(--color-interactive-border-default-neutral)"};
  transition: background-color 0.2s ease, border-color 0.2s ease;

  ${ToggleButtonContainer}:hover & {
    background: ${(props) =>
      props.$checked
        ? "var(--color-interactive-background-active-neutral)"
        : "var(--color-interactive-background-hover-neutral)"};
    border-color: ${(props) =>
      props.$checked
        ? "var(--color-interactive-border-active-neutral)"
        : "var(--color-interactive-border-hover-neutral)"};
  }

  ${HiddenCheckbox}:focus-visible + & {
    outline: var(--border-width-interactive) solid
      var(--color-interactive-outline-focus-neutral);
    outline-offset: var(--space-1);
  }
`;

export const ToggleThumb = styled.span<{ $checked: boolean }>`
  position: absolute;
  aspect-ratio: 1 / 1;
  height: calc(100% - calc(2 * var(--border-width-interactive)));
  border-radius: 50%;
  background: var(--color-interactive-foreground-default-neutral);
  box-shadow: 0 var(--space-0-25) var(--space-0-5) var(--color-shadow-neutral);
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
  color: var(--color-foreground-neutral);
`;
