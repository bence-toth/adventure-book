import { useContext } from "react";
import {
  AdventureContext,
  type AdventureContextType,
} from "./AdventureContext";

export const useAdventure = (): AdventureContextType => {
  const context = useContext(AdventureContext);
  if (context === undefined) {
    throw new Error("useAdventure must be used within a AdventureProvider");
  }
  return context;
};
