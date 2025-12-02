import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Adventure } from "@/data/types";
import {
  getAdventureContentPassageRoute,
  getAdventureContentRoute,
} from "@/constants/routes";
import { PassageLink } from "./PassageLink/PassageLink";
import {
  NavigationWrapper,
  NavigationTitle,
  NavigationList,
  NavigationItem,
} from "./Navigation.styles";

interface NavigationProps {
  adventure: Adventure;
  adventureId: string;
  currentPassageId: number | null;
}

export const Navigation = ({
  adventure,
  adventureId,
  currentPassageId,
}: NavigationProps) => {
  const navigate = useNavigate();

  const handleIntroductionClick = useCallback(() => {
    navigate(getAdventureContentRoute(adventureId));
  }, [navigate, adventureId]);

  const handlePassageClick = useCallback(
    (passageId: number) => {
      navigate(getAdventureContentPassageRoute(adventureId, passageId));
    },
    [navigate, adventureId]
  );

  const passageIds = Object.keys(adventure.passages)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <NavigationWrapper aria-labelledby="navigation-title">
      <NavigationTitle id="navigation-title">Passages</NavigationTitle>
      <NavigationList>
        <NavigationItem>
          <PassageLink
            icon="play"
            label="Introduction"
            onClick={handleIntroductionClick}
            isActive={currentPassageId === null}
            data-testid="nav-introduction"
          />
        </NavigationItem>
        {passageIds.map((passageId) => {
          const passage = adventure.passages[passageId];
          return (
            <NavigationItem key={passageId}>
              <PassageLink
                passageId={passageId}
                passage={passage}
                onClick={() => handlePassageClick(passageId)}
                isActive={currentPassageId === passageId}
                data-testid={`nav-passage-${passageId}`}
              />
            </NavigationItem>
          );
        })}
      </NavigationList>
    </NavigationWrapper>
  );
};
