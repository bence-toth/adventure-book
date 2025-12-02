import {
  PASSAGE_TEST_IDS,
  getPassageParagraphTestId,
  getChoiceButtonTestId,
} from "@/constants/testIds";
import { Button } from "@/components/common/Button/Button";
import type { Passage } from "@/data/types";
import {
  ContentContainer,
  ContentText,
  ContentParagraph,
  PassageNotes,
  Choices,
} from "./PassageView.styles";

interface PassageViewProps {
  passage: Passage;
  isDebugModeEnabled: boolean;
  onChoiceClick: (nextId: number) => void;
  onRestart: () => void;
}

export const PassageView = ({
  passage,
  isDebugModeEnabled,
  onChoiceClick,
  onRestart,
}: PassageViewProps) => {
  return (
    <ContentContainer data-testid={PASSAGE_TEST_IDS.CONTAINER}>
      {isDebugModeEnabled && passage.notes && (
        <PassageNotes data-testid={PASSAGE_TEST_IDS.NOTES}>
          {passage.notes}
        </PassageNotes>
      )}
      <ContentText data-testid={PASSAGE_TEST_IDS.TEXT}>
        {passage.paragraphs.map((paragraph, index) => (
          <ContentParagraph
            key={index}
            data-testid={getPassageParagraphTestId(index)}
          >
            {paragraph}
          </ContentParagraph>
        ))}
      </ContentText>
      <Choices data-testid={PASSAGE_TEST_IDS.CHOICES}>
        {passage.ending ? (
          <Button
            onClick={onRestart}
            data-testid={PASSAGE_TEST_IDS.RESTART_BUTTON}
          >
            Restart adventure
          </Button>
        ) : (
          passage.choices!.map((choice, index) => (
            <Button
              key={index}
              onClick={() => onChoiceClick(choice.goto)}
              data-testid={getChoiceButtonTestId(index)}
              data-goto={choice.goto}
            >
              {isDebugModeEnabled
                ? `${choice.goto}: ${choice.text}`
                : choice.text}
            </Button>
          ))
        )}
      </Choices>
    </ContentContainer>
  );
};
