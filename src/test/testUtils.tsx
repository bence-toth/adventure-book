/* eslint-disable react-refresh/only-export-components */
import { render as rtlRender } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";

// Wrapper component for providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => rtlRender(ui, { wrapper: AllTheProviders, ...options });

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
