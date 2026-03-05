import mongoose, { Schema, Document } from "mongoose";

export interface IProfileView extends Document {
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ProfileViewSchema: Schema<IProfileView> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// TTL index: auto-delete views older than 90 days
ProfileViewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const ProfileViewModel =
  (mongoose.models.ProfileView as mongoose.Model<IProfileView>) ||
  mongoose.model<IProfileView>("ProfileView", ProfileViewSchema);

export default ProfileViewModel;
