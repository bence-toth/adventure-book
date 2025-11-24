import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { useAdventure } from "../useAdventure";

describe("useAdventure hook", () => {
  it("throws error when used outside of AdventureProvider", () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Component that uses the hook outside of provider
    const TestComponent = () => {
      useAdventure();
      return <div>Should not render</div>;
    };

    // Test that it throws the expected error
    expect(() => {
      render(<TestComponent />);
    }).toThrow("useAdventure must be used within a AdventureProvider");

    consoleSpy.mockRestore();
  });
});
