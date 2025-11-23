/* eslint-disable react-refresh/only-export-components */
import { render as rtlRender } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { AdventureProvider } from "@/context/AdventureContext";

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
    ...options
  }: Omit<RenderOptions, "wrapper"> & {
    adventureId?: string;
    route?: string;
  } = {}
) => {
  const initialRoute = route || `/adventure/${adventureId}/test`;

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
