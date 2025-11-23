import { ContextMenu, ContextMenuItem } from "@/components/common";

interface StoryCardContextMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: HTMLElement | null;
  onDeleteClick: () => void;
}

export const StoryCardContextMenu = ({
  open,
  onOpenChange,
  triggerRef,
  onDeleteClick,
}: StoryCardContextMenuProps) => {
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
