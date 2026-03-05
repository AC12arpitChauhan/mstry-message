"use client";

import { motion } from "motion/react";

interface ModerationMetricsProps {
  metrics: Record<string, number> | null;
}

export function ModerationMetrics({ metrics }: ModerationMetricsProps) {
  if (!metrics) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Rate Limited</p>
        <p className="text-xl font-bold text-white">{metrics.rate_limited || 0}</p>
      </div>
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Keywords Filtered</p>
        <p className="text-xl font-bold text-white">{metrics.keyword_blocked || 0}</p>
      </div>
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Personal Blocks</p>
        <p className="text-xl font-bold text-white">{metrics.blocklist_blocked || 0}</p>
      </div>
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Duplicates</p>
        <p className="text-xl font-bold text-white">{metrics.duplicate_blocked || 0}</p>
      </div>
    </motion.div>
  );
}
