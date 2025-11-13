import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

export async function POST(request: Request) {
  const { event, session } = await request.json()
  const supabase = getSupabaseServerClient()

  if (event === 'SIGNED_OUT') {
    await supabase.auth.signOut()
  } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    await supabase.auth.setSession({
      access_token: session?.access_token,
      refresh_token: session?.refresh_token,
    })
  }

  return NextResponse.json({ success: true })
}