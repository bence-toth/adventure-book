import { screen, fireEvent } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { AdventureTest } from "../AdventureTest";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import { getAdventureTestRoute } from "@/constants/routes";
import { PASSAGE_TEST_IDS } from "../testIds";

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

describe("AdventureTest Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
    mockParams = { id: "1", adventureId: TEST_STORY_ID };
  });

  describe("Ending Passages", () => {
    it("navigates to introduction when restart is clicked", async () => {
      mockParams = { id: "4", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const restartButton = await screen.findByTestId(
        PASSAGE_TEST_IDS.RESTART_BUTTON
      );
      fireEvent.click(restartButton);

      // Component navigates to introduction, which will reset state on remount
      expect(mockNavigate).toHaveBeenCalledWith(
        getAdventureTestRoute(TEST_STORY_ID)
      );
    });
  });
});
