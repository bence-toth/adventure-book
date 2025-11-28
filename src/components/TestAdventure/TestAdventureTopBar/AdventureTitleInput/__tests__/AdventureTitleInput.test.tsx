import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdventureTitleInput } from "../AdventureTitleInput";
import * as adventureDatabase from "@/data/adventureDatabase";
import { AdventureContext } from "@/context/AdventureContext";
import type { AdventureContextType } from "@/context/AdventureContext";
import type { Adventure } from "@/data/types";

vi.mock("@/data/adventureDatabase", () => ({
  updateAdventureTitle: vi.fn(),
}));

describe("AdventureTitleInput", () => {
  const TEST_STORY_ID = "test-adventure-id";
  const TEST_TITLE = "Test Adventure Title";
  const mockUpdateAdventure = vi.fn();
  const mockWithSaving = vi.fn();

  const mockAdventure: Adventure = {
    metadata: {
      title: TEST_TITLE,
      author: "Test Author",
      version: "1.0.0",
    },
    intro: {
      paragraphs: ["Test intro"],
      action: "Start",
    },
    passages: {},
    items: [],
  };

  const mockContextValue: AdventureContextType = {
    adventure: mockAdventure,
    adventureId: TEST_STORY_ID,
    loading: false,
    error: null,
    debugModeEnabled: false,
    isSaving: false,
    setDebugModeEnabled: vi.fn(),
    reloadAdventure: vi.fn(),
    updateAdventure: mockUpdateAdventure,
    withSaving: mockWithSaving,
  };

  const renderWithContext = (
    component: React.ReactElement,
    contextOverride?: Partial<AdventureContextType>
  ) => {
    return render(
      <AdventureContext.Provider
        value={{ ...mockContextValue, ...contextOverride }}
      >
        {component}
      </AdventureContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockWithSaving.mockImplementation((fn) => fn());
  });

  it("handles null adventureId gracefully", () => {
    renderWithContext(<AdventureTitleInput adventureId={null} />, {
      adventure: null,
    });

    const input = screen.getByLabelText("Adventure title");
    expect(input).toHaveValue("");
  });

  it("loads and displays adventure title", async () => {
    renderWithContext(<AdventureTitleInput adventureId={TEST_STORY_ID} />);

    await waitFor(() => {
      const input = screen.getByLabelText("Adventure title");
      expect(input).toHaveValue(TEST_TITLE);
    });
  });

  it("updates title on change", async () => {
    const user = userEvent.setup();
    renderWithContext(<AdventureTitleInput adventureId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Adventure title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Adventure title");
    await user.clear(input);
    await user.type(input, "New Title");

    expect(input).toHaveValue("New Title");
  });

  it("saves title on blur with optimistic update", async () => {
    const user = userEvent.setup();
    renderWithContext(<AdventureTitleInput adventureId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Adventure title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Adventure title");
    await user.clear(input);
    await user.type(input, "Updated Title");
    await user.tab(); // Trigger blur

    await waitFor(() => {
      // Should update adventure context immediately
      expect(mockUpdateAdventure).toHaveBeenCalledWith(expect.any(Function));

      // Should save to database via withSaving
      expect(mockWithSaving).toHaveBeenCalled();
      expect(adventureDatabase.updateAdventureTitle).toHaveBeenCalledWith(
        TEST_STORY_ID,
        "Updated Title"
      );
    });
  });

  it("saves title on Enter key", async () => {
    const user = userEvent.setup();
    renderWithContext(<AdventureTitleInput adventureId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Adventure title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Adventure title");
    await user.clear(input);
    await user.type(input, "Title via Enter{Enter}");

    await waitFor(() => {
      expect(mockUpdateAdventure).toHaveBeenCalledWith(expect.any(Function));
      expect(mockWithSaving).toHaveBeenCalled();
      expect(adventureDatabase.updateAdventureTitle).toHaveBeenCalledWith(
        TEST_STORY_ID,
        "Title via Enter"
      );
    });
  });

  it("does not save empty title", async () => {
    const user = userEvent.setup();
    renderWithContext(<AdventureTitleInput adventureId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Adventure title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Adventure title");
    await user.clear(input);
    await user.tab();

    await waitFor(() => {
      expect(mockUpdateAdventure).not.toHaveBeenCalled();
      expect(adventureDatabase.updateAdventureTitle).not.toHaveBeenCalled();
    });
  });

  it("trims whitespace before saving", async () => {
    const user = userEvent.setup();
    renderWithContext(<AdventureTitleInput adventureId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Adventure title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Adventure title");
    await user.clear(input);
    await user.type(input, "  Spaced Title  ");
    await user.tab();

    await waitFor(() => {
      expect(mockUpdateAdventure).toHaveBeenCalledWith(expect.any(Function));
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

    renderWithContext(<AdventureTitleInput adventureId={TEST_STORY_ID} />);

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

  it("updates context optimistically with correct title", async () => {
    const user = userEvent.setup();
    renderWithContext(<AdventureTitleInput adventureId={TEST_STORY_ID} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Adventure title")).toHaveValue(TEST_TITLE);
    });

    const input = screen.getByLabelText("Adventure title");
    await user.clear(input);
    await user.type(input, "New Title");
    await user.tab();

    await waitFor(() => {
      expect(mockUpdateAdventure).toHaveBeenCalled();
    });

    // Verify the updater function works correctly
    const updaterFunction = mockUpdateAdventure.mock.calls[0][0];
    const updatedAdventure = updaterFunction(mockAdventure);

    expect(updatedAdventure.metadata.title).toBe("New Title");
    expect(updatedAdventure.metadata.author).toBe(
      mockAdventure.metadata.author
    );
    expect(updatedAdventure.metadata.version).toBe(
      mockAdventure.metadata.version
    );
  });
});
