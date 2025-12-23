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

  // 2. Mappa formulärfälten (tomma strängar -> null)
  const originAttr = formData.get('origin_attribute_number_final') as string;
  const updates = {
    company_name: (formData.get('company_name') as string) || null,
    company_reg_number: (formData.get('company_reg_number') as string) || null,
    gln: (formData.get('gln') as string) || null,
    distributor_address: (formData.get('distributor_address') as string) || null,
    origin_attribute_number: originAttr ? parseInt(originAttr) : null,
  }


  // 3. Utför uppdateringen
  const { error } = await supabase
    .from('distributor')
    .update(updates)
    .eq('user_id', user.id)

  // 4. Hantera eventuella fel
  if (error) {
    if (error.code === '23505' && error.message.includes('gln')) {
      return { error: "This GLN number is already registered to another account." }
    }
    console.error("Database error:", error.message)
    return { error: error.message }
  }

  // 5. Skicka användaren vidare om allt gick bra
  redirect('/onboarding/distributor/step-2')
}