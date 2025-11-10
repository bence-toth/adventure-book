import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { introduction } from "../data/storyLoader";
import { getCurrentPassageId } from "../utils/localStorage";
import { getPassageRoute, SPECIAL_PASSAGES } from "../constants/routes";
import {
  INTRODUCTION_TEST_IDS,
  getIntroParagraphTestId,
} from "../constants/testIds";
import { Button } from "./Button";
import "./Introduction.css";

export const Introduction = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const savedPassageId = getCurrentPassageId();
    if (savedPassageId !== null) {
      navigate(getPassageRoute(savedPassageId));
    }
  }, [navigate]);

  const handleStartAdventure = () => {
    navigate(getPassageRoute(SPECIAL_PASSAGES.START));
  };

  return (
    <div className="introduction" data-testid={INTRODUCTION_TEST_IDS.CONTAINER}>
      <h1 data-testid={INTRODUCTION_TEST_IDS.TITLE}>{introduction.title}</h1>
      <div className="intro-text" data-testid={INTRODUCTION_TEST_IDS.TEXT}>
        {introduction.paragraphs.map((paragraph, index) => (
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
          {introduction.action}
        </Button>
      </div>
    </div>
  );
};
