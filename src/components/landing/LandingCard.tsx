"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LandingCardProps {
  title: string;
  description: string;
  image: string;
  className?: string;
  span?: string;
}

export const LandingCard = ({ title, description, image, className, span }: LandingCardProps) => {
  return (
    <motion.div
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-[#0a0a0a] transition-all ",
        span,
        className
      )}
    >
      <div className="relative flex-1 w-full min-h-[240px] p-4 bg-neutral-900/20">
        <div className="relative h-full w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain transition-transform duration-700 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      </div>
      
      <div className="p-6 pt-2 bg-gradient-to-t from-black to-transparent">
        <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
          {title}
        </h3>
        <p className="mt-1 text-xs text-neutral-500 leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </motion.div>
  );
};
