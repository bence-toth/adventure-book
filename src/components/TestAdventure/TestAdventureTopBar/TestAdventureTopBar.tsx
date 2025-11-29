import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";
import { TOP_BAR_TEST_IDS } from "@/constants/testIds";
import { TopBar } from "@/components/common/TopBar/TopBar";
import { useAdventure } from "@/context/useAdventure";
import { getAdventure } from "@/data/adventureDatabase";
import { sanitizeFilename, downloadFile } from "@/utils/fileDownload";
import { BackButton } from "./BackButton/BackButton";
import { AdventureTitleInput } from "./AdventureTitleInput/AdventureTitleInput";
import { AdventureNavigation } from "./AdventureNavigation/AdventureNavigation";
import { TestAdventureContextMenu } from "./TestAdventureContextMenu/TestAdventureContextMenu";
import {
  TopBarStartContainer,
  SavingIndicator,
  TopBarEndContainer,
  ContextMenuButton,
} from "./TestAdventureTopBar.styles";

export const TestAdventureTopBar = () => {
  const { adventureId } = useParams<{ adventureId: string }>();
  const { adventure, isSaving } = useAdventure();
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuTrigger, setContextMenuTrigger] =
    useState<HTMLElement | null>(null);

  const handleMenuClick = useCallback(
    (e: React.MouseEvent, buttonRef: HTMLButtonElement) => {
      e.stopPropagation();
      setContextMenuTrigger(buttonRef);
      setContextMenuOpen(true);
    },
    []
  );

  const handleYAMLDownloadClick = useCallback(async () => {
    if (!adventureId || !adventure) {
      return;
    }

    try {
      // Fetch the raw YAML content from the database
      const storedAdventure = await getAdventure(adventureId);
      if (!storedAdventure) {
        console.error("Adventure not found in database");
        return;
      }

      // Create a sanitized filename from the adventure title
      const sanitizedTitle = sanitizeFilename(adventure.metadata.title);
      const filename = `${sanitizedTitle}.yaml`;

      // Trigger the download
      downloadFile(
        storedAdventure.content,
        filename,
        "text/yaml;charset=utf-8"
      );
    } catch (error) {
      console.error("Failed to download adventure:", error);
    } finally {
      setContextMenuOpen(false);
    }
  }, [adventureId, adventure]);

  if (!adventureId) {
    return null;
  }

  return (
    <>
      <TopBar
        start={
          <TopBarStartContainer data-testid={TOP_BAR_TEST_IDS.LOGO}>
            <BackButton />
            <AdventureTitleInput adventureId={adventureId} />
            {isSaving && (
              <SavingIndicator data-testid="saving-indicator">
                Saving...
              </SavingIndicator>
            )}
          </TopBarStartContainer>
        }
        end={
          <TopBarEndContainer>
            <AdventureNavigation adventureId={adventureId} />
            <ContextMenuButton
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleMenuClick(e, e.currentTarget as HTMLButtonElement)
              }
              aria-label="Open adventure menu"
              data-testid="test-adventure-context-menu-button"
            >
              <EllipsisVertical size={20} strokeWidth={2} />
            </ContextMenuButton>
          </TopBarEndContainer>
        }
      />
      <TestAdventureContextMenu
        open={contextMenuOpen}
        onOpenChange={setContextMenuOpen}
        triggerRef={contextMenuTrigger}
        onYAMLDownloadClick={handleYAMLDownloadClick}
      />
    </>
  );
};
