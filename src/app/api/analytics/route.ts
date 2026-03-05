import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import ProfileViewModel from "@/model/ProfileView";
import MessageModel from "@/model/Message";
import MetricModel from "@/model/Metric";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const userId = new mongoose.Types.ObjectId(session.user._id!.toString());
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Profile view counts
    const [totalViews, recentViews7d, recentViews30d] = await Promise.all([
      ProfileViewModel.countDocuments({ userId }),
      ProfileViewModel.countDocuments({
        userId,
        createdAt: { $gte: sevenDaysAgo },
      }),
      ProfileViewModel.countDocuments({
        userId,
        createdAt: { $gte: thirtyDaysAgo },
      }),
    ]);

    // Messages per day for the last 7 days
    const messagesByDay = await MessageModel.aggregate([
      {
        $match: {
          recipientId: userId,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Total message counts by status
    const [totalMessages, unreadMessages, repliedMessages] = await Promise.all([
      MessageModel.countDocuments({
        recipientId: userId,
        status: { $ne: "archived" },
      }),
      MessageModel.countDocuments({ recipientId: userId, status: "unread" }),
      MessageModel.countDocuments({ recipientId: userId, status: "replied" }),
    ]);

    // Average message length
    const avgLengthResult = await MessageModel.aggregate([
      { $match: { recipientId: userId } },
      {
        $group: {
          _id: null,
          avgLength: { $avg: { $strLenCP: "$content" } },
        },
      },
    ]);
    const averageMessageLength = avgLengthResult[0]?.avgLength
      ? Math.round(avgLengthResult[0].avgLength)
      : 0;

    // Moderation metrics for the last 7 days (Stage 6)
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];
    const moderationEvents = await MetricModel.aggregate([
      {
        $match: {
          event: {
            $in: [
              "message_sent",
              "rate_limited",
              "duplicate_blocked",
              "keyword_blocked",
              "blocklist_blocked",
            ],
          },
          date: { $gte: sevenDaysAgoStr },
        },
      },
      {
        $group: {
          _id: "$event",
          total: { $sum: "$count" },
        },
      },
    ]);

    const moderation: Record<string, number> = {
      message_sent: 0,
      rate_limited: 0,
      duplicate_blocked: 0,
      keyword_blocked: 0,
      blocklist_blocked: 0,
    };
    for (const entry of moderationEvents) {
      moderation[entry._id] = entry.total;
    }

    return Response.json(
      {
        success: true,
        data: {
          views: {
            total: totalViews,
            last7Days: recentViews7d,
            last30Days: recentViews30d,
          },
          messages: {
            total: totalMessages,
            unread: unreadMessages,
            replied: repliedMessages,
            averageLength: averageMessageLength,
            byDay: messagesByDay,
          },
          moderation,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return Response.json(
      { success: false, message: "Error fetching analytics" },
      { status: 500 }
    );
  }
}
