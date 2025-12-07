# Button Component

A flexible, accessible button component with support for icons, multiple variants, and sizes.

## Features

- **Multiple Variants**: Neutral (default), primary, and danger styling
- **Size Options**: Default and small sizes
- **Icon Support**: Optional icon with automatic sizing and positioning
- **Accessibility**: Full keyboard navigation and ARIA support
- **Forward Ref**: Supports ref forwarding for advanced use cases

## Props

| Prop          | Type                                 | Default     | Description                                       |
| ------------- | ------------------------------------ | ----------- | ------------------------------------------------- |
| `children`    | `ReactNode`                          | -           | Button text content (optional if icon-only)       |
| `icon`        | `ComponentType`                      | -           | Lucide icon component to display                  |
| `variant`     | `"neutral" \| "danger" \| "primary"` | `"neutral"` | Visual style variant                              |
| `size`        | `"default" \| "small"`               | `"default"` | Button size                                       |
| `className`   | `string`                             | -           | Additional CSS classes                            |
| `data-testid` | `string`                             | -           | Test identifier                                   |
| `aria-label`  | `string`                             | -           | Accessible label (required for icon-only buttons) |

Extends all standard `ButtonHTMLAttributes<HTMLButtonElement>` props (`onClick`, `disabled`, `type`, etc.).

## Usage Examples

### Basic Button

```tsx
import { Button } from "@/components/common/Button/Button";

<Button onClick={handleClick}>Click Me</Button>;
```

### Button with Icon

```tsx
import { Button } from "@/components/common/Button/Button";
import { Save } from "lucide-react";

<Button icon={Save} onClick={handleSave}>
  Save Changes
</Button>;
```

### Icon-Only Button

```tsx
import { Button } from "@/components/common/Button/Button";
import { X } from "lucide-react";

<Button icon={X} onClick={handleClose} aria-label="Close dialog" />;
```

### Variant Examples

```tsx
// Primary action (turquoise)
<Button variant="primary" onClick={handleCreate}>
  Create Adventure
</Button>

// Destructive action (red)
<Button variant="danger" onClick={handleDelete}>
  Delete
</Button>

// Neutral/default action
<Button variant="neutral" onClick={handleCancel}>
  Cancel
</Button>
```

### Size Variations

```tsx
// Default size
<Button>Standard Button</Button>

// Small size
<Button size="small">Small Button</Button>
```

## Accessibility

- Uses semantic `<button>` element
- Icons have `aria-hidden="true"` to avoid duplication
- Supports all standard ARIA attributes
- Keyboard accessible by default
- Requires `aria-label` for icon-only buttons

## Styling

Styled using the color helper functions from `@/utils/colorHelpers`:

- `getInteractiveColor()` for state-based colors (default, hover, active, focus)
- Uses CSS variables from `index.css` for spacing and sizing
- Supports custom className for additional styling

## Best Practices

1. **Icon-Only Buttons**: Always provide an `aria-label` when using icon-only buttons
2. **Button Type**: Specify `type="button"` for buttons that don't submit forms (default is "submit")
3. **Destructive Actions**: Use `variant="danger"` for delete/remove actions
4. **Primary Actions**: Reserve `variant="primary"` for the main action in a group
5. **Loading States**: Use `disabled` prop and update button text (e.g., "Saving...")
