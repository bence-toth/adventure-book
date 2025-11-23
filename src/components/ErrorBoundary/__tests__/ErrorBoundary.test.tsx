import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ErrorBoundary } from "../ErrorBoundary";
import {
  AdventureLoadError,
  AdventureNotFoundError,
  InvalidPassageIdError,
  PassageNotFoundError,
  AdventureParseError,
  AdventureValidationError,
  StoriesLoadError,
  StoryCreateError,
  StoryDeleteError,
} from "@/utils/errors";

// Component that throws an error for testing
const ThrowError = ({ error }: { error?: Error }) => {
  if (error) {
    throw error;
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("renders error UI when child component throws", () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError error={new Error("Test error")} />
      </ErrorBoundary>
    );

    // Check that error UI is rendered
    expect(screen.getByText("A system error occurred")).toBeInTheDocument();
    expect(screen.getAllByText("Test error").length).toBeGreaterThan(0);
    expect(screen.getByText("Reload page")).toBeInTheDocument();

    // Verify console.error was called
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error caught by boundary:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("shows technical details when available", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError error={new Error("Test error with details")} />
      </ErrorBoundary>
    );

    // Check technical details are available
    expect(screen.getByText("Show technical details")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  describe("Custom Error Types", () => {
    it("handles AdventureLoadError correctly", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError error={new AdventureLoadError()} />
        </ErrorBoundary>
      );

      expect(
        screen.getAllByText("Unable to load the adventure. Please try again.")
          .length
      ).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });

    it("handles AdventureNotFoundError correctly", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError error={new AdventureNotFoundError()} />
        </ErrorBoundary>
      );

      expect(
        screen.getAllByText("Adventure not found.").length
      ).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });

    it("handles InvalidPassageIdError correctly", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError error={new InvalidPassageIdError("abc")} />
        </ErrorBoundary>
      );

      expect(
        screen.getAllByText(
          'The passage ID "abc" is not valid. Please use a valid number.'
        ).length
      ).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });

    it("handles PassageNotFoundError correctly", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError error={new PassageNotFoundError(99)} />
        </ErrorBoundary>
      );

      expect(
        screen.getAllByText("Passage #99 does not exist in this adventure.")
          .length
      ).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });

    it("handles AdventureParseError correctly", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError error={new AdventureParseError()} />
        </ErrorBoundary>
      );

      expect(
        screen.getAllByText(
          "There was an error parsing the adventure file. The adventure format may be invalid."
        ).length
      ).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });

    it("handles AdventureValidationError correctly", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError error={new AdventureValidationError()} />
        </ErrorBoundary>
      );

      expect(
        screen.getAllByText(
          "The adventure file contains validation errors and cannot be loaded."
        ).length
      ).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });

    it("handles StoriesLoadError correctly", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError error={new StoriesLoadError()} />
        </ErrorBoundary>
      );

      expect(
        screen.getAllByText("Failed to load stories.").length
      ).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });

    it("handles StoryCreateError correctly", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError error={new StoryCreateError()} />
        </ErrorBoundary>
      );

      expect(
        screen.getAllByText("Failed to create adventure.").length
      ).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });

    it("handles StoryDeleteError correctly", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError error={new StoryDeleteError()} />
        </ErrorBoundary>
      );

      expect(
        screen.getAllByText("Failed to delete adventure.").length
      ).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });
  });

  it("provides fallback message for unknown errors", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError error={new Error("Some unknown error")} />
      </ErrorBoundary>
    );

    expect(screen.getAllByText("Some unknown error").length).toBeGreaterThan(0);

    consoleSpy.mockRestore();
  });

  it("displays error name in technical details", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError error={new AdventureLoadError()} />
      </ErrorBoundary>
    );

    // Technical details should show the error type
    expect(screen.getByText("Show technical details")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
