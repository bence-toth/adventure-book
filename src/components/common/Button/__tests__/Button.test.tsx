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

    it("renders as a button element", () => {
      render(<Button>Test</Button>);

      const button = screen.getByRole("button");
      expect(button.tagName).toBe("BUTTON");
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

    it("renders icon before text", () => {
      const TestIcon = () => <span data-testid="test-icon">Icon</span>;

      render(<Button icon={TestIcon}>Text</Button>);

      const button = screen.getByRole("button");
      const icon = screen.getByTestId("test-icon");
      const textContent = button.textContent;

      expect(textContent).toBe("IconText");
      expect(button.firstChild).toContainElement(icon);
    });
  });

  describe("Selected State", () => {
    it("accepts selected prop", () => {
      render(<Button selected>Selected</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("accepts selected false", () => {
      render(<Button selected={false}>Not Selected</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("works without selected prop", () => {
      render(<Button>Default</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Custom Classes", () => {
    it("applies additional custom className", () => {
      render(<Button className="custom-class">Custom</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("works with custom className and selected state", () => {
      render(
        <Button selected className="custom-class">
          Multiple Classes
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
      expect(button).toBeInTheDocument();
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
    it("accepts primary variant", () => {
      render(<Button variant="primary">Primary</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("accepts danger variant", () => {
      render(<Button variant="danger">Danger</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("uses primary variant by default", () => {
      render(<Button>Default</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Sizes", () => {
    it("accepts default size", () => {
      render(<Button size="default">Default Size</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("accepts small size", () => {
      render(<Button size="small">Small Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("uses default size by default", () => {
      render(<Button>Default Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
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

      expect(button).toBeInTheDocument();
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

      expect(button).toHaveClass("home-button");
      expect(button).toHaveTextContent("Home");
    });
  });
});
