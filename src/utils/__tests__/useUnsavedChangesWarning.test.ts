import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useUnsavedChangesWarning } from "../useUnsavedChangesWarning";
import * as ReactRouterDom from "react-router-dom";
import { NavigationType } from "react-router";

// Mock React Router's useBlocker
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof ReactRouterDom>("react-router-dom");
  return {
    ...actual,
    useBlocker: vi.fn(),
  };
});

describe("useUnsavedChangesWarning", () => {
  const mockLocation = {
    pathname: "/adventure/test-id/edit",
    search: "",
    hash: "",
    state: null,
    key: "default",
  } as ReactRouterDom.Location;

  const mockBlocker = {
    state: "unblocked" as const,
    proceed: undefined,
    reset: undefined,
    location: undefined,
  } as ReactRouterDom.Blocker;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ReactRouterDom.useBlocker).mockReturnValue(mockBlocker);
  });

  it("initializes with modal closed", () => {
    const { result } = renderHook(() =>
      useUnsavedChangesWarning({ hasUnsavedChanges: false })
    );

    expect(result.current.isModalOpen).toBe(false);
  });

  it("blocks navigation when there are unsaved changes", () => {
    renderHook(() => useUnsavedChangesWarning({ hasUnsavedChanges: true }));

    expect(ReactRouterDom.useBlocker).toHaveBeenCalledWith(
      expect.any(Function)
    );

    // Test the blocker function
    const blockerFn = vi.mocked(ReactRouterDom.useBlocker).mock
      .calls[0][0] as ReactRouterDom.BlockerFunction;
    const shouldBlock = blockerFn({
      currentLocation: { pathname: "/edit/1" } as ReactRouterDom.Location,
      nextLocation: { pathname: "/edit/2" } as ReactRouterDom.Location,
      historyAction: NavigationType.Push,
    });

    expect(shouldBlock).toBe(true);
  });

  it("does not block navigation when there are no unsaved changes", () => {
    renderHook(() => useUnsavedChangesWarning({ hasUnsavedChanges: false }));

    const blockerFn = vi.mocked(ReactRouterDom.useBlocker).mock
      .calls[0][0] as ReactRouterDom.BlockerFunction;
    const shouldBlock = blockerFn({
      currentLocation: { pathname: "/edit/1" } as ReactRouterDom.Location,
      nextLocation: { pathname: "/edit/2" } as ReactRouterDom.Location,
      historyAction: NavigationType.Push,
    });

    expect(shouldBlock).toBe(false);
  });

  it("does not block navigation to the same location", () => {
    renderHook(() => useUnsavedChangesWarning({ hasUnsavedChanges: true }));

    const blockerFn = vi.mocked(ReactRouterDom.useBlocker).mock
      .calls[0][0] as ReactRouterDom.BlockerFunction;
    const shouldBlock = blockerFn({
      currentLocation: { pathname: "/edit/1" } as ReactRouterDom.Location,
      nextLocation: { pathname: "/edit/1" } as ReactRouterDom.Location,
      historyAction: NavigationType.Push,
    });

    expect(shouldBlock).toBe(false);
  });

  it("opens modal when navigation is blocked", () => {
    const blockedBlocker = {
      state: "blocked" as const,
      location: mockLocation,
      proceed: vi.fn(),
      reset: vi.fn(),
    } as ReactRouterDom.Blocker;

    vi.mocked(ReactRouterDom.useBlocker).mockReturnValue(blockedBlocker);

    const { result } = renderHook(() =>
      useUnsavedChangesWarning({ hasUnsavedChanges: true })
    );

    expect(result.current.isModalOpen).toBe(true);
  });

  it("proceeds with navigation when proceedNavigation is called", () => {
    const blockedBlocker = {
      state: "blocked" as const,
      location: mockLocation,
      proceed: vi.fn(),
      reset: vi.fn(),
    } as ReactRouterDom.Blocker;

    vi.mocked(ReactRouterDom.useBlocker).mockReturnValue(blockedBlocker);

    const { result } = renderHook(() =>
      useUnsavedChangesWarning({ hasUnsavedChanges: true })
    );

    act(() => {
      result.current.proceedNavigation();
    });

    expect(blockedBlocker.proceed).toHaveBeenCalled();
  });

  it("cancels navigation when cancelNavigation is called", () => {
    const blockedBlocker = {
      state: "blocked" as const,
      location: mockLocation,
      proceed: vi.fn(),
      reset: vi.fn(),
    } as ReactRouterDom.Blocker;

    vi.mocked(ReactRouterDom.useBlocker).mockReturnValue(blockedBlocker);

    const { result } = renderHook(() =>
      useUnsavedChangesWarning({ hasUnsavedChanges: true })
    );

    act(() => {
      result.current.cancelNavigation();
    });

    expect(blockedBlocker.reset).toHaveBeenCalled();
  });

  it("does not call blocker methods when modal is closed and not blocked", () => {
    const { result } = renderHook(() =>
      useUnsavedChangesWarning({ hasUnsavedChanges: false })
    );

    // Simply verify these methods can be called without error
    act(() => {
      result.current.proceedNavigation();
    });

    act(() => {
      result.current.cancelNavigation();
    });

    // No assertions needed - we're just verifying no errors occur
  });
});
