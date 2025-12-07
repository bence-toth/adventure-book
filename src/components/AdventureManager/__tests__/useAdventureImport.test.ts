import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useAdventureImport } from "../useAdventureImport";
import * as importYaml from "@/utils/importYaml";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock importYaml
vi.mock("@/utils/importYaml", () => ({
  importYamlFile: vi.fn(),
}));

describe("useAdventureImport", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(importYaml.importYamlFile).mockClear();
  });

  it("starts with no import error", () => {
    const { result } = renderHook(() => useAdventureImport());

    expect(result.current.importError).toBe(null);
  });

  describe("Successful Import", () => {
    it("imports file, calls success callback, and navigates", async () => {
      const onImportSuccess = vi.fn().mockResolvedValue(undefined);
      vi.mocked(importYaml.importYamlFile).mockResolvedValue({
        success: true,
        adventureId: "imported-id",
      });

      const { result } = renderHook(() => useAdventureImport(onImportSuccess));

      const mockFile = new File(["content"], "test.yaml", {
        type: "text/yaml",
      });

      await result.current.handleFileImport(mockFile);

      expect(importYaml.importYamlFile).toHaveBeenCalledWith(mockFile);
      expect(onImportSuccess).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(
        "/adventure/imported-id/test/introduction"
      );
      expect(result.current.importError).toBe(null);
    });

    it("imports file and navigates without success callback", async () => {
      vi.mocked(importYaml.importYamlFile).mockResolvedValue({
        success: true,
        adventureId: "imported-id",
      });

      const { result } = renderHook(() => useAdventureImport());

      const mockFile = new File(["content"], "test.yaml", {
        type: "text/yaml",
      });

      await result.current.handleFileImport(mockFile);

      expect(importYaml.importYamlFile).toHaveBeenCalledWith(mockFile);
      expect(mockNavigate).toHaveBeenCalledWith(
        "/adventure/imported-id/test/introduction"
      );
      expect(result.current.importError).toBe(null);
    });
  });

  describe("Failed Import", () => {
    it("sets import error and does not navigate", async () => {
      const errorMessage = "Invalid YAML format";
      vi.mocked(importYaml.importYamlFile).mockResolvedValue({
        success: false,
        error: errorMessage,
      });

      const { result } = renderHook(() => useAdventureImport());

      const mockFile = new File(["content"], "test.yaml", {
        type: "text/yaml",
      });

      await act(async () => {
        await result.current.handleFileImport(mockFile);
      });

      await waitFor(() => {
        expect(result.current.importError).toBe(errorMessage);
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("does not call success callback on failure", async () => {
      const onImportSuccess = vi.fn().mockResolvedValue(undefined);
      vi.mocked(importYaml.importYamlFile).mockResolvedValue({
        success: false,
        error: "Error message",
      });

      const { result } = renderHook(() => useAdventureImport(onImportSuccess));

      const mockFile = new File(["content"], "test.yaml", {
        type: "text/yaml",
      });

      await act(async () => {
        await result.current.handleFileImport(mockFile);
      });

      await waitFor(() => {
        expect(result.current.importError).toBe("Error message");
      });
      expect(onImportSuccess).not.toHaveBeenCalled();
    });
  });

  describe("Closing Import Error", () => {
    it("clears import error when close is called", async () => {
      vi.mocked(importYaml.importYamlFile).mockResolvedValue({
        success: false,
        error: "Some error",
      });

      const { result } = renderHook(() => useAdventureImport());

      const mockFile = new File(["content"], "test.yaml", {
        type: "text/yaml",
      });

      await act(async () => {
        await result.current.handleFileImport(mockFile);
      });

      await waitFor(() => {
        expect(result.current.importError).toBe("Some error");
      });

      act(() => {
        result.current.handleCloseImportError();
      });

      expect(result.current.importError).toBe(null);
    });
  });
});
