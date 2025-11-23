import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Play, PenTool } from "lucide-react";
import { getStoryTestRoute, getStoryEditRoute } from "@/constants/routes";
import { ButtonLink } from "@/components/common";
import { TopBarNav } from "./StoryNavigation.styles";

export interface StoryNavigationProps {
  storyId: string;
}

export const StoryNavigation = ({ storyId }: StoryNavigationProps) => {
  const location = useLocation();

  const isActive = useCallback(
    (path: string) => {
      return location.pathname === path || location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  const testRoute = useMemo(
    () => (storyId ? getStoryTestRoute(storyId) : ""),
    [storyId]
  );
  const editRoute = useMemo(
    () => (storyId ? getStoryEditRoute(storyId) : ""),
    [storyId]
  );

  return (
    <TopBarNav as="nav" aria-label="Main navigation">
      <ButtonLink
        to={testRoute}
        selected={isActive(testRoute)}
        size="small"
        icon={Play}
      >
        Test
      </ButtonLink>
      <ButtonLink
        to={editRoute}
        selected={isActive(editRoute)}
        size="small"
        icon={PenTool}
      >
        Edit
      </ButtonLink>
    </TopBarNav>
  );
};
