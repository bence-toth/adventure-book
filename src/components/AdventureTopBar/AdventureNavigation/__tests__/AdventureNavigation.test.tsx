import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { AdventureNavigation } from "../AdventureNavigation";
import { renderWithAdventure } from "@/__tests__/testUtils";
import {
  getAdventureTestRoute,
  getAdventureContentRoute,
} from "@/constants/routes";

describe("AdventureNavigation", () => {
  const TEST_STORY_ID = "test-adventure-id";

  it("renders Test and Content navigation links", () => {
    renderWithAdventure(<AdventureNavigation adventureId={TEST_STORY_ID} />, {
      adventureId: TEST_STORY_ID,
    });

    const testLink = screen.getByRole("link", { name: /test/i });
    const contentLink = screen.getByRole("link", { name: /content/i });

    expect(testLink).toBeInTheDocument();
    expect(contentLink).toBeInTheDocument();
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

  it("Content link has correct href", () => {
    renderWithAdventure(<AdventureNavigation adventureId={TEST_STORY_ID} />, {
      adventureId: TEST_STORY_ID,
    });

    const contentLink = screen.getByRole("link", { name: /content/i });
    expect(contentLink).toHaveAttribute(
      "href",
      getAdventureContentRoute(TEST_STORY_ID)
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

  it("marks Content link as selected when on content route", () => {
    const contentRoute = getAdventureContentRoute(TEST_STORY_ID);
    renderWithAdventure(<AdventureNavigation adventureId={TEST_STORY_ID} />, {
      adventureId: TEST_STORY_ID,
      route: contentRoute,
    });

    const contentLink = screen.getByRole("link", { name: /content/i });
    expect(contentLink).toHaveAttribute("aria-current", "page");
  });

  it("renders navigation as a nav element", () => {
    renderWithAdventure(<AdventureNavigation adventureId={TEST_STORY_ID} />, {
      adventureId: TEST_STORY_ID,
    });

    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
  });
});
