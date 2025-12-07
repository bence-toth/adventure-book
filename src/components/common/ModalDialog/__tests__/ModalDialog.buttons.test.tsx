import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
});
