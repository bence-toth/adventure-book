import React, { Component } from "react";
import type { ReactNode } from "react";
import { Button } from "./common/Button";
import { DetailsButton } from "./common/DetailsButton";
import "./ErrorBoundary.css";

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
        <div className="error-boundary">
          <h1 className="error-boundary-title">A system error occurred</h1>
          <p className="error-boundary-description">{getErrorMessage()}</p>
          <div className="error-boundary-actions">
            <Button onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </div>
          <div className="error-boundary-help">
            <p className="error-boundary-help-text">
              If this problem persists, the story file may need to be fixed.
            </p>
            {error && (
              <DetailsButton
                summary="Technical details"
                className="error-boundary-details"
                role="region"
                aria-label="Technical details"
              >
                <pre className="error-boundary-details-content error-boundary-details-content-error">
                  {error.message}
                </pre>
                {error.stack && (
                  <pre className="error-boundary-details-content error-boundary-details-content-stack">
                    {error.stack}
                  </pre>
                )}
                <p className="error-boundary-help-text">
                  Check the browser console for more details.
                </p>
              </DetailsButton>
            )}
          </div>
        </div>
      </div>
    );
  };
}
