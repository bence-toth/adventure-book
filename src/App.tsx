import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { AdventureProvider } from "@/context/AdventureContext";
import { AppContainer, AppContent } from "./App.styles";

const AppLayout = () => {
  return (
    <ErrorBoundary>
      <AppContainer>
        <AppContent as="main">
          <Outlet />
        </AppContent>
      </AppContainer>
    </ErrorBoundary>
  );
};

const AdventureLayout = () => {
  return (
    <AdventureProvider>
      <Outlet />
    </AdventureProvider>
  );
};

const App = AppLayout;

export default App;

export { AdventureLayout };
