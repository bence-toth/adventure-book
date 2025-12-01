import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ToggleButton } from "../ToggleButton";

describe("ToggleButton Component", () => {
  describe("Rendering", () => {
    it("renders toggle button with label", () => {
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Enable Feature"
          isChecked={false}
          onChange={onChange}
        />
      );

      const toggle = screen.getByRole("switch");
      const label = screen.getByText("Enable Feature");

      expect(toggle).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    });

    it("renders as unchecked by default", () => {
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Test Toggle"
          isChecked={false}
          onChange={onChange}
        />
      );

      const toggle = screen.getByRole("switch");
      expect(toggle).not.toBeChecked();
    });

    it("renders as checked when checked prop is true", () => {
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Test Toggle"
          isChecked={true}
          onChange={onChange}
        />
      );

      const toggle = screen.getByRole("switch");
      expect(toggle).toBeChecked();
    });

    it("forwards data-testid attribute", () => {
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Test Toggle"
          isChecked={false}
          onChange={onChange}
          data-testid="custom-toggle"
        />
      );

      const toggle = screen.getByTestId("custom-toggle");
      expect(toggle).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has switch role", () => {
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Accessible Toggle"
          isChecked={false}
          onChange={onChange}
        />
      );

      const toggle = screen.getByRole("switch");
      expect(toggle).toBeInTheDocument();
    });

    it("has correct aria-checked attribute when unchecked", () => {
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Test Toggle"
          isChecked={false}
          onChange={onChange}
        />
      );

      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveAttribute("aria-checked", "false");
    });

    it("has correct aria-checked attribute when checked", () => {
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Test Toggle"
          isChecked={true}
          onChange={onChange}
        />
      );

      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveAttribute("aria-checked", "true");
    });

    it("uses label as default aria-label", () => {
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Feature Toggle"
          isChecked={false}
          onChange={onChange}
        />
      );

      const toggle = screen.getByRole("switch", { name: "Feature Toggle" });
      expect(toggle).toBeInTheDocument();
    });

    it("accepts custom aria-label", () => {
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Toggle"
          isChecked={false}
          onChange={onChange}
          aria-label="Custom accessibility label"
        />
      );

      const toggle = screen.getByRole("switch", {
        name: "Custom accessibility label",
      });
      expect(toggle).toBeInTheDocument();
    });

    it("can be disabled", () => {
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Disabled Toggle"
          isChecked={false}
          onChange={onChange}
          disabled
        />
      );

      const toggle = screen.getByRole("switch");
      expect(toggle).toBeDisabled();
    });

    it("does not call onChange when disabled", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Disabled Toggle"
          isChecked={false}
          onChange={onChange}
          disabled
        />
      );

      const toggle = screen.getByRole("switch");
      await user.click(toggle);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("User Interaction", () => {
    it("calls onChange with true when clicked from unchecked state", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Test Toggle"
          isChecked={false}
          onChange={onChange}
        />
      );

      const toggle = screen.getByRole("switch");
      await user.click(toggle);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it("calls onChange with false when clicked from checked state", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Test Toggle"
          isChecked={true}
          onChange={onChange}
        />
      );

      const toggle = screen.getByRole("switch");
      await user.click(toggle);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(false);
    });

    it("toggles state multiple times", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { rerender } = render(
        <ToggleButton
          label="Test Toggle"
          isChecked={false}
          onChange={onChange}
        />
      );

      const toggle = screen.getByRole("switch");

      // First click: unchecked -> checked
      await user.click(toggle);
      expect(onChange).toHaveBeenCalledWith(true);

      // Rerender with new state
      rerender(
        <ToggleButton
          label="Test Toggle"
          isChecked={true}
          onChange={onChange}
        />
      );

      // Second click: checked -> unchecked
      await user.click(toggle);
      expect(onChange).toHaveBeenCalledWith(false);

      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it("can be clicked on the label text", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Click Label"
          isChecked={false}
          onChange={onChange}
        />
      );

      const label = screen.getByText("Click Label");
      await user.click(label);

      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  describe("Keyboard Interaction", () => {
    it("toggles when Space key is pressed", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Test Toggle"
          isChecked={false}
          onChange={onChange}
        />
      );

      const toggle = screen.getByRole("switch");
      toggle.focus();
      await user.keyboard(" ");

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it("is keyboard focusable", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Test Toggle"
          isChecked={false}
          onChange={onChange}
        />
      );

      const toggle = screen.getByRole("switch");
      await user.tab();

      expect(toggle).toHaveFocus();
    });

    it("does not toggle with other keys", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Test Toggle"
          isChecked={false}
          onChange={onChange}
        />
      );

      const toggle = screen.getByRole("switch");
      toggle.focus();
      await user.keyboard("a");
      await user.keyboard("{Escape}");

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("State Consistency", () => {
    it("maintains checked state after multiple renders", () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <ToggleButton
          label="Test Toggle"
          isChecked={false}
          onChange={onChange}
        />
      );

      let toggle = screen.getByRole("switch");
      expect(toggle).not.toBeChecked();

      rerender(
        <ToggleButton
          label="Test Toggle"
          isChecked={true}
          onChange={onChange}
        />
      );

      toggle = screen.getByRole("switch");
      expect(toggle).toBeChecked();

      rerender(
        <ToggleButton
          label="Test Toggle"
          isChecked={false}
          onChange={onChange}
        />
      );

      toggle = screen.getByRole("switch");
      expect(toggle).not.toBeChecked();
    });

    it("updates aria-checked when checked prop changes", () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <ToggleButton
          label="Test Toggle"
          isChecked={false}
          onChange={onChange}
        />
      );

      let toggle = screen.getByRole("switch");
      expect(toggle).toHaveAttribute("aria-checked", "false");

      rerender(
        <ToggleButton
          label="Test Toggle"
          isChecked={true}
          onChange={onChange}
        />
      );

      toggle = screen.getByRole("switch");
      expect(toggle).toHaveAttribute("aria-checked", "true");
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid clicking without errors", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Test Toggle"
          isChecked={false}
          onChange={onChange}
        />
      );

      const toggle = screen.getByRole("switch");

      // Rapid clicks
      await user.click(toggle);
      await user.click(toggle);
      await user.click(toggle);

      expect(onChange).toHaveBeenCalledTimes(3);
    });

    it("renders with empty label", () => {
      const onChange = vi.fn();
      render(
        <ToggleButton
          label=""
          isChecked={false}
          onChange={onChange}
          aria-label="Hidden label"
        />
      );

      const toggle = screen.getByRole("switch", { name: "Hidden label" });
      expect(toggle).toBeInTheDocument();
    });

    it("forwards additional HTML attributes", () => {
      const onChange = vi.fn();
      render(
        <ToggleButton
          label="Test Toggle"
          isChecked={false}
          onChange={onChange}
          id="custom-id"
          name="toggle-name"
        />
      );

      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveAttribute("id", "custom-id");
      expect(toggle).toHaveAttribute("name", "toggle-name");
    });
  });
});
