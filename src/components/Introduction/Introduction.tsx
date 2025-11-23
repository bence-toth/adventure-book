import { useNavigate } from "react-router-dom";
import { getPassageRoute, SPECIAL_PASSAGES } from "@/constants/routes";
import {
  INTRODUCTION_TEST_IDS,
  getIntroParagraphTestId,
} from "@/constants/testIds";
import { Button } from "@/components/common";
import { useAdventure } from "@/context/useAdventure";
import { AdventureLoadError, AdventureNotFoundError } from "@/utils/errors";
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
  const { adventure, adventureId, loading, error } = useAdventure();

  const handleStartAdventure = () => {
    navigate(getPassageRoute(adventureId, SPECIAL_PASSAGES.START));
  };

  if (loading) {
    return (
      <IntroductionPageContent>
        <IntroductionContainer data-testid={INTRODUCTION_TEST_IDS.CONTAINER}>
          <p>Loading adventure...</p>
        </IntroductionContainer>
      </IntroductionPageContent>
    );
  }

  if (error) {
    throw new AdventureLoadError(error);
  }

  if (!adventure) {
    throw new AdventureNotFoundError();
  }

  return (
    <IntroductionPageContent>
      <IntroductionContainer data-testid={INTRODUCTION_TEST_IDS.CONTAINER}>
        <IntroductionTitle data-testid={INTRODUCTION_TEST_IDS.TITLE}>
          {adventure.metadata.title}
        </IntroductionTitle>
        <IntroText data-testid={INTRODUCTION_TEST_IDS.TEXT}>
          {adventure.intro.paragraphs.map((paragraph, index) => (
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
            {adventure.intro.action}
          </Button>
        </IntroAction>
      </IntroductionContainer>
    </IntroductionPageContent>
  );
};
