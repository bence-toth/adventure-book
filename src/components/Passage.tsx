import { useParams, useNavigate } from "react-router-dom";
import { passages } from "../data";
import "./Passage.css";

export const Passage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const passageId = parseInt(id || "1", 10);

  if (isNaN(passageId) || passageId < 1) {
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

  const currentPassage = passages.find((passage) => passage.id === passageId);

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

  return (
    <div className="adventure-book">
      <div className="passage">
        <div className="passage-text">
          {currentPassage.paragraphs.map((paragraph, index) => (
            <p className="passage-paragraph" key={index}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className="choices">
          {currentPassage.choices.map((choice, index) => (
            <button
              key={index}
              className="choice-button"
              onClick={() => handleChoiceClick(choice.nextId)}
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
