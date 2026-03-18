"use client";

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Music } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '../../hooks/use-debounce';
import { MockPaymentModal } from './mock-payment-modal';

interface SearchResult {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
}

export default function SongSearch({ djId }: { djId?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSong, setSelectedSong] = useState<SearchResult | null>(null);
  
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    async function searchSongs() {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/search?term=${encodeURIComponent(debouncedQuery)}&limit=8`);
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Error searching songs:", error);
      } finally {
        setIsSearching(false);
      }
    }

    searchSongs();
  }, [debouncedQuery]);

  const handleRequestSong = (song: SearchResult) => {
    setSelectedSong(song);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search for a song or artist..."
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-6 bg-zinc-900 border-zinc-700 text-white rounded-2xl text-lg focus:ring-purple-500 focus:border-purple-500"
        />
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 w-5 h-5 animate-spin" />
        )}
      </div>

      <div className="flex flex-col gap-3">
        {results.map((song) => (
          <div 
            key={song.trackId} 
            className="flex items-center justify-between p-4 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors group"
          >
            <div className="flex items-center gap-4">
              <img 
                src={song.artworkUrl100} 
                alt={`${song.trackName} artwork`} 
                className="w-14 h-14 rounded-md object-cover"
              />
              <div className="flex flex-col text-left">
                <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-[300px]">{song.trackName}</span>
                <span className="text-sm text-zinc-400 truncate max-w-[200px] sm:max-w-[300px]">{song.artistName}</span>
              </div>
            </div>
            
            <Button 
              onClick={() => handleRequestSong(song)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
            >
              Request 
              <span className="ml-2 bg-purple-800 px-2 py-0.5 rounded text-xs font-bold">
                KSh 99
              </span>
            </Button>
            {/* Show badge unconditionally on mobile for better UX */}
            <Button 
              onClick={() => handleRequestSong(song)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium md:hidden transition-opacity px-4 py-2"
            >
              Request
            </Button>
          </div>
        ))}

        {!isSearching && query && results.length === 0 && (
          <div className="text-center py-12 text-zinc-500 flex flex-col items-center">
            <Music className="w-12 h-12 mb-4 opacity-20" />
            <p>No songs found for "{query}"</p>
          </div>
        )}
      </div>

      {/* Render Mock Payment Modal absolutely above UI */}
      {selectedSong && (
        <MockPaymentModal 
          song={selectedSong} 
          djId={djId}
          onClose={() => setSelectedSong(null)} 
          onSuccess={() => {
            // Optional: Show a subtle toast or message
            console.log("Payment flow complete for", selectedSong.trackName);
          }} 
        />
      )}
    </div>
  );
}
