/* eslint-disable react-refresh/only-export-components */
import { render as rtlRender } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { StoryProvider } from "../context/StoryContext";

// Wrapper component for providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

// Wrapper for components that need StoryContext
export const StoryTestWrapper = ({
  children,
  storyId = "test-story-id",
}: {
  children: React.ReactNode;
  storyId?: string;
}) => {
  return (
    <MemoryRouter initialEntries={[`/${storyId}/test`]}>
      <Routes>
        <Route
          path="/:storyId/*"
          element={<StoryProvider>{children}</StoryProvider>}
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

// Custom render function with StoryContext
export const renderWithStory = (
  ui: ReactElement,
  {
    storyId = "test-story-id",
    route,
    ...options
  }: Omit<RenderOptions, "wrapper"> & {
    storyId?: string;
    route?: string;
  } = {}
) => {
  const initialRoute = route || `/adventure/${storyId}/test`;

  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/" element={children} />
          <Route
            path="/adventure/:storyId/*"
            element={<StoryProvider>{children}</StoryProvider>}
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
