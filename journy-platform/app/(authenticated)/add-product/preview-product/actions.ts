'use server';

import { createServerClient } from '@supabase/ssr';
import { generateFullDescription } from '@/utils/constants';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function publishWineAction(wineData: any) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
            },
        }
    );

    try {
        // 1. Get User & Producer ID
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data: producer, error: producerError } = await supabase
            .from('producer')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (producerError || !producer) throw new Error("Producer not found");
        const producerId = producer.id;

        // 2. Prepare Data for 'wine' (CORE)
        const vintage = wineData.vintage ? parseInt(wineData.vintage) : null;

        const winePayload = {
            gtin: wineData.gtin,
            producer_id: producerId,
            wine_name: wineData.wine_name,
            brand_name: wineData.brand_name,
            vintage: vintage,
            product_image_url: wineData.product_image_url || null,
            is_published: true
        };

        const { data: wine, error: wineError } = await supabase
            .from('wine')
            .upsert(winePayload)
            .select('gtin')
            .single();

        if (wineError) throw wineError;
        const savedGtin = wine.gtin;

        // 3. WINE PRODUCT INFO
        const volumeStr = wineData.bottle_volume_ml ? String(wineData.bottle_volume_ml).replace(/[^\d.]/g, '') : null;
        const volume = volumeStr ? parseFloat(volumeStr) : 0;

        await supabase.from('wine_product_info').upsert({
            gtin: savedGtin,
            wine_category: wineData.wine_category || 'Still wine',
            wine_type: wineData.wine_type || 'Red',
            bottle_volume_ml: volume,
            variety_gpc_code: wineData.variety_gpc_code || null,
            wine_sparkling_attribute_number: wineData.wine_sparkling_attribute_number || null,
            origin_attribute_number: wineData.origin_attribute_number ? parseInt(wineData.origin_attribute_number) : null
        });


        // 4. WINE TECHNICAL DATA
        await supabase.from('wine_technical_data').upsert({
            gtin: savedGtin,
            alcohol_content_percent: wineData.alcohol_content_percent || 0,
            residual_sugar_gpl: wineData.residual_sugar_gpl || 0,
            total_acidity_gpl: wineData.total_acidity_gpl || 0,
            so2_total_mgpl: wineData.so2_total_mgpl || 0,
            energy_kcal_per_100ml: wineData.energy_kcal_per_100ml,
            energy_kj_per_100ml: wineData.energy_kj_per_100ml,
            energy_carbs: wineData.energy_carbs,
            energy_carbs_of_sugar: wineData.energy_carbs_of_sugar,
            best_before_date: wineData.expiry_date || null
        });

        // 5. WINE PRODUCTION
        await supabase.from('wine_production').upsert({
            gtin: savedGtin,
            harvest_method: wineData.harvest_method || 'Manual',
            fermentation_vessel: wineData.fermentation_vessel || 'Stainless steel',
            vineyard_source: wineData.vineyard_source,
            aging_vessel: wineData.aging_vessel,
            aging_duration_months: wineData.aging_duration_months ? parseInt(wineData.aging_duration_months) : null
        });

        // 6. WINE FERMENTATION (Sparkling Specific)
        if (wineData.wine_category === 'Sparkling wine') {
            await supabase.from('wine_fermentation').upsert({
                gtin: savedGtin,
                dosage_level: wineData.dosage_level,
                secondary_fermentation_time: wineData.secondary_fermentation_time,
                lees_aging: wineData.lees_aging,
                riddling_method: wineData.riddling_method,
                disgorgement_method: wineData.disgorgement_method,
                primary_fermentation_vessel: wineData.primary_fermentation_vessel
            });
        }

        // 7. WINE SENSORY
        await supabase.from('wine_sensory').upsert({
            gtin: savedGtin,
            color_intensity: wineData.intensity,
            color_hue: wineData.hue,
            color_description: wineData.color_description, // generated
            taste_profile: generateFullDescription(
                wineData.selectedChars || [],
                wineData.selectedTexture || [],
                wineData.selectedAromas || []
            ), // refined generator
            texture_finish: wineData.selectedTexture?.join(', '),
            food_pairing_text: wineData.pairings?.join(', ') || wineData.selectedFood?.join(', '),
            serving_temp_min_c: wineData.serving_temp_min,
            serving_temp_max_c: wineData.serving_temp_max,
            aging_potential: wineData.aging_potential,
            sweetness_level: wineData.clocks?.sweetness,
            body_level: wineData.clocks?.body,
            acidity_level: wineData.clocks?.acidity,
            tannin_level: wineData.clocks?.tannins
        });

        // 8. WINE PACKAGING
        const packagingPayload = {
            gtin: savedGtin,
            bottle_type: wineData.bottle_type,
            material_code_bottle: wineData.material_code_bottle,
            closure_type: wineData.cork_type || wineData.closure_type,
            material_code_closure: wineData.material_code_cork || wineData.material_code_closure,
            capsule_type: wineData.cap_type || wineData.capsule_type,
            material_code_capsule: wineData.material_code_cap || wineData.material_code_capsule,
            cage_type: wineData.cage_type,
            material_code_cage: wineData.material_code_cage,
            shellac_type: wineData.seal_type || wineData.shellac_type,
            material_code_shellac: wineData.material_code_seal || wineData.material_code_shellac,
            cardboard_type: wineData.cardboard_type,
            material_code_cardboard: wineData.material_code_cardboard,
            bag_type: wineData.bag_type,
            material_code_bag: wineData.material_code_bag,
            tap_type: wineData.tap_type,
            material_code_tap: wineData.material_code_tap,
            weight_finished_product_g: wineData.weight_finished_product_g
        };

        const cleanPackaging = Object.fromEntries(
            Object.entries(packagingPayload).filter(([_, v]) => v && v !== '')
        );

        if (Object.keys(cleanPackaging).length > 1) {
            await supabase.from('wine_packaging').upsert(cleanPackaging);
        }

        // --- JUNCTION TABLES ---

        // 9. Ingredients
        if (wineData.selected_ingredients && wineData.selected_ingredients.length > 0) {
            await supabase.from('wine_ingredient').delete().eq('gtin', savedGtin);
            const ingredientsInsert = wineData.selected_ingredients.map((code: string) => ({
                gtin: savedGtin,
                ingredient_code: code
            }));
            await supabase.from('wine_ingredient').insert(ingredientsInsert);
        }

        // 10. Aromas
        if (wineData.selectedAromas && wineData.selectedAromas.length > 0) {
            await supabase.from('wine_aroma').delete().eq('gtin', savedGtin);
            const aromaInsert = wineData.selectedAromas.map((aroma: string) => ({
                gtin: savedGtin,
                aroma_code: aroma
            }));
            await supabase.from('wine_aroma').insert(aromaInsert);
        }

        // 11. Taste Characteristics
        if (wineData.selectedChars && wineData.selectedChars.length > 0) {
            await supabase.from('wine_taste').delete().eq('gtin', savedGtin);
            const tasteInsert = wineData.selectedChars.map((char: string) => ({
                gtin: savedGtin,
                taste_code: char
            }));
            await supabase.from('wine_taste').insert(tasteInsert);
        }

        // 12. Grapes
        if (wineData.grapes && wineData.grapes.length > 0) {
            await supabase.from('wine_grape').delete().eq('gtin', savedGtin);
            const grapeInsert = wineData.grapes.map((g: any) => ({
                gtin: savedGtin,
                grape_variety: g.grape_name,
                percentage: g.percentage,
                attribute_number: g.attribute_number // Added granular GS1 number
            }));
            await supabase.from('wine_grape').insert(grapeInsert);
        }

        // 13. Wine Certificates
        if (wineData.selected_certs && wineData.selected_certs.length > 0) {
            await supabase.from('wine_certificate').delete().eq('gtin', savedGtin);
            const certInsert = wineData.selected_certs.map((code: string) => ({
                gtin: savedGtin,
                certificate_code: code
            }));
            await supabase.from('wine_certificate').insert(certInsert);
        }

        // 14. Food Pairings
        if (wineData.selectedFood && wineData.selectedFood.length > 0) {
            await supabase.from('wine_food_pairing').delete().eq('gtin', savedGtin);
            const pairingInsert = wineData.selectedFood.map((code: string) => ({
                gtin: savedGtin,
                pairing_code: code
            }));
            await supabase.from('wine_food_pairing').insert(pairingInsert);
        }

        revalidatePath('/dashboard/producer');
        return { success: true };

    } catch (error: any) {
        console.error("Publish failed:", error);
        return { error: error.message };
    }
}
