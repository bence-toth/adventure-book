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
    loading = false,
    debugModeEnabled = false,
    ...options
  }: Omit<RenderOptions, "wrapper"> & {
    adventureId?: string;
    route?: string;
    adventure?: Adventure | null;
    error?: string | null;
    loading?: boolean;
    debugModeEnabled?: boolean;
  } = {}
) => {
  const initialRoute = route || `/adventure/${adventureId}/test`;

  // If adventure, error, loading, or debugModeEnabled are provided, use mock context
  const useMockContext =
    adventure !== undefined ||
    error !== undefined ||
    loading !== false ||
    debugModeEnabled !== false;

  if (useMockContext) {
    const mockContextValue: AdventureContextType = {
      adventure: adventure ?? null,
      adventureId,
      loading,
      error: error ?? null,
      debugModeEnabled,
      setDebugModeEnabled: () => {},
    };

    return rtlRender(ui, {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/" element={children} />
            <Route
              path="/adventure/:adventureId/*"
              element={
                <AdventureContext.Provider value={mockContextValue}>
                  {children}
                </AdventureContext.Provider>
              }
            />
          </Routes>
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
