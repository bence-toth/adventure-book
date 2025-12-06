import { Upload } from "lucide-react";
import {
  ContextMenu,
  ContextMenuItem,
} from "@/components/common/ContextMenu/ContextMenu";
import { ADVENTURE_MANAGER_TEST_IDS } from "../../testIds";

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
      data-testid={ADVENTURE_MANAGER_TEST_IDS.CONTEXT_MENU}
    >
      <ContextMenuItem
        onClick={onImportClick}
        icon={Upload}
        data-testid={ADVENTURE_MANAGER_TEST_IDS.CONTEXT_MENU_IMPORT}
      >
        Import adventure from YAML
      </ContextMenuItem>
    </ContextMenu>
  );
};
