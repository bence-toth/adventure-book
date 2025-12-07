export const ADVENTURE_TEST_SIDEBAR_TEST_IDS = {
  DEBUG_MODE_TOGGLE: "debug-mode-toggle",
} as const;

export const DEBUG_NAVIGATION_TEST_IDS = {
  INTRODUCTION: "debug-nav-introduction",
} as const;

export const getDebugNavigationPassageTestId = (passageId: number): string => {
  return `debug-nav-passage-${passageId}`;
};
