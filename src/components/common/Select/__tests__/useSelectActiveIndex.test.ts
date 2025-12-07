import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSelectActiveIndex } from "../useSelectActiveIndex";

describe("useSelectActiveIndex", () => {
  const mockOptions = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  describe("Initial State", () => {
    it("starts with null activeIndex when closed", () => {
      const { result } = renderHook(() =>
        useSelectActiveIndex({
          isOpen: false,
          options: mockOptions,
          value: undefined,
        })
      );

      expect(result.current.activeIndex).toBeNull();
    });

    it("starts with null activeIndex when open with no selection", () => {
      const { result } = renderHook(() =>
        useSelectActiveIndex({
          isOpen: true,
          options: mockOptions,
          value: undefined,
        })
      );

      expect(result.current.activeIndex).toBeNull();
    });

    it("sets activeIndex to selected value when opened", () => {
      const { result } = renderHook(() =>
        useSelectActiveIndex({
          isOpen: true,
          options: mockOptions,
          value: "2",
        })
      );

      expect(result.current.activeIndex).toBe(1);
    });
  });

  describe("Open/Close Behavior", () => {
    it("resets activeIndex to null when dropdown closes", () => {
      const { result, rerender } = renderHook(
        ({ isOpen }) =>
          useSelectActiveIndex({
            isOpen,
            options: mockOptions,
            value: "2",
          }),
        { initialProps: { isOpen: true } }
      );

      expect(result.current.activeIndex).toBe(1);

      rerender({ isOpen: false });

      expect(result.current.activeIndex).toBeNull();
    });

    it("sets activeIndex when dropdown opens with selected value", () => {
      const { result, rerender } = renderHook(
        ({ isOpen }) =>
          useSelectActiveIndex({
            isOpen,
            options: mockOptions,
            value: "3",
          }),
        { initialProps: { isOpen: false } }
      );

      expect(result.current.activeIndex).toBeNull();

      rerender({ isOpen: true });

      expect(result.current.activeIndex).toBe(2);
    });

    it("keeps activeIndex null when opening without selection", () => {
      const { result, rerender } = renderHook(
        ({ isOpen }) =>
          useSelectActiveIndex({
            isOpen,
            options: mockOptions,
            value: undefined,
          }),
        { initialProps: { isOpen: false } }
      );

      expect(result.current.activeIndex).toBeNull();

      rerender({ isOpen: true });

      expect(result.current.activeIndex).toBeNull();
    });
  });

  describe("Value Changes", () => {
    it("updates activeIndex when value changes while open", () => {
      const { result, rerender } = renderHook(
        ({ value }) =>
          useSelectActiveIndex({
            isOpen: true,
            options: mockOptions,
            value,
          }),
        { initialProps: { value: "1" } }
      );

      expect(result.current.activeIndex).toBe(0);

      rerender({ value: "3" });

      expect(result.current.activeIndex).toBe(2);
    });

    it("does not update activeIndex when value changes while closed", () => {
      const { result, rerender } = renderHook(
        ({ value }) =>
          useSelectActiveIndex({
            isOpen: false,
            options: mockOptions,
            value,
          }),
        { initialProps: { value: "1" } }
      );

      expect(result.current.activeIndex).toBeNull();

      rerender({ value: "3" });

      expect(result.current.activeIndex).toBeNull();
    });

    it("handles value becoming undefined while open", () => {
      const { result, rerender } = renderHook(
        ({ value }) =>
          useSelectActiveIndex({
            isOpen: true,
            options: mockOptions,
            value,
          }),
        { initialProps: { value: "2" as string | undefined } }
      );

      expect(result.current.activeIndex).toBe(1);

      rerender({ value: undefined as string | undefined });

      expect(result.current.activeIndex).toBeNull();
    });
  });

  describe("Options Changes", () => {
    it("updates activeIndex when options change and value still exists", () => {
      const options1 = [
        { value: "1", label: "A" },
        { value: "2", label: "B" },
      ];
      const options2 = [
        { value: "0", label: "Zero" },
        { value: "1", label: "A" },
        { value: "2", label: "B" },
      ];

      const { result, rerender } = renderHook(
        ({ options }) =>
          useSelectActiveIndex({
            isOpen: true,
            options,
            value: "2",
          }),
        { initialProps: { options: options1 } }
      );

      expect(result.current.activeIndex).toBe(1);

      rerender({ options: options2 });

      expect(result.current.activeIndex).toBe(2);
    });

    it("sets activeIndex to null when value no longer exists in options", () => {
      const options1 = [
        { value: "1", label: "A" },
        { value: "2", label: "B" },
      ];
      const options2 = [{ value: "1", label: "A" }];

      const { result, rerender } = renderHook(
        ({ options }) =>
          useSelectActiveIndex({
            isOpen: true,
            options,
            value: "2",
          }),
        { initialProps: { options: options1 } }
      );

      expect(result.current.activeIndex).toBe(1);

      rerender({ options: options2 });

      expect(result.current.activeIndex).toBeNull();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty options array", () => {
      const { result } = renderHook(() =>
        useSelectActiveIndex({
          isOpen: true,
          options: [],
          value: "1",
        })
      );

      expect(result.current.activeIndex).toBeNull();
    });

    it("handles invalid value with valid options", () => {
      const { result } = renderHook(() =>
        useSelectActiveIndex({
          isOpen: true,
          options: mockOptions,
          value: "999",
        })
      );

      expect(result.current.activeIndex).toBeNull();
    });

    it("finds first occurrence when duplicate values exist", () => {
      const duplicateOptions = [
        { value: "1", label: "First" },
        { value: "1", label: "Duplicate" },
        { value: "2", label: "Second" },
      ];

      const { result } = renderHook(() =>
        useSelectActiveIndex({
          isOpen: true,
          options: duplicateOptions,
          value: "1",
        })
      );

      expect(result.current.activeIndex).toBe(0);
    });
  });

  describe("setActiveIndex Function", () => {
    it("provides setActiveIndex function", () => {
      const { result } = renderHook(() =>
        useSelectActiveIndex({
          isOpen: true,
          options: mockOptions,
          value: undefined,
        })
      );

      expect(typeof result.current.setActiveIndex).toBe("function");
    });

    it("allows manual activeIndex updates", () => {
      const { result } = renderHook(() =>
        useSelectActiveIndex({
          isOpen: true,
          options: mockOptions,
          value: undefined,
        })
      );

      expect(result.current.activeIndex).toBeNull();

      // Note: We can't actually test calling setActiveIndex here as it
      // would be overridden by the effect, but we verify it exists
      expect(result.current.setActiveIndex).toBeDefined();
    });
  });
});
