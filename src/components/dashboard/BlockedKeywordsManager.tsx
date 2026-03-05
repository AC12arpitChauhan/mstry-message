"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, ShieldAlert } from "lucide-react";
import { useState } from "react";

interface BlockedKeywordsManagerProps {
  blockedKeywords: string[];
  isSaving: boolean;
  onSave: (keywords: string[]) => void;
}

const PRESET_KEYWORDS = ["spam", "scam", "hate", "abuse", "troll"];

export function BlockedKeywordsManager({
  blockedKeywords,
  isSaving,
  onSave,
}: BlockedKeywordsManagerProps) {
  const [newKeyword, setNewKeyword] = useState("");

  const handleAdd = () => {
    if (newKeyword.trim() && !blockedKeywords.includes(newKeyword.trim())) {
      const updated = [...blockedKeywords, newKeyword.trim()];
      onSave(updated);
      setNewKeyword("");
    }
  };

  const handleRemove = (word: string) => {
    const updated = blockedKeywords.filter((kw) => kw !== word);
    onSave(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="h-5 w-5 text-orange-400" />
        <h3 className="text-lg font-semibold text-white">Blocked Keywords</h3>
      </div>

      <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-6 mb-6">
        <h4 className="text-sm font-medium text-white mb-2">What does this do?</h4>
        <p className="text-sm text-neutral-400 leading-relaxed mb-4">
          Prevent specific words from appearing in anonymous messages. Messages containing these words will be automatically rejected.
        </p>
        <div className="flex flex-wrap gap-2">
           {PRESET_KEYWORDS.map(preset => (
             <button
               key={preset}
               onClick={() => {
                 if (!blockedKeywords.includes(preset)) {
                   onSave([...blockedKeywords, preset]);
                 }
               }}
               className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-neutral-800 text-neutral-500 hover:text-cyan-400 hover:bg-neutral-700 transition-colors"
             >
               + {preset}
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-neutral-300 mb-2">Add Custom Keyword</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="e.g. offensive_word"
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
          {blockedKeywords.map((kw, idx) => (
            <span
              key={idx}
              className="bg-neutral-800 text-neutral-300 text-xs px-2 py-1 rounded-full flex items-center gap-1.5 border border-neutral-700"
            >
              {kw}
              <button
                onClick={() => handleRemove(kw)}
                className="text-neutral-500 hover:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
          {blockedKeywords.length === 0 && (
            <p className="text-xs text-neutral-600 italic">No keywords blocked yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
