import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  type DragEvent,
} from "react";
import { FILE_DROP_AREA_TEST_IDS } from "./testIds";
import {
  DropAreaContainer,
  DropAreaOverlay,
  DropAreaContent,
} from "./FileDropArea.styles";

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
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDisabled) return;
      dragCounter.current += 1;
      setIsDragging(true);
    },
    [isDisabled]
  );

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;

    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragging(false);

      if (isDisabled) return;

      const files = Array.from(e.dataTransfer.files);

      // Pass all files to parent for validation and handling
      if (files.length > 0) {
        onFileDrop(files[0]);
      }
    },
    [onFileDrop, isDisabled]
  );

  // Cleanup drag state when drag operation is cancelled or completed outside the component.
  // The drag counter tracks nested drag enter/leave events, but can get out of sync if
  // the user cancels the drag (ESC key) or drops outside the drop area, leaving the overlay visible.
  // This attaches global event listeners to detect drag cancellation and completion by
  // listening to document-level 'dragend' (cancellation) and 'drop' (completion) events
  // to reset the drag counter and hide the overlay.
  useEffect(() => {
    const handleDragEnd = () => {
      dragCounter.current = 0;
      setIsDragging(false);
    };

    const handleDocumentDrop = () => {
      dragCounter.current = 0;
      setIsDragging(false);
    };

    document.addEventListener("dragend", handleDragEnd);
    document.addEventListener("drop", handleDocumentDrop);

    return () => {
      document.removeEventListener("dragend", handleDragEnd);
      document.removeEventListener("drop", handleDocumentDrop);
    };
  }, []);

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
