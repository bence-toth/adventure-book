import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { AdventureNavigation } from "../AdventureNavigation";
import { renderWithAdventure } from "@/__tests__/testUtils";
import {
  getAdventureTestRoute,
  getAdventureEditRoute,
} from "@/constants/routes";

describe("AdventureNavigation", () => {
  const TEST_STORY_ID = "test-adventure-id";

  it("renders Test and Edit navigation links", () => {
    renderWithAdventure(<AdventureNavigation adventureId={TEST_STORY_ID} />, {
      adventureId: TEST_STORY_ID,
    });

    const testLink = screen.getByRole("link", { name: /test/i });
    const editLink = screen.getByRole("link", { name: /edit/i });

    expect(testLink).toBeInTheDocument();
    expect(editLink).toBeInTheDocument();
  });

  it("Test link has correct href", () => {
    renderWithAdventure(<AdventureNavigation adventureId={TEST_STORY_ID} />, {
      adventureId: TEST_STORY_ID,
    });

    const testLink = screen.getByRole("link", { name: /test/i });
    expect(testLink).toHaveAttribute(
      "href",
      getAdventureTestRoute(TEST_STORY_ID)
    );
  });

  it("Edit link has correct href", () => {
    renderWithAdventure(<AdventureNavigation adventureId={TEST_STORY_ID} />, {
      adventureId: TEST_STORY_ID,
    });

    const editLink = screen.getByRole("link", { name: /edit/i });
    expect(editLink).toHaveAttribute(
      "href",
      getAdventureEditRoute(TEST_STORY_ID)
    );
  });

  it("marks Test link as selected when on test route", () => {
    const testRoute = getAdventureTestRoute(TEST_STORY_ID);
    renderWithAdventure(<AdventureNavigation adventureId={TEST_STORY_ID} />, {
      adventureId: TEST_STORY_ID,
      route: testRoute,
    });

    const testLink = screen.getByRole("link", { name: /test/i });
    expect(testLink).toHaveAttribute("aria-current", "page");
  });

  it("marks Edit link as selected when on edit route", () => {
    const editRoute = getAdventureEditRoute(TEST_STORY_ID);
    renderWithAdventure(<AdventureNavigation adventureId={TEST_STORY_ID} />, {
      adventureId: TEST_STORY_ID,
      route: editRoute,
    });

    const editLink = screen.getByRole("link", { name: /edit/i });
    expect(editLink).toHaveAttribute("aria-current", "page");
  });

  it("renders navigation as a nav element", () => {
    renderWithAdventure(<AdventureNavigation adventureId={TEST_STORY_ID} />, {
      adventureId: TEST_STORY_ID,
    });

    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
  });
});
