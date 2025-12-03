import styled from "styled-components";
import { getColor, getInteractiveColor } from "@/utils/colorHelpers";

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  width: 100%;
`;

export const Label = styled.label`
  font-weight: 500;
  color: ${getColor({ type: "foreground", variant: "neutral" })};
`;

export const StyledInput = styled.input<{ $hasError: boolean }>`
  padding: var(--space-2);
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
