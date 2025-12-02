import { useParams, useNavigate } from "react-router-dom";
import {
  getAdventureContentPassageRoute,
  SPECIAL_PASSAGES,
  getAdventureContentRoute,
} from "@/constants/routes";
import {
  PASSAGE_TEST_IDS,
  INTRODUCTION_TEST_IDS,
  getPassageParagraphTestId,
  getIntroParagraphTestId,
  getChoiceButtonTestId,
} from "@/constants/testIds";
import { Button } from "@/components/common/Button/Button";
import { useAdventure } from "@/context/useAdventure";
import {
  AdventureLoadError,
  AdventureNotFoundError,
  InvalidPassageIdError,
  PassageNotFoundError,
} from "@/utils/errors";
import { AdventureTopBar } from "@/components/AdventureTopBar/AdventureTopBar";
import { AdventureContentSidebar } from "./AdventureContentSidebar/AdventureContentSidebar";
import {
  PageLayout,
  PageContent,
  ContentContainer,
  ContentText,
  ContentParagraph,
  PassageNotes,
  Choices,
  ContentTitle,
} from "./AdventureContent.styles";

export const AdventureContent = () => {
  const { id, adventureId } = useParams<{ id: string; adventureId: string }>();
  const navigate = useNavigate();
  const { adventure, isLoading, error } = useAdventure();

  // If no id is provided, we're in introduction mode
  const isIntroduction = !id;
  const passageId = id ? parseInt(id, 10) : null;

  if (isLoading) {
    return (
      <>
        <AdventureTopBar />
        <PageLayout>
          <AdventureContentSidebar />
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
      </>
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
      <>
        <AdventureTopBar />
        <PageLayout>
          <AdventureContentSidebar />
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
      </>
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
      <>
        <AdventureTopBar />
        <PageLayout>
          <AdventureContentSidebar />
          <PageContent>
            <ContentContainer data-testid={PASSAGE_TEST_IDS.RESET_PASSAGE}>
              <ContentText>
                <ContentParagraph>Resetting your adventure…</ContentParagraph>
              </ContentText>
            </ContentContainer>
          </PageContent>
        </PageLayout>
      </>
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
    <>
      <AdventureTopBar />
      <PageLayout>
        <AdventureContentSidebar />
        <PageContent>
          <ContentContainer data-testid={PASSAGE_TEST_IDS.CONTAINER}>
            {currentPassage.notes && (
              <PassageNotes data-testid={PASSAGE_TEST_IDS.NOTES}>
                {currentPassage.notes}
              </PassageNotes>
            )}
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
                    {`${choice.goto}: ${choice.text}`}
                  </Button>
                ))
              )}
            </Choices>
          </ContentContainer>
        </PageContent>
      </PageLayout>
    </>
  );
};
