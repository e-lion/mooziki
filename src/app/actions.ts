import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Creates a new song request.
 * Securely fetches the user from the server to prevent attendee_id spoofing.
 */
export async function createRequestAction(formData: {
  song_title: string;
  song_artist: string;
  song_art_url: string;
  dj_id: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const baseFee = process.env.NEXT_PUBLIC_BASE_FEE ? parseInt(process.env.NEXT_PUBLIC_BASE_FEE) : 99;

  const { error } = await supabase
    .from('requests')
    .insert({
      attendee_id: user.id,
      dj_id: formData.dj_id,
      song_title: formData.song_title,
      song_artist: formData.song_artist,
      song_art_url: formData.song_art_url,
      fee_amount: baseFee,
      status: 'pending'
    } as any);

  if (error) throw new Error(error.message);

  revalidatePath('/attendee');
  return { success: true };
}

/**
 * Updates the status of a request.
 * Verifies that the user is a DJ and owns the request before updating.
 */
export async function updateRequestStatusAction(
  requestId: string, 
  newStatus: 'pending' | 'accepted' | 'played' | 'rejected'
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'dj') {
    throw new Error("Only DJs can update request statuses");
  }

  // Double check that this DJ is actually assigned to the request
  const { data: request } = await supabase
    .from('requests')
    .select('dj_id')
    .eq('id', requestId)
    .single() as any;

  if (!request || (request.dj_id && request.dj_id !== user.id)) {
    throw new Error("Unauthorized to update this request");
  }

  const { error } = await (supabase
    .from('requests')
    .update({ 
      status: newStatus,
      dj_id: user.id // Assign DJ if it was null
    } as any)
    .eq('id', requestId) as any);

  if (error) throw new Error(error.message);

  revalidatePath('/dj');
  return { success: true };
}
