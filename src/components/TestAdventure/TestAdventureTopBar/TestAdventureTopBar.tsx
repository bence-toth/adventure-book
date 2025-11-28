import { useParams } from "react-router-dom";
import { TOP_BAR_TEST_IDS } from "@/constants/testIds";
import { TopBar } from "@/components/common/TopBar/TopBar";
import { useAdventure } from "@/context/useAdventure";
import { BackButton } from "./BackButton/BackButton";
import { AdventureTitleInput } from "./AdventureTitleInput/AdventureTitleInput";
import { AdventureNavigation } from "./AdventureNavigation/AdventureNavigation";
import {
  TopBarStartContainer,
  SavingIndicator,
} from "./TestAdventureTopBar.styles";

export const TestAdventureTopBar = () => {
  const { adventureId } = useParams<{ adventureId: string }>();
  const { isSaving } = useAdventure();

  if (!adventureId) {
    return null;
  }

  return (
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
      end={<AdventureNavigation adventureId={adventureId} />}
    />
  );
};
