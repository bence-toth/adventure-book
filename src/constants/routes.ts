export const ROUTES = {
  ROOT: "/",
  STORY_TEST: "/adventure/:adventureId/test",
  STORY_EDIT: "/adventure/:adventureId/edit",
} as const;

export const getAdventureTestRoute = (
  adventureId: string | null | undefined
): string => {
  if (!adventureId) return "";
  return `/adventure/${adventureId}/test`;
};

export const getAdventureEditRoute = (
  adventureId: string | null | undefined
): string => {
  if (!adventureId) return "";
  return `/adventure/${adventureId}/edit`;
};

export const getPassageRoute = (
  adventureId: string | null | undefined,
  passageId: number | string
): string => {
  if (!adventureId) return "";
  return `/adventure/${adventureId}/test/passage/${passageId}`;
};

export const PASSAGE_ROUTE_PATTERN = `/adventure/:adventureId/test/passage/:id`;

export const SPECIAL_PASSAGES = {
  RESET: 0,
  START: 1,
} as const;
