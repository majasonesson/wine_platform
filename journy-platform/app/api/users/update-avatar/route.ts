import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');
        const type = searchParams.get('type'); // 'producer', 'distributor', 'wine', 'certificate'
        const id = searchParams.get('id');     // GTIN eller UUID

        if (!filename || !type || !id) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        // 1. Upload to Vercel Blob
        const blob = await put(`${type}/${filename}`, request.body!, {
            access: 'public',
            addRandomSuffix: true,
        });

        // 2. Initialize Supabase (using createServerClient to get the user session)
        const cookieStore = await cookies();
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
        );

        // Get the authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        // Use admin client for the actual database operations to bypass RLS
        const adminClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        let result;

        // --- PRODUCER ---
        if (type === 'producer') {
            result = await adminClient
                .from('producer')
                .update({ profile_image_url: blob.url })
                .eq('id', id);
        }
        // --- WINE ---
        else if (type === 'wine') {
            result = await adminClient
                .from('wine')
                .upsert({
                    gtin: id,
                    product_image_url: blob.url
                }, { onConflict: 'gtin' });
        }
        // --- CERTIFICATE ---
        else if (type === 'certificate') {
            const certificateId = searchParams.get('certificateId');
            const refNumber = searchParams.get('refNumber') || 'PENDING';
            const expiryDate = searchParams.get('expiryDate');
            const producerId = searchParams.get('producerId');
            const distributorId = searchParams.get('distributorId');

            if (!user?.id) {
                return NextResponse.json({ error: "Unauthorized: Please log in to save certificates" }, { status: 401 });
            }

            result = await adminClient
                .from('owner_certificate_instance')
                .upsert({
                    certificate_id: certificateId,
                    reference_number: refNumber,
                    expiry_date: expiryDate,
                    verification_document_url: blob.url,
                    uploaded_by_id: user.id,
                    producer_id: producerId || null,
                    distributor_id: distributorId || null
                }, {
                    onConflict: 'certificate_id, producer_id, distributor_id'
                });
        }

        if (result?.error) {
            console.error("Supabase Error:", result.error.message);
            return NextResponse.json({
                error: "Database sync failed: " + result.error.message,
                url: blob.url
            }, { status: 400 });
        }

        return NextResponse.json(blob);

    } catch (error: any) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}