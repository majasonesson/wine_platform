'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function updateProducerAction(formData: FormData) {
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

  // Hämta värden från formuläret
  const updates = {
    company_name: formData.get('companyName') as string,
    company_reg_number: formData.get('regNumber') as string,
    gln: formData.get('gln') as string,
    producer_address: formData.get('address') as string,
    country_code: formData.get('country_code') as string,
    geo_region_id: formData.get('geo_region_id') as string, // Detta är UUID:t från sista dropdownen
    district: formData.get('district') as string,
  }

  const { error } = await supabase
    .from('producer')
    .update(updates)
    .eq('user_id', user.id)

  if (error) {
    console.error(error)
    return { error: error.message }
  }

  redirect('/onboarding/producer/step-3')
}