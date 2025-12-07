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

export const SelectButton = styled.button<{
  $hasError: boolean;
  $isOpen: boolean;
}>`
  display: flex;
  align-items: center;
  gap: var(--space-1-5);
  padding: var(--space-2);
  font-size: var(--font-size-md);
  font-family: var(--font-family-default);
  color: ${(props) =>
    getInteractiveColor({
      variant: props.$hasError ? "danger" : "neutral",
      type: "foreground",
      state: "input",
    })};
  background: ${() =>
    getInteractiveColor({
      variant: "neutral",
      type: "background",
      state: "input",
    })};
  border: var(--border-width-interactive) solid
    ${(props) =>
      getInteractiveColor({
        variant: props.$hasError ? "danger" : "neutral",
        type: "border",
        state: "input",
      })};
  border-radius: var(--space-0-5);
  cursor: pointer;
  width: 100%;
  text-align: start;

  &:focus-visible {
    outline-offset: var(--space-1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: transform var(--duration-fast);
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

export const SelectItemIcon = styled.span`
  display: flex;
`;

export const ErrorMessage = styled.span`
  font-size: var(--font-size-sm);
  color: ${getColor({ type: "foreground", variant: "danger" })};
`;
