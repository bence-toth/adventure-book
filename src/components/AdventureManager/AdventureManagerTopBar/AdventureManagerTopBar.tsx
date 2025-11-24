import { Swords } from "lucide-react";
import { TOP_BAR_TEST_IDS } from "@/constants/testIds";
import { TopBar } from "@/components/common/TopBar/TopBar";
import { TopBarLogoIcon, TopBarTitle } from "./AdventureManagerTopBar.styles";

export const AdventureManagerTopBar = () => {
  return (
    <TopBar
      start={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-1)",
          }}
          data-testid={TOP_BAR_TEST_IDS.LOGO}
        >
          <TopBarLogoIcon>
            <Swords size={32} strokeWidth={1.5} aria-hidden="true" />
          </TopBarLogoIcon>
          <TopBarTitle>Adventure Book Companion</TopBarTitle>
        </div>
      }
    />
  );
};
