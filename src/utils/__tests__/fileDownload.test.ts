import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { sanitizeFilename, downloadFile } from "../fileDownload";

describe("sanitizeFilename", () => {
  it("preserves alphanumeric characters", () => {
    expect(sanitizeFilename("abc123")).toBe("abc123");
  });

  it("preserves uppercase letters", () => {
    expect(sanitizeFilename("MyFile")).toBe("MyFile");
  });

  it("preserves spaces", () => {
    expect(sanitizeFilename("My File Name")).toBe("My File Name");
  });

  it("preserves common punctuation", () => {
    expect(sanitizeFilename("file-name_v1.0")).toBe("file-name_v1.0");
  });

  it("replaces forward slashes with underscores", () => {
    expect(sanitizeFilename("path/to/file")).toBe("path_to_file");
  });

  it("replaces backward slashes with underscores", () => {
    expect(sanitizeFilename("path\\to\\file")).toBe("path_to_file");
  });

  it("replaces question marks with underscores", () => {
    expect(sanitizeFilename("what?")).toBe("what_");
  });

  it("replaces percent signs with underscores", () => {
    expect(sanitizeFilename("50%")).toBe("50_");
  });

  it("replaces asterisks with underscores", () => {
    expect(sanitizeFilename("file*.txt")).toBe("file_.txt");
  });

  it("replaces colons with underscores", () => {
    expect(sanitizeFilename("12:30")).toBe("12_30");
  });

  it("replaces pipes with underscores", () => {
    expect(sanitizeFilename("file|name")).toBe("file_name");
  });

  it("replaces quotes with underscores", () => {
    expect(sanitizeFilename('file"name')).toBe("file_name");
  });

  it("replaces angle brackets with underscores", () => {
    expect(sanitizeFilename("file<>name")).toBe("file__name");
  });

  it("handles multiple problematic characters", () => {
    expect(sanitizeFilename("file/name:v1.0*")).toBe("file_name_v1.0_");
  });

  it("handles empty string", () => {
    expect(sanitizeFilename("")).toBe("");
  });

  it("handles strings with only problematic characters", () => {
    expect(sanitizeFilename("/:*?")).toBe("____");
  });

  it("preserves special characters that are safe", () => {
    expect(sanitizeFilename("file-name_v1.0 (draft)")).toBe(
      "file-name_v1.0 (draft)"
    );
  });
});

describe("downloadFile", () => {
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let appendChildSpy: ReturnType<typeof vi.spyOn>;
  let removeChildSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    createObjectURLSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("mock-url");
    revokeObjectURLSpy = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});

    // Mock document.body methods
    appendChildSpy = vi
      .spyOn(document.body, "appendChild")
      .mockImplementation((node) => node);
    removeChildSpy = vi
      .spyOn(document.body, "removeChild")
      .mockImplementation((node) => node);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a blob with the provided content and MIME type", () => {
    const content = "test content";
    const filename = "test.txt";
    const mimeType = "text/plain;charset=utf-8";

    downloadFile(content, filename, mimeType);

    expect(createObjectURLSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: mimeType,
      })
    );
  });

  it("uses default MIME type when not provided", () => {
    const content = "test content";
    const filename = "test.txt";

    downloadFile(content, filename);

    expect(createObjectURLSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "text/plain;charset=utf-8",
      })
    );
  });

  it("creates a download link with correct attributes", () => {
    const content = "test content";
    const filename = "test.txt";

    downloadFile(content, filename);

    // Verify appendChild was called
    expect(appendChildSpy).toHaveBeenCalledTimes(1);

    // Get the element that was appended
    const appendedElement = appendChildSpy.mock
      .calls[0][0] as HTMLAnchorElement;

    // Verify it's an anchor element with correct attributes
    expect(appendedElement.tagName).toBe("A");
    expect(appendedElement.href).toContain("mock-url");
    expect(appendedElement.download).toBe(filename);
  });

  it("triggers the download by clicking the link", () => {
    const content = "test content";
    const filename = "test.txt";

    // Spy on the click method
    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      const element = originalCreateElement(tagName);
      if (tagName === "a") {
        element.click = clickSpy;
      }
      return element;
    });

    downloadFile(content, filename);

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("cleans up by removing the link and revoking the URL", () => {
    const content = "test content";
    const filename = "test.txt";

    downloadFile(content, filename);

    expect(removeChildSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith("mock-url");
  });

  it("handles YAML MIME type", () => {
    const content = "metadata:\n  title: Test";
    const filename = "adventure.yaml";
    const mimeType = "text/yaml;charset=utf-8";

    downloadFile(content, filename, mimeType);

    expect(createObjectURLSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: mimeType,
      })
    );
  });
});
