import { useNavigate } from "react-router-dom";
import { getPassageRoute, SPECIAL_PASSAGES } from "../../constants/routes";
import {
  INTRODUCTION_TEST_IDS,
  getIntroParagraphTestId,
} from "../../constants/testIds";
import { Button } from "../common";
import { useStory } from "../../hooks/useStory";
import "./Introduction.css";

export const Introduction = () => {
  const navigate = useNavigate();
  const { story, storyId, loading, error } = useStory();

  const handleStartAdventure = () => {
    if (!storyId) return;
    navigate(getPassageRoute(storyId, SPECIAL_PASSAGES.START));
  };

  if (loading) {
    return (
      <div className="introduction-page-content">
        <div
          className="introduction"
          data-testid={INTRODUCTION_TEST_IDS.CONTAINER}
        >
          <p>Loading story...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="introduction-page-content">
        <div
          className="introduction"
          data-testid={INTRODUCTION_TEST_IDS.CONTAINER}
        >
          <p>Error loading story: {error || "Story not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="introduction-page-content">
      <div
        className="introduction"
        data-testid={INTRODUCTION_TEST_IDS.CONTAINER}
      >
        <h1 data-testid={INTRODUCTION_TEST_IDS.TITLE}>
          {story.metadata.title}
        </h1>
        <div className="intro-text" data-testid={INTRODUCTION_TEST_IDS.TEXT}>
          {story.intro.paragraphs.map((paragraph, index) => (
            <p
              className="intro-paragraph"
              key={index}
              data-testid={getIntroParagraphTestId(index)}
            >
              {paragraph}
            </p>
          ))}
        </div>
        <div className="intro-action">
          <Button
            onClick={handleStartAdventure}
            data-testid={INTRODUCTION_TEST_IDS.START_BUTTON}
          >
            {story.intro.action}
          </Button>
        </div>
      </div>
    </div>
  );
};
