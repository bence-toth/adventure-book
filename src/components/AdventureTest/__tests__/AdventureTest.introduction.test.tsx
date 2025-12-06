import { screen, fireEvent } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { AdventureTest } from "../AdventureTest";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import { getAdventureTestPassageRoute } from "@/constants/routes";
import { INTRODUCTION_TEST_IDS, getChoiceButtonTestId } from "../testIds";

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

  describe("Introduction Mode", () => {
    it("renders introduction when no passage id is provided", async () => {
      mockParams = {
        id: undefined as unknown as string,
        adventureId: TEST_STORY_ID,
      };

      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const introContainer = await screen.findByTestId(
        INTRODUCTION_TEST_IDS.CONTAINER
      );
      expect(introContainer).toBeInTheDocument();

      const introTitle = await screen.findByTestId(INTRODUCTION_TEST_IDS.TITLE);
      expect(introTitle).toBeInTheDocument();
      expect(introTitle).toHaveTextContent(mockAdventure.metadata.title);

      const introText = await screen.findByTestId(INTRODUCTION_TEST_IDS.TEXT);
      expect(introText).toBeInTheDocument();
    });

    it("navigates to passage 1 when start button is clicked in introduction mode", async () => {
      mockParams = {
        id: undefined as unknown as string,
        adventureId: TEST_STORY_ID,
      };

      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const button = await screen.findByTestId(
        INTRODUCTION_TEST_IDS.START_BUTTON
      );
      fireEvent.click(button);

      expect(mockNavigate).toHaveBeenCalledWith(
        getAdventureTestPassageRoute(TEST_STORY_ID, 1)
      );
    });

    it("starts with empty inventory when introduction is displayed", async () => {
      mockParams = {
        id: undefined as unknown as string,
        adventureId: TEST_STORY_ID,
      };

      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      // Verify introduction renders (inventory is in sidebar, managed by component state)
      const introContainer = await screen.findByTestId(
        INTRODUCTION_TEST_IDS.CONTAINER
      );
      expect(introContainer).toBeInTheDocument();

      // In debug mode, verify no items are checked in the inventory
      const item1Toggle = screen.queryByRole("switch", {
        name: /Mock Item One/,
      });
      const item2Toggle = screen.queryByRole("switch", {
        name: /Mock Item Two/,
      });

      if (item1Toggle) {
        expect(item1Toggle).not.toBeChecked();
      }
      if (item2Toggle) {
        expect(item2Toggle).not.toBeChecked();
      }
    });

    it("navigates to correct passage when choice is clicked", async () => {
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const firstChoice = await screen.findByTestId(getChoiceButtonTestId(0));
      expect(firstChoice).toHaveAttribute("data-goto", "2");

      fireEvent.click(firstChoice);

      expect(mockNavigate).toHaveBeenCalledWith(
        getAdventureTestPassageRoute(TEST_STORY_ID, 2)
      );
    });
  });
});
