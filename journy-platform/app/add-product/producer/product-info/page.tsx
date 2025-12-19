'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

// --- STATISKA LISTOR ---
const WINE_CATEGORIES = ['Still wine', 'Sparkling wine', 'Fortified wine', 'Liqueur wine'];
const WINE_TYPES = ['Red', 'White', 'Rose', 'Orange', 'Sweet', 'Sparkling'];
const BOTTLE_VOLUMES = ['375ml', '500ml', '750ml', '1500ml', '3000ml'];

export default function ProductInfoPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [dbGrapes, setDbGrapes] = useState<{ name: string }[]>([]);
  const [formData, setFormData] = useState({
    wine_category: '',
    wine_type: '',
    bottle_volume_ml: '',
    grapes: [] as { grape_name: string; percentage: string }[]
  });

  // --- 1. HÄMTA DATA ---
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: grapesData } = await supabase
          .from('grape_variety')
          .select('name')
          .order('name', { ascending: true });

        if (grapesData) {
          setDbGrapes(grapesData);
        }

        const saved = localStorage.getItem('wine_draft');
        if (saved) {
          const parsed = JSON.parse(saved);
          setFormData(prev => ({
            ...prev,
            wine_category: parsed.wine_category || '',
            wine_type: parsed.wine_type || '',
            bottle_volume_ml: parsed.bottle_volume_ml || '',
            grapes: parsed.grapes || []
          }));
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [supabase]);

  // --- 2. HANDLERS ---
  const addGrape = (grapeName: string) => {
    if (!grapeName) return;
    if (formData.grapes.find(g => g.grape_name === grapeName)) return;
    setFormData({
      ...formData,
      grapes: [...formData.grapes, { grape_name: grapeName, percentage: '' }]
    });
  };

  const updateGrapePercentage = (index: number, percent: string) => {
    const newGrapes = [...formData.grapes];
    newGrapes[index].percentage = percent;
    setFormData({ ...formData, grapes: newGrapes });
  };

  const removeGrape = (index: number) => {
    setFormData({
      ...formData,
      grapes: formData.grapes.filter((_, i) => i !== index)
    });
  };

  // --- 3. NAVIGATION ---
  const saveToDraft = () => {
    const saved = JSON.parse(localStorage.getItem('wine_draft') || '{}');
    localStorage.setItem('wine_draft', JSON.stringify({ ...saved, ...formData }));
  };

  const handleNext = () => {
    saveToDraft();
    router.push('/add-product/producer/ingredients');
  };

  // FIX: Explicit push istället för back() för att undvika loop
  const handleBack = () => {
    saveToDraft();
    router.push('/add-product/producer/general-info'); 
  };

  if (loading) return <div className="p-20 text-[#4E001D] animate-pulse uppercase tracking-widest text-xs font-bold">Loading options...</div>;

  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 text-left">
      <h1 className="text-3xl font-medium tracking-tight text-[#1A1A1A]">
        2. Product Information
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        {/* VÄNSTER: DROPDOWNS */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Wine Category</label>
            <select 
              className="border-b border-gray-200 py-3 bg-transparent outline-none focus:border-[#4E001D] transition-colors appearance-none cursor-pointer"
              value={formData.wine_category}
              onChange={(e) => setFormData({...formData, wine_category: e.target.value})}
            >
              <option value="">Select category</option>
              {WINE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Wine Type</label>
            <select 
              className="border-b border-gray-200 py-3 bg-transparent outline-none focus:border-[#4E001D] transition-colors appearance-none cursor-pointer"
              value={formData.wine_type}
              onChange={(e) => setFormData({...formData, wine_type: e.target.value})}
            >
              <option value="">Select type</option>
              {WINE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Net Quantity</label>
            <select 
              className="border-b border-gray-200 py-3 bg-transparent outline-none focus:border-[#4E001D] transition-colors appearance-none cursor-pointer"
              value={formData.bottle_volume_ml}
              onChange={(e) => setFormData({...formData, bottle_volume_ml: e.target.value})}
            >
              <option value="">Select volume</option>
              {BOTTLE_VOLUMES.map(vol => <option key={vol} value={vol}>{vol}</option>)}
            </select>
          </div>
        </div>

        {/* HÖGER: DRUVOR */}
        <div className="flex flex-col gap-6 bg-[#FDFDFD] p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <label className="text-[10px] font-bold uppercase tracking-[3px] text-[#4E001D]">Grape Varieties & Blend %</label>
          
          <select 
            className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm outline-none focus:border-[#4E001D] shadow-sm"
            onChange={(e) => addGrape(e.target.value)}
            value=""
          >
            <option value="">+ Add a grape variety...</option>
            {dbGrapes.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
          </select>

          <div className="flex flex-col gap-3 mt-4">
            {formData.grapes.map((grape, index) => (
              <div key={index} className="flex items-center gap-4 animate-in slide-in-from-right-2 duration-300">
                <div className="flex-1 bg-white border border-gray-100 rounded-xl p-3 text-sm font-medium shadow-sm">
                  {grape.grape_name}
                </div>
                <div className="w-24 relative">
                  <input 
                    type="number"
                    placeholder="%"
                    max="100"
                    min="0"
                    value={grape.percentage}
                    onChange={(e) => updateGrapePercentage(index, e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm outline-none focus:border-[#4E001D] text-center shadow-sm"
                  />
                </div>
                <button 
                  onClick={() => removeGrape(index)}
                  className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            ))}
            {formData.grapes.length === 0 && (
              <p className="text-[11px] text-gray-400 italic text-center py-8 border-2 border-dashed border-gray-50 rounded-2xl">
                No grapes added to the blend yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER NAV */}
      <div className="flex justify-between items-center pt-12 border-t border-gray-50">
        <button 
          onClick={handleBack}
          className="text-[11px] font-bold uppercase tracking-[3px] text-gray-400 hover:text-black transition-colors"
        >
          Previous
        </button>
        
        <button 
          onClick={handleNext}
          className="flex items-center gap-6 group cursor-pointer"
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