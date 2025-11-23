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
  getPassageRoute,
  SPECIAL_PASSAGES,
  getAdventureTestRoute,
} from "@/constants/routes";
import {
  PASSAGE_TEST_IDS,
  ERROR_TEST_IDS,
  getPassageParagraphTestId,
  getChoiceButtonTestId,
} from "@/constants/testIds";
import { Button } from "@/components/common";
import { useAdventure } from "@/context/useAdventure";
import { Sidebar } from "./Sidebar/Sidebar";
import {
  PageLayout,
  PageContent,
  PassageContainer,
  PassageText,
  PassageParagraph,
  Choices,
  ErrorContainer,
  ErrorTitle,
  ErrorMessage,
} from "./Passage.styles";

export const Passage = () => {
  const { id, adventureId } = useParams<{ id: string; adventureId: string }>();
  const navigate = useNavigate();
  const { adventure, loading, error } = useAdventure();

  const passageId = parseInt(id ?? "1", 10);

  useEffect(() => {
    if (!adventureId || !adventure) return;

    if (!isNaN(passageId)) {
      if (passageId === SPECIAL_PASSAGES.RESET) {
        // Special case: passage 0 clears localStorage and redirects to introduction
        clearCurrentPassageId(adventureId);
        clearInventory(adventureId);
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
  }, [passageId, navigate, adventureId, adventure]);

  if (loading) {
    return (
      <PageLayout>
        <Sidebar />
        <PageContent>
          <PassageContainer data-testid={PASSAGE_TEST_IDS.CONTAINER}>
            <p>Loading passage...</p>
          </PassageContainer>
        </PageContent>
      </PageLayout>
    );
  }

  if (error || !adventure || !adventureId) {
    return (
      <PageLayout>
        <Sidebar />
        <PageContent>
          <ErrorContainer data-testid={ERROR_TEST_IDS.PASSAGE_NOT_FOUND}>
            <ErrorTitle>Error</ErrorTitle>
            <ErrorMessage>{error || "Adventure not found"}</ErrorMessage>
          </ErrorContainer>
        </PageContent>
      </PageLayout>
    );
  }

  if (isNaN(passageId) || passageId < 0 || !Number.isInteger(passageId)) {
    return (
      <PageLayout>
        <Sidebar />
        <PageContent>
          <ErrorContainer data-testid={ERROR_TEST_IDS.INVALID_ID}>
            <ErrorTitle>Invalid passage ID</ErrorTitle>
            <ErrorMessage>
              The passage ID "{id}" is not valid. Please use a valid number.
            </ErrorMessage>
            <Button
              onClick={() =>
                navigate(getPassageRoute(adventureId, SPECIAL_PASSAGES.RESET))
              }
              data-testid={ERROR_TEST_IDS.GO_TO_INTRODUCTION_BUTTON}
            >
              Go to introduction
            </Button>
          </ErrorContainer>
        </PageContent>
      </PageLayout>
    );
  }

  // Handle passage 0 (reset) - this will be handled in useEffect, but we need to prevent
  // the rest of the component from rendering while the redirect happens
  if (passageId === SPECIAL_PASSAGES.RESET) {
    return (
      <PageLayout>
        <Sidebar />
        <PageContent>
          <PassageContainer data-testid={PASSAGE_TEST_IDS.RESET_PASSAGE}>
            <PassageText>
              <PassageParagraph>Resetting your adventure…</PassageParagraph>
            </PassageText>
          </PassageContainer>
        </PageContent>
      </PageLayout>
    );
  }

  const currentPassage = adventure.passages[passageId];

  if (!currentPassage) {
    return (
      <PageLayout>
        <Sidebar />
        <PageContent>
          <ErrorContainer data-testid={ERROR_TEST_IDS.PASSAGE_NOT_FOUND}>
            <ErrorTitle>Passage not found</ErrorTitle>
            <ErrorMessage>
              Passage #{passageId} does not exist in this adventure.
            </ErrorMessage>
            <Button
              onClick={() =>
                navigate(getPassageRoute(adventureId, SPECIAL_PASSAGES.RESET))
              }
              data-testid={ERROR_TEST_IDS.GO_TO_INTRODUCTION_BUTTON}
            >
              Go to introduction
            </Button>
          </ErrorContainer>
        </PageContent>
      </PageLayout>
    );
  }

  const handleChoiceClick = (nextId: number) => {
    navigate(getPassageRoute(adventureId, nextId));
  };

  const handleRestartClick = () => {
    clearCurrentPassageId(adventureId!);
    clearInventory(adventureId!);
    navigate(getAdventureTestRoute(adventureId!));
  };

  return (
    <PageLayout>
      <Sidebar />
      <PageContent>
        <PassageContainer data-testid={PASSAGE_TEST_IDS.CONTAINER}>
          <PassageText data-testid={PASSAGE_TEST_IDS.TEXT}>
            {currentPassage.paragraphs.map((paragraph, index) => (
              <PassageParagraph
                key={index}
                data-testid={getPassageParagraphTestId(index)}
              >
                {paragraph}
              </PassageParagraph>
            ))}
          </PassageText>
          <Choices data-testid={PASSAGE_TEST_IDS.CHOICES}>
            {currentPassage.ending ? (
              <Button
                onClick={handleRestartClick}
                data-testid={PASSAGE_TEST_IDS.RESTART_BUTTON}
              >
                Restart adventure
              </Button>
            ) : (
              currentPassage.choices!.map((choice, index) => (
                <Button
                  key={index}
                  onClick={() => handleChoiceClick(choice.goto)}
                  data-testid={getChoiceButtonTestId(index)}
                  data-goto={choice.goto}
                >
                  {choice.text}
                </Button>
              ))
            )}
          </Choices>
        </PassageContainer>
      </PageContent>
    </PageLayout>
  );
};
