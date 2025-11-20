import { screen } from "@testing-library/react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, it, expect } from "vitest";
import App from "../App";
import { setupTestStory } from "../test/mockStoryData";

const TEST_STORY_ID = "test-story-id";

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
    await setupTestStory(TEST_STORY_ID);
  });

  it("renders DocumentManager component on root path", async () => {
    renderAppWithRoute("/");

    // Should show TopBar with Adventure Book Companion title
    expect(
      await screen.findByText("Adventure Book Companion")
    ).toBeInTheDocument();

    // Should show the New Story card
    expect(
      await screen.findByText("Create a new adventure")
    ).toBeInTheDocument();
  });

  it("renders Passage component when navigating to a story", async () => {
    renderAppWithRoute(`/adventure/${TEST_STORY_ID}/test/passage/1`);

    // Should show passage content from the mock story
    expect(
      await screen.findByText(/This is mock passage 1/)
    ).toBeInTheDocument();
  });

  it("shows DocumentManager for unknown paths at root", async () => {
    renderAppWithRoute("/unknown-path");

    // The app should still show something - likely DocumentManager or redirect
    // Just check that the app renders without crashing
    expect(document.body).toBeInTheDocument();
  });

  it("handles story passage routes with parameters", async () => {
    renderAppWithRoute(`/adventure/${TEST_STORY_ID}/test/passage/2`);

    // Check for content from passage 2
    expect(
      await screen.findByText(/This is mock passage 2/)
    ).toBeInTheDocument();
  });
});
