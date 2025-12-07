import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useAdventureStories } from "../useAdventureStories";
import * as adventureDatabase from "@/data/adventureDatabase";
import type { StoredAdventure } from "@/data/adventureDatabase";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock adventureDatabase
vi.mock("@/data/adventureDatabase", async () => {
  const actual = await vi.importActual("@/data/adventureDatabase");
  return {
    ...actual,
    listStories: vi.fn(),
    deleteAdventure: vi.fn(),
    createAdventure: vi.fn(),
  };
});

describe("useAdventureStories", () => {
  const mockStories: StoredAdventure[] = [
    {
      id: "adventure-1",
      title: "Adventure One",
      content: "mock content",
      lastEdited: new Date("2025-11-10T12:00:00"),
      createdAt: new Date("2025-11-01T12:00:00"),
    },
    {
      id: "adventure-2",
      title: "Adventure Two",
      content: "mock content 2",
      lastEdited: new Date("2025-11-09T12:00:00"),
      createdAt: new Date("2025-11-02T12:00:00"),
    },
  ];

  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(adventureDatabase.listStories).mockClear();
    vi.mocked(adventureDatabase.deleteAdventure).mockClear();
    vi.mocked(adventureDatabase.createAdventure).mockClear();
  });

  describe("Loading Stories", () => {
    it("starts with loading true and empty stories", () => {
      vi.mocked(adventureDatabase.listStories).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useAdventureStories());

      expect(result.current.loading).toBe(true);
      expect(result.current.stories).toEqual([]);
      expect(result.current.error).toBe(null);
    });

    it("loads stories successfully on mount", async () => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);

      const { result } = renderHook(() => useAdventureStories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.stories).toEqual(mockStories);
      expect(result.current.error).toBe(null);
      expect(adventureDatabase.listStories).toHaveBeenCalledTimes(1);
    });

    it("sets error state when loading fails", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      vi.mocked(adventureDatabase.listStories).mockRejectedValue(
        new Error("Failed to load")
      );

      const { result } = renderHook(() => useAdventureStories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("load");
      expect(result.current.stories).toEqual([]);

      consoleSpy.mockRestore();
    });

    it("can reload stories manually", async () => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);

      const { result } = renderHook(() => useAdventureStories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Load new data
      const updatedStories = [mockStories[0]];
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(
        updatedStories
      );

      await act(async () => {
        await result.current.loadStories();
      });

      await waitFor(() => {
        expect(result.current.stories).toEqual(updatedStories);
      });

      expect(adventureDatabase.listStories).toHaveBeenCalledTimes(2);
    });
  });

  describe("Opening Adventure", () => {
    it("navigates to adventure test route", async () => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);

      const { result } = renderHook(() => useAdventureStories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      result.current.handleOpenAdventure("adventure-1");

      expect(mockNavigate).toHaveBeenCalledWith(
        "/adventure/adventure-1/test/introduction"
      );
    });
  });

  describe("Creating Adventure", () => {
    it("creates adventure and navigates to it", async () => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);
      vi.mocked(adventureDatabase.createAdventure).mockResolvedValue(
        "new-adventure-id"
      );

      const { result } = renderHook(() => useAdventureStories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.handleCreateAdventure();
      });

      expect(adventureDatabase.createAdventure).toHaveBeenCalledWith(
        "Untitled adventure",
        expect.stringContaining('title: "Untitled adventure"')
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        "/adventure/new-adventure-id/test/introduction"
      );
    });

    it("sets error state when creation fails", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);
      vi.mocked(adventureDatabase.createAdventure).mockRejectedValue(
        new Error("Failed to create")
      );

      const { result } = renderHook(() => useAdventureStories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.handleCreateAdventure();
      });

      await waitFor(() => {
        expect(result.current.error).toBe("create");
      });
      expect(mockNavigate).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("Deleting Adventure", () => {
    it("deletes adventure and reloads list", async () => {
      vi.mocked(adventureDatabase.listStories)
        .mockResolvedValueOnce(mockStories) // Initial load
        .mockResolvedValueOnce([mockStories[1]]); // After deletion
      vi.mocked(adventureDatabase.deleteAdventure).mockResolvedValue();

      const { result } = renderHook(() => useAdventureStories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.handleDeleteAdventure("adventure-1");
      });

      expect(adventureDatabase.deleteAdventure).toHaveBeenCalledWith(
        "adventure-1"
      );
      await waitFor(() => {
        expect(result.current.stories).toEqual([mockStories[1]]);
      });
    });

    it("sets error state when deletion fails", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);
      vi.mocked(adventureDatabase.deleteAdventure).mockRejectedValue(
        new Error("Failed to delete")
      );

      const { result } = renderHook(() => useAdventureStories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.handleDeleteAdventure("adventure-1");
      });

      await waitFor(() => {
        expect(result.current.error).toBe("delete");
      });
      expect(result.current.stories).toEqual(mockStories);

      consoleSpy.mockRestore();
    });
  });
});
