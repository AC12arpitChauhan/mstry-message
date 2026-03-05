"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar - fixed on desktop */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen md:ml-64 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 py-32 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
