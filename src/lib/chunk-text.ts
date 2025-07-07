// lib/chunk-text.ts
import { encode, decode } from 'gpt-3-encoder'

/**
 * Split large text into chunks based on token length.
 * @param text Full input text (e.g. from PDF)
 * @param chunkSize Max tokens per chunk (default 500)
 * @param overlap Tokens to overlap between chunks (default 50)
 */
export function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];

  let start = 0;

  while (start < words.length) {
    let end = start;
    let tokenCount = 0;

    // Build chunk until max token count
    while (end < words.length && tokenCount < chunkSize) {
      const slice = words.slice(start, end + 1).join(' ');
      tokenCount = encode(slice).length;

      if (tokenCount <= chunkSize) {
        end++;
      } else {
        break;
      }
    }

    const chunk = words.slice(start, end).join(' ');
    chunks.push(chunk);

    // Move forward with overlap
    start = end - overlap;
    if (start < 0) start = 0;
  }

  return chunks;
}
