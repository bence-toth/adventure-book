export const INTRODUCTION_TEST_IDS = {
  CONTAINER: "introduction",
  TITLE: "intro-title",
  TEXT: "intro-text",
  START_BUTTON: "start-adventure-button",
} as const;

export const getIntroParagraphTestId = (index: number): string => {
  return `intro-paragraph-${index}`;
};

export const PASSAGE_TEST_IDS = {
  CONTAINER: "passage",
  VIEW: "passage-view",
  TEXT: "passage-text",
  NOTES: "passage-notes",
  CHOICES: "choices",
  RESTART_BUTTON: "restart-button",
  RESET_PASSAGE: "reset-passage",
} as const;

export const LOADING_STATE_TEST_ID = "loading-state" as const;

export const getPassageParagraphTestId = (index: number): string => {
  return `passage-paragraph-${index}`;
};

export const getChoiceButtonTestId = (index: number): string => {
  return `choice-button-${index}`;
};
