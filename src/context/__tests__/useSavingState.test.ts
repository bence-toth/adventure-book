import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSavingState } from "../useSavingState";

describe("useSavingState", () => {
  it("should initialize with isSaving as false", () => {
    const { result } = renderHook(() => useSavingState());

    expect(result.current.isSaving).toBe(false);
    expect(result.current.withSaving).toBeInstanceOf(Function);
  });

  it("should not show saving state for operations shorter than 500ms", async () => {
    const { result } = renderHook(() => useSavingState());

    await act(async () => {
      await result.current.withSaving(async () => {
        // Fast operation
        await new Promise((resolve) => setTimeout(resolve, 100));
        return "result";
      });
    });

    // Operation completed before 500ms, should never show saving
    expect(result.current.isSaving).toBe(false);
  });

  it("should show saving state for operations longer than 500ms", async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useSavingState());

    // Start a long operation
    let resolveOp: () => void;
    const opPromise = new Promise<void>((resolve) => {
      resolveOp = resolve;
    });

    act(() => {
      result.current.withSaving(async () => {
        await opPromise;
        return "result";
      });
    });

    // Initially false
    expect(result.current.isSaving).toBe(false);

    // Advance past 500ms threshold
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should now be true
    expect(result.current.isSaving).toBe(true);

    // Complete the operation
    await act(async () => {
      resolveOp!();
      await Promise.resolve();
    });

    // Should be false after completion
    expect(result.current.isSaving).toBe(false);

    vi.useRealTimers();
  });

  it("should handle multiple concurrent saves correctly", async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useSavingState());

    let resolveOp1: () => void;
    let resolveOp2: () => void;

    const op1Promise = new Promise<void>((resolve) => {
      resolveOp1 = resolve;
    });
    const op2Promise = new Promise<void>((resolve) => {
      resolveOp2 = resolve;
    });

    // Start two operations
    act(() => {
      result.current.withSaving(async () => {
        await op1Promise;
        return "result1";
      });

      result.current.withSaving(async () => {
        await op2Promise;
        return "result2";
      });
    });

    // Advance past 500ms threshold
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.isSaving).toBe(true);

    // Complete second operation
    await act(async () => {
      resolveOp2!();
      await Promise.resolve();
    });

    // Should still be saving because operation1 is still running
    expect(result.current.isSaving).toBe(true);

    // Complete first operation
    await act(async () => {
      resolveOp1!();
      await Promise.resolve();
    });

    // Should be false now that all operations are complete
    expect(result.current.isSaving).toBe(false);

    vi.useRealTimers();
  });

  it("should cleanup timeout on unmount", () => {
    const { unmount } = renderHook(() => useSavingState());

    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");

    // Unmount the hook
    unmount();

    // Verify clearTimeout was not called if no operations were running
    // (timeout is only created when withSaving is called)
    expect(clearTimeoutSpy).not.toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it("should return the result of the async operation", async () => {
    const { result } = renderHook(() => useSavingState());

    const testResult = await act(async () => {
      return result.current.withSaving(async () => {
        return "test-result";
      });
    });

    expect(testResult).toBe("test-result");
  });

  it("should propagate errors from async operations", async () => {
    const { result } = renderHook(() => useSavingState());

    const testError = new Error("Test error");

    await expect(
      act(async () => {
        return result.current.withSaving(async () => {
          throw testError;
        });
      })
    ).rejects.toThrow("Test error");

    // Saving state should be reset even after error
    expect(result.current.isSaving).toBe(false);
  });

  it("should handle ref counting correctly with sequential operations", async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useSavingState());

    let resolveOp1: () => void;
    let resolveOp2: () => void;
    let resolveOp3: () => void;

    const op1Promise = new Promise<void>((resolve) => {
      resolveOp1 = resolve;
    });
    const op2Promise = new Promise<void>((resolve) => {
      resolveOp2 = resolve;
    });
    const op3Promise = new Promise<void>((resolve) => {
      resolveOp3 = resolve;
    });

    // Start three operations
    act(() => {
      result.current.withSaving(async () => {
        await op1Promise;
        return "result1";
      });

      result.current.withSaving(async () => {
        await op2Promise;
        return "result2";
      });

      result.current.withSaving(async () => {
        await op3Promise;
        return "result3";
      });
    });

    // Advance past threshold
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.isSaving).toBe(true);

    // Complete first operation
    await act(async () => {
      resolveOp1!();
      await Promise.resolve();
    });
    expect(result.current.isSaving).toBe(true); // Still saving

    // Complete second operation
    await act(async () => {
      resolveOp2!();
      await Promise.resolve();
    });
    expect(result.current.isSaving).toBe(true); // Still saving

    // Complete third operation
    await act(async () => {
      resolveOp3!();
      await Promise.resolve();
    });

    // All operations complete, should be false
    expect(result.current.isSaving).toBe(false);

    vi.useRealTimers();
  });
});
