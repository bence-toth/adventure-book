import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type DragEvent,
} from "react";

interface UseFileDropParams {
  onFileDrop: (file: File) => void;
  isDisabled?: boolean;
}

interface UseFileDropReturn {
  isDragging: boolean;
  handleDragEnter: (e: DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>) => void;
}

/**
 * Custom hook for handling file drag and drop functionality
 * Manages drag state, nested drag events, and drag cancellation
 */
export const useFileDrop = ({
  onFileDrop,
  isDisabled = false,
}: UseFileDropParams): UseFileDropReturn => {
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

  return {
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
};
