import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Passage } from "./Passage.tsx";

const App = () => {
  return (
    <Routes>
      <Route path="/passage/:id" element={<Passage />} />
      <Route path="/" element={<Navigate to="/passage/1" replace />} />
      <Route path="*" element={<Navigate to="/passage/1" replace />} />
    </Routes>
  );
};

export default App;
