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

  // Hämta värden och konvertera tomma strängar till null
  const originAttr = formData.get('origin_attribute_number_final') as string;
  const updates = {
    company_name: (formData.get('companyName') as string) || null,
    company_reg_number: (formData.get('regNumber') as string) || null,
    gln: (formData.get('gln') as string) || null,
    producer_address: (formData.get('address') as string) || null,
    origin_attribute_number: originAttr ? parseInt(originAttr) : null,
  }


  const { error } = await supabase
    .from('producer')
    .update(updates)
    .eq('user_id', user.id)

  if (error) {
    if (error.code === '23505' && error.message.includes('gln')) {
      return { error: "This GLN number is already registered to another account." }
    }
    console.error(error)
    return { error: error.message }
  }

  redirect('/onboarding/producer/step-2')
}