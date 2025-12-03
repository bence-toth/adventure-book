import styled from "styled-components";
import { getColor } from "@/utils/colorHelpers";
import { Button } from "@/components/common/Button/Button";

export const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-3);
  width: 100%;
  max-width: var(--size-content);
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

export const SectionTitle = styled.h2`
  font-size: var(--font-size-lg);
  color: ${getColor({ type: "foreground", variant: "neutral" })};
  margin-block: var(--space-4) var(--space-1);
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-1);
  justify-content: flex-start;
`;

export const EffectRow = styled.div`
  display: flex;
  gap: var(--space-1);
  align-items: flex-end;
`;

export const EffectControls = styled.div`
  display: flex;
  flex: 1;
  gap: var(--space-2);
`;

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
`;

export const AddButton = styled(Button)`
  align-self: flex-start;
`;

export const ErrorText = styled.p`
  font-size: var(--font-size-sm);
  color: ${getColor({ type: "foreground", variant: "danger" })};
  margin: 0;
`;
