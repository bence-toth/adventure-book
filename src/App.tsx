import { useState } from "react";
import "./App.css";
import { passages } from "./passages";

const App = () => {
  const [currentPassageId, setCurrentPassageId] = useState(1);

  const currentPassage = passages.find(
    (passage) => passage.id === currentPassageId
  );

  if (!currentPassage) {
    return <div className="error">Passage not found!</div>;
  }

  const handleChoiceClick = (nextId: number) => {
    setCurrentPassageId(nextId);
  };

  return (
    <div className="adventure-book">
      <div className="passage">
        <p className="passage-text">{currentPassage.text}</p>
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

export default App;
