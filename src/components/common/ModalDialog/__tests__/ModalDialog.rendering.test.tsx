import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ModalDialog } from "../ModalDialog";
import { DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS } from "../testIds";

describe("ModalDialog Component", () => {
  let originalOverflow: string;

  beforeEach(() => {
    originalOverflow = document.body.style.overflow;
  });

  afterEach(() => {
    document.body.style.overflow = originalOverflow;
  });

  describe("Visibility", () => {
    it("renders when open is true", () => {
      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={vi.fn()}
          title="Test Title"
          message="Test message"
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test message")).toBeInTheDocument();
    });

    it("does not render when open is false", () => {
      render(
        <ModalDialog
          isOpen={false}
          onOpenChange={vi.fn()}
          title="Test Title"
          message="Test message"
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
      expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    });
  });

  describe("Content", () => {
    it("displays the title", () => {
      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={vi.fn()}
          title="Delete Item"
          message="Are you sure?"
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      expect(screen.getByText("Delete Item")).toBeInTheDocument();
    });

    it("displays string message", () => {
      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={vi.fn()}
          title="Confirm"
          message="This is a test message"
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      expect(screen.getByText("This is a test message")).toBeInTheDocument();
    });

    it("displays ReactNode message", () => {
      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={vi.fn()}
          title="Confirm"
          message={
            <div>
              <p>Line 1</p>
              <p>Line 2</p>
            </div>
          }
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      expect(screen.getByText("Line 1")).toBeInTheDocument();
      expect(screen.getByText("Line 2")).toBeInTheDocument();
    });

    it("displays multiple paragraphs from array of strings", () => {
      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={vi.fn()}
          title="Confirm"
          message={[
            "This is the first paragraph.",
            "This is the second paragraph.",
            "This is the third paragraph.",
          ]}
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      expect(
        screen.getByText("This is the first paragraph.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("This is the second paragraph.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("This is the third paragraph.")
      ).toBeInTheDocument();
    });

    it("renders paragraphs as separate p elements when array is provided", () => {
      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={vi.fn()}
          title="Confirm"
          message={["First paragraph", "Second paragraph"]}
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      const messageContainer = screen.getByTestId(
        DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS.MESSAGE
      );
      const paragraphs = messageContainer.querySelectorAll("p");

      expect(paragraphs).toHaveLength(2);
      expect(paragraphs[0].textContent).toBe("First paragraph");
      expect(paragraphs[1].textContent).toBe("Second paragraph");
    });

    it("displays custom button labels", () => {
      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={vi.fn()}
          title="Confirm"
          message="Proceed?"
          actions={[
            { label: "No, go back", onClick: vi.fn() },
            { label: "Yes, proceed", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      expect(screen.getByText("Yes, proceed")).toBeInTheDocument();
      expect(screen.getByText("No, go back")).toBeInTheDocument();
    });

    it("displays provided button labels", () => {
      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={vi.fn()}
          title="Confirm"
          message="Proceed?"
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      expect(
        screen.getByRole("button", { name: "Confirm" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    });
  });
});
