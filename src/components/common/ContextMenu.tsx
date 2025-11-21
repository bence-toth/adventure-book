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
import styled from "styled-components";

const MenuContainer = styled.div`
  box-shadow: var(--shadow-surface-elevated-neutral);
  min-width: 150px;
  z-index: 1000;
`;

const MenuItem = styled.button<{ $variant: "default" | "danger" }>`
  display: block;
  width: 100%;
  padding: var(--space-2) var(--space-3);
  text-align: left;
  cursor: pointer;
  font-size: var(--font-size-base);
  transition: background-color 0.15s ease;
  border-radius: var(--space-1);
  background: ${(props) =>
    props.$variant === "danger"
      ? "var(--color-interactive-background-default-danger)"
      : "var(--color-interactive-background-default-neutral)"};
  color: ${(props) =>
    props.$variant === "danger"
      ? "var(--color-interactive-foreground-default-danger)"
      : "var(--color-interactive-foreground-default-neutral)"};
  border: var(--border-width-hairline) solid
    ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-border-default-danger)"
        : "var(--color-interactive-border-default-neutral)"};

  &:hover {
    background: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-background-hover-danger)"
        : "var(--color-interactive-background-hover-neutral)"};
    color: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-foreground-hover-danger)"
        : "var(--color-interactive-foreground-hover-neutral)"};
    border-color: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-border-hover-danger)"
        : "var(--color-interactive-border-hover-neutral)"};
  }

  &:active {
    background: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-background-active-danger)"
        : "var(--color-interactive-background-active-neutral)"};
    color: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-foreground-active-danger)"
        : "var(--color-interactive-foreground-active-neutral)"};
    border-color: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-border-active-danger)"
        : "var(--color-interactive-border-active-neutral)"};
  }

  &:focus-visible {
    background: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-background-focus-danger)"
        : "var(--color-interactive-background-focus-neutral)"};
    color: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-foreground-focus-danger)"
        : "var(--color-interactive-foreground-focus-neutral)"};
    border-color: ${(props) =>
      props.$variant === "danger"
        ? "var(--color-interactive-border-focus-danger)"
        : "var(--color-interactive-border-focus-neutral)"};
    outline-offset: var(--space-1);
  }
`;

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
