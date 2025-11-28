/* eslint-disable react-refresh/only-export-components */
import { render as rtlRender } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import {
  AdventureProvider,
  AdventureContext,
  type AdventureContextType,
} from "@/context/AdventureContext";
import type { Adventure } from "@/data/types";

// Wrapper component for providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

// Wrapper for components that need AdventureContext
export const AdventureTestWrapper = ({
  children,
  adventureId = "test-adventure-id",
}: {
  children: React.ReactNode;
  adventureId?: string;
}) => {
  return (
    <MemoryRouter initialEntries={[`/${adventureId}/test`]}>
      <Routes>
        <Route
          path="/:adventureId/*"
          element={<AdventureProvider>{children}</AdventureProvider>}
        />
      </Routes>
    </MemoryRouter>
  );
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
    loading,
    debugModeEnabled,
    contextOverride,
    ...options
  }: Omit<RenderOptions, "wrapper"> & {
    adventureId?: string;
    route?: string;
    adventure?: Adventure | null;
    error?: string | null;
    loading?: boolean;
    debugModeEnabled?: boolean;
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

  // If adventure, error, loading, debugModeEnabled, or contextOverride are provided, use mock context
  const useMockContext =
    adventure !== undefined ||
    error !== undefined ||
    loading !== undefined ||
    debugModeEnabled !== undefined ||
    contextOverride !== undefined;

  if (useMockContext) {
    const baseContextValue: AdventureContextType = {
      adventure: adventure ?? null,
      adventureId,
      loading: loading ?? false,
      error: error ?? null,
      debugModeEnabled: debugModeEnabled ?? false,
      isSaving: false,
      setDebugModeEnabled: () => {},
      reloadAdventure: () => {},
      updateAdventure: () => {},
      withSaving: (fn) => fn(),
    };

    const mockContextValue: AdventureContextType = {
      ...baseContextValue,
      ...contextOverride,
    };

    return rtlRender(ui, {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={[initialRoute]}>
          <AdventureContext.Provider value={mockContextValue}>
            <Routes>
              <Route path="/" element={children} />
              <Route path="/adventure/:adventureId/*" element={children} />
            </Routes>
          </AdventureContext.Provider>
        </MemoryRouter>
      ),
      ...options,
    });
  }

  // Otherwise use the real AdventureProvider
  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/" element={children} />
          <Route
            path="/adventure/:adventureId/*"
            element={<AdventureProvider>{children}</AdventureProvider>}
          />
        </Routes>
      </MemoryRouter>
    ),
    ...options,
  });
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
