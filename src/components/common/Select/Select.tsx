import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronDown } from "lucide-react";
import { Dropdown } from "@/components/common/Dropdown/Dropdown";
import {
  SelectContainer,
  Label,
  SelectButton,
  SelectItemIcon,
  ErrorMessage,
  ChevronIcon,
} from "./Select.styles";
import { useSelectedOption, type SelectOption } from "./useSelectedOption";
import { useSelectKeyboardNavigation } from "./useSelectKeyboardNavigation";
import { useSelectActiveIndex } from "./useSelectActiveIndex";
import { useSelectOptionsConversion } from "./useSelectOptionsConversion";

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
  const [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { selectedOption, selectedLabel } = useSelectedOption({
    options,
    value,
    placeholder,
  });

  const { activeIndex, setActiveIndex } = useSelectActiveIndex({
    isOpen,
    options,
    value,
  });

  const { dropdownOptions } = useSelectOptionsConversion(options);

  const selectId = useMemo(
    () => id || `select-${label.toLowerCase().replace(/\s+/g, "-")}`,
    [id, label]
  );

  const errorId = useMemo(
    () => (error ? `${selectId}-error` : undefined),
    [error, selectId]
  );

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

  const getOptionValue = useCallback(
    (index: number) => options[index]?.value,
    [options]
  );

  const { handleButtonKeyDown, handleDropdownKeyDown } =
    useSelectKeyboardNavigation({
      isOpen,
      activeIndex,
      optionsLength: options.length,
      onSelect: handleSelect,
      onOpenChange: setIsOpen,
      setActiveIndex,
      getOptionValue,
    });

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
        shouldMatchTriggerWidth={true}
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
