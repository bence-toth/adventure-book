import {
  INTRODUCTION_TEST_IDS,
  PASSAGE_TEST_IDS,
  LOADING_STATE_TEST_ID,
} from "../testIds";
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
      <p data-testid={LOADING_STATE_TEST_ID}>
        Loading {isIntroduction ? "adventure" : "passage"}...
      </p>
    </ContentContainer>
  );
};
