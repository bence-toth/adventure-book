import { useNavigate } from "react-router-dom";
import { getPassageRoute, SPECIAL_PASSAGES } from "@/constants/routes";
import {
  INTRODUCTION_TEST_IDS,
  getIntroParagraphTestId,
} from "@/constants/testIds";
import { Button } from "@/components/common";
import { useStory } from "@/context/useStory";
import {
  IntroductionPageContent,
  IntroductionContainer,
  IntroductionTitle,
  IntroText,
  IntroParagraph,
  IntroAction,
} from "./Introduction.styles";

export const Introduction = () => {
  const navigate = useNavigate();
  const { story, storyId, loading, error } = useStory();

  const handleStartAdventure = () => {
    if (!storyId) return;
    navigate(getPassageRoute(storyId, SPECIAL_PASSAGES.START));
  };

  if (loading) {
    return (
      <IntroductionPageContent>
        <IntroductionContainer data-testid={INTRODUCTION_TEST_IDS.CONTAINER}>
          <p>Loading story...</p>
        </IntroductionContainer>
      </IntroductionPageContent>
    );
  }

  if (error || !story) {
    return (
      <IntroductionPageContent>
        <IntroductionContainer data-testid={INTRODUCTION_TEST_IDS.CONTAINER}>
          <p>Error loading story: {error || "Story not found"}</p>
        </IntroductionContainer>
      </IntroductionPageContent>
    );
  }

  return (
    <IntroductionPageContent>
      <IntroductionContainer data-testid={INTRODUCTION_TEST_IDS.CONTAINER}>
        <IntroductionTitle data-testid={INTRODUCTION_TEST_IDS.TITLE}>
          {story.metadata.title}
        </IntroductionTitle>
        <IntroText data-testid={INTRODUCTION_TEST_IDS.TEXT}>
          {story.intro.paragraphs.map((paragraph, index) => (
            <IntroParagraph
              key={index}
              data-testid={getIntroParagraphTestId(index)}
            >
              {paragraph}
            </IntroParagraph>
          ))}
        </IntroText>
        <IntroAction>
          <Button
            onClick={handleStartAdventure}
            data-testid={INTRODUCTION_TEST_IDS.START_BUTTON}
          >
            {story.intro.action}
          </Button>
        </IntroAction>
      </IntroductionContainer>
    </IntroductionPageContent>
  );
};
