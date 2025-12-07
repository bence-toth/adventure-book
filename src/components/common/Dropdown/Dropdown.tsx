import type { ReactNode } from "react";
import { createElement } from "react";
import {
  FloatingFocusManager,
  FloatingPortal,
  useInteractions,
} from "@floating-ui/react";
import type { Placement } from "@floating-ui/react";
import {
  DropdownContainer,
  DropdownItem,
  DropdownItemIcon,
} from "./Dropdown.styles";
import { useDropdownFloating } from "./useDropdownFloating";
import { useDropdownScrollClose } from "./useDropdownScrollClose";
import { useDropdownFocus } from "./useDropdownFocus";
import { useDropdownSelect } from "./useDropdownSelect";

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
  shouldMatchTriggerWidth?: boolean;
  role?: "listbox" | "menu";
  activeIndex: number | null;
  onActiveIndexChange: (index: number | null) => void;
  listRef: React.MutableRefObject<Array<HTMLElement | null>>;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  shouldCloseOnScroll?: boolean;
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
  shouldMatchTriggerWidth = true,
  role: dropdownRole = "listbox",
  activeIndex,
  onActiveIndexChange,
  listRef,
  onKeyDown,
  shouldCloseOnScroll = true,
  children,
  id,
  "data-testid": testId,
  optionsTestIdPrefix,
}: DropdownProps) => {
  const { refs, floatingStyles, context, getFloatingProps, getItemProps } =
    useDropdownFloating({
      isOpen,
      onOpenChange,
      triggerRef,
      placement,
      shouldMatchTriggerWidth,
      role: dropdownRole,
      activeIndex,
      onActiveIndexChange,
      listRef,
    });

  useDropdownScrollClose({
    isOpen,
    onOpenChange,
    refs,
    shouldCloseOnScroll,
  });

  useDropdownFocus({
    isOpen,
    activeIndex,
    listRef,
  });

  const { handleSelect } = useDropdownSelect({
    onSelect,
    onOpenChange,
  });

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
