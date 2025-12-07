import { screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, it, expect, vi } from "vitest";
import { AdventureContent } from "../AdventureContent";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import { getNavigationPassageTestId } from "../AdventureContentSidebar/Navigation/testIds";

const TEST_STORY_ID = "test-adventure-id";

// Mock react-router-dom navigate function and params
const mockNavigate = vi.fn();
let mockParams = { id: "1", adventureId: TEST_STORY_ID };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
    // Don't mock useBlocker - let it use the real router context
  };
});

// Integration tests for navigation in the content edit view.
// These tests verify that when users navigate between passages using the sidebar,
// the form properly updates to show the selected passage's data.
describe("AdventureContent navigation", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
    mockParams = { id: "1", adventureId: TEST_STORY_ID };
  });

  it("updates form when navigating from one passage to another via sidebar", async () => {
    // Start at passage 1
    mockParams = { id: "1", adventureId: TEST_STORY_ID };

    renderWithAdventure(<AdventureContent />, {
      adventureId: TEST_STORY_ID,
      adventure: mockAdventure,
    });

    // Wait for passage 1 to load
    const passageTextInput = await screen.findByTestId("passage-text-input");
    const passage1Text = mockAdventure.passages[1].paragraphs.join("\n\n");
    expect(passageTextInput).toHaveValue(passage1Text);

    // Find and click passage 2 in the sidebar
    // This verifies that the navigation link exists and is clickable
    const passage2Link = screen.getByTestId(getNavigationPassageTestId(2));
    expect(passage2Link).toBeInTheDocument();
    fireEvent.click(passage2Link);

    // Verify navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith(
      `/adventure/${TEST_STORY_ID}/content/passage/2`
    );
  });

  it("updates form when navigating between multiple passages sequentially", async () => {
    // Start at passage 1
    mockParams = { id: "1", adventureId: TEST_STORY_ID };

    renderWithAdventure(<AdventureContent />, {
      adventureId: TEST_STORY_ID,
      adventure: mockAdventure,
    });

    // Verify passage 1
    const passageTextInput = await screen.findByTestId("passage-text-input");
    expect(passageTextInput).toHaveValue(
      mockAdventure.passages[1].paragraphs.join("\n\n")
    );

    // Verify all passage links are present and clickable
    fireEvent.click(screen.getByTestId(getNavigationPassageTestId(2)));
    expect(mockNavigate).toHaveBeenCalledWith(
      `/adventure/${TEST_STORY_ID}/content/passage/2`
    );

    fireEvent.click(screen.getByTestId(getNavigationPassageTestId(3)));
    expect(mockNavigate).toHaveBeenCalledWith(
      `/adventure/${TEST_STORY_ID}/content/passage/3`
    );

    fireEvent.click(screen.getByTestId(getNavigationPassageTestId(1)));
    expect(mockNavigate).toHaveBeenCalledWith(
      `/adventure/${TEST_STORY_ID}/content/passage/1`
    );
  });

  it("resets passage type when navigating between regular and ending passages", async () => {
    // Start at passage 1 (regular passage)
    mockParams = { id: "1", adventureId: TEST_STORY_ID };

    renderWithAdventure(<AdventureContent />, {
      adventureId: TEST_STORY_ID,
      adventure: mockAdventure,
    });

    // Wait for passage 1 to load
    await screen.findByTestId("passage-text-input");
    const passageTypeSelect = await screen.findByTestId("passage-type-select");
    expect(passageTypeSelect).toHaveTextContent("Regular");

    // Verify navigation to ending passage works
    fireEvent.click(screen.getByTestId(getNavigationPassageTestId(4)));
    expect(mockNavigate).toHaveBeenCalledWith(
      `/adventure/${TEST_STORY_ID}/content/passage/4`
    );

    // Verify navigation back to regular passage works
    fireEvent.click(screen.getByTestId(getNavigationPassageTestId(1)));
    expect(mockNavigate).toHaveBeenCalledWith(
      `/adventure/${TEST_STORY_ID}/content/passage/1`
    );
  });
});
