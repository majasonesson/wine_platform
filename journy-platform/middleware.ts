import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: { headers: request.headers },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return request.cookies.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                    response = NextResponse.next({ request: { headers: request.headers } })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    response = NextResponse.next({ request: { headers: request.headers } })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const url = new URL(request.url)

    // 1. SKYDDA DASHBOARD: Om man inte är inloggad men försöker nå dashboard
    if (!user && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 2. KONTROLLERA STATUS ENBART FÖR DASHBOARD
    // Vi vill INTE ha denna check när man är inne i /onboarding, annars fastnar man i en loop
    if (user && url.pathname.startsWith('/dashboard')) {
        const role = user.user_metadata.role?.toLowerCase()
        
        if (role) {
            const { data: profile } = await supabase
                .from(role)
                .select('company_name, founding_team_type')
                .eq('user_id', user.id)
                .single()

            // Om de försöker gå till Dashboard men saknar info, skicka till onboarding
            if (!profile?.company_name) {
                return NextResponse.redirect(new URL(`/onboarding/${role}/step-2`, request.url))
            }
            if (!profile.founding_team_type || profile.founding_team_type === 'not_specified') {
                return NextResponse.redirect(new URL(`/onboarding/${role}/step-3`, request.url))
            }
        }
    }

   /* // 3. Om man är klar och försöker gå till /login eller /signup
    if (user && (url.pathname === '/login' || url.pathname === '/signup')) {
        const role = user.user_metadata.role?.toLowerCase()
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }*/

    return response
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}