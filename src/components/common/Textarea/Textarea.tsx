import type { TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";
import {
  TextareaContainer,
  Label,
  StyledTextarea,
  ErrorMessage,
} from "./Textarea.styles";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  "data-testid"?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className, "data-testid": testId, ...props }, ref) => {
    const textareaId =
      id || `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const errorId = error ? `${textareaId}-error` : undefined;

    return (
      <TextareaContainer className={className}>
        <Label htmlFor={textareaId}>{label}</Label>
        <StyledTextarea
          ref={ref}
          id={textareaId}
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
      </TextareaContainer>
    );
  }
);

Textarea.displayName = "Textarea";
