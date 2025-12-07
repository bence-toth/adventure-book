import { useEffect } from "react";
import type { ReferenceType } from "@floating-ui/react";

interface UseDropdownScrollCloseProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  refs: {
    reference: React.MutableRefObject<ReferenceType | null>;
  };
  shouldCloseOnScroll?: boolean;
}

/**
 * Closes the dropdown when the trigger element scrolls out of view
 */
export const useDropdownScrollClose = ({
  isOpen,
  onOpenChange,
  refs,
  shouldCloseOnScroll = true,
}: UseDropdownScrollCloseProps) => {
  useEffect(() => {
    if (!isOpen || !refs.reference.current || !shouldCloseOnScroll) return;

    const referenceElement = refs.reference.current;

    // Only works with real DOM elements, not virtual elements
    if (!("parentElement" in referenceElement)) return;

    const checkVisibility = () => {
      const rect = referenceElement.getBoundingClientRect();

      // Skip check in test environment where getBoundingClientRect returns zeros
      if (rect.width === 0 && rect.height === 0) return;

      // Check if element is completely out of view
      const isCompletelyOutOfView =
        rect.bottom < 0 || // Scrolled above viewport
        rect.top > window.innerHeight || // Scrolled below viewport
        rect.right < 0 || // Scrolled left of viewport
        rect.left > window.innerWidth; // Scrolled right of viewport

      if (isCompletelyOutOfView) {
        onOpenChange(false);
      }
    };

    const handleScroll = () => {
      checkVisibility();
    };

    // Add scroll listeners to all scrollable ancestors
    let element = referenceElement.parentElement;
    const scrollElements: Element[] = [];

    while (element) {
      const style = window.getComputedStyle(element);
      const isScrollable =
        style.overflow === "auto" ||
        style.overflow === "scroll" ||
        style.overflowY === "auto" ||
        style.overflowY === "scroll";

      if (isScrollable) {
        scrollElements.push(element);
        element.addEventListener("scroll", handleScroll);
      }
      element = element.parentElement;
    }

    // Also listen to window scroll
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      scrollElements.forEach((el) => {
        el.removeEventListener("scroll", handleScroll);
      });
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, onOpenChange, refs, shouldCloseOnScroll]);
};
