import type { ReactNode, ComponentType } from "react";
import { createElement, useEffect } from "react";
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
import { MenuContainer, MenuItem, MenuItemIcon } from "./ContextMenu.styles";

interface ContextMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: HTMLElement | null;
  children: ReactNode;
  placement?: Placement;
  "data-testid"?: string;
}

export const ContextMenu = ({
  open,
  onOpenChange,
  triggerRef,
  children,
  placement = "bottom-start",
  "data-testid": dataTestId,
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
        // Callback ref to set the floating element, safe to use in render
        // eslint-disable-next-line react-hooks/refs
        ref={refs.setFloating}
        style={floatingStyles}
        data-testid={dataTestId || "context-menu"}
        {...getFloatingProps()}
      >
        {children}
      </MenuContainer>
    </FloatingFocusManager>
  );
};

interface ContextMenuItemProps {
  onClick: () => void;
  children: ReactNode;
  variant?: "default" | "danger";
  icon?: ComponentType<Record<string, unknown>>;
  "data-testid"?: string;
}

export const ContextMenuItem = ({
  onClick,
  children,
  variant = "default",
  icon,
  "data-testid": dataTestId,
}: ContextMenuItemProps) => {
  const iconElement = icon
    ? createElement(icon, {
        size: 16,
        strokeWidth: 2,
        "aria-hidden": true,
      })
    : null;

  return (
    <MenuItem
      $variant={variant}
      onClick={onClick}
      data-testid={dataTestId || "context-menu-item"}
    >
      {iconElement && <MenuItemIcon>{iconElement}</MenuItemIcon>}
      {children}
    </MenuItem>
  );
};
