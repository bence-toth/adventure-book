import { screen, fireEvent } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { AdventureTest } from "../AdventureTest";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import {
  getAdventureTestPassageRoute,
  getAdventureTestRoute,
} from "@/constants/routes";
import { PASSAGE_TEST_IDS, getChoiceButtonTestId } from "../testIds";
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

describe("AdventureTest Component - State Integration", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
    mockParams = { id: "1", adventureId: TEST_STORY_ID };
  });

  describe("Debug Mode Choice Display", () => {
    it("maintains correct navigation when debug mode is enabled", async () => {
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      const firstChoice = await screen.findByTestId(getChoiceButtonTestId(0));
      expect(firstChoice).toHaveTextContent("2: Go to mock passage 2");
      expect(firstChoice).toHaveAttribute("data-goto", "2");

      fireEvent.click(firstChoice);

      expect(mockNavigate).toHaveBeenCalledWith(
        getAdventureTestPassageRoute(TEST_STORY_ID, 2)
      );
    });
  });

  describe("Integration with useAdventureTestState Hook", () => {
    it("resets inventory when navigating from passage back to introduction", async () => {
      // This test verifies that the component correctly integrates with the hook
      // to handle navigation from ending passage to introduction
      const adventureWithEnding: Adventure = {
        ...mockAdventure,
        passages: {
          ...mockAdventure.passages,
          10: {
            paragraphs: ["The adventure concludes!", "The end!"],
            ending: true,
          },
        },
      };

      mockParams = { id: "10", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: adventureWithEnding,
        isDebugModeEnabled: true,
      });

      // Wait for ending passage to render
      await screen.findByText("The adventure concludes!");

      // Click the restart button to navigate to introduction
      const restartButton = screen.getByTestId(PASSAGE_TEST_IDS.RESTART_BUTTON);
      fireEvent.click(restartButton);

      // Verify navigate was called to go to introduction (where inventory resets)
      expect(mockNavigate).toHaveBeenCalledWith(
        getAdventureTestRoute(TEST_STORY_ID)
      );
    });
  });
});
