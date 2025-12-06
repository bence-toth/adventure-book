import { type ReactNode } from "react";
import { FILE_DROP_AREA_TEST_IDS } from "./testIds";
import {
  DropAreaContainer,
  DropAreaOverlay,
  DropAreaContent,
} from "./FileDropArea.styles";
import { useFileDrop } from "./useFileDrop";

interface FileDropAreaProps {
  children: ReactNode;
  onFileDrop: (file: File) => void;
  dropLabel: string;
  isDisabled?: boolean;
  "data-testid"?: string;
}

export const FileDropArea = ({
  children,
  onFileDrop,
  dropLabel,
  isDisabled = false,
  "data-testid": dataTestId,
}: FileDropAreaProps) => {
  const {
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useFileDrop({ onFileDrop, isDisabled });

  return (
    <DropAreaContainer
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-testid={dataTestId}
    >
      {children}
      {isDragging && (
        <DropAreaOverlay data-testid={FILE_DROP_AREA_TEST_IDS.OVERLAY}>
          <DropAreaContent>{dropLabel}</DropAreaContent>
        </DropAreaOverlay>
      )}
    </DropAreaContainer>
  );
};
