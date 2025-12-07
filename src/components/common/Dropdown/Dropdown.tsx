import type { ReactNode } from "react";
import { createElement, useCallback, useEffect } from "react";
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
  FloatingFocusManager,
  FloatingPortal,
  type Placement,
} from "@floating-ui/react";
import {
  DropdownContainer,
  DropdownItem,
  DropdownItemIcon,
} from "./Dropdown.styles";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ComponentType<Record<string, unknown>>;
  variant?: "default" | "danger";
  testId?: string;
}

interface DropdownProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  triggerRef: HTMLElement | null;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  selectedValue?: string;
  placement?: Placement;
  matchTriggerWidth?: boolean;
  role?: "listbox" | "menu";
  activeIndex: number | null;
  onActiveIndexChange: (index: number | null) => void;
  listRef: React.MutableRefObject<Array<HTMLElement | null>>;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  closeOnScroll?: boolean;
  children?: (renderProps: {
    option: DropdownOption;
    index: number;
    isActive: boolean;
    isSelected: boolean;
    getItemProps: ReturnType<typeof useInteractions>["getItemProps"];
    handleSelect: (value: string) => void;
  }) => ReactNode;
  id?: string;
  "data-testid"?: string;
  optionsTestIdPrefix?: string; // For generating option testIds
}

export const Dropdown = ({
  isOpen,
  onOpenChange,
  triggerRef,
  options,
  onSelect,
  selectedValue,
  placement = "bottom-start",
  matchTriggerWidth = true,
  role: dropdownRole = "listbox",
  activeIndex,
  onActiveIndexChange,
  listRef,
  onKeyDown,
  closeOnScroll = true,
  children,
  id,
  "data-testid": testId,
  optionsTestIdPrefix,
}: DropdownProps) => {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange,
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      ...(matchTriggerWidth
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

  // Close dropdown when trigger scrolls out of view
  useEffect(() => {
    if (!isOpen || !refs.reference.current || !closeOnScroll) return;

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
  }, [isOpen, onOpenChange, refs, closeOnScroll]);

  // Focus the active item when activeIndex changes
  useEffect(() => {
    if (isOpen && activeIndex !== null && listRef.current[activeIndex]) {
      listRef.current[activeIndex]?.focus();
    }
  }, [isOpen, activeIndex, listRef]);

  const handleSelect = useCallback(
    (value: string) => {
      onSelect(value);
      onOpenChange(false);
    },
    [onSelect, onOpenChange]
  );

  if (!isOpen) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false}>
        <DropdownContainer
          // Callback ref to set the floating element, safe to use in render
          // eslint-disable-next-line react-hooks/refs
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps({
            onKeyDown,
          })}
          id={id}
          data-testid={testId}
        >
          {options.map((option, index) => {
            const isActive = activeIndex === index;
            const isSelected = option.value === selectedValue;

            // Allow custom rendering if children function is provided
            if (children) {
              return children({
                option,
                index,
                isActive,
                isSelected,
                getItemProps,
                handleSelect,
              });
            }

            // Default rendering
            const iconElement = option.icon
              ? createElement(option.icon, {
                  size: 16,
                  strokeWidth: 2,
                  "aria-hidden": true,
                })
              : null;

            return (
              <DropdownItem
                key={option.value}
                ref={(node) => {
                  listRef.current[index] = node;
                }}
                role="option"
                tabIndex={isActive ? 0 : -1}
                aria-selected={isSelected}
                $variant={option.variant || "default"}
                $isActive={isActive}
                $isSelected={isSelected}
                data-testid={
                  option.testId ||
                  `${optionsTestIdPrefix || testId}-option-${option.value}`
                }
                {...getItemProps({
                  onClick: () => handleSelect(option.value),
                })}
              >
                {iconElement && (
                  <DropdownItemIcon>{iconElement}</DropdownItemIcon>
                )}
                {option.label}
              </DropdownItem>
            );
          })}
        </DropdownContainer>
      </FloatingFocusManager>
    </FloatingPortal>
  );
};

Dropdown.displayName = "Dropdown";
