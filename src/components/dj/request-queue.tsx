"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, XCircle, PlayCircle, Loader2 } from 'lucide-react';
import { updateRequestStatusAction } from '@/app/actions';

// Reflects our Supabase Schema
interface RequestRecord {
  id: string;
  created_at: string;
  attendee_id: string;
  song_title: string;
  song_artist: string;
  song_art_url: string;
  fee_amount: number;
  status: 'pending' | 'accepted' | 'played' | 'rejected';
}

export default function RequestQueue({ djId }: { djId: string }) {
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'active' | 'history'>('active');
  const supabase = createClient();

  const fetchRequests = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      // Note: in a real app, filter by dj_id. For testing, we might just grab all active requests
      // .eq('dj_id', djId)
      .in('status', viewMode === 'active' ? ['pending', 'accepted'] : ['played', 'rejected'])
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRequests(data as RequestRecord[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRequests();

    // Subscribe to real-time inserted requests
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERTs and UPDATEs
          schema: 'public',
          table: 'requests',
        },
        (payload) => {
          console.log("Realtime Update Received!", payload);
          fetchRequests(); // Brute force refresh for prototype, alternatively update local state intelligently
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [viewMode]);

  const updateRequestStatus = async (id: string, newStatus: RequestRecord['status']) => {
    // Optimistic UI Update
    setRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: newStatus } : req)
    );

    try {
      const { success } = await updateRequestStatusAction(id, newStatus);
      if (!success) {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update status", error);
      // Revert upon failure
      fetchRequests();
    }
  };

  const simulatePayout = async (requestId: string) => {
    // In a real app, this would be a secure Edge Function or Database Trigger.
    // We are mocking it on the client for demonstration.
    console.log(`Processing payout for request ${requestId}...`);
    // Remove from active queue view
    setTimeout(() => {
      setRequests(prev => prev.filter(req => req.id !== requestId));
    }, 1500); 
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">Queue is empty</h3>
        <p>Waiting for the crowd to drop some requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-lg w-fit border border-zinc-800">
        <button
          onClick={() => setViewMode('active')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'active' 
              ? 'bg-zinc-800 text-white shadow-sm' 
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Active Queue
        </button>
        <button
          onClick={() => setViewMode('history')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'history' 
              ? 'bg-zinc-800 text-white shadow-sm' 
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          History
        </button>
      </div>

      <div className="grid gap-4">
      {requests.map(req => (
        <div 
          key={req.id} 
          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 rounded-2xl border transition-all ${
            req.status === 'accepted' 
              ? 'bg-blue-900/10 border-blue-500/30' 
              : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <img 
              src={req.song_art_url || "https://placehold.co/100x100/18181b/ffffff?text=Music"} 
              alt="Album Art" 
              className="w-16 h-16 rounded-md object-cover shadow-md"
            />
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">{req.song_title}</h3>
              <p className="text-zinc-400 text-sm">{req.song_artist}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">
                  + KSh {req.fee_amount}
                </span>
                {req.status === 'accepted' && (
                  <span className="text-xs text-blue-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Accepted
                  </span>
                )}
                {req.status === 'played' && (
                  <span className="text-xs text-purple-400 flex items-center gap-1">
                    <PlayCircle className="w-3 h-3" /> Played
                  </span>
                )}
                {req.status === 'rejected' && (
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Rejected
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {req.status === 'pending' && (
              <>
                <Button 
                  onClick={() => updateRequestStatus(req.id, 'rejected')}
                  variant="outline" 
                  className="flex-1 sm:flex-none border-red-900/50 text-red-500 hover:bg-red-950/30 hover:text-red-400"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button 
                  onClick={() => updateRequestStatus(req.id, 'accepted')}
                  className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Accept
                </Button>
              </>
            )}
            
            {req.status === 'accepted' && (
              <Button 
                onClick={() => updateRequestStatus(req.id, 'played')}
                className="flex-1 sm:flex-none w-full bg-green-600 hover:bg-green-700 text-white animate-pulse-slow"
              >
                <PlayCircle className="w-4 h-4 mr-2" /> Mark as Played (Claim KSh {req.fee_amount})
              </Button>
            )}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
