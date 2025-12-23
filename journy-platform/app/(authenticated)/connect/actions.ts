'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function sendPartnershipRequest(targetId: string, userType: 'producer' | 'distributor') {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
                remove(name: string, options: CookieOptions) { cookieStore.delete({ name, ...options }) },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    // Get current user's producer or distributor id
    let currentUserId: string | null = null

    if (userType === 'producer') {
        const { data } = await supabase.from('producer').select('id').eq('user_id', user.id).single()
        currentUserId = data?.id || null
    } else {
        const { data } = await supabase.from('distributor').select('id').eq('user_id', user.id).single()
        currentUserId = data?.id || null
    }

    if (!currentUserId) return { error: "User profile not found" }

    // Create partnership request
    const partnershipData = userType === 'producer'
        ? { producer_id: currentUserId, distributor_id: targetId, status: 'pending' }
        : { producer_id: targetId, distributor_id: currentUserId, status: 'pending' }

    const { error } = await supabase.from('partnership').insert(partnershipData)

    if (error) {
        if (error.code === '23505') return { error: "Partnership request already exists" }
        return { error: error.message }
    }

    return { success: true }
}

export async function respondToPartnership(producerId: string, distributorId: string, accept: boolean) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
                remove(name: string, options: CookieOptions) { cookieStore.delete({ name, ...options }) },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const newStatus = accept ? 'active' : 'declined'

    const { error } = await supabase
        .from('partnership')
        .update({ status: newStatus })
        .eq('producer_id', producerId)
        .eq('distributor_id', distributorId)

    if (error) return { error: error.message }

    return { success: true }
}

export async function pausePartnership(producerId: string, distributorId: string) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
                remove(name: string, options: CookieOptions) { cookieStore.delete({ name, ...options }) },
            },
        }
    )

    const { error } = await supabase
        .from('partnership')
        .update({ status: 'paused' })
        .eq('producer_id', producerId)
        .eq('distributor_id', distributorId)

    if (error) return { error: error.message }
    return { success: true }
}

export async function deletePartnership(producerId: string, distributorId: string) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
                remove(name: string, options: CookieOptions) { cookieStore.delete({ name, ...options }) },
            },
        }
    )

    const { error } = await supabase
        .from('partnership')
        .delete()
        .eq('producer_id', producerId)
        .eq('distributor_id', distributorId)

    if (error) return { error: error.message }
    return { success: true }
}

export async function addWineToPortfolio(wineGtin: string, notes?: string) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
                remove(name: string, options: CookieOptions) { cookieStore.delete({ name, ...options }) },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { data: distributor } = await supabase.from('distributor').select('id').eq('user_id', user.id).single()
    if (!distributor) return { error: "Distributor profile not found" }

    const { error } = await supabase
        .from('distributor_portfolio')
        .insert({ distributor_id: distributor.id, wine_gtin: wineGtin, notes })

    if (error) {
        if (error.code === '23505') return { error: "Wine already in portfolio" }
        return { error: error.message }
    }

    return { success: true }
}

export async function removeWineFromPortfolio(wineGtin: string) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
                remove(name: string, options: CookieOptions) { cookieStore.delete({ name, ...options }) },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { data: distributor } = await supabase.from('distributor').select('id').eq('user_id', user.id).single()
    if (!distributor) return { error: "Distributor profile not found" }

    const { error } = await supabase
        .from('distributor_portfolio')
        .delete()
        .eq('distributor_id', distributor.id)
        .eq('wine_gtin', wineGtin)

    if (error) return { error: error.message }
    return { success: true }
}
