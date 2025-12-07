import { screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { EffectItem } from "../EffectItem";
import { renderWithAdventure } from "@/__tests__/testUtils";
import type { EffectData } from "../../usePassageEditState";

describe("EffectItem", () => {
  const mockItemOptions = [
    { value: "key", label: "Key" },
    { value: "sword", label: "Sword" },
    { value: "map", label: "Map" },
  ];

  const mockOnTypeChange = vi.fn();
  const mockOnItemChange = vi.fn();
  const mockOnRemove = vi.fn();

  it("renders effect type and item selects", () => {
    const effect: EffectData = { type: "add_item", item: "key" };

    renderWithAdventure(
      <EffectItem
        effect={effect}
        index={0}
        itemOptions={mockItemOptions}
        onTypeChange={mockOnTypeChange}
        onItemChange={mockOnItemChange}
        onRemove={mockOnRemove}
      />
    );

    // Custom Select shows selected option text in button
    expect(screen.getByTestId("effect-type-0")).toHaveTextContent(
      "Add item to inventory"
    );
    expect(screen.getByTestId("effect-item-0")).toHaveTextContent("Key");
  });

  it("renders with empty values", () => {
    const effect: EffectData = { type: "", item: "" };

    renderWithAdventure(
      <EffectItem
        effect={effect}
        index={1}
        itemOptions={mockItemOptions}
        onTypeChange={mockOnTypeChange}
        onItemChange={mockOnItemChange}
        onRemove={mockOnRemove}
      />
    );

    // Custom Select shows placeholder when no value selected
    expect(screen.getByTestId("effect-type-1")).toHaveTextContent(
      "Select effect type"
    );
    expect(screen.getByTestId("effect-item-1")).toHaveTextContent(
      "Select item"
    );
  });

  it("calls onTypeChange when type select changes", async () => {
    const effect: EffectData = { type: "add_item", item: "key" };

    renderWithAdventure(
      <EffectItem
        effect={effect}
        index={0}
        itemOptions={mockItemOptions}
        onTypeChange={mockOnTypeChange}
        onItemChange={mockOnItemChange}
        onRemove={mockOnRemove}
      />
    );

    const typeSelect = screen.getByTestId("effect-type-0");
    fireEvent.click(typeSelect);

    // Wait for dropdown to open and click option
    const option = await screen.findByTestId(
      "effect-type-0-option-remove_item"
    );
    fireEvent.click(option);

    expect(mockOnTypeChange).toHaveBeenCalledWith(0, "remove_item");
  });

  it("calls onItemChange when item select changes", async () => {
    const effect: EffectData = { type: "add_item", item: "key" };

    renderWithAdventure(
      <EffectItem
        effect={effect}
        index={0}
        itemOptions={mockItemOptions}
        onTypeChange={mockOnTypeChange}
        onItemChange={mockOnItemChange}
        onRemove={mockOnRemove}
      />
    );

    const itemSelect = screen.getByTestId("effect-item-0");
    fireEvent.click(itemSelect);

    // Wait for dropdown to open and click option
    const option = await screen.findByTestId("effect-item-0-option-sword");
    fireEvent.click(option);

    expect(mockOnItemChange).toHaveBeenCalledWith(0, "sword");
  });

  it("calls onRemove when remove button is clicked", () => {
    const effect: EffectData = { type: "add_item", item: "key" };

    renderWithAdventure(
      <EffectItem
        effect={effect}
        index={0}
        itemOptions={mockItemOptions}
        onTypeChange={mockOnTypeChange}
        onItemChange={mockOnItemChange}
        onRemove={mockOnRemove}
      />
    );

    const removeButton = screen.getByTestId("remove-effect-0");
    fireEvent.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith(0);
  });

  it("displays error when provided", () => {
    const effect: EffectData = {
      type: "",
      item: "",
      error: "Effect type and item must be selected",
    };

    renderWithAdventure(
      <EffectItem
        effect={effect}
        index={0}
        itemOptions={mockItemOptions}
        onTypeChange={mockOnTypeChange}
        onItemChange={mockOnItemChange}
        onRemove={mockOnRemove}
      />
    );

    expect(
      screen.getByText("Effect type and item must be selected")
    ).toBeInTheDocument();
  });

  it("renders correct effect type options", async () => {
    const effect: EffectData = { type: "", item: "" };

    renderWithAdventure(
      <EffectItem
        effect={effect}
        index={0}
        itemOptions={mockItemOptions}
        onTypeChange={mockOnTypeChange}
        onItemChange={mockOnItemChange}
        onRemove={mockOnRemove}
      />
    );

    const typeSelect = screen.getByTestId("effect-type-0");
    expect(typeSelect).toBeInTheDocument();

    // Click to open dropdown
    fireEvent.click(typeSelect);

    // Check that options exist by clicking them
    const addItemOption = await screen.findByTestId(
      "effect-type-0-option-add_item"
    );
    fireEvent.click(addItemOption);
    expect(mockOnTypeChange).toHaveBeenCalledWith(0, "add_item");

    // Open again and click different option
    fireEvent.click(typeSelect);
    const removeItemOption = await screen.findByTestId(
      "effect-type-0-option-remove_item"
    );
    fireEvent.click(removeItemOption);
    expect(mockOnTypeChange).toHaveBeenCalledWith(0, "remove_item");
  });
});
