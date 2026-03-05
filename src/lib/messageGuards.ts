import { createHash } from "crypto";
import RateLimitModel from "@/model/RateLimit";
import MessageModel from "@/model/Message";
import mongoose from "mongoose";

// ─── Types ──────────────────────────────────────────────

type GuardResult =
  | { allowed: true }
  | { allowed: false; status: number; message: string };

// ─── Rate Limiting ──────────────────────────────────────

const HOURLY_LIMIT = 50;
const DAILY_LIMIT = 200;

/**
 * Check IP-based rate limits using MongoDB TTL documents.
 * - Max 5 messages per IP per hour
 * - Max 20 messages per IP per day
 */
export async function checkRateLimit(ip: string): Promise<GuardResult> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [hourlyCount, dailyCount] = await Promise.all([
    RateLimitModel.countDocuments({
      ip,
      endpoint: "send-message",
      windowStart: { $gte: oneHourAgo },
    }),
    RateLimitModel.countDocuments({
      ip,
      endpoint: "send-message",
      windowStart: { $gte: oneDayAgo },
    }),
  ]);

  if (hourlyCount >= HOURLY_LIMIT) {
    return {
      allowed: false,
      status: 429,
      message: "Too many messages. Please try again later.",
    };
  }

  if (dailyCount >= DAILY_LIMIT) {
    return {
      allowed: false,
      status: 429,
      message: "Daily message limit reached. Please try again tomorrow.",
    };
  }

  // Record this request
  await RateLimitModel.create({
    ip,
    endpoint: "send-message",
    windowStart: now,
  });

  return { allowed: true };
}

// ─── Duplicate Detection ────────────────────────────────

/**
 * Generate SHA-256 hash of normalized message content.
 */
export function hashContent(content: string): string {
  return createHash("sha256")
    .update(content.trim().toLowerCase())
    .digest("hex");
}

/**
 * Check if an identical message was sent to the same recipient within the last hour.
 */
export async function checkDuplicateMessage(
  recipientId: mongoose.Types.ObjectId,
  content: string
): Promise<GuardResult> {
  const contentHash = hashContent(content);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const duplicate = await MessageModel.findOne({
    recipientId,
    contentHash,
    createdAt: { $gte: oneHourAgo },
  }).lean();

  if (duplicate) {
    return {
      allowed: false,
      status: 400,
      message: "This message has already been sent recently.",
    };
  }

  return { allowed: true };
}

// ─── Recipient Block List ───────────────────────────────

/**
 * Check if the sender IP or message content is blocked by the recipient.
 */
export function checkBlockList(
  user: { blockedIPs?: string[]; blockedKeywords?: string[] },
  ip: string,
  content: string
): GuardResult {
  // Check IP block
  if (user.blockedIPs && user.blockedIPs.includes(ip)) {
    return {
      allowed: false,
      status: 403,
      message: "Message could not be sent.",
    };
  }

  // Check keyword block (word-boundary matching)
  if (user.blockedKeywords && user.blockedKeywords.length > 0) {
    const lowerContent = content.toLowerCase();
    for (const keyword of user.blockedKeywords) {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "i");
      if (regex.test(lowerContent)) {
        return {
          allowed: false,
          status: 403,
          message: "Message could not be sent.",
        };
      }
    }
  }

  return { allowed: true };
}
