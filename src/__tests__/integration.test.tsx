import { screen, fireEvent } from "@testing-library/react";
import { render as rtlRender } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

describe("Adventure Book Integration Tests", () => {
  const renderApp = () => {
    return rtlRender(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
  };

  it("completes a full adventure flow", () => {
    renderApp();

    // Start at introduction
    expect(
      screen.getByText("Welcome to the Code Adventure")
    ).toBeInTheDocument();

    // Click start adventure
    const startButton = screen.getByRole("button", {
      name: "Begin Your Adventure",
    });
    fireEvent.click(startButton);

    // Should be at passage 1
    expect(
      screen.getByText(/In the beginning, there was code/)
    ).toBeInTheDocument();

    // Choose the functions path
    const functionsButton = screen.getByRole("button", {
      name: /Enter the realm of functions/,
    });
    fireEvent.click(functionsButton);

    // Should be at passage 2
    expect(
      screen.getByText(/You step into the realm of functions/)
    ).toBeInTheDocument();

    // Listen to lambda's wisdom
    const lambdaButton = screen.getByRole("button", {
      name: /Listen to the lambda's wisdom/,
    });
    fireEvent.click(lambdaButton);

    // Should be at passage 5
    expect(screen.getByText(/The lambda whispers secrets/)).toBeInTheDocument();
  });

  it("handles error states in the flow", () => {
    rtlRender(
      <MemoryRouter initialEntries={["/passage/invalid"]}>
        <App />
      </MemoryRouter>
    );

    // Should show error page with invalid passage ID
    expect(screen.getByText("Invalid passage ID")).toBeInTheDocument();
    expect(
      screen.getByText(/The passage ID "invalid" is not valid/)
    ).toBeInTheDocument();

    // Should have button to go back to introduction
    const goHomeButton = screen.getByRole("button", {
      name: "Go to Introduction",
    });
    expect(goHomeButton).toBeInTheDocument();
  });

  it("navigates through different story paths", () => {
    rtlRender(
      <MemoryRouter initialEntries={["/passage/1"]}>
        <App />
      </MemoryRouter>
    );

    // From passage 1, choose data structures
    const dataStructuresButton = screen.getByRole("button", {
      name: /Explore the data structures/,
    });
    fireEvent.click(dataStructuresButton);

    // Should be at passage 3
    expect(
      screen.getByText(/You wander into a vast library of data structures/)
    ).toBeInTheDocument();

    // All expected choice buttons should be present
    expect(
      screen.getByRole("button", { name: /Climb the binary tree/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Navigate through the hash table maze/,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Return to the entrance/ })
    ).toBeInTheDocument();
  });

  it("handles the ending passage correctly", () => {
    rtlRender(
      <MemoryRouter initialEntries={["/passage/9"]}>
        <App />
      </MemoryRouter>
    );

    // Should show ending passage
    expect(
      screen.getByText(
        /You step through the portal and find yourself back in the real world/
      )
    ).toBeInTheDocument();

    // Should have option to start new adventure
    expect(
      screen.getByRole("button", { name: /Start a new adventure/ })
    ).toBeInTheDocument();
  });

  it("maintains consistent styling across all pages", () => {
    // Test introduction styling
    renderApp();
    expect(document.querySelector(".adventure-book")).toBeInTheDocument();
    expect(document.querySelector(".introduction")).toBeInTheDocument();

    // Test passage styling
    rtlRender(
      <MemoryRouter initialEntries={["/passage/1"]}>
        <App />
      </MemoryRouter>
    );
    expect(document.querySelector(".adventure-book")).toBeInTheDocument();
    expect(document.querySelector(".passage")).toBeInTheDocument();

    // Test error styling
    rtlRender(
      <MemoryRouter initialEntries={["/passage/999"]}>
        <App />
      </MemoryRouter>
    );
    expect(document.querySelector(".adventure-book")).toBeInTheDocument();
    expect(document.querySelector(".error")).toBeInTheDocument();
  });
});
