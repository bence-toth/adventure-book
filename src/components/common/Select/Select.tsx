import type { SelectHTMLAttributes } from "react";
import { forwardRef } from "react";
import {
  SelectContainer,
  Label,
  StyledSelect,
  ErrorMessage,
} from "./Select.styles";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  "data-testid"?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      placeholder,
      id,
      className,
      "data-testid": testId,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <SelectContainer className={className}>
        <Label htmlFor={selectId}>{label}</Label>
        <StyledSelect
          ref={ref}
          id={selectId}
          $hasError={!!error}
          aria-invalid={!!error}
          aria-describedby={errorId}
          data-testid={testId}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>
        {error && (
          <ErrorMessage id={errorId} role="alert">
            {error}
          </ErrorMessage>
        )}
      </SelectContainer>
    );
  }
);

Select.displayName = "Select";
