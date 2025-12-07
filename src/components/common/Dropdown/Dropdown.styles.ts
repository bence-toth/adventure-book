import styled from "styled-components";
import { getColor, getInteractiveColor } from "@/utils/colorHelpers";

export const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: var(--border-width-interactive-hairline) solid
    ${getInteractiveColor({
      variant: "neutral",
      type: "border",
      state: "default",
    })};
  background: ${getInteractiveColor({
    variant: "neutral",
    type: "background",
    state: "default",
  })};
  gap: var(--border-width-interactive-hairline);
  box-shadow: ${getColor({
    type: "shadow",
    variant: "neutral",
    isSurface: true,
    isElevated: true,
  })};
  border-radius: var(--space-1);
  z-index: 2;
  max-height: 300px;
  overflow-y: auto;
  outline: none;
`;

export const DropdownItem = styled.div<{
  $variant: "default" | "danger";
  $isActive: boolean;
  $isSelected?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-weight: ${(props) => (props.$isSelected ? "600" : "500")};
  width: 100%;
  padding: var(--space-2);
  position: relative;
  text-align: start;
  cursor: pointer;
  font-size: inherit;
  background: ${(props) =>
    props.$isActive
      ? getInteractiveColor({
          variant: props.$variant === "danger" ? "danger" : "neutral",
          type: "background",
          state: "focus",
        })
      : getInteractiveColor({
          variant: props.$variant === "danger" ? "danger" : "neutral",
          type: "background",
          state: "default",
        })};
  color: ${(props) =>
    props.$isActive
      ? getInteractiveColor({
          variant: props.$variant === "danger" ? "danger" : "neutral",
          type: "foreground",
          state: "focus",
        })
      : getInteractiveColor({
          variant: props.$variant === "danger" ? "danger" : "neutral",
          type: "foreground",
          state: "default",
        })};

  &:hover {
    background: ${(props) =>
      getInteractiveColor({
        variant: props.$variant === "danger" ? "danger" : "neutral",
        type: "background",
        state: "hover",
      })};
    color: ${(props) =>
      getInteractiveColor({
        variant: props.$variant === "danger" ? "danger" : "neutral",
        type: "foreground",
        state: "hover",
      })};
  }

  &:active {
    background: ${(props) =>
      getInteractiveColor({
        variant: props.$variant === "danger" ? "danger" : "neutral",
        type: "background",
        state: "active",
      })};
    color: ${(props) =>
      getInteractiveColor({
        variant: props.$variant === "danger" ? "danger" : "neutral",
        type: "foreground",
        state: "active",
      })};
  }

  &:focus-visible {
    outline-offset: -2px;
  }

  &:not(:last-child):after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    height: var(--border-width-interactive-hairline);
    background: ${getInteractiveColor({
      variant: "neutral",
      type: "background",
      state: "focus",
    })};
  }
`;

export const DropdownItemIcon = styled.span`
  display: flex;
`;
