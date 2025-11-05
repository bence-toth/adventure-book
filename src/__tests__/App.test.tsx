import { screen } from "@testing-library/react";
import { render as rtlRender } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

// Custom render with specific route for App testing
const renderAppWithRoute = (initialRoute: string) => {
  return rtlRender(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
};

describe("App Component", () => {
  it("renders Introduction component on root path", () => {
    renderAppWithRoute("/");

    expect(
      screen.getByText("Welcome to the Code Adventure")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Begin Your Adventure" })
    ).toBeInTheDocument();
  });

  it("renders Passage component on passage path", () => {
    renderAppWithRoute("/passage/1");

    expect(
      screen.getByText(/In the beginning, there was code/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Enter the realm of functions/ })
    ).toBeInTheDocument();
  });

  it("redirects to root for unknown paths", () => {
    renderAppWithRoute("/unknown-path");

    // Should redirect to Introduction
    expect(
      screen.getByText("Welcome to the Code Adventure")
    ).toBeInTheDocument();
  });

  it("handles passage routes with parameters", () => {
    renderAppWithRoute("/passage/2");

    expect(
      screen.getByText(/You step into the realm of functions/)
    ).toBeInTheDocument();
  });
});
