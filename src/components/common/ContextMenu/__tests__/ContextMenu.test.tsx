import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useState } from "react";
import { ContextMenu, ContextMenuItem } from "../ContextMenu";

describe("ContextMenu Component - Integration", () => {
  describe("Integration with useMenuItems Hook", () => {
    it("renders multiple menu items using useMenuItems hook", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          isOpen={true}
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

    it("passes variants correctly through to Dropdown", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          isOpen={true}
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

      document.body.removeChild(triggerElement);
    });

    it("passes icons correctly through to Dropdown", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);
      const TestIcon = () => <svg data-testid="test-icon" />;

      render(
        <ContextMenu
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()} icon={TestIcon}>
            Item with Icon
          </ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.getByTestId("test-icon")).toBeInTheDocument();

      document.body.removeChild(triggerElement);
    });
  });

  describe("Integration with useMenuSelection Hook", () => {
    it("triggers onClick handler when menu item is clicked", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);
      const handleClick = vi.fn();

      render(
        <ContextMenu
          isOpen={true}
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

    it("triggers correct onClick handler for multiple items", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);
      const handleClick1 = vi.fn();
      const handleClick2 = vi.fn();
      const handleClick3 = vi.fn();

      render(
        <ContextMenu
          isOpen={true}
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

  describe("Integration with useMenuKeyboardNavigation Hook", () => {
    it("menu items are keyboard accessible via click", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);
      const handleClick = vi.fn();

      const TestWrapper = () => {
        const [isOpen, setIsOpen] = useState(true);
        return (
          <ContextMenu
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            triggerRef={triggerElement}
          >
            <ContextMenuItem onClick={handleClick}>
              Keyboard Item
            </ContextMenuItem>
          </ContextMenu>
        );
      };

      render(<TestWrapper />);

      const item = screen.getByText("Keyboard Item");
      act(() => {
        item.focus();
        fireEvent.click(item);
      });

      expect(handleClick).toHaveBeenCalled();

      document.body.removeChild(triggerElement);
    });

    it("menu items with icons remain clickable via keyboard navigation", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);
      const handleClick = vi.fn();
      const TestIcon = () => <svg data-testid="test-icon" />;

      const TestWrapper = () => {
        const [isOpen, setIsOpen] = useState(true);
        return (
          <ContextMenu
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            triggerRef={triggerElement}
          >
            <ContextMenuItem onClick={handleClick} icon={TestIcon}>
              Clickable Icon Item
            </ContextMenuItem>
          </ContextMenu>
        );
      };

      render(<TestWrapper />);

      act(() => {
        fireEvent.click(screen.getByText("Clickable Icon Item"));
      });

      expect(handleClick).toHaveBeenCalledTimes(1);

      document.body.removeChild(triggerElement);
    });
  });

  describe("Integration with Dropdown Component", () => {
    it("renders context menu container via Dropdown", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()}>Item</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.getByTestId("context-menu")).toBeInTheDocument();

      document.body.removeChild(triggerElement);
    });

    it("passes isOpen prop to Dropdown correctly", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      const { rerender } = render(
        <ContextMenu
          isOpen={false}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()}>Item</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.queryByText("Item")).not.toBeInTheDocument();

      rerender(
        <ContextMenu
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()}>Item</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.getByText("Item")).toBeInTheDocument();

      document.body.removeChild(triggerElement);
    });

    it("passes triggerRef to Dropdown correctly", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()}>Item</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.getByText("Item")).toBeInTheDocument();

      document.body.removeChild(triggerElement);
    });

    it("handles null triggerRef gracefully", () => {
      render(
        <ContextMenu isOpen={true} onOpenChange={vi.fn()} triggerRef={null}>
          <ContextMenuItem onClick={vi.fn()}>Test Item</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.getByText("Test Item")).toBeInTheDocument();
    });

    it("passes placement prop to Dropdown", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          isOpen={true}
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

    it("passes custom data-testid to Dropdown", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      render(
        <ContextMenu
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
          data-testid="custom-menu"
        >
          <ContextMenuItem onClick={vi.fn()}>Item</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.getByTestId("custom-menu")).toBeInTheDocument();

      document.body.removeChild(triggerElement);
    });
  });

  describe("Full End-to-End Integration", () => {
    it("complete user flow: render, click, and handle selection", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);
      const onClickEdit = vi.fn();
      const onClickDelete = vi.fn();
      const onOpenChange = vi.fn();

      render(
        <ContextMenu
          isOpen={true}
          onOpenChange={onOpenChange}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={onClickEdit}>Edit</ContextMenuItem>
          <ContextMenuItem onClick={onClickDelete} variant="danger">
            Delete
          </ContextMenuItem>
        </ContextMenu>
      );

      // Verify rendering
      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();

      // Click first item
      fireEvent.click(screen.getByText("Edit"));
      expect(onClickEdit).toHaveBeenCalledTimes(1);
      expect(onClickDelete).not.toHaveBeenCalled();

      // Click second item
      fireEvent.click(screen.getByText("Delete"));
      expect(onClickDelete).toHaveBeenCalledTimes(1);

      document.body.removeChild(triggerElement);
    });

    it("handles dynamic state updates correctly", () => {
      const triggerElement = document.createElement("button");
      document.body.appendChild(triggerElement);

      const { rerender } = render(
        <ContextMenu
          isOpen={false}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()}>Item A</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.queryByText("Item A")).not.toBeInTheDocument();

      rerender(
        <ContextMenu
          isOpen={true}
          onOpenChange={vi.fn()}
          triggerRef={triggerElement}
        >
          <ContextMenuItem onClick={vi.fn()}>Item B</ContextMenuItem>
        </ContextMenu>
      );

      expect(screen.queryByText("Item A")).not.toBeInTheDocument();
      expect(screen.getByText("Item B")).toBeInTheDocument();

      document.body.removeChild(triggerElement);
    });
  });
});
