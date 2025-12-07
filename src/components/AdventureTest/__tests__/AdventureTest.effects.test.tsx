import { screen } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { AdventureTest } from "../AdventureTest";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
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

describe("AdventureTest Component - Effects Integration", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
    mockParams = { id: "1", adventureId: TEST_STORY_ID };
  });

  describe("Integration with useAdventureTestState Hook", () => {
    it("renders passage correctly when adventure has no effects", async () => {
      // Integration test: verify the component renders normally with passages that have no effects
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      await screen.findByTestId(PASSAGE_TEST_IDS.CONTAINER);

      // Component should render without errors
      expect(
        screen.getByTestId(PASSAGE_TEST_IDS.CONTAINER)
      ).toBeInTheDocument();
    });

    it("renders ending passage correctly without processing effects", async () => {
      // Integration test: verify ending passages render correctly
      // Passage 4 in mockAdventure is an ending
      mockParams = { id: "4", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      // Wait for the ending passage to render
      await screen.findByTestId(PASSAGE_TEST_IDS.RESTART_BUTTON);

      // Verify passage renders correctly
      expect(
        screen.getByTestId(PASSAGE_TEST_IDS.CONTAINER)
      ).toBeInTheDocument();
    });

    it("handles invalid passageId gracefully", async () => {
      // Integration test: verify error handling when passageId is invalid
      mockParams = { id: "not-a-number", adventureId: TEST_STORY_ID };

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderWithAdventure(
        <ErrorBoundary>
          <AdventureTest />
        </ErrorBoundary>,
        {
          adventureId: TEST_STORY_ID,
          adventure: mockAdventure,
        }
      );

      // Should show error instead of crashing
      const errorMessages = await screen.findAllByText(/is not valid/);
      expect(errorMessages.length).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });
  });
});
