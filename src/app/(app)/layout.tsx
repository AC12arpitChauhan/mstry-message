'use client';
import Navbar from '@/components/Navbar';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { FloatingNav } from '@/components/ui/floating-navbar';
import { Spotlight } from '@/components/ui/spotlight-new';
import { IconHome, IconMessage, IconUser } from '@tabler/icons-react';
// import {
//   Navbar,
//   NavBody,
//   NavItems,
//   MobileNav,
//   NavbarLogo,
//   NavbarButton,
//   MobileNavHeader,
//   MobileNavToggle,
//   MobileNavMenu,
// } from "@/components/ui/resizable-navbar";
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

interface RootLayoutProps {
  children: React.ReactNode;
}
 const navItems = [
    {
      name: "",
      link: "/",
    }
  ];
 


export default function RootLayout({ children }: RootLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* <Spotlight /> */}


      {children}
      
    </div>
  );
}