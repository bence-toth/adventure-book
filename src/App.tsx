import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Passage, Introduction } from "./components";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Introduction />} />
      <Route path="/passage/:id" element={<Passage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
