import { screen, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { ButtonLink } from "../ButtonLink";

// Helper to render with router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("ButtonLink Component", () => {
  describe("Rendering", () => {
    it("renders link with text content", () => {
      renderWithRouter(<ButtonLink to="/test">Click me</ButtonLink>);

      const link = screen.getByRole("link", { name: "Click me" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent("Click me");
    });

    it("applies base button classes", () => {
      renderWithRouter(<ButtonLink to="/test">Test</ButtonLink>);

      const link = screen.getByRole("link");
      expect(link).toHaveClass("button");
      expect(link).toHaveClass("button-primary");
    });

    it("renders with icon when provided", () => {
      const TestIcon = () => <span data-testid="test-icon">Icon</span>;

      renderWithRouter(
        <ButtonLink to="/test" icon={TestIcon}>
          With Icon
        </ButtonLink>
      );

      const link = screen.getByRole("link");
      const icon = screen.getByTestId("test-icon");

      expect(link).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(link).toContainElement(icon);
    });

    it("renders icon in correct container", () => {
      const TestIcon = () => <span>Icon</span>;

      renderWithRouter(
        <ButtonLink to="/test" icon={TestIcon}>
          Text
        </ButtonLink>
      );

      const link = screen.getByRole("link");
      const iconContainer = link.querySelector(".button-icon");

      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe("Selected State", () => {
    it("applies selected class when selected prop is true", () => {
      renderWithRouter(
        <ButtonLink to="/test" selected>
          Selected
        </ButtonLink>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("button-selected");
    });

    it("does not apply selected class when selected prop is false", () => {
      renderWithRouter(
        <ButtonLink to="/test" selected={false}>
          Not Selected
        </ButtonLink>
      );

      const link = screen.getByRole("link");
      expect(link).not.toHaveClass("button-selected");
    });

    it("does not apply selected class by default", () => {
      renderWithRouter(<ButtonLink to="/test">Default</ButtonLink>);

      const link = screen.getByRole("link");
      expect(link).not.toHaveClass("button-selected");
    });
  });

  describe("Custom Classes", () => {
    it("applies additional custom className", () => {
      renderWithRouter(
        <ButtonLink to="/test" className="custom-class">
          Custom
        </ButtonLink>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("button");
      expect(link).toHaveClass("button-primary");
      expect(link).toHaveClass("custom-class");
    });

    it("combines multiple classes correctly", () => {
      renderWithRouter(
        <ButtonLink to="/test" selected className="custom-class">
          Multiple Classes
        </ButtonLink>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("button");
      expect(link).toHaveClass("button-primary");
      expect(link).toHaveClass("button-selected");
      expect(link).toHaveClass("custom-class");
    });
  });

  describe("Link Behavior", () => {
    it("navigates to specified route", () => {
      renderWithRouter(<ButtonLink to="/target">Navigate</ButtonLink>);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/target");
    });

    it("forwards React Router Link props", () => {
      renderWithRouter(
        <ButtonLink to="/test" state={{ from: "home" }}>
          With State
        </ButtonLink>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/test");
    });
  });

  describe("Sizes", () => {
    it("applies default size by default", () => {
      renderWithRouter(<ButtonLink to="/test">Default Size</ButtonLink>);

      const link = screen.getByRole("link");
      expect(link).not.toHaveClass("button-small");
    });

    it("applies small size when specified", () => {
      renderWithRouter(
        <ButtonLink to="/test" size="small">
          Small Link
        </ButtonLink>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("button-small");
    });
  });

  describe("Variants", () => {
    it("applies primary variant by default", () => {
      renderWithRouter(<ButtonLink to="/test">Primary</ButtonLink>);

      const link = screen.getByRole("link");
      expect(link).toHaveClass("button-primary");
    });

    it("applies specified variant", () => {
      renderWithRouter(
        <ButtonLink to="/test" variant="primary">
          Variant
        </ButtonLink>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("button-primary");
    });
  });

  describe("Complex Scenarios", () => {
    it("renders link with icon and selected state", () => {
      const TestIcon = () => <span data-testid="icon">★</span>;

      renderWithRouter(
        <ButtonLink to="/test" selected icon={TestIcon}>
          Favorite
        </ButtonLink>
      );

      const link = screen.getByRole("link");
      const icon = screen.getByTestId("icon");

      expect(link).toHaveClass("button-selected");
      expect(icon).toBeInTheDocument();
      expect(link).toHaveTextContent("Favorite");
    });

    it("maintains structure with icon, text, size, and custom classes", () => {
      const TestIcon = () => <span>🏠</span>;

      renderWithRouter(
        <ButtonLink
          to="/home"
          icon={TestIcon}
          selected
          size="small"
          className="home-link"
        >
          Home
        </ButtonLink>
      );

      const link = screen.getByRole("link", { name: /home/i });

      expect(link).toHaveClass("button");
      expect(link).toHaveClass("button-primary");
      expect(link).toHaveClass("button-small");
      expect(link).toHaveClass("button-selected");
      expect(link).toHaveClass("home-link");
      expect(link).toHaveTextContent("Home");
    });
  });
});
