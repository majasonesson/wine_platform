'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getSupabase() {
    const cookieStore = await cookies()
    return createServerClient(
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
}

export async function toggleProfilePublic(type: 'producer' | 'distributor', isPublic: boolean) {
    const supabase = await getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { error, count } = await supabase
        .from(type)
        .update({ is_public: isPublic }, { count: 'exact' })
        .eq('user_id', user.id)

    console.log(`Toggle Profile: type=${type}, isPublic=${isPublic}, userId=${user.id}, rowsAffected=${count}`)

    if (error) {
        console.error("Error toggling profile visibility:", error)
        return { error: error.message }
    }
    revalidatePath('/profile')
    return { success: true }
}

export async function updateProfileStep1(type: 'producer' | 'distributor', data: any) {
    const supabase = await getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const updates: any = {
        company_name: data.company_name,
        company_reg_number: data.company_reg_number,
        gln: data.gln,
        origin_attribute_number: data.origin_attribute_number ? parseInt(data.origin_attribute_number) : null,
    }

    if (type === 'producer') {
        updates.producer_address = data.address
    } else {
        updates.distributor_address = data.address
    }

    const { error } = await supabase
        .from(type)
        .update(updates)
        .eq('user_id', user.id)

    if (error) {
        console.error("Error updating profile step 1:", error)
        return { error: error.message }
    }
    revalidatePath('/profile')
    return { success: true }
}

export async function updateProfileStep2(type: 'producer' | 'distributor', data: any) {
    const supabase = await getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { error } = await supabase
        .from(type)
        .update({
            founding_team_type: data.founding_team_type,
            gender_dist_women: data.gender_dist_women,
            gender_dist_men: data.gender_dist_men,
            gender_dist_non_binary: data.gender_dist_non_binary,
            women_in_leadership: data.women_in_leadership,
            men_in_leadership: data.men_in_leadership,
            non_binary_in_leadership: data.non_binary_in_leadership
        })
        .eq('user_id', user.id)

    if (error) {
        console.error("Error updating profile step 2:", error)
        return { error: error.message }
    }
    revalidatePath('/profile')
    return { success: true }
}
