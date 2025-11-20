import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import {
  Passage,
  Introduction,
  ErrorBoundary,
  TopBar,
  Sidebar,
  DocumentManager,
} from "./components";
import { ROUTES } from "./constants/routes";
import { StoryProvider } from "./context/StoryContext";

const App = () => {
  return (
    <Routes>
      {/* Document manager route - with TopBar but no Sidebar */}
      <Route
        path={ROUTES.ROOT}
        element={
          <div className="app-container">
            <TopBar />
            <main className="app-content app-content-full">
              <DocumentManager />
            </main>
          </div>
        }
      />

      {/* Story routes - with TopBar and Sidebar */}
      <Route
        path="/adventure/:storyId/*"
        element={
          <StoryProvider>
            <div className="app-container">
              <TopBar />
              <div className="app-main">
                <Sidebar />
                <main className="app-content">
                  <ErrorBoundary>
                    <Routes>
                      <Route path="test" element={<Introduction />} />
                      <Route path="test/passage/:id" element={<Passage />} />
                      <Route
                        path="edit"
                        element={<div>Edit view coming soon</div>}
                      />
                      <Route
                        path="*"
                        element={<Navigate to="test" replace />}
                      />
                    </Routes>
                  </ErrorBoundary>
                </main>
              </div>
            </div>
          </StoryProvider>
        }
      />
    </Routes>
  );
};

export default App;
