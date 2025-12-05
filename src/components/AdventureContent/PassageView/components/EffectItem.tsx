import { Trash2 } from "lucide-react";
import { Select } from "@/components/common/Select/Select";
import type { EffectData } from "../usePassageEditState";
import { EffectRow, EffectControls, RemoveButton } from "./EffectItem.styles";

interface EffectItemProps {
  effect: EffectData;
  index: number;
  itemOptions: Array<{ value: string; label: string }>;
  onTypeChange: (index: number, value: string) => void;
  onItemChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  effectRef?: (el: HTMLSelectElement | null) => void;
}

export const EffectItem = ({
  effect,
  index,
  itemOptions,
  onTypeChange,
  onItemChange,
  onRemove,
  effectRef,
}: EffectItemProps) => {
  return (
    <EffectRow>
      <EffectControls>
        <Select
          ref={effectRef}
          id={`effect-type-${index}`}
          label="Effect type"
          options={[
            {
              value: "add_item",
              label: "Add item to inventory",
            },
            {
              value: "remove_item",
              label: "Remove item from inventory",
            },
          ]}
          value={effect.type}
          onChange={(e) => onTypeChange(index, e.target.value)}
          placeholder="Select effect type"
          error={effect.error}
          data-testid={`effect-type-${index}`}
        />
        <Select
          id={`effect-item-${index}`}
          label="Item"
          options={itemOptions}
          value={effect.item}
          onChange={(e) => onItemChange(index, e.target.value)}
          placeholder="Select item"
          data-testid={`effect-item-${index}`}
        />
      </EffectControls>
      <RemoveButton
        onClick={() => onRemove(index)}
        icon={Trash2}
        variant="danger"
        size="small"
        aria-label="Remove effect"
        data-testid={`remove-effect-${index}`}
      />
    </EffectRow>
  );
};
