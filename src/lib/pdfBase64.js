export const MAX_FILE_MB = 50;

/** Strip the data-URL prefix if present, return raw base64 */
export function stripPrefix(str) {
  const comma = str.indexOf(',');
  return comma !== -1 ? str.slice(comma + 1) : str.trim();
}

/** Validate a base64 string (ignoring whitespace) */
export function isValidBase64(str) {
  const clean = str.replace(/\s/g, '');
  if (!clean) return false;
  try {
    return btoa(atob(clean)) === clean;
  } catch {
    return false;
  }
}

/** Format bytes → human readable */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/** Decode a raw (unprefixed) base64 PDF string and trigger a browser download */
export function downloadPdfFromBase64(base64Raw, filename = 'converted.pdf') {
  const binary = atob(base64Raw);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
