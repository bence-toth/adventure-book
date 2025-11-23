import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormattedDate } from "../FormattedDate";

describe("FormattedDate Component", () => {
  let mockNow: Date;

  beforeEach(() => {
    mockNow = new Date("2024-01-15T12:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Relative Time Formatting", () => {
    it("shows 'Just now' for very recent dates (less than 1 minute)", () => {
      const date = new Date("2024-01-15T11:59:30Z"); // 30 seconds ago
      render(<FormattedDate date={date} />);
      expect(screen.getByText("Just now")).toBeInTheDocument();
    });

    it("shows minutes for recent dates (1-59 minutes ago)", () => {
      const date = new Date("2024-01-15T11:30:00Z"); // 30 minutes ago
      render(<FormattedDate date={date} />);
      expect(screen.getByText("30 minutes ago")).toBeInTheDocument();
    });

    it("shows singular 'minute' for 1 minute ago", () => {
      const date = new Date("2024-01-15T11:59:00Z"); // 1 minute ago
      render(<FormattedDate date={date} />);
      expect(screen.getByText("1 minute ago")).toBeInTheDocument();
    });

    it("shows hours for dates within 24 hours", () => {
      const date = new Date("2024-01-15T06:00:00Z"); // 6 hours ago
      render(<FormattedDate date={date} />);
      expect(screen.getByText("6 hours ago")).toBeInTheDocument();
    });

    it("shows singular 'hour' for 1 hour ago", () => {
      const date = new Date("2024-01-15T11:00:00Z"); // 1 hour ago
      render(<FormattedDate date={date} />);
      expect(screen.getByText("1 hour ago")).toBeInTheDocument();
    });

    it("shows days for dates within a week", () => {
      const date = new Date("2024-01-12T12:00:00Z"); // 3 days ago
      render(<FormattedDate date={date} />);
      expect(screen.getByText("3 days ago")).toBeInTheDocument();
    });

    it("shows singular 'day' for 1 day ago", () => {
      const date = new Date("2024-01-14T12:00:00Z"); // 1 day ago
      render(<FormattedDate date={date} />);
      expect(screen.getByText("1 day ago")).toBeInTheDocument();
    });

    it("shows full date for dates older than a week", () => {
      const date = new Date("2024-01-01T12:00:00Z"); // 14 days ago
      render(<FormattedDate date={date} />);
      // Use a more flexible matcher that works with different locale formats
      expect(screen.getByText(/2024|24/)).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles dates at exact boundaries correctly", () => {
      // Exactly 60 minutes (should show hours)
      const date = new Date("2024-01-15T11:00:00Z");
      render(<FormattedDate date={date} />);
      expect(screen.getByText("1 hour ago")).toBeInTheDocument();
    });

    it("handles very old dates", () => {
      const date = new Date("2020-01-01T00:00:00Z");
      render(<FormattedDate date={date} />);
      // Should show full date - check for year presence
      expect(screen.getByText(/2020|20/)).toBeInTheDocument();
    });
  });
});
