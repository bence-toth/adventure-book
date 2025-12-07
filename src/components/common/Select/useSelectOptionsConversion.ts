import { useMemo } from "react";
import type { DropdownOption } from "@/components/common/Dropdown/Dropdown";
import type { SelectOption } from "./useSelectedOption";

/**
 * Converts SelectOption[] to DropdownOption[]
 */
export const useSelectOptionsConversion = (options: SelectOption[]) => {
  const dropdownOptions = useMemo<DropdownOption[]>(
    () =>
      options.map((opt) => ({
        value: opt.value,
        label: opt.label,
        icon: opt.icon,
        variant: opt.variant,
      })),
    [options]
  );

  return { dropdownOptions };
};
