import { Trash } from "lucide-react";
import {
  ContextMenu,
  ContextMenuItem,
} from "@/components/common/ContextMenu/ContextMenu";

interface AdventureCardContextMenuProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  triggerRef: HTMLElement | null;
  onDeleteClick: () => void;
}

export const AdventureCardContextMenu = ({
  isOpen,
  onOpenChange,
  triggerRef,
  onDeleteClick,
}: AdventureCardContextMenuProps) => {
  return (
    <ContextMenu
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
      placement="top-end"
    >
      <ContextMenuItem onClick={onDeleteClick} icon={Trash}>
        Delete
      </ContextMenuItem>
    </ContextMenu>
  );
};
