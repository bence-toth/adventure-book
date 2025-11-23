import { ContextMenu, ContextMenuItem } from "@/components/common";

interface AdventureCardContextMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: HTMLElement | null;
  onDeleteClick: () => void;
}

export const AdventureCardContextMenu = ({
  open,
  onOpenChange,
  triggerRef,
  onDeleteClick,
}: AdventureCardContextMenuProps) => {
  return (
    <ContextMenu
      open={open}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
      placement="top-end"
    >
      <ContextMenuItem onClick={onDeleteClick}>Delete</ContextMenuItem>
    </ContextMenu>
  );
};
