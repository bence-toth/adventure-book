import type { ComponentType } from "react";
import {
  Play,
  Skull,
  Trophy,
  PackagePlus,
  PackageMinus,
  Split,
  MoveUp,
} from "lucide-react";
import type { Passage } from "@/data/types";
import { Button } from "@/components/common";

interface PassageLinkProps {
  icon?: "play";
  passageId?: number;
  passage?: Passage;
  label?: string;
  onClick: () => void;
  isActive?: boolean;
  "data-testid"?: string;
}

const getPassageIcon = (
  passage: Passage
): ComponentType<{ size?: number; strokeWidth?: number }> => {
  // Check if it's an ending
  if (passage.ending) {
    if (passage.type === "defeat") {
      return Skull;
    }
    return Trophy; // victory or neutral
  }

  // Check for effects
  if (passage.effects) {
    const hasAddItem = passage.effects.some(
      (effect) => effect.type === "add_item"
    );
    const hasRemoveItem = passage.effects.some(
      (effect) => effect.type === "remove_item"
    );

    if (hasAddItem) {
      return PackagePlus;
    }
    if (hasRemoveItem) {
      return PackageMinus;
    }
  }

  // Check number of choices
  if (passage.choices) {
    if (passage.choices.length > 1) {
      return Split;
    }
    if (passage.choices.length === 1) {
      return MoveUp;
    }
  }

  // Default icon
  return MoveUp;
};

export const PassageLink = ({
  icon,
  passageId,
  passage,
  label,
  onClick,
  isActive = false,
  ...props
}: PassageLinkProps) => {
  let Icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  let displayLabel: string;

  if (icon === "play") {
    Icon = Play;
    displayLabel = label || "Introduction";
  } else if (passage && passageId !== undefined) {
    Icon = getPassageIcon(passage);
    displayLabel = `Passage ${passageId}`;
  } else {
    throw new Error(
      "PassageLink requires either icon='play' or both passage and passageId"
    );
  }

  return (
    <Button
      onClick={onClick}
      icon={Icon}
      size="small"
      variant={isActive ? "primary" : "neutral"}
      aria-label={displayLabel}
      {...props}
    >
      {displayLabel}
    </Button>
  );
};
