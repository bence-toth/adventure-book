import { useParams } from "react-router-dom";
import { useAdventure } from "@/context/useAdventure";
import { Sidebar } from "@/components/common/Sidebar/Sidebar";
import { ToggleButton } from "@/components/common/ToggleButton/ToggleButton";
import { ADVENTURE_TEST_SIDEBAR_TEST_IDS } from "./testIds";
import { Inventory } from "./Inventory/Inventory";
import { DebugInventory } from "./DebugInventory/DebugInventory";
import { DebugNavigation } from "./DebugNavigation/DebugNavigation";
import {
  SidebarLayout,
  SidebarContent,
  SidebarFooter,
} from "./AdventureTestSidebar.styles";

interface AdventureTestSidebarProps {
  inventory: string[];
  onAddItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
}

export const AdventureTestSidebar = ({
  inventory,
  onAddItem,
  onRemoveItem,
}: AdventureTestSidebarProps) => {
  const { id } = useParams<{ id: string }>();
  const { adventure, isDebugModeEnabled, setIsDebugModeEnabled } =
    useAdventure();

  // Parse current passage ID from URL (null means we're on introduction)
  const currentPassageId = id ? parseInt(id, 10) : null;

  if (!adventure) {
    return null;
  }

  const currentItems = adventure.items.filter((item) =>
    inventory.includes(item.id)
  );

  return (
    <Sidebar>
      <SidebarLayout>
        <SidebarContent>
          {isDebugModeEnabled ? (
            <>
              <DebugInventory
                allItems={adventure.items}
                currentItemIds={inventory}
                onAddItem={onAddItem}
                onRemoveItem={onRemoveItem}
              />
              <DebugNavigation
                adventure={adventure}
                currentPassageId={currentPassageId}
              />
            </>
          ) : (
            <Inventory items={currentItems} />
          )}
        </SidebarContent>
        <SidebarFooter>
          <ToggleButton
            label="Debug mode"
            isChecked={isDebugModeEnabled}
            onChange={setIsDebugModeEnabled}
            data-testid={ADVENTURE_TEST_SIDEBAR_TEST_IDS.DEBUG_MODE_TOGGLE}
          />
        </SidebarFooter>
      </SidebarLayout>
    </Sidebar>
  );
};
