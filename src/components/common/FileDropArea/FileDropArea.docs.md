# FileDropArea Component

A drag-and-drop file upload component that wraps content and provides visual feedback during file dragging operations.

## Features

- **Drag and Drop**: Visual feedback when files are dragged over the area
- **Overlay Indicator**: Semi-transparent overlay with drop message
- **File Validation**: Callback receives dropped file for validation
- **Disabled State**: Can be disabled to prevent file drops
- **Wrapper Pattern**: Wraps existing content without disrupting layout

## Props

| Prop          | Type                   | Default      | Description                             |
| ------------- | ---------------------- | ------------ | --------------------------------------- |
| `children`    | `ReactNode`            | **Required** | Content to wrap with drop functionality |
| `onFileDrop`  | `(file: File) => void` | **Required** | Callback when file is dropped           |
| `dropLabel`   | `string`               | **Required** | Text displayed in overlay during drag   |
| `isDisabled`  | `boolean`              | `false`      | Disables file drop functionality        |
| `data-testid` | `string`               | -            | Test identifier                         |

## Usage Examples

### Basic File Drop Area

```tsx
import { FileDropArea } from "@/components/common/FileDropArea/FileDropArea";

const MyComponent = () => {
  const handleFileDrop = (file: File) => {
    console.log("Dropped file:", file.name);
    // Process file...
  };

  return (
    <FileDropArea onFileDrop={handleFileDrop} dropLabel="Drop YAML file here">
      <div>
        <h2>Adventure Editor</h2>
        <p>Drag and drop a YAML file to import</p>
      </div>
    </FileDropArea>
  );
};
```

### With File Validation

```tsx
import { FileDropArea } from "@/components/common/FileDropArea/FileDropArea";

const YAMLDropArea = () => {
  const handleFileDrop = (file: File) => {
    // Validate file type
    if (!file.name.endsWith(".yaml") && !file.name.endsWith(".yml")) {
      alert("Please drop a YAML file");
      return;
    }

    // Validate file size (e.g., max 1MB)
    if (file.size > 1024 * 1024) {
      alert("File is too large");
      return;
    }

    // Process valid file
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // Handle YAML content...
    };
    reader.readAsText(file);
  };

  return (
    <FileDropArea
      onFileDrop={handleFileDrop}
      dropLabel="Drop YAML file to import"
    >
      <textarea placeholder="Or paste YAML here..." />
    </FileDropArea>
  );
};
```

### Disabled State

```tsx
import { FileDropArea } from "@/components/common/FileDropArea/FileDropArea";

const MyComponent = () => {
  const [isSaving, setIsSaving] = useState(false);

  return (
    <FileDropArea
      onFileDrop={handleFileDrop}
      dropLabel="Drop file here"
      isDisabled={isSaving} // Disable during save operation
    >
      <div>Content</div>
    </FileDropArea>
  );
};
```

### Wrapping Complex Content

```tsx
<FileDropArea onFileDrop={handleFileDrop} dropLabel="Drop adventure YAML file">
  <div className="editor-layout">
    <Sidebar>
      <h3>Adventure Structure</h3>
      {/* Sidebar content */}
    </Sidebar>

    <main>
      <textarea value={yaml} onChange={handleChange} />
    </main>
  </div>
</FileDropArea>
```

## Behavior

### Drag States

1. **Normal State**: No visual changes, children render normally
2. **Drag Enter**: Overlay appears when file is dragged over the area
3. **Drag Over**: Overlay remains visible while hovering
4. **Drag Leave**: Overlay disappears when drag leaves the area
5. **Drop**: Overlay disappears and `onFileDrop` is called with the file

### File Handling

- Only processes the **first file** if multiple files are dropped
- Does **not** automatically read file content (allows parent to control)
- Prevents default browser behavior (opening file in new tab)

## Accessibility

- Uses semantic HTML structure
- Overlay uses appropriate contrast for visibility
- Text in overlay is clearly readable
- No specific ARIA attributes needed (functional, not semantic)

## Styling

- **Container**: Full dimensions of children (transparent wrapper)
- **Overlay**: Fixed position covering entire container with semi-transparent background
- **Overlay Content**: Centered text with high visibility
- Uses CSS variables for colors and spacing

## Implementation Details

### Event Handling

The component handles these drag events:

- `onDragEnter`: Shows overlay
- `onDragLeave`: Hides overlay
- `onDragOver`: Prevents default and allows drop
- `onDrop`: Processes file and hides overlay

### Test IDs

Internal test IDs are available:

- `FILE_DROP_AREA_TEST_IDS.OVERLAY`: For testing overlay visibility

## Best Practices

1. **Clear Instructions**: Use descriptive `dropLabel` text
2. **File Validation**: Validate file type and size in `onFileDrop` callback
3. **Error Handling**: Show user-friendly error messages for invalid files
4. **Visual Feedback**: Ensure overlay is clearly visible against content
5. **Disabled State**: Disable during processing to prevent multiple drops
6. **Fallback Option**: Provide alternative upload method (file input button)

## Common Use Cases

- **YAML Import**: Importing adventure files
- **Image Upload**: Dropping image files
- **Data Import**: CSV, JSON file imports
- **Document Upload**: PDF, text file uploads
- **Multiple Drop Zones**: Different areas for different file types

## Example: Complete YAML Import

```tsx
import { FileDropArea } from "@/components/common/FileDropArea/FileDropArea";
import { parseYAML } from "@/utils";

const AdventureImport = () => {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileDrop = async (file: File) => {
    setError(null);

    // Validate file extension
    if (!file.name.match(/\.(yaml|yml)$/i)) {
      setError("Please drop a YAML file (.yaml or .yml)");
      return;
    }

    setIsProcessing(true);

    try {
      // Read file content
      const text = await file.text();

      // Parse and validate YAML
      const adventure = parseYAML(text);

      // Process adventure...
      console.log("Imported:", adventure);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import file");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <FileDropArea
      onFileDrop={handleFileDrop}
      dropLabel="Drop YAML file to import adventure"
      isDisabled={isProcessing}
    >
      <div className="import-area">
        <h2>Import Adventure</h2>
        {error && <p className="error">{error}</p>}
        {isProcessing && <p>Processing...</p>}
        <p>Drag and drop a YAML file here</p>
      </div>
    </FileDropArea>
  );
};
```
