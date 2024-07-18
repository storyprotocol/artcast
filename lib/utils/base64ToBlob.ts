export function base64ToBlob(base64: any, mimeType: any) {
  // Decode Base64 string
  const byteCharacters = atob(base64);

  // Create an array of byte values
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  // Convert to a binary representation
  const byteArray = new Uint8Array(byteNumbers);

  // Create and return a Blob with the binary data and MIME type
  return new Blob([byteArray], { type: mimeType });
}
