import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDropdownSelect } from "../useDropdownSelect";

describe("useDropdownSelect", () => {
  describe("Selection Handling", () => {
    it("returns handleSelect function", () => {
      const { result } = renderHook(() =>
        useDropdownSelect({
          onSelect: vi.fn(),
          onOpenChange: vi.fn(),
        })
      );

      expect(result.current.handleSelect).toBeTypeOf("function");
    });

    it("calls onSelect with the value", () => {
      const onSelect = vi.fn();
      const onOpenChange = vi.fn();

      const { result } = renderHook(() =>
        useDropdownSelect({
          onSelect,
          onOpenChange,
        })
      );

      act(() => {
        result.current.handleSelect("option1");
      });

      expect(onSelect).toHaveBeenCalledWith("option1");
    });

    it("calls onOpenChange with false after selection", () => {
      const onSelect = vi.fn();
      const onOpenChange = vi.fn();

      const { result } = renderHook(() =>
        useDropdownSelect({
          onSelect,
          onOpenChange,
        })
      );

      act(() => {
        result.current.handleSelect("option1");
      });

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls both handlers in correct order", () => {
      const callOrder: string[] = [];
      const onSelect = vi.fn(() => callOrder.push("select"));
      const onOpenChange = vi.fn(() => callOrder.push("close"));

      const { result } = renderHook(() =>
        useDropdownSelect({
          onSelect,
          onOpenChange,
        })
      );

      act(() => {
        result.current.handleSelect("option1");
      });

      expect(callOrder).toEqual(["select", "close"]);
    });
  });

  describe("Multiple Selections", () => {
    it("handles multiple selections", () => {
      const onSelect = vi.fn();
      const onOpenChange = vi.fn();

      const { result } = renderHook(() =>
        useDropdownSelect({
          onSelect,
          onOpenChange,
        })
      );

      act(() => {
        result.current.handleSelect("option1");
        result.current.handleSelect("option2");
        result.current.handleSelect("option3");
      });

      expect(onSelect).toHaveBeenCalledTimes(3);
      expect(onSelect).toHaveBeenNthCalledWith(1, "option1");
      expect(onSelect).toHaveBeenNthCalledWith(2, "option2");
      expect(onSelect).toHaveBeenNthCalledWith(3, "option3");
      expect(onOpenChange).toHaveBeenCalledTimes(3);
    });

    it("handles same value selected multiple times", () => {
      const onSelect = vi.fn();
      const onOpenChange = vi.fn();

      const { result } = renderHook(() =>
        useDropdownSelect({
          onSelect,
          onOpenChange,
        })
      );

      act(() => {
        result.current.handleSelect("option1");
        result.current.handleSelect("option1");
      });

      expect(onSelect).toHaveBeenCalledTimes(2);
      expect(onSelect).toHaveBeenCalledWith("option1");
    });
  });

  describe("Value Types", () => {
    it("handles string values", () => {
      const onSelect = vi.fn();

      const { result } = renderHook(() =>
        useDropdownSelect({
          onSelect,
          onOpenChange: vi.fn(),
        })
      );

      act(() => {
        result.current.handleSelect("test-value");
      });

      expect(onSelect).toHaveBeenCalledWith("test-value");
    });

    it("handles empty string value", () => {
      const onSelect = vi.fn();

      const { result } = renderHook(() =>
        useDropdownSelect({
          onSelect,
          onOpenChange: vi.fn(),
        })
      );

      act(() => {
        result.current.handleSelect("");
      });

      expect(onSelect).toHaveBeenCalledWith("");
    });

    it("handles numeric string values", () => {
      const onSelect = vi.fn();

      const { result } = renderHook(() =>
        useDropdownSelect({
          onSelect,
          onOpenChange: vi.fn(),
        })
      );

      act(() => {
        result.current.handleSelect("123");
      });

      expect(onSelect).toHaveBeenCalledWith("123");
    });
  });

  describe("Memoization", () => {
    it("returns stable handleSelect when dependencies don't change", () => {
      const onSelect = vi.fn();
      const onOpenChange = vi.fn();

      const { result, rerender } = renderHook(() =>
        useDropdownSelect({
          onSelect,
          onOpenChange,
        })
      );

      const firstHandleSelect = result.current.handleSelect;

      rerender();

      expect(result.current.handleSelect).toBe(firstHandleSelect);
    });

    it("returns new handleSelect when onSelect changes", () => {
      const onSelect1 = vi.fn();
      const onSelect2 = vi.fn();
      const onOpenChange = vi.fn();

      const { result, rerender } = renderHook(
        ({ onSelect }) =>
          useDropdownSelect({
            onSelect,
            onOpenChange,
          }),
        { initialProps: { onSelect: onSelect1 } }
      );

      const firstHandleSelect = result.current.handleSelect;

      rerender({ onSelect: onSelect2 });

      expect(result.current.handleSelect).not.toBe(firstHandleSelect);
    });

    it("returns new handleSelect when onOpenChange changes", () => {
      const onSelect = vi.fn();
      const onOpenChange1 = vi.fn();
      const onOpenChange2 = vi.fn();

      const { result, rerender } = renderHook(
        ({ onOpenChange }) =>
          useDropdownSelect({
            onSelect,
            onOpenChange,
          }),
        { initialProps: { onOpenChange: onOpenChange1 } }
      );

      const firstHandleSelect = result.current.handleSelect;

      rerender({ onOpenChange: onOpenChange2 });

      expect(result.current.handleSelect).not.toBe(firstHandleSelect);
    });
  });

  describe("Error Handling", () => {
    it("handles errors in onSelect gracefully", () => {
      const onSelect = vi.fn(() => {
        throw new Error("Select error");
      });
      const onOpenChange = vi.fn();

      const { result } = renderHook(() =>
        useDropdownSelect({
          onSelect,
          onOpenChange,
        })
      );

      expect(() => {
        act(() => {
          result.current.handleSelect("option1");
        });
      }).toThrow("Select error");

      // onOpenChange should not be called if onSelect throws
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });
});
