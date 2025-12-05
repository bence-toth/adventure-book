import styled from "styled-components";
import { Button } from "@/components/common/Button/Button";

export const EffectRow = styled.div`
  display: flex;
  gap: var(--space-1);
  align-items: flex-start;
`;

export const EffectControls = styled.div`
  display: flex;
  flex: 1;
  gap: var(--space-2);
`;

export const RemoveButton = styled(Button)`
  flex-shrink: 0;
  padding-block: var(--space-2);
  width: var(--space-7);
  margin-block-start: calc(
    1em * var(--line-height-dense) + var(--space-1)
  ); /* Align with input field (label height + gap) */
`;
