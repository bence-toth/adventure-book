import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TopBar } from "../TopBar";

describe("TopBar Component", () => {
  it("renders as a header element", () => {
    render(<TopBar />);
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("renders start content in the start slot", () => {
    render(<TopBar start={<div>Start Content</div>} />);
    expect(screen.getByText("Start Content")).toBeInTheDocument();
  });

  it("renders end content in the end slot", () => {
    render(<TopBar end={<div>End Content</div>} />);
    expect(screen.getByText("End Content")).toBeInTheDocument();
  });

  it("renders both start and end slots simultaneously", () => {
    render(<TopBar start={<div>Start</div>} end={<div>End</div>} />);

    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("End")).toBeInTheDocument();
  });

  it("does not render slots when not provided", () => {
    const { container } = render(<TopBar />);
    // Should only have the header container, no slot divs
    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
    expect(header?.children.length).toBe(0);
  });
});
