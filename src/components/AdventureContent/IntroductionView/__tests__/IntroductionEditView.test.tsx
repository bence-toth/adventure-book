import { screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IntroductionEditView } from "../IntroductionEditView";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import * as useAdventureHook from "@/context/useAdventure";

// Mock react-router-dom's useBlocker
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useBlocker: vi.fn(() => ({
      state: "unblocked",
      proceed: vi.fn(),
      reset: vi.fn(),
    })),
  };
});

describe("IntroductionEditView Component", () => {
  const mockUpdateIntroduction = vi.fn();

  beforeEach(() => {
    mockUpdateIntroduction.mockClear();
    vi.spyOn(useAdventureHook, "useAdventure").mockReturnValue({
      adventure: mockAdventure,
      adventureId: "test-id",
      isLoading: false,
      error: null,
      isDebugModeEnabled: false,
      isSaving: false,
      setIsDebugModeEnabled: vi.fn(),
      reloadAdventure: vi.fn(),
      updateAdventure: vi.fn(),
      updateIntroduction: mockUpdateIntroduction,
      updatePassage: vi.fn(),
      withSaving: vi.fn(),
    });
  });

  describe("Integration with useIntroductionEdit hook", () => {
    it("renders with initial values from adventure", () => {
      render(<IntroductionEditView adventure={mockAdventure} />);

      const titleInput = screen.getByTestId(
        "introduction-title-input"
      ) as HTMLInputElement;
      const textInput = screen.getByTestId(
        "introduction-text-input"
      ) as HTMLTextAreaElement;

      expect(titleInput.value).toBe(mockAdventure.metadata.title);
      expect(textInput.value).toBe(mockAdventure.intro.paragraphs.join("\n\n"));
    });

    it("updates inputs and calls updateIntroduction on save", async () => {
      const user = userEvent.setup();
      render(<IntroductionEditView adventure={mockAdventure} />);

      const titleInput = screen.getByTestId("introduction-title-input");
      const textInput = screen.getByTestId("introduction-text-input");
      const saveButton = screen.getByRole("button", { name: /save/i });

      await user.clear(titleInput);
      await user.type(titleInput, "Updated Title");

      await user.clear(textInput);
      await user.type(textInput, "Updated text");

      await user.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateIntroduction).toHaveBeenCalledWith(
          "Updated Title",
          "Updated text"
        );
      });
    });

    it("displays validation errors from hook", async () => {
      const user = userEvent.setup();
      render(<IntroductionEditView adventure={mockAdventure} />);

      const titleInput = screen.getByTestId("introduction-title-input");
      const textInput = screen.getByTestId("introduction-text-input");
      const saveButton = screen.getByRole("button", { name: /save/i });

      await user.clear(titleInput);
      await user.clear(textInput);
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText("Title must not be blank")).toBeInTheDocument();
        expect(
          screen.getByText("Introduction content must not be blank")
        ).toBeInTheDocument();
      });

      expect(mockUpdateIntroduction).not.toHaveBeenCalled();
    });

    it("clears errors when user types", async () => {
      const user = userEvent.setup();
      render(<IntroductionEditView adventure={mockAdventure} />);

      const titleInput = screen.getByTestId("introduction-title-input");
      const saveButton = screen.getByRole("button", { name: /save/i });

      // Trigger error
      await user.clear(titleInput);
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText("Title must not be blank")).toBeInTheDocument();
      });

      // Clear error by typing
      await user.type(titleInput, "N");

      await waitFor(() => {
        expect(
          screen.queryByText("Title must not be blank")
        ).not.toBeInTheDocument();
      });
    });

    it("resets form to original values when reset is clicked", async () => {
      const user = userEvent.setup();
      render(<IntroductionEditView adventure={mockAdventure} />);

      const titleInput = screen.getByTestId(
        "introduction-title-input"
      ) as HTMLInputElement;
      const textInput = screen.getByTestId(
        "introduction-text-input"
      ) as HTMLTextAreaElement;

      await user.clear(titleInput);
      await user.type(titleInput, "Modified Title");

      await user.clear(textInput);
      await user.type(textInput, "Modified text");

      expect(titleInput.value).toBe("Modified Title");
      expect(textInput.value).toBe("Modified text");

      const resetButton = screen.getByRole("button", { name: /undo/i });
      await user.click(resetButton);

      expect(titleInput.value).toBe(mockAdventure.metadata.title);
      expect(textInput.value).toBe(mockAdventure.intro.paragraphs.join("\n\n"));
    });
  });

  describe("UI and accessibility", () => {
    it("renders all form elements", () => {
      render(<IntroductionEditView adventure={mockAdventure} />);

      expect(screen.getByText("Introduction")).toBeInTheDocument();
      expect(
        screen.getByTestId("introduction-title-input")
      ).toBeInTheDocument();
      expect(screen.getByTestId("introduction-text-input")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /undo/i })).toBeInTheDocument();
    });

    it("disables buttons when no changes are made", () => {
      render(<IntroductionEditView adventure={mockAdventure} />);

      const saveButton = screen.getByTestId("save-button");
      const resetButton = screen.getByTestId("reset-button");

      expect(saveButton).toBeDisabled();
      expect(resetButton).toBeDisabled();
    });

    it("enables buttons when changes are made", async () => {
      const user = userEvent.setup();
      render(<IntroductionEditView adventure={mockAdventure} />);

      const titleInput = screen.getByTestId("introduction-title-input");
      await user.type(titleInput, "x");

      const saveButton = screen.getByTestId("save-button");
      const resetButton = screen.getByTestId("reset-button");

      expect(saveButton).toBeEnabled();
      expect(resetButton).toBeEnabled();
    });

    it("disables buttons after reset", async () => {
      const user = userEvent.setup();
      render(<IntroductionEditView adventure={mockAdventure} />);

      const titleInput = screen.getByTestId("introduction-title-input");
      await user.type(titleInput, "Modified");

      const resetButton = screen.getByTestId("reset-button");
      await user.click(resetButton);

      const saveButton = screen.getByTestId("save-button");

      expect(saveButton).toBeDisabled();
      expect(resetButton).toBeDisabled();
    });
  });
});
