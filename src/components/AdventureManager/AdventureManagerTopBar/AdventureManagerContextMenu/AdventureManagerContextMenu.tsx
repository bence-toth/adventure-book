import { Upload } from "lucide-react";
import {
  ContextMenu,
  ContextMenuItem,
} from "@/components/common/ContextMenu/ContextMenu";

interface AdventureManagerContextMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: HTMLElement | null;
  onImportClick: () => void;
}

export const AdventureManagerContextMenu = ({
  open,
  onOpenChange,
  triggerRef,
  onImportClick,
}: AdventureManagerContextMenuProps) => {
  return (
    <ContextMenu
      open={open}
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
