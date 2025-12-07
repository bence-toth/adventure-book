import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSelectKeyboardNavigation } from "../useSelectKeyboardNavigation";

describe("useSelectKeyboardNavigation", () => {
  const createMockEvent = (
    key: string,
    shiftKey = false
  ): React.KeyboardEvent => {
    return {
      key,
      shiftKey,
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent;
  };

  describe("Button Keyboard Handling (Closed State)", () => {
    it("opens dropdown on Enter key when closed", () => {
      const onOpenChange = vi.fn();

      const { result } = renderHook(() =>
        useSelectKeyboardNavigation({
          isOpen: false,
          activeIndex: null,
          optionsLength: 3,
          onSelect: vi.fn(),
          onOpenChange,
          setActiveIndex: vi.fn(),
          getOptionValue: vi.fn(),
        })
      );

      const event = createMockEvent("Enter");
      result.current.handleButtonKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("opens dropdown on Space key when closed", () => {
      const onOpenChange = vi.fn();

      const { result } = renderHook(() =>
        useSelectKeyboardNavigation({
          isOpen: false,
          activeIndex: null,
          optionsLength: 3,
          onSelect: vi.fn(),
          onOpenChange,
          setActiveIndex: vi.fn(),
          getOptionValue: vi.fn(),
        })
      );

      const event = createMockEvent(" ");
      result.current.handleButtonKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("does not handle keys when dropdown is open", () => {
      const onOpenChange = vi.fn();

      const { result } = renderHook(() =>
        useSelectKeyboardNavigation({
          isOpen: true,
          activeIndex: null,
          optionsLength: 3,
          onSelect: vi.fn(),
          onOpenChange,
          setActiveIndex: vi.fn(),
          getOptionValue: vi.fn(),
        })
      );

      const event = createMockEvent("Enter");
      result.current.handleButtonKeyDown(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("ignores other keys when closed", () => {
      const onOpenChange = vi.fn();

      const { result } = renderHook(() =>
        useSelectKeyboardNavigation({
          isOpen: false,
          activeIndex: null,
          optionsLength: 3,
          onSelect: vi.fn(),
          onOpenChange,
          setActiveIndex: vi.fn(),
          getOptionValue: vi.fn(),
        })
      );

      const event = createMockEvent("ArrowDown");
      result.current.handleButtonKeyDown(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe("Dropdown Tab Navigation", () => {
    it("moves to next item on Tab", () => {
      const setActiveIndex = vi.fn();

      const { result } = renderHook(() =>
        useSelectKeyboardNavigation({
          isOpen: true,
          activeIndex: 0,
          optionsLength: 3,
          onSelect: vi.fn(),
          onOpenChange: vi.fn(),
          setActiveIndex,
          getOptionValue: vi.fn(),
        })
      );

      const event = createMockEvent("Tab");
      result.current.handleDropdownKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(setActiveIndex).toHaveBeenCalled();

      const callback = setActiveIndex.mock.calls[0][0] as (
        prev: number | null
      ) => number | null;
      expect(callback(0)).toBe(1);
    });

    it("moves to previous item on Shift+Tab", () => {
      const setActiveIndex = vi.fn();

      const { result } = renderHook(() =>
        useSelectKeyboardNavigation({
          isOpen: true,
          activeIndex: 1,
          optionsLength: 3,
          onSelect: vi.fn(),
          onOpenChange: vi.fn(),
          setActiveIndex,
          getOptionValue: vi.fn(),
        })
      );

      const event = createMockEvent("Tab", true);
      result.current.handleDropdownKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();

      const callback = setActiveIndex.mock.calls[0][0] as (
        prev: number | null
      ) => number | null;
      expect(callback(1)).toBe(0);
    });

    it("wraps to first item on Tab from last position", () => {
      const setActiveIndex = vi.fn();

      const { result } = renderHook(() =>
        useSelectKeyboardNavigation({
          isOpen: true,
          activeIndex: 2,
          optionsLength: 3,
          onSelect: vi.fn(),
          onOpenChange: vi.fn(),
          setActiveIndex,
          getOptionValue: vi.fn(),
        })
      );

      const event = createMockEvent("Tab");
      result.current.handleDropdownKeyDown(event);

      const callback = setActiveIndex.mock.calls[0][0] as (
        prev: number | null
      ) => number | null;
      expect(callback(2)).toBe(0);
    });

    it("wraps to last item on Shift+Tab from first position", () => {
      const setActiveIndex = vi.fn();

      const { result } = renderHook(() =>
        useSelectKeyboardNavigation({
          isOpen: true,
          activeIndex: 0,
          optionsLength: 3,
          onSelect: vi.fn(),
          onOpenChange: vi.fn(),
          setActiveIndex,
          getOptionValue: vi.fn(),
        })
      );

      const event = createMockEvent("Tab", true);
      result.current.handleDropdownKeyDown(event);

      const callback = setActiveIndex.mock.calls[0][0] as (
        prev: number | null
      ) => number | null;
      expect(callback(0)).toBe(2);
    });

    it("starts at first item on Tab when no item is active", () => {
      const setActiveIndex = vi.fn();

      const { result } = renderHook(() =>
        useSelectKeyboardNavigation({
          isOpen: true,
          activeIndex: null,
          optionsLength: 3,
          onSelect: vi.fn(),
          onOpenChange: vi.fn(),
          setActiveIndex,
          getOptionValue: vi.fn(),
        })
      );

      const event = createMockEvent("Tab");
      result.current.handleDropdownKeyDown(event);

      const callback = setActiveIndex.mock.calls[0][0] as (
        prev: number | null
      ) => number | null;
      expect(callback(null)).toBe(0);
    });

    it("wraps to last item on Shift+Tab when no item is active", () => {
      const setActiveIndex = vi.fn();

      const { result } = renderHook(() =>
        useSelectKeyboardNavigation({
          isOpen: true,
          activeIndex: null,
          optionsLength: 3,
          onSelect: vi.fn(),
          onOpenChange: vi.fn(),
          setActiveIndex,
          getOptionValue: vi.fn(),
        })
      );

      const event = createMockEvent("Tab", true);
      result.current.handleDropdownKeyDown(event);

      const callback = setActiveIndex.mock.calls[0][0] as (
        prev: number | null
      ) => number | null;
      expect(callback(null)).toBe(2);
    });
  });

  describe("Dropdown Selection", () => {
    it("selects active option on Enter", () => {
      const onSelect = vi.fn();
      const onOpenChange = vi.fn();
      const getOptionValue = vi.fn().mockReturnValue("option-2");

      const { result } = renderHook(() =>
        useSelectKeyboardNavigation({
          isOpen: true,
          activeIndex: 1,
          optionsLength: 3,
          onSelect,
          onOpenChange,
          setActiveIndex: vi.fn(),
          getOptionValue,
        })
      );

      const event = createMockEvent("Enter");
      result.current.handleDropdownKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(getOptionValue).toHaveBeenCalledWith(1);
      expect(onSelect).toHaveBeenCalledWith("option-2");
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("selects active option on Space", () => {
      const onSelect = vi.fn();
      const onOpenChange = vi.fn();
      const getOptionValue = vi.fn().mockReturnValue("option-1");

      const { result } = renderHook(() =>
        useSelectKeyboardNavigation({
          isOpen: true,
          activeIndex: 0,
          optionsLength: 3,
          onSelect,
          onOpenChange,
          setActiveIndex: vi.fn(),
          getOptionValue,
        })
      );

      const event = createMockEvent(" ");
      result.current.handleDropdownKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(onSelect).toHaveBeenCalledWith("option-1");
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("does not select when no item is active", () => {
      const onSelect = vi.fn();
      const onOpenChange = vi.fn();

      const { result } = renderHook(() =>
        useSelectKeyboardNavigation({
          isOpen: true,
          activeIndex: null,
          optionsLength: 3,
          onSelect,
          onOpenChange,
          setActiveIndex: vi.fn(),
          getOptionValue: vi.fn(),
        })
      );

      const event = createMockEvent("Enter");
      result.current.handleDropdownKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(onSelect).not.toHaveBeenCalled();
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("does not select when getOptionValue returns undefined", () => {
      const onSelect = vi.fn();
      const onOpenChange = vi.fn();
      const getOptionValue = vi.fn().mockReturnValue(undefined);

      const { result } = renderHook(() =>
        useSelectKeyboardNavigation({
          isOpen: true,
          activeIndex: 0,
          optionsLength: 3,
          onSelect,
          onOpenChange,
          setActiveIndex: vi.fn(),
          getOptionValue,
        })
      );

      const event = createMockEvent("Enter");
      result.current.handleDropdownKeyDown(event);

      expect(onSelect).not.toHaveBeenCalled();
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe("Memoization", () => {
    it("returns same button handler when dependencies don't change", () => {
      const props = {
        isOpen: false,
        activeIndex: null,
        optionsLength: 3,
        onSelect: vi.fn(),
        onOpenChange: vi.fn(),
        setActiveIndex: vi.fn(),
        getOptionValue: vi.fn(),
      };

      const { result, rerender } = renderHook(() =>
        useSelectKeyboardNavigation(props)
      );

      const firstHandler = result.current.handleButtonKeyDown;

      rerender();

      expect(result.current.handleButtonKeyDown).toBe(firstHandler);
    });

    it("returns new button handler when isOpen changes", () => {
      const { result, rerender } = renderHook(
        ({ isOpen }) =>
          useSelectKeyboardNavigation({
            isOpen,
            activeIndex: null,
            optionsLength: 3,
            onSelect: vi.fn(),
            onOpenChange: vi.fn(),
            setActiveIndex: vi.fn(),
            getOptionValue: vi.fn(),
          }),
        { initialProps: { isOpen: false } }
      );

      const firstHandler = result.current.handleButtonKeyDown;

      rerender({ isOpen: true });

      expect(result.current.handleButtonKeyDown).not.toBe(firstHandler);
    });

    it("returns same dropdown handler when dependencies don't change", () => {
      const props = {
        isOpen: true,
        activeIndex: 0,
        optionsLength: 3,
        onSelect: vi.fn(),
        onOpenChange: vi.fn(),
        setActiveIndex: vi.fn(),
        getOptionValue: vi.fn(),
      };

      const { result, rerender } = renderHook(() =>
        useSelectKeyboardNavigation(props)
      );

      const firstHandler = result.current.handleDropdownKeyDown;

      rerender();

      expect(result.current.handleDropdownKeyDown).toBe(firstHandler);
    });

    it("returns new dropdown handler when activeIndex changes", () => {
      const { result, rerender } = renderHook(
        ({ activeIndex }) =>
          useSelectKeyboardNavigation({
            isOpen: true,
            activeIndex,
            optionsLength: 3,
            onSelect: vi.fn(),
            onOpenChange: vi.fn(),
            setActiveIndex: vi.fn(),
            getOptionValue: vi.fn(),
          }),
        { initialProps: { activeIndex: 0 } }
      );

      const firstHandler = result.current.handleDropdownKeyDown;

      rerender({ activeIndex: 1 });

      expect(result.current.handleDropdownKeyDown).not.toBe(firstHandler);
    });
  });
});
