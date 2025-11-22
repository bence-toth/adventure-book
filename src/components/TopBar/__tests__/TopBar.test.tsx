import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { TopBar } from "../TopBar";
import {
  getStoryTestRoute,
  getStoryEditRoute,
} from "../../../constants/routes";
import { renderWithStory } from "../../../test/testUtils";
import { setupTestStory } from "../../../test/mockStoryData";

const TEST_STORY_ID = "test-story-id";

describe("TopBar Component", () => {
  beforeEach(async () => {
    await setupTestStory(TEST_STORY_ID);
  });

  describe("Rendering", () => {
    it("renders the header element with correct class", async () => {
      renderWithStory(<TopBar />, { storyId: TEST_STORY_ID });
      const header = await screen.findByRole("banner");
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass("top-bar");
    });

    it("renders the story title input field", async () => {
      renderWithStory(<TopBar />, { storyId: TEST_STORY_ID });
      const titleInput = await screen.findByLabelText("Story title");
      expect(titleInput).toBeInTheDocument();
      expect(titleInput).toHaveClass("top-bar-title-input");

      // Wait for the title to load from IndexedDB
      await waitFor(() => {
        expect(titleInput).toHaveValue("Mock Test Adventure");
      });
    });

    it("renders the logo icon", async () => {
      renderWithStory(<TopBar />, { storyId: TEST_STORY_ID });
      const logoContainer = await screen.findByTestId("top-bar-logo");
      const logoIcon = logoContainer.querySelector(".top-bar-logo-icon");
      expect(logoIcon).toBeInTheDocument();
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
  });
});
