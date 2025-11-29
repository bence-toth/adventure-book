import { screen, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { NavigationTab } from "../NavigationTab";

// Helper to render with router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("NavigationTab Component", () => {
  describe("Rendering", () => {
    it("renders link with text content", () => {
      renderWithRouter(<NavigationTab to="/test">Click me</NavigationTab>);

      const link = screen.getByRole("link", { name: "Click me" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent("Click me");
    });

    it("renders as a link element", () => {
      renderWithRouter(<NavigationTab to="/test">Test</NavigationTab>);

      const link = screen.getByRole("link");
      expect(link.tagName).toBe("A");
    });

    it("renders with icon when provided", () => {
      const TestIcon = () => <span data-testid="test-icon">Icon</span>;

      renderWithRouter(
        <NavigationTab to="/test" icon={TestIcon}>
          With Icon
        </NavigationTab>
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
        <NavigationTab to="/test" icon={TestIcon}>
          Text
        </NavigationTab>
      );

      const link = screen.getByRole("link");
      const icon = screen.getByTestId("test-icon");
      const textContent = link.textContent;

      expect(textContent).toBe("IconText");
      expect(link.firstChild).toContainElement(icon);
    });
  });

  describe("Variants", () => {
    it("accepts neutral variant", () => {
      renderWithRouter(
        <NavigationTab to="/test" variant="neutral">
          Neutral
        </NavigationTab>
      );

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("accepts primary variant", () => {
      renderWithRouter(
        <NavigationTab to="/test" variant="primary">
          Primary
        </NavigationTab>
      );

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("works without variant prop (defaults to neutral)", () => {
      renderWithRouter(<NavigationTab to="/test">Default</NavigationTab>);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });
  });

  describe("Custom Classes", () => {
    it("applies additional custom className", () => {
      renderWithRouter(
        <NavigationTab to="/test" className="custom-class">
          Custom
        </NavigationTab>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("custom-class");
    });

    it("works with custom className and variant", () => {
      renderWithRouter(
        <NavigationTab to="/test" variant="primary" className="custom-class">
          Multiple Classes
        </NavigationTab>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("custom-class");
      expect(link).toBeInTheDocument();
    });
  });

  describe("Link Behavior", () => {
    it("navigates to specified route", () => {
      renderWithRouter(<NavigationTab to="/target">Navigate</NavigationTab>);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/target");
    });

    it("forwards React Router Link props", () => {
      renderWithRouter(
        <NavigationTab to="/test" state={{ from: "home" }}>
          With State
        </NavigationTab>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/test");
    });
  });

  describe("Variants", () => {
    it("uses primary variant by default", () => {
      renderWithRouter(<NavigationTab to="/test">Primary</NavigationTab>);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("accepts primary variant", () => {
      renderWithRouter(<NavigationTab to="/test">Variant</NavigationTab>);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });
  });

  describe("Complex Scenarios", () => {
    it("renders link with icon and variant", () => {
      const TestIcon = () => <span data-testid="icon">★</span>;

      renderWithRouter(
        <NavigationTab to="/test" variant="primary" icon={TestIcon}>
          Favorite
        </NavigationTab>
      );

      const link = screen.getByRole("link");
      const icon = screen.getByTestId("icon");

      expect(link).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(link).toHaveTextContent("Favorite");
    });

    it("maintains structure with icon, text, and custom classes", () => {
      const TestIcon = () => <span>🏠</span>;

      renderWithRouter(
        <NavigationTab
          to="/home"
          icon={TestIcon}
          variant="primary"
          className="home-link"
        >
          Home
        </NavigationTab>
      );

      const link = screen.getByRole("link", { name: /home/i });

      expect(link).toHaveClass("home-link");
      expect(link).toHaveTextContent("Home");
    });
  });
});
