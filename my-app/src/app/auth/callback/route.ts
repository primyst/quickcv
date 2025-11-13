import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const supabase = getSupabaseServerClient()
  await supabase.auth.exchangeCodeForSession(code)

  return NextResponse.redirect(new URL('/dashboard', request.url))
}