import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { TestAdventureTopBar } from "../TestAdventureTopBar";
import { ROUTES } from "@/constants/routes";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { setupTestAdventure } from "@/__tests__/mockAdventureData";

const TEST_STORY_ID = "test-adventure-id";

describe("TestAdventureTopBar Component", () => {
  beforeEach(async () => {
    await setupTestAdventure(TEST_STORY_ID);
  });

  describe("Rendering", () => {
    it("renders the header element", async () => {
      renderWithAdventure(<TestAdventureTopBar />, {
        adventureId: TEST_STORY_ID,
      });
      const header = await screen.findByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("renders back button, title input, and navigation", async () => {
      renderWithAdventure(<TestAdventureTopBar />, {
        adventureId: TEST_STORY_ID,
      });

      // Should have back button
      const backButton = await screen.findByRole("button", {
        name: /back to adventure manager/i,
      });
      expect(backButton).toBeInTheDocument();

      // Should have title input
      const titleInput = await screen.findByLabelText("Adventure title");
      expect(titleInput).toBeInTheDocument();

      // Should have navigation links
      const testLink = await screen.findByRole("link", { name: /test/i });
      const editLink = await screen.findByRole("link", { name: /edit/i });
      expect(testLink).toBeInTheDocument();
      expect(editLink).toBeInTheDocument();
    });

    it("returns null when adventureId is not available", () => {
      renderWithAdventure(<TestAdventureTopBar />, {
        adventureId: "",
        adventure: null,
        loading: false,
      });

      const header = screen.queryByRole("banner");
      expect(header).not.toBeInTheDocument();
    });
  });

  describe("Debug mode Toggle", () => {
    it("shows Debug mode toggle in test view", async () => {
      renderWithAdventure(<TestAdventureTopBar />, {
        adventureId: TEST_STORY_ID,
        route: ROUTES.STORY_TEST.replace(":adventureId", TEST_STORY_ID),
      });

      const toggle = await screen.findByRole("switch", {
        name: /debug mode/i,
      });
      expect(toggle).toBeInTheDocument();
    });

    it("Debug mode toggle is unchecked by default", async () => {
      renderWithAdventure(<TestAdventureTopBar />, {
        adventureId: TEST_STORY_ID,
        route: ROUTES.STORY_TEST.replace(":adventureId", TEST_STORY_ID),
      });

      const toggle = await screen.findByRole("switch", {
        name: /debug mode/i,
      });
      expect(toggle).not.toBeChecked();
    });

    it("Debug mode toggle can be toggled on and off", async () => {
      const user = userEvent.setup();
      renderWithAdventure(<TestAdventureTopBar />, {
        adventureId: TEST_STORY_ID,
        route: ROUTES.STORY_TEST.replace(":adventureId", TEST_STORY_ID),
      });

      const toggle = await screen.findByRole("switch", {
        name: /debug mode/i,
      });

      // Initially unchecked
      expect(toggle).not.toBeChecked();

      // Click to check
      await user.click(toggle);
      expect(toggle).toBeChecked();

      // Click again to uncheck
      await user.click(toggle);
      expect(toggle).not.toBeChecked();
    });
  });
});
