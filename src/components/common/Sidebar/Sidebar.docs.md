# Sidebar Component

A simple, semantic sidebar container component for displaying secondary content or navigation.

## Features

- **Semantic HTML**: Uses `<aside>` element for proper semantics
- **Flexible Content**: Accepts any React children
- **Fixed Width**: Predefined width using CSS variables
- **Simple API**: Minimal props for ease of use

## Props

| Prop       | Type        | Default      | Description                   |
| ---------- | ----------- | ------------ | ----------------------------- |
| `children` | `ReactNode` | **Required** | Content to display in sidebar |

## Usage Examples

### Basic Sidebar

```tsx
import { Sidebar } from "@/components/common/Sidebar/Sidebar";

<Sidebar>
  <h3>Navigation</h3>
  <ul>
    <li>
      <a href="/home">Home</a>
    </li>
    <li>
      <a href="/about">About</a>
    </li>
  </ul>
</Sidebar>;
```

### With Adventure Structure

```tsx
import { Sidebar } from "@/components/common/Sidebar/Sidebar";

<Sidebar>
  <h2>Adventure Structure</h2>
  <nav>
    <ul>
      <li>Introduction</li>
      <li>Chapter 1</li>
      <li>Chapter 2</li>
    </ul>
  </nav>
</Sidebar>;
```

### In Layout

```tsx
import { Sidebar } from "@/components/common/Sidebar/Sidebar";

const Layout = ({ children }) => (
  <div style={{ display: "flex" }}>
    <Sidebar>
      <nav>
        <h3>Menu</h3>
        {/* Navigation items */}
      </nav>
    </Sidebar>

    <main style={{ flex: 1 }}>{children}</main>
  </div>
);
```

### With Complex Content

```tsx
import { Sidebar } from "@/components/common/Sidebar/Sidebar";
import { NavigationTab } from "@/components/common/NavigationTab/NavigationTab";

<Sidebar>
  <section>
    <h3>Passages</h3>
    <ul>
      {passages.map((passage) => (
        <li key={passage.id}>
          <NavigationTab to={`/passage/${passage.id}`}>
            {passage.title}
          </NavigationTab>
        </li>
      ))}
    </ul>
  </section>

  <section>
    <h3>Statistics</h3>
    <p>Total passages: {passages.length}</p>
    <p>Endings: {endingCount}</p>
  </section>
</Sidebar>;
```

### Multiple Sections

```tsx
<Sidebar>
  <section>
    <h3>Structure</h3>
    <PassageTree passages={passages} />
  </section>

  <hr />

  <section>
    <h3>Metadata</h3>
    <AdventureMetadata adventure={adventure} />
  </section>

  <hr />

  <section>
    <h3>Actions</h3>
    <Button onClick={handleExport}>Export</Button>
    <Button onClick={handleValidate}>Validate</Button>
  </section>
</Sidebar>
```

## Styling

- **Width**: Fixed width using `--size-sidebar` CSS variable
- **Overflow**: Scrollable when content exceeds viewport height
- **Position**: Typically positioned in flex or grid layout
- **Semantic**: Renders as `<aside>` element

## Layout Patterns

### Flex Layout

```tsx
<div style={{ display: "flex", height: "100vh" }}>
  <Sidebar>{/* Sidebar content */}</Sidebar>

  <main style={{ flex: 1, overflow: "auto" }}>{/* Main content */}</main>
</div>
```

### Grid Layout

```tsx
<div
  style={{
    display: "grid",
    gridTemplateColumns: "var(--size-sidebar) 1fr",
    height: "100vh",
  }}
>
  <Sidebar>{/* Sidebar content */}</Sidebar>

  <main>{/* Main content */}</main>
</div>
```

### With TopBar

```tsx
<div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
  <TopBar start={<h1>Adventure Book</h1>} />

  <div style={{ display: "flex", flex: 1 }}>
    <Sidebar>{/* Sidebar content */}</Sidebar>

    <main style={{ flex: 1 }}>{/* Main content */}</main>
  </div>
</div>
```

## Accessibility

- **Semantic Element**: Uses `<aside>` for proper landmark
- **Screen Readers**: Announced as complementary content
- **Keyboard Navigation**: Content remains keyboard accessible
- **Skip Links**: Can be skipped with skip-to-main links

### Adding ARIA Label

For multiple sidebars or additional context:

```tsx
<Sidebar aria-label="Adventure navigation">
  {/* Navigation content */}
</Sidebar>

<Sidebar aria-label="Passage details">
  {/* Details content */}
</Sidebar>
```

## Best Practices

1. **Semantic Content**: Use for complementary content, not primary content
2. **Navigation**: Great for navigation menus and site structure
3. **Metadata**: Display contextual information about main content
4. **Actions**: Secondary actions related to main content
5. **Scrollable**: Ensure content is scrollable if it exceeds viewport
6. **Responsive**: Consider hiding or collapsing on mobile

## Common Use Cases

### Navigation Sidebar

```tsx
<Sidebar>
  <nav aria-label="Main navigation">
    <h2>Menu</h2>
    <ul>
      <li>
        <NavigationTab to="/">Home</NavigationTab>
      </li>
      <li>
        <NavigationTab to="/adventures">Adventures</NavigationTab>
      </li>
      <li>
        <NavigationTab to="/settings">Settings</NavigationTab>
      </li>
    </ul>
  </nav>
</Sidebar>
```

### Content Outline

```tsx
<Sidebar>
  <nav aria-label="Table of contents">
    <h2>Contents</h2>
    <ul>
      {sections.map((section) => (
        <li key={section.id}>
          <a href={`#${section.id}`}>{section.title}</a>
        </li>
      ))}
    </ul>
  </nav>
</Sidebar>
```

### Metadata Panel

```tsx
<Sidebar>
  <h2>Adventure Info</h2>
  <dl>
    <dt>Title</dt>
    <dd>{adventure.title}</dd>

    <dt>Author</dt>
    <dd>{adventure.author}</dd>

    <dt>Created</dt>
    <dd>
      <FormattedDate date={adventure.createdAt} />
    </dd>

    <dt>Passages</dt>
    <dd>{adventure.passages.length}</dd>
  </dl>
</Sidebar>
```

### Filter Panel

```tsx
<Sidebar>
  <h2>Filters</h2>
  <form>
    <Select
      label="Genre"
      options={genreOptions}
      value={genre}
      onChange={setGenre}
    />

    <Select
      label="Difficulty"
      options={difficultyOptions}
      value={difficulty}
      onChange={setDifficulty}
    />

    <Button type="submit">Apply Filters</Button>
  </form>
</Sidebar>
```

## Styling Customization

The component uses `--size-sidebar` CSS variable for width:

```css
/* In your CSS */
:root {
  --size-sidebar: 250px; /* Adjust width */
}
```

Override with inline styles if needed:

```tsx
<Sidebar style={{ width: "300px" }}>{/* Content */}</Sidebar>
```

## Implementation Notes

- **Minimal Component**: Intentionally simple for flexibility
- **Styling**: Handled by styled-components
- **Layout**: Relies on parent layout (flex/grid)
- **Scrolling**: Automatically handles overflow
