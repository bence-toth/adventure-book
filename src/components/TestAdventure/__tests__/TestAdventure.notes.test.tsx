import { screen } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { TestAdventure } from "../TestAdventure";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { createMockPassage } from "@/__tests__/mockAdventureData";
import { PASSAGE_TEST_IDS } from "@/constants/testIds";
import type { Adventure } from "@/data/types";

const TEST_STORY_ID = "test-adventure-id";

// Mock react-router-dom navigate function
const mockNavigate = vi.fn();
let mockParams = { id: "1", adventureId: TEST_STORY_ID };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

// Mock localStorage utilities
vi.mock("@/utils/localStorage", async () => {
  const actual = await vi.importActual("@/utils/localStorage");
  return {
    ...actual,
    saveCurrentPassageId: vi.fn(),
    clearCurrentPassageId: vi.fn(),
    clearInventory: vi.fn(),
  };
});

// Mock adventureLoader
vi.mock("@/data/adventureLoader", async () => {
  const actual = await vi.importActual("@/data/adventureLoader");
  return {
    ...actual,
    addItemToInventory: vi.fn(),
    removeItemFromInventory: vi.fn(),
  };
});

describe("TestAdventure - Passage Notes", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
    mockParams = { id: "1", adventureId: TEST_STORY_ID };
  });

  describe("notes display in debug mode", () => {
    it("should display notes when debug mode is enabled and passage has notes", async () => {
      const passageWithNotes = createMockPassage(
        ["First paragraph", "Second paragraph"],
        {
          choices: [
            { text: "Choice 1", goto: 2 },
            { text: "Choice 2", goto: 3 },
          ],
        }
      );
      passageWithNotes.notes = "This is a developer note about this passage.";

      const mockAdventure: Adventure = {
        metadata: {
          title: "Test Adventure",
          author: "Test Author",
          version: "1.0.0",
        },
        intro: {
          paragraphs: ["Introduction"],
          action: "Start",
        },
        passages: {
          1: passageWithNotes,
          2: createMockPassage(["Ending"], { ending: true, type: "victory" }),
        },
        items: [],
      };

      renderWithAdventure(<TestAdventure />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      const notes = await screen.findByTestId(PASSAGE_TEST_IDS.NOTES);
      expect(notes).toBeInTheDocument();
      expect(notes).toHaveTextContent(
        "This is a developer note about this passage."
      );
    });

    it("should NOT display notes when debug mode is disabled", async () => {
      const passageWithNotes = createMockPassage(
        ["First paragraph", "Second paragraph"],
        {
          choices: [
            { text: "Choice 1", goto: 2 },
            { text: "Choice 2", goto: 3 },
          ],
        }
      );
      passageWithNotes.notes = "This note should not be visible.";

      const mockAdventure: Adventure = {
        metadata: {
          title: "Test Adventure",
          author: "Test Author",
          version: "1.0.0",
        },
        intro: {
          paragraphs: ["Introduction"],
          action: "Start",
        },
        passages: {
          1: passageWithNotes,
          2: createMockPassage(["Ending"], { ending: true, type: "victory" }),
        },
        items: [],
      };

      renderWithAdventure(<TestAdventure />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: false,
      });

      const notes = screen.queryByTestId(PASSAGE_TEST_IDS.NOTES);
      expect(notes).not.toBeInTheDocument();
    });

    it("should NOT display notes section when passage has no notes even in debug mode", async () => {
      const passageWithoutNotes = createMockPassage(
        ["First paragraph", "Second paragraph"],
        {
          choices: [
            { text: "Choice 1", goto: 2 },
            { text: "Choice 2", goto: 3 },
          ],
        }
      );

      const mockAdventure: Adventure = {
        metadata: {
          title: "Test Adventure",
          author: "Test Author",
          version: "1.0.0",
        },
        intro: {
          paragraphs: ["Introduction"],
          action: "Start",
        },
        passages: {
          1: passageWithoutNotes,
          2: createMockPassage(["Ending"], { ending: true, type: "victory" }),
        },
        items: [],
      };

      renderWithAdventure(<TestAdventure />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      const notes = screen.queryByTestId(PASSAGE_TEST_IDS.NOTES);
      expect(notes).not.toBeInTheDocument();
    });

    it("should display notes on ending passages when in debug mode", async () => {
      mockParams = { id: "2", adventureId: TEST_STORY_ID };

      const endingPassageWithNotes = createMockPassage(
        ["This is the ending."],
        { ending: true, type: "victory" }
      );
      endingPassageWithNotes.notes = "Victory ending - player succeeded.";

      const mockAdventure: Adventure = {
        metadata: {
          title: "Test Adventure",
          author: "Test Author",
          version: "1.0.0",
        },
        intro: {
          paragraphs: ["Introduction"],
          action: "Start",
        },
        passages: {
          1: createMockPassage(["Start"], {
            choices: [{ text: "End", goto: 2 }],
          }),
          2: endingPassageWithNotes,
        },
        items: [],
      };

      renderWithAdventure(<TestAdventure />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      const notes = await screen.findByTestId(PASSAGE_TEST_IDS.NOTES);
      expect(notes).toBeInTheDocument();
      expect(notes).toHaveTextContent("Victory ending - player succeeded.");
    });

    it("should handle empty string notes by not displaying them", async () => {
      const passageWithEmptyNotes = createMockPassage(["First paragraph"], {
        choices: [{ text: "Choice 1", goto: 2 }],
      });
      passageWithEmptyNotes.notes = "";

      const mockAdventure: Adventure = {
        metadata: {
          title: "Test Adventure",
          author: "Test Author",
          version: "1.0.0",
        },
        intro: {
          paragraphs: ["Introduction"],
          action: "Start",
        },
        passages: {
          1: passageWithEmptyNotes,
          2: createMockPassage(["Ending"], { ending: true, type: "victory" }),
        },
        items: [],
      };

      renderWithAdventure(<TestAdventure />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      // Empty notes should not be rendered
      const notes = screen.queryByTestId(PASSAGE_TEST_IDS.NOTES);
      expect(notes).not.toBeInTheDocument();
    });

    it("should display multi-line notes correctly", async () => {
      const passageWithMultilineNotes = createMockPassage(["First paragraph"], {
        choices: [{ text: "Choice 1", goto: 2 }],
      });
      passageWithMultilineNotes.notes = `This is a multi-line note.
It has multiple lines.
Each line provides context.`;

      const mockAdventure: Adventure = {
        metadata: {
          title: "Test Adventure",
          author: "Test Author",
          version: "1.0.0",
        },
        intro: {
          paragraphs: ["Introduction"],
          action: "Start",
        },
        passages: {
          1: passageWithMultilineNotes,
          2: createMockPassage(["Ending"], { ending: true, type: "victory" }),
        },
        items: [],
      };

      renderWithAdventure(<TestAdventure />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      const notes = await screen.findByTestId(PASSAGE_TEST_IDS.NOTES);
      expect(notes).toBeInTheDocument();
      expect(notes).toHaveTextContent("This is a multi-line note.");
      expect(notes).toHaveTextContent("It has multiple lines.");
      expect(notes).toHaveTextContent("Each line provides context.");
    });
  });

  describe("notes positioning", () => {
    it("should render notes before passage text", async () => {
      const passageWithNotes = createMockPassage(
        ["This is the passage text."],
        {
          choices: [{ text: "Choice 1", goto: 2 }],
        }
      );
      passageWithNotes.notes = "Notes should appear first.";

      const mockAdventure: Adventure = {
        metadata: {
          title: "Test Adventure",
          author: "Test Author",
          version: "1.0.0",
        },
        intro: {
          paragraphs: ["Introduction"],
          action: "Start",
        },
        passages: {
          1: passageWithNotes,
          2: createMockPassage(["Ending"], { ending: true, type: "victory" }),
        },
        items: [],
      };

      renderWithAdventure(<TestAdventure />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      const container = await screen.findByTestId(PASSAGE_TEST_IDS.CONTAINER);
      const notes = await screen.findByTestId(PASSAGE_TEST_IDS.NOTES);
      const text = await screen.findByTestId(PASSAGE_TEST_IDS.TEXT);

      // Check that notes appears before text in the DOM
      const containerChildren = Array.from(container.children);
      const notesIndex = containerChildren.indexOf(notes);
      const textIndex = containerChildren.indexOf(text);

      expect(notesIndex).toBeLessThan(textIndex);
    });
  });
});
