import React, { Component } from "react";
import type { ReactNode } from "react";
import { Button, DetailsButton } from "@/components/common";
import {
  ErrorBoundaryContainer,
  ErrorBoundaryTitle,
  ErrorBoundaryDescription,
  ErrorBoundaryActions,
  ErrorBoundaryHelp,
  ErrorBoundaryHelpText,
  ErrorBoundaryDetailsContent,
} from "./ErrorBoundary.styles";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error for debugging
    console.error("Story loading error caught by boundary:", error);
    console.error("Error details:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.renderErrorFallback();
    }

    return this.props.children;
  }

  private renderErrorFallback = () => {
    const { error } = this.state;

    const getErrorMessage = () => {
      if (!error) {
        return "An unexpected error occurred while loading the story.";
      }

      const message = error.message;

      if (message.includes("YAML") || message.includes("parsing")) {
        return "There was an error parsing the story file. The story format may be invalid.";
      }

      if (message.includes("validation")) {
        return "The story file contains validation errors and cannot be loaded.";
      }

      if (message.includes("fetch") || message.includes("load")) {
        return "Unable to load the story file. Please check your connection.";
      }

      return "An error occurred while loading the story.";
    };

    return (
      <div className="adventure-book">
        <ErrorBoundaryContainer>
          <ErrorBoundaryTitle>A system error occurred</ErrorBoundaryTitle>
          <ErrorBoundaryDescription>
            {getErrorMessage()}
          </ErrorBoundaryDescription>
          <ErrorBoundaryActions>
            <Button onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </ErrorBoundaryActions>
          <ErrorBoundaryHelp>
            <ErrorBoundaryHelpText>
              If this problem persists, the story file may need to be fixed.
            </ErrorBoundaryHelpText>
            {error && (
              <DetailsButton
                summary="Technical details"
                className="error-boundary-details"
                role="region"
                aria-label="Technical details"
              >
                <ErrorBoundaryDetailsContent $isError>
                  {error.message}
                </ErrorBoundaryDetailsContent>
                {error.stack && (
                  <ErrorBoundaryDetailsContent>
                    {error.stack}
                  </ErrorBoundaryDetailsContent>
                )}
                <ErrorBoundaryHelpText>
                  Check the browser console for more details.
                </ErrorBoundaryHelpText>
              </DetailsButton>
            )}
          </ErrorBoundaryHelp>
        </ErrorBoundaryContainer>
      </div>
    );
  };
}
