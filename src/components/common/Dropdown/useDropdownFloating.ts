import { useEffect } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useListNavigation,
  type Placement,
} from "@floating-ui/react";

interface UseDropdownFloatingProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  triggerRef: HTMLElement | null;
  placement?: Placement;
  shouldMatchTriggerWidth?: boolean;
  role?: "listbox" | "menu";
  activeIndex: number | null;
  onActiveIndexChange: (index: number | null) => void;
  listRef: React.MutableRefObject<Array<HTMLElement | null>>;
}

/**
 * Manages floating-UI setup, positioning, and interactions for the dropdown
 */
export const useDropdownFloating = ({
  isOpen,
  onOpenChange,
  triggerRef,
  placement = "bottom-start",
  shouldMatchTriggerWidth = true,
  role: dropdownRole = "listbox",
  activeIndex,
  onActiveIndexChange,
  listRef,
}: UseDropdownFloatingProps) => {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange,
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      ...(shouldMatchTriggerWidth
        ? [
            size({
              apply({ rects, elements }) {
                Object.assign(elements.floating.style, {
                  width: `${rects.reference.width}px`,
                });
              },
            }),
          ]
        : []),
    ],
    whileElementsMounted: autoUpdate,
    placement,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const roleInteraction = useRole(context, { role: dropdownRole });
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: onActiveIndexChange,
    virtual: true,
    loop: true,
  });

  const { getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    roleInteraction,
    listNavigation,
  ]);

  // Sync the floating-ui reference element when the trigger element changes
  useEffect(() => {
    if (triggerRef) {
      refs.setReference(triggerRef);
    }
  }, [triggerRef, refs]);

  return {
    refs,
    floatingStyles,
    context,
    getFloatingProps,
    getItemProps,
  };
};
