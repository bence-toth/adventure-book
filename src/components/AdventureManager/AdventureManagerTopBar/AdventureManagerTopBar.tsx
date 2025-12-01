import { useCallback, useState, useRef } from "react";
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

interface AdventureManagerTopBarProps {
  onFileSelect: (file: File) => void;
}

export const AdventureManagerTopBar = ({
  onFileSelect,
}: AdventureManagerTopBarProps) => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuTrigger, setContextMenuTrigger] =
    useState<HTMLElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMenuClick = useCallback(
    (e: React.MouseEvent, buttonRef: HTMLButtonElement) => {
      e.stopPropagation();
      setContextMenuTrigger(buttonRef);
      setIsContextMenuOpen(true);
    },
    []
  );

  const handleImportClick = useCallback(() => {
    setIsContextMenuOpen(false);
    // Trigger file input
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
      // Reset input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onFileSelect]
  );

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
        isOpen={isContextMenuOpen}
        onOpenChange={setIsContextMenuOpen}
        triggerRef={contextMenuTrigger}
        onImportClick={handleImportClick}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".yaml,.yml"
        onChange={handleFileChange}
        style={{ display: "none" }}
        data-testid="adventure-manager-file-input"
      />
    </>
  );
};
