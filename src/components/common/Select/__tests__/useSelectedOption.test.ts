import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSelectedOption, type SelectOption } from "../useSelectedOption";

describe("useSelectedOption", () => {
  const mockOptions: SelectOption[] = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  describe("Selected Option Finding", () => {
    it("finds the selected option by value", () => {
      const { result } = renderHook(() =>
        useSelectedOption({
          options: mockOptions,
          value: "2",
          placeholder: "Select",
        })
      );

      expect(result.current.selectedOption).toEqual({
        value: "2",
        label: "Option 2",
      });
    });

    it("returns undefined when no value is selected", () => {
      const { result } = renderHook(() =>
        useSelectedOption({
          options: mockOptions,
          value: undefined,
          placeholder: "Select",
        })
      );

      expect(result.current.selectedOption).toBeUndefined();
    });

    it("returns undefined when value does not match any option", () => {
      const { result } = renderHook(() =>
        useSelectedOption({
          options: mockOptions,
          value: "999",
          placeholder: "Select",
        })
      );

      expect(result.current.selectedOption).toBeUndefined();
    });

    it("handles empty options array", () => {
      const { result } = renderHook(() =>
        useSelectedOption({
          options: [],
          value: "1",
          placeholder: "Select",
        })
      );

      expect(result.current.selectedOption).toBeUndefined();
    });
  });

  describe("Selected Label Display", () => {
    it("returns selected option label when value matches", () => {
      const { result } = renderHook(() =>
        useSelectedOption({
          options: mockOptions,
          value: "1",
          placeholder: "Select an option",
        })
      );

      expect(result.current.selectedLabel).toBe("Option 1");
    });

    it("returns placeholder when no value is selected", () => {
      const { result } = renderHook(() =>
        useSelectedOption({
          options: mockOptions,
          value: undefined,
          placeholder: "Choose one",
        })
      );

      expect(result.current.selectedLabel).toBe("Choose one");
    });

    it("returns placeholder when value does not match any option", () => {
      const { result } = renderHook(() =>
        useSelectedOption({
          options: mockOptions,
          value: "invalid",
          placeholder: "Select",
        })
      );

      expect(result.current.selectedLabel).toBe("Select");
    });

    it("returns empty string placeholder when provided", () => {
      const { result } = renderHook(() =>
        useSelectedOption({
          options: mockOptions,
          value: undefined,
          placeholder: "",
        })
      );

      expect(result.current.selectedLabel).toBe("");
    });
  });

  describe("Options with Icons", () => {
    it("finds option with icon", () => {
      const TestIcon = () => null;
      const optionsWithIcons: SelectOption[] = [
        { value: "1", label: "Option 1", icon: TestIcon },
        { value: "2", label: "Option 2" },
      ];

      const { result } = renderHook(() =>
        useSelectedOption({
          options: optionsWithIcons,
          value: "1",
          placeholder: "Select",
        })
      );

      expect(result.current.selectedOption?.icon).toBe(TestIcon);
    });

    it("handles option without icon", () => {
      const { result } = renderHook(() =>
        useSelectedOption({
          options: mockOptions,
          value: "1",
          placeholder: "Select",
        })
      );

      expect(result.current.selectedOption?.icon).toBeUndefined();
    });
  });

  describe("Options with Variants", () => {
    it("finds option with danger variant", () => {
      const variantOptions: SelectOption[] = [
        { value: "1", label: "Normal", variant: "default" },
        { value: "2", label: "Delete", variant: "danger" },
      ];

      const { result } = renderHook(() =>
        useSelectedOption({
          options: variantOptions,
          value: "2",
          placeholder: "Select",
        })
      );

      expect(result.current.selectedOption?.variant).toBe("danger");
    });

    it("finds option with default variant", () => {
      const variantOptions: SelectOption[] = [
        { value: "1", label: "Normal", variant: "default" },
      ];

      const { result } = renderHook(() =>
        useSelectedOption({
          options: variantOptions,
          value: "1",
          placeholder: "Select",
        })
      );

      expect(result.current.selectedOption?.variant).toBe("default");
    });
  });

  describe("Memoization", () => {
    it("returns same references when inputs don't change", () => {
      const { result, rerender } = renderHook(() =>
        useSelectedOption({
          options: mockOptions,
          value: "1",
          placeholder: "Select",
        })
      );

      const firstOption = result.current.selectedOption;
      const firstLabel = result.current.selectedLabel;

      rerender();

      expect(result.current.selectedOption).toBe(firstOption);
      expect(result.current.selectedLabel).toBe(firstLabel);
    });

    it("updates when value changes", () => {
      const { result, rerender } = renderHook(
        ({ value }) =>
          useSelectedOption({
            options: mockOptions,
            value,
            placeholder: "Select",
          }),
        { initialProps: { value: "1" } }
      );

      expect(result.current.selectedLabel).toBe("Option 1");

      rerender({ value: "2" });

      expect(result.current.selectedLabel).toBe("Option 2");
    });

    it("updates when options change", () => {
      const options1: SelectOption[] = [{ value: "1", label: "First" }];
      const options2: SelectOption[] = [{ value: "1", label: "Updated" }];

      const { result, rerender } = renderHook(
        ({ options }) =>
          useSelectedOption({ options, value: "1", placeholder: "Select" }),
        { initialProps: { options: options1 } }
      );

      expect(result.current.selectedLabel).toBe("First");

      rerender({ options: options2 });

      expect(result.current.selectedLabel).toBe("Updated");
    });

    it("updates when placeholder changes", () => {
      const { result, rerender } = renderHook(
        ({ placeholder }) =>
          useSelectedOption({
            options: mockOptions,
            value: undefined,
            placeholder,
          }),
        { initialProps: { placeholder: "Select" } }
      );

      expect(result.current.selectedLabel).toBe("Select");

      rerender({ placeholder: "Choose" });

      expect(result.current.selectedLabel).toBe("Choose");
    });
  });
});
