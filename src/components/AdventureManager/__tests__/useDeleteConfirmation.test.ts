import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useDeleteConfirmation } from "../useDeleteConfirmation";

describe("useDeleteConfirmation", () => {
  let mockOnConfirmDelete: (id: string) => Promise<void>;

  beforeEach(() => {
    mockOnConfirmDelete = vi.fn().mockResolvedValue(undefined);
  });

  it("starts with no adventure being deleted", () => {
    const { result } = renderHook(() =>
      useDeleteConfirmation(mockOnConfirmDelete)
    );

    expect(result.current.deletingAdventureId).toBe(null);
  });

  describe("Delete Click", () => {
    it("sets deleting adventure ID when delete is clicked", () => {
      const { result } = renderHook(() =>
        useDeleteConfirmation(mockOnConfirmDelete)
      );

      act(() => {
        result.current.handleDeleteClick("adventure-1");
      });

      expect(result.current.deletingAdventureId).toBe("adventure-1");
    });

    it("can change deleting adventure ID", () => {
      const { result } = renderHook(() =>
        useDeleteConfirmation(mockOnConfirmDelete)
      );

      act(() => {
        result.current.handleDeleteClick("adventure-1");
      });
      expect(result.current.deletingAdventureId).toBe("adventure-1");

      act(() => {
        result.current.handleDeleteClick("adventure-2");
      });
      expect(result.current.deletingAdventureId).toBe("adventure-2");
    });
  });

  describe("Confirm Delete", () => {
    it("calls onConfirmDelete with adventure ID and clears state", async () => {
      const { result } = renderHook(() =>
        useDeleteConfirmation(mockOnConfirmDelete)
      );

      act(() => {
        result.current.handleDeleteClick("adventure-1");
      });
      expect(result.current.deletingAdventureId).toBe("adventure-1");

      await act(async () => {
        await result.current.handleConfirmDelete();
      });

      expect(mockOnConfirmDelete).toHaveBeenCalledWith("adventure-1");
      await waitFor(() => {
        expect(result.current.deletingAdventureId).toBe(null);
      });
    });

    it("does nothing when no adventure is being deleted", async () => {
      const { result } = renderHook(() =>
        useDeleteConfirmation(mockOnConfirmDelete)
      );

      await act(async () => {
        await result.current.handleConfirmDelete();
      });

      expect(mockOnConfirmDelete).not.toHaveBeenCalled();
      expect(result.current.deletingAdventureId).toBe(null);
    });
  });

  describe("Cancel Delete", () => {
    it("clears deleting adventure ID when cancel is clicked", () => {
      const { result } = renderHook(() =>
        useDeleteConfirmation(mockOnConfirmDelete)
      );

      act(() => {
        result.current.handleDeleteClick("adventure-1");
      });
      expect(result.current.deletingAdventureId).toBe("adventure-1");

      act(() => {
        result.current.handleCancelDelete();
      });

      expect(result.current.deletingAdventureId).toBe(null);
      expect(mockOnConfirmDelete).not.toHaveBeenCalled();
    });

    it("can be called when no adventure is being deleted", () => {
      const { result } = renderHook(() =>
        useDeleteConfirmation(mockOnConfirmDelete)
      );

      act(() => {
        result.current.handleCancelDelete();
      });

      expect(result.current.deletingAdventureId).toBe(null);
      expect(mockOnConfirmDelete).not.toHaveBeenCalled();
    });
  });
});
