# DetailsButton Component

An accessible disclosure widget using the native HTML `<details>` and `<summary>` elements, styled as a button with optional icon support.

## Features

- **Native HTML**: Uses semantic `<details>` and `<summary>` elements
- **Accessible**: Built-in keyboard support and ARIA semantics
- **Icon Support**: Optional icon for visual enhancement
- **Expandable Content**: Shows/hides content on click
- **Styled as Button**: Button-like appearance for consistency

## Props

| Prop               | Type            | Default      | Description                          |
| ------------------ | --------------- | ------------ | ------------------------------------ |
| `summary`          | `string`        | **Required** | Text displayed in the button/summary |
| `children`         | `ReactNode`     | **Required** | Content revealed when expanded       |
| `icon`             | `ComponentType` | -            | Lucide icon component                |
| `className`        | `string`        | -            | Additional CSS classes for container |
| `summaryClassName` | `string`        | -            | Additional CSS classes for summary   |
| `data-testid`      | `string`        | -            | Test identifier                      |

Extends all standard `DetailsHTMLAttributes<HTMLDetailsElement>` props (`open`, `onToggle`, etc.).

## Usage Examples

### Basic Details Button

```tsx
import { DetailsButton } from "@/components/common/DetailsButton/DetailsButton";

<DetailsButton summary="Show Details">
  <p>This content is hidden by default and revealed when clicked.</p>
</DetailsButton>;
```

### With Icon

```tsx
import { DetailsButton } from "@/components/common/DetailsButton/DetailsButton";
import { Info } from "lucide-react";

<DetailsButton summary="Adventure Information" icon={Info}>
  <p>Created: December 2023</p>
  <p>Last modified: Today</p>
  <p>Passages: 42</p>
</DetailsButton>;
```

### Controlled State

```tsx
import { useState } from "react";
import { DetailsButton } from "@/components/common/DetailsButton/DetailsButton";

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DetailsButton
      summary="Expandable Section"
      open={isOpen}
      onToggle={(e) => setIsOpen(e.currentTarget.open)}
    >
      <p>Controlled content visibility</p>
    </DetailsButton>
  );
};
```

## Behavior

- **Click to Toggle**: Clicking the summary toggles the expanded state
- **Keyboard Accessible**: Space and Enter keys toggle expansion
- **Default Closed**: Content is hidden by default (unless `open` prop is true)
- **Independent State**: Each DetailsButton maintains its own state
- **Native Semantics**: Uses browser's native `<details>` behavior

## Accessibility

- Uses semantic HTML `<details>` and `<summary>` elements
- Automatically includes disclosure triangle (native browser UI)
- Screen readers announce expanded/collapsed state
- Keyboard accessible (Space, Enter)
- Icons have `aria-hidden="true"` to avoid duplication
- No additional ARIA needed (native semantics)

## Styling

- Styled to match Button component appearance
- Uses color helper functions for consistent theming
- Icon sized at 20px with 1.5 stroke width
- Summary styled as button for consistency
- Content area for flexible child layout

## Best Practices

1. **Descriptive Summary**: Use clear, descriptive summary text
2. **Content Structure**: Keep expandable content well-organized
3. **Icon Choice**: Use icons that suggest expansion/disclosure
4. **Default State**: Consider starting collapsed to reduce cognitive load
5. **Nested Content**: Avoid deeply nesting DetailsButton components

## Common Use Cases

- **Help Text**: Additional information that's optional to read
- **Settings Panels**: Collapsible configuration sections
- **FAQ Sections**: Question/answer pairs
- **Metadata**: Optional details about items
- **Long Forms**: Grouping form fields into collapsible sections
