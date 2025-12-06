import { screen } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { AdventureContent } from "../AdventureContent";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { createMockPassage } from "@/__tests__/mockAdventureData";
import type { Adventure } from "@/data/types";

const TEST_STORY_ID = "test-adventure-id";

let mockParams = { id: "1", adventureId: TEST_STORY_ID };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => mockParams,
    useBlocker: vi.fn(() => ({
      state: "unblocked",
      proceed: vi.fn(),
      reset: vi.fn(),
    })),
  };
});

describe("AdventureContent - Passage Notes Editing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParams = { id: "1", adventureId: TEST_STORY_ID };
  });

  describe("notes input field", () => {
    it("should display notes textarea with existing notes", async () => {
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
          2: createMockPassage(["Ending"], {
            ending: true,
            type: "victory",
          }),
        },
        items: [],
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const notesInput = await screen.findByTestId("passage-notes-input");
      expect(notesInput).toBeInTheDocument();
      expect(notesInput).toHaveValue(
        "This is a developer note about this passage."
      );
    });

    it("should display empty notes textarea when passage has no notes", async () => {
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
          2: createMockPassage(["Ending"], {
            ending: true,
            type: "victory",
          }),
        },
        items: [],
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const notesInput = await screen.findByTestId("passage-notes-input");
      expect(notesInput).toBeInTheDocument();
      expect(notesInput).toHaveValue("");
    });

    it("should display notes textarea on ending passages", async () => {
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

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const notesInput = await screen.findByTestId("passage-notes-input");
      expect(notesInput).toBeInTheDocument();
      expect(notesInput).toHaveValue("Victory ending - player succeeded.");
    });

    it("should handle empty string notes by showing empty textarea", async () => {
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
          2: createMockPassage(["Ending"], {
            ending: true,
            type: "victory",
          }),
        },
        items: [],
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Empty notes should show empty textarea
      const notesInput = await screen.findByTestId("passage-notes-input");
      expect(notesInput).toBeInTheDocument();
      expect(notesInput).toHaveValue("");
    });

    it("should display multi-line notes correctly in textarea", async () => {
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
          2: createMockPassage(["Ending"], {
            ending: true,
            type: "victory",
          }),
        },
        items: [],
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const notesInput = await screen.findByTestId("passage-notes-input");
      expect(notesInput).toBeInTheDocument();
      expect(notesInput).toHaveValue(`This is a multi-line note.
It has multiple lines.
Each line provides context.`);
    });
  });

  describe("notes textarea positioning", () => {
    it("should render notes textarea in the edit form", async () => {
      const passageWithNotes = createMockPassage(
        ["This is the passage text."],
        {
          choices: [{ text: "Choice 1", goto: 2 }],
        }
      );
      passageWithNotes.notes = "Notes should appear in the form.";

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
          2: createMockPassage(["Ending"], {
            ending: true,
            type: "victory",
          }),
        },
        items: [],
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const textInput = await screen.findByTestId("passage-text-input");
      const notesInput = await screen.findByTestId("passage-notes-input");

      // Both inputs should be in the edit view
      expect(textInput).toBeInTheDocument();
      expect(notesInput).toBeInTheDocument();
    });
  });
});
