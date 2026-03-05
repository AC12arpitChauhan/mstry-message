/**
 * Migration Script: Embedded Messages → Standalone Message Collection
 * 
 * Run this script manually after deploying the new Message model.
 * Usage: npx tsx scripts/migrate-messages.ts
 * 
 * WARNING: Run against a database backup first. This is a destructive operation
 * that moves data from User.messages[] to the standalone Message collection.
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

// Load env from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Inline schemas to avoid Next.js module resolution issues
const MessageSchema = new mongoose.Schema(
  {
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ["unread", "read", "replied", "archived"], default: "read" },
    reply: { type: String, default: null },
    repliedAt: { type: Date, default: null },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  messages: [{ content: String, createdAt: Date }],
});

async function migrate() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found in environment");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected.\n");

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);

  // Find all users with embedded messages
  const users = await User.find({ "messages.0": { $exists: true } });
  console.log(`Found ${users.length} user(s) with embedded messages.\n`);

  let totalMigrated = 0;
  let totalErrors = 0;

  for (const user of users) {
    const messageCount = user.messages.length;
    console.log(`Migrating ${messageCount} messages for user: ${user.username} (${user._id})`);

    try {
      // Build bulk insert documents
      const messageDocs = user.messages.map((msg: any) => ({
        recipientId: user._id,
        content: msg.content,
        status: "read", // Existing messages are treated as read
        createdAt: msg.createdAt || new Date(),
        updatedAt: msg.createdAt || new Date(),
      }));

      // Bulk insert all messages for this user
      if (messageDocs.length > 0) {
        await Message.insertMany(messageDocs);
      }

      // Clear the embedded array
      user.messages = [];
      await user.save();

      totalMigrated += messageCount;
      console.log(`  ✓ Migrated ${messageCount} messages\n`);
    } catch (error) {
      totalErrors++;
      console.error(`  ✗ Error migrating user ${user.username}:`, error);
      console.log("  Skipping this user and continuing...\n");
    }
  }

  console.log("=== Migration Complete ===");
  console.log(`Total messages migrated: ${totalMigrated}`);
  console.log(`Total errors: ${totalErrors}`);

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
