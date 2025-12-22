import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { toggleVisibilityAction, generateQRCodeAction } from '@/app/actions/wine';

export default async function GS1DigitalLinkPage({
    params,
}: {
    params: Promise<{ gtin: string; rest?: string[] }>;
}) {
    const { gtin, rest } = await params;

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

    // Fetch from the complete view
    const { data: wine, error } = await supabase
        .from('wine_full_card')
        .select('*')
        .eq('gtin', gtin)
        .single();

    if (error || !wine) {
        return notFound();
    }

    // CHECK OWNERSHIP (For Management Bar)
    const { data: { user } } = await supabase.auth.getUser();
    let isOwner = false;
    if (user) {
        const { data: producer } = await supabase
            .from('producer')
            .select('id')
            .eq('user_id', user.id)
            .single();
        isOwner = producer?.id === wine.producer_id;
    }

    return (
        <main className="min-h-screen bg-[#FDFDFD] py-12 px-4 flex flex-col items-center gap-8">

            {/* 1. BACK TO DASHBOARD BUTTON (Only for logged in users) */}
            {user && (
                <div className="w-full max-w-[340px] flex justify-start">
                    <Link href="/dashboard/producer" className="group flex items-center gap-3 text-gray-400 hover:text-[#4E001D] transition-colors">
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Dashboard</span>
                    </Link>
                </div>
            )}

            {/* 2. THE PHONE PREVIEW */}
            <div className="w-full max-w-[340px] bg-black rounded-[60px] border-[10px] border-[#222] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden relative min-h-[700px]">
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
                            {wine.product_image_url ? (
                                <img src={wine.product_image_url} alt="Bottle" className="h-full object-contain drop-shadow-2xl" />
                            ) : (
                                <div className="w-24 h-44 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
                                    <span className="italic text-[10px] text-gray-300">Bottle Preview</span>
                                </div>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold mb-1 line-clamp-2 text-[#1A1A1A] tracking-tight">{wine.wine_name}</h3>
                        <p className="text-gray-500 text-[12px] font-medium tracking-tight mb-4">
                            {wine.wine_type || 'Wine'} by {wine.brand_name}
                        </p>

                        <div className="flex items-center gap-6 pt-4 border-t border-gray-50 w-full justify-center">
                            <div className="text-center">
                                <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Year</p>
                                <p className="text-sm font-bold text-[#1A1A1A]">{wine.vintage || 'NV'}</p>
                            </div>
                            <div className="h-6 w-px bg-gray-100" />
                            <div className="text-center">
                                <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Country</p>
                                <p className="text-sm font-bold text-[#1A1A1A]">{wine.producer_country || 'Sverige'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="px-8 grid grid-cols-2 gap-px bg-gray-50 border-y border-gray-50 mb-10">
                        <div className="bg-white py-6 px-4 text-center">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Alcohol</p>
                            <p className="text-xl font-black text-[#4E001D]">{wine.alcohol_content_percent || 0}%</p>
                        </div>
                        <div className="bg-white py-6 px-4 text-center border-l border-gray-50">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Net quantity</p>
                            <p className="text-xl font-black text-[#4E001D]">{wine.bottle_volume_ml || 0} ml</p>
                        </div>
                    </div>

                    {/* Grape Varieties */}
                    {wine.grape_varieties && wine.grape_varieties.length > 0 && (
                        <div className="px-8 mb-16">
                            <h4 className="text-[12px] font-black text-[#1A1A1A] mb-4 uppercase tracking-widest">Grape Varieties</h4>
                            <div className="flex flex-wrap gap-2">
                                {wine.grape_varieties.map((g: string) => (
                                    <div key={g} className="bg-white px-4 py-2 rounded-xl border border-gray-100 text-[11px] font-bold text-gray-600 shadow-sm">
                                        {g}
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
                                            {wine.energy_kj_per_100ml || 0} kJ / {wine.energy_kcal_per_100ml || 0} kcal
                                        </td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="px-6 py-4">
                                            <span className="text-[12px] font-bold text-[#1A1A1A]">Carbohydrates</span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-[12px] font-bold text-gray-800">
                                            {wine.energy_carbs || 0} g
                                        </td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="px-6 py-4">
                                            <span className="text-[11px] text-gray-500 font-medium italic ml-3">of which Sugars</span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-[12px] font-bold text-gray-800">
                                            {wine.energy_carbs_of_sugar || 0} g
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
                            <ProcessItem label="Harvesting" value={wine.harvest_method} />
                            <ProcessItem label="Fermentation" value={wine.fermentation_vessel} />
                            <ProcessItem label="Aging" value={wine.aging_vessel !== 'No aging' && wine.aging_vessel ? `${wine.aging_duration_months} months in ${wine.aging_vessel}` : 'No aging'} />
                            <ProcessItem label="Origin of grapes" value={wine.vineyard_source} />
                        </div>
                    </div>

                    {/* Sensory Profile */}
                    <div className="px-8 mb-16">
                        <h4 className="text-[12px] font-black text-[#1A1A1A] mb-8 uppercase tracking-widest border-l-[3px] border-[#4E001D] pl-3">Sensory Profile</h4>
                        <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100/50 mb-10">
                            <div className="flex flex-col gap-6">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Color</p>
                                    <p className="text-[14px] text-gray-800 font-medium leading-relaxed italic font-serif">
                                        {wine.color_description || (wine.color_intensity && wine.color_hue ? `${wine.color_intensity} ${wine.color_hue.toLowerCase()} color.` : 'Bright and clear.')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Aroma</p>
                                    <p className="text-[14px] text-gray-800 font-medium leading-relaxed italic font-serif">
                                        {wine.aroma_description || 'Fruity and elegant aroma.'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Taste</p>
                                    <p className="text-[14px] text-gray-800 font-medium leading-relaxed italic font-serif">
                                        {wine.taste_profile || 'Well balanced with a smooth finish.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Taste Clocks */}
                        <div className="grid grid-cols-3 gap-4 px-2">
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative w-14 h-14"><TasteCircle value={wine.body_level} /></div>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Fullness</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative w-14 h-14"><TasteCircle value={wine.sweetness_level} /></div>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Sweetness</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative w-14 h-14"><TasteCircle value={wine.acidity_level} /></div>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Acidity</span>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Section (If generated) */}
                    {wine.qr_code_url && (
                        <div className="px-8 mb-16 flex flex-col items-center gap-4">
                            <h4 className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-widest self-start">GS1 QR Code</h4>
                            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                                <img src={wine.qr_code_url} alt="GS1 QR" className="w-32 h-32" />
                            </div>
                            <p className="text-[10px] text-gray-400 text-center px-4 italic">Scan this to reach this product passport.</p>
                        </div>
                    )}

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
                                    <p className="text-[13px] font-bold text-[#1A1A1A]">{wine.aging_potential || 'Best to drink now'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4E001D" strokeWidth="2"><path d="M4 10a4 4 0 108 0 4 4 0 00-8 0zM12 10a4 4 0 108 0 4 4 0 00-8 0zM8 14l8 8" /></svg>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Serving Temp</p>
                                    <p className="text-[13px] font-bold text-[#1A1A1A]">Serveras vid {wine.serving_temp_min_c || 8}-{wine.serving_temp_max_c || 12} C</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sustainability */}
                    <div className="px-8 mb-16">
                        <h4 className="text-[12px] font-black text-[#1A1A1A] mb-6 uppercase tracking-widest">Sustainability</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-medium italic opacity-80 mt-6 px-2">
                            Our production follows strict environmental standards focused on biodiversity and sustainable eco-friendly methods.
                        </p>
                    </div>

                    {/* Recycling Information */}
                    <div className="px-8 mb-16">
                        <h4 className="text-[12px] font-black text-[#1A1A1A] mb-6 uppercase tracking-widest">Recycling Information</h4>
                        <div className="overflow-hidden rounded-[32px] border border-gray-100 shadow-sm mb-8">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-4 py-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Component</th>
                                        <th className="px-4 py-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Material</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {wine.bottle_type && <RecyclingRow component="Bottle" material={wine.bottle_type} />}
                                    {wine.closure_type && <RecyclingRow component="Closure" material={wine.closure_type} />}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Company Diversity (ESG) */}
                    {wine.founding_team_type && wine.founding_team_type !== 'not_specified' && (
                        <div className="px-8 py-12 bg-gray-50/30 border-y border-gray-100 mb-16">
                            <h4 className="text-[11px] font-black text-[#4E001D] mb-8 text-center uppercase tracking-[0.3em]">Company Diversity</h4>
                            <div className="flex justify-center mb-10">
                                <div className="bg-[#4E001D] text-white px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-[#4E001D]/20">
                                    {wine.founding_team_type.replace('_', ' ')} Founded
                                </div>
                            </div>
                            <div className="flex justify-around w-full max-w-[240px] mx-auto">
                                <DiversityStat label="Women" value={`${wine.gender_dist_women || 0}%`} active={wine.gender_dist_women > 0} />
                                <DiversityStat label="Men" value={`${wine.gender_dist_men || 0}%`} />
                                <DiversityStat label="Non-Bin" value={`${wine.gender_dist_non_binary || 0}%`} />
                            </div>
                        </div>
                    )}

                    {/* Responsible Consumption Footer */}
                    <div className="px-10 py-16 text-center flex flex-col items-center gap-10">
                        <p className="text-[12px] font-black text-[#4E001D] uppercase tracking-[0.1em]">Responsible Consumption</p>
                        <div className="space-y-3 text-[11px] text-gray-400 font-medium leading-relaxed italic">
                            <p>Excessive alcohol consumption is harmful to your health.</p>
                            <p>Always drink responsibly.</p>
                            <p>Don’t drink and drive • Don’t drink while pregnant</p>
                        </div>
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

        </main>
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

function RecyclingRow({ component, material }: { component: string, material: string }) {
    return (
        <tr className="bg-white border-b border-gray-50 last:border-0">
            <td className="px-4 py-4 text-[11px] font-bold text-[#1A1A1A]">{component}</td>
            <td className="px-4 py-4 text-[10px] text-gray-500 font-medium">{material}</td>
        </tr>
    );
}
