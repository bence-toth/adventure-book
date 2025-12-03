import styled from "styled-components";
import { getColor, getInteractiveColor } from "@/utils/colorHelpers";

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  width: 100%;
  position: relative;
`;

export const Label = styled.label`
  font-weight: 500;
  color: ${getColor({ type: "foreground", variant: "neutral" })};
`;

export const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  &::after {
    content: "";
    position: absolute;
    right: var(--space-2);
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: var(--space-0-5) solid transparent;
    border-right: var(--space-0-5) solid transparent;
    border-top: var(--space-0-5) solid
      ${getColor({ type: "foreground", variant: "neutral" })};
    pointer-events: none;
  }
`;

export const StyledSelect = styled.select<{ $hasError: boolean }>`
  padding: var(--space-2);
  padding-inline-end: var(--space-4);
  font-size: var(--font-size-md);
  font-family: var(--font-family-default);
  color: ${(props) =>
    getInteractiveColor({
      variant: props.$hasError ? "danger" : "neutral",
      type: "foreground",
      state: "default",
    })};
  background: ${() =>
    getInteractiveColor({
      variant: "neutral",
      type: "background",
      state: "default",
    })};
  border: var(--border-width-interactive) solid
    ${(props) =>
      getInteractiveColor({
        variant: props.$hasError ? "danger" : "neutral",
        type: "border",
        state: "default",
      })};
  border-radius: var(--space-0-5);
  cursor: pointer;
  appearance: none;
  width: 100%;

  &:focus-visible {
    outline-offset: var(--space-1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.span`
  font-size: var(--font-size-sm);
  color: ${getColor({ type: "foreground", variant: "danger" })};
`;
