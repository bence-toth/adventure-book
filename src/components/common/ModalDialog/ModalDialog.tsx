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
} from "./ModalDialog.styles";

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: "neutral" | "primary" | "danger";
}

interface ModalDialogProps {
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
  message: ReactNode;
  actions: ModalAction[];
  "data-testid"?: string;
}

export const ModalDialog = ({
  isOpen,
  onOpenChange,
  title,
  message,
  actions,
  "data-testid": dataTestId,
}: ModalDialogProps) => {
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

  // Prevent background scrolling when the modal is open to maintain focus on the dialog.
  // When a modal is open, the user should only interact with the modal content, and
  // background scrolling can be disorienting and break the modal's visual prominence.
  // This locks/unlocks the document body scroll based on modal open state by
  // setting body overflow to 'hidden' when modal opens, restoring it when modal closes,
  // and ensuring cleanup on unmount to prevent scroll being permanently locked.
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
