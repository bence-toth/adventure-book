# ToggleButton Component

An accessible toggle switch component for boolean values, styled as a modern switch with proper ARIA support.

## Features

- **Toggle Switch**: Visual switch UI (not a checkbox appearance)
- **Controlled Component**: Requires `isChecked` and `onChange` props
- **Accessible**: Uses checkbox input with switch role
- **Keyboard Support**: Space to toggle, focus indication
- **Label Integration**: Built-in label with proper association
- **Forward Ref**: Supports ref forwarding for focus management
- **Auto-Generated Name**: Automatic name attribute from label

## Props

| Prop          | Type                           | Default               | Description                         |
| ------------- | ------------------------------ | --------------------- | ----------------------------------- |
| `label`       | `string`                       | **Required**          | Label text displayed next to switch |
| `isChecked`   | `boolean`                      | **Required**          | Current checked state               |
| `onChange`    | `(isChecked: boolean) => void` | **Required**          | Callback when state changes         |
| `id`          | `string`                       | -                     | Unique identifier for input         |
| `name`        | `string`                       | Auto-generated        | Form field name                     |
| `aria-label`  | `string`                       | Falls back to `label` | Accessible label                    |
| `data-testid` | `string`                       | -                     | Test identifier                     |

Extends `Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange">` (all standard input props except `type` and `onChange`).

## Usage Examples

### Basic Toggle

```tsx
import { useState } from "react";
import { ToggleButton } from "@/components/common/ToggleButton/ToggleButton";

const [isEnabled, setIsEnabled] = useState(false);

<ToggleButton
  label="Enable notifications"
  isChecked={isEnabled}
  onChange={setIsEnabled}
/>;
```

### Multiple Toggles

```tsx
const [settings, setSettings] = useState({
  notifications: false,
  darkMode: false,
  autoSave: true,
});

const handleToggle = (key: keyof typeof settings) => (checked: boolean) => {
  setSettings((prev) => ({
    ...prev,
    [key]: checked,
  }));
};

<>
  <ToggleButton
    label="Enable notifications"
    isChecked={settings.notifications}
    onChange={handleToggle("notifications")}
  />

  <ToggleButton
    label="Dark mode"
    isChecked={settings.darkMode}
    onChange={handleToggle("darkMode")}
  />

  <ToggleButton
    label="Auto-save"
    isChecked={settings.autoSave}
    onChange={handleToggle("autoSave")}
  />
</>;
```

### With Disabled State

```tsx
<ToggleButton
  label="Premium feature"
  isChecked={isPremiumEnabled}
  onChange={setIsPremiumEnabled}
  disabled={!isPremiumUser}
/>
```

### In Form

```tsx
const SettingsForm = () => {
  const [formData, setFormData] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newsletter: false,
  });

  const handleToggle = (field: string) => (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Settings:", formData);
    // Save settings...
  };

  return (
    <form onSubmit={handleSubmit}>
      <ToggleButton
        label="Email notifications"
        isChecked={formData.emailNotifications}
        onChange={handleToggle("emailNotifications")}
        name="email-notifications"
      />

      <ToggleButton
        label="Push notifications"
        isChecked={formData.pushNotifications}
        onChange={handleToggle("pushNotifications")}
        name="push-notifications"
      />

      <ToggleButton
        label="Subscribe to newsletter"
        isChecked={formData.newsletter}
        onChange={handleToggle("newsletter")}
        name="newsletter"
      />

      <Button type="submit">Save Settings</Button>
    </form>
  );
};
```

### With Ref for Focus Management

```tsx
import { useRef } from "react";
import { ToggleButton } from "@/components/common/ToggleButton/ToggleButton";

const MyComponent = () => {
  const toggleRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    toggleRef.current?.focus();
  };

  return (
    <ToggleButton
      ref={toggleRef}
      label="Enable feature"
      isChecked={isEnabled}
      onChange={setIsEnabled}
    />
  );
};
```

### With Custom Name

```tsx
<ToggleButton
  label="Auto-save"
  isChecked={autoSave}
  onChange={setAutoSave}
  name="settings[auto_save]" // Custom form field name
/>
```

## Behavior

### Visual States

1. **Unchecked**: Track is neutral color, thumb positioned on left
2. **Checked**: Track is primary color (turquoise), thumb positioned on right
3. **Disabled Unchecked**: Reduced opacity, no interaction
4. **Disabled Checked**: Reduced opacity with primary color, no interaction
5. **Focus**: Visible outline around track

### Interaction

- **Click**: Toggles state
- **Space Key**: Toggles state
- **Enter Key**: Submits form (if in form)
- **Disabled**: No interaction, visual indication

## Accessibility

