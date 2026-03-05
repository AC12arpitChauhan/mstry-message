"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface ModerationConfigProps {
  acceptMessages: boolean;
  isSwitchLoading: boolean;
  onSwitchChange: () => void;
}

export function ModerationConfig({
  acceptMessages,
  isSwitchLoading,
  onSwitchChange,
}: ModerationConfigProps) {
  return (
    <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              Accept Messages
            </h3>
            <p className="text-sm text-neutral-400">
              Allow others to send you anonymous messages
            </p>
          </div>
          <div className="flex items-center gap-4">
            {isSwitchLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
            )}
            <div className="flex items-center gap-3">
              <Switch
                checked={acceptMessages}
                onCheckedChange={onSwitchChange}
                disabled={isSwitchLoading}
                className="data-[state=checked]:bg-cyan-500"
              />
              <span
                className={`text-sm font-medium ${
                  acceptMessages ? "text-cyan-400" : "text-neutral-500"
                }`}
              >
                {acceptMessages ? "On" : "Off"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
