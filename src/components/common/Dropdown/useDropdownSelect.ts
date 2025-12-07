import { useCallback } from "react";

interface UseDropdownSelectProps {
  onSelect: (value: string) => void;
  onOpenChange: (isOpen: boolean) => void;
}

/**
 * Handles dropdown option selection and auto-close behavior
 */
export const useDropdownSelect = ({
  onSelect,
  onOpenChange,
}: UseDropdownSelectProps) => {
  const handleSelect = useCallback(
    (value: string) => {
      onSelect(value);
      onOpenChange(false);
    },
    [onSelect, onOpenChange]
  );

  return { handleSelect };
};
