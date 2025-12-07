import { useEffect } from "react";

interface UseDropdownFocusProps {
  isOpen: boolean;
  activeIndex: number | null;
  listRef: React.MutableRefObject<Array<HTMLElement | null>>;
}

/**
 * Focuses the active dropdown item when activeIndex changes
 */
export const useDropdownFocus = ({
  isOpen,
  activeIndex,
  listRef,
}: UseDropdownFocusProps) => {
  useEffect(() => {
    if (isOpen && activeIndex !== null && listRef.current[activeIndex]) {
      listRef.current[activeIndex]?.focus();
    }
  }, [isOpen, activeIndex, listRef]);
};
