import { useNavigate } from "react-router-dom";
import { introduction } from "./content";

export const Introduction = () => {
  const navigate = useNavigate();

  const handleStartAdventure = () => {
    navigate("/passage/1");
  };

  return (
    <div className="adventure-book">
      <div className="introduction">
        <h1>{introduction.title}</h1>
        <div className="intro-text">
          {introduction.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="intro-action">
          <button
            className="choice-button start-adventure-button"
            onClick={handleStartAdventure}
          >
            {introduction.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};
