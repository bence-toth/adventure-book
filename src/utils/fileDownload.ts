export const sanitizeFilename = (filename: string): string => {
  // Replace characters that are problematic for file systems
  // / \ ? % * : | " < >
  return filename.replace(/[/\\?%*:|"<>]/g, "_");
};

export const downloadFile = (
  content: string,
  filename: string,
  mimeType = "text/plain;charset=utf-8"
): void => {
  // Create a blob from the content
  const blob = new Blob([content], { type: mimeType });

  // Create a download link and trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
