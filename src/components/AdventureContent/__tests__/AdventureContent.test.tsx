import { screen } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { AdventureContent } from "../AdventureContent";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";

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
    useBlocker: vi.fn(() => ({
      state: "unblocked",
      proceed: vi.fn(),
      reset: vi.fn(),
    })),
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

describe("AdventureContent Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
    mockParams = { id: "1", adventureId: TEST_STORY_ID };
  });

  describe("Introduction Mode", () => {
    it("renders introduction edit view when no passage id is provided", async () => {
      mockParams = {
        id: undefined as unknown as string,
        adventureId: TEST_STORY_ID,
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Should render introduction edit view with textarea
      const introTextInput = await screen.findByTestId(
        "introduction-text-input"
      );
      expect(introTextInput).toBeInTheDocument();

      // Should have save button
      const saveButton = await screen.findByRole("button", { name: /save/i });
      expect(saveButton).toBeInTheDocument();
    });

    it("renders introduction text in textarea", async () => {
      mockParams = {
        id: undefined as unknown as string,
        adventureId: TEST_STORY_ID,
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const introTextInput = await screen.findByTestId(
        "introduction-text-input"
      );

      // Check that introduction text is present
      expect(introTextInput).toHaveValue(
        mockAdventure.intro.paragraphs.join("\n\n")
      );
    });
  });

  it("renders passage edit view for valid passage", async () => {
    renderWithAdventure(<AdventureContent />, {
      adventureId: TEST_STORY_ID,
      adventure: mockAdventure,
    });

    // Should render passage edit view with text input
    const passageTextInput = await screen.findByTestId("passage-text-input");
    expect(passageTextInput).toBeInTheDocument();

    // Should have save button
    const saveButton = await screen.findByRole("button", { name: /save/i });
    expect(saveButton).toBeInTheDocument();
  });

  describe("Error Handling", () => {
    it("renders introduction edit view when id param is undefined", async () => {
      mockParams = {
        id: undefined as unknown as string,
        adventureId: TEST_STORY_ID,
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Should render introduction edit view instead of throwing an error
      const introTextInput = await screen.findByTestId(
        "introduction-text-input"
      );
      expect(introTextInput).toBeInTheDocument();

      const saveButton = await screen.findByRole("button", { name: /save/i });
      expect(saveButton).toBeInTheDocument();
    });

    it("throws AdventureLoadError when there is a load error", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderWithAdventure(
        <ErrorBoundary>
          <AdventureContent />
        </ErrorBoundary>,
        {
          adventureId: TEST_STORY_ID,
          error: "Failed to load adventure",
        }
      );

      expect(
        (await screen.findAllByText("Failed to load adventure")).length
      ).toBeGreaterThan(0);
      expect(screen.getByText("A system error occurred")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("throws AdventureNotFoundError when adventure is not found", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderWithAdventure(
        <ErrorBoundary>
          <AdventureContent />
        </ErrorBoundary>,
        {
          adventureId: TEST_STORY_ID,
          adventure: null,
        }
      );

      expect(
        (await screen.findAllByText("Adventure not found.")).length
      ).toBeGreaterThan(0);
      expect(screen.getByText("A system error occurred")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("throws InvalidPassageIdError for non-numeric passage IDs", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockParams = { id: "invalid", adventureId: TEST_STORY_ID };

      renderWithAdventure(
        <ErrorBoundary>
          <AdventureContent />
        </ErrorBoundary>,
        {
          adventureId: TEST_STORY_ID,
          adventure: mockAdventure,
        }
      );

      const errorMessages = await screen.findAllByText(/is not valid/);
      expect(errorMessages.length).toBeGreaterThan(0);
      expect(screen.getByText("A system error occurred")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("throws InvalidPassageIdError for negative passage IDs", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockParams = { id: "-5", adventureId: TEST_STORY_ID };

      renderWithAdventure(
        <ErrorBoundary>
          <AdventureContent />
        </ErrorBoundary>,
        {
          adventureId: TEST_STORY_ID,
          adventure: mockAdventure,
        }
      );

      const errorMessages = await screen.findAllByText(/is not valid/);
      expect(errorMessages.length).toBeGreaterThan(0);
      expect(screen.getByText("A system error occurred")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("throws PassageNotFoundError when passage does not exist", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockParams = { id: "999", adventureId: TEST_STORY_ID };

      renderWithAdventure(
        <ErrorBoundary>
          <AdventureContent />
        </ErrorBoundary>,
        {
          adventureId: TEST_STORY_ID,
          adventure: mockAdventure,
        }
      );

      const errorMessages = await screen.findAllByText(/does not exist/);
      expect(errorMessages.length).toBeGreaterThan(0);
      expect(screen.getByText("A system error occurred")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe("Edit Mode Rendering", () => {
    it("renders passage edit view with form controls", async () => {
      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Should render passage edit view with text input
      const passageTextInput = await screen.findByTestId("passage-text-input");
      expect(passageTextInput).toBeInTheDocument();

      // Should have passage type select
      const passageTypeSelect = await screen.findByTestId(
        "passage-type-select"
      );
      expect(passageTypeSelect).toBeInTheDocument();

      // Should have save button
      const saveButton = await screen.findByRole("button", { name: /save/i });
      expect(saveButton).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("renders loading state when adventure is loading", async () => {
      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        isLoading: true,
      });

      // Should render the loading state component
      const loadingElement = await screen.findByTestId("loading-state");
      expect(loadingElement).toBeInTheDocument();
    });

    it("renders loading state for introduction when no passage ID is provided", async () => {
      mockParams = {
        id: undefined as unknown as string,
        adventureId: TEST_STORY_ID,
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        isLoading: true,
      });

      const loadingElement = await screen.findByTestId("loading-state");
      expect(loadingElement).toBeInTheDocument();
    });
  });

  describe("Sidebar Navigation", () => {
    it("renders content sidebar with passage edit view", async () => {
      mockParams = { id: "4", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Wait for passage edit view to load
      const passageTextInput = await screen.findByTestId("passage-text-input");
      expect(passageTextInput).toBeInTheDocument();

      // Sidebar should be present with navigation
      const sidebar = screen.getByRole("complementary");
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe("Loading State with isIntroduction", () => {
    it("renders loading state for passage view", async () => {
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        isLoading: true,
      });

      const loadingElement = await screen.findByTestId("loading-state");
      expect(loadingElement).toBeInTheDocument();
      expect(loadingElement).toHaveTextContent("Loading passage...");
    });
  });
});
