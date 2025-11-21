import { useEffect, type ReactNode } from "react";
import {
  useFloating,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
} from "@floating-ui/react";
import { Button } from "../Button/Button";
import {
  ModalOverlay,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogMessage,
  DialogActions,
} from "./ConfirmationModal.styles";

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
