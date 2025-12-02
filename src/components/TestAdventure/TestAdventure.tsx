import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  addItemToInventory,
  removeItemFromInventory,
} from "@/data/adventureLoader";
import {
  saveCurrentPassageId,
  clearCurrentPassageId,
  clearInventory,
} from "@/utils/localStorage";
import {
  getAdventureTestPassageRoute,
  SPECIAL_PASSAGES,
  getAdventureTestRoute,
} from "@/constants/routes";
import { useAdventure } from "@/context/useAdventure";
import {
  AdventureLoadError,
  AdventureNotFoundError,
  InvalidPassageIdError,
  PassageNotFoundError,
} from "@/utils/errors";
import { AdventureLayout } from "@/components/layouts/AdventureLayout/AdventureLayout";
import { TestAdventureSidebar } from "./TestAdventureSidebar/TestAdventureSidebar";
import { LoadingState } from "./LoadingState/LoadingState";
import { IntroductionView } from "./IntroductionView/IntroductionView";
import { ResetPassage } from "./ResetPassage/ResetPassage";
import { PassageView } from "./PassageView/PassageView";

export const TestAdventure = () => {
  const { id, adventureId } = useParams<{ id: string; adventureId: string }>();
  const navigate = useNavigate();
  const { adventure, isLoading, error, isDebugModeEnabled } = useAdventure();

  // If no id is provided, we're in introduction mode
  const isIntroduction = !id;
  const passageId = id ? parseInt(id, 10) : null;

  // Clear inventory and passage ID when viewing introduction
  useEffect(() => {
    if (!adventureId || !isIntroduction) return;

    clearCurrentPassageId(adventureId);
    clearInventory(adventureId);

    // Dispatch event to notify sidebar
    window.dispatchEvent(new Event("inventoryUpdate"));
  }, [adventureId, isIntroduction]);

  useEffect(() => {
    if (!adventureId || !adventure || isIntroduction || passageId === null)
      return;

    if (!isNaN(passageId)) {
      if (passageId === SPECIAL_PASSAGES.RESET) {
        // Special case: passage 0 clears localStorage and redirects to introduction
        navigate(getAdventureTestRoute(adventureId));
        return;
      } else if (passageId >= 1) {
        saveCurrentPassageId(adventureId, passageId);

        // Execute effects for this passage (only non-ending passages have effects)
        const passage = adventure.passages[passageId];
        if (passage && !passage.ending && passage.effects) {
          passage.effects.forEach((effect) => {
            if (effect.type === "add_item") {
              addItemToInventory(adventureId, effect.item);
            } else if (effect.type === "remove_item") {
              removeItemFromInventory(adventureId, effect.item);
            }
          });

          // Dispatch an event to notify other components
          window.dispatchEvent(new Event("inventoryUpdate"));
        }
      }
    }
  }, [passageId, navigate, adventureId, adventure, isIntroduction]);

  if (isLoading) {
    return (
      <AdventureLayout sidebar={<TestAdventureSidebar />}>
        <LoadingState isIntroduction={isIntroduction} />
      </AdventureLayout>
    );
  }

  if (error) {
    throw new AdventureLoadError(error);
  }

  if (!adventure || !adventureId) {
    throw new AdventureNotFoundError();
  }

  // Handle introduction view
  if (isIntroduction) {
    const handleStartAdventure = () => {
      navigate(
        getAdventureTestPassageRoute(adventureId, SPECIAL_PASSAGES.START)
      );
    };

    return (
      <AdventureLayout sidebar={<TestAdventureSidebar />}>
        <IntroductionView
          adventure={adventure}
          onStart={handleStartAdventure}
        />
      </AdventureLayout>
    );
  }

  // Handle passage view - passageId is guaranteed to be a number here
  if (
    passageId === null ||
    isNaN(passageId) ||
    passageId < 0 ||
    !Number.isInteger(passageId)
  ) {
    throw new InvalidPassageIdError(id || "undefined");
  }

  // Handle passage 0 (reset) - this will be handled in useEffect, but we need to prevent
  // the rest of the component from rendering while the redirect happens
  if (passageId === SPECIAL_PASSAGES.RESET) {
    return (
      <AdventureLayout sidebar={<TestAdventureSidebar />}>
        <ResetPassage />
      </AdventureLayout>
    );
  }

  const currentPassage = adventure.passages[passageId];

  if (!currentPassage) {
    throw new PassageNotFoundError(passageId);
  }

  const handleChoiceClick = (nextId: number) => {
    navigate(getAdventureTestPassageRoute(adventureId, nextId));
  };

  const handleRestartClick = () => {
    clearCurrentPassageId(adventureId);
    clearInventory(adventureId);
    navigate(getAdventureTestRoute(adventureId));
  };

  return (
    <AdventureLayout sidebar={<TestAdventureSidebar />}>
      <PassageView
        passage={currentPassage}
        isDebugModeEnabled={isDebugModeEnabled}
        onChoiceClick={handleChoiceClick}
        onRestart={handleRestartClick}
      />
    </AdventureLayout>
  );
};
