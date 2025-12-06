import styled from "styled-components";
import { getColor, getInteractiveColor } from "@/utils/colorHelpers";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Dialog = styled.dialog`
  border: var(--border-width-surface) solid
    ${getInteractiveColor({
      variant: "neutral",
      type: "border",
      state: "default",
    })};
  border-radius: var(--space-1);
  padding: 0;
  max-width: var(--size-modal-dialog-max-width);
  box-shadow: ${getColor({
    type: "shadow",
    variant: "neutral",
    isSurface: true,
    isElevated: true,
  })};
  background: ${getColor({
    type: "background",
    variant: "neutral",
    isSurface: true,
  })};
  position: relative;
  margin: 0;
  z-index: 3;

  &::backdrop {
    display: none;
  }
`;

export const DialogContent = styled.div`
  padding: var(--space-4);
`;

export const DialogTitle = styled.h2`
  margin: 0 0 var(--space-2);
  font-size: var(--font-size-xl);
`;

export const DialogMessage = styled.div`
  margin: 0 0 var(--space-3);
  line-height: var(--line-height-relaxed);
`;

export const DialogActions = styled.div`
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
`;
