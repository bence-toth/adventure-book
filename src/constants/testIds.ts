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
  TEXT: "passage-text",
  CHOICES: "choices",
  RESTART_BUTTON: "restart-button",
  RESET_PASSAGE: "reset-passage",
} as const;

export const getPassageParagraphTestId = (index: number): string => {
  return `passage-paragraph-${index}`;
};

export const getChoiceButtonTestId = (index: number): string => {
  return `choice-button-${index}`;
};

export const ERROR_TEST_IDS = {
  INVALID_ID: "error-invalid-id",
  PASSAGE_NOT_FOUND: "error-passage-not-found",
  GO_TO_INTRODUCTION_BUTTON: "go-to-introduction-button",
} as const;
