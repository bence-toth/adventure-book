import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Trash2, Plus } from "lucide-react";
import { Select } from "../Select";

describe("Select Component - Integration", () => {
  const mockOptions = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  describe("Integration with useSelectedOption Hook", () => {
    it("displays selected option label via hook", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          value="2"
          data-testid="test-select"
        />
      );

      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("displays placeholder when no value selected", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          placeholder="Choose one"
          data-testid="test-select"
        />
      );

      expect(screen.getByText("Choose one")).toBeInTheDocument();
    });

    it("updates displayed value when selection changes", async () => {
      const { rerender } = render(
        <Select
          label="Test Select"
          options={mockOptions}
          value="1"
          data-testid="test-select"
        />
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();

      rerender(
        <Select
          label="Test Select"
          options={mockOptions}
          value="3"
          data-testid="test-select"
        />
      );

      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });

    it("displays icon from selected option", () => {
      const optionsWithIcons = [
        { value: "1", label: "Add", icon: Plus },
        { value: "2", label: "Delete", icon: Trash2 },
      ];

      render(
        <Select
          label="Test Select"
          options={optionsWithIcons}
          value="2"
          data-testid="test-select"
        />
      );

      expect(screen.getByText("Delete")).toBeInTheDocument();
      // Icon should be rendered
      const button = screen.getByRole("combobox");
      expect(button.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Integration with useSelectActiveIndex Hook", () => {
    it("sets active index to selected value when dropdown opens", async () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          value="2"
          data-testid="test-select"
        />
      );

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        const selectedOption = screen.getByTestId("test-select-option-2");
        expect(selectedOption).toHaveAttribute("aria-selected", "true");
      });
    });

    it("updates active index when value changes while open", async () => {
      const { rerender } = render(
        <Select
          label="Test Select"
          options={mockOptions}
          value="1"
          data-testid="test-select"
        />
      );

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByTestId("test-select-option-1")).toHaveAttribute(
          "aria-selected",
          "true"
        );
      });

      rerender(
        <Select
          label="Test Select"
          options={mockOptions}
          value="3"
          data-testid="test-select"
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("test-select-option-3")).toHaveAttribute(
          "aria-selected",
          "true"
        );
      });
    });
  });

  describe("Integration with useSelectKeyboardNavigation Hook", () => {
    it("opens dropdown with Enter key via hook", async () => {
      const user = userEvent.setup();

      render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      button.focus();

      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("selects option with Enter key via keyboard navigation", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Select
          label="Test Select"
          options={mockOptions}
          onChange={handleChange}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("test-select-option-1")).toBeInTheDocument();
      });

      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith("2");
      });
    });

    it("navigates with Tab and selects with Space", async () => {
      const handleChange = vi.fn();

      render(
        <Select
          label="Test Select"
          options={mockOptions}
          onChange={handleChange}
          data-testid="test-select"
        />
      );

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByTestId("test-select-option-1")).toBeInTheDocument();
      });

      const dropdown = screen.getByTestId("test-select-dropdown");

      // Tab through options
      fireEvent.keyDown(dropdown, { key: "Tab" });
      fireEvent.keyDown(dropdown, { key: "Tab" });

      // Select with Space
      fireEvent.keyDown(dropdown, { key: " " });

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });
  });

  describe("Integration with useSelectOptionsConversion Hook", () => {
    it("converts options with icons for Dropdown", async () => {
      const optionsWithIcons = [
        { value: "1", label: "Add", icon: Plus },
        { value: "2", label: "Delete", icon: Trash2 },
      ];

      render(
        <Select
          label="Test Select"
          options={optionsWithIcons}
          data-testid="test-select"
        />
      );

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByTestId("test-select-option-1")).toBeInTheDocument();
      });

      // Check that icons are rendered in dropdown
      const option1 = screen.getByTestId("test-select-option-1");
      expect(option1.querySelector("svg")).toBeInTheDocument();
    });

    it("converts options with variants for Dropdown", async () => {
      const optionsWithVariants = [
        { value: "1", label: "Normal", variant: "default" as const },
        { value: "2", label: "Delete", variant: "danger" as const },
      ];

      render(
        <Select
          label="Test Select"
          options={optionsWithVariants}
          data-testid="test-select"
        />
      );

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByTestId("test-select-option-2")).toBeInTheDocument();
      });

      // Variant styling is applied via Dropdown component
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });
  });

  describe("Full End-to-End Integration", () => {
    it("complete user flow: render, open, navigate, select", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Select
          label="Test Select"
          options={mockOptions}
          onChange={handleChange}
          placeholder="Select option"
          data-testid="test-select"
        />
      );

      // Initial render
      expect(screen.getByText("Select option")).toBeInTheDocument();

      // Open dropdown
      const button = screen.getByRole("combobox");
      await user.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "true");
      });

      // Navigate and select
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith("1");
        expect(button).toHaveAttribute("aria-expanded", "false");
      });
    });

    it("handles complete icon and variant workflow", async () => {
      const handleChange = vi.fn();

      const complexOptions = [
        { value: "1", label: "Add", icon: Plus, variant: "default" as const },
        {
          value: "2",
          label: "Delete",
          icon: Trash2,
          variant: "danger" as const,
        },
      ];

      render(
        <Select
          label="Actions"
          options={complexOptions}
          value="1"
          onChange={handleChange}
          data-testid="test-select"
        />
      );

      // Verify selected option with icon
      expect(screen.getByText("Add")).toBeInTheDocument();

      // Open and select danger option
      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByTestId("test-select-option-2")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("test-select-option-2"));

      expect(handleChange).toHaveBeenCalledWith("2");
    });

    it("manages state across all hooks correctly", async () => {
      const handleChange = vi.fn();

      const { rerender } = render(
        <Select
          label="Test Select"
          options={mockOptions}
          value="1"
          onChange={handleChange}
          data-testid="test-select"
        />
      );

      // Verify initial selected option (useSelectedOption)
      expect(screen.getByText("Option 1")).toBeInTheDocument();

      // Open dropdown
      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByTestId("test-select-option-1")).toBeInTheDocument();
      });

      // Verify active index matches selected (useSelectActiveIndex)
      expect(screen.getByTestId("test-select-option-1")).toHaveAttribute(
        "aria-selected",
        "true"
      );

      // Navigate with keyboard (useSelectKeyboardNavigation)
      const dropdown = screen.getByTestId("test-select-dropdown");
      fireEvent.keyDown(dropdown, { key: "ArrowDown" });

      // Select option (useSelectKeyboardNavigation)
      fireEvent.keyDown(dropdown, { key: "Enter" });

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith("2");
      });

      // Update value prop
      rerender(
        <Select
          label="Test Select"
          options={mockOptions}
          value="2"
          onChange={handleChange}
          data-testid="test-select"
        />
      );

      // Verify displayed value updated (useSelectedOption)
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });
  });

  describe("Integration with Dropdown Component", () => {
    it("passes converted options to Dropdown correctly", async () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByTestId("test-select-option-1")).toBeInTheDocument();
        expect(screen.getByTestId("test-select-option-2")).toBeInTheDocument();
        expect(screen.getByTestId("test-select-option-3")).toBeInTheDocument();
      });
    });

    it("handles Dropdown open/close state", async () => {
      const { container } = render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");

      // Initially closed
      expect(button).toHaveAttribute("aria-expanded", "false");

      // Open
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "true");
      });

      // Close by clicking outside
      fireEvent.pointerDown(container);

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "false");
      });
    });

    it("passes selection events to Dropdown", async () => {
      const handleChange = vi.fn();

      render(
        <Select
          label="Test Select"
          options={mockOptions}
          onChange={handleChange}
          data-testid="test-select"
        />
      );

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByTestId("test-select-option-2")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("test-select-option-2"));

      expect(handleChange).toHaveBeenCalledWith("2");
    });
  });

  describe("Error and Disabled State Integration", () => {
    it("displays error message while maintaining hook functionality", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          value="1"
          error="Required field"
          data-testid="test-select"
        />
      );

      expect(screen.getByText("Required field")).toBeInTheDocument();
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("disables interactions when disabled prop is true", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          disabled={true}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      expect(button).toBeDisabled();

      fireEvent.click(button);

      expect(button).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("Accessibility Integration", () => {
    it("maintains proper ARIA attributes across hooks", async () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          id="custom-select"
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");

      expect(button).toHaveAttribute("id", "custom-select");
      expect(button).toHaveAttribute("aria-haspopup", "listbox");
      expect(button).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "true");
        expect(button).toHaveAttribute(
          "aria-controls",
          "custom-select-listbox"
        );
      });
    });

    it("manages focus correctly after selection", async () => {
      const handleChange = vi.fn();

      render(
        <Select
          label="Test Select"
          options={mockOptions}
          onChange={handleChange}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("test-select-option-1")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("test-select-option-1"));

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      // Button should receive focus after selection
      expect(document.activeElement).toBe(button);
    });
  });
});
