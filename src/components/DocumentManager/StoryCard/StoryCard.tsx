import { useCallback, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import type { StoredStory } from "@/data/storyDatabase";
import { FormattedDate } from "@/components/common";
import { StoryCardDeleteModal } from "./StoryCardDeleteModal";
import { StoryCardContextMenu } from "./StoryCardContextMenu";
import {
  StoryCardContainer,
  StoryCardClickable,
  StoryCardContent,
  StoryCardTitle,
  StoryCardFooter,
  StoryCardDate,
  StoryCardMenu,
} from "./StoryCard.styles";

interface StoryCardProps {
  story: StoredStory;
  onOpen: (id: string) => void;
  onDelete: () => Promise<void>;
}

export const StoryCard = ({ story, onOpen, onDelete }: StoryCardProps) => {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuTrigger, setContextMenuTrigger] =
    useState<HTMLElement | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleMenuClick = useCallback(
    (e: React.MouseEvent, buttonRef: HTMLButtonElement) => {
      e.stopPropagation();
      setContextMenuTrigger(buttonRef);
      setContextMenuOpen(true);
    },
    []
  );

  const handleDeleteClick = useCallback(() => {
    setDeleteModalOpen(true);
    setContextMenuOpen(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    await onDelete();
    setDeleteModalOpen(false);
  }, [onDelete]);

  const handleCancelDelete = useCallback(() => {
    setDeleteModalOpen(false);
  }, []);

  return (
    <>
      <StoryCardContainer>
        <StoryCardClickable
          onClick={() => onOpen(story.id)}
          aria-label={`Open ${story.title}`}
        >
          <StoryCardContent>
            <StoryCardTitle>{story.title}</StoryCardTitle>
          </StoryCardContent>
        </StoryCardClickable>
        <StoryCardFooter>
          <StoryCardDate>
            Last edited <FormattedDate date={story.lastEdited} />
          </StoryCardDate>
          <StoryCardMenu
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              handleMenuClick(e, e.currentTarget as HTMLButtonElement)
            }
            aria-label={`Open menu for ${story.title}`}
          >
            <EllipsisVertical size={20} strokeWidth={2} />
          </StoryCardMenu>
        </StoryCardFooter>
      </StoryCardContainer>
      <StoryCardContextMenu
        open={contextMenuOpen}
        onOpenChange={setContextMenuOpen}
        triggerRef={contextMenuTrigger}
        onDeleteClick={handleDeleteClick}
      />
      <StoryCardDeleteModal
        open={deleteModalOpen}
        storyTitle={story.title}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};
