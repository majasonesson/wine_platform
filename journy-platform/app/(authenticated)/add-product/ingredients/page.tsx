'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function IngredientsPage() {
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [loading, setLoading] = useState(true);
    const [dbIngredients, setDbIngredients] = useState<{ code: string; is_allergen: boolean; name_sv?: string; name_en?: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        alcohol_content_percent: 0,
        residual_sugar_gpl: 0,
        total_acidity_gpl: 0,
        so2_total_mgpl: 0,
        expiry_date: '',
        selected_ingredients: [] as string[],
        energy_kcal_per_100ml: 0,
        energy_kj_per_100ml: 0,
        energy_carbs: 0,
        energy_carbs_of_sugar: 0
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase.from('ingredient_code').select('*').order('code');
                if (data) setDbIngredients(data);

                const saved = localStorage.getItem('wine_draft');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setFormData(prev => ({ ...prev, ...parsed }));
                }
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [supabase]);

    const saveToDraft = () => {
        const saved = JSON.parse(localStorage.getItem('wine_draft') || '{}');
        localStorage.setItem('wine_draft', JSON.stringify({ ...saved, ...formData }));
    };

    const adjustValue = (field: string, delta: number, isFloat: boolean = true) => {
        setFormData(prev => {
            const currentVal = Number(prev[field as keyof typeof prev]) || 0;
            // Round to 1 decimal place if float, otherwise integer
            const newValRaw = currentVal + delta;
            const newVal = isFloat ? parseFloat(newValRaw.toFixed(1)) : Math.round(newValRaw);
            return { ...prev, [field]: newVal < 0 ? 0 : newVal };
        });
    };

    // --- CALCULATIONS ---
    useEffect(() => {
        const alcohol = formData.alcohol_content_percent || 0;
        const sugar = formData.residual_sugar_gpl || 0;
        const acidity = formData.total_acidity_gpl || 0;

        // Calculation logic based on user request:
        // Alcohol (vol%) * 5.55 (Kcal per %?) - Wait, formula usually: (vol% * 0.8 * 7) roughly?
        // User provided: alcoholEnergyKcal = alcoholContent * 5.55
        // Sugar (g/L) -> g/100ml = sugar / 10. Energy = 4 kcal/g. So (sugar/10)*4 = sugar * 0.4
        // User provided: sugarEnergyKcal = ((sugarContent * 100) / 1000) * 4  => (sugar * 0.1) * 4 = sugar * 0.4. Matches.
        // Organic Acid (g/L?). User provided: organicAcidEnergyKcal = organicAcidContent * 3.12. (Normally negligible but we follow user).
        // Note: ensure 'organicAcidContent' in user formula refers to g/L? Usually acidity is g/L.

        const alcoholEnergy = alcohol * 5.55;
        const sugarEnergy = (sugar / 10) * 4;
        const acidEnergy = (acidity) * 3.12; // Assuming input is appropriate unit, following user logic structure. Note: User code used `OrganicAcid` var.

        /*
          User code:
          const calculateNutrition = (AlcoholVolume, ResidualSugar, OrganicAcid) => {
              const alcoholContent = parseFloat(AlcoholVolume) || 0;
              const sugarContent = parseFloat(ResidualSugar) || 0; 
              const organicAcidContent = parseFloat(OrganicAcid) || 0; 
    
              const alcoholEnergyKcal = alcoholContent * 5.55;
              const sugarEnergyKcal = ((sugarContent * 100) / 1000) * 4;
              const organicAcidEnergyKcal = organicAcidContent * 3.12;
              ...
          }
        */

        const totalKcal = Math.round(alcoholEnergy + sugarEnergy + acidEnergy);
        const totalKj = Math.round(totalKcal * 4.184);

        // EU Nutrition: Carbs and Sugars are typically sugar/10 for 100ml
        const carbs = parseFloat((sugar / 10).toFixed(1));
        const carbsOfSugar = parseFloat((sugar / 10).toFixed(1));

        setFormData(prev => {
            if (
                prev.energy_kcal_per_100ml === totalKcal &&
                prev.energy_kj_per_100ml === totalKj &&
                prev.energy_carbs === carbs &&
                prev.energy_carbs_of_sugar === carbsOfSugar
            ) return prev;

            return {
                ...prev,
                energy_kcal_per_100ml: totalKcal,
                energy_kj_per_100ml: totalKj,
                energy_carbs: carbs,
                energy_carbs_of_sugar: carbsOfSugar
            };
        });

    }, [formData.alcohol_content_percent, formData.residual_sugar_gpl, formData.total_acidity_gpl]);

    const toggleIngredient = (code: string) => {
        setFormData(prev => ({
            ...prev,
            selected_ingredients: prev.selected_ingredients.includes(code)
                ? prev.selected_ingredients.filter(i => i !== code)
                : [...prev.selected_ingredients, code]
        }));
    };

    const handleNext = () => {
        saveToDraft();
        router.push('/add-product/production-process');
    };

    const handleBack = () => {
        saveToDraft();
        // Explicit navigering för att bryta historik-loopen
        router.push('/add-product/product-info');
    };

    // Exact Figma-based Order
    const figmaOrder = [
        'GRAPES', 'SUCROSE', 'CARAMEL', 'ALEPPO_PINE_RESIN', 'GRAPE_MUST',
        'CONCENTRATED_GRAPE_MUST', 'RECTIFIED_CONCENTRATED_GRAPE_MUST',
        'FILLING_DOSAGE', 'SHIPPING_DOSAGE',
        'ARGON_E938', 'NITROGEN_E941', 'CARBON_DIOXIDE_E290', 'PROTECTIVE_ATMOSPHERE',
        'TARTARIC_ACID_E334', 'MALIC_ACID_E296', 'LACTIC_ACID_E270', 'CALCIUM_SULPHATE_E516', 'CITRIC_ACID_E330_ACIDITY',
        'CITRIC_ACID_E330_STABILISING', 'METATARTARIC_ACID_E353', 'GUM_ARABIC_E414', 'YEAST_MANNOPROTEINS', 'CARBOXYMETHYLCELLULOSE_E466',
        'POTASSIUM_SORBATE_E202', 'LYSOZYME_E1105', 'L_ASCORBIC_ACID_E300', 'DMDC',
        'SULPHITES', 'SULFUR_DIOXIDE', 'POTASSIUM_BISULFITE', 'POTASSIUM_METABISULFITE',
        'EGG', 'MILK', 'BICARBONATE'
    ];

    // Create a map for O(1) lookup
    const orderIndexMap = figmaOrder.reduce((acc, code, idx) => ({ ...acc, [code]: idx }), {} as Record<string, number>);

    // Derived sorted ingredients based on Figma index
    const sortedIngredients = [...dbIngredients].sort((a, b) => {
        const indexA = orderIndexMap[a.code] ?? 999;
        const indexB = orderIndexMap[b.code] ?? 999;
        return indexA - indexB;
    });

    const filteredIngredients = sortedIngredients.filter(ing =>
        ing.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ing.name_en && ing.name_en.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) return <div className="p-20 animate-pulse uppercase text-[10px] font-bold tracking-[3px]">Loading...</div>;

    return (
        <div className="flex flex-col gap-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 text-left">
            <section className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-medium tracking-tight text-[#1A1A1A]">2. Product Information</h1>
                    <p className="text-[11px] text-gray-400 uppercase tracking-[1px]">Select all ingredients and additives used in production</p>
                </div>

                <div className="bg-[#FDFDFD] p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-6">
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search ingredients..."
                            className="w-full bg-white border border-gray-100 rounded-xl p-4 pl-12 text-sm outline-none focus:border-[#4E001D] transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg className="absolute left-4 top-4 text-gray-300" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>

                    <div className="flex flex-wrap gap-2 min-h-[100px]">
                        {filteredIngredients.map((ing) => (
                            <button
                                key={ing.code}
                                type="button"
                                onClick={() => toggleIngredient(ing.code)}
                                className={`px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest transition-all border ${formData.selected_ingredients.includes(ing.code)
                                    ? 'bg-[#4E001D] text-white border-[#4E001D]'
                                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                                    }`}
                            >
                                {ing.name_en || ing.code}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-20">
                <div className="flex flex-col gap-10">
                    <h2 className="text-[10px] font-bold uppercase tracking-[3px] text-[#4E001D]">Technical Parameters</h2>
                    <div className="grid grid-cols-1 gap-10">
                        {[
                            { label: 'Alcohol Volume', field: 'alcohol_content_percent', unit: '%', step: 1, isFloat: true },
                            { label: 'Residual Sugar', field: 'residual_sugar_gpl', unit: 'g/L', step: 1, isFloat: true },
                            { label: 'Total Acidity', field: 'total_acidity_gpl', unit: 'g/L', step: 1, isFloat: true },
                            { label: 'Amount of Sulphites', field: 'so2_total_mgpl', unit: 'mg/L', step: 1, isFloat: false },
                        ].map((item) => (
                            <div key={item.field} className="flex flex-col gap-3 group">
                                <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 group-hover:text-[#4E001D] transition-colors">{item.label}</label>
                                <div className="flex items-center gap-6">
                                    <button type="button" onClick={() => adjustValue(item.field, -item.step, item.isFloat !== false)} className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#4E001D] hover:text-white transition-all text-xl">‹</button>
                                    <div className="flex-1 border-b border-gray-100 py-3 flex justify-between items-center px-2 focus-within:border-[#4E001D] transition-colors">
                                        <input type="number" placeholder="0" value={formData[item.field as keyof typeof formData] || ''} onChange={(e) => setFormData({ ...formData, [item.field]: parseFloat(e.target.value) || 0 })} className="bg-transparent outline-none font-medium text-lg w-full" />
                                        <span className="text-gray-300 text-[10px] font-black tracking-tighter">{item.unit}</span>
                                    </div>
                                    <button type="button" onClick={() => adjustValue(item.field, item.step, item.isFloat !== false)} className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#4E001D] hover:text-white transition-all text-xl">›</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ÅTERSTÄLLD: CONDITIONAL BEST BEFORE SECTION */}
                <div className="flex flex-col justify-start">
                    {formData.alcohol_content_percent > 0 && formData.alcohol_content_percent < 10 && (
                        <div className="flex flex-col gap-6 animate-in zoom-in-95 duration-500 bg-amber-50/30 p-10 rounded-[40px] border border-amber-100/50 mt-14">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                <label className="text-[10px] font-bold uppercase tracking-[3px] text-amber-700">Best Before Date</label>
                            </div>
                            <input
                                type="month"
                                value={formData.expiry_date}
                                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                                className="bg-white border border-amber-200 rounded-2xl p-4 outline-none focus:ring-2 ring-amber-100 transition-all text-sm"
                            />
                            <p className="text-[10px] text-amber-600/70 leading-relaxed italic">
                                Mandatory for alcohol content below 10%.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <div className="flex justify-between items-center pt-12 border-t border-gray-50">
                <button type="button" onClick={handleBack} className="text-[11px] font-bold uppercase tracking-[3px] text-gray-400 hover:text-black transition-colors">Previous</button>
                <button type="button" onClick={handleNext} className="flex items-center gap-6 group">
                    <span className="text-[13px] font-bold uppercase tracking-[3px]">Next</span>
                    <div className="w-14 h-14 bg-[#4E001D] rounded-full flex items-center justify-center transition-transform group-hover:translate-x-2">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </div>
                </button>
            </div>
        </div>
    );
}