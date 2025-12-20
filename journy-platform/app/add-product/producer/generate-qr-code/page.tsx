'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function GenerateQrCodePage() {
    const router = useRouter();
    const [wineData, setWineData] = useState<any>(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const saved = localStorage.getItem('wine_draft');
        if (saved) {
            setWineData(JSON.parse(saved));
        }
    }, []);

    const handleFinish = async () => {
        if (!wineData) return;
        setIsSaving(true);
        console.log("Starting save to Supabase...", wineData);

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

            // 2. Prepare Data for product_wine
            const vintage = wineData.vintage ? parseInt(wineData.vintage) : null;
            // Handle '750ml' -> 750.0
            const volumeStr = wineData.bottle_volume_ml ? String(wineData.bottle_volume_ml).replace(/[^\d.]/g, '') : null;
            const volume = volumeStr ? parseFloat(volumeStr) : null;

            // Upsert Main Wine Record (GTIN is PK)
            const { data: wine, error: wineError } = await supabase
                .from('product_wine')
                .upsert({
                    gtin: wineData.gtin,
                    producer_id: producerId,
                    wine_name: wineData.wine_name,
                    brand_name: wineData.brand_name,
                    vintage: vintage,
                    wine_category: wineData.wine_category,
                    wine_type: wineData.wine_type,
                    bottle_volume_ml: volume,
                    alcohol_content_percent: wineData.alcohol_content_percent,
                    residual_sugar_gpl: wineData.residual_sugar_gpl,
                    total_acidity_gpl: wineData.total_acidity_gpl,
                    so2_total_mgpl: wineData.so2_total_mgpl,
                    product_image_url: wineData.product_image_url || null, // Included URL

                    // Descriptive text stored in main table according to loose schema
                    taste_profile: wineData.taste_profile,
                    aroma_description: wineData.selectedAromas ? wineData.selectedAromas.join(', ') : null,

                    is_public_for_distributors: false
                })
                .select('gtin')
                .single();

            if (wineError) throw wineError;
            const savedGtin = wine.gtin;

            // 3. Packaging Details
            const packagingPayload = {
                gtin: savedGtin,
                bottle_type: wineData.bottle_type,
                material_code_bottle: wineData.material_code_bottle,

                closure_type: wineData.cork_type,
                material_code_closure: wineData.material_code_cork,

                capsule_type: wineData.cap_type,
                material_code_capsule: wineData.material_code_cap,

                cage_type: wineData.cage_type,
                material_code_cage: wineData.material_code_cage,

                shellac_type: wineData.seal_type,
                material_code_shellac: wineData.material_code_seal
            };

            // Filter empty keys
            const cleanPackaging = Object.fromEntries(
                Object.entries(packagingPayload).filter(([_, v]) => v && v !== '')
            );

            // Only insert if valid packaging info exists
            if (Object.keys(cleanPackaging).length > 1) {
                const { error: packError } = await supabase
                    .from('PACKAGING_DETAIL')
                    .insert(cleanPackaging);
                if (packError) console.warn("Packaging insert error:", packError.message);
            }

            // 4. Ingredients -> WINE_INGREDIENT
            if (wineData.selected_ingredients && wineData.selected_ingredients.length > 0) {
                // Clean up old if re-saving
                await supabase.from('WINE_INGREDIENT').delete().eq('gtin', savedGtin);

                const ingredientsInsert = wineData.selected_ingredients.map((code: string) => ({
                    gtin: savedGtin,
                    ingredient_code: code
                }));

                const { error: ingError } = await supabase
                    .from('WINE_INGREDIENT')
                    .insert(ingredientsInsert);

                if (ingError) throw ingError;
            }

            // 5. Descriptive Info -> DESCRIPTIVE_INFO (Extra table)
            const descriptivePayload = {
                gtin: savedGtin,
                aroma_description: wineData.selectedAromas ? wineData.selectedAromas.join(', ') : null,
                taste_profile: wineData.taste_profile,
                expiry_date: wineData.expiry_date || null
            };

            const { error: descError } = await supabase
                .from('DESCRIPTIVE_INFO')
                .upsert(descriptivePayload);

            if (descError) console.warn("Descriptive info error:", descError.message);


            // 6. Aromas -> WINE_AROMA
            if (wineData.selectedAromas && wineData.selectedAromas.length > 0) {
                await supabase.from('WINE_AROMA').delete().eq('gtin', savedGtin);
                const aromaInsert = wineData.selectedAromas.map((aroma: string) => ({
                    gtin: savedGtin,
                    aroma_code: aroma
                }));
                const { error: aromaError } = await supabase.from('WINE_AROMA').insert(aromaInsert);
                if (aromaError) console.warn("Aroma error:", aromaError.message);
            }

            // 7. Characteristics/Taste -> WINE_TASTE
            if (wineData.selectedChars && wineData.selectedChars.length > 0) {
                await supabase.from('WINE_TASTE').delete().eq('gtin', savedGtin);
                const tasteInsert = wineData.selectedChars.map((char: string) => ({
                    gtin: savedGtin,
                    taste_code: char
                }));
                const { error: tasteError } = await supabase.from('WINE_TASTE').insert(tasteInsert);
                if (tasteError) console.warn("Taste error:", tasteError.message);
            }

            // 8. Texture -> WINE_TEXTURE (If exists in UI)
            if (wineData.selectedTexture && wineData.selectedTexture.length > 0) {
                await supabase.from('WINE_TEXTURE').delete().eq('gtin', savedGtin);
                const textureInsert = wineData.selectedTexture.map((tex: string) => ({
                    gtin: savedGtin,
                    texture_code: tex
                }));
                const { error: texError } = await supabase.from('WINE_TEXTURE').insert(textureInsert);
                if (texError) console.warn("Texture error:", texError.message);
            }

            // Success!
            alert("Wine successfully published!");

            localStorage.removeItem('wine_draft');
            router.push('/dashboard/producer');

        } catch (error: any) {
            console.error("Save failed:", error);
            alert("Error saving wine: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (!wineData) return <div className="p-20 text-center uppercase text-xs tracking-widest animate-pulse">Loading Preview...</div>;

    return (
        <div className="flex flex-col gap-12 animate-in fade-in duration-700">

            {/* 1. TITEL & HEADLINE */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-light text-[#1A1A1A]">6. Final Review</h1>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Digital Label Preview</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-16 items-start">

                {/* VÄNSTER SIDA: DIN URSPRUNGLIGA TEXT */}
                <div className="flex-1">
                    <h2 className="text-4xl font-light text-[#1A1A1A]">Scroll down to look at the whole page</h2>
                </div>

                {/* HÖGER SIDA: IPHONE PREVIEW */}
                <div className={`relative transition-all duration-500 mx-auto lg:mx-0 ${isZoomed ? 'scale-105' : 'scale-100'}`}>

                    <div className="w-[320px] h-[650px] bg-black rounded-[50px] border-[8px] border-[#222] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden relative">

                        <div className="absolute inset-0 bg-white overflow-y-auto no-scrollbar pt-10 pb-10">

                            <div className="px-6 mb-8 text-center">
                                <span className="font-serif italic text-xl tracking-tighter text-[#4E001D]">Journy</span>
                            </div>

                            <div className="px-6 mb-8 text-center">
                                <div className="aspect-[2/3] w-32 bg-gray-100 mx-auto rounded-lg mb-4 shadow-sm border border-gray-50 flex items-center justify-center italic text-[10px] text-gray-300">
                                    {wineData.product_image_url ? (
                                        <img src={wineData.product_image_url} alt="Bottle" className="h-full object-contain" />
                                    ) : (
                                        "Bottle Image"
                                    )}
                                </div>
                                <h3 className="text-2xl font-medium mb-1">{wineData.wine_name || 'Unnamed'}</h3>
                                <p className="text-gray-400 text-xs uppercase tracking-widest">{wineData.brand_name} • {wineData.vintage}</p>
                            </div>

                            <div className="px-6 grid grid-cols-2 gap-4 mb-8 text-center">
                                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                    <p className="text-[9px] text-gray-400 uppercase font-bold">Alcohol</p>
                                    <p className="text-sm font-bold text-[#4E001D]">{wineData.alcohol_content_percent}%</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                    <p className="text-[9px] text-gray-400 uppercase font-bold">Volume</p>
                                    <p className="text-sm font-bold text-[#4E001D]">{wineData.bottle_volume_ml}</p>
                                </div>
                            </div>

                            <div className="px-6 mb-8">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 border-b pb-2">Ingredients</p>
                                <p className="text-xs leading-relaxed text-gray-600 italic">
                                    Grapes, {wineData.selected_ingredients?.join(', ') || 'no additives selected'}.
                                </p>
                            </div>

                            <div className="px-6 mb-8">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 border-b pb-2">Recycling</p>
                                <div className="space-y-3">
                                    {wineData.material_code_bottle && (
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="font-bold">Bottle ({wineData.material_code_bottle})</span>
                                            <span className="text-[#4E001D]">{wineData.disposal_bottle}</span>
                                        </div>
                                    )}
                                    {wineData.material_code_cap && (
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="font-bold">Cap ({wineData.material_code_cap})</span>
                                            <span className="text-[#4E001D]">{wineData.disposal_cap}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="px-10 mt-10 opacity-20 flex justify-center grayscale">
                                <div className="w-16 h-16 bg-black flex items-center justify-center text-white text-[8px]">QR PREVIEW</div>
                            </div>

                        </div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl"></div>
                    </div>

                    <button
                        onClick={() => setIsZoomed(!isZoomed)}
                        className="absolute -right-4 top-10 bg-white border border-gray-200 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-all active:scale-90"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                    </button>
                </div>
            </div>

            {/* NAVIGATION FOOTER */}
            <div className="flex justify-between pt-16 items-center border-t border-gray-100">
                <button
                    onClick={() => router.back()}
                    className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                    Previous
                </button>
                <button
                    onClick={handleFinish}
                    disabled={isSaving}
                    className="bg-[#4E001D] text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-4 shadow-lg disabled:opacity-50"
                >
                    {isSaving ? 'Publishing...' : 'Finish & Publish'}
                    {!isSaving && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" /></svg>}
                </button>
            </div>

        </div>
    );
}