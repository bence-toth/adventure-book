import { useCallback, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import type { StoredAdventure } from "@/data/adventureDatabase";
import { FormattedDate } from "@/components/common/FormattedDate/FormattedDate";
import { AdventureCardDeleteModal } from "./AdventureCardDeleteModal";
import { AdventureCardContextMenu } from "./AdventureCardContextMenu";
import {
  AdventureCardContainer,
  AdventureCardClickable,
  AdventureCardContent,
  AdventureCardTitle,
  AdventureCardFooter,
  AdventureCardDate,
  AdventureCardMenu,
} from "./AdventureCard.styles";

interface AdventureCardProps {
  adventure: StoredAdventure;
  onOpen: (id: string) => void;
  onDeleteClick: () => void;
  deleteModalOpen: boolean;
  onConfirmDelete: () => Promise<void>;
  onCancelDelete: () => void;
}

export const AdventureCard = ({
  adventure,
  onOpen,
  onDeleteClick,
  deleteModalOpen,
  onConfirmDelete,
  onCancelDelete,
}: AdventureCardProps) => {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuTrigger, setContextMenuTrigger] =
    useState<HTMLElement | null>(null);

  const handleMenuClick = useCallback(
    (e: React.MouseEvent, buttonRef: HTMLButtonElement) => {
      e.stopPropagation();
      setContextMenuTrigger(buttonRef);
      setContextMenuOpen(true);
    },
    []
  );

  const handleDeleteClick = useCallback(() => {
    onDeleteClick();
    setContextMenuOpen(false);
  }, [onDeleteClick]);

  return (
    <>
      <AdventureCardContainer>
        <AdventureCardClickable
          onClick={() => onOpen(adventure.id)}
          aria-label={`Open ${adventure.title}`}
        >
          <AdventureCardContent>
            <AdventureCardTitle>{adventure.title}</AdventureCardTitle>
          </AdventureCardContent>
        </AdventureCardClickable>
        <AdventureCardFooter>
          <AdventureCardDate>
            Last edited <FormattedDate date={adventure.lastEdited} />
          </AdventureCardDate>
          <AdventureCardMenu
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              handleMenuClick(e, e.currentTarget as HTMLButtonElement)
            }
            aria-label={`Open menu for ${adventure.title}`}
          >
            <EllipsisVertical size={20} strokeWidth={2} />
          </AdventureCardMenu>
        </AdventureCardFooter>
      </AdventureCardContainer>
      <AdventureCardContextMenu
        open={contextMenuOpen}
        onOpenChange={setContextMenuOpen}
        triggerRef={contextMenuTrigger}
        onDeleteClick={handleDeleteClick}
      />
      <AdventureCardDeleteModal
        open={deleteModalOpen}
        adventureTitle={adventure.title}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </>
  );
};
