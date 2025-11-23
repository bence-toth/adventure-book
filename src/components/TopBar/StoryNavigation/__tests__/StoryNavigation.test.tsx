import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { StoryNavigation } from "../StoryNavigation";
import { renderWithStory } from "@/__tests__/testUtils";
import { getStoryTestRoute, getStoryEditRoute } from "@/constants/routes";

describe("StoryNavigation", () => {
  const TEST_STORY_ID = "test-story-id";

  it("renders Test and Edit navigation links", () => {
    renderWithStory(<StoryNavigation storyId={TEST_STORY_ID} />, {
      storyId: TEST_STORY_ID,
    });

    const testLink = screen.getByRole("link", { name: /test/i });
    const editLink = screen.getByRole("link", { name: /edit/i });

    expect(testLink).toBeInTheDocument();
    expect(editLink).toBeInTheDocument();
  });

  it("Test link has correct href", () => {
    renderWithStory(<StoryNavigation storyId={TEST_STORY_ID} />, {
      storyId: TEST_STORY_ID,
    });

    const testLink = screen.getByRole("link", { name: /test/i });
    expect(testLink).toHaveAttribute("href", getStoryTestRoute(TEST_STORY_ID));
  });

  it("Edit link has correct href", () => {
    renderWithStory(<StoryNavigation storyId={TEST_STORY_ID} />, {
      storyId: TEST_STORY_ID,
    });

    const editLink = screen.getByRole("link", { name: /edit/i });
    expect(editLink).toHaveAttribute("href", getStoryEditRoute(TEST_STORY_ID));
  });

  it("marks Test link as selected when on test route", () => {
    const testRoute = getStoryTestRoute(TEST_STORY_ID);
    renderWithStory(<StoryNavigation storyId={TEST_STORY_ID} />, {
      storyId: TEST_STORY_ID,
      route: testRoute,
    });

    const testLink = screen.getByRole("link", { name: /test/i });
    expect(testLink).toHaveAttribute("aria-current", "page");
  });

  it("marks Edit link as selected when on edit route", () => {
    const editRoute = getStoryEditRoute(TEST_STORY_ID);
    renderWithStory(<StoryNavigation storyId={TEST_STORY_ID} />, {
      storyId: TEST_STORY_ID,
      route: editRoute,
    });

    const editLink = screen.getByRole("link", { name: /edit/i });
    expect(editLink).toHaveAttribute("aria-current", "page");
  });

  it("renders navigation as a nav element", () => {
    renderWithStory(<StoryNavigation storyId={TEST_STORY_ID} />, {
      storyId: TEST_STORY_ID,
    });

    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
  });
});
