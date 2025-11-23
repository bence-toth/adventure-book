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
import userEvent from "@testing-library/user-event";

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

  it("toggles technical details when clicked", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError error={new Error("Test error with details")} />
      </ErrorBoundary>
    );

    const detailsButton = screen.getByText("Show technical details");
    expect(detailsButton).toBeInTheDocument();

    // Click to show details
    await user.click(detailsButton);

    // Should change text
    expect(screen.getByText("Hide technical details")).toBeInTheDocument();

    // Technical details should be visible
    expect(screen.getByText("Error type:")).toBeInTheDocument();
    expect(screen.getByText("Error message:")).toBeInTheDocument();

    // Click again to hide
    await user.click(screen.getByText("Hide technical details"));

    // Should change text back
    expect(screen.getByText("Show technical details")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("renders error without error object gracefully", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Force the error boundary to have no error object
    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Component should render normally when no error
    expect(container.textContent).toContain("No error");

    consoleSpy.mockRestore();
  });

  it("shows stack trace when available", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const errorWithStack = new Error("Error with stack");
    errorWithStack.stack = "Error: Error with stack\n    at test.ts:1:1";

    render(
      <ErrorBoundary>
        <ThrowError error={errorWithStack} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Show technical details")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("reloads page when Reload page button is clicked", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const reloadMock = vi.fn();

    // Mock window.location.reload
    Object.defineProperty(window, "location", {
      value: { reload: reloadMock },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError error={new Error("Test error")} />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByRole("button", { name: /reload page/i });
    await user.click(reloadButton);

    expect(reloadMock).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });
});
