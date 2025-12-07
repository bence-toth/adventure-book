# Input Component

An accessible text input component with label, error messaging, and full keyboard support.

## Features

- **Integrated Label**: Built-in label with proper association
- **Error Display**: Error message with appropriate ARIA attributes
- **Auto-Generated IDs**: Automatic ID generation from label
- **Forward Ref**: Supports ref forwarding for focus management
- **Type Safety**: Full TypeScript support with HTML input attributes
- **Accessibility**: Complete ARIA support and semantic HTML

## Props

| Prop          | Type     | Default        | Description                          |
| ------------- | -------- | -------------- | ------------------------------------ |
| `label`       | `string` | **Required**   | Label text for the input             |
| `error`       | `string` | -              | Error message to display             |
| `id`          | `string` | Auto-generated | Unique identifier for input          |
| `className`   | `string` | -              | Additional CSS classes for container |
| `data-testid` | `string` | -              | Test identifier                      |

Extends all standard `InputHTMLAttributes<HTMLInputElement>` props (`type`, `value`, `onChange`, `placeholder`, `disabled`, `required`, etc.).

## Usage Examples

### Basic Text Input

```tsx
import { Input } from "@/components/common/Input/Input";

<Input
  label="Adventure Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>;
```

### With Error Message

```tsx
import { Input } from "@/components/common/Input/Input";

const [title, setTitle] = useState("");
const [error, setError] = useState("");

const handleChange = (e) => {
  const value = e.target.value;
  setTitle(value);

  if (value.length < 3) {
    setError("Title must be at least 3 characters");
  } else {
    setError("");
  }
};

<Input
  label="Adventure Title"
  value={title}
  onChange={handleChange}
  error={error}
/>;
```

### With Ref for Focus Management

```tsx
import { useRef } from "react";
import { Input } from "@/components/common/Input/Input";

const MyForm = () => {
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!title) {
      titleInputRef.current?.focus();
      return;
    }
    // Submit form...
  };

  return (
    <form>
      <Input
        ref={titleInputRef}
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </form>
  );
};
```

### Different Input Types

```tsx
// Email input
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="you@example.com"
/>

// Password input
<Input
  label="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

// Number input
<Input
  label="Passage Count"
  type="number"
  value={passageCount}
  onChange={(e) => setPassageCount(e.target.value)}
  min="1"
/>
```

### With Placeholder

```tsx
<Input
  label="Author Name"
  placeholder="Enter author name..."
  value={author}
  onChange={(e) => setAuthor(e.target.value)}
/>
```

### Disabled State

```tsx
<Input label="Adventure ID" value={adventureId} disabled />
```

### Required Input

```tsx
<Input
  label="Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  required
  error={!title ? "Title is required" : ""}
/>
```

## Form Integration

### Controlled Input

```tsx
const AdventureForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
  });

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <form>
      <Input
        label="Title"
        value={formData.title}
        onChange={handleChange("title")}
      />
      <Input
        label="Author"
        value={formData.author}
        onChange={handleChange("author")}
      />
    </form>
  );
};
```

### With Validation

```tsx
const validateTitle = (title: string): string => {
  if (!title) return "Title is required";
  if (title.length < 3) return "Title must be at least 3 characters";
  if (title.length > 100) return "Title must be less than 100 characters";
  return "";
};

const [title, setTitle] = useState("");
const [titleError, setTitleError] = useState("");

const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setTitle(value);
  setTitleError(validateTitle(value));
};

<Input
  label="Adventure Title"
  value={title}
  onChange={handleTitleChange}
  error={titleError}
  required
/>;
```

## Accessibility

- **Label Association**: Label properly associated with input via `htmlFor`
- **Error Messaging**: Error has unique ID and linked via `aria-describedby`
- **Invalid State**: `aria-invalid` set to true when error exists
- **Role**: Implicit `role="textbox"` from input element
- **Alert**: Error message has `role="alert"` for screen reader announcements
- **Auto-Generated IDs**: Ensures unique IDs for multiple instances

## ID Generation

If no `id` prop is provided, the component generates one from the label:

```tsx
<Input label="Adventure Title" />
// Generated ID: "input-adventure-title"

<Input label="Email Address" />
// Generated ID: "input-email-address"
```

Custom ID:

```tsx
<Input label="Title" id="custom-title-input" />
```

## Styling

- **Container**: Uses `InputContainer` styled component
- **Label**: Styled with proper spacing and typography
- **Input**: Visual error state when `error` prop is present
- **Error Message**: Red color with appropriate spacing
- Uses color helper functions and CSS variables

## Best Practices

1. **Clear Labels**: Use descriptive, concise labels
2. **Error Messages**: Provide specific, actionable error messages
3. **Validation Timing**: Consider when to show errors (on blur, on submit, etc.)
4. **Required Fields**: Mark required fields in label or use `required` attribute
5. **Placeholder Usage**: Use placeholders for format examples, not instructions
6. **Type Attribute**: Use appropriate `type` for better mobile keyboards
7. **Ref Usage**: Use refs for focus management after validation failures

## Common Validation Patterns

```tsx
// On blur validation
<Input
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  onBlur={() => setEmailError(validateEmail(email))}
  error={emailError}
/>;

// Real-time validation (debounced)
const debouncedValidate = useMemo(
  () => debounce((value) => setError(validate(value)), 300),
  []
);

<Input
  label="Title"
  value={title}
  onChange={(e) => {
    setTitle(e.target.value);
    debouncedValidate(e.target.value);
  }}
  error={error}
/>;
```
