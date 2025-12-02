import { INTRODUCTION_TEST_IDS, PASSAGE_TEST_IDS } from "@/constants/testIds";
import { ContentContainer } from "./LoadingState.styles";

interface LoadingStateProps {
  isIntroduction: boolean;
}

export const LoadingState = ({ isIntroduction }: LoadingStateProps) => {
  return (
    <ContentContainer
      data-testid={
        isIntroduction
          ? INTRODUCTION_TEST_IDS.CONTAINER
          : PASSAGE_TEST_IDS.CONTAINER
      }
    >
      <p data-testid="loading-state">
        Loading {isIntroduction ? "adventure" : "passage"}...
      </p>
    </ContentContainer>
  );
};
