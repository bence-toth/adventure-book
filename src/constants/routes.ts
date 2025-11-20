export const ROUTES = {
  ROOT: "/",
  STORY_TEST: "/adventure/:storyId/test",
  STORY_EDIT: "/adventure/:storyId/edit",
} as const;

export const getStoryTestRoute = (storyId: string): string => {
  return `/adventure/${storyId}/test`;
};

export const getStoryEditRoute = (storyId: string): string => {
  return `/adventure/${storyId}/edit`;
};

export const getPassageRoute = (
  storyId: string,
  passageId: number | string
): string => {
  return `/adventure/${storyId}/test/passage/${passageId}`;
};

export const PASSAGE_ROUTE_PATTERN = `/adventure/:storyId/test/passage/:id`;

export const SPECIAL_PASSAGES = {
  RESET: 0,
  START: 1,
} as const;
