# TopBar Component

A generic top bar layout component that provides slots for start and end content, ideal for application headers and navigation bars.

## Features

- **Semantic HTML**: Uses `<header>` element for proper semantics
- **Flex Layout**: Automatically spaces start and end content
- **Responsive**: Uses logical properties for RTL support
- **Simple API**: Two slots for content placement
- **Fixed Height**: Predefined height using CSS variables

## Props

| Prop    | Type        | Default | Description                                                |
| ------- | ----------- | ------- | ---------------------------------------------------------- |
| `start` | `ReactNode` | -       | Content displayed at the start (left in LTR, right in RTL) |
| `end`   | `ReactNode` | -       | Content displayed at the end (right in LTR, left in RTL)   |

## Usage Examples

### Basic Top Bar

```tsx
import { TopBar } from "@/components/common/TopBar/TopBar";

<TopBar start={<h1>Adventure Book</h1>} end={<button>Settings</button>} />;
```

### With Navigation

```tsx
import { TopBar } from "@/components/common/TopBar/TopBar";
import { Button } from "@/components/common/Button/Button";
import { Home, Settings } from "lucide-react";

<TopBar
  start={
    <>
      <h1>My App</h1>
      <nav>
        <Button icon={Home}>Home</Button>
      </nav>
    </>
  }
  end={<Button icon={Settings} aria-label="Settings" />}
/>;
```

### Application Header

```tsx
import { TopBar } from "@/components/common/TopBar/TopBar";
import { NavigationTab } from "@/components/common/NavigationTab/NavigationTab";
import {
  ContextMenu,
  ContextMenuItem,
} from "@/components/common/ContextMenu/ContextMenu";
import { BookOpen, User, LogOut } from "lucide-react";

const AppHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuTriggerRef, setMenuTriggerRef] = useState<HTMLElement | null>(
    null
  );

  return (
    <TopBar
      start={
        <>
          <h1>Adventure Book</h1>
          <nav style={{ display: "flex", gap: "var(--space-2)" }}>
            <NavigationTab to="/adventures" icon={BookOpen}>
              Adventures
            </NavigationTab>
          </nav>
        </>
      }
      end={
        <>
          <Button
            ref={setMenuTriggerRef}
            icon={User}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="User menu"
          />

          <ContextMenu
            isOpen={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            triggerRef={menuTriggerRef}
          >
            <ContextMenuItem onClick={handleProfile} icon={User}>
              Profile
            </ContextMenuItem>
            <ContextMenuItem
              onClick={handleLogout}
              icon={LogOut}
              variant="danger"
            >
              Log Out
            </ContextMenuItem>
          </ContextMenu>
        </>
      }
    />
  );
};
```

### With Logo and Actions

```tsx
import { TopBar } from "@/components/common/TopBar/TopBar";
import { Button } from "@/components/common/Button/Button";
import { Save, Download, Share } from "lucide-react";

<TopBar
  start={
    <div
      style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
    >
      <img src="/logo.svg" alt="Logo" height="32" />
      <h1>Editor</h1>
    </div>
  }
  end={
    <div style={{ display: "flex", gap: "var(--space-1)" }}>
      <Button icon={Save} onClick={handleSave}>
        Save
      </Button>
      <Button icon={Download} onClick={handleDownload}>
        Download
      </Button>
      <Button icon={Share} onClick={handleShare}>
        Share
      </Button>
    </div>
  }
/>;
```

### Breadcrumb Navigation

```tsx
import { TopBar } from "@/components/common/TopBar/TopBar";
import { Button } from "@/components/common/Button/Button";
import { ChevronRight } from "lucide-react";

<TopBar
  start={
    <nav
      aria-label="Breadcrumb"
      style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}
    >
      <Button onClick={() => navigate("/adventures")}>Adventures</Button>
      <ChevronRight size={16} />
      <Button onClick={() => navigate("/adventure/123")}>My Adventure</Button>
      <ChevronRight size={16} />
      <span>Edit</span>
    </nav>
  }
/>;
```

### With Search

```tsx
import { TopBar } from "@/components/common/TopBar/TopBar";
import { Input } from "@/components/common/Input/Input";

<TopBar
  start={<h1>Adventures</h1>}
  end={
    <Input
      label="Search"
      placeholder="Search adventures..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      aria-label="Search adventures"
    />
  }
/>;
```

## Layout Patterns

