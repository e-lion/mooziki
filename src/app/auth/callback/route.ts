import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && user) {
      // Determine role from 'next' parameter
      const role = (next.includes('/dj') ? 'dj' : 'attendee') as 'dj' | 'attendee';

      // Update public.users table (might have already been created by trigger, so we update the role)
      await supabase
        .from('users')
        // @ts-ignore
        .update({ role: role })
        .eq('id', user.id);

      // Also update auth metadata so the trigger will have it on future logins
      await supabase.auth.updateUser({
        data: { role: role }
      });

      const redirectUrl = new URL(next, request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // return the user to an error page with instructions
  const errorUrl = new URL('/auth/auth-code-error', request.url)
  return NextResponse.redirect(errorUrl)
}
