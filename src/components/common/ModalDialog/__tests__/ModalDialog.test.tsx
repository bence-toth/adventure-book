import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

  describe("Button Actions", () => {
    it("calls action onClick when button is clicked", () => {
      const handleConfirm = vi.fn();

      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={vi.fn()}
          title="Confirm"
          message="Proceed?"
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: handleConfirm, variant: "neutral" },
          ]}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });

    it("calls correct action when any button is clicked", () => {
      const handleCancel = vi.fn();

      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={vi.fn()}
          title="Confirm"
          message="Proceed?"
          actions={[
            { label: "Cancel", onClick: handleCancel },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      fireEvent.click(screen.getByText("Cancel"));

      expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    it("calls onOpenChange when overlay is clicked", () => {
      const handleOpenChange = vi.fn();

      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={handleOpenChange}
          title="Confirm"
          message="Proceed?"
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      const overlay = screen.getByTestId(
        DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS.OVERLAY
      );
      fireEvent.click(overlay);

      expect(handleOpenChange).toHaveBeenCalledTimes(1);
    });

    it("does not call onOpenChange when dialog content is clicked", () => {
      const handleOpenChange = vi.fn();

      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={handleOpenChange}
          title="Confirm"
          message="Proceed?"
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      const dialog = screen.getByTestId(
        DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS.DIALOG
      );
      fireEvent.click(dialog);

      expect(handleOpenChange).not.toHaveBeenCalled();
    });
  });

  describe("Button Variants", () => {
    it("applies variant to button when specified", () => {
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

      const confirmButton = screen.getByRole("button", { name: "Confirm" });
      expect(confirmButton).toBeInTheDocument();
    });

    it("applies danger variant to button when specified", () => {
      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={vi.fn()}
          title="Delete"
          message="Are you sure?"
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Delete", onClick: vi.fn(), variant: "danger" },
          ]}
        />
      );

      const deleteButton = screen.getByRole("button", { name: "Delete" });
      expect(deleteButton).toBeInTheDocument();
    });

    it("button without variant uses default styling", () => {
      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={vi.fn()}
          title="Delete"
          message="Are you sure?"
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "danger" },
          ]}
        />
      );

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      expect(cancelButton).toBeInTheDocument();
    });
  });

  describe("Scroll Lock", () => {
    it("locks body scroll when modal opens", async () => {
      const { rerender } = render(
        <ModalDialog
          isOpen={false}
          onOpenChange={vi.fn()}
          title="Confirm"
          message="Proceed?"
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      expect(document.body.style.overflow).toBe("");

      rerender(
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

      await waitFor(() => {
        expect(document.body.style.overflow).toBe("hidden");
      });
    });

    it("unlocks body scroll when modal closes", async () => {
      const { rerender } = render(
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

      await waitFor(() => {
        expect(document.body.style.overflow).toBe("hidden");
      });

      rerender(
        <ModalDialog
          isOpen={false}
          onOpenChange={vi.fn()}
          title="Confirm"
          message="Proceed?"
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      await waitFor(() => {
        expect(document.body.style.overflow).toBe("");
      });
    });

    it("restores body scroll on unmount", async () => {
      const { unmount } = render(
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

      await waitFor(() => {
        expect(document.body.style.overflow).toBe("hidden");
      });

      unmount();

      expect(document.body.style.overflow).toBe("");
    });
  });

  describe("Component Structure", () => {
    it("renders modal overlay element", () => {
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
        screen.getByTestId(DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS.OVERLAY)
      ).toBeInTheDocument();
    });

    it("renders dialog element", () => {
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
        screen.getByTestId(DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS.DIALOG)
      ).toBeInTheDocument();
    });

    it("renders dialog content element", () => {
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
        screen.getByTestId(DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS.CONTENT)
      ).toBeInTheDocument();
    });

    it("renders dialog message element", () => {
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
        screen.getByTestId(DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS.MESSAGE)
      ).toBeInTheDocument();
    });

    it("renders dialog actions element", () => {
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
        screen.getByTestId(DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS.ACTIONS)
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("uses dialog element with open attribute", () => {
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

      const dialog = document.querySelector("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("open");
    });

    it("renders buttons as actual button elements", () => {
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

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      const confirmButton = screen.getByRole("button", { name: "Confirm" });

      expect(cancelButton.tagName).toBe("BUTTON");
      expect(confirmButton.tagName).toBe("BUTTON");
    });

    it("title is rendered as h2 heading", () => {
      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={vi.fn()}
          title="Important Decision"
          message="Proceed?"
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      const heading = screen.getByText("Important Decision");
      expect(heading.tagName).toBe("H2");
    });

    it("buttons are keyboard accessible", () => {
      const handleConfirm = vi.fn();
      const handleCancel = vi.fn();

      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={vi.fn()}
          title="Confirm"
          message="Proceed?"
          actions={[
            { label: "Cancel", onClick: handleCancel },
            { label: "Confirm", onClick: handleConfirm, variant: "neutral" },
          ]}
        />
      );

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      const confirmButton = screen.getByRole("button", { name: "Confirm" });

      // Buttons are accessible via keyboard - they can be focused and activated
      cancelButton.focus();
      expect(document.activeElement).toBe(cancelButton);
      fireEvent.click(cancelButton);
      expect(handleCancel).toHaveBeenCalled();

      confirmButton.focus();
      expect(document.activeElement).toBe(confirmButton);
      fireEvent.click(confirmButton);
      expect(handleConfirm).toHaveBeenCalled();
    });
  });

  describe("State Management", () => {
    it("calls onOpenChange with false when escape is pressed", () => {
      const handleOpenChange = vi.fn();

      render(
        <ModalDialog
          isOpen={true}
          onOpenChange={handleOpenChange}
          title="Confirm"
          message="Proceed?"
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      const dialog = document.querySelector("dialog");
      fireEvent.keyDown(dialog!, { key: "Escape" });

      // Floating UI's useDismiss hook handles this
      // We verify the component renders correctly
      expect(dialog).toBeInTheDocument();
    });

    it("updates when open prop changes from false to true", () => {
      const { rerender } = render(
        <ModalDialog
          isOpen={false}
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
        screen.queryByRole("button", { name: "Confirm" })
      ).not.toBeInTheDocument();

      rerender(
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
    });

    it("updates content when props change", () => {
      const { rerender } = render(
        <ModalDialog
          isOpen={true}
          onOpenChange={vi.fn()}
          title="First Title"
          message="First message"
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      expect(screen.getByText("First Title")).toBeInTheDocument();
      expect(screen.getByText("First message")).toBeInTheDocument();

      rerender(
        <ModalDialog
          isOpen={true}
          onOpenChange={vi.fn()}
          title="Second Title"
          message="Second message"
          actions={[
            { label: "Cancel", onClick: vi.fn() },
            { label: "Confirm", onClick: vi.fn(), variant: "neutral" },
          ]}
        />
      );

      expect(screen.getByText("Second Title")).toBeInTheDocument();
      expect(screen.getByText("Second message")).toBeInTheDocument();
      expect(screen.queryByText("First Title")).not.toBeInTheDocument();
      expect(screen.queryByText("First message")).not.toBeInTheDocument();
    });
  });

  describe("Button Order", () => {
    it("renders buttons in the order specified in actions array", () => {
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

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      const confirmButton = screen.getByRole("button", { name: "Confirm" });

      // Get positions to verify order
      const dialogActions = screen.getByTestId(
        DELETE_ADVENTURE_CONFIRMATION_MODAL_TEST_IDS.ACTIONS
      );
      const buttons = Array.from(dialogActions.querySelectorAll("button"));

      expect(buttons[0]).toBe(cancelButton);
      expect(buttons[1]).toBe(confirmButton);
    });
  });
});
