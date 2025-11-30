import { useEffect, type ReactNode } from "react";
import {
  useFloating,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
} from "@floating-ui/react";
import { Button } from "@/components/common/Button/Button";
import { DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS } from "@/constants/testIds";
import {
  ModalOverlay,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogMessage,
  DialogActions,
} from "./ConfirmationModal.styles";

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: "neutral" | "primary" | "danger";
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
  message: ReactNode;
  actions: ModalAction[];
  "data-testid"?: string;
}

export const ConfirmationModal = ({
  isOpen,
  onOpenChange,
  title,
  message,
  actions,
  "data-testid": dataTestId,
}: ConfirmationModalProps) => {
  const { refs, context } = useFloating({
    open: isOpen,
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
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || actions.length === 0) return null;

  return (
    <FloatingFocusManager context={context} modal initialFocus={0}>
      <ModalOverlay
        onClick={onOpenChange}
        data-testid={DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS.OVERLAY}
      >
        <Dialog
          // Callback ref to set the floating element, safe to use in render
          // eslint-disable-next-line react-hooks/refs
          ref={refs.setFloating}
          open
          onClick={(e) => e.stopPropagation()}
          data-testid={
            dataTestId || DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS.DIALOG
          }
          {...getFloatingProps()}
        >
          <DialogContent
            data-testid={DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS.CONTENT}
          >
            <DialogTitle>{title}</DialogTitle>
            <DialogMessage
              data-testid={DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS.MESSAGE}
            >
              {message}
            </DialogMessage>
            <DialogActions
              data-testid={DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS.ACTIONS}
            >
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </DialogActions>
          </DialogContent>
        </Dialog>
      </ModalOverlay>
    </FloatingFocusManager>
  );
};
