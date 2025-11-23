import { screen, fireEvent } from "@testing-library/react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, it, expect } from "vitest";
import App from "../App";
import { setupTestStory } from "./mockStoryData";
import {
  INTRODUCTION_TEST_IDS,
  PASSAGE_TEST_IDS,
  getChoiceButtonTestId,
} from "../constants/testIds";

const TEST_STORY_ID = "test-story-id";

describe("Adventure Book Integration Tests", () => {
  beforeEach(async () => {
    await setupTestStory(TEST_STORY_ID);
  });

  const renderApp = (initialRoute = "/") => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    );
  };

  it("completes a full adventure flow", async () => {
    renderApp(`/adventure/${TEST_STORY_ID}/test`);

    // Start at introduction
    const title = await screen.findByTestId(INTRODUCTION_TEST_IDS.TITLE);
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Mock Test Adventure");

    // Click start adventure
    const startButton = await screen.findByTestId(
      INTRODUCTION_TEST_IDS.START_BUTTON
    );
    fireEvent.click(startButton);

    // Should navigate to passage 1
    const passageContainer = await screen.findByTestId(
      PASSAGE_TEST_IDS.CONTAINER
    );
    expect(passageContainer).toBeInTheDocument();
    expect(screen.getByText(/This is mock passage 1/)).toBeInTheDocument();

    // Click first choice to go to passage 2
    const firstChoice = await screen.findByTestId(getChoiceButtonTestId(0));
    fireEvent.click(firstChoice);

    // Should show passage 2
    expect(
      await screen.findByText(/This is mock passage 2/)
    ).toBeInTheDocument();
  });

  it("handles error states in the flow", async () => {
    renderApp(`/adventure/${TEST_STORY_ID}/test/passage/999`);

    // Should show error for non-existent passage
    expect(await screen.findByText("Passage not found")).toBeInTheDocument();
    expect(screen.getByText(/Passage #999 does not exist/)).toBeInTheDocument();
  });

  it("navigates through different story paths", async () => {
    renderApp(`/adventure/${TEST_STORY_ID}/test/passage/1`);

    // Start at passage 1
    expect(
      await screen.findByText(/This is mock passage 1/)
    ).toBeInTheDocument();

    // Click second choice to go to passage 3
    const secondChoice = await screen.findByTestId(getChoiceButtonTestId(1));
    fireEvent.click(secondChoice);

    // Should show passage 3
    expect(
      await screen.findByText(/This is mock passage 3/)
    ).toBeInTheDocument();
  });

  it("handles the ending passage correctly", async () => {
    renderApp(`/adventure/${TEST_STORY_ID}/test/passage/4`);

    // Should show ending passage
    expect(
      await screen.findByText(/This is the mock ending passage/)
    ).toBeInTheDocument();
    expect(await screen.findByText(/Congratulations/)).toBeInTheDocument();

    // Should show restart button
    const restartButton = await screen.findByRole("button", {
      name: /Restart adventure/i,
    });
    expect(restartButton).toBeInTheDocument();
  });
});
