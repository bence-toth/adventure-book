import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Adventure } from "@/data/types";
import { getPassageRoute, getAdventureTestRoute } from "@/constants/routes";
import { PassageLink } from "./PassageLink/PassageLink";
import {
  NavigationWrapper,
  DebugNavigationTitle,
  DebugNavigationList,
  DebugNavigationItem,
} from "./DebugNavigation.styles";

interface DebugNavigationProps {
  adventure: Adventure;
  adventureId: string;
  currentPassageId: number | null;
}

export const DebugNavigation = ({
  adventure,
  adventureId,
  currentPassageId,
}: DebugNavigationProps) => {
  const navigate = useNavigate();

  const handleIntroductionClick = useCallback(() => {
    navigate(getAdventureTestRoute(adventureId));
  }, [navigate, adventureId]);

  const handlePassageClick = useCallback(
    (passageId: number) => {
      navigate(getPassageRoute(adventureId, passageId));
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
            data-testid="debug-nav-introduction"
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
                data-testid={`debug-nav-passage-${passageId}`}
              />
            </DebugNavigationItem>
          );
        })}
      </DebugNavigationList>
    </NavigationWrapper>
  );
};
