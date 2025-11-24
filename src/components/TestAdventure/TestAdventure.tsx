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
  INTRODUCTION_TEST_IDS,
  getPassageParagraphTestId,
  getIntroParagraphTestId,
  getChoiceButtonTestId,
} from "@/constants/testIds";
import { Button } from "@/components/common";
import { useAdventure } from "@/context/useAdventure";
import {
  AdventureLoadError,
  AdventureNotFoundError,
  InvalidPassageIdError,
  PassageNotFoundError,
} from "@/utils/errors";
import { TestAdventureSidebar } from "./TestAdventureSidebar/TestAdventureSidebar";
import {
  PageLayout,
  PageContent,
  ContentContainer,
  ContentText,
  ContentParagraph,
  Choices,
  ContentTitle,
} from "./TestAdventure.styles";

export const TestAdventure = () => {
  const { id, adventureId } = useParams<{ id: string; adventureId: string }>();
  const navigate = useNavigate();
  const { adventure, loading, error } = useAdventure();

  // If no id is provided, we're in introduction mode
  const isIntroduction = !id;
  const passageId = id ? parseInt(id, 10) : null;

  useEffect(() => {
    if (!adventureId || !adventure || isIntroduction || passageId === null)
      return;

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
  }, [passageId, navigate, adventureId, adventure, isIntroduction]);

  if (loading) {
    return (
      <PageLayout>
        <TestAdventureSidebar />
        <PageContent>
          <ContentContainer
            data-testid={
              isIntroduction
                ? INTRODUCTION_TEST_IDS.CONTAINER
                : PASSAGE_TEST_IDS.CONTAINER
            }
          >
            <p>Loading {isIntroduction ? "adventure" : "passage"}...</p>
          </ContentContainer>
        </PageContent>
      </PageLayout>
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
      navigate(getPassageRoute(adventureId, SPECIAL_PASSAGES.START));
    };

    return (
      <PageLayout>
        <TestAdventureSidebar />
        <PageContent>
          <ContentContainer data-testid={INTRODUCTION_TEST_IDS.CONTAINER}>
            <ContentTitle data-testid={INTRODUCTION_TEST_IDS.TITLE}>
              {adventure.metadata.title}
            </ContentTitle>
            <ContentText data-testid={INTRODUCTION_TEST_IDS.TEXT}>
              {adventure.intro.paragraphs.map((paragraph, index) => (
                <ContentParagraph
                  key={index}
                  data-testid={getIntroParagraphTestId(index)}
                >
                  {paragraph}
                </ContentParagraph>
              ))}
            </ContentText>
            <Choices>
              <Button
                onClick={handleStartAdventure}
                data-testid={INTRODUCTION_TEST_IDS.START_BUTTON}
              >
                {adventure.intro.action}
              </Button>
            </Choices>
          </ContentContainer>
        </PageContent>
      </PageLayout>
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
      <PageLayout>
        <TestAdventureSidebar />
        <PageContent>
          <ContentContainer data-testid={PASSAGE_TEST_IDS.RESET_PASSAGE}>
            <ContentText>
              <ContentParagraph>Resetting your adventure…</ContentParagraph>
            </ContentText>
          </ContentContainer>
        </PageContent>
      </PageLayout>
    );
  }

  const currentPassage = adventure.passages[passageId];

  if (!currentPassage) {
    throw new PassageNotFoundError(passageId);
  }

  const handleChoiceClick = (nextId: number) => {
    navigate(getPassageRoute(adventureId, nextId));
  };

  const handleRestartClick = () => {
    clearCurrentPassageId(adventureId);
    clearInventory(adventureId);
    navigate(getAdventureTestRoute(adventureId));
  };

  return (
    <PageLayout>
      <TestAdventureSidebar />
      <PageContent>
        <ContentContainer data-testid={PASSAGE_TEST_IDS.CONTAINER}>
          <ContentText data-testid={PASSAGE_TEST_IDS.TEXT}>
            {currentPassage.paragraphs.map((paragraph, index) => (
              <ContentParagraph
                key={index}
                data-testid={getPassageParagraphTestId(index)}
              >
                {paragraph}
              </ContentParagraph>
            ))}
          </ContentText>
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
        </ContentContainer>
      </PageContent>
    </PageLayout>
  );
};
