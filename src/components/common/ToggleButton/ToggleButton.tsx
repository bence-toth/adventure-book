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
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  "data-testid"?: string;
  "aria-label"?: string;
  id?: string;
  name?: string;
}

export const ToggleButton = forwardRef<HTMLInputElement, ToggleButtonProps>(
  (
    {
      label,
      isChecked,
      onChange,
      "data-testid": testId,
      "aria-label": ariaLabel,
      id,
      name,
      ...props
    },
    ref
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.checked);
    };

    // Generate a fallback name from the label if not provided
    const checkboxName = name || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <ToggleButtonContainer>
        <HiddenCheckbox
          ref={ref}
          id={id}
          name={checkboxName}
          checked={isChecked}
          onChange={handleChange}
          data-testid={testId}
          aria-label={ariaLabel || label}
          role="switch"
          aria-checked={isChecked}
          {...props}
        />
        <ToggleTrack $isChecked={isChecked}>
          <ToggleThumb $isChecked={isChecked} />
        </ToggleTrack>
        <LabelText>{label}</LabelText>
      </ToggleButtonContainer>
    );
  }
);

ToggleButton.displayName = "ToggleButton";
