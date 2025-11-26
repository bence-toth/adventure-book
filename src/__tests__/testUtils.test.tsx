import { describe, it, expect } from "vitest";
import { renderWithAdventure, waitFor } from "./testUtils";
import { useAdventure } from "@/context/useAdventure";
import { useParams } from "react-router-dom";
import { mockAdventure } from "./mockAdventureData";
import type { Adventure } from "@/data/types";

// Test component that displays adventure context values
const TestComponent = () => {
  const { adventureId, adventure, loading, error, debugModeEnabled } =
    useAdventure();
  const params = useParams();

  return (
    <div data-testid="test-component">
      <div data-testid="context-adventure-id">{adventureId || "null"}</div>
      <div data-testid="params-adventure-id">
        {params.adventureId || "null"}
      </div>
      <div data-testid="adventure-state">
        {adventure ? "has-adventure" : "no-adventure"}
      </div>
      <div data-testid="adventure-title">
        {adventure?.metadata.title || "no-title"}
      </div>
      <div data-testid="loading-state">
        {loading ? "loading" : "not-loading"}
      </div>
      <div data-testid="error-state">{error || "no-error"}</div>
      <div data-testid="debug-state">
        {debugModeEnabled ? "debug-on" : "debug-off"}
      </div>
    </div>
  );
};

// Test component that uses setDebugModeEnabled
const TestComponentWithActions = () => {
  const { debugModeEnabled, setDebugModeEnabled, reloadAdventure } =
    useAdventure();

  return (
    <div data-testid="test-component-actions">
      <div data-testid="debug-state">
        {debugModeEnabled ? "debug-on" : "debug-off"}
      </div>
      <button
        data-testid="toggle-debug"
        onClick={() => setDebugModeEnabled(!debugModeEnabled)}
      >
        Toggle Debug
      </button>
      <button data-testid="reload" onClick={reloadAdventure}>
        Reload
      </button>
    </div>
  );
};

