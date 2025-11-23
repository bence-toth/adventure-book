import { ConfirmationModal } from "@/components/common";

interface StoryCardDeleteModalProps {
  open: boolean;
  storyTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const StoryCardDeleteModal = ({
  open,
  storyTitle,
  onConfirm,
  onCancel,
}: StoryCardDeleteModalProps) => {
  return (
    <ConfirmationModal
      open={open}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
      title="Delete Story"
      message={
        <p>
          Are you sure you want to delete "{storyTitle}"? This action cannot be
          undone.
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
