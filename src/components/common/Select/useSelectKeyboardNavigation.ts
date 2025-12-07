import { useCallback } from "react";

interface UseSelectKeyboardNavigationProps {
  isOpen: boolean;
  activeIndex: number | null;
  optionsLength: number;
  onSelect: (value: string) => void;
  onOpenChange: (isOpen: boolean) => void;
  setActiveIndex: (
    value: number | null | ((prev: number | null) => number | null)
  ) => void;
  getOptionValue: (index: number) => string | undefined;
}

/**
 * Handles keyboard navigation for the Select button and dropdown
 */
export const useSelectKeyboardNavigation = ({
  isOpen,
  activeIndex,
  optionsLength,
  onSelect,
  onOpenChange,
  setActiveIndex,
  getOptionValue,
}: UseSelectKeyboardNavigationProps) => {
  const handleButtonKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Only handle keyboard when dropdown is closed - let floating-ui handle when open
      if (!isOpen && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onOpenChange(true);
      }
    },
    [isOpen, onOpenChange]
  );

  const handleDropdownKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Handle Tab navigation
      if (event.key === "Tab") {
        event.preventDefault();
        setActiveIndex((prev) => {
          if (event.shiftKey) {
            // Shift+Tab: Move to previous item
            if (prev === null || prev === 0) {
              return optionsLength - 1; // Loop to last
            }
            return prev - 1;
          } else {
            // Tab: Move to next item
            if (prev === null) {
              return 0; // Start at first
            }
            if (prev === optionsLength - 1) {
              return 0; // Loop to first
            }
            return prev + 1;
          }
        });
        return;
      }

      // Handle selection when dropdown is open
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (activeIndex !== null) {
          const optionValue = getOptionValue(activeIndex);
          if (optionValue) {
            onSelect(optionValue);
            onOpenChange(false);
          }
        }
      }
    },
    [
      activeIndex,
      optionsLength,
      onSelect,
      onOpenChange,
      setActiveIndex,
      getOptionValue,
    ]
  );

  return { handleButtonKeyDown, handleDropdownKeyDown };
};
