import { useCallback, useState } from "react";
import { Swords, EllipsisVertical } from "lucide-react";
import { TOP_BAR_TEST_IDS } from "@/constants/testIds";
import { TopBar } from "@/components/common/TopBar/TopBar";
import { AdventureManagerContextMenu } from "./AdventureManagerContextMenu/AdventureManagerContextMenu";
import {
  TopBarStartContainer,
  TopBarLogoIcon,
  TopBarTitle,
  TopBarEndContainer,
  ContextMenuButton,
} from "./AdventureManagerTopBar.styles";

export const AdventureManagerTopBar = () => {
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

  const handleImportClick = useCallback(() => {
    console.log("Import adventure from YAML");
    setContextMenuOpen(false);
  }, []);

  return (
    <>
      <TopBar
        start={
          <TopBarStartContainer data-testid={TOP_BAR_TEST_IDS.LOGO}>
            <TopBarLogoIcon>
              <Swords size={32} strokeWidth={1.5} aria-hidden="true" />
            </TopBarLogoIcon>
            <TopBarTitle>Adventure Book Companion</TopBarTitle>
          </TopBarStartContainer>
        }
        end={
          <TopBarEndContainer>
            <ContextMenuButton
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleMenuClick(e, e.currentTarget as HTMLButtonElement)
              }
              aria-label="Open adventure manager menu"
              data-testid="adventure-manager-context-menu-button"
            >
              <EllipsisVertical size={20} strokeWidth={2} />
            </ContextMenuButton>
          </TopBarEndContainer>
        }
      />
      <AdventureManagerContextMenu
        open={contextMenuOpen}
        onOpenChange={setContextMenuOpen}
        triggerRef={contextMenuTrigger}
        onImportClick={handleImportClick}
      />
    </>
  );
};
