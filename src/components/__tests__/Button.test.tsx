import { screen, render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../Button";

describe("Button Component", () => {
  describe("Rendering", () => {
    it("renders button with text content", () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole("button", { name: "Click me" });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Click me");
    });

    it("applies base button classes", () => {
      render(<Button>Test</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("button");
      expect(button).toHaveClass("button-primary");
    });

    it("renders with icon when provided", () => {
      const TestIcon = () => <span data-testid="test-icon">Icon</span>;

      render(<Button icon={TestIcon}>With Icon</Button>);

      const button = screen.getByRole("button");
      const icon = screen.getByTestId("test-icon");

      expect(button).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(button).toContainElement(icon);
    });

    it("renders icon in correct container", () => {
      const TestIcon = () => <span>Icon</span>;

      render(<Button icon={TestIcon}>Text</Button>);

      const button = screen.getByRole("button");
      const iconContainer = button.querySelector(".button-icon");

      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe("Selected State", () => {
    it("applies selected class when selected prop is true", () => {
      render(<Button selected>Selected</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("button-selected");
    });

    it("does not apply selected class when selected prop is false", () => {
      render(<Button selected={false}>Not Selected</Button>);

      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("button-selected");
    });

    it("does not apply selected class by default", () => {
      render(<Button>Default</Button>);

      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("button-selected");
    });
  });

  describe("Custom Classes", () => {
    it("applies additional custom className", () => {
      render(<Button className="custom-class">Custom</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("button");
      expect(button).toHaveClass("button-primary");
      expect(button).toHaveClass("custom-class");
    });

    it("combines multiple classes correctly", () => {
      render(
        <Button selected className="custom-class">
          Multiple Classes
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("button");
      expect(button).toHaveClass("button-primary");
      expect(button).toHaveClass("button-selected");
      expect(button).toHaveClass("custom-class");
    });
  });

  describe("Accessibility", () => {
    it("has button role", () => {
      render(<Button>Accessible</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("can be disabled", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("forwards aria attributes", () => {
      render(
        <Button aria-label="Custom Label" aria-pressed="true">
          ARIA Button
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Custom Label");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("forwards data-testid attribute", () => {
      render(<Button data-testid="custom-test-id">Test ID</Button>);

      const button = screen.getByTestId("custom-test-id");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Event Handling", () => {
    it("calls onClick handler when clicked", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Clickable</Button>);

      const button = screen.getByRole("button");
      button.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );

      const button = screen.getByRole("button");
      button.click();

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("forwards all button HTML attributes", () => {
      render(
        <Button type="submit" name="test-button" value="test-value">
          Form Button
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("name", "test-button");
      expect(button).toHaveAttribute("value", "test-value");
    });
  });

  describe("Variants", () => {
    it("applies primary variant by default", () => {
      render(<Button>Primary</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("button-primary");
    });

    it("applies specified variant", () => {
      render(<Button variant="primary">Variant</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("button-primary");
    });
  });

  describe("Sizes", () => {
    it("applies default size by default", () => {
      render(<Button>Default Size</Button>);

      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("button-small");
    });

    it("applies small size when specified", () => {
      render(<Button size="small">Small Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("button-small");
    });

    it("applies default size when explicitly specified", () => {
      render(<Button size="default">Default Button</Button>);

      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("button-small");
    });
  });

  describe("Complex Scenarios", () => {
    it("renders button with icon and selected state", () => {
      const TestIcon = () => <span data-testid="icon">★</span>;

      render(
        <Button selected icon={TestIcon}>
          Favorite
        </Button>
      );

      const button = screen.getByRole("button");
      const icon = screen.getByTestId("icon");

      expect(button).toHaveClass("button-selected");
      expect(icon).toBeInTheDocument();
      expect(button).toHaveTextContent("Favorite");
    });

    it("maintains structure with icon, text, and custom classes", () => {
      const TestIcon = () => <span>🏠</span>;

      render(
        <Button
          icon={TestIcon}
          selected
          className="home-button"
          data-testid="home-btn"
        >
          Home
        </Button>
      );

      const button = screen.getByTestId("home-btn");

      expect(button).toHaveClass("button");
      expect(button).toHaveClass("button-primary");
      expect(button).toHaveClass("button-selected");
      expect(button).toHaveClass("home-button");
      expect(button).toHaveTextContent("Home");
    });
  });
});
