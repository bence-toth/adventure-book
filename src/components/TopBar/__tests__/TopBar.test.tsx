import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { TopBar } from "../TopBar";
import {
  getStoryTestRoute,
  getStoryEditRoute,
  ROUTES,
} from "../../../constants/routes";
import { renderWithStory } from "../../../__tests__/testUtils";
import { setupTestStory } from "../../../__tests__/mockStoryData";

const TEST_STORY_ID = "test-story-id";

// Mock react-router-dom navigate function
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("TopBar Component", () => {
  beforeEach(async () => {
    mockNavigate.mockClear();
    await setupTestStory(TEST_STORY_ID);
  });

  describe("Rendering", () => {
    it("renders the header element", async () => {
      renderWithStory(<TopBar />, { storyId: TEST_STORY_ID });
      const header = await screen.findByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("renders the story title input field", async () => {
      renderWithStory(<TopBar />, { storyId: TEST_STORY_ID });
      const titleInput = await screen.findByLabelText("Story title");
      expect(titleInput).toBeInTheDocument();

      // Wait for the title to load from IndexedDB
      await waitFor(() => {
        expect(titleInput).toHaveValue("Mock Test Adventure");
      });
    });

    it("renders Test navigation link", async () => {
      renderWithStory(<TopBar />, { storyId: TEST_STORY_ID });
      const testLink = await screen.findByRole("link", { name: /test/i });
      expect(testLink).toBeInTheDocument();
      expect(testLink).toHaveAttribute(
        "href",
        getStoryTestRoute(TEST_STORY_ID)
      );
    });

    it("renders Edit navigation link", async () => {
      renderWithStory(<TopBar />, { storyId: TEST_STORY_ID });
      const editLink = await screen.findByRole("link", { name: /edit/i });
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute(
        "href",
        getStoryEditRoute(TEST_STORY_ID)
      );
    });

    it("renders back button instead of logo in story routes", async () => {
      renderWithStory(<TopBar />, { storyId: TEST_STORY_ID });
      const backButton = await screen.findByRole("button", {
        name: /back to document manager/i,
      });
      expect(backButton).toBeInTheDocument();
    });

    it("does not render back button in document manager route", async () => {
      renderWithStory(<TopBar />, { route: ROUTES.ROOT });
      const backButton = screen.queryByRole("button", {
        name: /back to document manager/i,
      });
      expect(backButton).not.toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("navigates to document manager when back button is clicked", async () => {
      const user = userEvent.setup();
      renderWithStory(<TopBar />, {
        storyId: TEST_STORY_ID,
      });

      const backButton = await screen.findByRole("button", {
        name: /back to document manager/i,
      });

      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ROOT);
    });
  });
});
