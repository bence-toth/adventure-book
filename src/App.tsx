import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import {
  Passage,
  Introduction,
  ErrorBoundary,
  TopBar,
  Sidebar,
} from "./components";

const App = () => {
  return (
    <div className="app-container">
      <TopBar />
      <div className="app-main">
        <Sidebar />
        <main className="app-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Introduction />} />
              <Route path="/passage/:id" element={<Passage />} />
              <Route path="/edit" element={<div>Edit view coming soon</div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default App;
