import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Play, PenTool } from "lucide-react";
import {
  getAdventureTestRoute,
  getAdventureEditRoute,
} from "@/constants/routes";
import { ButtonLink } from "@/components/common/ButtonLink/ButtonLink";
import { TopBarNav } from "./AdventureNavigation.styles";

export interface AdventureNavigationProps {
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
      <ButtonLink
        to={testRoute}
        variant={isActive(testRoute) ? "primary" : "neutral"}
        size="small"
        icon={Play}
      >
        Test
      </ButtonLink>
      <ButtonLink
        to={editRoute}
        variant={isActive(editRoute) ? "primary" : "neutral"}
        size="small"
        icon={PenTool}
      >
        Edit
      </ButtonLink>
    </TopBarNav>
  );
};
