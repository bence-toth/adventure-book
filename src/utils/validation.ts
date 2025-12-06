import type { Effect } from "@/data/types";

export const validateTitle = (title: string): string | undefined => {
  if (!title || title.trim().length === 0) {
    return "Title must not be blank";
  }
  return undefined;
};

export const validateIntroductionText = (text: string): string | undefined => {
  if (!text || text.trim().length === 0) {
    return "Introduction content must not be blank";
  }
  return undefined;
};

export const validatePassageText = (text: string): string | undefined => {
  if (!text || text.trim().length === 0) {
    return "Passage content must not be blank";
  }
  return undefined;
};

export const validateChoiceText = (text: string): string | undefined => {
  if (!text || text.trim().length === 0) {
    return "Choice content must not be blank";
  }
  return undefined;
};

export const validateChoiceTarget = (
  target: number | null
): string | undefined => {
  if (target === null || target < 1) {
    return "Go to passage must be selected";
  }
  return undefined;
};

export const validateEffects = (effects: Effect[]): string | undefined => {
  const addedItems = new Set<string>();
  const removedItems = new Set<string>();

  for (const effect of effects) {
    const itemId = effect.item;

    if (effect.type === "add_item") {
      if (addedItems.has(itemId)) {
        return `Cannot add the same inventory item "${itemId}" multiple times`;
      }
      if (removedItems.has(itemId)) {
        return `Cannot add and remove the same inventory item "${itemId}" in the same passage`;
      }
      addedItems.add(itemId);
    } else if (effect.type === "remove_item") {
      if (removedItems.has(itemId)) {
        return `Cannot remove the same inventory item "${itemId}" multiple times`;
      }
      if (addedItems.has(itemId)) {
        return `Cannot add and remove the same inventory item "${itemId}" in the same passage`;
      }
      removedItems.add(itemId);
    }
  }

  return undefined;
};

export const validateEndingType = (
  hasChoices: boolean,
  endingType: string | undefined
): string | undefined => {
  if (!hasChoices && !endingType) {
    return "If there are no choices, ending type must be selected";
  }
  return undefined;
};
