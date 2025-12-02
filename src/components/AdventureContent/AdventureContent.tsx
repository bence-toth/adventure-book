import { useParams, useNavigate } from "react-router-dom";
import {
  getAdventureContentPassageRoute,
  SPECIAL_PASSAGES,
  getAdventureContentRoute,
} from "@/constants/routes";
import { useAdventure } from "@/context/useAdventure";
import {
  AdventureLoadError,
  AdventureNotFoundError,
  InvalidPassageIdError,
  PassageNotFoundError,
} from "@/utils/errors";
import { AdventureLayout } from "@/components/layouts/AdventureLayout/AdventureLayout";
import { AdventureContentSidebar } from "./AdventureContentSidebar/AdventureContentSidebar";
import { LoadingState } from "./LoadingState/LoadingState";
import { IntroductionView } from "./IntroductionView/IntroductionView";
import { ResetPassage } from "./ResetPassage/ResetPassage";
import { PassageView } from "./PassageView/PassageView";

export const AdventureContent = () => {
  const { id, adventureId } = useParams<{ id: string; adventureId: string }>();
  const navigate = useNavigate();
  const { adventure, isLoading, error } = useAdventure();

  // If no id is provided, we're in introduction mode
  const isIntroduction = !id;
  const passageId = id ? parseInt(id, 10) : null;

  if (isLoading) {
    return (
      <AdventureLayout sidebar={<AdventureContentSidebar />}>
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
        getAdventureContentPassageRoute(adventureId, SPECIAL_PASSAGES.START)
      );
    };

    return (
      <AdventureLayout sidebar={<AdventureContentSidebar />}>
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

  // Handle passage 0 (reset) - redirect to introduction
  if (passageId === SPECIAL_PASSAGES.RESET) {
    return (
      <AdventureLayout sidebar={<AdventureContentSidebar />}>
        <ResetPassage />
      </AdventureLayout>
    );
  }

  const currentPassage = adventure.passages[passageId];

  if (!currentPassage) {
    throw new PassageNotFoundError(passageId);
  }

  const handleChoiceClick = (nextId: number) => {
    navigate(getAdventureContentPassageRoute(adventureId, nextId));
  };

  const handleRestartClick = () => {
    navigate(getAdventureContentRoute(adventureId));
  };

  return (
    <AdventureLayout sidebar={<AdventureContentSidebar />}>
      <PassageView
        passage={currentPassage}
        onChoiceClick={handleChoiceClick}
        onRestart={handleRestartClick}
      />
    </AdventureLayout>
  );
};
