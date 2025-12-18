'use server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function updateDistributorAction(formData: FormData) {
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

  // 1. Kontrollera att användaren är inloggad
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  // 2. Mappa formulärfälten (name i JSX) till databaskolumnerna (SQL)
  const updates = {
    // Från name="company_name" i din JSX till company_name i SQL
    company_name: formData.get('company_name') as string,
    
    // Från name="company_reg_number" i din JSX till company_reg_number i SQL
    company_reg_number: formData.get('company_reg_number') as string,
    
    // Från name="gln" i din JSX till gln i SQL
    gln: formData.get('gln') as string,
    
    // Från name="distributor_address" i din JSX till distributor_address i SQL
    distributor_address: formData.get('distributor_address') as string,
    
    // Från name="country_code" i din JSX till country_code i SQL
    country_code: formData.get('country_code') as string,
    
    // Från name="geo_region_id" i din JSX till geo_region_id i SQL
    geo_region_id: formData.get('geo_region_id') || null,
  }

  // 3. Utför uppdateringen
  const { error } = await supabase
    .from('distributor')
    .update(updates)
    .eq('user_id', user.id)

  // 4. Hantera eventuella fel
  if (error) {
    console.error("Database error:", error.message)
    return { error: error.message }
  }

  // 5. Skicka användaren vidare om allt gick bra
  redirect('/onboarding/distributor/step-3')
}