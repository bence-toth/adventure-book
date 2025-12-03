import { screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IntroductionEditView } from "../IntroductionEditView";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import * as useAdventureHook from "@/context/useAdventure";

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

  it("renders title input with adventure title", () => {
    render(<IntroductionEditView adventure={mockAdventure} />);

    const titleInput = screen.getByTestId(
      "introduction-title-input"
    ) as HTMLInputElement;
    expect(titleInput).toBeInTheDocument();
    expect(titleInput.value).toBe(mockAdventure.metadata.title);
  });

  it("renders text input with introduction paragraphs", () => {
    render(<IntroductionEditView adventure={mockAdventure} />);

    const textInput = screen.getByTestId(
      "introduction-text-input"
    ) as HTMLTextAreaElement;
    expect(textInput).toBeInTheDocument();

    const expectedText = mockAdventure.intro.paragraphs.join("\n\n");
    expect(textInput.value).toBe(expectedText);
  });

  it("updates title when input changes", async () => {
    const user = userEvent.setup();
    render(<IntroductionEditView adventure={mockAdventure} />);

    const titleInput = screen.getByTestId(
      "introduction-title-input"
    ) as HTMLInputElement;

    await user.clear(titleInput);
    await user.type(titleInput, "New Title");

    expect(titleInput.value).toBe("New Title");
  });

  it("updates text when textarea changes", async () => {
    const user = userEvent.setup();
    render(<IntroductionEditView adventure={mockAdventure} />);

    const textInput = screen.getByTestId(
      "introduction-text-input"
    ) as HTMLTextAreaElement;

    await user.clear(textInput);
    await user.type(textInput, "New paragraph text");

    expect(textInput.value).toBe("New paragraph text");
  });

  it("calls updateIntroduction with title and text when save is clicked", async () => {
    const user = userEvent.setup();
    render(<IntroductionEditView adventure={mockAdventure} />);

    const titleInput = screen.getByTestId(
      "introduction-title-input"
    ) as HTMLInputElement;
    const textInput = screen.getByTestId(
      "introduction-text-input"
    ) as HTMLTextAreaElement;
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

  it("shows validation error when title is empty", async () => {
    const user = userEvent.setup();
    render(<IntroductionEditView adventure={mockAdventure} />);

    const titleInput = screen.getByTestId(
      "introduction-title-input"
    ) as HTMLInputElement;
    const saveButton = screen.getByRole("button", { name: /save/i });

    await user.clear(titleInput);
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Title must not be blank")).toBeInTheDocument();
    });

    expect(mockUpdateIntroduction).not.toHaveBeenCalled();
  });

  it("shows validation error when text is empty", async () => {
    const user = userEvent.setup();
    render(<IntroductionEditView adventure={mockAdventure} />);

    const textInput = screen.getByTestId(
      "introduction-text-input"
    ) as HTMLTextAreaElement;
    const saveButton = screen.getByRole("button", { name: /save/i });

    await user.clear(textInput);
    await user.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Introduction content must not be blank")
      ).toBeInTheDocument();
    });

    expect(mockUpdateIntroduction).not.toHaveBeenCalled();
  });

  it("shows validation errors for both title and text when both are empty", async () => {
    const user = userEvent.setup();
    render(<IntroductionEditView adventure={mockAdventure} />);

    const titleInput = screen.getByTestId(
      "introduction-title-input"
    ) as HTMLInputElement;
    const textInput = screen.getByTestId(
      "introduction-text-input"
    ) as HTMLTextAreaElement;
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

  it("clears title error when user starts typing", async () => {
    const user = userEvent.setup();
    render(<IntroductionEditView adventure={mockAdventure} />);

    const titleInput = screen.getByTestId(
      "introduction-title-input"
    ) as HTMLInputElement;
    const saveButton = screen.getByRole("button", { name: /save/i });

    // Clear title and trigger validation error
    await user.clear(titleInput);
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Title must not be blank")).toBeInTheDocument();
    });

    // Start typing to clear error
    await user.type(titleInput, "N");

    await waitFor(() => {
      expect(
        screen.queryByText("Title must not be blank")
      ).not.toBeInTheDocument();
    });
  });

  it("clears text error when user starts typing", async () => {
    const user = userEvent.setup();
    render(<IntroductionEditView adventure={mockAdventure} />);

    const textInput = screen.getByTestId(
      "introduction-text-input"
    ) as HTMLTextAreaElement;
    const saveButton = screen.getByRole("button", { name: /save/i });

    // Clear text and trigger validation error
    await user.clear(textInput);
    await user.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Introduction content must not be blank")
      ).toBeInTheDocument();
    });

    // Start typing to clear error
    await user.type(textInput, "N");

    await waitFor(() => {
      expect(
        screen.queryByText("Introduction content must not be blank")
      ).not.toBeInTheDocument();
    });
  });

  it("does not call updateIntroduction when title validation fails", async () => {
    const user = userEvent.setup();
    render(<IntroductionEditView adventure={mockAdventure} />);

    const titleInput = screen.getByTestId(
      "introduction-title-input"
    ) as HTMLInputElement;
    const saveButton = screen.getByRole("button", { name: /save/i });

    await user.clear(titleInput);
    await user.type(titleInput, "   "); // Whitespace only

    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Title must not be blank")).toBeInTheDocument();
    });

    expect(mockUpdateIntroduction).not.toHaveBeenCalled();
  });

  it("does not call updateIntroduction when text validation fails", async () => {
    const user = userEvent.setup();
    render(<IntroductionEditView adventure={mockAdventure} />);

    const textInput = screen.getByTestId(
      "introduction-text-input"
    ) as HTMLTextAreaElement;
    const saveButton = screen.getByRole("button", { name: /save/i });

    await user.clear(textInput);
    await user.type(textInput, "   "); // Whitespace only

    await user.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Introduction content must not be blank")
      ).toBeInTheDocument();
    });

    expect(mockUpdateIntroduction).not.toHaveBeenCalled();
  });

  it("renders save button", () => {
    render(<IntroductionEditView adventure={mockAdventure} />);

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeInTheDocument();
  });
});
