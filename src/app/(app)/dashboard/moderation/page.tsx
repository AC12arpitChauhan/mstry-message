"use client";

import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { motion } from "motion/react";
import { ModerationConfig } from "@/components/dashboard/ModerationConfig";
import { 
  ShieldCheck, 
  MessageCircleOff, 
  Settings2, 
  Clock, 
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { apiResponse } from "@/types/apiResponse";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ModerationPage() {
  const [acceptMessages, setAcceptMessages] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  
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

  const handleSwitchChange = async () => {
    const newValue = !acceptMessages;
    setIsSwitchLoading(true);
    try {
      setAcceptMessages(newValue);
      const response = await axios.post<apiResponse>("/api/accept-messages", {
        acceptMessages: newValue,
      });
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      setAcceptMessages(!newValue); // Rollback
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages]);

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
          Moderation
        </h1>
        <p className="text-neutral-400 text-lg">
          Control who can reach you and how messages are filtered
        </p>
      </motion.div>

      {/* Main Control */}
      <ModerationConfig 
        acceptMessages={acceptMessages}
        isSwitchLoading={isSwitchLoading}
        onSwitchChange={handleSwitchChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Explanation Card 1 */}
         <Card className="border-neutral-800 bg-neutral-900/10 backdrop-blur-sm p-6 space-y-4">
            <div className="h-10 w-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
               <ShieldCheck className="h-5 w-5 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white">What does "Accept Messages" do?</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
               When enabled, your public profile is active and visitors can send you anonymous messages. If disabled, your profile will show a "Not Accepting Messages" status and the send button will be hidden.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-neutral-500">
               <Clock className="h-3 w-3" />
               Changes take effect instantly
            </div>
         </Card>

         {/* Explanation Card 2 */}
         <Card className="border-neutral-800 bg-neutral-900/10 backdrop-blur-sm p-6 space-y-4">
            <div className="h-10 w-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
               <Settings2 className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Automated Filtering</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
               Beyond the master toggle, True Feedback automatically runs every message through your custom filters. We block known spam patterns, your custom keywords, and repeated messages from blocked IPs.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-neutral-500">
               <ShieldAlert className="h-3 w-3" />
               Secure & AI-driven moderation
            </div>
         </Card>
      </div>

      {/* Advanced Moderation Links */}
      <div className="bg-neutral-950/50 border border-neutral-800 rounded-3xl p-8">
         <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="flex-1 space-y-2">
               <h3 className="text-2xl font-bold text-white italic tracking-tighter">Advanced Controls</h3>
               <p className="text-neutral-500 text-sm">
                 Fine-tune your inbox protection by blocking specific keywords or problematic IP addresses. 
               </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
               <Link href="/dashboard/blocked-keywords">
                  <Button variant="secondary" className="w-full bg-neutral-900 text-white border border-neutral-800 hover:bg-neutral-800">
                     Blocked Keywords
                     <ArrowRight className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
               </Link>
               <Link href="/dashboard/blocked-ips">
                  <Button variant="secondary" className="w-full bg-neutral-900 text-white border border-neutral-800 hover:bg-neutral-800">
                     Blocked Senders
                     <ArrowRight className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
