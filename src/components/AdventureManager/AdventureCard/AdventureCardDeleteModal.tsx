import { ConfirmationModal } from "@/components/common/ConfirmationModal/ConfirmationModal";

interface AdventureCardDeleteModalProps {
  open: boolean;
  adventureTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AdventureCardDeleteModal = ({
  open,
  adventureTitle,
  onConfirm,
  onCancel,
}: AdventureCardDeleteModalProps) => {
  return (
    <ConfirmationModal
      open={open}
      onOpenChange={onCancel}
      title="Delete Adventure"
      message={
        <p>
          Are you sure you want to delete "{adventureTitle}"? This action cannot
          be undone.
        </p>
      }
      confirmLabel="Delete"
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      variant="danger"
    />
  );
};
