import { useParams } from "react-router-dom";
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
import { IntroductionEditView } from "./IntroductionView/IntroductionEditView";
import { PassageEditView } from "./PassageView/PassageEditView";

export const AdventureContent = () => {
  const { id, adventureId } = useParams<{ id: string; adventureId: string }>();
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
    return (
      <AdventureLayout sidebar={<AdventureContentSidebar />}>
        <IntroductionEditView adventure={adventure} />
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

  return (
    <AdventureLayout sidebar={<AdventureContentSidebar />}>
      <PassageEditView passageId={passageId} passage={currentPassage} />
    </AdventureLayout>
  );
};
