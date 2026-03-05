import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  _id: string;
  recipientId: mongoose.Types.ObjectId;
  content: string;
  contentHash?: string;
  status: "unread" | "read" | "replied" | "archived";
  reply?: string;
  repliedAt?: Date;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    contentHash: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied", "archived"],
      default: "unread",
    },
    reply: {
      type: String,
      default: null,
    },
    repliedAt: {
      type: Date,
      default: null,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient cursor pagination
MessageSchema.index({ recipientId: 1, createdAt: -1 });

// Index for duplicate detection
MessageSchema.index({ recipientId: 1, contentHash: 1 });

// Text index for message search
MessageSchema.index({ content: "text" });

const MessageModel =
  (mongoose.models.Message as mongoose.Model<IMessage>) ||
  mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;