### Full Application Layout

```tsx
import { TopBar } from "@/components/common/TopBar/TopBar";
import { Sidebar } from "@/components/common/Sidebar/Sidebar";

const AppLayout = ({ children }) => (
  <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
    <TopBar start={<h1>My App</h1>} end={<Button>Menu</Button>} />

    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <Sidebar>{/* Navigation */}</Sidebar>

      <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
    </div>
  </div>
);
```

### Sticky Top Bar

```tsx
<div style={{ position: "sticky", top: 0, zIndex: 100 }}>
  <TopBar start={<h1>Sticky Header</h1>} />
</div>
```

### With Tabs Below

```tsx
import { TopBar } from "@/components/common/TopBar/TopBar";
import { NavigationTab } from "@/components/common/NavigationTab/NavigationTab";

<>
  <TopBar start={<h1>Adventure Editor</h1>} end={<Button>Save</Button>} />

  <nav
    style={{
      display: "flex",
      gap: "var(--space-2)",
      borderBottom: "1px solid var(--color-border-neutral)",
      padding: "0 var(--space-2)",
    }}
  >
    <NavigationTab to="/content" variant="primary">
      Content
    </NavigationTab>
    <NavigationTab to="/test">Test</NavigationTab>
    <NavigationTab to="/structure">Structure</NavigationTab>
  </nav>
</>;
```

## Accessibility

- **Semantic Element**: Uses `<header>` for proper landmark
- **Screen Readers**: Announced as header region
- **Skip Links**: Can be skipped with skip-to-main links
- **Keyboard Navigation**: All interactive content remains keyboard accessible

### Adding ARIA Label

For multiple headers or additional context:

```tsx
<TopBar
  aria-label="Main navigation"
  start={<h1>App</h1>}
  end={<nav>...</nav>}
/>
```

## Styling

- **Height**: Fixed height using `--size-top-bar` CSS variable
- **Layout**: Flexbox with space-between alignment
- **Padding**: Horizontal padding for content spacing
- **Border**: Bottom border for visual separation
- Uses color helpers for theming

## Customization

Override CSS variable for height:

```css
:root {
  --size-top-bar: 60px; /* Adjust height */
}
```

Add custom styles:

```tsx
<TopBar
  start={<h1>App</h1>}
  style={{
    backgroundColor: "var(--color-background-primary)",
    boxShadow: "var(--shadow-surface-neutral)",
  }}
/>
```

## Common Use Cases

### Application Header

```tsx
<TopBar
  start={
    <>
      <img src="/logo.svg" alt="App Logo" />
      <h1>Application Name</h1>
    </>
  }
  end={
    <>
      <Button>Help</Button>
      <Button icon={User}>Account</Button>
    </>
  }
/>
```

### Editor Toolbar

```tsx
<TopBar
  start={
    <div style={{ display: "flex", gap: "var(--space-1)" }}>
      <Button icon={Bold}>Bold</Button>
      <Button icon={Italic}>Italic</Button>
      <Button icon={Underline}>Underline</Button>
    </div>
  }
  end={
    <Button variant="primary" icon={Save}>
      Save
    </Button>
  }
/>
```

### Navigation Bar

```tsx
<TopBar
  start={
    <nav style={{ display: "flex", gap: "var(--space-2)" }}>
      <NavigationTab to="/">Home</NavigationTab>
      <NavigationTab to="/about">About</NavigationTab>
      <NavigationTab to="/contact">Contact</NavigationTab>
    </nav>
  }
  end={<Button variant="primary">Sign In</Button>}
/>
```

## Best Practices

1. **Consistent Height**: Use for primary navigation/branding
2. **Essential Actions**: Place most important actions in `end` slot
3. **Logo/Branding**: Typically in `start` slot with app name
4. **Responsive**: Consider collapsing content on mobile
5. **Sticky Position**: Consider making sticky for persistent access
6. **Z-Index**: Ensure proper layering with other content
7. **Skip Links**: Provide skip links for keyboard users

## Implementation Notes

- **Minimal Component**: Intentionally simple for flexibility
- **Styling**: Handled by styled-components
- **Layout Slots**: Start and end for common header patterns
- **No Built-in Responsiveness**: Requires parent handling

## Related Components

- **Sidebar**: Vertical navigation companion
- **NavigationTab**: Tab navigation below top bar
- **Button**: Action buttons in top bar
