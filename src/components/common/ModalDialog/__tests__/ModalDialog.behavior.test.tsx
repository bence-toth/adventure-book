import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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
});
