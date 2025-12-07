import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Adventure } from "@/data/types";
import { useAdventure } from "@/context/useAdventure";
import {
  getAdventureTestPassageRoute,
  getAdventureTestRoute,
} from "@/constants/routes";
import {
  DEBUG_NAVIGATION_TEST_IDS,
  getDebugNavigationPassageTestId,
} from "../testIds";
import { PassageLink } from "./PassageLink/PassageLink";
import {
  NavigationWrapper,
  DebugNavigationTitle,
  DebugNavigationList,
  DebugNavigationItem,
} from "./DebugNavigation.styles";

interface DebugNavigationProps {
  adventure: Adventure;
  currentPassageId: number | null;
}

export const DebugNavigation = ({
  adventure,
  currentPassageId,
}: DebugNavigationProps) => {
  const navigate = useNavigate();
  const { adventureId } = useAdventure();

  const handleIntroductionClick = useCallback(() => {
    if (!adventureId) return;
    navigate(getAdventureTestRoute(adventureId));
  }, [navigate, adventureId]);

  const handlePassageClick = useCallback(
    (passageId: number) => {
      if (!adventureId) return;
      navigate(getAdventureTestPassageRoute(adventureId, passageId));
    },
    [navigate, adventureId]
  );

  const passageIds = Object.keys(adventure.passages)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <NavigationWrapper aria-labelledby="debug-navigation-title">
      <DebugNavigationTitle id="debug-navigation-title">
        Passages
      </DebugNavigationTitle>
      <DebugNavigationList>
        <DebugNavigationItem>
          <PassageLink
            icon="play"
            label="Introduction"
            onClick={handleIntroductionClick}
            isActive={currentPassageId === null}
            data-testid={DEBUG_NAVIGATION_TEST_IDS.INTRODUCTION}
          />
        </DebugNavigationItem>
        {passageIds.map((passageId) => {
          const passage = adventure.passages[passageId];
          return (
            <DebugNavigationItem key={passageId}>
              <PassageLink
                passageId={passageId}
                passage={passage}
                onClick={() => handlePassageClick(passageId)}
                isActive={currentPassageId === passageId}
                data-testid={getDebugNavigationPassageTestId(passageId)}
              />
            </DebugNavigationItem>
          );
        })}
      </DebugNavigationList>
    </NavigationWrapper>
  );
};
