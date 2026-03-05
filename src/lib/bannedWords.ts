/**
 * Global banned words list for content filtering.
 * Uses word-boundary matching to reduce false positives.
 */

const BANNED_WORDS: string[] = [
  // Severe slurs and hate speech
  "nigger",
  "nigga",
  "faggot",
  "retard",
  "kike",
  "spic",
  "chink",
  "wetback",
  "tranny",
  // Direct threats
  "kill yourself",
  "kys",
  "i will kill you",
  "die in a fire",
  // Sexual harassment
  "send nudes",
  "show me your",
  // Extreme profanity (keeping list conservative)
  "motherfucker",
];

/**
 * Check if message content contains any banned word.
 * Uses word-boundary regex to avoid false positives (e.g., "Scunthorpe").
 */
export function checkKeywordFilter(content: string): {
  blocked: boolean;
  reason?: string;
} {
  const lowerContent = content.toLowerCase();

  for (const word of BANNED_WORDS) {
    // For multi-word phrases, don't use word boundaries
    if (word.includes(" ")) {
      if (lowerContent.includes(word)) {
        return { blocked: true, reason: "Message contains inappropriate content." };
      }
    } else {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "i");
      if (regex.test(lowerContent)) {
        return { blocked: true, reason: "Message contains inappropriate content." };
      }
    }
  }

  return { blocked: false };
}
