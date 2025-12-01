import { Routes, Route, Navigate } from "react-router-dom";
import { TestAdventure } from "@/components/TestAdventure/TestAdventure";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { AdventureManager } from "@/components/AdventureManager/AdventureManager";
import { ROUTES } from "@/constants/routes";
import { AdventureProvider } from "@/context/AdventureContext";
import { AppContainer, AppContent } from "./App.styles";

const App = () => {
  return (
    <ErrorBoundary>
      <AppContainer>
        <AppContent as="main">
          <Routes>
            <Route path={ROUTES.ROOT} element={<AdventureManager />} />

            <Route
              path="/adventure/:adventureId/*"
              element={
                <AdventureProvider>
                  <Routes>
                    <Route path="test" element={<TestAdventure />} />
                    <Route
                      path="test/passage/:id"
                      element={<TestAdventure />}
                    />
                    <Route
                      path="content"
                      element={<div>Content view coming soon</div>}
                    />
                    <Route path="*" element={<Navigate to="test" replace />} />
                  </Routes>
                </AdventureProvider>
              }
            />

            <Route path="*" element={<Navigate to={ROUTES.ROOT} replace />} />
          </Routes>
        </AppContent>
      </AppContainer>
    </ErrorBoundary>
  );
};

export default App;
