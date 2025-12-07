import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSelectOptionsConversion } from "../useSelectOptionsConversion";
import type { SelectOption } from "../useSelectedOption";

describe("useSelectOptionsConversion", () => {
  describe("Basic Conversion", () => {
    it("converts SelectOption array to DropdownOption array", () => {
      const selectOptions: SelectOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
        { value: "3", label: "Option 3" },
      ];

      const { result } = renderHook(() =>
        useSelectOptionsConversion(selectOptions)
      );

      expect(result.current.dropdownOptions).toEqual([
        { value: "1", label: "Option 1", icon: undefined, variant: undefined },
        { value: "2", label: "Option 2", icon: undefined, variant: undefined },
        { value: "3", label: "Option 3", icon: undefined, variant: undefined },
      ]);
    });

    it("handles empty options array", () => {
      const { result } = renderHook(() => useSelectOptionsConversion([]));

      expect(result.current.dropdownOptions).toEqual([]);
    });

    it("preserves all option properties", () => {
      const TestIcon = () => null;
      const selectOptions: SelectOption[] = [
        {
          value: "1",
          label: "Option 1",
          icon: TestIcon,
          variant: "danger",
        },
      ];

      const { result } = renderHook(() =>
        useSelectOptionsConversion(selectOptions)
      );

      expect(result.current.dropdownOptions[0]).toEqual({
        value: "1",
        label: "Option 1",
        icon: TestIcon,
        variant: "danger",
      });
    });
  });

  describe("Icon Handling", () => {
    it("converts options with icons", () => {
      const Icon1 = () => null;
      const Icon2 = () => null;

      const selectOptions: SelectOption[] = [
        { value: "1", label: "With Icon 1", icon: Icon1 },
        { value: "2", label: "With Icon 2", icon: Icon2 },
      ];

      const { result } = renderHook(() =>
        useSelectOptionsConversion(selectOptions)
      );

      expect(result.current.dropdownOptions[0].icon).toBe(Icon1);
      expect(result.current.dropdownOptions[1].icon).toBe(Icon2);
    });

    it("handles options without icons", () => {
      const selectOptions: SelectOption[] = [{ value: "1", label: "No Icon" }];

      const { result } = renderHook(() =>
        useSelectOptionsConversion(selectOptions)
      );

      expect(result.current.dropdownOptions[0].icon).toBeUndefined();
    });

    it("handles mixed options with and without icons", () => {
      const TestIcon = () => null;

      const selectOptions: SelectOption[] = [
        { value: "1", label: "With Icon", icon: TestIcon },
        { value: "2", label: "Without Icon" },
      ];

      const { result } = renderHook(() =>
        useSelectOptionsConversion(selectOptions)
      );

      expect(result.current.dropdownOptions[0].icon).toBe(TestIcon);
      expect(result.current.dropdownOptions[1].icon).toBeUndefined();
    });
  });

  describe("Variant Handling", () => {
    it("converts options with default variant", () => {
      const selectOptions: SelectOption[] = [
        { value: "1", label: "Default", variant: "default" },
      ];

      const { result } = renderHook(() =>
        useSelectOptionsConversion(selectOptions)
      );

      expect(result.current.dropdownOptions[0].variant).toBe("default");
    });

    it("converts options with danger variant", () => {
      const selectOptions: SelectOption[] = [
        { value: "1", label: "Delete", variant: "danger" },
      ];

      const { result } = renderHook(() =>
        useSelectOptionsConversion(selectOptions)
      );

      expect(result.current.dropdownOptions[0].variant).toBe("danger");
    });

    it("handles options without variant", () => {
      const selectOptions: SelectOption[] = [{ value: "1", label: "Normal" }];

      const { result } = renderHook(() =>
        useSelectOptionsConversion(selectOptions)
      );

      expect(result.current.dropdownOptions[0].variant).toBeUndefined();
    });

    it("handles mixed variants", () => {
      const selectOptions: SelectOption[] = [
        { value: "1", label: "Default", variant: "default" },
        { value: "2", label: "Danger", variant: "danger" },
        { value: "3", label: "None" },
      ];

      const { result } = renderHook(() =>
        useSelectOptionsConversion(selectOptions)
      );

      expect(result.current.dropdownOptions[0].variant).toBe("default");
      expect(result.current.dropdownOptions[1].variant).toBe("danger");
      expect(result.current.dropdownOptions[2].variant).toBeUndefined();
    });
  });

  describe("Complex Options", () => {
    it("converts options with all properties", () => {
      const Icon1 = () => null;
      const Icon2 = () => null;

      const selectOptions: SelectOption[] = [
        {
          value: "1",
          label: "Complete Option 1",
          icon: Icon1,
          variant: "default",
        },
        {
          value: "2",
          label: "Complete Option 2",
          icon: Icon2,
          variant: "danger",
        },
      ];

      const { result } = renderHook(() =>
        useSelectOptionsConversion(selectOptions)
      );

      expect(result.current.dropdownOptions).toEqual([
        {
          value: "1",
          label: "Complete Option 1",
          icon: Icon1,
          variant: "default",
        },
        {
          value: "2",
          label: "Complete Option 2",
          icon: Icon2,
          variant: "danger",
        },
      ]);
    });

    it("handles large number of options", () => {
      const selectOptions: SelectOption[] = Array.from(
        { length: 100 },
        (_, i) => ({
          value: String(i),
          label: `Option ${i}`,
        })
      );

      const { result } = renderHook(() =>
        useSelectOptionsConversion(selectOptions)
      );

      expect(result.current.dropdownOptions).toHaveLength(100);
      expect(result.current.dropdownOptions[0].value).toBe("0");
      expect(result.current.dropdownOptions[99].value).toBe("99");
    });
  });

  describe("Memoization", () => {
    it("returns same reference when options don't change", () => {
      const selectOptions: SelectOption[] = [{ value: "1", label: "Option 1" }];

      const { result, rerender } = renderHook(() =>
        useSelectOptionsConversion(selectOptions)
      );

      const firstResult = result.current.dropdownOptions;

      rerender();

      expect(result.current.dropdownOptions).toBe(firstResult);
    });

    it("returns new reference when options change", () => {
      const options1: SelectOption[] = [{ value: "1", label: "Option 1" }];
      const options2: SelectOption[] = [{ value: "2", label: "Option 2" }];

      const { result, rerender } = renderHook(
        ({ options }) => useSelectOptionsConversion(options),
        { initialProps: { options: options1 } }
      );

      const firstResult = result.current.dropdownOptions;

      rerender({ options: options2 });

      expect(result.current.dropdownOptions).not.toBe(firstResult);
      expect(result.current.dropdownOptions[0].value).toBe("2");
    });

    it("returns new reference when option properties change", () => {
      const TestIcon = () => null;
      const options1: SelectOption[] = [{ value: "1", label: "Option 1" }];
      const options2: SelectOption[] = [
        { value: "1", label: "Option 1", icon: TestIcon },
      ];

      const { result, rerender } = renderHook(
        ({ options }) => useSelectOptionsConversion(options),
        { initialProps: { options: options1 } }
      );

      const firstResult = result.current.dropdownOptions;

      rerender({ options: options2 });

      expect(result.current.dropdownOptions).not.toBe(firstResult);
      expect(result.current.dropdownOptions[0].icon).toBe(TestIcon);
    });
  });
});
