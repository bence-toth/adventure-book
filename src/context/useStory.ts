import { useContext } from "react";
import { StoryContext, type StoryContextType } from "./StoryContext";

export const useStory = (): StoryContextType => {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
};
