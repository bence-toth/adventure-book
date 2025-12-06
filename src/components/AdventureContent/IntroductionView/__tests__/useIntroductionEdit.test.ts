import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIntroductionEdit } from "../useIntroductionEdit";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import type { Adventure } from "@/data/types";

describe("useIntroductionEdit", () => {
  let mockOnSave: (title: string, text: string) => Promise<void>;
  let testAdventure: Adventure;

  beforeEach(() => {
    mockOnSave = vi.fn().mockResolvedValue(undefined);
    testAdventure = mockAdventure;
  });

  describe("Initial state", () => {
    it("initializes with adventure title", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      expect(result.current.title).toBe(testAdventure.metadata.title);
    });

    it("initializes with adventure introduction text", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      const expectedText = testAdventure.intro.paragraphs.join("\n\n");
      expect(result.current.text).toBe(expectedText);
    });

    it("initializes with no errors", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      expect(result.current.titleError).toBeUndefined();
      expect(result.current.textError).toBeUndefined();
    });

    it("initializes with hasChanges as false", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      expect(result.current.hasChanges).toBe(false);
    });
  });

  describe("handleTitleChange", () => {
    it("updates title value", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.handleTitleChange({
          target: { value: "New Title" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.title).toBe("New Title");
    });

    it("sets hasChanges to true when title is modified", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.handleTitleChange({
          target: { value: "New Title" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it("clears title error when typing", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      // First set an error by triggering validation
      act(() => {
        result.current.handleTitleChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.handleSave();
      });

      expect(result.current.titleError).toBeDefined();

      // Now clear the error by typing
      act(() => {
        result.current.handleTitleChange({
          target: { value: "N" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.titleError).toBeUndefined();
    });
  });

  describe("handleTextChange", () => {
    it("updates text value", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.handleTextChange({
          target: { value: "New text content" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      expect(result.current.text).toBe("New text content");
    });

    it("sets hasChanges to true when text is modified", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.handleTextChange({
          target: { value: "New text" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it("clears text error when typing", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      // First set an error by triggering validation
      act(() => {
        result.current.handleTextChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      act(() => {
        result.current.handleSave();
      });

      expect(result.current.textError).toBeDefined();

      // Now clear the error by typing
      act(() => {
        result.current.handleTextChange({
          target: { value: "N" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      expect(result.current.textError).toBeUndefined();
    });
  });

  describe("hasChanges", () => {
    it("returns false when no changes are made", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      expect(result.current.hasChanges).toBe(false);
    });

    it("returns true when title is changed", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.handleTitleChange({
          target: { value: "Modified" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it("returns true when text is changed", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.handleTextChange({
          target: { value: "Modified text" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it("returns false after reset", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.handleTitleChange({
          target: { value: "Modified" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.hasChanges).toBe(true);

      act(() => {
        result.current.handleReset();
      });

      expect(result.current.hasChanges).toBe(false);
    });
  });

  describe("handleSave", () => {
    it("calls onSave with title and text when validation passes", async () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.handleTitleChange({
          target: { value: "Updated Title" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.handleTextChange({
          target: { value: "Updated text" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      await act(async () => {
        await result.current.handleSave();
      });

      expect(mockOnSave).toHaveBeenCalledWith("Updated Title", "Updated text");
    });

    it("does not call onSave when title is empty", async () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.handleTitleChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        await result.current.handleSave();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
      expect(result.current.titleError).toBe("Title must not be blank");
    });

    it("does not call onSave when text is empty", async () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.handleTextChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      await act(async () => {
        await result.current.handleSave();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
      expect(result.current.textError).toBe(
        "Introduction content must not be blank"
      );
    });

    it("sets both errors when title and text are empty", async () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.handleTitleChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.handleTextChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      await act(async () => {
        await result.current.handleSave();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
      expect(result.current.titleError).toBe("Title must not be blank");
      expect(result.current.textError).toBe(
        "Introduction content must not be blank"
      );
    });

    it("does not call onSave when title is only whitespace", async () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.handleTitleChange({
          target: { value: "   " },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        await result.current.handleSave();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
      expect(result.current.titleError).toBe("Title must not be blank");
    });

    it("does not call onSave when text is only whitespace", async () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.handleTextChange({
          target: { value: "   " },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      await act(async () => {
        await result.current.handleSave();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
      expect(result.current.textError).toBe(
        "Introduction content must not be blank"
      );
    });
  });

  describe("handleReset", () => {
    it("restores original title", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.handleTitleChange({
          target: { value: "Modified Title" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.title).toBe("Modified Title");

      act(() => {
        result.current.handleReset();
      });

      expect(result.current.title).toBe(testAdventure.metadata.title);
    });

    it("restores original text", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.handleTextChange({
          target: { value: "Modified text" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      expect(result.current.text).toBe("Modified text");

      act(() => {
        result.current.handleReset();
      });

      expect(result.current.text).toBe(
        testAdventure.intro.paragraphs.join("\n\n")
      );
    });

    it("clears title error", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      // Set error
      act(() => {
        result.current.handleTitleChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.handleSave();
      });

      expect(result.current.titleError).toBeDefined();

      // Reset should clear error
      act(() => {
        result.current.handleReset();
      });

      expect(result.current.titleError).toBeUndefined();
    });

    it("clears text error", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      // Set error
      act(() => {
        result.current.handleTextChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      act(() => {
        result.current.handleSave();
      });

      expect(result.current.textError).toBeDefined();

      // Reset should clear error
      act(() => {
        result.current.handleReset();
      });

      expect(result.current.textError).toBeUndefined();
    });

    it("sets hasChanges to false", () => {
      const { result } = renderHook(() =>
        useIntroductionEdit({
          adventure: testAdventure,
          onSave: mockOnSave,
        })
      );

      act(() => {
        result.current.handleTitleChange({
          target: { value: "Modified" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.hasChanges).toBe(true);

      act(() => {
        result.current.handleReset();
      });

      expect(result.current.hasChanges).toBe(false);
    });
  });
});
