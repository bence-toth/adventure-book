import { ConfirmationModal } from "@/components/common/ConfirmationModal/ConfirmationModal";

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
    <ConfirmationModal
      isOpen={isOpen}
      onOpenChange={onCancel}
      title="Delete Adventure"
      message={
        <p>
          Are you sure you want to delete "{adventureTitle}"? This action cannot
          be undone.
        </p>
      }
      actions={[
        { label: "Cancel", onClick: onCancel },
        { label: "Delete", onClick: onConfirm, variant: "danger" },
      ]}
    />
  );
};
