import { useCallback, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import type { StoredAdventure } from "@/data/adventureDatabase";
import { sanitizeFilename, downloadFile } from "@/utils/fileDownload";
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
  isDeleteModalOpen: boolean;
  onConfirmDelete: () => Promise<void>;
  onCancelDelete: () => void;
}

export const AdventureCard = ({
  adventure,
  onOpen,
  onDeleteClick,
  isDeleteModalOpen,
  onConfirmDelete,
  onCancelDelete,
}: AdventureCardProps) => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuTrigger, setContextMenuTrigger] =
    useState<HTMLElement | null>(null);

  const handleMenuClick = useCallback(
    (e: React.MouseEvent, buttonRef: HTMLButtonElement) => {
      e.stopPropagation();
      setContextMenuTrigger(buttonRef);
      setIsContextMenuOpen(true);
    },
    []
  );

  const handleDeleteClick = useCallback(() => {
    onDeleteClick();
    setIsContextMenuOpen(false);
  }, [onDeleteClick]);

  const handleDownloadClick = useCallback(() => {
    try {
      const sanitizedTitle = sanitizeFilename(adventure.title);
      const filename = `${sanitizedTitle}.yaml`;
      downloadFile(adventure.content, filename, "text/yaml;charset=utf-8");
    } catch (error) {
      console.error("Failed to download adventure:", error);
    } finally {
      setIsContextMenuOpen(false);
    }
  }, [adventure]);

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
        isOpen={isContextMenuOpen}
        onOpenChange={setIsContextMenuOpen}
        triggerRef={contextMenuTrigger}
        onDownloadClick={handleDownloadClick}
        onDeleteClick={handleDeleteClick}
      />
      <AdventureCardDeleteModal
        isOpen={isDeleteModalOpen}
        adventureTitle={adventure.title}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </>
  );
};
