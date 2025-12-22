'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import QRCode from 'qrcode';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

/**
 * Toggles the visibility (is_published) of a wine.
 * Only the owner should be able to do this.
 */
export async function toggleVisibilityAction(gtin: string, currentStatus: boolean) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Check ownership
    const { data: wine } = await supabase
        .from('wine')
        .select('producer_id')
        .eq('gtin', gtin)
        .single();

    if (!wine) return { success: false, error: "Wine not found" };

    const { data: producer } = await supabase
        .from('producer')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (wine.producer_id !== producer?.id) {
        return { success: false, error: "You don't own this wine" };
    }

    const { error } = await supabase
        .from('wine')
        .update({ is_published: !currentStatus })
        .eq('gtin', gtin);

    if (error) {
        console.error("Toggle visibility error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/01/${gtin}`);
    revalidatePath(`/dashboard/producer/product/${gtin}`);
    return { success: true };
}

/**
 * Generates a QR code for the GS1 link, uploads to Vercel Blob,
 * and saves the URL to the database.
 */
export async function generateQRCodeAction(gtin: string) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // 1. Get current wine to check ownership
    const { data: wine, error: fetchError } = await supabase
        .from('wine')
        .select('producer_id')
        .eq('gtin', gtin)
        .single();

    if (fetchError || !wine) {
        console.error("Fetch wine error:", fetchError);
        return { success: false, error: "Wine not found" };
    }

    const { data: producer } = await supabase
        .from('producer')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (wine.producer_id !== producer?.id) {
        return { success: false, error: "You don't own this wine" };
    }

    // 2. Generate QR Code
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://journy.wine';
    const gs1Url = `${appUrl}/01/${gtin}`;

    try {
        // Generate as Buffer
        const qrBuffer = await QRCode.toBuffer(gs1Url, {
            width: 600,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });

        // 3. Upload to Vercel Blob
        const blob = await put(`qrcodes/${gtin}.png`, qrBuffer, {
            access: 'public',
            contentType: 'image/png',
            addRandomSuffix: false,
            allowOverwrite: true,
        });

        // 4. Update Database
        const { error: updateError } = await supabase
            .from('wine')
            .update({ qr_code_url: blob.url })
            .eq('gtin', gtin);

        if (updateError) {
            console.error("Update QR code URL error:", updateError);
            throw updateError;
        }

        revalidatePath(`/dashboard/producer/product/${gtin}`);
        revalidatePath(`/01/${gtin}`);
        return { success: true, qrUrl: blob.url };

    } catch (err: any) {
        console.error("Generate QR code action failed:", err);
        return { success: false, error: err.message };
    }
}
