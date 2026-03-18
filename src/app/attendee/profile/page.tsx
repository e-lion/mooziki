import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { User, Wallet, Mail, Calendar } from 'lucide-react';
import { Database } from '@/lib/database.types';

type UserRow = Database['public']['Tables']['users']['Row'];

export default async function AttendeeProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: publicUser } = (await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()) as unknown as { data: UserRow | null };

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const avatarUrl = user.user_metadata?.avatar_url;
  const balance = publicUser?.balance || 0;
  const createdAt = publicUser?.created_at ? new Date(publicUser.created_at).toLocaleDateString() : 'Recently';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-zinc-400">Manage your account and view your balance.</p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
        
        {/* Profile Header & Avatar */}
        <div className="relative h-32 bg-gradient-to-r from-purple-900/40 to-pink-900/40">
          <div className="absolute -bottom-12 left-6">
            <div className="p-1.5 bg-zinc-900 rounded-full">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-16 pb-8 px-8">
          <h2 className="text-2xl font-bold text-white">{displayName}</h2>
          <p className="text-zinc-400 flex items-center gap-2 mt-1">
            <Mail className="w-4 h-4" /> {user.email}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50 flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Wallet className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Current Balance</p>
                <p className="text-2xl font-bold text-white">KSh {balance}</p>
              </div>
            </div>

            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Joined</p>
                <p className="text-lg font-bold text-white">{createdAt}</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
