import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SongSearch from '@/components/attendee/song-search';
import { RequestList } from '@/components/attendee/request-list';
import { VenueGuard } from '@/components/attendee/venue-guard';

export default async function AttendeeDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: requests } = await supabase
    .from('requests')
    .select('*')
    .eq('attendee_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <VenueGuard>
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">What do you want to hear?</h2>
          <p className="text-zinc-400">Search the global library and request your track.</p>
        </div>
        <SongSearch />
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Your Requests</h2>
            <p className="text-zinc-400 text-sm">Track the status of your requested songs.</p>
          </div>
        </div>
        <RequestList requests={requests || []} />
      </section>
    </VenueGuard>
  );
}
