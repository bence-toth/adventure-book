import { useEffect, type ReactNode } from "react";
import {
  useFloating,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
} from "@floating-ui/react";
import styled from "styled-components";
import { Button } from "./Button";

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 50%);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dialog = styled.dialog`
  border: var(--border-width-hairline) solid
    var(--color-interactive-border-default-neutral);
  border-radius: var(--space-1);
  padding: 0;
  max-width: 500px;
  box-shadow: var(--shadow-surface-elevated-neutral);
  background: var(--color-background-surface-neutral);
  position: relative;
  margin: 0;
  z-index: 2001;

  &::backdrop {
    display: none;
  }
`;

const DialogContent = styled.div`
  padding: var(--space-4);
`;

const DialogTitle = styled.h2`
  margin: 0 0 var(--space-2);
  color: var(--color-foreground);
  font-size: var(--font-size-xl);
`;

const DialogMessage = styled.div`
  margin: 0 0 var(--space-3);
  line-height: 1.5;

  p {
    margin: 0;
  }
`;

const DialogActions = styled.div`
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
`;

export interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "primary";
}

export const ConfirmationModal = ({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "primary",
}: ConfirmationModalProps) => {
  const { refs, context } = useFloating({
    open,
    onOpenChange,
  });

  const dismiss = useDismiss(context, {
    escapeKey: true,
    outsidePress: true,
  });
  const role = useRole(context);

  const { getFloatingProps } = useInteractions([dismiss, role]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <FloatingFocusManager context={context} modal initialFocus={0}>
      <ModalOverlay onClick={onCancel} data-testid="modal-overlay">
        <Dialog
          ref={refs.setFloating}
          open
          onClick={(e) => e.stopPropagation()}
          data-testid="confirmation-dialog"
          {...getFloatingProps()}
        >
          <DialogContent data-testid="dialog-content">
            <DialogTitle>{title}</DialogTitle>
            <DialogMessage data-testid="dialog-message">
              {message}
            </DialogMessage>
            <DialogActions data-testid="dialog-actions">
              <Button onClick={onCancel}>{cancelLabel}</Button>
              <Button variant={variant} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </ModalOverlay>
    </FloatingFocusManager>
  );
};
