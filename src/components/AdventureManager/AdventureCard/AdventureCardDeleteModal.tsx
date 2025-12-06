import { ModalDialog } from "@/components/common/ModalDialog/ModalDialog";

interface AdventureCardDeleteModalProps {
  isOpen: boolean;
  adventureTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AdventureCardDeleteModal = ({
  isOpen,
  adventureTitle,
  onConfirm,
  onCancel,
}: AdventureCardDeleteModalProps) => {
  return (
    <ModalDialog
      isOpen={isOpen}
      onOpenChange={onCancel}
      title="Delete Adventure"
      message={[
        `Are you sure you want to delete "${adventureTitle}"?`,
        "This action cannot be undone.",
      ]}
      actions={[
        { label: "Cancel", onClick: onCancel },
        { label: "Delete", onClick: onConfirm, variant: "danger" },
      ]}
    />
  );
};
