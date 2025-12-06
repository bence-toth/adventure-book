import { screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { ChoiceList } from "../ChoiceList";
import { renderWithAdventure } from "@/__tests__/testUtils";
import type { ChoiceData } from "../../usePassageEditState";

describe("ChoiceList", () => {
  const mockPassageOptions = [
    { value: "1", label: "Passage 1" },
    { value: "2", label: "Passage 2" },
    { value: "3", label: "Passage 3" },
  ];

  const mockOnAddChoice = vi.fn();
  const mockOnRemoveChoice = vi.fn();
  const mockOnChoiceTextChange = vi.fn();
  const mockOnChoiceGotoChange = vi.fn();

  const choiceRefs = { current: [] as (HTMLInputElement | null)[] };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders section title", () => {
    renderWithAdventure(
      <ChoiceList
        choices={[]}
        passageOptions={mockPassageOptions}
        choiceRefs={choiceRefs}
        onAddChoice={mockOnAddChoice}
        onRemoveChoice={mockOnRemoveChoice}
        onChoiceTextChange={mockOnChoiceTextChange}
        onChoiceGotoChange={mockOnChoiceGotoChange}
      />
    );

    expect(screen.getByText("Choices")).toBeInTheDocument();
  });

  it("renders add choice button", () => {
    renderWithAdventure(
      <ChoiceList
        choices={[]}
        passageOptions={mockPassageOptions}
        choiceRefs={choiceRefs}
        onAddChoice={mockOnAddChoice}
        onRemoveChoice={mockOnRemoveChoice}
        onChoiceTextChange={mockOnChoiceTextChange}
        onChoiceGotoChange={mockOnChoiceGotoChange}
      />
    );

    expect(screen.getByTestId("add-choice-button")).toBeInTheDocument();
    expect(screen.getByText("Add choice")).toBeInTheDocument();
  });

  it("renders choices when provided", () => {
    const choices: ChoiceData[] = [
      { text: "Choice 1", goto: 2 },
      { text: "Choice 2", goto: 3 },
    ];

    renderWithAdventure(
      <ChoiceList
        choices={choices}
        passageOptions={mockPassageOptions}
        choiceRefs={choiceRefs}
        onAddChoice={mockOnAddChoice}
        onRemoveChoice={mockOnRemoveChoice}
        onChoiceTextChange={mockOnChoiceTextChange}
        onChoiceGotoChange={mockOnChoiceGotoChange}
      />
    );

    expect(screen.getByTestId("choice-text-0")).toHaveValue("Choice 1");
    expect(screen.getByTestId("choice-text-1")).toHaveValue("Choice 2");
  });

  it("displays choices error when provided", () => {
    renderWithAdventure(
      <ChoiceList
        choices={[]}
        choicesError="Regular passages must have at least one choice"
        passageOptions={mockPassageOptions}
        choiceRefs={choiceRefs}
        onAddChoice={mockOnAddChoice}
        onRemoveChoice={mockOnRemoveChoice}
        onChoiceTextChange={mockOnChoiceTextChange}
        onChoiceGotoChange={mockOnChoiceGotoChange}
      />
    );

    expect(
      screen.getByText("Regular passages must have at least one choice")
    ).toBeInTheDocument();
  });

  it("calls onAddChoice when add button is clicked", () => {
    renderWithAdventure(
      <ChoiceList
        choices={[]}
        passageOptions={mockPassageOptions}
        choiceRefs={choiceRefs}
        onAddChoice={mockOnAddChoice}
        onRemoveChoice={mockOnRemoveChoice}
        onChoiceTextChange={mockOnChoiceTextChange}
        onChoiceGotoChange={mockOnChoiceGotoChange}
      />
    );

    const addButton = screen.getByTestId("add-choice-button");
    fireEvent.click(addButton);

    expect(mockOnAddChoice).toHaveBeenCalledTimes(1);
  });

  it("passes handlers to ChoiceItem components", async () => {
    const choices: ChoiceData[] = [{ text: "Choice 1", goto: 2 }];

    renderWithAdventure(
      <ChoiceList
        choices={choices}
        passageOptions={mockPassageOptions}
        choiceRefs={choiceRefs}
        onAddChoice={mockOnAddChoice}
        onRemoveChoice={mockOnRemoveChoice}
        onChoiceTextChange={mockOnChoiceTextChange}
        onChoiceGotoChange={mockOnChoiceGotoChange}
      />
    );

    // Test text change
    const textInput = screen.getByTestId("choice-text-0");
    fireEvent.change(textInput, { target: { value: "Updated" } });
    expect(mockOnChoiceTextChange).toHaveBeenCalledWith(0, "Updated");

    // Test goto change - click dropdown and select option
    const gotoSelect = screen.getByTestId("choice-goto-0");
    fireEvent.click(gotoSelect);
    const option = await screen.findByTestId("choice-goto-0-option-3");
    fireEvent.click(option);
    expect(mockOnChoiceGotoChange).toHaveBeenCalledWith(0, "3");

    // Test remove
    const removeButton = screen.getByTestId("remove-choice-0");
    fireEvent.click(removeButton);
    expect(mockOnRemoveChoice).toHaveBeenCalledWith(0);
  });

  it("renders multiple choices correctly", () => {
    const choices: ChoiceData[] = [
      { text: "Choice 1", goto: 2 },
      { text: "Choice 2", goto: 3 },
      { text: "Choice 3", goto: 4 },
    ];

    renderWithAdventure(
      <ChoiceList
        choices={choices}
        passageOptions={mockPassageOptions}
        choiceRefs={choiceRefs}
        onAddChoice={mockOnAddChoice}
        onRemoveChoice={mockOnRemoveChoice}
        onChoiceTextChange={mockOnChoiceTextChange}
        onChoiceGotoChange={mockOnChoiceGotoChange}
      />
    );

    expect(screen.getByTestId("choice-text-0")).toBeInTheDocument();
    expect(screen.getByTestId("choice-text-1")).toBeInTheDocument();
    expect(screen.getByTestId("choice-text-2")).toBeInTheDocument();
    expect(screen.getByTestId("remove-choice-0")).toBeInTheDocument();
    expect(screen.getByTestId("remove-choice-1")).toBeInTheDocument();
    expect(screen.getByTestId("remove-choice-2")).toBeInTheDocument();
  });
});
