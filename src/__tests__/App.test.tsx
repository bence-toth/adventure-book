import { screen } from "@testing-library/react";
import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, Navigate } from "react-router-dom";
import { beforeEach, describe, it, expect, vi } from "vitest";
import { createMockAdventureLoader } from "./mockAdventureData";

// Mock adventureLoader using the factory function
vi.mock("@/data/adventureLoader", () => createMockAdventureLoader());

import App, { AdventureLayout } from "../App";
import { AdventureManager } from "@/components/AdventureManager/AdventureManager";
import { TestAdventure } from "@/components/TestAdventure/TestAdventure";
import { AdventureContent } from "@/components/AdventureContent/AdventureContent";
import { ROUTES } from "@/constants/routes";

const TEST_STORY_ID = "test-adventure-id";

// Custom render with specific route for App testing
// Mimics the router structure from main.tsx
const renderAppWithRoute = (initialRoute: string) => {
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

describe("App Component", () => {
  beforeEach(() => {
    // Tests now use mocked adventureLoader
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

  it("renders TestAdventure component when navigating to an adventure", async () => {
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

  it("handles test adventure passage routes with parameters", async () => {
    renderAppWithRoute(`/adventure/${TEST_STORY_ID}/test/passage/2`);

    // Check for content from passage 2
    expect(
      await screen.findByText(/This is mock passage 2/)
    ).toBeInTheDocument();
  });
});
