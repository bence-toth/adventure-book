import type { ReactNode } from "react";
import { useEffect } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  type Placement,
} from "@floating-ui/react";
import "./ContextMenu.css";

export interface ContextMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: HTMLElement | null;
  children: ReactNode;
  placement?: Placement;
}

export const ContextMenu = ({
  open,
  onOpenChange,
  triggerRef,
  children,
  placement = "top-end",
}: ContextMenuProps) => {
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange,
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    placement,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getFloatingProps } = useInteractions([click, dismiss, role]);

  // Set the reference element when it changes
  useEffect(() => {
    if (triggerRef) {
      refs.setReference(triggerRef);
    }
  }, [triggerRef, refs]);

  if (!open) return null;

  return (
    <FloatingFocusManager context={context} modal={false}>
      <div
        ref={refs.setFloating}
        className="context-menu"
        style={floatingStyles}
        {...getFloatingProps()}
      >
        {children}
      </div>
    </FloatingFocusManager>
  );
};

export interface ContextMenuItemProps {
  onClick: () => void;
  children: ReactNode;
  variant?: "default" | "danger";
}

export const ContextMenuItem = ({
  onClick,
  children,
  variant = "default",
}: ContextMenuItemProps) => {
  const className =
    variant === "danger"
      ? "context-menu-item context-menu-item-danger"
      : "context-menu-item";

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};
