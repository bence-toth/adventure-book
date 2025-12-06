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

    expect(screen.getByTestId("effect-type-0")).toHaveValue("add_item");
    expect(screen.getByTestId("effect-item-0")).toHaveValue("key");
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

    expect(screen.getByTestId("effect-type-1")).toHaveValue("");
    expect(screen.getByTestId("effect-item-1")).toHaveValue("");
  });

  it("calls onTypeChange when type select changes", () => {
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
    fireEvent.change(typeSelect, { target: { value: "remove_item" } });

    expect(mockOnTypeChange).toHaveBeenCalledWith(0, "remove_item");
  });

  it("calls onItemChange when item select changes", () => {
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
    fireEvent.change(itemSelect, { target: { value: "sword" } });

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

  it("passes ref to type select", () => {
    const effect: EffectData = { type: "add_item", item: "key" };
    const mockRef = vi.fn();

    renderWithAdventure(
      <EffectItem
        effect={effect}
        index={0}
        itemOptions={mockItemOptions}
        onTypeChange={mockOnTypeChange}
        onItemChange={mockOnItemChange}
        onRemove={mockOnRemove}
        effectRef={mockRef}
      />
    );

    expect(mockRef).toHaveBeenCalled();
  });

  it("renders correct effect type options", () => {
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

    // Check that options exist by verifying the select can be changed to these values
    fireEvent.change(typeSelect, { target: { value: "add_item" } });
    expect(mockOnTypeChange).toHaveBeenCalledWith(0, "add_item");

    fireEvent.change(typeSelect, { target: { value: "remove_item" } });
    expect(mockOnTypeChange).toHaveBeenCalledWith(0, "remove_item");
  });
});
