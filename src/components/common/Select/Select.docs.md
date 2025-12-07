# Select Component

An accessible dropdown select component with label, error messaging, keyboard navigation, and icon support.

## Features

- **Keyboard Navigation**: Full arrow key, Home/End, and type-ahead support
- **Icon Support**: Optional icons for select options
- **Error Display**: Error message with appropriate ARIA attributes
- **Placeholder**: Customizable placeholder text
- **Disabled State**: Visual and functional disabled state
- **Auto-Generated IDs**: Automatic ID generation from label
- **Accessible**: Complete ARIA support following combobox pattern
- **Custom Rendering**: Extensible for custom option layouts

## Props

| Prop          | Type                      | Default              | Description                          |
| ------------- | ------------------------- | -------------------- | ------------------------------------ |
| `label`       | `string`                  | **Required**         | Label text for the select            |
| `options`     | `SelectOption[]`          | **Required**         | Array of options                     |
| `value`       | `string`                  | -                    | Currently selected option value      |
| `onChange`    | `(value: string) => void` | -                    | Callback when selection changes      |
| `error`       | `string`                  | -                    | Error message to display             |
| `placeholder` | `string`                  | `"Select an option"` | Placeholder when no value selected   |
| `disabled`    | `boolean`                 | `false`              | Disables the select                  |
| `id`          | `string`                  | Auto-generated       | Unique identifier                    |
| `className`   | `string`                  | -                    | Additional CSS classes for container |
| `data-testid` | `string`                  | -                    | Test identifier                      |

## SelectOption Interface

```typescript
interface SelectOption {
  value: string; // Unique option identifier
  label: string; // Display text
  icon?: ComponentType; // Optional Lucide icon
}
```

## Usage Examples

### Basic Select

```tsx
import { Select } from "@/components/common/Select/Select";

const [language, setLanguage] = useState("");

const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

<Select
  label="Language"
  options={languageOptions}
  value={language}
  onChange={setLanguage}
/>;
```

### With Icons

```tsx
import { Select } from "@/components/common/Select/Select";
import { Globe, Code, FileText } from "lucide-react";

const typeOptions = [
  { value: "story", label: "Story", icon: FileText },
  { value: "code", label: "Code", icon: Code },
  { value: "web", label: "Web", icon: Globe },
];

<Select
  label="Content Type"
  options={typeOptions}
  value={type}
  onChange={setType}
/>;
```

### With Error Message

```tsx
import { Select } from "@/components/common/Select/Select";

const [category, setCategory] = useState("");
const [error, setError] = useState("");

const handleChange = (value: string) => {
  setCategory(value);
  if (!value) {
    setError("Please select a category");
  } else {
    setError("");
  }
};

<Select
  label="Category"
  options={categoryOptions}
  value={category}
  onChange={handleChange}
  error={error}
/>;
```

### Custom Placeholder

```tsx
<Select
  label="Theme"
  options={themeOptions}
  value={theme}
  onChange={setTheme}
  placeholder="Choose a theme..."
/>
```

### Disabled State

```tsx
<Select
  label="Status"
  options={statusOptions}
  value={status}
  onChange={setStatus}
  disabled={isLoading}
/>
```

### In Form

```tsx
const AdventureForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    difficulty: "",
  });

  const genreOptions = [
    { value: "fantasy", label: "Fantasy" },
    { value: "scifi", label: "Sci-Fi" },
    { value: "mystery", label: "Mystery" },
  ];

  const difficultyOptions = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  return (
    <form>
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <Select
        label="Genre"
        options={genreOptions}
        value={formData.genre}
        onChange={(value) => setFormData({ ...formData, genre: value })}
      />

      <Select
        label="Difficulty"
        options={difficultyOptions}
        value={formData.difficulty}
        onChange={(value) => setFormData({ ...formData, difficulty: value })}
      />
    </form>
  );
};
```

## Keyboard Navigation

| Key               | Action                            |
| ----------------- | --------------------------------- |
| `Space` / `Enter` | Open/close dropdown               |
| `ArrowDown`       | Next option (opens if closed)     |
| `ArrowUp`         | Previous option (opens if closed) |
| `Home`            | First option (opens if closed)    |
| `End`             | Last option (opens if closed)     |
| `Escape`          | Close dropdown                    |
| `Tab`             | Close and move to next element    |

