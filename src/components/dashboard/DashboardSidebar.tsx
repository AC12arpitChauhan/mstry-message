"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  BarChart2,
  ShieldAlert,
  ShieldX,
  Type,
  Settings,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Inbox, label: "Inbox", href: "/dashboard/inbox" },
  { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics" },
  { icon: ShieldAlert, label: "Moderation", href: "/dashboard/moderation" },
  { icon: ShieldX, label: "Blocked Senders", href: "/dashboard/blocked-ips" },
  { icon: Type, label: "Blocked Keywords", href: "/dashboard/blocked-keywords" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 md:hidden p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 transition-colors"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 pt-20 transition-transform bg-[#0a0a0a] border-r border-neutral-900 md:translate-x-0 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-4 py-6 space-y-6">
          <div className="px-2">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-bold mb-4">
              Dashboard
            </h2>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? "text-cyan-400" : "text-neutral-500 group-hover:text-white"
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto px-4 pt-6 mt-10 border-t border-neutral-900">
             <div className="bg-neutral-900/50 rounded-2xl p-4 border border-neutral-800">
               <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-2">Help & Support</p>
               <Link href="/" className="text-xs text-neutral-300 hover:text-cyan-400 flex items-center gap-2 group">
                 <ChevronLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
                 Back to site
               </Link>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
}
