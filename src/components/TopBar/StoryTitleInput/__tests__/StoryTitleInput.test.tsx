import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StoryTitleInput } from "../StoryTitleInput";
import * as storyDatabase from "@/data/storyDatabase";

vi.mock("@/data/storyDatabase", () => ({
  getStory: vi.fn(),
  updateStoryTitle: vi.fn(),
}));

describe("StoryTitleInput", () => {
  const TEST_STORY_ID = "test-story-id";
  const TEST_TITLE = "Test Adventure Title";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storyDatabase.getStory).mockResolvedValue({
      id: TEST_STORY_ID,
      title: TEST_TITLE,
      content: "test content",
      createdAt: new Date(),
      lastEdited: new Date(),
    });
  });

  it("loads and displays story title", async () => {
    render(<StoryTitleInput storyId={TEST_STORY_ID} />);

    await waitFor(() => {
      const input = screen.getByLabelText("Story title");
      expect(input).toHaveValue(TEST_TITLE);
    });

    expect(storyDatabase.getStory).toHaveBeenCalledWith(TEST_STORY_ID);
  });

  it("updates title on change", async () => {
    const user = userEvent.setup();
    render(<StoryTitleInput storyId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Story title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Story title");
    await user.clear(input);
    await user.type(input, "New Title");

    expect(input).toHaveValue("New Title");
  });

  it("saves title on blur", async () => {
    const user = userEvent.setup();
    render(<StoryTitleInput storyId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Story title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Story title");
    await user.clear(input);
    await user.type(input, "Updated Title");
    await user.tab(); // Trigger blur

    await waitFor(() => {
      expect(storyDatabase.updateStoryTitle).toHaveBeenCalledWith(
        TEST_STORY_ID,
        "Updated Title"
      );
    });
  });

  it("saves title on Enter key", async () => {
    const user = userEvent.setup();
    render(<StoryTitleInput storyId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Story title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Story title");
    await user.clear(input);
    await user.type(input, "Title via Enter{Enter}");

    await waitFor(() => {
      expect(storyDatabase.updateStoryTitle).toHaveBeenCalledWith(
        TEST_STORY_ID,
        "Title via Enter"
      );
    });
  });

  it("does not save empty title", async () => {
    const user = userEvent.setup();
    render(<StoryTitleInput storyId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Story title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Story title");
    await user.clear(input);
    await user.tab();

    await waitFor(() => {
      expect(storyDatabase.updateStoryTitle).not.toHaveBeenCalled();
    });
  });

  it("trims whitespace before saving", async () => {
    const user = userEvent.setup();
    render(<StoryTitleInput storyId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Story title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Story title");
    await user.clear(input);
    await user.type(input, "  Spaced Title  ");
    await user.tab();

    await waitFor(() => {
      expect(storyDatabase.updateStoryTitle).toHaveBeenCalledWith(
        TEST_STORY_ID,
        "Spaced Title"
      );
    });
  });
});
