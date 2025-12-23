'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { publishWineAction } from './actions';
import { generateFullDescription } from '@/utils/constants';

export default function PreviewProductPage() {
    const router = useRouter();
    const [wineData, setWineData] = useState<any>(null);
    const [producerInfo, setProducerInfo] = useState<any>(null);
    const [ingredientsList, setIngredientsList] = useState<any[]>([]);
    const [sparklingTypeName, setSparklingTypeName] = useState<string>('');
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

        async function fetchExtraData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch Producer Detail (Location, Name, ESG)
            const { data: producer } = await supabase
                .from('producer')
                .select(`
                    *,
                    geo_region:geo_region_id (
                        region_name,
                        geographical_area,
                        country:country_code (
                            name_en,
                            name_sv
                        )
                    ),
                    producer_certificate (
                        id,
                        reference_number,
                        expiry_date,
                        certificate:certificate_id (
                            certificate_code
                        )
                    )
                `)
                .eq('user_id', user.id)
                .single();

            setProducerInfo(producer);

            // Fetch Ingredient Names
            const { data: ings } = await supabase.from('ingredient_code').select('code, name_en');
            setIngredientsList(ings || []);

            // Fetch Sparkling Type Name if applicable
            const saved = localStorage.getItem('wine_draft');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.wine_sparkling_attribute_number) {
                    const { data: sType } = await supabase
                        .from('wine_sparkling')
                        .select('name')
                        .eq('attribute_number', parsed.wine_sparkling_attribute_number)
                        .single();
                    if (sType) setSparklingTypeName(sType.name);
                }
            }
        }

        fetchExtraData();
    }, []);

    const handlePublish = async () => {
        if (!wineData) return;
        setIsSaving(true);
        const result = await publishWineAction(wineData);
        if (result.success) {
            alert("Congratulations! Your wine has been published.");
            localStorage.removeItem('wine_draft');
            router.push('/dashboard/producer');
        } else {
            alert("Error publishing wine: " + result.error);
        }
        setIsSaving(false);
    };

    if (!wineData) return <div className="p-20 text-center uppercase text-xs tracking-widest animate-pulse">Loading Preview...</div>;

    const getIngredientName = (code: string) => {
        const ing = ingredientsList.find(i => i.code === code);
        return ing ? ing.name_en : code;
    };

    const sulphiteValue = wineData.so2_total_mgpl || 0;
    const sulphiteText = `${sulphiteValue} mg/L`;

    // Map grapes array to string
    const grapeVarietyText = wineData.grapes?.length > 0
        ? wineData.grapes.map((g: any) => `${g.percentage}% ${g.grape_name}`).join(', ')
        : (wineData.wine_type || 'Solaris');

    return (
        <div className="flex flex-col gap-12 animate-in fade-in duration-700 pb-20 max-w-6xl mx-auto px-4 md:px-8">

            <div className="flex flex-col gap-2 mb-4">
                <h1 className="text-4xl font-light text-[#1A1A1A]">8. Final Review</h1>

            </div>

            <div className="flex flex-col lg:flex-row gap-16 items-start justify-center">

                {/* LEFT SIDE: Action Panel */}
                <div className="lg:w-[400px] w-full flex flex-col gap-10 lg:sticky lg:top-12">
                    <div className="bg-white p-10 rounded-[40px] shadow-[0px_4px_25px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col gap-6">

                        <p className="text-gray-500 text-sm leading-relaxed">
                            Scroll down to look at the whole page     </p>

                        <div className="flex flex-col gap-3 pt-4">
                            <button
                                onClick={handlePublish}
                                disabled={isSaving}
                                className="bg-[#4E001D] text-white w-full py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-4 shadow-xl disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isSaving ? 'Publishing...' : 'Publish Product'}
                                {!isSaving && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" /></svg>}
                            </button>
                            <div className="flex gap-3">
                                <button onClick={() => router.back()} className="flex-1 py-4 border border-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                                    Previous
                                </button>
                            </div>
                        </div>
                    </div>


                </div>

                {/* CENTRE/RIGHT: THE PHONE PREVIEW (The DPP Experience) */}
                <div className="shrink-0 mx-auto">
                    <div className="w-[340px] h-[700px] bg-black rounded-[60px] border-[10px] border-[#222] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden relative">
                        <div className="absolute inset-x-0 bottom-0 top-0 bg-white overflow-y-auto no-scrollbar pb-24">

                            {/* Educational Disclaimer */}
                            <div className="px-8 pt-12 pb-4 text-center">
                                <p className="text-[9px] text-gray-400 leading-tight uppercase tracking-wider font-semibold px-2">
                                    This information is provided for educational purposes only. It does not encourage the consumption of alcohol.
                                </p>
                            </div>

                            {/* Brand Header */}
                            <div className="py-6 px-8 text-center">
                                <span className="font-serif italic text-3xl tracking-tighter text-[#4E001D]">Journy</span>
                            </div>

                            {/* Product Identity */}
                            <div className="px-8 mb-10 text-center flex flex-col items-center">
                                <div className="h-52 w-auto aspect-[1/2] mx-auto mb-8 flex items-center justify-center relative">
                                    {wineData.product_image_url ? (
                                        <img src={wineData.product_image_url} alt="Bottle" className="h-full object-contain drop-shadow-2xl" />
                                    ) : (
                                        <div className="w-24 h-44 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
                                            <span className="italic text-[10px] text-gray-300">Bottle Preview</span>
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold mb-1 line-clamp-2 text-[#1A1A1A] tracking-tight">{wineData.wine_name || 'Gretas'}</h3>
                                <p className="text-gray-500 text-[12px] font-medium tracking-tight mb-4">
                                    {sparklingTypeName || wineData.wine_type || 'Red'} wine by {wineData.brand_name || 'Winely'}
                                </p>

                                <div className="flex items-center gap-6 pt-4 border-t border-gray-50 w-full justify-center">
                                    <div className="text-center">
                                        <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Year</p>
                                        <p className="text-sm font-bold text-[#1A1A1A]">{wineData.vintage || '2024'}</p>
                                    </div>
                                    <div className="h-6 w-px bg-gray-100" />
                                    <div className="text-center">
                                        <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Country</p>
                                        <p className="text-sm font-bold text-[#1A1A1A]">
                                            {producerInfo?.geo_region?.country?.name_sv || producerInfo?.geo_region?.country?.name_en || 'Sverige'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="px-8 grid grid-cols-2 gap-px bg-gray-50 border-y border-gray-50 mb-10">
                                <div className="bg-white py-6 px-4 text-center">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Alcohol</p>
                                    <p className="text-xl font-black text-[#4E001D]">{wineData.alcohol_content_percent || 0}%</p>
                                </div>
                                <div className="bg-white py-6 px-4 text-center border-l border-gray-50">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Net quantity</p>
                                    <p className="text-xl font-black text-[#4E001D]">{wineData.bottle_volume_ml || 0} ml</p>
                                </div>
                            </div>

                            {/* Grape Varieties */}
                            {wineData.grapes && wineData.grapes.length > 0 && (
                                <div className="px-8 mb-16">
                                    <h4 className="text-[12px] font-black text-[#1A1A1A] mb-4 uppercase tracking-widest">Grape Varieties</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {wineData.grapes.map((g: any) => (
                                            <div key={g.grape_name} className="bg-white px-4 py-2 rounded-xl border border-gray-100 text-[11px] font-bold text-gray-600 shadow-sm">
                                                {g.percentage}% {g.grape_name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Nutrition Declaration */}
                            <div className="px-8 mb-16">
                                <h4 className="text-[12px] font-black text-[#1A1A1A] mb-4 uppercase tracking-widest">Nutrition Declaration</h4>
                                <div className="overflow-hidden rounded-[32px] border border-gray-100 shadow-sm">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-6 py-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                                                <th className="px-6 py-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">Per 100 ml</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            <tr className="bg-white">
                                                <td className="px-6 py-4">
                                                    <span className="text-[12px] font-bold text-[#1A1A1A]">Energy</span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-[12px] font-black text-[#4E001D]">
                                                    {wineData.energy_kj_per_100ml || 0} kJ / {wineData.energy_kcal_per_100ml || 0} kcal
                                                </td>
                                            </tr>
                                            <tr className="bg-white">
                                                <td className="px-6 py-4">
                                                    <span className="text-[12px] font-bold text-[#1A1A1A]">Carbohydrates</span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-[12px] font-bold text-gray-800">
                                                    {wineData.energy_carbs || (wineData.residual_sugar_gpl ? (wineData.residual_sugar_gpl / 10).toFixed(1) : 0)} g
                                                </td>
                                            </tr>
                                            <tr className="bg-white">
                                                <td className="px-6 py-4">
                                                    <span className="text-[11px] text-gray-500 font-medium italic ml-3">of which Sugars</span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-[12px] font-bold text-gray-800">
                                                    {wineData.energy_carbs_of_sugar || (wineData.residual_sugar_gpl ? (wineData.residual_sugar_gpl / 10).toFixed(1) : 0)} g
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-[9px] text-gray-400 text-center font-bold uppercase tracking-widest mt-6 leading-relaxed px-4">
                                    Contains small amounts of: Fat, Saturated fat, Protein, and Salt.
                                </p>
                            </div>

                            {/* Production Process */}
                            <div className="px-8 mb-16">
                                <h4 className="text-[12px] font-black text-[#1A1A1A] mb-6 uppercase tracking-widest border-b border-gray-100 pb-3">Production Process</h4>
                                <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                                    <ProcessItem label="Harvesting" value={wineData.harvest_method} />
                                    <ProcessItem label="Fermentation" value={wineData.fermentation_vessel} />
                                    <ProcessItem label="Aging" value={wineData.aging_vessel !== 'No aging' && wineData.aging_vessel ? `${wineData.aging_duration_months} months in ${wineData.aging_vessel}` : 'No aging'} />
                                    <ProcessItem label="Origin of grapes" value={wineData.vineyard_source} />
                                </div>
                            </div>

                            {/* Sensory Profile */}
                            <div className="px-8 mb-16">
                                <h4 className="text-[12px] font-black text-[#1A1A1A] mb-8 uppercase tracking-widest border-l-[3px] border-[#4E001D] pl-3">Sensory Profile</h4>

                                <div className="space-y-8 mb-10">
                                    <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100/50">
                                        <div className="flex flex-col gap-6">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Color</p>
                                                <p className="text-[14px] text-gray-800 font-medium leading-relaxed italic font-serif">
                                                    {wineData.color_description || (wineData.intensity && wineData.hue ? `${wineData.intensity} ${wineData.hue.toLowerCase()} color.` : 'Light yellow color.')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Aroma</p>
                                                <p className="text-[14px] text-gray-800 font-medium leading-relaxed italic font-serif">
                                                    {wineData.selectedAromas?.length > 0
                                                        ? `Fruity, spicy smell with notes of ${wineData.selectedAromas.join(', ').toLowerCase()}.`
                                                        : 'Fruity, spicy smell with oak character.'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Taste</p>
                                                <div className="flex flex-col gap-2">
                                                    <p className="text-[14px] text-gray-800 font-medium leading-relaxed italic font-serif">
                                                        {generateFullDescription(
                                                            wineData.selectedChars || [],
                                                            wineData.selectedTexture || [],
                                                            wineData.selectedAromas || []
                                                        ) || 'Complex and elegant wine with balanced notes.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Taste Clocks */}
                                    <div className="grid grid-cols-3 gap-4 px-2">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="relative w-14 h-14">
                                                <TasteCircle value={wineData.clocks?.body || 0} />
                                            </div>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Fullness</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="relative w-14 h-14">
                                                <TasteCircle value={wineData.clocks?.sweetness || 0} />
                                            </div>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Sweetness</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="relative w-14 h-14">
                                                <TasteCircle value={wineData.clocks?.acidity || 0} />
                                            </div>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Acidity</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Serving & Storage */}
                            <div className="px-8 mb-16">
                                <h4 className="text-[12px] font-black text-[#1A1A1A] mb-6 uppercase tracking-widest">Serving & Storage</h4>
                                <div className="space-y-6 bg-[#4E001D]/[0.02] p-8 rounded-[40px] border border-[#4E001D]/10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4E001D" strokeWidth="2"><path d="M12 2v20M5 12h14" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Consumption Advice</p>
                                            <p className="text-[13px] font-bold text-[#1A1A1A]">{wineData.aging_potential || 'Best to drink now'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4E001D" strokeWidth="2"><path d="M4 10a4 4 0 108 0 4 4 0 00-8 0zM12 10a4 4 0 108 0 4 4 0 00-8 0zM8 14l8 8" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Serving Temp</p>
                                            <p className="text-[13px] font-bold text-[#1A1A1A]">Serveras vid {wineData.serving_temp_min || 8}-{wineData.serving_temp_max || 12} C</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4">Best paired with</p>
                                        <div className="flex flex-wrap gap-2">
                                            {wineData.selectedFood?.length > 0 ? wineData.selectedFood.map((f: string) => (
                                                <div key={f} className="bg-white px-4 py-2 rounded-xl border border-gray-100 text-[11px] font-bold text-gray-600 shadow-sm capitalize">
                                                    {f.replace('_', ' ')}
                                                </div>
                                            )) : (
                                                <div className="text-[11px] font-medium text-gray-400 italic">No pairings suggested</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ingredients & Sugar */}
                            <div className="px-8 grid grid-cols-2 gap-8 mb-16">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Ingredients</p>
                                    <p className="text-[12px] text-gray-700 leading-relaxed font-serif italic">
                                        Grapes, {wineData.selected_ingredients?.map((c: string) => getIngredientName(c)).join(', ') || 'sulphites'}.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Residual Sugar</p>
                                    <p className="text-lg font-bold text-[#1A1A1A]">{wineData.residual_sugar_gpl || 0} <span className="text-[10px] text-gray-400 uppercase">g/L</span></p>
                                </div>
                            </div>



                            {/* Sustainability */}
                            <div className="px-8 mb-16">
                                <h4 className="text-[12px] font-black text-[#1A1A1A] mb-6 uppercase tracking-widest">Sustainability</h4>

                                {producerInfo?.producer_certificate?.length > 0 ? (
                                    <div className="space-y-6">
                                        {producerInfo.producer_certificate.map((pc: any) => (
                                            <div key={pc.id} className="flex items-start gap-4 p-5 rounded-3xl bg-gray-50/50 border border-gray-100/50">
                                                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center border border-green-100 shrink-0 shadow-sm">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-bold text-[#1A1A1A] mb-1">{pc.certificate?.certificate_code || 'Certification'}</p>
                                                    <div className="inline-flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-gray-100">
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">REF#</span>
                                                        <span className="text-[11px] font-bold text-gray-600 font-mono">{pc.reference_number || 'DE-ÖKO-001'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100 shrink-0">
                                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-[#1A1A1A] mb-1">Standard Compliance</p>
                                            <div className="inline-flex items-center gap-2 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">REF#</span>
                                                <span className="text-[11px] font-bold text-gray-600 font-mono">EU-REG-2024</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <p className="text-[11px] text-gray-500 leading-relaxed font-medium italic opacity-80 mt-6 px-2">
                                    Our production follows strict environmental standards focused on biodiversity and sustainable eco-friendly methods.
                                </p>
                            </div>

                            {/* Packaging & Recycling */}
                            <div className="px-8 mb-16">
                                <h4 className="text-[12px] font-black text-[#1A1A1A] mb-6 uppercase tracking-widest">Recycling Information</h4>

                                <div className="overflow-hidden rounded-[32px] border border-gray-100 shadow-sm mb-8">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-4 py-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Component</th>
                                                <th className="px-4 py-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Material</th>
                                                <th className="px-4 py-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Instructions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {wineData.bottle_type && (
                                                <RecyclingRow component="Bottle" material={`${wineData.bottle_type} (${wineData.material_code_bottle || 'GL71'})`} instruction={wineData.disposal_bottle || 'Glass collection'} />
                                            )}
                                            {wineData.cap_type && (
                                                <RecyclingRow component="Cap" material={`${wineData.cap_type} (${wineData.material_code_cap || 'ALU41'})`} instruction={wineData.disposal_cap || 'Metal collection'} />
                                            )}
                                            {wineData.cork_type && (
                                                <RecyclingRow component="Cork" material={`${wineData.cork_type} (${wineData.material_code_cork || 'FOR51'})`} instruction={wineData.disposal_cork || 'Organic waste'} />
                                            )}
                                            {wineData.cardboard_type && (
                                                <RecyclingRow component="Box" material={`${wineData.cardboard_type} (${wineData.material_code_cardboard || 'PAP20'})`} instruction={wineData.disposal_cardboard || 'Paper collection'} />
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="bg-[#FDFDFD] p-6 rounded-[24px] border border-gray-100">
                                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium text-center">
                                        Ensure the wine bottle is empty, remove any labels, and separate the components for recycling according to local guidelines.
                                    </p>
                                </div>
                            </div>

                            {/* Company Diversity (ESG) */}
                            {producerInfo?.founding_team_type && producerInfo.founding_team_type !== 'not_specified' && (
                                <div className="px-8 py-12 bg-gray-50/30 border-y border-gray-100 mb-16">
                                    <h4 className="text-[11px] font-black text-[#4E001D] mb-8 text-center uppercase tracking-[0.3em]">Company Diversity</h4>

                                    <div className="flex justify-center mb-10">
                                        <div className="bg-[#4E001D] text-white px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-[#4E001D]/20">
                                            {producerInfo.founding_team_type.replace('_', ' ')} Founded
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="flex flex-col items-center">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Gender distribution</p>
                                            <div className="flex justify-around w-full max-w-[240px]">
                                                <DiversityStat label="Women" value={`${producerInfo?.gender_dist_women || 0}%`} active={producerInfo?.gender_dist_women > 0} />
                                                <DiversityStat label="Men" value={`${producerInfo?.gender_dist_men || 0}%`} />
                                                <DiversityStat label="Non-Bin" value={`${producerInfo?.gender_dist_non_binary || 0}%`} />
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center pt-8 border-t border-gray-100/50">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Leadership positions</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-[#4E001D]">{producerInfo?.women_in_leadership || 0}%</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Women</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Responsible Consumption Footer */}
                            <div className="px-10 py-16 text-center flex flex-col items-center gap-10">
                                <p className="text-[12px] font-black text-[#4E001D] uppercase tracking-[0.1em]">
                                    Responsible Consumption
                                </p>

                                <div className="space-y-3 text-[11px] text-gray-400 font-medium leading-relaxed italic">
                                    <p>Excessive alcohol consumption is harmful to your health.</p>
                                    <p>Always drink responsibly.</p>
                                    <p>Don’t drink and drive • Don’t drink while pregnant</p>
                                    <p>It is illegal for those under the legal drinking age.</p>
                                </div>

                                <button className="text-[#4E001D]/60 border-b border-[#4E001D]/20 pb-1 text-[11px] font-bold uppercase tracking-widest hover:text-[#4E001D] transition-colors">
                                    Do you want to find out more?
                                </button>

                                <div className="mt-16 flex flex-col items-center gap-3">
                                    <span className="font-serif italic text-3xl text-[#4E001D] opacity-40">Journy</span>
                                    <p className="text-[9px] text-gray-300 uppercase tracking-widest font-bold">@Journy2025 all rights reserved</p>
                                </div>
                            </div>

                        </div>

                        {/* iPhone Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-[#222] rounded-b-[24px] pointer-events-none z-50 shadow-inner">
                            <div className="absolute top-1/2 -translate-y-1/2 right-6 w-2 h-2 rounded-full bg-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DiversityStat({ label, value, active = false }: { label: string, value: string, active?: boolean }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <span className={`text-[16px] font-black ${active ? 'text-[#4E001D]' : 'text-gray-300'}`}>{value}</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
        </div>
    );
}

function ProcessItem({ label, value }: { label: string, value: string }) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-[13px] text-gray-800 font-bold leading-tight">{value}</p>
        </div>
    );
}
function TasteCircle({ value }: { value: number }) {
    const percentage = ((value || 0) / 12) * 100;
    const circumference = 2 * Math.PI * 20;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg className="w-full h-full rotate-[180deg]">
            <circle cx="28" cy="28" r="20" stroke="#f3f4f6" strokeWidth="4" fill="transparent" />
            <circle
                cx="28" cy="28" r="20" stroke="#4E001D" strokeWidth="4"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-in-out"
            />
        </svg>
    );
}

function RecyclingRow({ component, material, instruction }: { component: string, material: string, instruction: string }) {
    return (
        <tr className="bg-white border-b border-gray-50 last:border-0">
            <td className="px-4 py-4 text-[11px] font-bold text-[#1A1A1A]">{component}</td>
            <td className="px-4 py-4 text-[10px] text-gray-500 font-medium">{material}</td>
            <td className="px-4 py-4 text-[10px] text-[#4E001D] font-bold italic">{instruction}</td>
        </tr>
    );
}
