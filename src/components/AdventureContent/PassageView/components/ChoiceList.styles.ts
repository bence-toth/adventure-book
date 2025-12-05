import styled from "styled-components";
import { getColor } from "@/utils/colorHelpers";
import { Button } from "@/components/common/Button/Button";

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

export const AddButton = styled(Button)`
  align-self: flex-start;
`;

export const ErrorText = styled.p`
  font-size: var(--font-size-sm);
  color: ${getColor({ type: "foreground", variant: "danger" })};
  margin: 0;
`;
