import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Passage, Introduction, ErrorBoundary } from "./components";

const App = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Introduction />} />
        <Route path="/passage/:id" element={<Passage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
