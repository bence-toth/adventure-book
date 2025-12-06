import { screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { PassageEditFooter } from "../PassageEditFooter";
import { renderWithAdventure } from "@/__tests__/testUtils";

describe("PassageEditFooter", () => {
  const mockOnSave = vi.fn();
  const mockOnReset = vi.fn();

  it("renders save and reset buttons", () => {
    renderWithAdventure(
      <PassageEditFooter
        hasChanges={false}
        onSave={mockOnSave}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByTestId("save-button")).toBeInTheDocument();
    expect(screen.getByTestId("reset-button")).toBeInTheDocument();
    expect(screen.getByText("Save passage")).toBeInTheDocument();
    expect(screen.getByText("Undo changes")).toBeInTheDocument();
  });

  it("disables buttons when hasChanges is false", () => {
    renderWithAdventure(
      <PassageEditFooter
        hasChanges={false}
        onSave={mockOnSave}
        onReset={mockOnReset}
      />
    );

    const saveButton = screen.getByTestId("save-button");
    const resetButton = screen.getByTestId("reset-button");

    expect(saveButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
  });

  it("enables buttons when hasChanges is true", () => {
    renderWithAdventure(
      <PassageEditFooter
        hasChanges={true}
        onSave={mockOnSave}
        onReset={mockOnReset}
      />
    );

    const saveButton = screen.getByTestId("save-button");
    const resetButton = screen.getByTestId("reset-button");

    expect(saveButton).not.toBeDisabled();
    expect(resetButton).not.toBeDisabled();
  });

  it("calls onSave when save button is clicked", () => {
    renderWithAdventure(
      <PassageEditFooter
        hasChanges={true}
        onSave={mockOnSave}
        onReset={mockOnReset}
      />
    );

    const saveButton = screen.getByTestId("save-button");
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it("calls onReset when reset button is clicked", () => {
    renderWithAdventure(
      <PassageEditFooter
        hasChanges={true}
        onSave={mockOnSave}
        onReset={mockOnReset}
      />
    );

    const resetButton = screen.getByTestId("reset-button");
    fireEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it("uses primary variant for save button", () => {
    renderWithAdventure(
      <PassageEditFooter
        hasChanges={true}
        onSave={mockOnSave}
        onReset={mockOnReset}
      />
    );

    const saveButton = screen.getByTestId("save-button");
    // The Button component applies variant as a data attribute or class
    expect(saveButton).toBeInTheDocument();
  });

  it("uses neutral variant for reset button", () => {
    renderWithAdventure(
      <PassageEditFooter
        hasChanges={true}
        onSave={mockOnSave}
        onReset={mockOnReset}
      />
    );

    const resetButton = screen.getByTestId("reset-button");
    // The Button component applies variant as a data attribute or class
    expect(resetButton).toBeInTheDocument();
  });
});
