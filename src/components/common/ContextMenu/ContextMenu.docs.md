# ContextMenu Component

A dropdown menu component for contextual actions, with full keyboard navigation and accessibility support.

## Features

- **Keyboard Navigation**: Arrow keys, Enter, Escape, and Home/End support
- **Multiple Placements**: 8 positioning options relative to trigger element
- **Accessible**: Full ARIA support with proper roles and focus management
- **Icon Support**: Optional icons for menu items
- **Variant Styling**: Default and danger variants for menu items
- **Composition Pattern**: Declarative API using `ContextMenuItem` children

## Components

### ContextMenu

Main container component that manages menu state and positioning.

#### Props

| Prop           | Type                        | Default          | Description                       |
| -------------- | --------------------------- | ---------------- | --------------------------------- |
| `isOpen`       | `boolean`                   | **Required**     | Controls menu visibility          |
| `onOpenChange` | `(isOpen: boolean) => void` | **Required**     | Callback when menu state changes  |
| `triggerRef`   | `HTMLElement \| null`       | **Required**     | Reference to trigger element      |
| `children`     | `ReactNode`                 | **Required**     | `ContextMenuItem` components      |
| `placement`    | `Placement`                 | `"bottom-start"` | Menu position relative to trigger |
| `data-testid`  | `string`                    | `"context-menu"` | Test identifier                   |

**Placement Options:**

- `"top-start"`, `"top-end"`
- `"bottom-start"`, `"bottom-end"`
- `"left-start"`, `"left-end"`
- `"right-start"`, `"right-end"`

### ContextMenuItem

Menu item component that defines individual actions.

#### Props

| Prop          | Type                    | Default      | Description                             |
| ------------- | ----------------------- | ------------ | --------------------------------------- |
| `onClick`     | `() => void`            | **Required** | Action to perform when item is selected |
| `children`    | `ReactNode`             | **Required** | Item label text                         |
| `variant`     | `"default" \| "danger"` | `"default"`  | Visual style                            |
| `icon`        | `ComponentType`         | -            | Lucide icon component                   |
| `data-testid` | `string`                | -            | Test identifier                         |

## Usage Examples

### Basic Context Menu

```tsx
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuItem,
} from "@/components/common/ContextMenu/ContextMenu";
import { MoreVertical, Edit, Trash } from "lucide-react";

const MyComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null);

  return (
    <>
      <button ref={setTriggerRef} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <MoreVertical />
      </button>

      <ContextMenu
        isOpen={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        triggerRef={triggerRef}
      >
        <ContextMenuItem onClick={handleEdit} icon={Edit}>
          Edit
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDelete} icon={Trash} variant="danger">
          Delete
        </ContextMenuItem>
      </ContextMenu>
    </>
  );
};
```

### With Different Placement

```tsx
<ContextMenu
  isOpen={isMenuOpen}
  onOpenChange={setIsMenuOpen}
  triggerRef={triggerRef}
  placement="bottom-end"
>
  <ContextMenuItem onClick={handleAction}>Action</ContextMenuItem>
</ContextMenu>
```

### Multiple Actions

```tsx
<ContextMenu
  isOpen={isMenuOpen}
  onOpenChange={setIsMenuOpen}
  triggerRef={triggerRef}
>
  <ContextMenuItem onClick={handleDuplicate} icon={Copy}>
    Duplicate
  </ContextMenuItem>
  <ContextMenuItem onClick={handleRename} icon={Edit}>
    Rename
  </ContextMenuItem>
  <ContextMenuItem onClick={handleExport} icon={Download}>
    Export
  </ContextMenuItem>
  <ContextMenuItem onClick={handleDelete} icon={Trash} variant="danger">
    Delete
  </ContextMenuItem>
</ContextMenu>
```

## Keyboard Navigation

| Key               | Action                                |
| ----------------- | ------------------------------------- |
| `ArrowDown`       | Move to next item (wraps to first)    |
| `ArrowUp`         | Move to previous item (wraps to last) |
| `Home`            | Jump to first item                    |
| `End`             | Jump to last item                     |
| `Enter` / `Space` | Activate focused item                 |
| `Escape`          | Close menu                            |

## Accessibility

- Uses `role="menu"` and `role="menuitem"` for proper semantics
- Automatically manages focus when menu opens
- Returns focus to trigger element when menu closes
- Keyboard navigation follows WAI-ARIA menu pattern
- Closes on Escape key and outside clicks
- Visual focus indicator for keyboard users

## Implementation Notes

- **Floating UI**: Uses `@floating-ui/react` for positioning
- **Portal Rendering**: Menu renders in a portal to avoid z-index issues
- **Focus Management**: Automatically traps and manages focus
- **Marker Pattern**: `ContextMenuItem` is a marker component that doesn't render directly

## Common Patterns

### With Button Trigger

```tsx
import { Button } from "@/components/common/Button/Button";
import { MoreHorizontal } from "lucide-react";

<Button
  ref={setTriggerRef}
  onClick={() => setIsMenuOpen(!isMenuOpen)}
  icon={MoreHorizontal}
  aria-label="Open menu"
  aria-expanded={isMenuOpen}
  aria-haspopup="menu"
/>;
```

### Conditional Menu Items

```tsx
<ContextMenu
  isOpen={isMenuOpen}
  onOpenChange={setIsMenuOpen}
  triggerRef={triggerRef}
>
  <ContextMenuItem onClick={handleEdit} icon={Edit}>
    Edit
  </ContextMenuItem>

  {canDuplicate && (
    <ContextMenuItem onClick={handleDuplicate} icon={Copy}>
      Duplicate
    </ContextMenuItem>
  )}

  {canDelete && (
    <ContextMenuItem onClick={handleDelete} icon={Trash} variant="danger">
      Delete
    </ContextMenuItem>
  )}
</ContextMenu>
```

## Best Practices

1. **Trigger Reference**: Always maintain a ref to the trigger element
2. **Destructive Actions**: Use `variant="danger"` for delete/remove actions
3. **Icon Consistency**: Include icons for better scanability
4. **Label Clarity**: Use clear, concise labels for actions
5. **Keyboard Support**: Ensure trigger button is keyboard accessible
6. **ARIA Labels**: Add `aria-label`, `aria-expanded`, and `aria-haspopup` to trigger
