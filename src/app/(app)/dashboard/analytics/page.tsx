"use client";

import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { motion } from "motion/react";
import { AnalyticsSummary } from "@/components/dashboard/AnalyticsSummary";
import { ModerationMetrics } from "@/components/dashboard/ModerationMetrics";
import { 
  BarChart2, 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  ShieldCheck, 
  Clock,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  const [profileViews, setProfileViews] = useState<number | null>(null);
  const [totalMessages, setTotalMessages] = useState<number>(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [metrics, setMetrics] = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();
  const { toast } = useToast();

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
      toast({
        title: "Error",
        description: "Failed to load analytics data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAnalytics();
  }, [session, fetchAnalytics]);

  if (!session || !session.user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 italic tracking-tighter">
          Analytics
        </h1>
        <p className="text-neutral-400 text-lg">
          In-depth insights into your profile performance
        </p>
      </motion.div>

      {/* Basic Metrics Summary */}
      <AnalyticsSummary
        totalMessages={totalMessages}
        hasMore={false}
        acceptMessages={true} // Hardcoded for this view summary
        profileViews={profileViews}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Traffic & Reach card */}
         <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-neutral-800 pb-4">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                    Reach & Traffic
                  </CardTitle>
                  <Eye className="h-4 w-4 text-neutral-600" />
               </div>
            </CardHeader>
            <CardContent className="p-8">
               <div className="space-y-6">
                  <div>
                     <p className="text-sm text-neutral-400 mb-1">Total Profile Views</p>
                     <div className="flex items-end gap-3">
                        <p className="text-4xl font-bold text-white">{profileViews ?? 0}</p>
                        <span className="text-xs text-green-500 mb-1 flex items-center gap-0.5">
                           <ArrowUpRight className="h-3 w-3" />
                           All time
                        </span>
                     </div>
                  </div>
                  
                  <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                     <div className="h-full bg-cyan-500 w-[60%]" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                        <p className="text-[10px] uppercase font-bold text-neutral-600 mb-1">Engagement Rate</p>
                        <p className="text-lg font-bold text-white">4.2%</p>
                     </div>
                     <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                        <p className="text-[10px] uppercase font-bold text-neutral-600 mb-1">Conv. Rate</p>
                        <p className="text-lg font-bold text-white">{profileViews ? ((totalMessages / profileViews) * 100).toFixed(1) : 0}%</p>
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Messages analysis card */}
         <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-neutral-800 pb-4">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-purple-400" />
                    Message Insights
                  </CardTitle>
                  <Clock className="h-4 w-4 text-neutral-600" />
               </div>
            </CardHeader>
            <CardContent className="p-8">
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-neutral-400 mb-1">Total Received</p>
                        <p className="text-4xl font-bold text-white">{totalMessages}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-sm text-neutral-400 mb-1">Unread Density</p>
                        <p className="text-xl font-bold text-cyan-400">{totalMessages ? Math.round((unreadCount / totalMessages) * 100) : 0}%</p>
                     </div>
                  </div>

                  <div className="space-y-3 pt-4">
                     <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500">Read</span>
                        <span className="text-white">{totalMessages - unreadCount}</span>
                     </div>
                     <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 transition-all duration-1000" 
                          style={{ width: `${totalMessages ? ((totalMessages - unreadCount) / totalMessages) * 100 : 0}%` }} 
                        />
                     </div>
                     
                     <div className="flex items-center justify-between text-xs pt-2">
                        <span className="text-neutral-500">Unread</span>
                        <span className="text-white">{unreadCount}</span>
                     </div>
                     <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                        <div 
                           className="h-full bg-cyan-400 transition-all duration-1000" 
                           style={{ width: `${totalMessages ? (unreadCount / totalMessages) * 100 : 0}%` }} 
                        />
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>

      <div className="space-y-6">
         <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-orange-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Moderation Efficiency</h2>
         </div>
         
         <ModerationMetrics metrics={metrics} />
         
         <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-6">
             <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-2">
                   <h3 className="text-lg font-bold text-white">Automated Protection Score</h3>
                   <p className="text-sm text-neutral-400">
                      Based on your keywords and IP blocklists, our system has successfully prevented unauthorized or harmful content from reaching your inbox.
                   </p>
                </div>
                <div className="h-24 w-24 rounded-full border-8 border-cyan-500/10 flex items-center justify-center relative">
                   <div 
                     className="absolute inset-0 rounded-full border-8 border-cyan-400 border-t-transparent -rotate-45"
                   />
                   <span className="text-xl font-bold text-white">92%</span>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
}
