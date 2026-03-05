import mongoose, { Schema, Document } from "mongoose";

export interface IMetric extends Document {
  event: string;
  date: string; // YYYY-MM-DD format
  count: number;
}

const MetricSchema: Schema<IMetric> = new Schema({
  event: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

// Compound unique index: one document per event per day
MetricSchema.index({ event: 1, date: 1 }, { unique: true });

/**
 * Increment a metric event for today. Uses upsert to create if it doesn't exist.
 * Fire-and-forget — errors are silently caught.
 */
export async function incrementEvent(event: string): Promise<void> {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    await MetricModel.updateOne(
      { event, date: today },
      { $inc: { count: 1 } },
      { upsert: true }
    );
  } catch {
    // Fire-and-forget: never block the request pipeline
  }
}

const MetricModel =
  (mongoose.models.Metric as mongoose.Model<IMetric>) ||
  mongoose.model<IMetric>("Metric", MetricSchema);

export default MetricModel;
