import { useMemo } from "react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ComponentType<Record<string, unknown>>;
  variant?: "default" | "danger";
}

interface UseSelectedOptionProps {
  options: SelectOption[];
  value?: string;
  placeholder: string;
}

/**
 * Manages the selected option display logic
 */
export const useSelectedOption = ({
  options,
  value,
  placeholder,
}: UseSelectedOptionProps) => {
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const selectedLabel = useMemo(
    () => selectedOption?.label || placeholder,
    [selectedOption, placeholder]
  );

  return { selectedOption, selectedLabel };
};
