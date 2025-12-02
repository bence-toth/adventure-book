import {
  INTRODUCTION_TEST_IDS,
  getIntroParagraphTestId,
} from "@/constants/testIds";
import { Button } from "@/components/common/Button/Button";
import type { Adventure } from "@/data/types";
import {
  ContentContainer,
  ContentTitle,
  ContentText,
  ContentParagraph,
  Choices,
} from "./IntroductionView.styles";

interface IntroductionViewProps {
  adventure: Adventure;
  onStart: () => void;
}

export const IntroductionView = ({
  adventure,
  onStart,
}: IntroductionViewProps) => {
  return (
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
          onClick={onStart}
          data-testid={INTRODUCTION_TEST_IDS.START_BUTTON}
        >
          {adventure.intro.action}
        </Button>
      </Choices>
    </ContentContainer>
  );
};