- **Switch Role**: Uses `role="switch"` for proper semantics
- **ARIA Checked**: `aria-checked` reflects current state
- **Hidden Input**: Visually hidden checkbox for form submission
- **Keyboard Support**: Space toggles, Tab for navigation
- **Focus Indicator**: Clear visual focus state
- **Label Association**: Implicit association via container
- **Screen Readers**: Announces as "switch" with checked/unchecked state

## Name Generation

If no `name` prop is provided, the component generates one from the label:

```tsx
<ToggleButton label="Dark Mode" isChecked={dark} onChange={setDark} />
// Generated name: "dark-mode"

<ToggleButton label="Auto Save Files" isChecked={auto} onChange={setAuto} />
// Generated name: "auto-save-files"
```

Custom name:

```tsx
<ToggleButton
  label="Enable"
  name="feature_enabled"
  isChecked={enabled}
  onChange={setEnabled}
/>
```

## Styling

- **Track**: Rounded pill-shaped background
- **Thumb**: Circular element that slides left/right
- **Colors**: Uses `getInteractiveColor()` for state-based colors
- **Animation**: Smooth transition when toggling
- **Label**: Positioned next to switch with proper spacing
- Uses CSS variables for consistent sizing and spacing

## Best Practices

1. **Clear Labels**: Use concise, action-oriented labels
2. **Positive Framing**: Frame as "Enable X" not "Disable X"
3. **Immediate Effect**: Toggle should take effect immediately
4. **Loading States**: Use disabled state during async operations
5. **Group Related**: Group related toggles together
6. **Feedback**: Provide feedback for important state changes
7. **Default State**: Set sensible default values

## Common Patterns

### Settings Panel

```tsx
const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    sound: false,
    vibration: true,
  });

  return (
    <section>
      <h2>Preferences</h2>

      <ToggleButton
        label="Enable notifications"
        isChecked={settings.notifications}
        onChange={(checked) =>
          setSettings({ ...settings, notifications: checked })
        }
      />

      <ToggleButton
        label="Sound effects"
        isChecked={settings.sound}
        onChange={(checked) => setSettings({ ...settings, sound: checked })}
        disabled={!settings.notifications}
      />

      <ToggleButton
        label="Vibration"
        isChecked={settings.vibration}
        onChange={(checked) => setSettings({ ...settings, vibration: checked })}
        disabled={!settings.notifications}
      />
    </section>
  );
};
```

### With Confirmation

```tsx
const [isEnabled, setIsEnabled] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);

const handleToggle = (checked: boolean) => {
  if (checked) {
    // Enabling - show confirmation for important feature
    setShowConfirm(true);
  } else {
    // Disabling - no confirmation needed
    setIsEnabled(false);
  }
};

const handleConfirm = () => {
  setIsEnabled(true);
  setShowConfirm(false);
};

<>
  <ToggleButton
    label="Enable experimental features"
    isChecked={isEnabled}
    onChange={handleToggle}
  />

  <ModalDialog
    isOpen={showConfirm}
    onOpenChange={() => setShowConfirm(false)}
    title="Enable Experimental Features"
    message="Experimental features may be unstable. Continue?"
    actions={[
      { label: "Cancel", onClick: () => setShowConfirm(false) },
      { label: "Enable", onClick: handleConfirm, variant: "primary" },
    ]}
  />
</>;
```

### With Async Update

```tsx
const [isEnabled, setIsEnabled] = useState(false);
const [isSaving, setIsSaving] = useState(false);

const handleToggle = async (checked: boolean) => {
  setIsSaving(true);
  try {
    await updateSetting("feature-enabled", checked);
    setIsEnabled(checked);
  } catch (error) {
    alert("Failed to save setting");
  } finally {
    setIsSaving(false);
  }
};

<ToggleButton
  label="Enable feature"
  isChecked={isEnabled}
  onChange={handleToggle}
  disabled={isSaving}
/>;
```

## Differences from Checkbox

| Feature     | ToggleButton       | Checkbox                |
| ----------- | ------------------ | ----------------------- |
| Visual      | Switch UI          | Check mark              |
| Use Case    | On/off states      | Selection/confirmation  |
| Semantics   | `role="switch"`    | `role="checkbox"`       |
| Expectation | Immediate effect   | Part of form submission |
| Typical Use | Settings, features | Form selections, lists  |

## When to Use

**Use ToggleButton when:**

- Enabling/disabling features or settings
- Immediate effect is expected
- Binary on/off state
- Modern switch UI is desired

**Use Checkbox when:**

- Selecting items from a list
- Multiple selections in a form
- Traditional form patterns
- Submission-based actions

**Use Button when:**

- Actions (not state)
- Multiple options beyond on/off
- Commands or operations
