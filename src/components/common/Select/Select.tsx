import type { ComponentType } from "react";
import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Dropdown,
  type DropdownOption,
} from "@/components/common/Dropdown/Dropdown";
import {
  SelectContainer,
  Label,
  SelectButton,
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
  const [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const selectedLabel = selectedOption?.label || placeholder;

  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const errorId = error ? `${selectId}-error` : undefined;

  // Compute active index based on whether dropdown is open
  const computedActiveIndex = isOpen
    ? (() => {
        const selectedIndex = options.findIndex((opt) => opt.value === value);
        return selectedIndex !== -1 ? selectedIndex : null;
      })()
    : null;

  // Update active index when computed value changes
  useEffect(() => {
    setActiveIndex(computedActiveIndex);
  }, [computedActiveIndex]);

  // Return focus to button when dropdown closes, but prevent scroll
  useEffect(() => {
    if (!isOpen) {
      buttonRef.current?.focus({ preventScroll: true });
    }
  }, [isOpen]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange?.(optionValue);
    },
    [onChange]
  );

  const handleButtonClick = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  }, [disabled, isOpen]);

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
          setIsOpen(false);
        }
      }
    },
    [activeIndex, options, handleSelect]
  );

  // Convert SelectOption[] to DropdownOption[]
  const dropdownOptions: DropdownOption[] = options.map((opt) => ({
    value: opt.value,
    label: opt.label,
    icon: opt.icon,
    variant: opt.variant,
  }));

  return (
    <SelectContainer className={className}>
      <Label htmlFor={selectId}>{label}</Label>
      <SelectButton
        ref={(node) => {
          buttonRef.current = node;
          setTriggerRef(node);
        }}
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
        onClick={handleButtonClick}
        onKeyDown={handleButtonKeyDown}
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

      <Dropdown
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        triggerRef={triggerRef}
        options={dropdownOptions}
        onSelect={handleSelect}
        selectedValue={value}
        placement="bottom-start"
        matchTriggerWidth={true}
        role="listbox"
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        listRef={listRef}
        onKeyDown={handleDropdownKeyDown}
        id={`${selectId}-listbox`}
        data-testid={`${testId}-dropdown`}
        optionsTestIdPrefix={testId}
      />

      {error && (
        <ErrorMessage id={errorId} role="alert">
          {error}
        </ErrorMessage>
      )}
    </SelectContainer>
  );
};

Select.displayName = "Select";
