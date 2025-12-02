import { PASSAGE_TEST_IDS } from "@/constants/testIds";
import {
  ContentContainer,
  ContentText,
  ContentParagraph,
} from "./ResetPassage.styles";

export const ResetPassage = () => {
  return (
    <ContentContainer data-testid={PASSAGE_TEST_IDS.RESET_PASSAGE}>
      <ContentText>
        <ContentParagraph>Resetting your adventure…</ContentParagraph>
      </ContentText>
    </ContentContainer>
  );
};
