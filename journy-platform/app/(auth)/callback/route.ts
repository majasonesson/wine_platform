import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    // FIX: Lägg till await här för att hämta cookie-butiken korrekt i Next.js 15/16
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // Vi sprider ut options men ser till att TypeScript är nöjd
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            // I nyare Next.js används delete istället för att bara sätta värdet till tomt
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Vid fel, skicka till en felsida
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}