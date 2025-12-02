import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@/__tests__/testUtils";
import { AdventureLayout } from "../AdventureLayout";

// Mock the AdventureTopBar component
vi.mock("@/components/AdventureTopBar/AdventureTopBar", () => ({
  AdventureTopBar: () => <div data-testid="adventure-top-bar">Top Bar</div>,
}));

describe("AdventureLayout Component", () => {
  it("renders the top bar", () => {
    render(
      <AdventureLayout sidebar={<div>Sidebar</div>}>
        <div>Content</div>
      </AdventureLayout>
    );

    expect(screen.getByTestId("adventure-top-bar")).toBeInTheDocument();
  });

  it("renders the provided sidebar", () => {
    render(
      <AdventureLayout sidebar={<div data-testid="test-sidebar">Sidebar</div>}>
        <div>Content</div>
      </AdventureLayout>
    );

    expect(screen.getByTestId("test-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("test-sidebar")).toHaveTextContent("Sidebar");
  });

  it("renders the provided children content", () => {
    render(
      <AdventureLayout sidebar={<div>Sidebar</div>}>
        <div data-testid="test-content">Main Content</div>
      </AdventureLayout>
    );

    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByTestId("test-content")).toHaveTextContent(
      "Main Content"
    );
  });

  it("renders both sidebar and content together", () => {
    render(
      <AdventureLayout sidebar={<div data-testid="test-sidebar">Sidebar</div>}>
        <div data-testid="test-content">Content</div>
      </AdventureLayout>
    );

    expect(screen.getByTestId("test-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("test-content")).toBeInTheDocument();
  });
});
