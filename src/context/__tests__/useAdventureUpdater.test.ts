import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import "fake-indexeddb/auto";
import { useAdventureUpdater } from "../useAdventureUpdater";
import * as adventureDatabase from "@/data/adventureDatabase";
import { AdventureSerializer } from "@/data/adventureSerializer";
import type { Adventure, Passage } from "@/data/types";

const mockAdventure: Adventure = {
  metadata: {
    title: "Test Adventure",
    author: "Test Author",
    version: "1.0.0",
  },
  intro: {
    paragraphs: ["Welcome to the test adventure."],
    action: "Begin",
  },
  passages: {
    1: {
      paragraphs: ["You are at the start."],
      choices: [
        {
          text: "Go forward",
          goto: 2,
        },
      ],
    },
    2: {
      paragraphs: ["You went forward."],
      type: "victory",
      ending: true,
    },
  },
  items: [],
};

describe("useAdventureUpdater", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSetAdventure: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockWithSaving: any;
  let updateAdventureContentSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    // Clear IndexedDB before each test
    const dbs = await indexedDB.databases();
    await Promise.all(
      dbs.map(
        (db) =>
          new Promise<void>((resolve) => {
            const request = indexedDB.deleteDatabase(db.name!);
            request.onsuccess = () => resolve();
            request.onerror = () => resolve();
          })
      )
    );

    // Save mock adventure to database
    const yamlContent = AdventureSerializer.serializeToString(mockAdventure);
    await adventureDatabase.saveAdventure({
      id: "test-id",
      title: mockAdventure.metadata.title,
      content: yamlContent,
      lastEdited: new Date(),
      createdAt: new Date(),
    });

    mockSetAdventure = vi.fn();
    mockWithSaving = vi.fn((fn) => fn());
    updateAdventureContentSpy = vi.spyOn(
      adventureDatabase,
      "updateAdventureContent"
    );
    vi.clearAllMocks();
  });

  describe("updateIntroduction", () => {
    it("should update introduction title and text", async () => {
      const { result } = renderHook(() =>
        useAdventureUpdater(
          mockAdventure,
          "test-id",
          mockSetAdventure,
          mockWithSaving
        )
      );

      const newTitle = "Updated Title";
      const newText = "First paragraph\n\nSecond paragraph";

      await act(async () => {
        await result.current.updateIntroduction(newTitle, newText);
      });

      expect(mockWithSaving).toHaveBeenCalledTimes(1);
      expect(mockSetAdventure).toHaveBeenCalledTimes(1);

      const updatedAdventure = mockSetAdventure.mock.calls[0][0];
      expect(updatedAdventure.metadata.title).toBe(newTitle);
      expect(updatedAdventure.intro.paragraphs).toEqual([
        "First paragraph",
        "Second paragraph",
      ]);
    });

    it("should split text into paragraphs correctly", async () => {
      const { result } = renderHook(() =>
        useAdventureUpdater(
          mockAdventure,
          "test-id",
          mockSetAdventure,
          mockWithSaving
        )
      );

      const text =
        "Paragraph one\n\nParagraph two\n\nParagraph three\n\nParagraph four";

      await act(async () => {
        await result.current.updateIntroduction("Title", text);
      });

      const updatedAdventure = mockSetAdventure.mock.calls[0][0];
      expect(updatedAdventure.intro.paragraphs).toEqual([
        "Paragraph one",
        "Paragraph two",
        "Paragraph three",
        "Paragraph four",
      ]);
    });

    it("should trim paragraphs and filter empty ones", async () => {
      const { result } = renderHook(() =>
        useAdventureUpdater(
          mockAdventure,
          "test-id",
          mockSetAdventure,
          mockWithSaving
        )
      );

      const text = "  Paragraph one  \n\n\n\n  Paragraph two  \n\n  ";

      await act(async () => {
        await result.current.updateIntroduction("Title", text);
      });

      const updatedAdventure = mockSetAdventure.mock.calls[0][0];
      expect(updatedAdventure.intro.paragraphs).toEqual([
        "Paragraph one",
        "Paragraph two",
      ]);
    });

    it("should serialize and save to database", async () => {
      const serializeSpy = vi.spyOn(AdventureSerializer, "serializeToString");

      const { result } = renderHook(() =>
        useAdventureUpdater(
          mockAdventure,
          "test-id",
          mockSetAdventure,
          mockWithSaving
        )
      );

      await act(async () => {
        await result.current.updateIntroduction("New Title", "New text");
      });

      expect(serializeSpy).toHaveBeenCalledTimes(1);
      expect(updateAdventureContentSpy).toHaveBeenCalledWith(
        "test-id",
        expect.any(String)
      );

      serializeSpy.mockRestore();
    });

    it("should not update when adventure is null", async () => {
      const { result } = renderHook(() =>
        useAdventureUpdater(null, "test-id", mockSetAdventure, mockWithSaving)
      );

      await act(async () => {
        await result.current.updateIntroduction("Title", "Text");
      });

      expect(mockWithSaving).not.toHaveBeenCalled();
      expect(mockSetAdventure).not.toHaveBeenCalled();
      expect(updateAdventureContentSpy).not.toHaveBeenCalled();
    });

    it("should not update when adventureId is null", async () => {
      const { result } = renderHook(() =>
        useAdventureUpdater(
          mockAdventure,
          null,
          mockSetAdventure,
          mockWithSaving
        )
      );

      await act(async () => {
        await result.current.updateIntroduction("Title", "Text");
      });

      expect(mockWithSaving).not.toHaveBeenCalled();
      expect(mockSetAdventure).not.toHaveBeenCalled();
      expect(updateAdventureContentSpy).not.toHaveBeenCalled();
    });

    it("should preserve other adventure properties", async () => {
      const { result } = renderHook(() =>
        useAdventureUpdater(
          mockAdventure,
          "test-id",
          mockSetAdventure,
          mockWithSaving
        )
      );

      await act(async () => {
        await result.current.updateIntroduction("New Title", "New text");
      });

      const updatedAdventure = mockSetAdventure.mock.calls[0][0];
      expect(updatedAdventure.metadata.author).toBe(
        mockAdventure.metadata.author
      );
      expect(updatedAdventure.metadata.version).toBe(
        mockAdventure.metadata.version
      );
      expect(updatedAdventure.intro.action).toBe(mockAdventure.intro.action);
      expect(updatedAdventure.passages).toEqual(mockAdventure.passages);
    });
  });

  describe("updatePassage", () => {
    it("should update a passage", async () => {
      const { result } = renderHook(() =>
        useAdventureUpdater(
          mockAdventure,
          "test-id",
          mockSetAdventure,
          mockWithSaving
        )
      );

      const updatedPassage: Passage = {
        paragraphs: ["Updated passage text"],
        choices: [
          {
            text: "New choice",
            goto: 3,
          },
        ],
      };

      await act(async () => {
        await result.current.updatePassage(1, updatedPassage);
      });

      expect(mockWithSaving).toHaveBeenCalledTimes(1);
      expect(mockSetAdventure).toHaveBeenCalledTimes(1);

      const updatedAdventure = mockSetAdventure.mock.calls[0][0];
      expect(updatedAdventure.passages[1]).toEqual(updatedPassage);
    });

    it("should preserve other passages when updating one", async () => {
      const { result } = renderHook(() =>
        useAdventureUpdater(
          mockAdventure,
          "test-id",
          mockSetAdventure,
          mockWithSaving
        )
      );

      const updatedPassage: Passage = {
        paragraphs: ["Updated passage"],
        choices: [],
      };

      await act(async () => {
        await result.current.updatePassage(1, updatedPassage);
      });

      const updatedAdventure = mockSetAdventure.mock.calls[0][0];
      expect(updatedAdventure.passages[2]).toEqual(mockAdventure.passages[2]);
    });

    it("should serialize and save to database", async () => {
      const serializeSpy = vi.spyOn(AdventureSerializer, "serializeToString");

      const { result } = renderHook(() =>
        useAdventureUpdater(
          mockAdventure,
          "test-id",
          mockSetAdventure,
          mockWithSaving
        )
      );

      const updatedPassage: Passage = {
        paragraphs: ["Updated passage"],
        choices: [],
      };

      await act(async () => {
        await result.current.updatePassage(1, updatedPassage);
      });

      expect(serializeSpy).toHaveBeenCalledTimes(1);
      expect(updateAdventureContentSpy).toHaveBeenCalledWith(
        "test-id",
        expect.any(String)
      );

      serializeSpy.mockRestore();
    });

    it("should not update when adventure is null", async () => {
      const { result } = renderHook(() =>
        useAdventureUpdater(null, "test-id", mockSetAdventure, mockWithSaving)
      );

      const updatedPassage: Passage = {
        paragraphs: ["Updated passage"],
        choices: [],
      };

      await act(async () => {
        await result.current.updatePassage(1, updatedPassage);
      });

      expect(mockWithSaving).not.toHaveBeenCalled();
      expect(mockSetAdventure).not.toHaveBeenCalled();
      expect(updateAdventureContentSpy).not.toHaveBeenCalled();
    });

    it("should not update when adventureId is null", async () => {
      const { result } = renderHook(() =>
        useAdventureUpdater(
          mockAdventure,
          null,
          mockSetAdventure,
          mockWithSaving
        )
      );

      const updatedPassage: Passage = {
        paragraphs: ["Updated passage"],
        choices: [],
      };

      await act(async () => {
        await result.current.updatePassage(1, updatedPassage);
      });

      expect(mockWithSaving).not.toHaveBeenCalled();
      expect(mockSetAdventure).not.toHaveBeenCalled();
      expect(updateAdventureContentSpy).not.toHaveBeenCalled();
    });

    it("should preserve other adventure properties", async () => {
      const { result } = renderHook(() =>
        useAdventureUpdater(
          mockAdventure,
          "test-id",
          mockSetAdventure,
          mockWithSaving
        )
      );

      const updatedPassage: Passage = {
        paragraphs: ["Updated passage"],
        choices: [],
      };

      await act(async () => {
        await result.current.updatePassage(1, updatedPassage);
      });

      const updatedAdventure = mockSetAdventure.mock.calls[0][0];
      expect(updatedAdventure.metadata).toEqual(mockAdventure.metadata);
      expect(updatedAdventure.intro).toEqual(mockAdventure.intro);
    });

    it("should handle adding a new passage", async () => {
      const { result } = renderHook(() =>
        useAdventureUpdater(
          mockAdventure,
          "test-id",
          mockSetAdventure,
          mockWithSaving
        )
      );

      const updatedPassage: Passage = {
        paragraphs: ["New passage"],
        choices: [],
      };

      await act(async () => {
        await result.current.updatePassage(3, updatedPassage);
      });

      const updatedAdventure = mockSetAdventure.mock.calls[0][0];
      expect(updatedAdventure.passages[3]).toEqual(updatedPassage);
      expect(updatedAdventure.passages[1]).toEqual(mockAdventure.passages[1]);
      expect(updatedAdventure.passages[2]).toEqual(mockAdventure.passages[2]);
    });
  });

  describe("function stability", () => {
    it("should return stable functions when dependencies do not change", () => {
      const { result, rerender } = renderHook(() =>
        useAdventureUpdater(
          mockAdventure,
          "test-id",
          mockSetAdventure,
          mockWithSaving
        )
      );

      const firstUpdateIntroduction = result.current.updateIntroduction;
      const firstUpdatePassage = result.current.updatePassage;

      rerender();

      expect(result.current.updateIntroduction).toBe(firstUpdateIntroduction);
      expect(result.current.updatePassage).toBe(firstUpdatePassage);
    });

    it("should return new functions when adventure changes", () => {
      const { result, rerender } = renderHook(
        ({ adventure }) =>
          useAdventureUpdater(
            adventure,
            "test-id",
            mockSetAdventure,
            mockWithSaving
          ),
        { initialProps: { adventure: mockAdventure } }
      );

      const firstUpdateIntroduction = result.current.updateIntroduction;
      const firstUpdatePassage = result.current.updatePassage;

      const newAdventure = {
        ...mockAdventure,
        metadata: { ...mockAdventure.metadata, title: "New Title" },
      };

      rerender({ adventure: newAdventure });

      expect(result.current.updateIntroduction).not.toBe(
        firstUpdateIntroduction
      );
      expect(result.current.updatePassage).not.toBe(firstUpdatePassage);
    });
  });
});
