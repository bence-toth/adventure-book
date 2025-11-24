import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { AppTopBar } from "../AppTopBar";
import { ROUTES } from "@/constants/routes";
import { TOP_BAR_TEST_IDS } from "@/constants/testIds";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { setupTestAdventure } from "@/__tests__/mockAdventureData";

const TEST_STORY_ID = "test-adventure-id";

describe("AppTopBar Component", () => {
  beforeEach(async () => {
    await setupTestAdventure(TEST_STORY_ID);
  });

  describe("Rendering", () => {
    it("renders the header element", async () => {
      renderWithAdventure(<AppTopBar />, { adventureId: TEST_STORY_ID });
      const header = await screen.findByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("renders adventure view with back button, title input, and navigation in adventure routes", async () => {
      renderWithAdventure(<AppTopBar />, { adventureId: TEST_STORY_ID });

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

    it("renders adventure manager view with logo and title on root route", async () => {
      renderWithAdventure(<AppTopBar />, { route: ROUTES.ROOT });

      // Should NOT have back button
      const backButton = screen.queryByRole("button", {
        name: /back to adventure manager/i,
      });
      expect(backButton).not.toBeInTheDocument();

      // Should have the app title
      const title = screen.getByText("Adventure Book Companion");
      expect(title).toBeInTheDocument();

      // Should NOT have navigation links
      const testLink = screen.queryByRole("link", { name: /test/i });
      const editLink = screen.queryByRole("link", { name: /edit/i });
      expect(testLink).not.toBeInTheDocument();
      expect(editLink).not.toBeInTheDocument();
    });
  });

  describe("Debug mode Toggle", () => {
    it("shows Debug mode toggle in test view", async () => {
      renderWithAdventure(<AppTopBar />, {
        adventureId: TEST_STORY_ID,
        route: ROUTES.STORY_TEST.replace(":adventureId", TEST_STORY_ID),
      });

      const toggle = await screen.findByRole("switch", {
        name: /debug mode/i,
      });
      expect(toggle).toBeInTheDocument();
    });

    it("does not show Debug mode toggle in edit view", async () => {
      renderWithAdventure(<AppTopBar />, {
        adventureId: TEST_STORY_ID,
        route: ROUTES.STORY_EDIT.replace(":adventureId", TEST_STORY_ID),
      });

      // Wait for component to render
      await screen.findByRole("banner");

      const toggle = screen.queryByRole("switch", { name: /debug mode/i });
      expect(toggle).not.toBeInTheDocument();
    });

    it("does not show Debug mode toggle in adventure manager view", async () => {
      renderWithAdventure(<AppTopBar />, { route: ROUTES.ROOT });

      const toggle = screen.queryByRole("switch", { name: /debug mode/i });
      expect(toggle).not.toBeInTheDocument();
    });

    it("Debug mode toggle is unchecked by default", async () => {
      renderWithAdventure(<AppTopBar />, {
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
      renderWithAdventure(<AppTopBar />, {
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

    it("Debug mode toggle has correct test ID", async () => {
      renderWithAdventure(<AppTopBar />, {
        adventureId: TEST_STORY_ID,
        route: ROUTES.STORY_TEST.replace(":adventureId", TEST_STORY_ID),
      });

      const toggle = await screen.findByTestId(
        TOP_BAR_TEST_IDS.AUTHOR_TOOLS_TOGGLE
      );
      expect(toggle).toBeInTheDocument();
    });
  });
});
