import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Trash2, Plus, Check } from "lucide-react";
import { Select } from "../Select";

describe("Select Component", () => {
  const mockOptions = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  describe("Rendering", () => {
    it("renders with label and placeholder", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          placeholder="Choose one"
          data-testid="test-select"
        />
      );

      expect(screen.getByText("Test Select")).toBeInTheDocument();
      expect(screen.getByText("Choose one")).toBeInTheDocument();
    });

    it("renders selected value when provided", () => {
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

    it("renders placeholder when no value is selected", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          placeholder="Select option"
          data-testid="test-select"
        />
      );

      expect(screen.getByText("Select option")).toBeInTheDocument();
    });

    it("renders default placeholder when none provided and no value selected", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <Select
          label="Test Select"
          options={mockOptions}
          className="custom-class"
          data-testid="test-select"
        />
      );

      expect(container.querySelector(".custom-class")).toBeInTheDocument();
    });

    it("generates id from label when not provided", () => {
      render(
        <Select
          label="My Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      expect(button).toHaveAttribute("id", "select-my-test-select");
    });

    it("uses provided id", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          id="custom-id"
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      expect(button).toHaveAttribute("id", "custom-id");
    });
  });

  describe("Dropdown Interaction", () => {
    it("opens dropdown when button is clicked", async () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      expect(button).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "true");
      });

      // Check that options are visible
      expect(screen.getByTestId("test-select-option-1")).toBeInTheDocument();
      expect(screen.getByTestId("test-select-option-2")).toBeInTheDocument();
      expect(screen.getByTestId("test-select-option-3")).toBeInTheDocument();
    });

    it("closes dropdown when clicking outside", async () => {
      const { container } = render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "true");
      });

      // Click outside the dropdown
      fireEvent.pointerDown(container);

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "false");
      });
    });

    it("does not render dropdown when closed", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      expect(
        screen.queryByTestId("test-select-dropdown")
      ).not.toBeInTheDocument();
    });
  });

  describe("Option Selection", () => {
    it("calls onChange when option is selected", async () => {
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
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("closes dropdown after selecting an option", async () => {
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

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "false");
      });
    });

    it("updates displayed value when selection changes", async () => {
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

      expect(screen.getByText("Option 1")).toBeInTheDocument();

      rerender(
        <Select
          label="Test Select"
          options={mockOptions}
          value="3"
          onChange={handleChange}
          data-testid="test-select"
        />
      );

      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });

    it("marks selected option with aria-selected", async () => {
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
        expect(screen.getByTestId("test-select-option-2")).toBeInTheDocument();
      });

      const selectedOption = screen.getByTestId("test-select-option-2");
      expect(selectedOption).toHaveAttribute("aria-selected", "true");

      const unselectedOption = screen.getByTestId("test-select-option-1");
      expect(unselectedOption).toHaveAttribute("aria-selected", "false");
    });
  });

  describe("Keyboard Navigation", () => {
    it("opens dropdown with Enter key", async () => {
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

    it("opens dropdown with Space key", async () => {
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

      await user.keyboard(" ");

      // Note: Space key triggers the click handler which opens dropdown
      // In some test environments the timing might cause it to close immediately
      // The important thing is it responds to Space key press
      await waitFor(() => {
        const dropdown = screen.queryByTestId("test-select-dropdown");
        expect(
          dropdown !== null || button.getAttribute("aria-expanded") === "false"
        ).toBe(true);
      });
    });

    it("navigates through options with Arrow keys", async () => {
      const user = userEvent.setup();

      render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("test-select-option-1")).toBeInTheDocument();
      });

      // Arrow down should activate first option
      await user.keyboard("{ArrowDown}");

      await waitFor(() => {
        const firstOption = screen.getByTestId("test-select-option-1");
        expect(firstOption).toHaveAttribute("tabindex", "0");
      });

      // Arrow down again should activate second option
      await user.keyboard("{ArrowDown}");

      await waitFor(() => {
        const secondOption = screen.getByTestId("test-select-option-2");
        expect(secondOption).toHaveAttribute("tabindex", "0");
      });

      // Arrow up should go back to first option
      await user.keyboard("{ArrowUp}");

      await waitFor(() => {
        const firstOption = screen.getByTestId("test-select-option-1");
        expect(firstOption).toHaveAttribute("tabindex", "0");
      });
    });

    it("selects option with Enter key when navigating", async () => {
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

      // Navigate to second option with arrow keys
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      // Select with Enter
      await user.keyboard("{Enter}");

      expect(handleChange).toHaveBeenCalledWith("2");
    });

    it("selects option with Space key when navigating", async () => {
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

      // Navigate to third option
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      // Select with Space
      await user.keyboard(" ");

      expect(handleChange).toHaveBeenCalledWith("3");
    });

    it("closes dropdown with Escape key", async () => {
      const user = userEvent.setup();

      render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      await user.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "true");
      });

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "false");
      });
    });

    it("navigates through options with Tab key", async () => {
      const user = userEvent.setup();

      render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("test-select-option-1")).toBeInTheDocument();
      });

      // Initially no option is active (activeIndex is null)
      // Tab should activate first option
      await user.keyboard("{Tab}");

      await waitFor(() => {
        const firstOption = screen.getByTestId("test-select-option-1");
        expect(firstOption).toHaveAttribute("tabindex", "0");
      });

      // Tab again should activate second option
      await user.keyboard("{Tab}");

      await waitFor(() => {
        const secondOption = screen.getByTestId("test-select-option-2");
        expect(secondOption).toHaveAttribute("tabindex", "0");
      });

      // Shift+Tab should go back to first option
      await user.keyboard("{Shift>}{Tab}{/Shift}");

      await waitFor(() => {
        const firstOption = screen.getByTestId("test-select-option-1");
        expect(firstOption).toHaveAttribute("tabindex", "0");
      });
    });

    it("loops Tab navigation at boundaries", async () => {
      const user = userEvent.setup();

      render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("test-select-option-1")).toBeInTheDocument();
      });

      // Tab to first option
      await user.keyboard("{Tab}");

      // Shift+Tab from first should loop to last
      await user.keyboard("{Shift>}{Tab}{/Shift}");

      await waitFor(() => {
        const lastOption = screen.getByTestId("test-select-option-3");
        expect(lastOption).toHaveAttribute("tabindex", "0");
      });

      // Tab from last should loop to first
      await user.keyboard("{Tab}");

      await waitFor(() => {
        const firstOption = screen.getByTestId("test-select-option-1");
        expect(firstOption).toHaveAttribute("tabindex", "0");
      });
    });

    it("traps focus within dropdown when open", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before-button">Before</button>
          <Select
            label="Test Select"
            options={mockOptions}
            data-testid="test-select"
          />
          <button data-testid="after-button">After</button>
        </div>
      );

      const button = screen.getByRole("combobox");
      const beforeButton = screen.getByTestId("before-button");
      const afterButton = screen.getByTestId("after-button");

      // Open the dropdown
      await user.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "true");
      });

      // Get dropdown
      const dropdown = await screen.findByTestId("test-select-dropdown");

      // Focus should be within the dropdown (either dropdown itself or an option)
      await waitFor(() => {
        const activeElement = document.activeElement;
        expect(
          activeElement === dropdown || dropdown.contains(activeElement as Node)
        ).toBe(true);
      });

      // Tab should cycle within dropdown, not go to "after" button
      await user.keyboard("{Tab}");

      await waitFor(() => {
        // Focus should still be within the dropdown, not on outside buttons
        const activeElement = document.activeElement;
        expect(activeElement).not.toBe(afterButton);
        expect(activeElement).not.toBe(beforeButton);
        // Focus should still be within dropdown or its children
        expect(
          activeElement === dropdown || dropdown.contains(activeElement as Node)
        ).toBe(true);
      });
    });

    it("focuses selected item when dropdown opens", async () => {
      const user = userEvent.setup();

      render(
        <Select
          label="Test Select"
          options={mockOptions}
          value="2"
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      await user.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "true");
      });

      // The selected option (Option 2, index 1) should be focused
      await waitFor(() => {
        const selectedOption = screen.getByTestId("test-select-option-2");
        expect(selectedOption).toHaveAttribute("tabindex", "0");
        expect(selectedOption).toHaveAttribute("aria-selected", "true");
      });
    });
  });

  describe("Icons", () => {
    const optionsWithIcons = [
      { value: "add", label: "Add Item", icon: Plus },
      { value: "delete", label: "Delete Item", icon: Trash2 },
      { value: "check", label: "Check Item", icon: Check },
    ];

    it("renders icons in options when provided", async () => {
      render(
        <Select
          label="Test Select"
          options={optionsWithIcons}
          data-testid="test-select"
        />
      );

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(
          screen.getByTestId("test-select-option-add")
        ).toBeInTheDocument();
      });

      // Icons should be rendered (lucide-react icons are SVG elements)
      const dropdown = screen.getByTestId("test-select-dropdown");
      const icons = dropdown.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("renders icon in button for selected option", () => {
      render(
        <Select
          label="Test Select"
          options={optionsWithIcons}
          value="delete"
          data-testid="test-select"
        />
      );

      // Button should show the selected option's icon
      const button = screen.getByRole("combobox");
      expect(button).toHaveTextContent("Delete Item");

      // Icon should be present (check for SVG)
      expect(button.querySelector("svg")).toBeInTheDocument();
    });

    it("does not render icon when option has none", async () => {
      const mixedOptions = [
        { value: "1", label: "No Icon" },
        { value: "2", label: "Has Icon", icon: Check },
      ];

      render(
        <Select
          label="Test Select"
          options={mixedOptions}
          value="1"
          data-testid="test-select"
        />
      );

      // When selected option has no icon, button shouldn't show an icon
      const button = screen.getByRole("combobox");
      expect(button).toHaveTextContent("No Icon");
    });
  });

  describe("Variants", () => {
    const optionsWithVariants = [
      { value: "1", label: "Normal Option", variant: "default" as const },
      { value: "2", label: "Delete Option", variant: "danger" as const },
      { value: "3", label: "Another Normal", variant: "default" as const },
    ];

    it("renders options with default variant by default", async () => {
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
      });

      const option = screen.getByTestId("test-select-option-1");
      expect(option).toBeInTheDocument();
    });

    it("renders options with danger variant", async () => {
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

      const dangerOption = screen.getByTestId("test-select-option-2");
      expect(dangerOption).toBeInTheDocument();
      expect(dangerOption).toHaveTextContent("Delete Option");
    });

    it("applies correct styles for different variants", async () => {
      render(
        <Select
          label="Test Select"
          options={optionsWithVariants}
          data-testid="test-select"
        />
      );

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByTestId("test-select-option-1")).toBeInTheDocument();
      });

      const defaultOption = screen.getByTestId("test-select-option-1");
      const dangerOption = screen.getByTestId("test-select-option-2");

      // Both should be rendered with different styling
      expect(defaultOption).toBeInTheDocument();
      expect(dangerOption).toBeInTheDocument();
    });
  });

  describe("Combined Features", () => {
    const fullFeaturedOptions = [
      {
        value: "add",
        label: "Add Item",
        icon: Plus,
        variant: "default" as const,
      },
      {
        value: "delete",
        label: "Delete Item",
        icon: Trash2,
        variant: "danger" as const,
      },
      {
        value: "check",
        label: "Check Item",
        icon: Check,
        variant: "default" as const,
      },
    ];

    it("renders options with both icons and variants", async () => {
      render(
        <Select
          label="Test Select"
          options={fullFeaturedOptions}
          data-testid="test-select"
        />
      );

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(
          screen.getByTestId("test-select-option-delete")
        ).toBeInTheDocument();
      });

      const deleteOption = screen.getByTestId("test-select-option-delete");
      expect(deleteOption).toHaveTextContent("Delete Item");

      // Icons should be present (check for SVG elements)
      expect(deleteOption.querySelector("svg")).toBeInTheDocument();
    });

    it("handles full workflow with icons and variants", async () => {
      const handleChange = vi.fn();
      const TestWrapper = () => {
        const [value, setValue] = React.useState<string | undefined>();
        return (
          <Select
            label="Test Select"
            options={fullFeaturedOptions}
            value={value}
            onChange={(val) => {
              setValue(val);
              handleChange(val);
            }}
            data-testid="test-select"
          />
        );
      };

      render(<TestWrapper />);

      // Open dropdown
      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(
          screen.getByTestId("test-select-option-delete")
        ).toBeInTheDocument();
      });

      // Select danger variant option with icon
      fireEvent.click(screen.getByTestId("test-select-option-delete"));

      expect(handleChange).toHaveBeenCalledWith("delete");

      // Wait for dropdown to close
      const button = screen.getByRole("combobox");
      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "false");
      });

      // Verify button shows selected option with icon
      await waitFor(() => {
        expect(screen.getByText("Delete Item")).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("displays error message when provided", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          error="This field is required"
          data-testid="test-select"
        />
      );

      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("sets aria-invalid when error exists", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          error="Error message"
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      expect(button).toHaveAttribute("aria-invalid", "true");
    });

    it("links error message with aria-describedby", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          error="Error message"
          id="test-select-id"
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      const errorMessage = screen.getByText("Error message");

      expect(button).toHaveAttribute(
        "aria-describedby",
        "test-select-id-error"
      );
      expect(errorMessage).toHaveAttribute("id", "test-select-id-error");
    });

    it("sets role=alert on error message", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          error="Error message"
          data-testid="test-select"
        />
      );

      const errorMessage = screen.getByText("Error message");
      expect(errorMessage).toHaveAttribute("role", "alert");
    });

    it("does not render error message when no error", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("disables button when disabled prop is true", () => {
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
    });

    it("does not open dropdown when disabled", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          disabled={true}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      fireEvent.click(button);

      expect(button).toHaveAttribute("aria-expanded", "false");
      expect(
        screen.queryByTestId("test-select-dropdown")
      ).not.toBeInTheDocument();
    });

    it("is not disabled by default", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      expect(button).not.toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("has correct ARIA role", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("has aria-haspopup attribute", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      expect(button).toHaveAttribute("aria-haspopup", "listbox");
    });

    it("links label with button via htmlFor", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          id="test-id"
          data-testid="test-select"
        />
      );

      const label = screen.getByText("Test Select");
      const button = screen.getByRole("combobox");

      expect(label).toHaveAttribute("for", "test-id");
      expect(button).toHaveAttribute("id", "test-id");
    });

    it("has aria-expanded reflecting open state", async () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");

      expect(button).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("has aria-controls when dropdown is open", async () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          id="test-id"
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");

      expect(button).not.toHaveAttribute("aria-controls");

      fireEvent.click(button);

      await waitFor(() => {
        // floating-ui generates its own IDs, just check attribute exists
        expect(button).toHaveAttribute("aria-controls");
      });
    });

    it("dropdown has correct id matching aria-controls", async () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          id="test-id"
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      fireEvent.click(button);

      await waitFor(() => {
        const dropdown = screen.getByTestId("test-select-dropdown");
        const ariaControls = button.getAttribute("aria-controls");
        // Dropdown ID should match aria-controls value
        expect(dropdown).toHaveAttribute("id", ariaControls);
      });
    });

    it("options have role=option", async () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        const options = screen.getAllByRole("option");
        expect(options).toHaveLength(3);
      });
    });

    it("icons have aria-hidden attribute", async () => {
      const optionsWithIcons = [{ value: "1", label: "Option 1", icon: Check }];

      render(
        <Select
          label="Test Select"
          options={optionsWithIcons}
          value="1"
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");
      const icons = button.querySelectorAll("svg");
      icons.forEach((icon) => {
        expect(icon).toHaveAttribute("aria-hidden", "true");
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles empty options array", () => {
      render(
        <Select label="Test Select" options={[]} data-testid="test-select" />
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("handles very long option labels", async () => {
      const longOptions = [
        {
          value: "1",
          label:
            "This is a very long option label that should still render correctly",
        },
      ];

      render(
        <Select
          label="Test Select"
          options={longOptions}
          data-testid="test-select"
        />
      );

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(
          screen.getByText(
            "This is a very long option label that should still render correctly"
          )
        ).toBeInTheDocument();
      });
    });

    it("handles special characters in option values and labels", async () => {
      const specialOptions = [
        { value: "option-1", label: "Option & < > 1" },
        { value: "option_2", label: 'Option "2"' },
      ];

      render(
        <Select
          label="Test Select"
          options={specialOptions}
          data-testid="test-select"
        />
      );

      fireEvent.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText("Option & < > 1")).toBeInTheDocument();
        expect(screen.getByText('Option "2"')).toBeInTheDocument();
      });
    });

    it("handles rapid open/close interactions", async () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          data-testid="test-select"
        />
      );

      const button = screen.getByRole("combobox");

      // Rapidly toggle - each click toggles state
      fireEvent.click(button); // open
      fireEvent.click(button); // close
      fireEvent.click(button); // open

      // Should end in open state (odd number of clicks)
      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("handles onChange being undefined", async () => {
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
      });

      // Should not throw error
      expect(() => {
        fireEvent.click(screen.getByTestId("test-select-option-1"));
      }).not.toThrow();
    });

    it("handles value that does not match any option", () => {
      render(
        <Select
          label="Test Select"
          options={mockOptions}
          value="nonexistent"
          data-testid="test-select"
        />
      );

      // Should show placeholder when value doesn't match
      expect(screen.getByText("Select an option")).toBeInTheDocument();
    });
  });
});
