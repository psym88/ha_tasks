export const fileIcon = (filename: string, contentType: string): string => {
  const type = contentType.toLowerCase();
  const extension = filename.split(".").pop()?.toLowerCase();
  if (type.startsWith("image/")) {
    return "mdi:file-image-outline";
  }
  if (type === "application/pdf" || extension === "pdf") {
    return "mdi:file-pdf-box";
  }
  if (
    type.startsWith("text/") ||
    ["txt", "md", "log"].includes(extension || "")
  ) {
    return "mdi:file-document-outline";
  }
  if (type.startsWith("audio/")) {
    return "mdi:file-music-outline";
  }
  if (type.startsWith("video/")) {
    return "mdi:file-video-outline";
  }
  if (
    type.includes("zip") ||
    type.includes("compressed") ||
    ["zip", "rar", "7z", "gz"].includes(extension || "")
  ) {
    return "mdi:folder-zip-outline";
  }
  if (
    type.includes("spreadsheet") ||
    type.includes("excel") ||
    ["csv", "xls", "xlsx", "ods"].includes(extension || "")
  ) {
    return "mdi:file-table-outline";
  }
  if (
    type.includes("word") ||
    ["doc", "docx", "odt", "rtf"].includes(extension || "")
  ) {
    return "mdi:file-word-outline";
  }
  return "mdi:file-outline";
};
