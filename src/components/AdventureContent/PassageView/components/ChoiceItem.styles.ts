import styled from "styled-components";
import { Button } from "@/components/common/Button/Button";

export const ChoiceRow = styled.div`
  display: flex;
  gap: var(--space-1);
  align-items: flex-end;
`;

export const ChoiceControls = styled.div`
  display: flex;
  flex: 1;
  gap: var(--space-2);
`;

export const RemoveButton = styled(Button)`
  flex-shrink: 0;
  padding-block: var(--space-2);
  width: var(--space-7);
`;
