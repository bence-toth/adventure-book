import { Download } from "lucide-react";
import {
  ContextMenu,
  ContextMenuItem,
} from "@/components/common/ContextMenu/ContextMenu";
import { ADVENTURE_CONTEXT_MENU_TEST_IDS } from "../testIds";

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
      data-testid={ADVENTURE_CONTEXT_MENU_TEST_IDS.MENU}
    >
      <ContextMenuItem
        onClick={onYAMLDownloadClick}
        icon={Download}
        data-testid={ADVENTURE_CONTEXT_MENU_TEST_IDS.DOWNLOAD}
      >
        Download adventure as YAML
      </ContextMenuItem>
    </ContextMenu>
  );
};
