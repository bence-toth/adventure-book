import { useBlocker } from "react-router-dom";

// Type for useBlocker since TypeScript might not have complete types
interface BlockerArgs {
  currentLocation: { pathname: string };
  nextLocation: { pathname: string };
  historyAction: "PUSH" | "POP" | "REPLACE";
}

interface UseUnsavedChangesWarningProps {
  hasUnsavedChanges: boolean;
}

// Custom hook that blocks navigation when there are unsaved changes and
// prompts the user to confirm before leaving.
// Uses React Router's useBlocker to intercept navigation attempts.
// When navigation is blocked, the hook provides state and handlers for
// displaying a confirmation modal.
export const useUnsavedChangesWarning = ({
  hasUnsavedChanges,
}: UseUnsavedChangesWarningProps) => {
  // Block navigation when there are unsaved changes
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }: BlockerArgs) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
  );

  // Modal is open when navigation is blocked
  const isModalOpen = blocker.state === "blocked";

  const proceedNavigation = () => {
    if (blocker.state === "blocked") {
      blocker.proceed();
    }
  };

  const cancelNavigation = () => {
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  };

  return {
    isModalOpen,
    proceedNavigation,
    cancelNavigation,
  };
};
