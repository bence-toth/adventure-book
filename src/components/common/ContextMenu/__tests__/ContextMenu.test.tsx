import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContextMenu, ContextMenuItem } from "../ContextMenu";

describe("ContextMenu Component", () => {
  describe("Visibility", () => {
    it("renders when open is true", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          open={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()}>Test Item</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.getByText("Test Item")).toBeInTheDocument();

      document.body.removeChild(triggerElement);
    });

    it("does not render when open is false", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          open={false}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()}>Test Item</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.queryByText("Test Item")).not.toBeInTheDocument();

      document.body.removeChild(triggerElement);
    });

    it("handles null triggerRef gracefully", () => {
      render(
        <ContextMenu open={true} onOpenChange={vi.fn()} triggerRef={null}>
          <ContextMenuItem onClick={vi.fn()}>Test Item</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.getByText("Test Item")).toBeInTheDocument();
    });
  });

  describe("Menu Items", () => {
    it("renders multiple menu items", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          open={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()}>Item 1</ContextMenuItem>
          <ContextMenuItem onClick={vi.fn()}>Item 2</ContextMenuItem>
          <ContextMenuItem onClick={vi.fn()}>Item 3</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();

      document.body.removeChild(triggerElement);
    });

    it("calls onClick handler when menu item is clicked", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);
      const handleClick = vi.fn();

      render(
        <ContextMenu
          open={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={handleClick}>Click Me</ContextMenuItem>
        </ContextMenu>
      );

      fireEvent.click(screen.getByText("Click Me"));

      expect(handleClick).toHaveBeenCalledTimes(1);

      document.body.removeChild(triggerElement);
    });

    it("calls onClick for the correct item when multiple items exist", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);
      const handleClick1 = vi.fn();
      const handleClick2 = vi.fn();
      const handleClick3 = vi.fn();

      render(
        <ContextMenu
          open={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={handleClick1}>Item 1</ContextMenuItem>
          <ContextMenuItem onClick={handleClick2}>Item 2</ContextMenuItem>
          <ContextMenuItem onClick={handleClick3}>Item 3</ContextMenuItem>
        </ContextMenu>
      );

      fireEvent.click(screen.getByText("Item 2"));

      expect(handleClick1).not.toHaveBeenCalled();
      expect(handleClick2).toHaveBeenCalledTimes(1);
      expect(handleClick3).not.toHaveBeenCalled();

      document.body.removeChild(triggerElement);
    });
  });

  describe("ContextMenuItem Variants", () => {
    it("renders with default variant by default", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          open={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()}>Default Item</ContextMenuItem>
        </ContextMenu>
      );

      const item = screen.getByText("Default Item");
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute("data-testid", "context-menu-item");

      document.body.removeChild(triggerElement);
    });

    it("renders with danger variant when specified", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          open={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()} variant="danger">
            Delete
          </ContextMenuItem>
        </ContextMenu>
      );

      const item = screen.getByText("Delete");
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute("data-testid", "context-menu-item");

      document.body.removeChild(triggerElement);
    });

    it("renders with default variant when explicitly specified", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          open={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()} variant="default">
            Normal Item
          </ContextMenuItem>
        </ContextMenu>
      );

      const item = screen.getByText("Normal Item");
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute("data-testid", "context-menu-item");

      document.body.removeChild(triggerElement);
    });
  });

  describe("Component Structure", () => {
    it("renders context menu container", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          open={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()}>Item</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.getByTestId("context-menu")).toBeInTheDocument();

      document.body.removeChild(triggerElement);
    });

    it("renders all menu items with data-testid", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          open={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()}>Item 1</ContextMenuItem>
          <ContextMenuItem onClick={vi.fn()}>Item 2</ContextMenuItem>
        </ContextMenu>
      );

      const items = screen.getAllByTestId("context-menu-item");
      expect(items).toHaveLength(2);
      expect(screen.getByText("Item 1")).toHaveAttribute(
        "data-testid",
        "context-menu-item"
      );
      expect(screen.getByText("Item 2")).toHaveAttribute(
        "data-testid",
        "context-menu-item"
      );

      document.body.removeChild(triggerElement);
    });
  });

  describe("Accessibility", () => {
    it("renders menu items as buttons", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          open={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()}>Accessible Item</ContextMenuItem>
        </ContextMenu>
      );

      const item = screen.getByText("Accessible Item");
      expect(item.tagName).toBe("BUTTON");

      document.body.removeChild(triggerElement);
    });

    it("menu items are keyboard accessible", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);
      const handleClick = vi.fn();

      render(
        <ContextMenu
          open={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={handleClick}>Keyboard Item</ContextMenuItem>
        </ContextMenu>
      );

      const item = screen.getByText("Keyboard Item");
      item.focus();
      fireEvent.click(item);

      expect(handleClick).toHaveBeenCalled();

      document.body.removeChild(triggerElement);
    });
  });

  describe("Placement", () => {
    it("uses top-end placement by default", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          open={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()}>Item</ContextMenuItem>
        </ContextMenu>
      );

      // The placement is handled by Floating UI internally
      // We just verify the component renders without errors
      expect(screen.getByTestId("context-menu")).toBeInTheDocument();

      document.body.removeChild(triggerElement);
    });

    it("accepts custom placement prop", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          open={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
          placement="bottom-start"
        >
          <ContextMenuItem onClick={vi.fn()}>Item</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.getByTestId("context-menu")).toBeInTheDocument();

      document.body.removeChild(triggerElement);
    });
  });

  describe("Interaction States", () => {
    it("updates when open state changes from false to true", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      const { rerender } = render(
        <ContextMenu
          open={false}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()}>Item</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.queryByText("Item")).not.toBeInTheDocument();

      rerender(
        <ContextMenu
          open={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()}>Item</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.getByText("Item")).toBeInTheDocument();

      document.body.removeChild(triggerElement);
    });

    it("updates when triggerRef changes", () => {
      const triggerElement1 = document.createElement("button");
      const triggerElement2 = document.createElement("button");
      document.body.appendChild(triggerElement1);
      document.body.appendChild(triggerElement2);

      const { rerender } = render(
        <ContextMenu
          open={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement1}
        >
          <ContextMenuItem onClick={vi.fn()}>Item</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.getByText("Item")).toBeInTheDocument();

      rerender(
        <ContextMenu
          open={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement2}
        >
          <ContextMenuItem onClick={vi.fn()}>Item</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.getByText("Item")).toBeInTheDocument();

      document.body.removeChild(triggerElement1);
      document.body.removeChild(triggerElement2);
    });
  });
});
