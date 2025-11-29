import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import {
  ToggleButtonContainer,
  HiddenCheckbox,
  ToggleTrack,
  ToggleThumb,
  LabelText,
} from "./ToggleButton.styles";

interface ToggleButtonProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  "data-testid"?: string;
  "aria-label"?: string;
}

export const ToggleButton = forwardRef<HTMLInputElement, ToggleButtonProps>(
  (
    {
      label,
      checked,
      onChange,
      "data-testid": testId,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.checked);
    };

    return (
      <ToggleButtonContainer>
        <HiddenCheckbox
          ref={ref}
          checked={checked}
          onChange={handleChange}
          data-testid={testId}
          aria-label={ariaLabel || label}
          role="switch"
          aria-checked={checked}
          {...props}
        />
        <ToggleTrack $checked={checked}>
          <ToggleThumb $checked={checked} />
        </ToggleTrack>
        <LabelText>{label}</LabelText>
      </ToggleButtonContainer>
    );
  }
);

ToggleButton.displayName = "ToggleButton";
