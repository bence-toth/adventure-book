import { useMemo, useEffect, useState } from "react";

interface UseSelectActiveIndexProps {
  isOpen: boolean;
  options: Array<{ value: string }>;
  value?: string;
}

/**
 * Manages the active index state for the dropdown
 */
export const useSelectActiveIndex = ({
  isOpen,
  options,
  value,
}: UseSelectActiveIndexProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Compute active index based on whether dropdown is open
  const computedActiveIndex = useMemo(() => {
    if (!isOpen) return null;
    const selectedIndex = options.findIndex((opt) => opt.value === value);
    return selectedIndex !== -1 ? selectedIndex : null;
  }, [isOpen, options, value]);

  // Update active index when computed value changes
  useEffect(() => {
    setActiveIndex(computedActiveIndex);
  }, [computedActiveIndex]);

  return { activeIndex, setActiveIndex };
};
