import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdventureTitleInput } from "../AdventureTitleInput";
import * as adventureDatabase from "@/data/adventureDatabase";

vi.mock("@/data/adventureDatabase", () => ({
  getAdventure: vi.fn(),
  updateAdventureTitle: vi.fn(),
}));

describe("AdventureTitleInput", () => {
  const TEST_STORY_ID = "test-adventure-id";
  const TEST_TITLE = "Test Adventure Title";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(adventureDatabase.getAdventure).mockResolvedValue({
      id: TEST_STORY_ID,
      title: TEST_TITLE,
      content: "test content",
      createdAt: new Date(),
      lastEdited: new Date(),
    });
  });

  it("handles null adventureId gracefully", () => {
    render(<AdventureTitleInput adventureId={null} />);

    const input = screen.getByLabelText("Adventure title");
    expect(input).toHaveValue("");
    expect(adventureDatabase.getAdventure).not.toHaveBeenCalled();
  });

  it("loads and displays adventure title", async () => {
    render(<AdventureTitleInput adventureId={TEST_STORY_ID} />);

    await waitFor(() => {
      const input = screen.getByLabelText("Adventure title");
      expect(input).toHaveValue(TEST_TITLE);
    });

    expect(adventureDatabase.getAdventure).toHaveBeenCalledWith(TEST_STORY_ID);
  });

  it("updates title on change", async () => {
    const user = userEvent.setup();
    render(<AdventureTitleInput adventureId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Adventure title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Adventure title");
    await user.clear(input);
    await user.type(input, "New Title");

    expect(input).toHaveValue("New Title");
  });

  it("saves title on blur", async () => {
    const user = userEvent.setup();
    render(<AdventureTitleInput adventureId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Adventure title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Adventure title");
    await user.clear(input);
    await user.type(input, "Updated Title");
    await user.tab(); // Trigger blur

    await waitFor(() => {
      expect(adventureDatabase.updateAdventureTitle).toHaveBeenCalledWith(
        TEST_STORY_ID,
        "Updated Title"
      );
    });
  });

  it("saves title on Enter key", async () => {
    const user = userEvent.setup();
    render(<AdventureTitleInput adventureId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Adventure title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Adventure title");
    await user.clear(input);
    await user.type(input, "Title via Enter{Enter}");

    await waitFor(() => {
      expect(adventureDatabase.updateAdventureTitle).toHaveBeenCalledWith(
        TEST_STORY_ID,
        "Title via Enter"
      );
    });
  });

  it("does not save empty title", async () => {
    const user = userEvent.setup();
    render(<AdventureTitleInput adventureId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Adventure title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Adventure title");
    await user.clear(input);
    await user.tab();

    await waitFor(() => {
      expect(adventureDatabase.updateAdventureTitle).not.toHaveBeenCalled();
    });
  });

  it("trims whitespace before saving", async () => {
    const user = userEvent.setup();
    render(<AdventureTitleInput adventureId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Adventure title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Adventure title");
    await user.clear(input);
    await user.type(input, "  Spaced Title  ");
    await user.tab();

    await waitFor(() => {
      expect(adventureDatabase.updateAdventureTitle).toHaveBeenCalledWith(
        TEST_STORY_ID,
        "Spaced Title"
      );
    });
  });

  it("handles update failure gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();

    // Mock the update to throw an error
    vi.mocked(adventureDatabase.updateAdventureTitle).mockRejectedValueOnce(
      new Error("Update failed")
    );

    render(<AdventureTitleInput adventureId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Adventure title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Adventure title");
    await user.clear(input);
    await user.type(input, "New Title");
    await user.tab();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to update adventure title:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
