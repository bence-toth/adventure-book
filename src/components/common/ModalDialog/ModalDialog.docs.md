# ModalDialog Component

An accessible modal dialog component with overlay, focus trapping, and multiple action buttons.

## Features

- **Focus Management**: Automatic focus trapping and restoration
- **Keyboard Support**: Escape key to close, Tab/Shift+Tab navigation
- **Click Outside**: Closes when clicking overlay
- **Scroll Lock**: Prevents background scrolling when open
- **Multiple Actions**: Supports multiple action buttons
- **Flexible Content**: Supports string, array, or custom ReactNode messages
- **Accessible**: Full ARIA support and semantic HTML

## Props

| Prop           | Type                              | Default      | Description                      |
| -------------- | --------------------------------- | ------------ | -------------------------------- |
| `isOpen`       | `boolean`                         | **Required** | Controls modal visibility        |
| `onOpenChange` | `() => void`                      | **Required** | Callback when modal should close |
| `title`        | `string`                          | **Required** | Modal dialog title               |
| `message`      | `string \| string[] \| ReactNode` | **Required** | Message content                  |
| `actions`      | `ModalAction[]`                   | **Required** | Array of action buttons          |
| `data-testid`  | `string`                          | -            | Test identifier                  |

## ModalAction Interface

```typescript
interface ModalAction {
  label: string; // Button text
  onClick: () => void; // Click handler
  variant?: "neutral" | "primary" | "danger"; // Button style
}
```

## Usage Examples

### Simple Confirmation

```tsx
import { useState } from "react";
import { ModalDialog } from "@/components/common/ModalDialog/ModalDialog";

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    // Perform action...
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Delete</button>

      <ModalDialog
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this adventure?"
        actions={[
          {
            label: "Cancel",
            onClick: () => setIsOpen(false),
            variant: "neutral",
          },
          {
            label: "Delete",
            onClick: handleConfirm,
            variant: "danger",
          },
        ]}
      />
    </>
  );
};
```

### Multi-Paragraph Message

```tsx
<ModalDialog
  isOpen={isOpen}
  onOpenChange={() => setIsOpen(false)}
  title="Important Notice"
  message={[
    "This action cannot be undone.",
    "All data associated with this adventure will be permanently deleted.",
    "Are you sure you want to continue?",
  ]}
  actions={[
    { label: "Cancel", onClick: handleCancel },
    { label: "Confirm", onClick: handleConfirm, variant: "danger" },
  ]}
/>
```

### Custom Message Content

```tsx
<ModalDialog
  isOpen={isOpen}
  onOpenChange={() => setIsOpen(false)}
  title="Adventure Details"
  message={
    <div>
      <p>
        <strong>Title:</strong> {adventure.title}
      </p>
      <p>
        <strong>Passages:</strong> {passageCount}
      </p>
      <p>
        <strong>Created:</strong> {formatDate(adventure.createdAt)}
      </p>
    </div>
  }
  actions={[{ label: "Close", onClick: () => setIsOpen(false) }]}
/>
```

### Three Action Buttons

```tsx
<ModalDialog
  isOpen={isOpen}
  onOpenChange={() => setIsOpen(false)}
  title="Unsaved Changes"
  message="You have unsaved changes. What would you like to do?"
  actions={[
    {
      label: "Cancel",
      onClick: () => setIsOpen(false),
      variant: "neutral",
    },
    {
      label: "Discard",
      onClick: handleDiscard,
      variant: "danger",
    },
    {
      label: "Save",
      onClick: handleSave,
      variant: "primary",
    },
  ]}
/>
```

### With Async Actions

```tsx
const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAdventure(adventureId);
      setIsOpen(false);
    } catch (error) {
      alert("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onOpenChange={() => setIsOpen(false)}
      title="Delete Adventure"
      message="Are you sure you want to delete this adventure?"
      actions={[
        {
          label: "Cancel",
          onClick: () => setIsOpen(false),
          disabled: isDeleting,
        },
        {
          label: isDeleting ? "Deleting..." : "Delete",
          onClick: handleDelete,
          variant: "danger",
          disabled: isDeleting,
        },
      ]}
    />
  );
};
```

