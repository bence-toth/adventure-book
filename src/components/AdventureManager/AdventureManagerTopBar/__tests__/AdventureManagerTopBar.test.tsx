import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AdventureManagerTopBar } from "../AdventureManagerTopBar";
import { TOP_BAR_TEST_IDS } from "@/constants/testIds";
import { render } from "@/__tests__/testUtils";

describe("AdventureManagerTopBar Component", () => {
  describe("Rendering", () => {
    it("renders the header element", () => {
      render(<AdventureManagerTopBar />);
      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("renders logo and app title", () => {
      render(<AdventureManagerTopBar />);

      // Should have logo
      const logo = screen.getByTestId(TOP_BAR_TEST_IDS.LOGO);
      expect(logo).toBeInTheDocument();

      // Should have the app title
      const title = screen.getByText("Adventure Book Companion");
      expect(title).toBeInTheDocument();
    });
  });
});
