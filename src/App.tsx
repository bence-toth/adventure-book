import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import {
  Passage,
  Introduction,
  ErrorBoundary,
  TopBar,
  DocumentManager,
} from "./components";
import { ROUTES } from "./constants/routes";
import { StoryProvider } from "./context/StoryContext";

const App = () => {
  return (
    <div className="app-container">
      <TopBar />
      <main className="app-content">
        <Routes>
          <Route path={ROUTES.ROOT} element={<DocumentManager />} />

          <Route
            path="/adventure/:storyId/*"
            element={
              <StoryProvider>
                <ErrorBoundary>
                  <Routes>
                    <Route path="test" element={<Introduction />} />
                    <Route path="test/passage/:id" element={<Passage />} />
                    <Route
                      path="edit"
                      element={<div>Edit view coming soon</div>}
                    />
                    <Route path="*" element={<Navigate to="test" replace />} />
                  </Routes>
                </ErrorBoundary>
              </StoryProvider>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