describe("renderWithAdventure", () => {
  describe("Mock Context Behavior", () => {
    it("rejects empty string adventureId", () => {
      expect(() => {
        renderWithAdventure(<TestComponent />, {
          adventureId: "",
          adventure: null,
          loading: false,
        });
      }).toThrow("adventureId cannot be an empty string");
    });

    it("provides mock context to root route with explicit values", () => {
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "test-id",
        adventure: null,
        loading: true,
        error: "Test error",
        debugModeEnabled: true,
        route: "/",
      });

      // Mock context should be available at root route
      expect(getByTestId("context-adventure-id")).toHaveTextContent("test-id");
      expect(getByTestId("adventure-state")).toHaveTextContent("no-adventure");
      expect(getByTestId("loading-state")).toHaveTextContent("loading");
      expect(getByTestId("error-state")).toHaveTextContent("Test error");
      expect(getByTestId("debug-state")).toHaveTextContent("debug-on");
    });

    it("provides mock context to /adventure/:adventureId/* route", () => {
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "test-story",
        adventure: null,
        loading: false,
      });

      // Mock context should be available at adventure route
      expect(getByTestId("context-adventure-id")).toHaveTextContent(
        "test-story"
      );
      expect(getByTestId("adventure-state")).toHaveTextContent("no-adventure");
      expect(getByTestId("loading-state")).toHaveTextContent("not-loading");
    });

    it("uses mock context when any optional parameter is explicitly provided", () => {
      // Providing just `loading: false` should trigger mock context
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "test-id",
        loading: false,
      });

      expect(getByTestId("loading-state")).toHaveTextContent("not-loading");
      expect(getByTestId("context-adventure-id")).toHaveTextContent("test-id");
    });
  });

  describe("Real Provider Behavior", () => {
    it("uses real AdventureProvider when no mock parameters provided", async () => {
      // This uses the real provider which will attempt to load from IndexedDB
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "nonexistent-id",
      });

      // Real provider starts with loading state
      expect(getByTestId("test-component")).toBeInTheDocument();

      // Wait for loading to complete to avoid unhandled promise rejections
      await waitFor(() => {
        expect(getByTestId("loading-state")).toHaveTextContent("not-loading");
      });
    });
  });

  describe("Route Handling", () => {
    it("defaults to /adventure/:adventureId/test when no route provided", () => {
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "test-id",
        adventure: null,
      });

      // Should render successfully with adventure route
      expect(getByTestId("params-adventure-id")).toHaveTextContent("test-id");
    });

    it("uses default adventureId when undefined", () => {
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventure: null,
      });

      // Should use default test adventure ID
      expect(getByTestId("context-adventure-id")).toHaveTextContent(
        "test-adventure-id"
      );
    });

    it("respects custom route parameter", () => {
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "custom-id",
        adventure: null,
        route: "/adventure/custom-id/edit",
      });

      expect(getByTestId("params-adventure-id")).toHaveTextContent("custom-id");
    });
  });

  describe("Adventure Data Handling", () => {
    it("provides mock adventure data when adventure parameter is passed", () => {
      const testAdventure: Adventure = {
        ...mockAdventure,
        metadata: {
          ...mockAdventure.metadata,
          title: "Custom Test Adventure",
        },
      };

      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "test-id",
        adventure: testAdventure,
      });

      expect(getByTestId("adventure-state")).toHaveTextContent("has-adventure");
      expect(getByTestId("adventure-title")).toHaveTextContent(
        "Custom Test Adventure"
      );
    });

    it("handles null adventure correctly", () => {
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "test-id",
        adventure: null,
      });

      expect(getByTestId("adventure-state")).toHaveTextContent("no-adventure");
      expect(getByTestId("adventure-title")).toHaveTextContent("no-title");
    });

    it("provides error state when error parameter is passed", () => {
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "test-id",
        error: "Failed to load adventure",
      });

      expect(getByTestId("error-state")).toHaveTextContent(
        "Failed to load adventure"
      );
    });

    it("provides loading state when loading parameter is true", () => {
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "test-id",
        loading: true,
      });

      expect(getByTestId("loading-state")).toHaveTextContent("loading");
    });
  });

  describe("Debug Mode Handling", () => {
    it("provides debug mode enabled state", () => {
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "test-id",
        debugModeEnabled: true,
      });

      expect(getByTestId("debug-state")).toHaveTextContent("debug-on");
    });

    it("provides debug mode disabled state by default", () => {
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "test-id",
        adventure: null,
      });

      expect(getByTestId("debug-state")).toHaveTextContent("debug-off");
    });

    it("mock setDebugModeEnabled function does not throw errors", () => {
      const { getByTestId } = renderWithAdventure(
        <TestComponentWithActions />,
        {
          adventureId: "test-id",
          debugModeEnabled: false,
        }
      );

      // Clicking toggle should not throw (it's a no-op mock)
      expect(() => {
        getByTestId("toggle-debug").click();
      }).not.toThrow();
    });

    it("mock reloadAdventure function does not throw errors", () => {
      const { getByTestId } = renderWithAdventure(
        <TestComponentWithActions />,
        {
          adventureId: "test-id",
          adventure: null,
        }
      );

      // Clicking reload should not throw (it's a no-op mock)
      expect(() => {
        getByTestId("reload").click();
      }).not.toThrow();
    });
  });

  describe("Parameter Combinations", () => {
    it("handles all parameters together", () => {
      const testAdventure: Adventure = mockAdventure;

      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "combo-test",
        adventure: testAdventure,
        loading: false,
        error: null,
        debugModeEnabled: true,
        route: "/adventure/combo-test/test",
      });

      expect(getByTestId("context-adventure-id")).toHaveTextContent(
        "combo-test"
      );
      expect(getByTestId("adventure-state")).toHaveTextContent("has-adventure");
      expect(getByTestId("loading-state")).toHaveTextContent("not-loading");
      expect(getByTestId("error-state")).toHaveTextContent("no-error");
      expect(getByTestId("debug-state")).toHaveTextContent("debug-on");
    });

    it("prioritizes explicit null values over defaults", () => {
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "test-id",
        adventure: null,
        error: null,
      });

      expect(getByTestId("adventure-state")).toHaveTextContent("no-adventure");
      expect(getByTestId("error-state")).toHaveTextContent("no-error");
    });

    it("handles error state with loading", () => {
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "test-id",
        loading: true,
        error: "Network error",
      });

      expect(getByTestId("loading-state")).toHaveTextContent("loading");
      expect(getByTestId("error-state")).toHaveTextContent("Network error");
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined adventureId gracefully", () => {
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventure: null,
      });

      // Should use default adventureId
      expect(getByTestId("context-adventure-id")).toHaveTextContent(
        "test-adventure-id"
      );
    });

    it("handles very long adventureId", () => {
      const longId = "a".repeat(100);
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: longId,
        adventure: null,
      });

      expect(getByTestId("context-adventure-id")).toHaveTextContent(longId);
    });

    it("handles special characters in adventureId", () => {
      const specialId = "test-id-with-special-chars-123_!@#";
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: specialId,
        adventure: null,
      });

      expect(getByTestId("context-adventure-id")).toHaveTextContent(specialId);
    });

    it("handles empty error string", () => {
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "test-id",
        error: "",
      });

      expect(getByTestId("error-state")).toHaveTextContent("no-error");
    });

    it("handles multiline error messages", () => {
      const multilineError = "Error line 1\nError line 2\nError line 3";
      const { getByTestId } = renderWithAdventure(<TestComponent />, {
        adventureId: "test-id",
        error: multilineError,
      });

      // HTML collapses whitespace, so newlines become spaces
      const errorElement = getByTestId("error-state");
      expect(errorElement.textContent).toContain("Error line 1");
      expect(errorElement.textContent).toContain("Error line 2");
      expect(errorElement.textContent).toContain("Error line 3");
    });
  });
});
