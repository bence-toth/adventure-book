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
  NOTES: "passage-notes",
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

export const DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS = {
  OVERLAY: "confirmation-modal-overlay",
  DIALOG: "confirmation-modal-dialog",
  CONTENT: "confirmation-modal-content",
  MESSAGE: "confirmation-modal-message",
  ACTIONS: "confirmation-modal-actions",
} as const;

export const TOP_BAR_TEST_IDS = {
  LOGO: "top-bar-logo",
  BACK_BUTTON: "top-bar-back-button",
  AUTHOR_TOOLS_TOGGLE: "top-bar-author-tools-toggle",
} as const;
