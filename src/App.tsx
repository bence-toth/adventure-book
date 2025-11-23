import { Routes, Route, Navigate } from "react-router-dom";
import {
  Passage,
  Introduction,
  ErrorBoundary,
  TopBar,
  AdventureManager,
} from "@/components";
import { ROUTES } from "@/constants/routes";
import { AdventureProvider } from "@/context/AdventureContext";
import { AppContainer, AppContent } from "./App.styles";

const App = () => {
  return (
    <ErrorBoundary>
      <AppContainer>
        <TopBar />
        <AppContent as="main">
          <Routes>
            <Route path={ROUTES.ROOT} element={<AdventureManager />} />

            <Route
              path="/adventure/:adventureId/*"
              element={
                <AdventureProvider>
                  <Routes>
                    <Route path="test" element={<Introduction />} />
                    <Route path="test/passage/:id" element={<Passage />} />
                    <Route
                      path="edit"
                      element={<div>Edit view coming soon</div>}
                    />
                    <Route path="*" element={<Navigate to="test" replace />} />
                  </Routes>
                </AdventureProvider>
              }
            />

            {/* Catch-all route redirects to root */}
            <Route path="*" element={<Navigate to={ROUTES.ROOT} replace />} />
          </Routes>
        </AppContent>
      </AppContainer>
    </ErrorBoundary>
  );
};

export default App;
