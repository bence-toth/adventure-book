import {
  ContextMenu,
  ContextMenuItem,
} from "@/components/common/ContextMenu/ContextMenu";

interface TestAdventureContextMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: HTMLElement | null;
  onDownloadClick: () => void;
}

export const TestAdventureContextMenu = ({
  open,
  onOpenChange,
  triggerRef,
  onDownloadClick,
}: TestAdventureContextMenuProps) => {
  return (
    <ContextMenu
      open={open}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
      placement="bottom-end"
      data-testid="test-adventure-context-menu"
    >
      <ContextMenuItem
        onClick={onDownloadClick}
        data-testid="test-adventure-context-menu-download"
      >
        Download adventure as YAML
      </ContextMenuItem>
    </ContextMenu>
  );
};
