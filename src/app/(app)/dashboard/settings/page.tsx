"use client";

import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { User } from "next-auth";
import { motion } from "motion/react";
import { ProfileShareCard } from "@/components/dashboard/ProfileShareCard";
import { 
  Settings, 
  User as UserIcon, 
  Link as LinkIcon, 
  ShieldCheck,
  Globe,
  Camera,
  LogOut
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();

  if (!session || !session.user) return null;

  const user = session.user as User;
  const username = user.username || "";
  const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : "";
  const profileUrl = `${baseUrl}/u/${username}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
           <Settings className="h-8 w-8 text-neutral-400" />
           <h1 className="text-4xl md:text-5xl font-bold text-white italic tracking-tighter">
             Settings
           </h1>
        </div>
        <p className="text-neutral-400 text-lg">
          Manage your account preferences and profile visibility
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Main Settings Column */}
         <div className="lg:col-span-8 space-y-8">
            {/* Profile Visibility section */}
            <div className="space-y-4">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-cyan-400" />
                  Profile Visibility
               </h2>
               <ProfileShareCard username={username} profileUrl={profileUrl} />
            </div>

            {/* Account Settings section */}
            <div className="space-y-4">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-purple-400" />
                  Account Details
               </h2>
               <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
                  <CardContent className="p-8 space-y-6">
                     <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center relative group">
                           <UserIcon className="h-8 w-8 text-neutral-600" />
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity cursor-pointer">
                              <Camera className="h-4 w-4 text-white" />
                           </div>
                        </div>
                        <div>
                           <p className="text-lg font-bold text-white">@{username}</p>
                           <p className="text-sm text-neutral-500">{session.user.email}</p>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-1.5">
                           <label className="text-[10px] uppercase font-bold text-neutral-600">Username</label>
                           <input 
                             type="text" 
                             disabled 
                             value={username} 
                             className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-400"
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[10px] uppercase font-bold text-neutral-600">Email Address</label>
                           <input 
                              type="text" 
                              disabled 
                              value={session.user.email || ""} 
                              className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-400"
                           />
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
            
            {/* Danger Zone */}
            <div className="pt-8 border-t border-neutral-900">
               <h2 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2 italic tracking-tighter">
                  Danger Zone
               </h2>
               <Card className="border-red-900/30 bg-red-950/10">
                  <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                     <div>
                        <h3 className="font-bold text-white">Sign Out of All Devices</h3>
                        <p className="text-sm text-neutral-500">Securely end your current session and require re-authentication.</p>
                     </div>
                     <Button 
                       variant="destructive" 
                       onClick={() => signOut({ callbackUrl: '/' })}
                       className="bg-red-500 hover:bg-red-600 text-white"
                     >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                     </Button>
                  </CardContent>
               </Card>
            </div>
         </div>

         {/* Info/Help Sidebar */}
         <div className="lg:col-span-4 space-y-6">
            <Card className="border-neutral-800 bg-neutral-900/10">
               <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                     <ShieldCheck className="h-4 w-4 text-cyan-400" />
                     Data Promise
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <p className="text-xs text-neutral-400 leading-relaxed">
                     True Feedback is committed to 100% digital anonymity. Your private data is encrypted and never shared with third parties.
                  </p>
                  <div className="h-px bg-neutral-800" />
                  <p className="text-[10px] text-neutral-600 font-bold uppercase">Compliance</p>
                  <div className="flex flex-wrap gap-2 text-[10px] text-neutral-500">
                     <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">GDPR</span>
                     <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">COPPA</span>
                     <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">ISO 27001</span>
                  </div>
               </CardContent>
            </Card>

            <div className="bg-neutral-900/20 rounded-2xl p-6 border border-neutral-800">
               <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-purple-400" />
                  Custom Domain?
               </h3>
               <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                 Own your brand with custom domains and personalized profile designs. Professional features coming soon!
               </p>
               <Button size="sm" variant="outline" className="text-[10px] h-8 border-neutral-700 text-neutral-400 hover:bg-neutral-800 w-full uppercase tracking-wider font-bold">
                  Join Waitlist
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
