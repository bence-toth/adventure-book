import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LoadingState } from "../LoadingState";
import { INTRODUCTION_TEST_IDS, PASSAGE_TEST_IDS } from "../../testIds";

describe("LoadingState Component", () => {
  it("renders loading message for introduction", () => {
    render(<LoadingState isIntroduction={true} />);

    const container = screen.getByTestId(INTRODUCTION_TEST_IDS.CONTAINER);
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent("Loading adventure...");
  });

  it("renders loading message for passage", () => {
    render(<LoadingState isIntroduction={false} />);

    const container = screen.getByTestId(PASSAGE_TEST_IDS.CONTAINER);
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent("Loading passage...");
  });
});
