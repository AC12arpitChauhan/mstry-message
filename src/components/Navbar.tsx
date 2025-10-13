"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-white hover:text-neutral-200 transition-colors">
            True Feedback
          </Link>
          
          {session ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-sm text-neutral-300">
                Welcome, <span className="text-white font-medium">{user?.username || user?.email}</span>
              </span>
              <Button
                onClick={() => signOut()}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-300"
                variant="outline"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/sign-in">
              <Button
                className="bg-white hover:bg-neutral-100 text-black border-0 transition-all duration-300"
                variant="default"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;