/**
 * Computes SHA-256 hash of a File directly inside the browser
 * using the high-performance native Web Crypto API (SubtleCrypto).
 * Zero extra bundle weight, ultra-fast (< 5ms for images).
 */
export async function computeFileSha256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}
