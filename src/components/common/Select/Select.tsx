import type { ComponentType } from "react";
import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
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
} from "@floating-ui/react";
import {
  SelectContainer,
  Label,
  SelectButton,
  SelectDropdown,
  SelectItem,
  SelectItemIcon,
  ErrorMessage,
  ChevronIcon,
} from "./Select.styles";

interface SelectOption {
  value: string;
  label: string;
  icon?: ComponentType<Record<string, unknown>>;
  variant?: "default" | "danger";
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  "data-testid"?: string;
}

export const Select = ({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = "Select an option",
  disabled = false,
  id,
  className,
  "data-testid": testId,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);

  const selectedOption = options.find((opt) => opt.value === value);
  const selectedLabel = selectedOption?.label || placeholder;

  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const errorId = error ? `${selectId}-error` : undefined;

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, dismiss, role, listNavigation]
  );

  // Close dropdown when select button scrolls out of view
  useEffect(() => {
    if (!isOpen || !refs.reference.current) return;

    const referenceElement = refs.reference.current;

    // Only works with real DOM elements, not virtual elements
    if (!("parentElement" in referenceElement)) return;

    const checkVisibility = () => {
      const rect = referenceElement.getBoundingClientRect();

      // Skip check in test environment where getBoundingClientRect returns zeros
      if (rect.width === 0 && rect.height === 0) return;

      const isVisible =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth;

      if (!isVisible) {
        setIsOpen(false);
      }
    };

    // Check on scroll events
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
  }, [isOpen, refs.reference]); // Set active index to selected item when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const selectedIndex = options.findIndex((opt) => opt.value === value);
      if (selectedIndex !== -1) {
        setActiveIndex(selectedIndex);
      } else {
        setActiveIndex(null);
      }
    }
  }, [isOpen, options, value]);

  // Focus the active item when activeIndex changes
  useEffect(() => {
    if (isOpen && activeIndex !== null && listRef.current[activeIndex]) {
      listRef.current[activeIndex]?.focus();
    }
  }, [isOpen, activeIndex]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
    },
    [onChange]
  );

  const handleButtonKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Only handle keyboard when dropdown is closed - let floating-ui handle when open
      if (!isOpen && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        setIsOpen(true);
      }
    },
    [isOpen]
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
              return options.length - 1; // Loop to last
            }
            return prev - 1;
          } else {
            // Tab: Move to next item
            if (prev === null) {
              return 0; // Start at first
            }
            if (prev === options.length - 1) {
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
        if (activeIndex !== null && options[activeIndex]) {
          handleSelect(options[activeIndex].value);
        }
      }
    },
    [activeIndex, options, handleSelect]
  );

  return (
    <SelectContainer className={className}>
      <Label htmlFor={selectId}>{label}</Label>
      <SelectButton
        ref={refs.setReference}
        id={selectId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? `${selectId}-listbox` : undefined}
        aria-invalid={!!error}
        aria-describedby={errorId}
        disabled={disabled}
        $hasError={!!error}
        $isOpen={isOpen}
        data-testid={testId}
        {...getReferenceProps({
          onKeyDown: handleButtonKeyDown,
        })}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-1)",
            flex: 1,
            minWidth: 0,
          }}
        >
          {selectedOption?.icon && (
            <SelectItemIcon>
              {createElement(selectedOption.icon, {
                size: 16,
                strokeWidth: 2,
                "aria-hidden": true,
              })}
            </SelectItemIcon>
          )}
          <span style={{ flex: 1, minWidth: 0 }}>{selectedLabel}</span>
        </span>
        <ChevronIcon $isOpen={isOpen}>
          <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
        </ChevronIcon>
      </SelectButton>

      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <SelectDropdown
              // Callback ref to set the floating element, safe to use in render
              // eslint-disable-next-line react-hooks/refs
              ref={refs.setFloating}
              id={`${selectId}-listbox`}
              style={floatingStyles}
              data-testid={`${testId}-dropdown`}
              {...getFloatingProps({
                onKeyDown: handleDropdownKeyDown,
              })}
            >
              {options.map((option, index) => {
                const isActive = activeIndex === index;
                const isSelected = option.value === value;
                const iconElement = option.icon
                  ? createElement(option.icon, {
                      size: 16,
                      strokeWidth: 2,
                      "aria-hidden": true,
                    })
                  : null;

                return (
                  <SelectItem
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
                    data-testid={`${testId}-option-${option.value}`}
                    {...getItemProps({
                      onClick: () => handleSelect(option.value),
                    })}
                  >
                    {iconElement && (
                      <SelectItemIcon>{iconElement}</SelectItemIcon>
                    )}
                    {option.label}
                  </SelectItem>
                );
              })}
            </SelectDropdown>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
      {error && (
        <ErrorMessage id={errorId} role="alert">
          {error}
        </ErrorMessage>
      )}
    </SelectContainer>
  );
};

Select.displayName = "Select";
