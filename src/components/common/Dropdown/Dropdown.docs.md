# Dropdown Component

A flexible, low-level dropdown component with positioning, keyboard navigation, and accessibility support. Used as the foundation for Select and ContextMenu components.

## Features

- **Floating Positioning**: Automatic positioning using Floating UI
- **Keyboard Navigation**: Full arrow key, Home/End, and type-ahead support
- **Portal Rendering**: Renders in a portal to avoid z-index issues
- **Focus Management**: Automatic focus handling and trapping
- **Custom Rendering**: Support for custom option rendering
- **Multiple Roles**: Can be used as listbox or menu
- **Width Matching**: Optional width matching with trigger element

## Props

| Prop                      | Type                                                 | Default          | Description                          |
| ------------------------- | ---------------------------------------------------- | ---------------- | ------------------------------------ |
| `isOpen`                  | `boolean`                                            | **Required**     | Controls dropdown visibility         |
| `onOpenChange`            | `(isOpen: boolean) => void`                          | **Required**     | Callback when dropdown state changes |
| `triggerRef`              | `HTMLElement \| null`                                | **Required**     | Reference to trigger element         |
| `options`                 | `DropdownOption[]`                                   | **Required**     | Array of dropdown options            |
| `onSelect`                | `(value: string) => void`                            | **Required**     | Callback when option is selected     |
| `selectedValue`           | `string`                                             | -                | Currently selected option value      |
| `placement`               | `Placement`                                          | `"bottom-start"` | Position relative to trigger         |
| `shouldMatchTriggerWidth` | `boolean`                                            | `true`           | Match trigger element width          |
| `role`                    | `"listbox" \| "menu"`                                | `"listbox"`      | ARIA role for dropdown               |
| `activeIndex`             | `number \| null`                                     | **Required**     | Currently focused option index       |
| `onActiveIndexChange`     | `(index: number \| null) => void`                    | **Required**     | Callback when active index changes   |
| `listRef`                 | `React.MutableRefObject<Array<HTMLElement \| null>>` | **Required**     | Ref array for option elements        |
| `onKeyDown`               | `(event: React.KeyboardEvent) => void`               | -                | Custom keyboard handler              |
| `shouldCloseOnScroll`     | `boolean`                                            | `true`           | Close dropdown on scroll             |
| `children`                | Render function                                      | -                | Custom render for options            |
| `id`                      | `string`                                             | -                | ID for dropdown container            |
| `data-testid`             | `string`                                             | -                | Test identifier                      |
| `optionsTestIdPrefix`     | `string`                                             | -                | Prefix for option test IDs           |

## DropdownOption Interface

```typescript
interface DropdownOption {
  value: string; // Unique option identifier
  label: string; // Display text
  icon?: ComponentType; // Optional Lucide icon
  variant?: "default" | "danger"; // Visual style
  testId?: string; // Test identifier
}
```

## Usage Examples

### Basic Dropdown (typically wrapped by another component, e.g. Select or ContextMenu)

```tsx
import { useState, useRef } from "react";
import { Dropdown } from "@/components/common/Dropdown/Dropdown";

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);

  const options = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  const handleSelect = (value: string) => {
    console.log("Selected:", value);
    setIsOpen(false);
  };

  return (
    <>
      <button ref={setTriggerRef} onClick={() => setIsOpen(!isOpen)}>
        Open Dropdown
      </button>

      <Dropdown
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        triggerRef={triggerRef}
        options={options}
        onSelect={handleSelect}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        listRef={listRef}
      />
    </>
  );
};
```

### With Icons and Variants

```tsx
import { Save, Download, Trash } from "lucide-react";

const options = [
  { value: "save", label: "Save", icon: Save },
  { value: "download", label: "Download", icon: Download },
  { value: "delete", label: "Delete", icon: Trash, variant: "danger" as const },
];

<Dropdown
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  triggerRef={triggerRef}
  options={options}
  onSelect={handleSelect}
  activeIndex={activeIndex}
  onActiveIndexChange={setActiveIndex}
  listRef={listRef}
/>;
```

### Custom Option Rendering

```tsx
<Dropdown
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  triggerRef={triggerRef}
  options={options}
  onSelect={handleSelect}
  activeIndex={activeIndex}
  onActiveIndexChange={setActiveIndex}
  listRef={listRef}
>
  {({ option, index, isActive, isSelected, getItemProps, handleSelect }) => (
    <div {...getItemProps({ onClick: () => handleSelect(option.value) })}>
      <strong>{option.label}</strong>
      <small>{option.value}</small>
    </div>
  )}
</Dropdown>
```

### As Menu (instead of listbox)

```tsx
<Dropdown
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  triggerRef={triggerRef}
  options={options}
  onSelect={handleSelect}
  role="menu" // Changes to menu semantics
  activeIndex={activeIndex}
  onActiveIndexChange={setActiveIndex}
  listRef={listRef}
/>
```

## Keyboard Navigation

| Key               | Action                        |
| ----------------- | ----------------------------- |
| `ArrowDown`       | Move to next option           |
| `ArrowUp`         | Move to previous option       |
| `Home`            | Jump to first option          |
| `End`             | Jump to last option           |
| `Enter` / `Space` | Select focused option         |
| `Escape`          | Close dropdown                |
| `Tab`             | Close and move focus forward  |
| `Shift+Tab`       | Close and move focus backward |

## Placement Options

The `placement` prop accepts Floating UI placement values:

- **Bottom**: `"bottom-start"`, `"bottom"`, `"bottom-end"`
- **Top**: `"top-start"`, `"top"`, `"top-end"`
- **Right**: `"right-start"`, `"right"`, `"right-end"`
- **Left**: `"left-start"`, `"left"`, `"left-end"`

Floating UI automatically adjusts position if there's insufficient space.

## Accessibility

- Uses `role="listbox"` or `role="menu"` depending on context
- Options have `role="option"` or `role="menuitem"`
- Proper ARIA attributes (`aria-selected`, `aria-activedescendant`)
- Focus management with `FloatingFocusManager`
- Keyboard navigation follows WAI-ARIA patterns
- Screen reader announcements for state changes

## Implementation Details

### Floating UI Integration

Uses `@floating-ui/react` for:

- Automatic positioning and collision detection
- Portal rendering for z-index management
- Focus trapping and restoration
- Dismiss interactions (click outside, escape)

### State Management

Requires external state management for:

- `isOpen`: Visibility state
- `activeIndex`: Currently focused option
- `listRef`: Array of option element refs

This allows parent components (Select, ContextMenu) to control behavior.

### Scroll Behavior

- `shouldCloseOnScroll={true}`: Closes when any scroll occurs
- `shouldCloseOnScroll={false}`: Remains open during scroll (useful for scrollable containers)

## Best Practices

1. **Typically Wrapped**: Use Select or ContextMenu instead of Dropdown directly
2. **Required State**: Manage `isOpen`, `activeIndex`, and `listRef` in parent
3. **Unique Values**: Ensure option values are unique
4. **Descriptive Labels**: Use clear, concise option labels
5. **Icon Consistency**: Either use icons for all options or none
6. **Test IDs**: Provide `optionsTestIdPrefix` for easier testing
