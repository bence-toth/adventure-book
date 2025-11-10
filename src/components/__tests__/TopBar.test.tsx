import { screen, render as rtlRender } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TopBar } from "../TopBar";
import { MemoryRouter } from "react-router-dom";
import { ROUTES, getPassageRoute } from "../../constants/routes";

// Helper function to render TopBar with a specific route
const renderWithRouter = (initialRoute = "/") => {
  return rtlRender(
    <MemoryRouter initialEntries={[initialRoute]}>
      <TopBar />
    </MemoryRouter>
  );
};

describe("TopBar Component", () => {
  describe("Rendering", () => {
    it("renders the header element with correct class", () => {
      renderWithRouter();

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass("top-bar");
    });

    it("renders the application title", () => {
      renderWithRouter();

      const title = screen.getByRole("heading", { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("Adventure Book Companion");
      expect(title).toHaveClass("top-bar-title");
    });

    it("renders the logo icon with correct accessibility attributes", () => {
      renderWithRouter();

      const logoContainer = screen.getByTestId("top-bar-logo");
      const logoIcon = logoContainer.querySelector(".top-bar-logo-icon");
      expect(logoIcon).toBeInTheDocument();
    });

    it("renders the navigation element", () => {
      renderWithRouter();

      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass("top-bar-nav");
    });

    it("renders Test navigation link", () => {
      renderWithRouter();

      const testLink = screen.getByRole("link", { name: /test/i });
      expect(testLink).toBeInTheDocument();
      expect(testLink).toHaveAttribute("href", ROUTES.TEST);
      expect(testLink).toHaveClass("button", "button-primary", "button-small");
    });

    it("renders Edit navigation link", () => {
      renderWithRouter();

      const editLink = screen.getByRole("link", { name: /edit/i });
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute("href", ROUTES.EDIT);
      expect(editLink).toHaveClass("button", "button-primary", "button-small");
    });
  });

  describe("Active state - exact path match", () => {
    it("applies active class to Test link when on /test route", () => {
      renderWithRouter(ROUTES.TEST);

      const testLink = screen.getByRole("link", { name: /test/i });
      expect(testLink).toHaveClass("button-selected");

      const editLink = screen.getByRole("link", { name: /edit/i });
      expect(editLink).not.toHaveClass("button-selected");
    });

    it("applies active class to Edit link when on /edit route", () => {
      renderWithRouter(ROUTES.EDIT);

      const editLink = screen.getByRole("link", { name: /edit/i });
      expect(editLink).toHaveClass("button-selected");

      const testLink = screen.getByRole("link", { name: /test/i });
      expect(testLink).not.toHaveClass("button-selected");
    });
  });

  describe("Active state - nested paths", () => {
    it("applies active class to Test link when on /test/passage/1 route", () => {
      renderWithRouter(getPassageRoute(1));

      const testLink = screen.getByRole("link", { name: /test/i });
      expect(testLink).toHaveClass("button-selected");

      const editLink = screen.getByRole("link", { name: /edit/i });
      expect(editLink).not.toHaveClass("button-selected");
    });

    it("applies active class to Test link when on /test/intro route", () => {
      renderWithRouter(`${ROUTES.TEST}/intro`);

      const testLink = screen.getByRole("link", { name: /test/i });
      expect(testLink).toHaveClass("button-selected");
    });

    it("applies active class to Edit link when on nested /edit paths", () => {
      renderWithRouter(`${ROUTES.EDIT}/something`);

      const editLink = screen.getByRole("link", { name: /edit/i });
      expect(editLink).toHaveClass("button-selected");

      const testLink = screen.getByRole("link", { name: /test/i });
      expect(testLink).not.toHaveClass("button-selected");
    });
  });

  describe("Active state - no match", () => {
    it("does not apply active class to any link when on root route", () => {
      renderWithRouter("/");

      const testLink = screen.getByRole("link", { name: /test/i });
      const editLink = screen.getByRole("link", { name: /edit/i });

      expect(testLink).not.toHaveClass("button-selected");
      expect(editLink).not.toHaveClass("button-selected");
    });

    it("does not apply active class to any link when on unrelated route", () => {
      renderWithRouter("/some-other-route");

      const testLink = screen.getByRole("link", { name: /test/i });
      const editLink = screen.getByRole("link", { name: /edit/i });

      expect(testLink).not.toHaveClass("button-selected");
      expect(editLink).not.toHaveClass("button-selected");
    });
  });

  describe("Accessibility", () => {
    it("has semantic header element", () => {
      renderWithRouter();

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("has semantic navigation element", () => {
      renderWithRouter();

      const nav = screen.getByRole("navigation", { name: "Main navigation" });
      expect(nav).toBeInTheDocument();
    });

    it("navigation links are accessible", () => {
      renderWithRouter();

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);

      links.forEach((link) => {
        expect(link).toHaveAttribute("href");
      });
    });

    it("icons have appropriate aria-hidden attributes", () => {
      const { container } = renderWithRouter();

      const hiddenIcons = container.querySelectorAll('[aria-hidden="true"]');
      // Should have 3 icons: logo icon and 2 navigation icons (Play and PenTool)
      expect(hiddenIcons.length).toBeGreaterThanOrEqual(2);
    });
  });
});
