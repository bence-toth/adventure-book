import { screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { TopBar } from "../TopBar";
import { ROUTES } from "@/constants/routes";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { setupTestAdventure } from "@/__tests__/mockAdventureData";

const TEST_STORY_ID = "test-adventure-id";

describe("TopBar Component", () => {
  beforeEach(async () => {
    await setupTestAdventure(TEST_STORY_ID);
  });

  describe("Rendering", () => {
    it("renders the header element", async () => {
      renderWithAdventure(<TopBar />, { adventureId: TEST_STORY_ID });
      const header = await screen.findByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("renders adventure view with back button, title input, and navigation in adventure routes", async () => {
      renderWithAdventure(<TopBar />, { adventureId: TEST_STORY_ID });

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
      renderWithAdventure(<TopBar />, { route: ROUTES.ROOT });

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
});
