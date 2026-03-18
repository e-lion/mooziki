"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Song {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
}

interface MockPaymentModalProps {
  song: Song;
  onClose: () => void;
  onSuccess: () => void;
  // We'll pass the currently selected DJ ID eventually
  djId?: string; 
}

export function MockPaymentModal({ song, onClose, onSuccess, djId }: MockPaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();

  // Read configurable fee from ENV, default to 99
  const baseFee = process.env.NEXT_PUBLIC_BASE_FEE ? parseInt(process.env.NEXT_PUBLIC_BASE_FEE) : 99;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // 1. Simulate network payment delay (1.5s)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 2. Insert into Supabase 'requests' table
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Must be logged in to request a song");

      // Note: If RLs are turned on, insure Insert policies exist
      const { error } = await supabase
        .from('requests')
        .insert({
          attendee_id: user.id,
          dj_id: djId || null, 
          song_title: song.trackName,
          song_artist: song.artistName,
          song_art_url: song.artworkUrl100,
          fee_amount: baseFee,
          status: 'pending'
        } as any);

      if (error) {
        console.error("Failed to insert request:", error);
        alert("Failed to queue song. Please try again.");
        setIsProcessing(false);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);

    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-purple-500/20 blur-[50px] pointer-events-none" />

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center relative z-10">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 animate-in zoom-in" />
            <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
            <p className="text-zinc-400">"{song.trackName}" has been added to the DJ's queue.</p>
          </div>
        ) : (
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Confirm Request</h3>
            
            <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-xl mb-6 border border-zinc-800">
              <img src={song.artworkUrl100} alt={song.trackName} className="w-16 h-16 rounded-md object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{song.trackName}</p>
                <p className="text-sm text-zinc-400 truncate">{song.artistName}</p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8 border-t border-zinc-800 pt-6">
              <span className="text-zinc-400">Total Fee</span>
              <span className="text-2xl font-bold text-white">KSh {baseFee}</span>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg font-medium"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                  </>
                ) : (
                  `Pay KSh ${baseFee}`
                )}
              </Button>
              <Button 
                onClick={onClose}
                disabled={isProcessing}
                variant="ghost" 
                className="w-full text-zinc-400 hover:text-white hover:bg-zinc-800 h-12"
              >
                Cancel
              </Button>
            </div>
            
            <p className="text-xs text-center text-zinc-500 mt-6">
              This is a mock payment for testing purposes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
