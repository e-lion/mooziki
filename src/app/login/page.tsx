"use client";

import React from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Music, Users, Disc } from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = React.useState<'attendee' | 'dj'>('attendee');
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/${role}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black dark flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-zinc-950/50 to-blue-900/20 z-[0]" />
      
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-10 text-center shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Music className="w-8 h-8 text-purple-500" />
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mooziki
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Welcome to the Party</h1>
          <p className="text-zinc-400 mb-8">Sign in to request your favorite songs or manage your DJ booth.</p>

          <div className="flex p-1 bg-zinc-950 rounded-xl mb-8 border border-zinc-800">
            <button
              onClick={() => setRole('attendee')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                role === 'attendee' 
                  ? 'bg-zinc-800 text-white shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Users className="w-4 h-4" />
              I'm a Fan
            </button>
            <button
              onClick={() => setRole('dj')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                role === 'dj' 
                  ? 'bg-zinc-800 text-white shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Disc className="w-4 h-4" />
              I'm a DJ
            </button>
          </div>

          <Button 
            onClick={handleGoogleLogin} 
            className="w-full bg-white text-black hover:bg-gray-200 h-14 text-lg font-medium flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>

          <p className="mt-6 text-sm text-zinc-500">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
