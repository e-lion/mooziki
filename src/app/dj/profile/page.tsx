import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { User, Disc, Mail, Calendar } from 'lucide-react';
import { Database } from '@/lib/database.types';

type UserRow = Database['public']['Tables']['users']['Row'];

export default async function DJProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch from the public.users table to get balance/role
  const { data: publicUser } = (await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()) as unknown as { data: UserRow | null };

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'DJ';
  const avatarUrl = user.user_metadata?.avatar_url;
  const joinedDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-zinc-500">View and manage your DJ account details.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={displayName} 
                  className="w-full h-full rounded-full object-cover border-2 border-blue-500/30"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center border-2 border-blue-500/30">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-blue-500 p-1.5 rounded-full border-2 border-zinc-900">
                <Disc className="w-3 h-3 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">{displayName}</h2>
            <p className="text-blue-400 text-sm font-medium uppercase tracking-wider">Professional DJ</p>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 space-y-4">
               <div className="flex items-center gap-3 text-zinc-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm truncate">{user.email}</span>
               </div>
               <div className="flex items-center gap-3 text-zinc-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm italic">Joined {joinedDate}</span>
               </div>
          </div>
        </div>

        {/* Stats/Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white mb-6">Booth Statistics</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-2xl">
                  <p className="text-zinc-500 text-sm mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-white">KSh {publicUser?.balance || 0}</p>
               </div>
               <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-2xl">
                  <p className="text-zinc-500 text-sm mb-1">Role Status</p>
                  <p className="text-2xl font-bold text-blue-400 capitalize">{publicUser?.role || 'DJ'}</p>
               </div>
            </div>

            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
               <p className="text-sm text-blue-300">
                  Keep spinning! Your earnings are automatically calculated based on accepted song requests.
               </p>
            </div>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white mb-4">Account Actions</h3>
            <div className="flex flex-wrap gap-4">
               <button className="px-6 py-2 bg-zinc-800 text-white rounded-full text-sm font-medium hover:bg-zinc-700 transition-colors">
                  Edit Profile
               </button>
               <button className="px-6 py-2 border border-zinc-800 text-zinc-400 rounded-full text-sm font-medium hover:bg-zinc-800 hover:text-white transition-colors">
                  Payout Settings
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
