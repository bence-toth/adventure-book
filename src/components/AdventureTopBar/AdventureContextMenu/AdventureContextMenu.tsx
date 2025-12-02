import { Download } from "lucide-react";
import {
  ContextMenu,
  ContextMenuItem,
} from "@/components/common/ContextMenu/ContextMenu";

interface AdventureContextMenuProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  triggerRef: HTMLElement | null;
  onYAMLDownloadClick: () => void;
}

export const AdventureContextMenu = ({
  isOpen,
  onOpenChange,
  triggerRef,
  onYAMLDownloadClick,
}: AdventureContextMenuProps) => {
  return (
    <ContextMenu
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
      placement="bottom-end"
      data-testid="adventure-context-menu"
    >
      <ContextMenuItem
        onClick={onYAMLDownloadClick}
        icon={Download}
        data-testid="adventure-context-menu-download"
      >
        Download adventure as YAML
      </ContextMenuItem>
    </ContextMenu>
  );
};
