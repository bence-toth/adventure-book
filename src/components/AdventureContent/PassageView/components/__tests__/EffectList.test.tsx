import { screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { EffectList } from "../EffectList";
import { renderWithAdventure } from "@/__tests__/testUtils";
import type { EffectData } from "../../usePassageEditState";

describe("EffectList", () => {
  const mockItemOptions = [
    { value: "key", label: "Key" },
    { value: "sword", label: "Sword" },
    { value: "map", label: "Map" },
  ];

  const mockOnAddEffect = vi.fn();
  const mockOnRemoveEffect = vi.fn();
  const mockOnEffectTypeChange = vi.fn();
  const mockOnEffectItemChange = vi.fn();

  const effectRefs = { current: [] as (HTMLSelectElement | null)[] };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders section title", () => {
    renderWithAdventure(
      <EffectList
        effects={[]}
        itemOptions={mockItemOptions}
        effectRefs={effectRefs}
        onAddEffect={mockOnAddEffect}
        onRemoveEffect={mockOnRemoveEffect}
        onEffectTypeChange={mockOnEffectTypeChange}
        onEffectItemChange={mockOnEffectItemChange}
      />
    );

    expect(screen.getByText("Effects")).toBeInTheDocument();
  });

  it("renders add effect button", () => {
    renderWithAdventure(
      <EffectList
        effects={[]}
        itemOptions={mockItemOptions}
        effectRefs={effectRefs}
        onAddEffect={mockOnAddEffect}
        onRemoveEffect={mockOnRemoveEffect}
        onEffectTypeChange={mockOnEffectTypeChange}
        onEffectItemChange={mockOnEffectItemChange}
      />
    );

    expect(screen.getByTestId("add-effect-button")).toBeInTheDocument();
    expect(screen.getByText("Add effect")).toBeInTheDocument();
  });

  it("renders effects when provided", () => {
    const effects: EffectData[] = [
      { type: "add_item", item: "key" },
      { type: "remove_item", item: "sword" },
    ];

    renderWithAdventure(
      <EffectList
        effects={effects}
        itemOptions={mockItemOptions}
        effectRefs={effectRefs}
        onAddEffect={mockOnAddEffect}
        onRemoveEffect={mockOnRemoveEffect}
        onEffectTypeChange={mockOnEffectTypeChange}
        onEffectItemChange={mockOnEffectItemChange}
      />
    );

    expect(screen.getByTestId("effect-type-0")).toHaveValue("add_item");
    expect(screen.getByTestId("effect-item-0")).toHaveValue("key");
    expect(screen.getByTestId("effect-type-1")).toHaveValue("remove_item");
    expect(screen.getByTestId("effect-item-1")).toHaveValue("sword");
  });

  it("displays effects error when provided", () => {
    renderWithAdventure(
      <EffectList
        effects={[]}
        effectsError="Effects validation error"
        itemOptions={mockItemOptions}
        effectRefs={effectRefs}
        onAddEffect={mockOnAddEffect}
        onRemoveEffect={mockOnRemoveEffect}
        onEffectTypeChange={mockOnEffectTypeChange}
        onEffectItemChange={mockOnEffectItemChange}
      />
    );

    expect(screen.getByText("Effects validation error")).toBeInTheDocument();
  });

  it("calls onAddEffect when add button is clicked", () => {
    renderWithAdventure(
      <EffectList
        effects={[]}
        itemOptions={mockItemOptions}
        effectRefs={effectRefs}
        onAddEffect={mockOnAddEffect}
        onRemoveEffect={mockOnRemoveEffect}
        onEffectTypeChange={mockOnEffectTypeChange}
        onEffectItemChange={mockOnEffectItemChange}
      />
    );

    const addButton = screen.getByTestId("add-effect-button");
    fireEvent.click(addButton);

    expect(mockOnAddEffect).toHaveBeenCalledTimes(1);
  });

  it("passes handlers to EffectItem components", () => {
    const effects: EffectData[] = [{ type: "add_item", item: "key" }];

    renderWithAdventure(
      <EffectList
        effects={effects}
        itemOptions={mockItemOptions}
        effectRefs={effectRefs}
        onAddEffect={mockOnAddEffect}
        onRemoveEffect={mockOnRemoveEffect}
        onEffectTypeChange={mockOnEffectTypeChange}
        onEffectItemChange={mockOnEffectItemChange}
      />
    );

    // Test type change
    const typeSelect = screen.getByTestId("effect-type-0");
    fireEvent.change(typeSelect, { target: { value: "remove_item" } });
    expect(mockOnEffectTypeChange).toHaveBeenCalledWith(0, "remove_item");

    // Test item change
    const itemSelect = screen.getByTestId("effect-item-0");
    fireEvent.change(itemSelect, { target: { value: "sword" } });
    expect(mockOnEffectItemChange).toHaveBeenCalledWith(0, "sword");

    // Test remove
    const removeButton = screen.getByTestId("remove-effect-0");
    fireEvent.click(removeButton);
    expect(mockOnRemoveEffect).toHaveBeenCalledWith(0);
  });

  it("renders multiple effects correctly", () => {
    const effects: EffectData[] = [
      { type: "add_item", item: "key" },
      { type: "remove_item", item: "sword" },
      { type: "add_item", item: "map" },
    ];

    renderWithAdventure(
      <EffectList
        effects={effects}
        itemOptions={mockItemOptions}
        effectRefs={effectRefs}
        onAddEffect={mockOnAddEffect}
        onRemoveEffect={mockOnRemoveEffect}
        onEffectTypeChange={mockOnEffectTypeChange}
        onEffectItemChange={mockOnEffectItemChange}
      />
    );

    expect(screen.getByTestId("effect-type-0")).toBeInTheDocument();
    expect(screen.getByTestId("effect-type-1")).toBeInTheDocument();
    expect(screen.getByTestId("effect-type-2")).toBeInTheDocument();
    expect(screen.getByTestId("remove-effect-0")).toBeInTheDocument();
    expect(screen.getByTestId("remove-effect-1")).toBeInTheDocument();
    expect(screen.getByTestId("remove-effect-2")).toBeInTheDocument();
  });
});
