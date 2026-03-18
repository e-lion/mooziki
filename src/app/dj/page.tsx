import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import RequestQueue from '../../components/dj/request-queue';

export default async function DJDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login'); // We are sharing the login portal for simplicity for now
  }

  // Ideally we would do a role check here, but for this prototype 
  // we'll assume anyone hitting /dj is trying to access the DJ view.

  // Fetch from the public.users table to get role and venue code
  const { data: publicUser } = (await supabase
    .from('users')
    .select('role, venue_code')
    .eq('id', user.id)
    .single()) as unknown as { data: { role: string; venue_code: string | null } | null };

  return (
    <section>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            DJ Dashboard
          </h1>
          <p className="text-zinc-500 mt-1">Manage your incoming requests and earnings.</p>
        </div>

        {publicUser?.venue_code && (
          <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-2xl flex items-center gap-3">
             <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Venue Code</div>
             <div className="text-2xl font-black text-white tracking-widest">{publicUser.venue_code}</div>
          </div>
        )}
      </div>
      <RequestQueue djId={user.id} />
    </section>
  );
}
