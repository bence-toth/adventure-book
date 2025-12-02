import { useCallback, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Play, PenTool, Waypoints } from "lucide-react";
import {
  getAdventureTestRoute,
  getAdventureContentRoute,
  getAdventureStructureRoute,
  getAdventureTestPassageRoute,
  getAdventureContentPassageRoute,
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
  const { id } = useParams<{ id: string }>();

  const getIsActive = useCallback(
    (path: string) => {
      return location.pathname === path || location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  // Preserve passage ID when switching between test and content views
  const passageId = id ? parseInt(id, 10) : null;

  const testRoute = useMemo(() => {
    if (!adventureId) return "";
    if (passageId !== null && !isNaN(passageId)) {
      return getAdventureTestPassageRoute(adventureId, passageId);
    }
    return getAdventureTestRoute(adventureId);
  }, [adventureId, passageId]);

  const contentRoute = useMemo(() => {
    if (!adventureId) return "";
    if (passageId !== null && !isNaN(passageId)) {
      return getAdventureContentPassageRoute(adventureId, passageId);
    }
    return getAdventureContentRoute(adventureId);
  }, [adventureId, passageId]);

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
