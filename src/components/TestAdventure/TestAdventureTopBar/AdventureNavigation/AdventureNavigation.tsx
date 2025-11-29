import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Play, PenTool } from "lucide-react";
import {
  getAdventureTestRoute,
  getAdventureEditRoute,
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

  const isActive = useCallback(
    (path: string) => {
      return location.pathname === path || location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  const testRoute = useMemo(
    () => getAdventureTestRoute(adventureId),
    [adventureId]
  );

  const editRoute = useMemo(
    () => getAdventureEditRoute(adventureId),
    [adventureId]
  );

  return (
    <TopBarNav as="nav" aria-label="Main navigation">
      <NavigationTab
        to={testRoute}
        variant={isActive(testRoute) ? "primary" : "neutral"}
        icon={Play}
      >
        Test
      </NavigationTab>
      <NavigationTab
        to={editRoute}
        variant={isActive(editRoute) ? "primary" : "neutral"}
        icon={PenTool}
      >
        Edit
      </NavigationTab>
    </TopBarNav>
  );
};
