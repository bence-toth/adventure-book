import { screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { ChoiceItem } from "../ChoiceItem";
import { renderWithAdventure } from "@/__tests__/testUtils";
import type { ChoiceData } from "../../usePassageEditState";

describe("ChoiceItem", () => {
  const mockPassageOptions = [
    { value: "1", label: "Passage 1" },
    { value: "2", label: "Passage 2" },
    { value: "3", label: "Passage 3" },
  ];

  const mockOnTextChange = vi.fn();
  const mockOnGotoChange = vi.fn();
  const mockOnRemove = vi.fn();

  it("renders choice text and goto inputs", () => {
    const choice: ChoiceData = { text: "Test choice", goto: 2 };

    renderWithAdventure(
      <ChoiceItem
        choice={choice}
        index={0}
        passageOptions={mockPassageOptions}
        onTextChange={mockOnTextChange}
        onGotoChange={mockOnGotoChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByTestId("choice-text-0")).toHaveValue("Test choice");
    // Custom Select shows selected option text in button
    expect(screen.getByTestId("choice-goto-0")).toHaveTextContent("Passage 2");
  });

  it("renders with empty values", () => {
    const choice: ChoiceData = { text: "", goto: null };

    renderWithAdventure(
      <ChoiceItem
        choice={choice}
        index={1}
        passageOptions={mockPassageOptions}
        onTextChange={mockOnTextChange}
        onGotoChange={mockOnGotoChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByTestId("choice-text-1")).toHaveValue("");
    // Custom Select shows placeholder when no value selected
    expect(screen.getByTestId("choice-goto-1")).toHaveTextContent(
      "Select passage"
    );
  });

  it("calls onTextChange when text input changes", () => {
    const choice: ChoiceData = { text: "Test choice", goto: 2 };

    renderWithAdventure(
      <ChoiceItem
        choice={choice}
        index={0}
        passageOptions={mockPassageOptions}
        onTextChange={mockOnTextChange}
        onGotoChange={mockOnGotoChange}
        onRemove={mockOnRemove}
      />
    );

    const textInput = screen.getByTestId("choice-text-0");
    fireEvent.change(textInput, { target: { value: "Updated choice" } });

    expect(mockOnTextChange).toHaveBeenCalledWith(0, "Updated choice");
  });

  it("calls onGotoChange when goto select changes", async () => {
    const choice: ChoiceData = { text: "Test choice", goto: 2 };

    renderWithAdventure(
      <ChoiceItem
        choice={choice}
        index={0}
        passageOptions={mockPassageOptions}
        onTextChange={mockOnTextChange}
        onGotoChange={mockOnGotoChange}
        onRemove={mockOnRemove}
      />
    );

    const gotoSelect = screen.getByTestId("choice-goto-0");
    fireEvent.click(gotoSelect);

    // Wait for dropdown to open and click option
    const option = await screen.findByTestId("choice-goto-0-option-3");
    fireEvent.click(option);

    expect(mockOnGotoChange).toHaveBeenCalledWith(0, "3");
  });

  it("calls onRemove when remove button is clicked", () => {
    const choice: ChoiceData = { text: "Test choice", goto: 2 };

    renderWithAdventure(
      <ChoiceItem
        choice={choice}
        index={0}
        passageOptions={mockPassageOptions}
        onTextChange={mockOnTextChange}
        onGotoChange={mockOnGotoChange}
        onRemove={mockOnRemove}
      />
    );

    const removeButton = screen.getByTestId("remove-choice-0");
    fireEvent.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith(0);
  });

  it("displays text error when provided", () => {
    const choice: ChoiceData = {
      text: "",
      goto: 2,
      textError: "Choice text is required",
    };

    renderWithAdventure(
      <ChoiceItem
        choice={choice}
        index={0}
        passageOptions={mockPassageOptions}
        onTextChange={mockOnTextChange}
        onGotoChange={mockOnGotoChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText("Choice text is required")).toBeInTheDocument();
  });

  it("displays goto error when provided", () => {
    const choice: ChoiceData = {
      text: "Test choice",
      goto: null,
      gotoError: "Choice target is required",
    };

    renderWithAdventure(
      <ChoiceItem
        choice={choice}
        index={0}
        passageOptions={mockPassageOptions}
        onTextChange={mockOnTextChange}
        onGotoChange={mockOnGotoChange}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText("Choice target is required")).toBeInTheDocument();
  });

  it("passes ref to text input", () => {
    const choice: ChoiceData = { text: "Test choice", goto: 2 };
    const mockRef = vi.fn();

    renderWithAdventure(
      <ChoiceItem
        choice={choice}
        index={0}
        passageOptions={mockPassageOptions}
        onTextChange={mockOnTextChange}
        onGotoChange={mockOnGotoChange}
        onRemove={mockOnRemove}
        choiceRef={mockRef}
      />
    );

    expect(mockRef).toHaveBeenCalled();
  });
});
