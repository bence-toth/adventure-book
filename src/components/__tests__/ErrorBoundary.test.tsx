import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ErrorBoundary } from "../ErrorBoundary";

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error for boundary");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("renders error UI when child component throws", () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Check that error UI is rendered
    expect(screen.getByText("A system error occurred")).toBeInTheDocument();
    expect(
      screen.getByText(/An error occurred while loading the story/)
    ).toBeInTheDocument();
    expect(screen.getByText("Reload page")).toBeInTheDocument();

    // Verify console.error was called
    expect(consoleSpy).toHaveBeenCalledWith(
      "Story loading error caught by boundary:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("shows technical details when expanded", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Check technical details are available
    expect(screen.getByText("Technical details")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("categorizes YAML parsing errors correctly", () => {
    const YAMLError = () => {
      throw new Error("YAML parsing failed: invalid syntax");
    };

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <YAMLError />
      </ErrorBoundary>
    );

    expect(
      screen.getByText(
        /There was an error parsing the story file. The story format may be invalid./
      )
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("categorizes validation errors correctly", () => {
    const ValidationError = () => {
      throw new Error("Story validation failed: missing title");
    };

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ValidationError />
      </ErrorBoundary>
    );

    expect(
      screen.getByText(
        /The story file contains validation errors and cannot be loaded./
      )
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("provides fallback message for unknown errors", () => {
    const UnknownError = () => {
      throw new Error("Something went wrong");
    };

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <UnknownError />
      </ErrorBoundary>
    );

    expect(
      screen.getByText(/An error occurred while loading the story/)
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
