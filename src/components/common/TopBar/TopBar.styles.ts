import styled from "styled-components";
import { getColor } from "@/utils/colorHelpers";

export const TopBarContainer = styled.div`
  background: ${getColor("background", "neutral", true)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-inline: var(--space-2);
  border-bottom: var(--border-width-surface) solid
    ${getColor("border", "neutral", true)};
  box-shadow: ${getColor("shadow", "neutral", true)};
  position: relative;
  z-index: 2;
  height: var(--size-top-bar);
`;

export const TopBarStart = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex-grow: 1;
`;

export const TopBarEnd = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;
