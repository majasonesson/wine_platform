'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function GeneralInfoPage() {
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // --- STATE ---
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [availableBrands, setAvailableBrands] = useState<string[]>([]);
    const [myCertificates, setMyCertificates] = useState<any[]>([]);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        wine_name: '',
        gtin: '',
        brand_name: '',
        vintage: '',
        selected_certs: [] as string[],
        product_image_url: ''
    });

    // --- 1. HÄMTA DATA ---
    useEffect(() => {
        async function loadProducerData() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: producer } = await supabase
                    .from('producer')
                    .select(`
                        brands, 
                        owner_certificate_instance (
                            certificate_id,
                            certificate (certificate_code)
                        )
                    `)
                    .eq('user_id', user.id)
                    .single();

                if (producer) {
                    setAvailableBrands(producer.brands || []);
                    const certs = producer.owner_certificate_instance?.map((inst: any) =>
                        inst.certificate?.certificate_code
                    ).filter(Boolean) || [];
                    setMyCertificates(certs);
                }

                // CHECK FOR GTIN IN QUERY PARAMS (Edit Mode)
                const urlParams = new URLSearchParams(window.location.search);
                const gtinParam = urlParams.get('gtin');

                if (gtinParam) {
                    // Fetch existing wine data
                    const { data: wine, error } = await supabase
                        .from('wine_full_card')
                        .select('*')
                        .eq('gtin', gtinParam)
                        .single();

                    if (wine) {
                        const existingData = {
                            wine_name: wine.wine_name || '',
                            gtin: wine.gtin || '',
                            brand_name: wine.brand_name || '',
                            vintage: wine.vintage?.toString() || '',
                            selected_certs: wine.certificates || [],
                            product_image_url: wine.product_image_url || ''
                        };
                        setFormData(existingData);
                        if (wine.product_image_url) {
                            setImageUrl(wine.product_image_url);
                        }
                        // Save to draft for subsequent steps
                        localStorage.setItem('wine_draft', JSON.stringify({
                            ...existingData,
                            // Capture other fields from wine_full_card for steps 2-8
                            wine_category: wine.wine_category,
                            wine_type: wine.wine_type,
                            bottle_volume_ml: wine.bottle_volume_ml,
                            alcohol_content_percent: wine.alcohol_content_percent,
                            residual_sugar_gpl: wine.residual_sugar_gpl,
                            total_acidity_gpl: wine.total_acidity_gpl,
                            so2_total_mgpl: wine.so2_total_mgpl,
                            energy_kcal_per_100ml: wine.energy_kcal_per_100ml,
                            energy_kj_per_100ml: wine.energy_kj_per_100ml,
                            energy_carbs_of_sugar: wine.energy_carbs_of_sugar,
                            energy_carbs: wine.energy_carbs,
                            harvest_method: wine.harvest_method,
                            fermentation_vessel: wine.fermentation_vessel,
                            vineyard_source: wine.vineyard_source,
                            aging_vessel: wine.aging_vessel,
                            aging_duration_months: wine.aging_duration_months,
                            dosage_level: wine.dosage_level,
                            secondary_fermentation_time: wine.secondary_fermentation_time,
                            lees_aging: wine.lees_aging,
                            riddling_method: wine.riddling_method,
                            disgorgement_method: wine.disgorgement_method,
                            primary_fermentation_vessel: wine.primary_fermentation_vessel,
                            color_intensity: wine.color_intensity,
                            color_hue: wine.color_hue,
                            color_description: wine.color_description,
                            taste_profile: wine.taste_profile,
                            texture_finish: wine.texture_finish,
                            food_pairing_text: wine.food_pairing_text,
                            serving_temp_min_c: wine.serving_temp_min_c,
                            serving_temp_max_c: wine.serving_temp_max_c,
                            aging_potential: wine.aging_potential,
                            sweetness_level: wine.sweetness_level,
                            body_level: wine.body_level,
                            acidity_level: wine.acidity_level,
                            tannin_level: wine.tannin_level,
                            bottle_type: wine.bottle_type,
                            material_code_bottle: wine.material_code_bottle,
                            closure_type: wine.closure_type,
                            material_code_closure: wine.material_code_closure,
                            capsule_type: wine.capsule_type,
                            material_code_capsule: wine.material_code_capsule,
                            weight_finished_product_g: wine.weight_finished_product_g,
                            grape_varieties: wine.grape_varieties,
                            ingredients: wine.ingredients,
                            aromas: wine.aromas,
                            taste_characteristics: wine.taste_characteristics,
                            food_pairings: wine.food_pairings
                        }));
                    }
                } else {
                    // Normal Draft Mode
                    const saved = localStorage.getItem('wine_draft');
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        setFormData(prev => ({ ...prev, ...parsed }));
                        if (parsed.product_image_url) {
                            setImageUrl(parsed.product_image_url);
                        }
                    }
                }
            } catch (err) {
                console.error("Kunde inte ladda data:", err);
            } finally {
                setLoading(false);
            }
        }
        loadProducerData();
    }, []);

    // --- 2. HANDLERS ---

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!formData.gtin) {
            alert("Please enter GTIN first before uploading the image.");
            return;
        }

        try {
            setIsUploading(true);

            const response = await fetch(
                `/api/users/update-avatar?filename=${file.name}&type=wine&id=${formData.gtin}`,
                {
                    method: 'POST',
                    body: file
                }
            );

            const data = await response.json();

            if (!response.ok && !data.url) {
                throw new Error(data.error || "Upload failed");
            }

            const finalUrl = data.url;

            // 1. Uppdatera UI preview
            setImageUrl(finalUrl);

            // 2. Uppdatera formData state
            const updatedFormData = { ...formData, product_image_url: finalUrl };
            setFormData(updatedFormData);

            // 3. Spara direkt i draft så bilden inte försvinner
            localStorage.setItem('wine_draft', JSON.stringify(updatedFormData));

            alert("Image uploaded and saved to draft!");

        } catch (error: any) {
            console.error("Upload error:", error);
            alert("Upload failed: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleNext = () => {
        const saved = JSON.parse(localStorage.getItem('wine_draft') || '{}');
        localStorage.setItem('wine_draft', JSON.stringify({ ...saved, ...formData }));
        router.push('/add-product/product-info');
    };

    if (loading) return <div className="p-20 text-[#4E001D] animate-pulse uppercase tracking-widest text-xs font-bold">Loading profile...</div>;

    return (
        <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl font-medium tracking-tight text-[#1A1A1A]">
                1. General Information
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                {/* VÄNSTER: BILDUPPLADDNING */}
                <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400">Wine Bottle Image</label>
                    <div
                        className="aspect-[3/4] w-full max-w-[320px] bg-[#FDFDFD] border border-gray-100 rounded-[32px] flex items-center justify-center overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md transition-all"
                        onClick={() => {
                            if (!isUploading) document.getElementById('file-upload')?.click();
                        }}
                    >
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-6 h-6 border-2 border-[#4E001D] border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[9px] uppercase tracking-widest text-[#4E001D]">Uploading...</span>
                            </div>
                        ) : imageUrl ? (
                            <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-gray-300 group-hover:text-[#4E001D] transition-colors text-center p-6">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                <span className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Click to upload bottle image</span>
                            </div>
                        )}
                    </div>
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={handleImageUpload}
                    />
                </div>

                {/* HÖGER: FORMULÄR */}
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Brand Name</label>
                        <select
                            className="border-b border-gray-200 py-3 bg-transparent outline-none focus:border-[#4E001D] transition-colors appearance-none cursor-pointer"
                            value={formData.brand_name}
                            onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                        >
                            <option value="">Select your brand</option>
                            {availableBrands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Wine Name</label>
                        <input
                            placeholder="e.g. Heritage Reserve"
                            className="border-b border-gray-200 py-3 outline-none focus:border-[#4E001D] transition-colors"
                            value={formData.wine_name}
                            onChange={(e) => setFormData({ ...formData, wine_name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-10">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">GTIN</label>
                            <input
                                placeholder="73000..."
                                className="border-b border-gray-200 py-3 outline-none focus:border-[#4E001D] transition-colors"
                                value={formData.gtin}
                                onChange={(e) => setFormData({ ...formData, gtin: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Vintage</label>
                            <input
                                type="number"
                                placeholder="2024"
                                className="border-b border-gray-200 py-3 outline-none focus:border-[#4E001D] transition-colors"
                                value={formData.vintage}
                                onChange={(e) => setFormData({ ...formData, vintage: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* CERTIFIKAT */}
                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Certificates</label>
                        <div className="flex flex-wrap gap-2">
                            {myCertificates.length > 0 ? myCertificates.map(cert => (
                                <button
                                    key={cert}
                                    type="button"
                                    onClick={() => {
                                        const active = formData.selected_certs.includes(cert);
                                        setFormData({
                                            ...formData,
                                            selected_certs: active
                                                ? formData.selected_certs.filter(c => c !== cert)
                                                : [...formData.selected_certs, cert]
                                        });
                                    }}
                                    className={`px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest transition-all ${formData.selected_certs.includes(cert)
                                        ? 'bg-[#4E001D] text-white border-[#4E001D]'
                                        : 'bg-white text-gray-400 border border-gray-200 hover:border-gray-400'
                                        }`}
                                >
                                    {cert}
                                </button>
                            )) : (
                                <p className="text-[11px] text-gray-400 italic">No certificates found in your profile.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER NAV */}
            <div className="flex justify-end pt-12 border-t border-gray-50">
                <button
                    onClick={handleNext}
                    disabled={isUploading}
                    className="flex items-center gap-6 group cursor-pointer disabled:opacity-50"
                >
                    <span className="text-[13px] font-bold uppercase tracking-[3px]">Next</span>
                    <div className="w-14 h-14 bg-[#4E001D] rounded-full flex items-center justify-center transition-transform group-hover:translate-x-2">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    );
}