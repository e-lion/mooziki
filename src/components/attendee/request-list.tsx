import React from 'react';
import { Clock, CheckCircle2, PlayCircle, XCircle } from 'lucide-react';
import { Database } from '@/lib/database.types';

type Request = Database['public']['Tables']['requests']['Row'];

interface RequestListProps {
  requests: Request[];
}

export function RequestList({ requests }: RequestListProps) {
  if (!requests || requests.length === 0) {
    return (
      <div className="text-center p-8 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <p className="text-zinc-500">You haven't requested any songs yet.</p>
      </div>
    );
  }

  const getStatusConfig = (status: Request['status']) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Pending' };
      case 'accepted':
        return { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Accepted' };
      case 'played':
        return { icon: PlayCircle, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Played' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Rejected' };
      default:
        return { icon: Clock, color: 'text-zinc-500', bg: 'bg-zinc-500/10', label: 'Unknown' };
    }
  };

  return (
    <div className="space-y-4">
      {requests.map((req) => {
        const StatusIcon = getStatusConfig(req.status).icon;
        const config = getStatusConfig(req.status);

        return (
          <div 
            key={req.id} 
            className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 transition-all hover:bg-zinc-900"
          >
            {req.song_art_url ? (
              <img 
                src={req.song_art_url} 
                alt={req.song_title} 
                className="w-16 h-16 rounded-md object-cover flex-shrink-0" 
              />
            ) : (
              <div className="w-16 h-16 rounded-md bg-zinc-800 flex-shrink-0 flex items-center justify-center">
                <span className="text-zinc-500 font-bold text-xl">{req.song_title.charAt(0)}</span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate text-lg">{req.song_title}</p>
              <p className="text-sm text-zinc-400 truncate">{req.song_artist}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {config.label}
                </span>
                <span className="text-xs text-zinc-500 font-medium">
                  KSh {req.fee_amount}
                </span>
              </div>
            </div>
            
            <div className="text-right text-xs text-zinc-500 flex flex-col justify-between h-16">
               <span>{new Date(req.created_at).toLocaleDateString()}</span>
               <span>{new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
