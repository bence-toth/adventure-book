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
  detailsOpen: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, detailsOpen: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, detailsOpen: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error for debugging
    console.error("Error caught by boundary:", error);
    console.error("Error details:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.renderErrorFallback();
    }

    return this.props.children;
  }

  private handleDetailsToggle = () => {
    this.setState((prevState) => ({
      detailsOpen: !prevState.detailsOpen,
    }));
  };

  private renderErrorFallback = () => {
    const { error } = this.state;

    // For AdventureBookError instances, use their message directly
    const errorMessage = error!.message;

    return (
      <ErrorBoundaryContainer>
        <ErrorBoundaryTitle>A system error occurred</ErrorBoundaryTitle>
        <ErrorBoundaryDescription>{errorMessage}</ErrorBoundaryDescription>
        <ErrorBoundaryActions>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </ErrorBoundaryActions>
        <ErrorBoundaryHelp>
          <ErrorBoundaryHelpText>
            If this problem persists, the adventure file may need to be fixed.
          </ErrorBoundaryHelpText>
          {error && (
            <DetailsButton
              summary={
                this.state.detailsOpen
                  ? "Hide technical details"
                  : "Show technical details"
              }
              className="error-boundary-details"
              role="region"
              aria-label="Technical details"
              onToggle={this.handleDetailsToggle}
            >
              <ErrorBoundaryDetailsContent isError>
                <strong>Error type:</strong> {error.name}
              </ErrorBoundaryDetailsContent>
              <ErrorBoundaryDetailsContent isError>
                <strong>Error message:</strong> {error.message}
              </ErrorBoundaryDetailsContent>
              {error.stack && (
                <ErrorBoundaryDetailsContent>
                  <strong>Stack trace:</strong>
                  <pre>{error.stack}</pre>
                </ErrorBoundaryDetailsContent>
              )}
              <ErrorBoundaryHelpText>
                Check the browser console for more details.
              </ErrorBoundaryHelpText>
            </DetailsButton>
          )}
        </ErrorBoundaryHelp>
      </ErrorBoundaryContainer>
    );
  };
}
