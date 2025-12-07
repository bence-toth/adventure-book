import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useState } from "react";
import { Dropdown, type DropdownOption } from "../Dropdown";

describe("Dropdown Component - Integration", () => {
  let mockTriggerRef: HTMLElement;
  let mockListRef: React.MutableRefObject<Array<HTMLElement | null>>;
  const mockOptions: DropdownOption[] = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  beforeEach(() => {
    mockTriggerRef = document.createElement("button");
    document.body.appendChild(mockTriggerRef);
    mockListRef = { current: [] };
  });

  afterEach(() => {
    if (mockTriggerRef.parentElement) {
      document.body.removeChild(mockTriggerRef);
    }
  });

  describe("Rendering", () => {
    it("renders nothing when isOpen is false", () => {
      render(
        <Dropdown
          isOpen={false}
          onOpenChange={vi.fn()}
          triggerRef={mockTriggerRef}
          options={mockOptions}
          onSelect={vi.fn()}
          activeIndex={null}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
        />
      );

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("renders dropdown when isOpen is true", () => {
      render(
        <Dropdown
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={mockTriggerRef}
          options={mockOptions}
          onSelect={vi.fn()}
          activeIndex={null}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
        />
      );

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("renders all options", () => {
      render(
        <Dropdown
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={mockTriggerRef}
          options={mockOptions}
          onSelect={vi.fn()}
          activeIndex={null}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
        />
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });

    it("renders with custom data-testid", () => {
      render(
        <Dropdown
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={mockTriggerRef}
          options={mockOptions}
          onSelect={vi.fn()}
          activeIndex={null}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
          data-testid="custom-dropdown"
        />
      );

      expect(screen.getByTestId("custom-dropdown")).toBeInTheDocument();
    });
  });

  describe("Selection", () => {
    it("calls onSelect when option is clicked", () => {
      const onSelect = vi.fn();

      render(
        <Dropdown
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={mockTriggerRef}
          options={mockOptions}
          onSelect={onSelect}
          activeIndex={null}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
        />
      );

      act(() => {
        fireEvent.click(screen.getByText("Option 2"));
      });

      expect(onSelect).toHaveBeenCalledWith("option2");
    });

    it("calls onOpenChange with false after selection", () => {
      const TestWrapper = () => {
        const [isOpen, setIsOpen] = useState(true);
        return (
          <Dropdown
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            triggerRef={mockTriggerRef}
            options={mockOptions}
            onSelect={vi.fn()}
            activeIndex={null}
            onActiveIndexChange={vi.fn()}
            listRef={mockListRef}
          />
        );
      };

      const { rerender } = render(<TestWrapper />);

      act(() => {
        fireEvent.click(screen.getByText("Option 1"));
      });

      rerender(<TestWrapper />);

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  describe("Selected State", () => {
    it("marks selected option with aria-selected", () => {
      render(
        <Dropdown
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={mockTriggerRef}
          options={mockOptions}
          onSelect={vi.fn()}
          selectedValue="option2"
          activeIndex={null}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
        />
      );

      const options = screen.getAllByRole("option");
      expect(options[0]).toHaveAttribute("aria-selected", "false");
      expect(options[1]).toHaveAttribute("aria-selected", "true");
      expect(options[2]).toHaveAttribute("aria-selected", "false");
    });
  });

  describe("Active State", () => {
    it("sets tabIndex based on activeIndex", () => {
      render(
        <Dropdown
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={mockTriggerRef}
          options={mockOptions}
          onSelect={vi.fn()}
          activeIndex={1}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
        />
      );

      const options = screen.getAllByRole("option");
      expect(options[0]).toHaveAttribute("tabIndex", "-1");
      expect(options[1]).toHaveAttribute("tabIndex", "0");
      expect(options[2]).toHaveAttribute("tabIndex", "-1");
    });
  });

  describe("Options with Icons", () => {
    it("renders icons when provided", () => {
      const TestIcon = () => <svg data-testid="test-icon" />;
      const optionsWithIcons: DropdownOption[] = [
        { value: "icon1", label: "Icon Option 1", icon: TestIcon },
        { value: "icon2", label: "Icon Option 2" },
      ];

      render(
        <Dropdown
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={mockTriggerRef}
          options={optionsWithIcons}
          onSelect={vi.fn()}
          activeIndex={null}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
        />
      );

      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
      expect(screen.getByText("Icon Option 1")).toBeInTheDocument();
      expect(screen.getByText("Icon Option 2")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("applies danger variant styling", () => {
      const dangerOptions: DropdownOption[] = [
        { value: "danger1", label: "Danger Option", variant: "danger" },
      ];

      render(
        <Dropdown
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={mockTriggerRef}
          options={dangerOptions}
          onSelect={vi.fn()}
          activeIndex={null}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
        />
      );

      const option = screen.getByText("Danger Option");
      expect(option).toBeInTheDocument();
    });
  });

  describe("Role Configuration", () => {
    it("uses listbox role by default", () => {
      render(
        <Dropdown
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={mockTriggerRef}
          options={mockOptions}
          onSelect={vi.fn()}
          activeIndex={null}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
        />
      );

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("uses menu role when specified", () => {
      render(
        <Dropdown
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={mockTriggerRef}
          options={mockOptions}
          onSelect={vi.fn()}
          role="menu"
          activeIndex={null}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
        />
      );

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  describe("Custom Rendering", () => {
    it("uses custom children render function when provided", () => {
      render(
        <Dropdown
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={mockTriggerRef}
          options={mockOptions}
          onSelect={vi.fn()}
          activeIndex={null}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
        >
          {({ option }) => <div key={option.value}>Custom: {option.label}</div>}
        </Dropdown>
      );

      expect(screen.getByText("Custom: Option 1")).toBeInTheDocument();
      expect(screen.getByText("Custom: Option 2")).toBeInTheDocument();
      expect(screen.getByText("Custom: Option 3")).toBeInTheDocument();
    });
  });

  describe("Option Test IDs", () => {
    it("generates option testIds from optionsTestIdPrefix", () => {
      render(
        <Dropdown
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={mockTriggerRef}
          options={mockOptions}
          onSelect={vi.fn()}
          activeIndex={null}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
          optionsTestIdPrefix="my-prefix"
        />
      );

      expect(
        screen.getByTestId("my-prefix-option-option1")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("my-prefix-option-option2")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("my-prefix-option-option3")
      ).toBeInTheDocument();
    });

    it("uses option.testId when provided", () => {
      const optionsWithTestIds: DropdownOption[] = [
        { value: "opt1", label: "Option 1", testId: "custom-test-id" },
      ];

      render(
        <Dropdown
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={mockTriggerRef}
          options={optionsWithTestIds}
          onSelect={vi.fn()}
          activeIndex={null}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
        />
      );

      expect(screen.getByTestId("custom-test-id")).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("passes custom onKeyDown handler", () => {
      const onKeyDown = vi.fn();

      render(
        <Dropdown
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={mockTriggerRef}
          options={mockOptions}
          onSelect={vi.fn()}
          activeIndex={null}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
          onKeyDown={onKeyDown}
        />
      );

      const dropdown = screen.getByRole("listbox");
      fireEvent.keyDown(dropdown, { key: "ArrowDown" });

      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  describe("Integration with Hooks", () => {
    it("integrates useDropdownFloating for positioning", () => {
      render(
        <Dropdown
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={mockTriggerRef}
          options={mockOptions}
          onSelect={vi.fn()}
          placement="top-start"
          activeIndex={null}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
        />
      );

      const dropdown = screen.getByRole("listbox");
      expect(dropdown).toBeInTheDocument();
    });

    it("integrates useDropdownSelect for selection handling", () => {
      const onSelect = vi.fn();
      const onOpenChange = vi.fn();

      render(
        <Dropdown
          isOpen={true}
          onOpenChange={onOpenChange}
          triggerRef={mockTriggerRef}
          options={mockOptions}
          onSelect={onSelect}
          activeIndex={null}
          onActiveIndexChange={vi.fn()}
          listRef={mockListRef}
        />
      );

      act(() => {
        fireEvent.click(screen.getByText("Option 1"));
      });

      expect(onSelect).toHaveBeenCalledWith("option1");
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
