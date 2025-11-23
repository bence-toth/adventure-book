import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  addItemToInventory,
  removeItemFromInventory,
} from "../../data/storyLoader";
import {
  saveCurrentPassageId,
  clearCurrentPassageId,
  clearInventory,
} from "../../utils/localStorage";
import {
  getPassageRoute,
  SPECIAL_PASSAGES,
  getStoryTestRoute,
} from "../../constants/routes";
import {
  PASSAGE_TEST_IDS,
  ERROR_TEST_IDS,
  getPassageParagraphTestId,
  getChoiceButtonTestId,
} from "../../constants/testIds";
import { Button } from "../common";
import { useStory } from "../../hooks/useStory";
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
  const { id, storyId } = useParams<{ id: string; storyId: string }>();
  const navigate = useNavigate();
  const { story, loading, error } = useStory();

  const passageId = parseInt(id ?? "1", 10);

  useEffect(() => {
    if (!storyId || !story) return;

    if (!isNaN(passageId)) {
      if (passageId === SPECIAL_PASSAGES.RESET) {
        // Special case: passage 0 clears localStorage and redirects to introduction
        clearCurrentPassageId(storyId);
        clearInventory(storyId);
        navigate(getStoryTestRoute(storyId));
        return;
      } else if (passageId >= 1) {
        saveCurrentPassageId(storyId, passageId);

        // Execute effects for this passage (only non-ending passages have effects)
        const passage = story.passages[passageId];
        if (passage && !passage.ending && passage.effects) {
          passage.effects.forEach((effect) => {
            if (effect.type === "add_item") {
              addItemToInventory(storyId, effect.item);
            } else if (effect.type === "remove_item") {
              removeItemFromInventory(storyId, effect.item);
            }
          });

          // Dispatch an event to notify other components
          window.dispatchEvent(new Event("inventoryUpdate"));
        }
      }
    }
  }, [passageId, navigate, storyId, story]);

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

  if (error || !story || !storyId) {
    return (
      <PageLayout>
        <Sidebar />
        <PageContent>
          <ErrorContainer data-testid={ERROR_TEST_IDS.PASSAGE_NOT_FOUND}>
            <ErrorTitle>Error</ErrorTitle>
            <ErrorMessage>{error || "Story not found"}</ErrorMessage>
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
                navigate(getPassageRoute(storyId, SPECIAL_PASSAGES.RESET))
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

  const currentPassage = story.passages[passageId];

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
                navigate(getPassageRoute(storyId, SPECIAL_PASSAGES.RESET))
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
    navigate(getPassageRoute(storyId, nextId));
  };

  const handleRestartClick = () => {
    clearCurrentPassageId(storyId!);
    clearInventory(storyId!);
    navigate(getStoryTestRoute(storyId!));
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
