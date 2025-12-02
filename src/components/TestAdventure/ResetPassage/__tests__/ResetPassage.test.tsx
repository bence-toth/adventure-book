import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ResetPassage } from "../ResetPassage";
import { PASSAGE_TEST_IDS } from "@/constants/testIds";

describe("ResetPassage Component", () => {
  it("renders reset message", () => {
    render(<ResetPassage />);

    const container = screen.getByTestId(PASSAGE_TEST_IDS.RESET_PASSAGE);
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent("Resetting your adventure…");
  });

  it("renders container with correct test ID", () => {
    render(<ResetPassage />);

    const container = screen.getByTestId(PASSAGE_TEST_IDS.RESET_PASSAGE);
    expect(container).toBeInTheDocument();
  });
});
