# Textarea Component

An accessible multi-line text input component with label, error messaging, and full keyboard support.

## Features

- **Multi-Line Input**: Native `<textarea>` element for longer text
- **Integrated Label**: Built-in label with proper association
- **Error Display**: Error message with appropriate ARIA attributes
- **Auto-Generated IDs**: Automatic ID generation from label
- **Forward Ref**: Supports ref forwarding for focus management
- **Type Safety**: Full TypeScript support with HTML textarea attributes
- **Accessibility**: Complete ARIA support and semantic HTML

## Props

| Prop          | Type     | Default        | Description                          |
| ------------- | -------- | -------------- | ------------------------------------ |
| `label`       | `string` | **Required**   | Label text for the textarea          |
| `error`       | `string` | -              | Error message to display             |
| `id`          | `string` | Auto-generated | Unique identifier for textarea       |
| `className`   | `string` | -              | Additional CSS classes for container |
| `data-testid` | `string` | -              | Test identifier                      |

Extends all standard `TextareaHTMLAttributes<HTMLTextAreaElement>` props (`value`, `onChange`, `placeholder`, `disabled`, `required`, `rows`, `cols`, etc.).

## Usage Examples

### Basic Textarea

```tsx
import { Textarea } from "@/components/common/Textarea/Textarea";

<Textarea
  label="Adventure Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>;
```

### With Error Message

```tsx
import { Textarea } from "@/components/common/Textarea/Textarea";

const [content, setContent] = useState("");
const [error, setError] = useState("");

const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = e.target.value;
  setContent(value);

  if (value.length < 10) {
    setError("Content must be at least 10 characters");
  } else {
    setError("");
  }
};

<Textarea
  label="Passage Content"
  value={content}
  onChange={handleChange}
  error={error}
/>;
```

### With Placeholder and Rows

```tsx
<Textarea
  label="Notes"
  placeholder="Enter your notes here..."
  rows={8}
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
/>
```

### With Ref for Focus Management

```tsx
import { useRef } from "react";
import { Textarea } from "@/components/common/Textarea/Textarea";

const MyForm = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!content) {
      textareaRef.current?.focus();
      return;
    }
    // Submit form...
  };

  return (
    <form>
      <Textarea
        ref={textareaRef}
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </form>
  );
};
```

### Required Field

```tsx
<Textarea
  label="Message"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  required
  error={!message ? "Message is required" : ""}
/>
```

### Disabled State

```tsx
<Textarea label="Generated Text" value={generatedText} disabled />
```

### With Character Count

```tsx
const MAX_LENGTH = 500;
const [text, setText] = useState("");

const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = e.target.value;
  if (value.length <= MAX_LENGTH) {
    setText(value);
  }
};

<>
  <Textarea
    label="Story Summary"
    value={text}
    onChange={handleChange}
    maxLength={MAX_LENGTH}
  />
  <p>
    {text.length} / {MAX_LENGTH} characters
  </p>
</>;
```

## Form Integration

### Controlled Textarea

```tsx
const AdventureForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
  });

  const handleFieldChange =
    (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <Textarea
        label="Description"
        value={formData.description}
        onChange={handleFieldChange("description")}
        rows={4}
      />

      <Textarea
        label="Content"
        value={formData.content}
        onChange={handleFieldChange("content")}
        rows={10}
      />
    </form>
  );
};
```

### With Validation

```tsx
const validateContent = (content: string): string => {
  if (!content) return "Content is required";
  if (content.length < 50) return "Content must be at least 50 characters";
  if (content.length > 5000) return "Content must be less than 5000 characters";
  return "";
};

const [content, setContent] = useState("");
const [contentError, setContentError] = useState("");

const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = e.target.value;
  setContent(value);
  setContentError(validateContent(value));
};

<Textarea
  label="Passage Content"
  value={content}
  onChange={handleContentChange}
  error={contentError}
  required
  rows={8}
/>;
```

## Accessibility

- **Label Association**: Label properly associated with textarea via `htmlFor`
- **Error Messaging**: Error has unique ID and linked via `aria-describedby`
- **Invalid State**: `aria-invalid` set to true when error exists
- **Role**: Implicit `role="textbox"` with `multiline` from textarea element
- **Alert**: Error message has `role="alert"` for screen reader announcements
- **Auto-Generated IDs**: Ensures unique IDs for multiple instances

## ID Generation

If no `id` prop is provided, the component generates one from the label:

```tsx
<Textarea label="Story Content" />
// Generated ID: "textarea-story-content"

<Textarea label="Author Bio" />
// Generated ID: "textarea-author-bio"
```

Custom ID:

```tsx
<Textarea label="Content" id="custom-content-textarea" />
```

## Styling

- **Container**: Uses `TextareaContainer` styled component
- **Label**: Styled with proper spacing and typography
- **Textarea**: Visual error state when `error` prop is present
- **Error Message**: Red color with appropriate spacing
- **Resize**: Vertical resize by default (can be customized)
- Uses color helper functions and CSS variables

## Best Practices

1. **Clear Labels**: Use descriptive, concise labels
2. **Row Count**: Set appropriate `rows` for expected content length
3. **Placeholder Usage**: Use for format examples, not instructions
4. **Error Messages**: Provide specific, actionable error messages
5. **Validation Timing**: Consider when to show errors (on blur, on submit, etc.)
6. **Required Fields**: Mark required fields clearly
7. **Character Limits**: Show character count for limited fields
8. **Resize Control**: Allow vertical resize for user preference

## Common Patterns

### Auto-Resize Textarea

```tsx
import { useEffect, useRef } from "react";

const AutoResizeTextarea = ({ value, onChange, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <Textarea ref={textareaRef} value={value} onChange={onChange} {...props} />
  );
};
```

### With Markdown Preview

```tsx
const [content, setContent] = useState("");
const [showPreview, setShowPreview] = useState(false);

<>
  <ToggleButton
    label="Show Preview"
    isChecked={showPreview}
    onChange={setShowPreview}
  />

  {showPreview ? (
    <div dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }} />
  ) : (
    <Textarea
      label="Markdown Content"
      value={content}
      onChange={(e) => setContent(e.target.value)}
      rows={15}
    />
  )}
</>;
```

### With Validation on Blur

```tsx
<Textarea
  label="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  onBlur={() => setDescriptionError(validateDescription(description))}
  error={descriptionError}
/>
```

## Differences from Input

| Feature  | Textarea              | Input                     |
| -------- | --------------------- | ------------------------- |
| Content  | Multi-line text       | Single-line text          |
| Element  | `<textarea>`          | `<input>`                 |
| Sizing   | `rows` and `cols`     | `size`                    |
| Resize   | User-resizable        | Fixed height              |
| Use Case | Long text, paragraphs | Short text, single values |

## When to Use

**Use Textarea when:**

- Accepting multi-line text (descriptions, comments, content)
- Text length is more than a few words
- Users need to see multiple lines at once
- Line breaks are important

**Use Input when:**

- Single-line text (names, titles, emails)
- Specific data types (numbers, dates, URLs)
- Short, constrained values
