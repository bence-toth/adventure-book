/* eslint-disable react-refresh/only-export-components */
import { render as rtlRender } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import {
  AdventureProvider,
  AdventureContext,
  type AdventureContextType,
} from "@/context/AdventureContext";
import type { Adventure } from "@/data/types";

// Wrapper component for providers (simple wrapper for basic components)
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Wrapper for components that need AdventureContext
export const AdventureTestWrapper = ({
  children,
  adventureId = "test-adventure-id",
}: {
  children: React.ReactNode;
  adventureId?: string;
}) => {
  const router = createMemoryRouter(
    [
      {
        path: "/:adventureId/*",
        element: <AdventureProvider>{children}</AdventureProvider>,
      },
    ],
    {
      initialEntries: [`/${adventureId}/test`],
    }
  );

  return <RouterProvider router={router} />;
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => rtlRender(ui, { wrapper: AllTheProviders, ...options });

// Custom render function with AdventureContext
export const renderWithAdventure = (
  ui: ReactElement,
  {
    adventureId = "test-adventure-id",
    route,
    adventure,
    error,
    isLoading,
    isDebugModeEnabled,
    contextOverride,
    ...options
  }: Omit<RenderOptions, "wrapper"> & {
    adventureId?: string;
    route?: string;
    adventure?: Adventure | null;
    error?: string | null;
    isLoading?: boolean;
    isDebugModeEnabled?: boolean;
    contextOverride?: Partial<AdventureContextType>;
  } = {}
) => {
  // Validate adventureId - empty strings are not valid
  if (adventureId === "") {
    throw new Error(
      "adventureId cannot be an empty string. Use undefined to get the default test adventure ID, or provide a valid non-empty string."
    );
  }

  const initialRoute =
    route || (adventureId ? `/adventure/${adventureId}/test` : "/");

  // If adventure, error, isLoading, isDebugModeEnabled, or contextOverride are provided, use mock context
  const useMockContext =
    adventure !== undefined ||
    error !== undefined ||
    isLoading !== undefined ||
    isDebugModeEnabled !== undefined ||
    contextOverride !== undefined;

  if (useMockContext) {
    const baseContextValue: AdventureContextType = {
      adventure: adventure ?? null,
      adventureId,
      isLoading: isLoading ?? false,
      error: error ?? null,
      isDebugModeEnabled: isDebugModeEnabled ?? false,
      isSaving: false,
      setIsDebugModeEnabled: () => {},
      reloadAdventure: () => {},
      updateAdventure: () => {},
      updateIntroduction: async () => {},
      updatePassage: async () => {},
      withSaving: (fn) => fn(),
    };

    const mockContextValue: AdventureContextType = {
      ...baseContextValue,
      ...contextOverride,
    };

    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: (
            <AdventureContext.Provider value={mockContextValue}>
              {ui}
            </AdventureContext.Provider>
          ),
        },
        {
          path: "/adventure/:adventureId/*",
          element: (
            <AdventureContext.Provider value={mockContextValue}>
              {ui}
            </AdventureContext.Provider>
          ),
        },
      ],
      {
        initialEntries: [initialRoute],
      }
    );

    return rtlRender(<RouterProvider router={router} />, options);
  }

  // Otherwise use the real AdventureProvider
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: ui,
      },
      {
        path: "/adventure/:adventureId/*",
        element: <AdventureProvider>{ui}</AdventureProvider>,
      },
    ],
    {
      initialEntries: [initialRoute],
    }
  );

  return rtlRender(<RouterProvider router={router} />, options);
};

// Re-export specific testing utilities to avoid export * issues
export {
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
  getByRole,
  getByText,
  getByLabelText,
  getByPlaceholderText,
  getByAltText,
  getByDisplayValue,
  queryByRole,
  queryByText,
  queryByLabelText,
  queryByPlaceholderText,
  queryByAltText,
  queryByDisplayValue,
  findByRole,
  findByText,
  findByLabelText,
  findByPlaceholderText,
  findByAltText,
  findByDisplayValue,
  act,
} from "@testing-library/react";

// Export custom render as default render
export { customRender as render };
