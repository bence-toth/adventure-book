import { renderHook } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { usePassageSaveActions } from "../usePassageSaveActions";
import type { Passage } from "@/data/types";
import type { ChoiceData, EffectData } from "../usePassageEditState";
import * as validation from "@/utils/validation";

// Mock validation functions
vi.mock("@/utils/validation", () => ({
  validatePassageText: vi.fn((text: string) => {
    if (!text.trim()) return "Passage text is required";
    return undefined;
  }),
  validateChoiceText: vi.fn((text: string) => {
    if (!text.trim()) return "Choice text is required";
    return undefined;
  }),
  validateChoiceTarget: vi.fn((goto: number | null) => {
    if (goto === null) return "Choice target is required";
    return undefined;
  }),
  validateEffects: vi.fn(() => undefined),
  validateEndingType: vi.fn((isEnding: boolean, type: string) => {
    if (isEnding && !type) return "Ending type is required";
    return undefined;
  }),
}));

describe("usePassageSaveActions", () => {
  const mockUpdatePassage = vi.fn();
  const mockSetTextError = vi.fn();
  const mockSetChoicesError = vi.fn();
  const mockSetEffectsError = vi.fn();
  const mockSetEndingTypeError = vi.fn();
  const mockSetChoices = vi.fn();
  const mockSetEffects = vi.fn();
  const mockResetState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("handleSave for regular passages", () => {
    it("saves a valid regular passage", async () => {
      const choices: ChoiceData[] = [
        { text: "Choice 1", goto: 2 },
        { text: "Choice 2", goto: 3 },
      ];
      const effects: EffectData[] = [{ type: "add_item", item: "key" }];

      const { result } = renderHook(() =>
        usePassageSaveActions({
          passageId: 1,
          updatePassage: mockUpdatePassage,
          text: "First paragraph\n\nSecond paragraph",
          notes: "Test notes",
          isEnding: false,
          endingType: "",
          choices,
          effects,
          setTextError: mockSetTextError,
          setChoicesError: mockSetChoicesError,
          setEffectsError: mockSetEffectsError,
          setEndingTypeError: mockSetEndingTypeError,
          setChoices: mockSetChoices,
          setEffects: mockSetEffects,
          resetState: mockResetState,
        })
      );

      await result.current.handleSave();

      expect(mockUpdatePassage).toHaveBeenCalledWith(1, {
        paragraphs: ["First paragraph", "Second paragraph"],
        notes: "Test notes",
        choices: [
          { text: "Choice 1", goto: 2 },
          { text: "Choice 2", goto: 3 },
        ],
        effects: [{ type: "add_item", item: "key" }],
      });
    });

    it("saves passage without notes when notes are empty", async () => {
      const choices: ChoiceData[] = [{ text: "Choice", goto: 2 }];

      const { result } = renderHook(() =>
        usePassageSaveActions({
          passageId: 1,
          updatePassage: mockUpdatePassage,
          text: "Paragraph",
          notes: "",
          isEnding: false,
          endingType: "",
          choices,
          effects: [],
          setTextError: mockSetTextError,
          setChoicesError: mockSetChoicesError,
          setEffectsError: mockSetEffectsError,
          setEndingTypeError: mockSetEndingTypeError,
          setChoices: mockSetChoices,
          setEffects: mockSetEffects,
          resetState: mockResetState,
        })
      );

      await result.current.handleSave();

      const savedPassage = mockUpdatePassage.mock.calls[0][1] as Passage;
      expect(savedPassage).not.toHaveProperty("notes");
    });

    it("saves passage without effects when effects are empty", async () => {
      const choices: ChoiceData[] = [{ text: "Choice", goto: 2 }];

      const { result } = renderHook(() =>
        usePassageSaveActions({
          passageId: 1,
          updatePassage: mockUpdatePassage,
          text: "Paragraph",
          notes: "",
          isEnding: false,
          endingType: "",
          choices,
          effects: [],
          setTextError: mockSetTextError,
          setChoicesError: mockSetChoicesError,
          setEffectsError: mockSetEffectsError,
          setEndingTypeError: mockSetEndingTypeError,
          setChoices: mockSetChoices,
          setEffects: mockSetEffects,
          resetState: mockResetState,
        })
      );

      await result.current.handleSave();

      const savedPassage = mockUpdatePassage.mock.calls[0][1] as Passage;
      expect(savedPassage).not.toHaveProperty("effects");
    });

    it("filters out empty paragraphs", async () => {
      const choices: ChoiceData[] = [{ text: "Choice", goto: 2 }];

      const { result } = renderHook(() =>
        usePassageSaveActions({
          passageId: 1,
          updatePassage: mockUpdatePassage,
          text: "First\n\n\n\nSecond\n\n",
          notes: "",
          isEnding: false,
          endingType: "",
          choices,
          effects: [],
          setTextError: mockSetTextError,
          setChoicesError: mockSetChoicesError,
          setEffectsError: mockSetEffectsError,
          setEndingTypeError: mockSetEndingTypeError,
          setChoices: mockSetChoices,
          setEffects: mockSetEffects,
          resetState: mockResetState,
        })
      );

      await result.current.handleSave();

      const savedPassage = mockUpdatePassage.mock.calls[0][1] as Passage;
      expect(savedPassage.paragraphs).toEqual(["First", "Second"]);
    });

    it("validates passage text", async () => {
      const choices: ChoiceData[] = [{ text: "Choice", goto: 2 }];

      const { result } = renderHook(() =>
        usePassageSaveActions({
          passageId: 1,
          updatePassage: mockUpdatePassage,
          text: "",
          notes: "",
          isEnding: false,
          endingType: "",
          choices,
          effects: [],
          setTextError: mockSetTextError,
          setChoicesError: mockSetChoicesError,
          setEffectsError: mockSetEffectsError,
          setEndingTypeError: mockSetEndingTypeError,
          setChoices: mockSetChoices,
          setEffects: mockSetEffects,
          resetState: mockResetState,
        })
      );

      await result.current.handleSave();

      expect(mockSetTextError).toHaveBeenCalledWith("Passage text is required");
      expect(mockUpdatePassage).not.toHaveBeenCalled();
    });

    it("validates that regular passages have at least one choice", async () => {
      const { result } = renderHook(() =>
        usePassageSaveActions({
          passageId: 1,
          updatePassage: mockUpdatePassage,
          text: "Test",
          notes: "",
          isEnding: false,
          endingType: "",
          choices: [],
          effects: [],
          setTextError: mockSetTextError,
          setChoicesError: mockSetChoicesError,
          setEffectsError: mockSetEffectsError,
          setEndingTypeError: mockSetEndingTypeError,
          setChoices: mockSetChoices,
          setEffects: mockSetEffects,
          resetState: mockResetState,
        })
      );

      await result.current.handleSave();

      expect(mockSetChoicesError).toHaveBeenCalledWith(
        "Regular passages must have at least one choice"
      );
      expect(mockUpdatePassage).not.toHaveBeenCalled();
    });

    it("validates choice text", async () => {
      const choices: ChoiceData[] = [
        { text: "", goto: 2 },
        { text: "Valid", goto: 3 },
      ];

      const { result } = renderHook(() =>
        usePassageSaveActions({
          passageId: 1,
          updatePassage: mockUpdatePassage,
          text: "Test",
          notes: "",
          isEnding: false,
          endingType: "",
          choices,
          effects: [],
          setTextError: mockSetTextError,
          setChoicesError: mockSetChoicesError,
          setEffectsError: mockSetEffectsError,
          setEndingTypeError: mockSetEndingTypeError,
          setChoices: mockSetChoices,
          setEffects: mockSetEffects,
          resetState: mockResetState,
        })
      );

      await result.current.handleSave();

      expect(mockSetChoices).toHaveBeenCalledWith([
        { text: "", goto: 2, textError: "Choice text is required" },
        { text: "Valid", goto: 3 },
      ]);
      expect(mockUpdatePassage).not.toHaveBeenCalled();
    });

    it("validates choice goto", async () => {
      const choices: ChoiceData[] = [
        { text: "Choice", goto: null },
        { text: "Valid", goto: 3 },
      ];

      const { result } = renderHook(() =>
        usePassageSaveActions({
          passageId: 1,
          updatePassage: mockUpdatePassage,
          text: "Test",
          notes: "",
          isEnding: false,
          endingType: "",
          choices,
          effects: [],
          setTextError: mockSetTextError,
          setChoicesError: mockSetChoicesError,
          setEffectsError: mockSetEffectsError,
          setEndingTypeError: mockSetEndingTypeError,
          setChoices: mockSetChoices,
          setEffects: mockSetEffects,
          resetState: mockResetState,
        })
      );

      await result.current.handleSave();

      expect(mockSetChoices).toHaveBeenCalledWith([
        { text: "Choice", goto: null, gotoError: "Choice target is required" },
        { text: "Valid", goto: 3 },
      ]);
      expect(mockUpdatePassage).not.toHaveBeenCalled();
    });

    it("validates that effects have type and item", async () => {
      const choices: ChoiceData[] = [{ text: "Choice", goto: 2 }];
      const effects: EffectData[] = [
        { type: "", item: "" },
        { type: "add_item", item: "key" },
      ];

      const { result } = renderHook(() =>
        usePassageSaveActions({
          passageId: 1,
          updatePassage: mockUpdatePassage,
          text: "Test",
          notes: "",
          isEnding: false,
          endingType: "",
          choices,
          effects,
          setTextError: mockSetTextError,
          setChoicesError: mockSetChoicesError,
          setEffectsError: mockSetEffectsError,
          setEndingTypeError: mockSetEndingTypeError,
          setChoices: mockSetChoices,
          setEffects: mockSetEffects,
          resetState: mockResetState,
        })
      );

      await result.current.handleSave();

      expect(mockSetEffects).toHaveBeenCalledWith([
        { type: "", item: "", error: "Effect type and item must be selected" },
        { type: "add_item", item: "key" },
      ]);
      expect(mockUpdatePassage).not.toHaveBeenCalled();
    });

    it("filters out incomplete effects when saving", async () => {
      const choices: ChoiceData[] = [{ text: "Choice", goto: 2 }];
      const effects: EffectData[] = [
        { type: "add_item", item: "key" },
        { type: "", item: "" },
      ];

      const { result } = renderHook(() =>
        usePassageSaveActions({
          passageId: 1,
          updatePassage: mockUpdatePassage,
          text: "Test",
          notes: "",
          isEnding: false,
          endingType: "",
          choices,
          effects,
          setTextError: mockSetTextError,
          setChoicesError: mockSetChoicesError,
          setEffectsError: mockSetEffectsError,
          setEndingTypeError: mockSetEndingTypeError,
          setChoices: mockSetChoices,
          setEffects: mockSetEffects,
          resetState: mockResetState,
        })
      );

      // First call will fail validation
      await result.current.handleSave();
      expect(mockUpdatePassage).not.toHaveBeenCalled();

      // Fix the validation issue by providing valid effects only
      const validEffects: EffectData[] = [{ type: "add_item", item: "key" }];

      const { result: result2 } = renderHook(() =>
        usePassageSaveActions({
          passageId: 1,
          updatePassage: mockUpdatePassage,
          text: "Test",
          notes: "",
          isEnding: false,
          endingType: "",
          choices,
          effects: validEffects,
          setTextError: mockSetTextError,
          setChoicesError: mockSetChoicesError,
          setEffectsError: mockSetEffectsError,
          setEndingTypeError: mockSetEndingTypeError,
          setChoices: mockSetChoices,
          setEffects: mockSetEffects,
          resetState: mockResetState,
        })
      );

      await result2.current.handleSave();

      const savedPassage = mockUpdatePassage.mock.calls[0][1] as Passage;
      expect(savedPassage.effects).toEqual([{ type: "add_item", item: "key" }]);
    });

    it("validates effects as a group and sets error when validation fails", async () => {
      const choices: ChoiceData[] = [{ text: "Choice", goto: 2 }];
      const effects: EffectData[] = [
        { type: "add_item", item: "key" },
        { type: "add_item", item: "key" }, // Duplicate - should fail group validation
      ];

      // Mock validateEffects to return an error for duplicates
      vi.mocked(validation.validateEffects).mockReturnValueOnce(
        'Cannot add the same inventory item "key" multiple times'
      );

      const { result } = renderHook(() =>
        usePassageSaveActions({
          passageId: 1,
          updatePassage: mockUpdatePassage,
          text: "Test",
          notes: "",
          isEnding: false,
          endingType: "",
          choices,
          effects,
          setTextError: mockSetTextError,
          setChoicesError: mockSetChoicesError,
          setEffectsError: mockSetEffectsError,
          setEndingTypeError: mockSetEndingTypeError,
          setChoices: mockSetChoices,
          setEffects: mockSetEffects,
          resetState: mockResetState,
        })
      );

      await result.current.handleSave();

      expect(mockSetEffectsError).toHaveBeenCalledWith(
        'Cannot add the same inventory item "key" multiple times'
      );
      expect(mockUpdatePassage).not.toHaveBeenCalled();
    });
  });

  describe("handleSave for ending passages", () => {
    it("saves a valid ending passage", async () => {
      const { result } = renderHook(() =>
        usePassageSaveActions({
          passageId: 1,
          updatePassage: mockUpdatePassage,
          text: "Ending text",
          notes: "Ending notes",
          isEnding: true,
          endingType: "victory",
          choices: [],
          effects: [],
          setTextError: mockSetTextError,
          setChoicesError: mockSetChoicesError,
          setEffectsError: mockSetEffectsError,
          setEndingTypeError: mockSetEndingTypeError,
          setChoices: mockSetChoices,
          setEffects: mockSetEffects,
          resetState: mockResetState,
        })
      );

      await result.current.handleSave();

      expect(mockUpdatePassage).toHaveBeenCalledWith(1, {
        paragraphs: ["Ending text"],
        notes: "Ending notes",
        ending: true,
        type: "victory",
      });
    });

    it("saves ending passage without ending type when not required", async () => {
      // Use a passage where ending type is not required (mock returns undefined)
      vi.mocked(validation.validateEndingType).mockReturnValueOnce(undefined);

      const { result } = renderHook(() =>
        usePassageSaveActions({
          passageId: 1,
          updatePassage: mockUpdatePassage,
          text: "Ending text",
          notes: "",
          isEnding: true,
          endingType: "",
          choices: [],
          effects: [],
          setTextError: mockSetTextError,
          setChoicesError: mockSetChoicesError,
          setEffectsError: mockSetEffectsError,
          setEndingTypeError: mockSetEndingTypeError,
          setChoices: mockSetChoices,
          setEffects: mockSetEffects,
          resetState: mockResetState,
        })
      );

      await result.current.handleSave();

      const savedPassage = mockUpdatePassage.mock.calls[0][1] as Passage;
      expect(savedPassage.ending).toBe(true);
      expect(savedPassage).not.toHaveProperty("type");
    });

    it("validates ending type", async () => {
      const { result } = renderHook(() =>
        usePassageSaveActions({
          passageId: 1,
          updatePassage: mockUpdatePassage,
          text: "Ending text",
          notes: "",
          isEnding: true,
          endingType: "",
          choices: [],
          effects: [],
          setTextError: mockSetTextError,
          setChoicesError: mockSetChoicesError,
          setEffectsError: mockSetEffectsError,
          setEndingTypeError: mockSetEndingTypeError,
          setChoices: mockSetChoices,
          setEffects: mockSetEffects,
          resetState: mockResetState,
        })
      );

      await result.current.handleSave();

      expect(mockSetEndingTypeError).toHaveBeenCalledWith(
        "Ending type is required"
      );
      expect(mockUpdatePassage).not.toHaveBeenCalled();
    });
  });

  describe("handleReset", () => {
    it("calls resetState", () => {
      const { result } = renderHook(() =>
        usePassageSaveActions({
          passageId: 1,
          updatePassage: mockUpdatePassage,
          text: "Test",
          notes: "",
          isEnding: false,
          endingType: "",
          choices: [],
          effects: [],
          setTextError: mockSetTextError,
          setChoicesError: mockSetChoicesError,
          setEffectsError: mockSetEffectsError,
          setEndingTypeError: mockSetEndingTypeError,
          setChoices: mockSetChoices,
          setEffects: mockSetEffects,
          resetState: mockResetState,
        })
      );

      result.current.handleReset();

      expect(mockResetState).toHaveBeenCalledTimes(1);
    });
  });
});
