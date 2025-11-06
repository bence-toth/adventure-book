import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getPassage } from "../data/storyLoader";
import {
  saveCurrentPassageId,
  clearCurrentPassageId,
} from "../utils/localStorage";
import "./Passage.css";

export const Passage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const passageId = parseInt(id || "1", 10);

  useEffect(() => {
    if (!isNaN(passageId)) {
      if (passageId === 0) {
        // Special case: passage 0 clears localStorage and redirects to introduction
        clearCurrentPassageId();
        navigate("/");
        return;
      } else if (passageId >= 1) {
        saveCurrentPassageId(passageId);
      }
    }
  }, [passageId, navigate]);

  if (isNaN(passageId) || passageId < 0) {
    return (
      <div className="adventure-book">
        <div className="error">
          <h2>Invalid Passage ID</h2>
          <p>The passage ID "{id}" is not valid. Please use a valid number.</p>
          <button className="choice-button" onClick={() => navigate("/")}>
            Go to Introduction
          </button>
        </div>
      </div>
    );
  }

  // Handle passage 0 (reset) - this will be handled in useEffect, but we need to prevent
  // the rest of the component from rendering while the redirect happens
  if (passageId === 0) {
    return (
      <div className="adventure-book">
        <div className="passage">
          <div className="passage-text">
            <p className="passage-paragraph">Resetting your adventure...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentPassage = getPassage(passageId);

  if (!currentPassage) {
    return (
      <div className="adventure-book">
        <div className="error">
          <h2>Passage Not Found</h2>
          <p>Passage {passageId} does not exist in this adventure.</p>
          <button className="choice-button" onClick={() => navigate("/")}>
            Go to Introduction
          </button>
        </div>
      </div>
    );
  }

  const handleChoiceClick = (nextId: number) => {
    navigate(`/passage/${nextId}`);
  };

  // Check if this is an ending passage (no choices means it's an ending)
  const isEnding =
    !currentPassage.choices || currentPassage.choices.length === 0;

  return (
    <div className="adventure-book">
      <div className="passage">
        <div className="passage-text">
          {currentPassage.paragraphs?.map((paragraph, index) => (
            <p className="passage-paragraph" key={index}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className="choices">
          {isEnding ? (
            <button
              className="choice-button"
              onClick={() => {
                clearCurrentPassageId();
                navigate("/");
              }}
            >
              Start a new adventure
            </button>
          ) : (
            currentPassage.choices?.map((choice, index) => (
              <button
                key={index}
                className="choice-button"
                onClick={() => handleChoiceClick(choice.goto)}
              >
                {choice.text}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
