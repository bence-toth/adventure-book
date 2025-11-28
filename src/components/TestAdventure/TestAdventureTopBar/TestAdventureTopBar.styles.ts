import styled from "styled-components";
import { getColor } from "@/utils/colorHelpers";

export const TopBarStartContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-1);
`;

export const SavingIndicator = styled.span`
  color: ${getColor("foreground-muted", "neutral")};
`;
