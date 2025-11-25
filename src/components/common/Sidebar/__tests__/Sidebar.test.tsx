import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Sidebar } from "../Sidebar";

describe("Sidebar Component", () => {
  it("renders as an aside element", () => {
    render(<Sidebar>Content</Sidebar>);
    const aside = screen.getByRole("complementary");
    expect(aside).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <Sidebar>
        <div>Sidebar Content</div>
      </Sidebar>
    );
    expect(screen.getByText("Sidebar Content")).toBeInTheDocument();
  });

  it("renders complex children content", () => {
    render(
      <Sidebar>
        <h2>Complex Sidebar</h2>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </Sidebar>
    );

    expect(screen.getByText("Complex Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it("renders heading when included in children", () => {
    render(
      <Sidebar>
        <h2>Test Title</h2>
        <p>Content</p>
      </Sidebar>
    );
    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toHaveTextContent("Test Title");
  });
});
