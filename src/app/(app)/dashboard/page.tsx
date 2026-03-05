"use client";

import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { User } from "next-auth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "motion/react";
import { AnalyticsSummary } from "@/components/dashboard/AnalyticsSummary";
import { ModerationMetrics } from "@/components/dashboard/ModerationMetrics";
import { ProfileShareCard } from "@/components/dashboard/ProfileShareCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Inbox, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalMessages, setTotalMessages] = useState<number>(0);
  const [profileViews, setProfileViews] = useState<number | null>(null);
  const [acceptMessages, setAcceptMessages] = useState(false);
  const [metrics, setMetrics] = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();
  const { toast } = useToast();

  const fetchAcceptMessages = useCallback(async () => {
     try {
       const response = await axios.get("/api/accept-messages");
       setAcceptMessages(response.data.isAcceptingMessages);
     } catch {
       // Silently fail
     }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await axios.get("/api/analytics");
      const data = response.data.data;
      setProfileViews(data.views.total);
      setUnreadCount(data.messages.unread);
      setTotalMessages(data.messages.total);
      if (data.moderation) {
        setMetrics(data.moderation);
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessages();
    fetchAnalytics();
  }, [session, fetchAcceptMessages, fetchAnalytics]);

  if (!session || !session.user) {
    return null;
  }

  const user = session.user as User;
  const username = user.username || "";
  const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : "";
  const profileUrl = `${baseUrl}/u/${username}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 italic tracking-tighter">
          Dashboard
        </h1>
        <p className="text-neutral-400 text-lg">
          Welcome back, <span className="text-cyan-400 font-semibold">@{username}</span>
        </p>
      </motion.div>

      {/* Main Stats */}
      <AnalyticsSummary
        totalMessages={totalMessages}
        hasMore={false}
        acceptMessages={acceptMessages}
        profileViews={profileViews}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Quick Actions / Share */}
          <ProfileShareCard username={username} profileUrl={profileUrl} />
          
          <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Link href="/dashboard/inbox">
                 <Button className="w-full justify-between bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800">
                    <span className="flex items-center gap-2">
                       <Inbox className="h-4 w-4 text-cyan-400" />
                       Go to Inbox
                    </span>
                    <ArrowRight className="h-4 w-4 opacity-50" />
                 </Button>
               </Link>
               <Link href="/dashboard/moderation">
                 <Button className="w-full justify-between bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800">
                    <span className="flex items-center gap-2">
                       <ShieldCheck className="h-4 w-4 text-purple-400" />
                       Moderation
                    </span>
                    <ArrowRight className="h-4 w-4 opacity-50" />
                 </Button>
               </Link>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Moderation Stats</h2>
            {unreadCount > 0 && (
              <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <ModerationMetrics metrics={metrics} />
          
          <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 h-full flex items-center justify-center opacity-10 group-hover:scale-125 transition-transform">
                <ShieldCheck className="h-32 w-32 text-cyan-500" />
             </div>
             <h3 className="text-lg font-bold text-white mb-2 relative z-10">Your inbox is {acceptMessages ? "active" : "inactive"}</h3>
             <p className="text-sm text-neutral-400 mb-6 max-w-xs relative z-10">
               {acceptMessages 
                ? "People can currently send you anonymous messages. You'll be notified of any new feedback!"
                : "You are currently not accepting new messages. Toggle this setting in Moderation if you change your mind."
               }
             </p>
             <Link href="/dashboard/moderation">
                <Button size="sm" variant="outline" className="text-xs border-neutral-700 text-neutral-300 hover:bg-neutral-800 relative z-10">
                   Manage Status
                </Button>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}