export const NAVIGATION_TEST_IDS = {
  INTRODUCTION: "nav-introduction",
} as const;

export const getNavigationPassageTestId = (passageId: number): string => {
  return `nav-passage-${passageId}`;
};
