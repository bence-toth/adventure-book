import { useEffect, type ReactNode } from "react";
import {
  useFloating,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
} from "@floating-ui/react";
import { Button } from "./Button";
import "./ConfirmationModal.css";

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
      <div className="modal-overlay" onClick={onCancel}>
        <dialog
          ref={refs.setFloating}
          open
          className="confirmation-dialog"
          onClick={(e) => e.stopPropagation()}
          {...getFloatingProps()}
        >
          <div className="confirmation-dialog-content">
            <h2>{title}</h2>
            <div className="confirmation-dialog-message">{message}</div>
            <div className="confirmation-dialog-actions">
              <Button onClick={onCancel}>{cancelLabel}</Button>
              <Button variant={variant} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </div>
        </dialog>
      </div>
    </FloatingFocusManager>
  );
};
