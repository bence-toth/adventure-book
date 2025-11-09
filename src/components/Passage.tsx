import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getPassage } from "../data/storyLoader";
import {
  saveCurrentPassageId,
  clearCurrentPassageId,
} from "../utils/localStorage";
import { ROUTES, getPassageRoute, SPECIAL_PASSAGES } from "../constants/routes";
import "./Passage.css";

export const Passage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const passageId = parseInt(id ?? "1", 10);

  useEffect(() => {
    if (!isNaN(passageId)) {
      if (passageId === SPECIAL_PASSAGES.RESET) {
        // Special case: passage 0 clears localStorage and redirects to introduction
        clearCurrentPassageId();
        navigate(ROUTES.TEST);
        return;
      } else if (passageId >= 1) {
        saveCurrentPassageId(passageId);
      }
    }
  }, [passageId, navigate]);

  if (isNaN(passageId) || passageId < 0 || !Number.isInteger(passageId)) {
    return (
      <div className="error" data-testid="error-invalid-id">
        <h2>Invalid passage ID</h2>
        <p>The passage ID “{id}” is not valid. Please use a valid number.</p>
        <button
          className="choice-button"
          onClick={() => navigate(getPassageRoute(SPECIAL_PASSAGES.RESET))}
          data-testid="go-to-introduction-button"
        >
          Go to introduction
        </button>
      </div>
    );
  }

  // Handle passage 0 (reset) - this will be handled in useEffect, but we need to prevent
  // the rest of the component from rendering while the redirect happens
  if (passageId === SPECIAL_PASSAGES.RESET) {
    return (
      <div className="passage" data-testid="reset-passage">
        <div className="passage-text">
          <p className="passage-paragraph">Resetting your adventure…</p>
        </div>
      </div>
    );
  }

  const currentPassage = getPassage(passageId);

  if (!currentPassage) {
    return (
      <div className="error" data-testid="error-passage-not-found">
        <h2>Passage not found</h2>
        <p>Passage #{passageId} does not exist in this adventure.</p>
        <button
          className="choice-button"
          onClick={() => navigate(getPassageRoute(SPECIAL_PASSAGES.RESET))}
          data-testid="go-to-introduction-button"
        >
          Go to introduction
        </button>
      </div>
    );
  }

  const handleChoiceClick = (nextId: number) => {
    navigate(getPassageRoute(nextId));
  };

  const handleRestartClick = () => {
    clearCurrentPassageId();
    navigate(ROUTES.TEST);
  };

  return (
    <div className="passage" data-testid="passage">
      <div className="passage-text" data-testid="passage-text">
        {currentPassage.paragraphs.map((paragraph, index) => (
          <p
            className="passage-paragraph"
            key={index}
            data-testid={`passage-paragraph-${index}`}
          >
            {paragraph}
          </p>
        ))}
      </div>
      <div className="choices" data-testid="choices">
        {currentPassage.ending ? (
          <button
            className="choice-button"
            onClick={handleRestartClick}
            data-testid="restart-button"
          >
            Restart adventure
          </button>
        ) : (
          currentPassage.choices!.map((choice, index) => (
            <button
              key={index}
              className="choice-button"
              onClick={() => handleChoiceClick(choice.goto)}
              data-testid={`choice-button-${index}`}
              data-goto={choice.goto}
            >
              {choice.text}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
