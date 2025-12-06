export const ROUTES = {
  ROOT: "/",
  STORY_STRUCTURE: "/adventure/:adventureId/structure",
  STORY_CONTENT: "/adventure/:adventureId/content",
  STORY_TEST: "/adventure/:adventureId/test",
} as const;

export const getAdventureTestRoute = (
  adventureId: string | null | undefined
): string => {
  if (!adventureId) return "";
  return `/adventure/${adventureId}/test/introduction`;
};

export const getAdventureTestPassageRoute = (
  adventureId: string | null | undefined,
  passageId: number | string
): string => {
  if (!adventureId) return "";
  return `/adventure/${adventureId}/test/passage/${passageId}`;
};

export const getAdventureContentRoute = (
  adventureId: string | null | undefined
): string => {
  if (!adventureId) return "";
  return `/adventure/${adventureId}/content/introduction`;
};

export const getAdventureContentPassageRoute = (
  adventureId: string | null | undefined,
  passageId: number | string
): string => {
  if (!adventureId) return "";
  return `/adventure/${adventureId}/content/passage/${passageId}`;
};

export const getAdventureStructureRoute = (
  adventureId: string | null | undefined
): string => {
  if (!adventureId) return "";
  return `/adventure/${adventureId}/structure`;
};

export const SPECIAL_PASSAGES = {
  START: 1,
} as const;
