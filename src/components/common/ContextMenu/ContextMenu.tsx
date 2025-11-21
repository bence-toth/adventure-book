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
import { MenuContainer, MenuItem } from "./ContextMenu.styles";

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
      <MenuContainer
        ref={refs.setFloating}
        style={floatingStyles}
        data-testid="context-menu"
        {...getFloatingProps()}
      >
        {children}
      </MenuContainer>
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
  return (
    <MenuItem
      $variant={variant}
      onClick={onClick}
      data-testid="context-menu-item"
    >
      {children}
    </MenuItem>
  );
};
