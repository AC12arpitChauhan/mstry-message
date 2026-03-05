import mongoose, { Schema, Document } from "mongoose";

export interface IRateLimit extends Document {
  ip: string;
  endpoint: string;
  count: number;
  windowStart: Date;
}

const RateLimitSchema: Schema<IRateLimit> = new Schema({
  ip: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 1,
  },
  windowStart: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Compound index for fast lookups
RateLimitSchema.index({ ip: 1, endpoint: 1, windowStart: 1 });

// TTL: auto-delete documents 24 hours after windowStart
RateLimitSchema.index({ windowStart: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

const RateLimitModel =
  (mongoose.models.RateLimit as mongoose.Model<IRateLimit>) ||
  mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);

export default RateLimitModel;
