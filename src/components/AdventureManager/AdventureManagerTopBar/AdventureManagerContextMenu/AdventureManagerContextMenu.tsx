import { Upload } from "lucide-react";
import {
  ContextMenu,
  ContextMenuItem,
} from "@/components/common/ContextMenu/ContextMenu";

interface AdventureManagerContextMenuProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  triggerRef: HTMLElement | null;
  onImportClick: () => void;
}

export const AdventureManagerContextMenu = ({
  isOpen,
  onOpenChange,
  triggerRef,
  onImportClick,
}: AdventureManagerContextMenuProps) => {
  return (
    <ContextMenu
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
      placement="bottom-end"
      data-testid="adventure-manager-context-menu"
    >
      <ContextMenuItem
        onClick={onImportClick}
        icon={Upload}
        data-testid="adventure-manager-context-menu-import"
      >
        Import adventure from YAML
      </ContextMenuItem>
    </ContextMenu>
  );
};
