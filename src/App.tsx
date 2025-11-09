import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import {
  Passage,
  Introduction,
  ErrorBoundary,
  TopBar,
  Sidebar,
} from "./components";
import { ROUTES, PASSAGE_ROUTE_PATTERN } from "./constants/routes";

const App = () => {
  return (
    <div className="app-container">
      <TopBar />
      <div className="app-main">
        <Sidebar />
        <main className="app-content">
          <ErrorBoundary>
            <Routes>
              <Route
                path={ROUTES.ROOT}
                element={<Navigate to={ROUTES.TEST} replace />}
              />
              <Route path={ROUTES.TEST} element={<Introduction />} />
              <Route path={PASSAGE_ROUTE_PATTERN} element={<Passage />} />
              <Route
                path={ROUTES.EDIT}
                element={<div>Edit view coming soon</div>}
              />
              <Route path="*" element={<Navigate to={ROUTES.TEST} replace />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default App;
