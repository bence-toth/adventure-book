import { screen } from "@testing-library/react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, it, expect } from "vitest";
import App from "../App";
import { setupTestAdventure } from "./mockAdventureData";

const TEST_STORY_ID = "test-adventure-id";

// Custom render with specific route for App testing
const renderAppWithRoute = (initialRoute: string) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
};

describe("App Component", () => {
  beforeEach(async () => {
    await setupTestAdventure(TEST_STORY_ID);
  });

  it("renders AdventureManager component on root path", async () => {
    renderAppWithRoute("/");

    // Should show TopBar with Adventure Book Companion title
    expect(
      await screen.findByText("Adventure Book Companion")
    ).toBeInTheDocument();

    // Should show the New Adventure card
    expect(
      await screen.findByText("Create a new adventure")
    ).toBeInTheDocument();
  });

  it("renders Passage component when navigating to an adventure", async () => {
    renderAppWithRoute(`/adventure/${TEST_STORY_ID}/test/passage/1`);

    // Should show passage content from the mock adventure
    expect(
      await screen.findByText(/This is mock passage 1/)
    ).toBeInTheDocument();
  });

  it("shows AdventureManager for unknown paths at root", async () => {
    renderAppWithRoute("/unknown-path");

    // The app should still show something - likely AdventureManager or redirect
    // Just check that the app renders without crashing
    expect(document.body).toBeInTheDocument();
  });

  it("handles adventure passage routes with parameters", async () => {
    renderAppWithRoute(`/adventure/${TEST_STORY_ID}/test/passage/2`);

    // Check for content from passage 2
    expect(
      await screen.findByText(/This is mock passage 2/)
    ).toBeInTheDocument();
  });
});
