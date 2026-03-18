"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Disc, Loader2, ArrowRight, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VenueGuardProps {
  children: React.ReactNode;
}

export function VenueGuard({ children }: VenueGuardProps) {
  const [venueCode, setVenueCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVenue, setCurrentVenue] = useState<{code: string; djId: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Check localStorage on mount
    const saved = localStorage.getItem("mooziki_venue");
    if (saved) {
      try {
        setCurrentVenue(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("mooziki_venue");
      }
    }
    setIsLoading(false);
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueCode.trim()) return;

    setIsJoining(true);
    setError(null);

    const normalizedCode = venueCode.toUpperCase().trim();
    
    // Fetch specifically by the code using ilike for case-insensitivity
    const { data: usersFound, error: fetchError } = await (supabase
      .from("users")
      .select("id, name, venue_code")
      .ilike("venue_code", normalizedCode)
      .eq("role", "dj") as unknown as Promise<{ data: any[] | null; error: any }>);

    if (fetchError || !usersFound || usersFound.length === 0) {
      console.error("Venue search error or no user found:", fetchError);
      setError(`Invalid Venue Code "${normalizedCode}". Please check with your DJ. Codes are usually like 'NAME-123'`);
      setIsJoining(false);
      return;
    }

    const data = usersFound[0];

    const venueData = {
      code: data.venue_code as string,
      djId: data.id,
      djName: data.name
    };

    localStorage.setItem("mooziki_venue", JSON.stringify(venueData));
    setCurrentVenue(venueData);
    setIsJoining(false);
  };

  const handleLeave = () => {
    localStorage.removeItem("mooziki_venue");
    setCurrentVenue(null);
    setVenueCode("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!currentVenue) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Disc className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Join a Venue</h2>
          <p className="text-zinc-400 mb-8">Enter the code displayed at the DJ booth to start requesting songs.</p>

          <form onSubmit={handleJoin} className="space-y-4 text-left">
            <div>
              <label htmlFor="venue-code" className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Venue Code
              </label>
              <input
                id="venue-code"
                type="text"
                value={venueCode}
                onChange={(e) => setVenueCode(e.target.value)}
                placeholder="E.g. ROCK-123"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500 transition-colors"
                autoFocus
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <Button 
              type="submit" 
              disabled={isJoining || !venueCode}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl text-base font-medium flex items-center justify-center gap-2"
            >
              {isJoining ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Connect to DJ <ArrowRight className="w-5 h-5" /></>
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Inject currentVenue into children if they support it, or use context. 
  // For simplicity, we'll clone children and pass djId if it's a specific component, 
  // but better to wrap the whole app in a Context.
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-500/10 border border-blue-500/20 px-6 py-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Music className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Connected to Venue</p>
            <p className="text-lg font-bold text-white tracking-widest">{currentVenue.code}</p>
          </div>
        </div>
        <button 
          onClick={handleLeave}
          className="text-sm font-medium text-zinc-500 hover:text-white transition-colors"
        >
          Switch Venue
        </button>
      </div>
      {/* We pass the djId via a custom prop pattern or context. Let's use React.cloneElement for this simple prototype wrap */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          // @ts-ignore
          return React.cloneElement(child, { djId: currentVenue.djId });
        }
        return child;
      })}
    </div>
  );
}
