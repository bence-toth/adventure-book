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

    it("renders as a link element", () => {
      renderWithRouter(<ButtonLink to="/test">Test</ButtonLink>);

      const link = screen.getByRole("link");
      expect(link.tagName).toBe("A");
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

    it("renders icon before text", () => {
      const TestIcon = () => <span data-testid="test-icon">Icon</span>;

      renderWithRouter(
        <ButtonLink to="/test" icon={TestIcon}>
          Text
        </ButtonLink>
      );

      const link = screen.getByRole("link");
      const icon = screen.getByTestId("test-icon");
      const textContent = link.textContent;

      expect(textContent).toBe("IconText");
      expect(link.firstChild).toContainElement(icon);
    });
  });

  describe("Selected State", () => {
    it("accepts selected prop", () => {
      renderWithRouter(
        <ButtonLink to="/test" selected>
          Selected
        </ButtonLink>
      );

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("accepts selected false", () => {
      renderWithRouter(
        <ButtonLink to="/test" selected={false}>
          Not Selected
        </ButtonLink>
      );

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("works without selected prop", () => {
      renderWithRouter(<ButtonLink to="/test">Default</ButtonLink>);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
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
      expect(link).toHaveClass("custom-class");
    });

    it("works with custom className and selected state", () => {
      renderWithRouter(
        <ButtonLink to="/test" selected className="custom-class">
          Multiple Classes
        </ButtonLink>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("custom-class");
      expect(link).toBeInTheDocument();
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
    it("accepts default size", () => {
      renderWithRouter(<ButtonLink to="/test">Default Size</ButtonLink>);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("accepts small size", () => {
      renderWithRouter(
        <ButtonLink to="/test" size="small">
          Small Link
        </ButtonLink>
      );

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("uses primary variant by default", () => {
      renderWithRouter(<ButtonLink to="/test">Primary</ButtonLink>);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("accepts primary variant", () => {
      renderWithRouter(<ButtonLink to="/test">Variant</ButtonLink>);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
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

      expect(link).toBeInTheDocument();
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

      expect(link).toHaveClass("home-link");
      expect(link).toHaveTextContent("Home");
    });
  });
});
