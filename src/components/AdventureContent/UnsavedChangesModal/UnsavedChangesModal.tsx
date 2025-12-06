import { ModalDialog } from "@/components/common/ModalDialog/ModalDialog";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onStay: () => void;
  onLeave: () => void;
}

// Modal dialog that prompts the user to confirm navigation when there are
// unsaved changes. Provides options to stay on the current page or proceed
// with navigation (losing changes).
export const UnsavedChangesModal = ({
  isOpen,
  onStay,
  onLeave,
}: UnsavedChangesModalProps) => {
  return (
    <ModalDialog
      isOpen={isOpen}
      onOpenChange={onStay}
      title="Unsaved changes"
      message={[
        "You have unsaved changes. Are you sure you want to leave?",
        "Your changes will be lost.",
      ]}
      actions={[
        {
          label: "Keep editing",
          onClick: onStay,
          variant: "primary",
        },
        {
          label: "Leave anyway",
          onClick: onLeave,
          variant: "danger",
        },
      ]}
      data-testid="unsaved-changes-modal"
    />
  );
};
