export * from "./nocom";

export function downloadFileBase64(base64, mimeType, name) {
  const tagA = document.createElement("a");

  tagA.href = `data:${mimeType};base64,${base64}`;
  tagA.download = name || "file.xls";
  tagA.click();
}
