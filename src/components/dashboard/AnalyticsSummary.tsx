"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, AlertCircle, Share2 } from "lucide-react";
import { motion } from "motion/react";

interface AnalyticsSummaryProps {
  totalMessages: number;
  hasMore: boolean;
  acceptMessages: boolean;
  profileViews: number | null;
}

export function AnalyticsSummary({
  totalMessages,
  hasMore,
  acceptMessages,
  profileViews,
}: AnalyticsSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
    >
      <Card className="border-neutral-800 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Total Messages</p>
              <p className="text-3xl font-bold text-white">
                {totalMessages}
                {hasMore && "+"}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Profile Status</p>
              <p className="text-3xl font-bold text-white">
                {acceptMessages ? "Active" : "Inactive"}
              </p>
            </div>
            <div
              className={`h-12 w-12 rounded-full ${
                acceptMessages ? "bg-green-500/20" : "bg-red-500/20"
              } flex items-center justify-center`}
            >
              <AlertCircle
                className={`h-6 w-6 ${
                  acceptMessages ? "text-green-400" : "text-red-400"
                }`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-gradient-to-br from-orange-500/10 to-yellow-500/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Profile Views</p>
              <p className="text-3xl font-bold text-white">
                {profileViews !== null ? profileViews : "--"}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Share2 className="h-6 w-6 text-orange-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
