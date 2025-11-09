export const ROUTES = {
  ROOT: "/",
  TEST: "/test",
  EDIT: "/edit",
} as const;

export const getPassageRoute = (id: number | string): string => {
  return `${ROUTES.TEST}/passage/${id}`;
};

export const PASSAGE_ROUTE_PATTERN = `${ROUTES.TEST}/passage/:id`;

export const SPECIAL_PASSAGES = {
  RESET: 0,
  START: 1,
} as const;
