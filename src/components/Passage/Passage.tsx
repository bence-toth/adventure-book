import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  addItemToInventory,
  removeItemFromInventory,
} from "../../data/storyLoader";
import {
  saveCurrentPassageId,
  clearCurrentPassageId,
  clearInventory,
} from "../../utils/localStorage";
import {
  getPassageRoute,
  SPECIAL_PASSAGES,
  getStoryTestRoute,
} from "../../constants/routes";
import {
  PASSAGE_TEST_IDS,
  ERROR_TEST_IDS,
  getPassageParagraphTestId,
  getChoiceButtonTestId,
} from "../../constants/testIds";
import { Button } from "../common";
import { useStory } from "../../hooks/useStory";
import { Sidebar } from "../Sidebar/Sidebar";
import "./Passage.css";

export const Passage = () => {
  const { id, storyId } = useParams<{ id: string; storyId: string }>();
  const navigate = useNavigate();
  const { story, loading, error } = useStory();

  const passageId = parseInt(id ?? "1", 10);

  useEffect(() => {
    if (!storyId || !story) return;

    if (!isNaN(passageId)) {
      if (passageId === SPECIAL_PASSAGES.RESET) {
        // Special case: passage 0 clears localStorage and redirects to introduction
        clearCurrentPassageId(storyId);
        clearInventory(storyId);
        navigate(getStoryTestRoute(storyId));
        return;
      } else if (passageId >= 1) {
        saveCurrentPassageId(storyId, passageId);

        // Execute effects for this passage (only non-ending passages have effects)
        const passage = story.passages[passageId];
        if (passage && !passage.ending && passage.effects) {
          passage.effects.forEach((effect) => {
            if (effect.type === "add_item") {
              addItemToInventory(storyId, effect.item);
            } else if (effect.type === "remove_item") {
              removeItemFromInventory(storyId, effect.item);
            }
          });

          // Dispatch an event to notify other components
          window.dispatchEvent(new Event("inventoryUpdate"));
        }
      }
    }
  }, [passageId, navigate, storyId, story]);

  if (loading) {
    return (
      <div className="page-layout">
        <Sidebar />
        <div className="page-content">
          <div className="passage" data-testid={PASSAGE_TEST_IDS.CONTAINER}>
            <p>Loading passage...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !story || !storyId) {
    return (
      <div className="page-layout">
        <Sidebar />
        <div className="page-content">
          <div className="error" data-testid={ERROR_TEST_IDS.PASSAGE_NOT_FOUND}>
            <h2>Error</h2>
            <p>{error || "Story not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isNaN(passageId) || passageId < 0 || !Number.isInteger(passageId)) {
    return (
      <div className="page-layout">
        <Sidebar />
        <div className="page-content">
          <div className="error" data-testid={ERROR_TEST_IDS.INVALID_ID}>
            <h2>Invalid passage ID</h2>
            <p>
              The passage ID "{id}" is not valid. Please use a valid number.
            </p>
            <Button
              onClick={() =>
                navigate(getPassageRoute(storyId, SPECIAL_PASSAGES.RESET))
              }
              data-testid={ERROR_TEST_IDS.GO_TO_INTRODUCTION_BUTTON}
            >
              Go to introduction
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Handle passage 0 (reset) - this will be handled in useEffect, but we need to prevent
  // the rest of the component from rendering while the redirect happens
  if (passageId === SPECIAL_PASSAGES.RESET) {
    return (
      <div className="page-layout">
        <Sidebar />
        <div className="page-content">
          <div className="passage" data-testid={PASSAGE_TEST_IDS.RESET_PASSAGE}>
            <div className="passage-text">
              <p className="passage-paragraph">Resetting your adventure…</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentPassage = story.passages[passageId];

  if (!currentPassage) {
    return (
      <div className="page-layout">
        <Sidebar />
        <div className="page-content">
          <div className="error" data-testid={ERROR_TEST_IDS.PASSAGE_NOT_FOUND}>
            <h2>Passage not found</h2>
            <p>Passage #{passageId} does not exist in this adventure.</p>
            <Button
              onClick={() =>
                navigate(getPassageRoute(storyId, SPECIAL_PASSAGES.RESET))
              }
              data-testid={ERROR_TEST_IDS.GO_TO_INTRODUCTION_BUTTON}
            >
              Go to introduction
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleChoiceClick = (nextId: number) => {
    navigate(getPassageRoute(storyId, nextId));
  };

  const handleRestartClick = () => {
    clearCurrentPassageId(storyId!);
    clearInventory(storyId!);
    navigate(getStoryTestRoute(storyId!));
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-content">
        <div className="passage" data-testid={PASSAGE_TEST_IDS.CONTAINER}>
          <div className="passage-text" data-testid={PASSAGE_TEST_IDS.TEXT}>
            {currentPassage.paragraphs.map((paragraph, index) => (
              <p
                className="passage-paragraph"
                key={index}
                data-testid={getPassageParagraphTestId(index)}
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="choices" data-testid={PASSAGE_TEST_IDS.CHOICES}>
            {currentPassage.ending ? (
              <Button
                onClick={handleRestartClick}
                data-testid={PASSAGE_TEST_IDS.RESTART_BUTTON}
              >
                Restart adventure
              </Button>
            ) : (
              currentPassage.choices!.map((choice, index) => (
                <Button
                  key={index}
                  onClick={() => handleChoiceClick(choice.goto)}
                  data-testid={getChoiceButtonTestId(index)}
                  data-goto={choice.goto}
                >
                  {choice.text}
                </Button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
