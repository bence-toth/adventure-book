# FormattedDate Component

A simple component that formats dates into user-friendly relative time strings (e.g., "2 hours ago", "Just now").

## Features

- **Relative Time**: Shows time relative to now for recent dates
- **Automatic Formatting**: Switches to absolute date for older dates
- **Multiple Units**: Minutes, hours, and days
- **Fallback Format**: Uses locale date format for dates older than a week

## Props

| Prop   | Type   | Default      | Description           |
| ------ | ------ | ------------ | --------------------- |
| `date` | `Date` | **Required** | Date object to format |

## Usage Examples

### Basic Usage

```tsx
import { FormattedDate } from "@/components/common/FormattedDate/FormattedDate";

<FormattedDate date={new Date()} />
// Output: "Just now"

<FormattedDate date={new Date(Date.now() - 5 * 60 * 1000)} />
// Output: "5 minutes ago"

<FormattedDate date={new Date(Date.now() - 3 * 60 * 60 * 1000)} />
// Output: "3 hours ago"
```

## Format Rules

The component uses the following logic to format dates:

| Time Difference | Format             | Example                                      |
| --------------- | ------------------ | -------------------------------------------- |
| < 1 minute      | "Just now"         | "Just now"                                   |
| < 1 hour        | "X minute(s) ago"  | "5 minutes ago", "1 minute ago"              |
| < 24 hours      | "X hour(s) ago"    | "3 hours ago", "1 hour ago"                  |
| < 7 days        | "X day(s) ago"     | "2 days ago", "1 day ago"                    |
| ≥ 7 days        | Locale date string | "12/7/2023", "7/12/2023" (depends on locale) |

## Behavior

- **Singular/Plural**: Automatically handles singular ("1 hour ago") vs plural ("2 hours ago")
- **Locale-Aware**: Uses `toLocaleDateString()` for older dates
- **Static Output**: Does not auto-update (render once with current time)
- **Renders Text**: Outputs plain text (no wrapper element)

## Implementation Details

### Calculation Logic

```typescript
const now = new Date();
const diffMs = now.getTime() - date.getTime();
const diffMins = Math.floor(diffMs / 60000);
const diffHours = Math.floor(diffMs / 3600000);
const diffDays = Math.floor(diffMs / 86400000);
```

- Uses millisecond differences for accuracy
- Floors values to show complete units
- Compares against thresholds in order

### No Auto-Refresh

The component does **not** automatically refresh as time passes. If you need live updates:

```tsx
// Manual refresh approach
const [, setTick] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setTick((tick) => tick + 1);
  }, 60000); // Refresh every minute

  return () => clearInterval(interval);
}, []);

<FormattedDate date={adventure.updatedAt} />;
```

## Accessibility

- Renders plain text (no semantic wrapper)
- Screen readers announce the formatted text naturally
- Consider adding a `title` attribute with full timestamp if needed:

```tsx
const FormattedDateWithTitle = ({ date }) => (
  <span title={date.toLocaleString()}>
    <FormattedDate date={date} />
  </span>
);
```

## Best Practices

1. **Recent Dates**: Most useful for recent dates (within a week)
2. **Timestamp Tooltips**: Consider showing full timestamp on hover
3. **Context**: Use in contexts where relative time is meaningful
4. **Input Validation**: Ensure valid Date objects are passed
5. **Future Dates**: Component doesn't handle future dates specially

## Limitations

1. **No Live Updates**: Doesn't refresh automatically
2. **No Customization**: Format rules are fixed
3. **English Only**: Relative strings are in English (not i18n)
4. **No Time Zones**: Uses local time zone