## Accessibility

- **Combobox Pattern**: Follows WAI-ARIA combobox pattern
- **ARIA Attributes**: Proper `aria-haspopup`, `aria-expanded`, `aria-controls`
- **Label Association**: Label linked to button via `htmlFor`
- **Error Messaging**: Error linked via `aria-describedby`
- **Invalid State**: `aria-invalid` set when error exists
- **Keyboard Support**: Full keyboard navigation
- **Focus Management**: Returns focus to button on close
- **Screen Readers**: Announces selection changes

## ID Generation

If no `id` prop is provided, the component generates one from the label:

```tsx
<Select label="Adventure Genre" options={options} />
// Generated ID: "select-adventure-genre"

<Select label="Difficulty Level" options={options} />
// Generated ID: "select-difficulty-level"
```

Custom ID:

```tsx
<Select label="Genre" id="custom-genre-select" options={options} />
```

## Styling

- **Button**: Styled as form control with dropdown indicator
- **Chevron**: Rotates when dropdown is open
- **Error State**: Red border and error message
- **Disabled State**: Reduced opacity and cursor
- **Selected Icon**: Displayed alongside selected label
- Uses color helpers and CSS variables

## Implementation Details

### State Management

Manages multiple pieces of state:

- `isOpen`: Dropdown visibility
- `activeIndex`: Currently focused option (for keyboard nav)
- `triggerRef`: Reference to button element

### Dropdown Integration

Uses the Dropdown component internally with:

- Automatic width matching with trigger button
- Portal rendering for z-index management
- Focus management and keyboard navigation
- Listbox role for proper semantics

### Focus Behavior

- **On Open**: Sets active index to selected or first option
- **On Close**: Returns focus to button (prevents scroll)
- **On Select**: Closes dropdown and focuses button

## Best Practices

1. **Clear Labels**: Use descriptive, concise labels
2. **Option Order**: Order logically (alphabetical, frequency, etc.)
3. **Placeholder Text**: Use for format hints, not instructions
4. **Error Messages**: Provide specific, actionable errors
5. **Required Fields**: Mark in label or validate on change
6. **Icon Consistency**: Use icons for all options or none
7. **Disabled State**: Clearly communicate why disabled

## Common Patterns

### With Validation

```tsx
const validateSelection = (value: string): string => {
  if (!value) return "Selection is required";
  return "";
};

const [value, setValue] = useState("");
const [error, setError] = useState("");

const handleChange = (newValue: string) => {
  setValue(newValue);
  setError(validateSelection(newValue));
};

<Select
  label="Priority"
  options={priorityOptions}
  value={value}
  onChange={handleChange}
  error={error}
/>;
```

### Dynamic Options

```tsx
const [category, setCategory] = useState("");
const [subcategory, setSubcategory] = useState("");

const subcategoryOptions = useMemo(() => {
  return getSubcategoriesFor(category);
}, [category]);

<>
  <Select
    label="Category"
    options={categoryOptions}
    value={category}
    onChange={(value) => {
      setCategory(value);
      setSubcategory(""); // Reset dependent field
    }}
  />

  <Select
    label="Subcategory"
    options={subcategoryOptions}
    value={subcategory}
    onChange={setSubcategory}
    disabled={!category}
    placeholder={category ? "Select subcategory" : "Select category first"}
  />
</>;
```

## Differences from Native Select

| Feature       | Select Component   | Native `<select>` |
| ------------- | ------------------ | ----------------- |
| Styling       | Fully customizable | Limited styling   |
| Icons         | Supported          | Not supported     |
| Keyboard Nav  | Enhanced           | Basic             |
| Positioning   | Floating UI        | Browser default   |
| Mobile        | Consistent         | Native picker     |
| Accessibility | Enhanced ARIA      | Basic semantics   |

## When to Use

**Use Select when:**

- User chooses from predefined options
- Options include icons or complex content
- Consistent styling across platforms is needed
- Enhanced accessibility is required

**Use Native `<select>` when:**

- Simple text options only
- Native mobile experience preferred
- Form autofill is critical
- Progressive enhancement is priority
