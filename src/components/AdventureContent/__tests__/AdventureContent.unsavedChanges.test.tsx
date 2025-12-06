import { screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { AdventureContent } from "../AdventureContent";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import { getNavigationPassageTestId } from "../AdventureContentSidebar/Navigation/testIds";
import * as ReactRouterDom from "react-router-dom";

const TEST_STORY_ID = "test-adventure-id";

// Mock react-router-dom
const mockNavigate = vi.fn();
let mockParams: { id: string | undefined; adventureId: string } = {
  id: "1",
  adventureId: TEST_STORY_ID,
};
const mockBlocker = {
  state: "unblocked" as const,
  proceed: vi.fn(),
  reset: vi.fn(),
};

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof ReactRouterDom>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
    useBlocker: vi.fn(() => mockBlocker),
  };
});

// Integration tests for unsaved changes warning in edit views.
// These tests verify that users are prompted to confirm navigation
// when they have unsaved changes in either passage or introduction edit views.
describe("AdventureContent Unsaved Changes Warning", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockBlocker.proceed.mockClear();
    mockBlocker.reset.mockClear();
    vi.clearAllMocks();
    mockParams = { id: "1", adventureId: TEST_STORY_ID };
    mockBlocker.state = "unblocked";
  });

  describe("PassageEditView unsaved changes", () => {
    it("does not show warning when navigating without changes", async () => {
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await screen.findByTestId("passage-text-input");

      // Attempt to navigate
      const passage2Link = screen.getByTestId(getNavigationPassageTestId(2));
      fireEvent.click(passage2Link);

      // Modal should not appear
      expect(
        screen.queryByTestId("unsaved-changes-modal")
      ).not.toBeInTheDocument();
    });

    it("calls blocker with correct parameters after making text changes", async () => {
      const user = userEvent.setup();
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const textInput = await screen.findByTestId("passage-text-input");

      // Make a change
      await user.clear(textInput);
      await user.type(textInput, "Modified passage content");

      // Verify that useBlocker was called
      expect(ReactRouterDom.useBlocker).toHaveBeenCalled();
    });

    it("calls blocker with correct parameters after making notes changes", async () => {
      const user = userEvent.setup();
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const notesInput = await screen.findByTestId("passage-notes-input");

      // Make a change
      await user.type(notesInput, "New notes");

      // Verify that useBlocker was called
      expect(ReactRouterDom.useBlocker).toHaveBeenCalled();
    });

    it("calls blocker with correct parameters after adding choice", async () => {
      const user = userEvent.setup();
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await screen.findByTestId("passage-text-input");

      // Add a new choice
      const addChoiceButton = screen.getByRole("button", {
        name: /add choice/i,
      });
      await user.click(addChoiceButton);

      // Verify that useBlocker was called
      expect(ReactRouterDom.useBlocker).toHaveBeenCalled();
    });

    it("does not block navigation after saving changes", async () => {
      const user = userEvent.setup();
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const textInput = await screen.findByTestId("passage-text-input");

      // Make a change
      await user.clear(textInput);
      await user.type(textInput, "Modified content");

      // Save the changes
      const saveButton = screen.getByRole("button", { name: /save passage/i });
      await user.click(saveButton);

      // Verify that blocker was called
      expect(ReactRouterDom.useBlocker).toHaveBeenCalled();
    });

    it("does not block navigation after resetting changes", async () => {
      const user = userEvent.setup();
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const textInput = await screen.findByTestId("passage-text-input");

      // Make a change
      await user.clear(textInput);
      await user.type(textInput, "Modified content");

      // Reset the changes
      const resetButton = screen.getByRole("button", {
        name: /undo changes/i,
      });
      await user.click(resetButton);

      // Verify that blocker was called
      expect(ReactRouterDom.useBlocker).toHaveBeenCalled();
    });
  });

  describe("IntroductionEditView unsaved changes", () => {
    it("does not show warning when navigating without changes", async () => {
      mockParams = { id: undefined, adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await screen.findByTestId("introduction-title-input");

      // Modal should not appear without changes
      expect(
        screen.queryByTestId("unsaved-changes-modal")
      ).not.toBeInTheDocument();
    });

    it("calls blocker after making title changes", async () => {
      const user = userEvent.setup();
      mockParams = { id: undefined, adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const titleInput = await screen.findByTestId("introduction-title-input");

      // Make a change
      await user.clear(titleInput);
      await user.type(titleInput, "New Title");

      // Verify that useBlocker was called
      expect(ReactRouterDom.useBlocker).toHaveBeenCalled();
    });

    it("calls blocker after making text changes", async () => {
      const user = userEvent.setup();
      mockParams = { id: undefined, adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const textInput = await screen.findByTestId("introduction-text-input");

      // Make a change
      await user.clear(textInput);
      await user.type(textInput, "New introduction text");

      // Verify that useBlocker was called
      expect(ReactRouterDom.useBlocker).toHaveBeenCalled();
    });

    it("does not block navigation after saving changes", async () => {
      const user = userEvent.setup();
      mockParams = { id: undefined, adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const titleInput = await screen.findByTestId("introduction-title-input");

      // Make a change
      await user.clear(titleInput);
      await user.type(titleInput, "New Title");

      // Save the changes
      const saveButton = screen.getByRole("button", {
        name: /save introduction/i,
      });
      await user.click(saveButton);

      // Verify that blocker was called
      expect(ReactRouterDom.useBlocker).toHaveBeenCalled();
    });

    it("does not block navigation after resetting changes", async () => {
      const user = userEvent.setup();
      mockParams = { id: undefined, adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const titleInput = await screen.findByTestId("introduction-title-input");

      // Make a change
      await user.clear(titleInput);
      await user.type(titleInput, "New Title");

      // Reset the changes
      const resetButton = screen.getByRole("button", {
        name: /undo changes/i,
      });
      await user.click(resetButton);

      // Verify that blocker was called
      expect(ReactRouterDom.useBlocker).toHaveBeenCalled();
    });
  });
});
