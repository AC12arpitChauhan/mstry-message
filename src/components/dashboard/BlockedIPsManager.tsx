"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, ShieldX } from "lucide-react";
import { useState } from "react";

interface BlockedIPsManagerProps {
  blockedIPs: string[];
  isSaving: boolean;
  onSave: (ips: string[]) => void;
}

export function BlockedIPsManager({
  blockedIPs,
  isSaving,
  onSave,
}: BlockedIPsManagerProps) {
  const [newIP, setNewIP] = useState("");

  const handleAdd = () => {
    if (newIP.trim() && !blockedIPs.includes(newIP.trim())) {
      const updated = [...blockedIPs, newIP.trim()];
      onSave(updated);
      setNewIP("");
    }
  };

  const handleRemove = (ip: string) => {
    const updated = blockedIPs.filter((i) => i !== ip);
    onSave(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldX className="h-5 w-5 text-red-500" />
        <h3 className="text-lg font-semibold text-white">Blocked Senders (IP)</h3>
      </div>

      <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-6 mb-6">
        <h4 className="text-sm font-medium text-white mb-2">What does this do?</h4>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Prevent specific IP addresses from sending you messages. This is useful for stopping repeated spam or harassment from the same source.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-neutral-300 mb-2">Add IP to Blocklist</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newIP}
              onChange={(e) => setNewIP(e.target.value)}
              placeholder="e.g. 192.168.1.1"
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
            />
            <Button size="sm" onClick={handleAdd} disabled={isSaving}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {blockedIPs.map((ip, idx) => (
            <span
              key={idx}
              className="bg-neutral-800 text-neutral-300 text-xs px-2 py-1 rounded-full flex items-center gap-1.5 border border-neutral-700"
            >
              {ip}
              <button
                onClick={() => handleRemove(ip)}
                className="text-neutral-500 hover:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
          {blockedIPs.length === 0 && (
            <p className="text-xs text-neutral-600 italic">No IP addresses blocked yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
