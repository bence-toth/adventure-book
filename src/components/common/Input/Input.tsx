import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import {
  InputContainer,
  Label,
  StyledInput,
  ErrorMessage,
} from "./Input.styles";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  "data-testid"?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, "data-testid": testId, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <InputContainer className={className}>
        <Label htmlFor={inputId}>{label}</Label>
        <StyledInput
          ref={ref}
          id={inputId}
          $hasError={!!error}
          aria-invalid={!!error}
          aria-describedby={errorId}
          data-testid={testId}
          {...props}
        />
        {error && (
          <ErrorMessage id={errorId} role="alert">
            {error}
          </ErrorMessage>
        )}
      </InputContainer>
    );
  }
);

Input.displayName = "Input";
