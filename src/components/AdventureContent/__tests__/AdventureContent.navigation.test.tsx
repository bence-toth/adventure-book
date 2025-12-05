import { screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, it, expect, vi } from "vitest";
import { AdventureContent } from "../AdventureContent";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import { getNavigationPassageTestId } from "../AdventureContentSidebar/Navigation/testIds";

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

/**
 * Integration tests for navigation in the content edit view.
 * These tests verify that when users navigate between passages using the sidebar,
 * the form properly updates to show the selected passage's data.
 *
 * This test suite was added after discovering that without the `key` prop on
 * PassageEditView and IntroductionEditView components, navigation would change
 * the URL but not update the form state (see AdventureContent.tsx).
 */
describe("AdventureContent Navigation Integration", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
    mockParams = { id: "1", adventureId: TEST_STORY_ID };
  });

  it("updates form when navigating from one passage to another via sidebar", async () => {
    // Start at passage 1
    mockParams = { id: "1", adventureId: TEST_STORY_ID };

    const { rerender } = renderWithAdventure(<AdventureContent />, {
      adventureId: TEST_STORY_ID,
      adventure: mockAdventure,
    });

    // Wait for passage 1 to load
    const passageTextInput = await screen.findByTestId("passage-text-input");
    const passage1Text = mockAdventure.passages[1].paragraphs.join("\n\n");
    expect(passageTextInput).toHaveValue(passage1Text);

    // Find and click passage 2 in the sidebar
    const passage2Link = screen.getByTestId(getNavigationPassageTestId(2));
    fireEvent.click(passage2Link);

    // Simulate the route change by updating mockParams and rerendering
    mockParams = { id: "2", adventureId: TEST_STORY_ID };
    rerender(<AdventureContent />);

    // Wait for the form to update with passage 2's content
    await waitFor(() => {
      const updatedTextInput = screen.getByTestId("passage-text-input");
      const passage2Text = mockAdventure.passages[2].paragraphs.join("\n\n");
      expect(updatedTextInput).toHaveValue(passage2Text);
    });
  });

  it("updates form when navigating between multiple passages sequentially", async () => {
    // Start at passage 1
    mockParams = { id: "1", adventureId: TEST_STORY_ID };

    const { rerender } = renderWithAdventure(<AdventureContent />, {
      adventureId: TEST_STORY_ID,
      adventure: mockAdventure,
    });

    // Verify passage 1
    let passageTextInput = await screen.findByTestId("passage-text-input");
    expect(passageTextInput).toHaveValue(
      mockAdventure.passages[1].paragraphs.join("\n\n")
    );

    // Navigate to passage 2
    fireEvent.click(screen.getByTestId(getNavigationPassageTestId(2)));
    mockParams = { id: "2", adventureId: TEST_STORY_ID };
    rerender(<AdventureContent />);

    await waitFor(() => {
      passageTextInput = screen.getByTestId("passage-text-input");
      expect(passageTextInput).toHaveValue(
        mockAdventure.passages[2].paragraphs.join("\n\n")
      );
    });

    // Navigate to passage 3
    fireEvent.click(screen.getByTestId(getNavigationPassageTestId(3)));
    mockParams = { id: "3", adventureId: TEST_STORY_ID };
    rerender(<AdventureContent />);

    await waitFor(() => {
      passageTextInput = screen.getByTestId("passage-text-input");
      expect(passageTextInput).toHaveValue(
        mockAdventure.passages[3].paragraphs.join("\n\n")
      );
    });

    // Navigate back to passage 1
    fireEvent.click(screen.getByTestId(getNavigationPassageTestId(1)));
    mockParams = { id: "1", adventureId: TEST_STORY_ID };
    rerender(<AdventureContent />);

    await waitFor(() => {
      passageTextInput = screen.getByTestId("passage-text-input");
      expect(passageTextInput).toHaveValue(
        mockAdventure.passages[1].paragraphs.join("\n\n")
      );
    });
  });

  it("resets passage type when navigating between regular and ending passages", async () => {
    // Start at passage 1 (regular passage)
    mockParams = { id: "1", adventureId: TEST_STORY_ID };

    const { rerender } = renderWithAdventure(<AdventureContent />, {
      adventureId: TEST_STORY_ID,
      adventure: mockAdventure,
    });

    // Wait for passage 1 to load
    await screen.findByTestId("passage-text-input");
    let passageTypeSelect = await screen.findByTestId("passage-type-select");
    expect(passageTypeSelect).toHaveValue("regular");

    // Navigate to passage 4 (ending passage)
    fireEvent.click(screen.getByTestId(getNavigationPassageTestId(4)));
    mockParams = { id: "4", adventureId: TEST_STORY_ID };
    rerender(<AdventureContent />);

    // Wait for passage 4 to load and verify it's an ending
    await waitFor(() => {
      passageTypeSelect = screen.getByTestId("passage-type-select");
      expect(passageTypeSelect).toHaveValue("ending");
    });

    // Navigate back to passage 1
    fireEvent.click(screen.getByTestId(getNavigationPassageTestId(1)));
    mockParams = { id: "1", adventureId: TEST_STORY_ID };
    rerender(<AdventureContent />);

    // Wait for passage 1 to load again and verify it's regular
    await waitFor(() => {
      passageTypeSelect = screen.getByTestId("passage-type-select");
      expect(passageTypeSelect).toHaveValue("regular");
    });
  });
});
