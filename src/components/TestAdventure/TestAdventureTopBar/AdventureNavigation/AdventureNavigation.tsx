import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Play, PenTool, Waypoints } from "lucide-react";
import {
  getAdventureTestRoute,
  getAdventureContentRoute,
  getAdventureStructureRoute,
} from "@/constants/routes";
import { NavigationTab } from "@/components/common/NavigationTab/NavigationTab";
import { TopBarNav } from "./AdventureNavigation.styles";

interface AdventureNavigationProps {
  adventureId: string | null;
}

export const AdventureNavigation = ({
  adventureId,
}: AdventureNavigationProps) => {
  const location = useLocation();

  const getIsActive = useCallback(
    (path: string) => {
      return location.pathname === path || location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  const testRoute = useMemo(
    () => getAdventureTestRoute(adventureId),
    [adventureId]
  );

  const contentRoute = useMemo(
    () => getAdventureContentRoute(adventureId),
    [adventureId]
  );

  const structureRoute = useMemo(
    () => getAdventureStructureRoute(adventureId),
    [adventureId]
  );

  return (
    <TopBarNav as="nav" aria-label="Main navigation">
      <NavigationTab
        to={structureRoute}
        variant={getIsActive(structureRoute) ? "primary" : "neutral"}
        icon={Waypoints}
      >
        Structure
      </NavigationTab>
      <NavigationTab
        to={contentRoute}
        variant={getIsActive(contentRoute) ? "primary" : "neutral"}
        icon={PenTool}
      >
        Content
      </NavigationTab>
      <NavigationTab
        to={testRoute}
        variant={getIsActive(testRoute) ? "primary" : "neutral"}
        icon={Play}
      >
        Test
      </NavigationTab>
    </TopBarNav>
  );
};
