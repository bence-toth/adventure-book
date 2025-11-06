import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { introduction } from "../data";
import { getCurrentPassageId } from "../utils/localStorage";
import "./Introduction.css";

export const Introduction = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const savedPassageId = getCurrentPassageId();
    if (savedPassageId !== null) {
      navigate(`/passage/${savedPassageId}`);
    }
  }, [navigate]);

  const handleStartAdventure = () => {
    navigate("/passage/1");
  };

  return (
    <div className="adventure-book">
      <div className="introduction">
        <h1>{introduction.title}</h1>
        <div className="intro-text">
          {introduction.paragraphs.map((paragraph, index) => (
            <p className="intro-paragraph" key={index}>
              {paragraph}
            </p>
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
