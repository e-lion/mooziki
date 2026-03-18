"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music, Menu, X, User, Disc } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface HeaderProps {
  user: {
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export function Header({ user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navLinks = [
    { name: "DJ Dashboard", href: "/dj" },
    { name: "My Profile", href: "/dj/profile" },
  ];

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "DJ";
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link href="/dj" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <Disc className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:block">
                Mooziki
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-zinc-800 text-white" 
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-full pl-2 pr-4 py-1.5">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-sm font-medium text-zinc-300">{displayName}</span>
            </div>
            
            <button 
              onClick={handleSignOut}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 text-zinc-400 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 pt-2 pb-6 space-y-1">
          <div className="flex items-center gap-3 px-3 py-4 mb-2 border-b border-zinc-800">
             {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-white">{displayName}</p>
                <p className="text-xs text-zinc-500">{user.email}</p>
              </div>
          </div>
          
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive 
                    ? "bg-zinc-900 text-white" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          <button 
            onClick={handleSignOut}
            className="w-full text-left mt-4 px-3 py-2.5 rounded-lg text-base font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
