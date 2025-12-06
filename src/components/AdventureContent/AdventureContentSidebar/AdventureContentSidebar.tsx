import { useParams } from "react-router-dom";
import { useAdventure } from "@/context/useAdventure";
import { Sidebar } from "@/components/common/Sidebar/Sidebar";
import { Navigation } from "./Navigation/Navigation";
import {
  SidebarLayout,
  SidebarContent,
} from "./AdventureContentSidebar.styles";

export const AdventureContentSidebar = () => {
  const { id } = useParams<{ id: string }>();
  const { adventure, adventureId } = useAdventure();

  // Parse current passage ID from URL (null means we're on introduction)
  const currentPassageId = id ? parseInt(id, 10) : null;

  if (!adventure || !adventureId) {
    return null;
  }

  return (
    <Sidebar>
      <SidebarLayout>
        <SidebarContent>
          <Navigation
            adventure={adventure}
            adventureId={adventureId}
            currentPassageId={currentPassageId}
          />
        </SidebarContent>
      </SidebarLayout>
    </Sidebar>
  );
};
