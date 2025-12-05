import { Button } from "@/components/common/Button/Button";
import { EditFooter } from "./PassageEditFooter.styles";

interface PassageEditFooterProps {
  hasChanges: boolean;
  onSave: () => void;
  onReset: () => void;
}

export const PassageEditFooter = ({
  hasChanges,
  onSave,
  onReset,
}: PassageEditFooterProps) => {
  return (
    <EditFooter>
      <Button
        onClick={onSave}
        variant="primary"
        disabled={!hasChanges}
        data-testid="save-button"
      >
        Save passage
      </Button>
      <Button
        onClick={onReset}
        variant="neutral"
        disabled={!hasChanges}
        data-testid="reset-button"
      >
        Undo changes
      </Button>
    </EditFooter>
  );
};
