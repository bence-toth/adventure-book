import { useNavigate } from "react-router-dom";

export const Introduction = () => {
  const navigate = useNavigate();

  const handleStartAdventure = () => {
    navigate("/passage/1");
  };

  return (
    <div className="adventure-book">
      <div className="introduction">
        <h1>Welcome to the Code Adventure</h1>
        <div className="intro-text">
          <p>
            Welcome, brave adventurer, to a digital realm where code comes alive
            and algorithms dance through the very fabric of reality. You are
            about to embark on an interactive journey through the mystical world
            of programming concepts, where every choice you make will shape your
            understanding of the computational universe.
          </p>
          <p>
            In this adventure, you'll encounter wise lambdas sharing ancient
            functional wisdom, navigate through mazes of data structures, climb
            towering binary trees, and discover the elegant patterns that govern
            the world of software. Each path you choose will reveal new insights
            about the art and science of programming.
          </p>
          <p>
            Your adventure awaits. Will you step through the digital gateway and
            discover what lies beyond the screen? The choice is yours, but
            remember - in the world of code, every decision creates new
            possibilities.
          </p>
        </div>
        <div className="intro-action">
          <button
            className="choice-button start-adventure-button"
            onClick={handleStartAdventure}
          >
            Begin Your Adventure
          </button>
        </div>
      </div>
    </div>
  );
};
