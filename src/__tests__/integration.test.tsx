import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { screen, fireEvent } from "@testing-library/react";
import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, Navigate } from "react-router-dom";
import { INTRODUCTION_TEST_IDS } from "@/components/AdventureContent/testIds";
import {
  PASSAGE_TEST_IDS,
  getChoiceButtonTestId,
} from "@/components/AdventureContent/testIds";
import { setupTestAdventure } from "./mockAdventureData";
import App, { AdventureLayout } from "../App";
import { AdventureManager } from "@/components/AdventureManager/AdventureManager";
import { TestAdventure } from "@/components/TestAdventure/TestAdventure";
import { AdventureContent } from "@/components/AdventureContent/AdventureContent";
import { ROUTES } from "@/constants/routes";

const TEST_STORY_ID = "test-adventure-id";

describe("Adventure Book Integration Tests", () => {
  beforeEach(async () => {
    // Setup test adventure in IndexedDB
    await setupTestAdventure(TEST_STORY_ID);
  });

  const renderApp = (initialRoute = "/") => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <App />,
          children: [
            {
              index: true,
              element: <AdventureManager />,
            },
            {
              path: "adventure/:adventureId",
              element: <AdventureLayout />,
              children: [
                {
                  path: "test",
                  element: <Navigate to="introduction" replace />,
                },
                {
                  path: "test/introduction",
                  element: <TestAdventure />,
                },
                {
                  path: "test/passage/:id",
                  element: <TestAdventure />,
                },
                {
                  path: "content",
                  element: <Navigate to="introduction" replace />,
                },
                {
                  path: "content/introduction",
                  element: <AdventureContent />,
                },
                {
                  path: "content/passage/:id",
                  element: <AdventureContent />,
                },
                {
                  path: "structure",
                  element: <div>Structure view coming soon</div>,
                },
                {
                  path: "*",
                  element: <Navigate to="test/introduction" replace />,
                },
              ],
            },
            {
              path: "*",
              element: <Navigate to={ROUTES.ROOT} replace />,
            },
          ],
        },
      ],
      {
        initialEntries: [initialRoute],
      }
    );

    return render(<RouterProvider router={router} />);
  };

  it("completes a full adventure flow", async () => {
    renderApp(`/adventure/${TEST_STORY_ID}/test`);

    // Start at introduction - wait for adventure to load from IndexedDB
    const title = await screen.findByTestId(
      INTRODUCTION_TEST_IDS.TITLE,
      {},
      { timeout: 3000 }
    );
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
    // Suppress console.error for this test since we're intentionally triggering an error
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderApp(`/adventure/${TEST_STORY_ID}/test/passage/999`);

    // Should show error for non-existent passage - wait for adventure to load
    const errorMessages = await screen.findAllByText(
      /Passage #999 does not exist/,
      {},
      { timeout: 3000 }
    );
    expect(errorMessages.length).toBeGreaterThan(0);

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it("navigates through different adventure paths", async () => {
    renderApp(`/adventure/${TEST_STORY_ID}/test/passage/1`);

    // Start at passage 1 - wait for adventure to load from IndexedDB
    expect(
      await screen.findByText(/This is mock passage 1/, {}, { timeout: 3000 })
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

    // Should show ending passage - wait for adventure to load
    expect(
      await screen.findByText(
        /This is the mock ending passage/,
        {},
        { timeout: 3000 }
      )
    ).toBeInTheDocument();
    expect(await screen.findByText(/Congratulations/)).toBeInTheDocument();

    // Should show restart button
    const restartButton = await screen.findByRole("button", {
      name: /Restart adventure/i,
    });
    expect(restartButton).toBeInTheDocument();
  });
});
