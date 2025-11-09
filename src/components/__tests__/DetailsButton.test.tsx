import { screen, render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DetailsButton } from "../DetailsButton";

describe("DetailsButton Component", () => {
  describe("Rendering", () => {
    it("renders details element with summary and content", () => {
      render(
        <DetailsButton summary="Click to expand">
          <p>Hidden content</p>
        </DetailsButton>
      );

      const summary = screen.getByText("Click to expand");
      const content = screen.getByText("Hidden content");

      expect(summary).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it("applies button classes to summary", () => {
      const { container } = render(
        <DetailsButton summary="Test">
          <div>Content</div>
        </DetailsButton>
      );

      const summary = container.querySelector("summary");
      expect(summary).toBeInTheDocument();
      expect(summary?.tagName).toBe("SUMMARY");
      expect(summary).toHaveClass("button");
      expect(summary).toHaveClass("button-primary");
    });

    it("renders with icon when provided", () => {
      const TestIcon = () => <span data-testid="test-icon">📋</span>;

      render(
        <DetailsButton summary="With Icon" icon={TestIcon}>
          <div>Content</div>
        </DetailsButton>
      );

      const summary = screen.getByText("With Icon");
      const icon = screen.getByTestId("test-icon");

      expect(summary).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(summary.parentElement).toContainElement(icon);
    });

    it("renders icon in correct container", () => {
      const TestIcon = () => <span>🔍</span>;

      const { container } = render(
        <DetailsButton summary="Search" icon={TestIcon}>
          <div>Results</div>
        </DetailsButton>
      );

      const summary = container.querySelector("summary");
      const iconContainer = summary?.querySelector(".button-icon");

      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe("Custom Classes", () => {
    it("applies custom className to details element", () => {
      const { container } = render(
        <DetailsButton summary="Test" className="custom-details">
          <div>Content</div>
        </DetailsButton>
      );

      const details = container.querySelector("details");
      expect(details).toHaveClass("custom-details");
    });

    it("applies summaryClassName to summary element", () => {
      const { container } = render(
        <DetailsButton summary="Test" summaryClassName="custom-summary">
          <div>Content</div>
        </DetailsButton>
      );

      const summary = container.querySelector("summary");
      expect(summary).toHaveClass("button");
      expect(summary).toHaveClass("button-primary");
      expect(summary).toHaveClass("custom-summary");
    });
  });

  describe("Accessibility", () => {
    it("uses semantic details/summary elements", () => {
      const { container } = render(
        <DetailsButton summary="Test">
          <div>Content</div>
        </DetailsButton>
      );

      const details = container.querySelector("details");
      const summary = container.querySelector("summary");

      expect(details).toBeInTheDocument();
      expect(summary).toBeInTheDocument();
    });

    it("forwards HTML attributes to details element", () => {
      const { container } = render(
        <DetailsButton
          summary="Test"
          role="region"
          aria-label="Additional information"
        >
          <div>Content</div>
        </DetailsButton>
      );

      const details = container.querySelector("details");
      expect(details).toHaveAttribute("role", "region");
      expect(details).toHaveAttribute("aria-label", "Additional information");
    });

    it("supports open attribute", () => {
      const { container } = render(
        <DetailsButton summary="Test" open>
          <div>Content</div>
        </DetailsButton>
      );

      const details = container.querySelector("details");
      expect(details).toHaveAttribute("open");
    });
  });

  describe("Variants", () => {
    it("applies primary variant by default", () => {
      const { container } = render(
        <DetailsButton summary="Default">
          <div>Content</div>
        </DetailsButton>
      );

      const summary = container.querySelector("summary");
      expect(summary).toHaveClass("button-primary");
    });

    it("applies specified variant", () => {
      const { container } = render(
        <DetailsButton summary="Primary" variant="primary">
          <div>Content</div>
        </DetailsButton>
      );

      const summary = container.querySelector("summary");
      expect(summary).toHaveClass("button-primary");
    });
  });

  describe("Interaction", () => {
    it("can be toggled open and closed", () => {
      const { container } = render(
        <DetailsButton summary="Toggle me">
          <div>Toggleable content</div>
        </DetailsButton>
      );

      const details = container.querySelector("details");
      const summary = screen.getByText("Toggle me");

      expect(details).not.toHaveAttribute("open");

      summary.click();
      expect(details).toHaveAttribute("open");

      summary.click();
      expect(details).not.toHaveAttribute("open");
    });
  });

  describe("Complex Scenarios", () => {
    it("renders with icon, custom classes, and attributes", () => {
      const TestIcon = () => <span data-testid="complex-icon">ℹ️</span>;
      const { container } = render(
        <DetailsButton
          summary="Info"
          icon={TestIcon}
          className="info-details"
          summaryClassName="info-summary"
          role="region"
          aria-label="Information"
        >
          <div data-testid="complex-content">Detailed information</div>
        </DetailsButton>
      );

      const details = container.querySelector("details");
      const summary = container.querySelector("summary");
      const icon = screen.getByTestId("complex-icon");
      const content = screen.getByTestId("complex-content");

      expect(details).toHaveClass("info-details");
      expect(details).toHaveAttribute("role", "region");
      expect(summary).toHaveClass("button", "button-primary", "info-summary");
      expect(icon).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it("maintains button structure with icon and text", () => {
      const TestIcon = () => <span>📝</span>;

      const { container } = render(
        <DetailsButton summary="Notes" icon={TestIcon}>
          <p>Note content</p>
        </DetailsButton>
      );

      const summary = container.querySelector("summary");
      const iconContainer = summary?.querySelector(".button-icon");
      const textContainer = summary?.querySelector(".button-text");

      expect(iconContainer).toBeInTheDocument();
      expect(textContainer).toBeInTheDocument();
      expect(textContainer).toHaveTextContent("Notes");
    });
  });
});
