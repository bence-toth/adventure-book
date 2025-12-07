import { Download, Trash } from "lucide-react";
import {
  ContextMenu,
  ContextMenuItem,
} from "@/components/common/ContextMenu/ContextMenu";
import { ADVENTURE_CARD_TEST_IDS } from "../testIds";

interface AdventureCardContextMenuProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  triggerRef: HTMLElement | null;
  onDownloadClick: () => void;
  onDeleteClick: () => void;
}

export const AdventureCardContextMenu = ({
  isOpen,
  onOpenChange,
  triggerRef,
  onDownloadClick,
  onDeleteClick,
}: AdventureCardContextMenuProps) => {
  return (
    <ContextMenu
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
      placement="top-end"
    >
      <ContextMenuItem
        onClick={onDownloadClick}
        icon={Download}
        data-testid={ADVENTURE_CARD_TEST_IDS.CONTEXT_MENU_DOWNLOAD}
      >
        Download as YAML
      </ContextMenuItem>
      <ContextMenuItem onClick={onDeleteClick} icon={Trash}>
        Delete
      </ContextMenuItem>
    </ContextMenu>
  );
};
