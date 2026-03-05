"use client";

import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { motion } from "motion/react";
import { BlockedIPsManager } from "@/components/dashboard/BlockedIPsManager";
import { 
  ShieldX, 
  Search, 
  HelpCircle,
  AlertTriangle,
} from "lucide-react";

export default function BlockedIPsPage() {
  const [blockedKeywords, setBlockedKeywords] = useState<string[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: session } = useSession();
  const { toast } = useToast();

  const fetchBlockSettings = useCallback(async () => {
    try {
      const response = await axios.get("/api/update-block-settings");
      if (response.data.success) {
        setBlockedKeywords(response.data.data.blockedKeywords || []);
        setBlockedIPs(response.data.data.blockedIPs || []);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load block settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const saveBlockSettings = async (ips: string[]) => {
    setIsSaving(true);
    setBlockedIPs(ips);
    try {
      await axios.post("/api/update-block-settings", {
        blockedKeywords,
        blockedIPs: ips,
      });
      toast({
        title: "Settings Saved",
        description: "Your blocked IP list has been updated.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update IP blocklist.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!session || !session.user) return;
    fetchBlockSettings();
  }, [session, fetchBlockSettings]);

  if (!session || !session.user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
           <ShieldX className="h-8 w-8 text-red-500" />
           <h1 className="text-4xl md:text-5xl font-bold text-white italic tracking-tighter">
             Blocked Senders
           </h1>
        </div>
        <p className="text-neutral-400 text-lg">
          Manage and restrict access from problematic sources
        </p>
      </motion.div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Sidebar/Info Section */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-8 sticky top-32">
               <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Guide</h3>
               </div>
               
               <ul className="space-y-4">
                  <li className="flex gap-3">
                     <div className="h-5 w-5 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-cyan-400">01</span>
                     </div>
                     <p className="text-xs text-neutral-400 leading-relaxed pt-0.5">
                       Identify IPs from your messages to stop specific bad actors.
                     </p>
                  </li>
                  <li className="flex gap-3">
                     <div className="h-5 w-5 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-cyan-400">02</span>
                     </div>
                     <p className="text-xs text-neutral-400 leading-relaxed pt-0.5">
                       New messages from these IPs will be rejected automatically before reaching your inbox.
                     </p>
                  </li>
                  <li className="flex gap-3 text-red-400/80 bg-red-950/20 border border-red-500/20 rounded-xl p-3 mt-4">
                     <AlertTriangle className="h-4 w-4 shrink-0" />
                     <p className="text-[10px] font-medium leading-relaxed">
                       Be careful not to block valid dynamic IP ranges that might affect other legitimate users.
                     </p>
                  </li>
               </ul>
            </div>
         </div>

         {/* Manager Section */}
         <div className="lg:col-span-8">
            <BlockedIPsManager 
              blockedIPs={blockedIPs}
              isSaving={isSaving}
              onSave={saveBlockSettings}
            />
         </div>
      </div>
    </div>
  );
}
