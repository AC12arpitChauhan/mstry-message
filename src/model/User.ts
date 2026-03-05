import mongoose, { Schema, Document } from "mongoose";


export interface Message extends Document {
  _id: string;
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password?: string;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
  profilePicture?: string;
  bio?: string;
  themeColor?: string;
  blockedKeywords?: string[];
  blockedIPs?: string[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email"],
  },
  password: {
    type: String,
    required: false
  },
  verifyCode: {
    type: String,
    required: false
  },
  verifyCodeExpiry: {
    type: Date,
    required: false
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [messageSchema],
  profilePicture: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    maxlength: 200,
    default: null,
  },
  themeColor: {
    type: String,
    default: "#06b6d4",
  },
  blockedKeywords: {
    type: [String],
    default: [],
  },
  blockedIPs: {
    type: [String],
    default: [],
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
