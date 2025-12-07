# NavigationTab Component

A tab-style navigation link component that combines React Router's `Link` with tab-specific styling and accessibility features.

## Features

- **Client-Side Routing**: Uses React Router `Link` for navigation
- **Tab Styling**: Horizontal tab appearance with bottom border indicator
- **Active State**: Visual and semantic indication of current tab
- **Icon Support**: Optional icon with proper sizing
- **Keyboard Accessible**: Full keyboard navigation support
- **ARIA Support**: Proper `aria-current` for active state

## Props

| Prop          | Type                     | Default      | Description                     |
| ------------- | ------------------------ | ------------ | ------------------------------- |
| `children`    | `ReactNode`              | **Required** | Tab label text                  |
| `icon`        | `ComponentType`          | -            | Lucide icon component           |
| `variant`     | `"neutral" \| "primary"` | `"neutral"`  | Visual style (primary = active) |
| `className`   | `string`                 | -            | Additional CSS classes          |
| `data-testid` | `string`                 | -            | Test identifier                 |

Extends all React Router `LinkProps` except `className` (`to`, `replace`, `state`, etc.).

## Usage Examples

### Basic Tab Navigation

```tsx
import { NavigationTab } from "@/components/common/NavigationTab/NavigationTab";

<nav>
  <NavigationTab to="/overview" variant="primary">
    Overview
  </NavigationTab>
  <NavigationTab to="/passages">Passages</NavigationTab>
  <NavigationTab to="/settings">Settings</NavigationTab>
</nav>;
```

### Tabs with Icons

```tsx
import { NavigationTab } from "@/components/common/NavigationTab/NavigationTab";
import { Home, BookOpen, Settings } from "lucide-react";

<nav>
  <NavigationTab to="/" icon={Home}>
    Home
  </NavigationTab>
  <NavigationTab to="/adventures" icon={BookOpen} variant="primary">
    Adventures
  </NavigationTab>
  <NavigationTab to="/settings" icon={Settings}>
    Settings
  </NavigationTab>
</nav>;
```

### Dynamic Active State

```tsx
import { useLocation } from "react-router-dom";
import { NavigationTab } from "@/components/common/NavigationTab/NavigationTab";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav>
      <NavigationTab
        to="/content"
        variant={location.pathname === "/content" ? "primary" : "neutral"}
      >
        Content
      </NavigationTab>
      <NavigationTab
        to="/test"
        variant={location.pathname === "/test" ? "primary" : "neutral"}
      >
        Test
      </NavigationTab>
      <NavigationTab
        to="/structure"
        variant={location.pathname === "/structure" ? "primary" : "neutral"}
      >
        Structure
      </NavigationTab>
    </nav>
  );
};
```

### Complete Tab Navigation Example

```tsx
import { NavigationTab } from "@/components/common/NavigationTab/NavigationTab";
import { FileText, Play, Network } from "lucide-react";

const AdventureNavigation = ({ currentPath }) => {
  return (
    <nav aria-label="Adventure sections">
      <NavigationTab
        to="/adventure/content"
        icon={FileText}
        variant={currentPath === "/adventure/content" ? "primary" : "neutral"}
      >
        Content
      </NavigationTab>
      <NavigationTab
        to="/adventure/test"
        icon={Play}
        variant={currentPath === "/adventure/test" ? "primary" : "neutral"}
      >
        Test
      </NavigationTab>
      <NavigationTab
        to="/adventure/structure"
        icon={Network}
        variant={currentPath === "/adventure/structure" ? "primary" : "neutral"}
      >
        Structure
      </NavigationTab>
    </nav>
  );
};
```

## Visual Style

- **Horizontal Layout**: Designed for inline tab bars
- **Bottom Border**: Active state indicated by turquoise bottom border
- **Compact Spacing**: Optimized for tab bar layouts
- **Icon Support**: Optional icons with consistent sizing

## Accessibility

- Renders as semantic `<a>` element (via React Router)
- Icons have `aria-hidden="true"` to avoid duplication
- Sets `aria-current="page"` when variant is "primary"
- Works with keyboard navigation (Enter, Space)
- Visible focus indicator for keyboard users
- Can be wrapped in `<nav>` with `aria-label` for context

## Styling

- **Neutral**: Default state with subtle appearance
- **Primary**: Active state with turquoise bottom border
- **Hover**: Interactive state with visual feedback
- **Focus**: Visible outline for keyboard navigation
- **Icon**: 20px size with 2px stroke width
- Uses `getInteractiveColor()` helper for state-based colors

## Layout Patterns

### Horizontal Tab Bar

```tsx
<div style={{ display: "flex", gap: "var(--space-1)" }}>
  <NavigationTab to="/tab1" variant="primary">
    Tab 1
  </NavigationTab>
  <NavigationTab to="/tab2">Tab 2</NavigationTab>
  <NavigationTab to="/tab3">Tab 3</NavigationTab>
</div>
```

### With Border Container

```tsx
<nav
  style={{
    borderBottom: "1px solid var(--color-border-neutral)",
    display: "flex",
    gap: "var(--space-2)",
  }}
>
  <NavigationTab to="/overview" variant="primary">
    Overview
  </NavigationTab>
  <NavigationTab to="/details">Details</NavigationTab>
</nav>
```

## Best Practices

1. **Active Indication**: Always indicate which tab is active with `variant="primary"`
2. **Consistent Labels**: Use clear, concise labels
3. **Icon Usage**: Use icons consistently across all tabs or none
4. **Group Related Content**: Use tabs for related sections
5. **Limit Tab Count**: Keep to 3-7 tabs for usability
6. **Semantic Nav**: Wrap tabs in `<nav>` element with `aria-label`
7. **Keyboard Focus**: Ensure clear focus indicators

## When to Use

**Use NavigationTab when:**

- Creating section/view navigation within a feature
- Building tabbed interfaces
- Switching between related content views
- Creating horizontal navigation bars

**Use Button when:**

- Performing actions (not navigation)
- Opening modals or triggering events
- Form submissions

## Common Use Cases

### Feature Sections

```tsx
// Adventure editor with Content, Test, Structure tabs
<NavigationTab to="/adventure/content" icon={FileText}>
  Content
</NavigationTab>
```

### Settings Pages

```tsx
// Settings with General, Advanced, About tabs
<NavigationTab to="/settings" variant="primary">
  General
</NavigationTab>
```

### Dashboard Views

```tsx
// Dashboard with Overview, Analytics, Reports tabs
<NavigationTab to="/dashboard" icon={LayoutDashboard}>
  Overview
</NavigationTab>
```

## Implementation Example

```tsx
import { Outlet, useLocation } from "react-router-dom";
import { NavigationTab } from "@/components/common/NavigationTab/NavigationTab";
import { FileText, Play, Network } from "lucide-react";

const AdventureLayout = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "primary" : "neutral";

  return (
    <div>
      <nav
        aria-label="Adventure sections"
        style={{
          display: "flex",
          gap: "var(--space-2)",
          borderBottom: "1px solid var(--color-border-neutral)",
        }}
      >
        <NavigationTab
          to="/adventure/content"
          icon={FileText}
          variant={isActive("/adventure/content")}
        >
          Content
        </NavigationTab>
        <NavigationTab
          to="/adventure/test"
          icon={Play}
          variant={isActive("/adventure/test")}
        >
          Test
        </NavigationTab>
        <NavigationTab
          to="/adventure/structure"
          icon={Network}
          variant={isActive("/adventure/structure")}
        >
          Structure
        </NavigationTab>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
};
```
