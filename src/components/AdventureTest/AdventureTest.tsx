import { useParams, useNavigate } from "react-router-dom";
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
import { AdventureTestSidebar } from "./AdventureTestSidebar/AdventureTestSidebar";
import { LoadingState } from "./LoadingState/LoadingState";
import { IntroductionView } from "./IntroductionView/IntroductionView";
import { PassageView } from "./PassageView/PassageView";
import { useAdventureTestState } from "./useAdventureTestState";

export const AdventureTest = () => {
  const { id, adventureId } = useParams<{ id: string; adventureId: string }>();
  const navigate = useNavigate();
  const { adventure, isLoading, error, isDebugModeEnabled } = useAdventure();

  // If no id is provided, we're in introduction mode
  const isIntroduction = !id;
  const passageId = id ? parseInt(id, 10) : null;

  // Manage inventory state using custom hook
  const { inventory, handleAddItem, handleRemoveItem } = useAdventureTestState({
    adventure,
    passageId,
    isIntroduction,
  });

  if (isLoading) {
    return (
      <AdventureLayout
        sidebar={
          <AdventureTestSidebar
            inventory={inventory}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
          />
        }
      >
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
      <AdventureLayout
        sidebar={
          <AdventureTestSidebar
            inventory={inventory}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
          />
        }
      >
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

  const currentPassage = adventure.passages[passageId];

  if (!currentPassage) {
    throw new PassageNotFoundError(passageId);
  }

  const handleChoiceClick = (nextId: number) => {
    navigate(getAdventureTestPassageRoute(adventureId, nextId));
  };

  const handleRestartClick = () => {
    navigate(getAdventureTestRoute(adventureId));
  };

  return (
    <AdventureLayout
      sidebar={
        <AdventureTestSidebar
          inventory={inventory}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
        />
      }
    >
      <PassageView
        passage={currentPassage}
        isDebugModeEnabled={isDebugModeEnabled}
        onChoiceClick={handleChoiceClick}
        onRestart={handleRestartClick}
      />
    </AdventureLayout>
  );
};
