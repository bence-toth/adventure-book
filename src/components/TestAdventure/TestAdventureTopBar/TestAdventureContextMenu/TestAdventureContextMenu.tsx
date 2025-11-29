import { Download } from "lucide-react";
import {
  ContextMenu,
  ContextMenuItem,
} from "@/components/common/ContextMenu/ContextMenu";

interface TestAdventureContextMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: HTMLElement | null;
  onYAMLDownloadClick: () => void;
}

export const TestAdventureContextMenu = ({
  open,
  onOpenChange,
  triggerRef,
  onYAMLDownloadClick,
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
        onClick={onYAMLDownloadClick}
        icon={Download}
        data-testid="test-adventure-context-menu-download"
      >
        Download adventure as YAML
      </ContextMenuItem>
    </ContextMenu>
  );
};
