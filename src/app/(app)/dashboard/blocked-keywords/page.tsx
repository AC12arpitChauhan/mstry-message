"use client";

import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { motion } from "motion/react";
import { BlockedKeywordsManager } from "@/components/dashboard/BlockedKeywordsManager";
import { 
  Type, 
  Search, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function BlockedKeywordsPage() {
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

  const saveBlockSettings = async (keywords: string[]) => {
    setIsSaving(true);
    setBlockedKeywords(keywords);
    try {
      await axios.post("/api/update-block-settings", {
        blockedKeywords: keywords,
        blockedIPs,
      });
      toast({
        title: "Settings Saved",
        description: "Your blocked keywords have been updated.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update keyword blocklist.",
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
           <Type className="h-8 w-8 text-cyan-400" />
           <h1 className="text-4xl md:text-5xl font-bold text-white italic tracking-tighter">
             Blocked Keywords
           </h1>
        </div>
        <p className="text-neutral-400 text-lg">
          Filter out offensive or unwanted messages automatically
        </p>
      </motion.div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Sidebar/Info Section */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-8 sticky top-32 group overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform">
                  <Sparkles className="h-32 w-32 text-cyan-500" />
               </div>
               
               <div className="flex items-center gap-2 mb-4 relative z-10">
                  <HelpCircle className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">How it works</h3>
               </div>
               
               <ul className="space-y-4 relative z-10">
                  <li className="flex gap-3">
                     <div className="h-5 w-5 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-cyan-400">01</span>
                     </div>
                     <p className="text-xs text-neutral-400 leading-relaxed pt-0.5">
                       Add words you never want to see in your inbox.
                     </p>
                  </li>
                  <li className="flex gap-3">
                     <div className="h-5 w-5 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-cyan-400">02</span>
                     </div>
                     <p className="text-xs text-neutral-400 leading-relaxed pt-0.5">
                        Our engine checks every incoming message against your blocklist.
                     </p>
                  </li>
                  <li className="flex gap-3">
                     <div className="h-5 w-5 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-cyan-400">03</span>
                     </div>
                     <p className="text-xs text-neutral-400 leading-relaxed pt-0.5">
                        Messages containing blocked words are automatically rejected—no notification, no stress.
                     </p>
                  </li>
               </ul>

               <div className="mt-8 pt-6 border-t border-neutral-800 relative z-10">
                  <p className="text-[10px] font-bold text-neutral-600 uppercase mb-2">PRO TIP</p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                     Start with our **spam** and **troll** presets to immediately clean up your feedback.
                  </p>
               </div>
            </div>
         </div>

         {/* Manager Section */}
         <div className="lg:col-span-8">
            <BlockedKeywordsManager 
              blockedKeywords={blockedKeywords}
              isSaving={isSaving}
              onSave={saveBlockSettings}
            />
         </div>
      </div>
    </div>
  );
}
