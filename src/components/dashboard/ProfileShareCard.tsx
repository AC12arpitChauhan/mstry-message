"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Copy, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "motion/react";

interface ProfileShareCardProps {
  username: string;
  profileUrl: string;
}

export function ProfileShareCard({ username, profileUrl }: ProfileShareCardProps) {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">
              Share Your Profile
            </h2>
          </div>
          <p className="text-sm text-neutral-400 mt-2">
            Share this link to receive anonymous messages
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white pr-24 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-xs text-cyan-400">
                @{username}
              </div>
            </div>
            <Button
              onClick={copyToClipboard}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