## Behavior

### Opening and Closing

- **Open**: Set `isOpen` to `true`
- **Close**: Triggered by:
  - Clicking action button (must call `setIsOpen(false)` in handler)
  - Clicking overlay
  - Pressing Escape key
  - Calls `onOpenChange()` when closed

### Focus Management

1. **On Open**: Focuses first action button automatically
2. **Tab Navigation**: Cycles through action buttons
3. **Trap Focus**: Cannot tab to elements outside modal
4. **On Close**: Returns focus to element that opened modal

### Scroll Lock

- **Background Scroll**: Disabled when modal is open
- **Modal Content**: Can scroll if content exceeds viewport
- **Cleanup**: Scroll restored on close or unmount

## Accessibility

- **Dialog Role**: Uses `role="dialog"` for screen readers
- **Modal**: Focus trapped within dialog
- **Escape Key**: Closes modal (standard expectation)
- **Initial Focus**: First button receives focus on open
- **Focus Return**: Focus restored to trigger element on close
- **Overlay Click**: Closes modal (alternative to Escape)

## Styling

- **Overlay**: Semi-transparent background covering viewport
- **Dialog**: Centered on screen with elevation
- **Title**: Prominent heading
- **Message**: Body text with appropriate spacing
- **Actions**: Horizontal button group with consistent spacing
- Uses color helpers and CSS variables

## Message Format

The `message` prop accepts three formats:

### String

```tsx
message = "Simple message text";
```

### Array of Strings

Each string becomes a paragraph:

```tsx
message={[
  "First paragraph",
  "Second paragraph",
  "Third paragraph"
]}
```

### React Node

Custom JSX content:

```tsx
message={
  <div>
    <p>Custom content</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </div>
}
```

## Best Practices

1. **Action Order**: Place safe action (Cancel) first, destructive action last
2. **Button Variants**: Use `danger` for destructive actions, `primary` for main action
3. **Clear Titles**: Use concise, descriptive titles
4. **Action Labels**: Use clear action verbs ("Delete", not "OK")
5. **Async Actions**: Show loading state in button labels
6. **Message Clarity**: Explain consequences of actions
7. **Avoid Overuse**: Use for important decisions only

## Common Patterns

### Delete Confirmation

```tsx
<ModalDialog
  title="Delete Adventure"
  message="This action cannot be undone. Are you sure?"
  actions={[
    { label: "Cancel", onClick: handleCancel },
    { label: "Delete", onClick: handleDelete, variant: "danger" },
  ]}
/>
```

### Unsaved Changes

```tsx
<ModalDialog
  title="Unsaved Changes"
  message="You have unsaved changes. Do you want to save before leaving?"
  actions={[
    { label: "Cancel", onClick: handleCancel },
    { label: "Don't Save", onClick: handleDiscard, variant: "danger" },
    { label: "Save", onClick: handleSave, variant: "primary" },
  ]}
/>
```

### Information Dialog

```tsx
<ModalDialog
  title="Welcome"
  message="Welcome to Adventure Book! Create your first interactive story."
  actions={[{ label: "Get Started", onClick: handleClose, variant: "primary" }]}
/>
```

## Implementation Details

### Floating UI Integration

Uses `@floating-ui/react` for:

- Portal rendering
- Focus management (`FloatingFocusManager`)
- Dismiss interactions (`useDismiss`)
- Dialog role (`useRole`)

### Body Scroll Lock

```typescript
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
  return () => {
    document.body.style.overflow = "";
  };
}, [isOpen]);
```

## When Not to Use

- **Complex forms**: Use full page or drawer components
- **Non-blocking info**: Use tooltips or inline messages
- **Frequent interruptions**: Consider less intrusive alternatives
