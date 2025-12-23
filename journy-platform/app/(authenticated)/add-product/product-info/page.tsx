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
  const [dbGrapes, setDbGrapes] = useState<{ attribute_number: string, name: string, is_blend: boolean, components: string[] }[]>([]);
  const [dbSparklingTypes, setDbSparklingTypes] = useState<{ attribute_number: string, name: string }[]>([]);
  const [formData, setFormData] = useState({
    wine_category: '',
    wine_type: '',
    bottle_volume_ml: '',
    variety_gpc_code: '', // Global GS1 Classification
    wine_sparkling_attribute_number: '', // New Field
    grapes: [] as { grape_name: string; percentage: string; attribute_number?: string }[]
  });

  // --- 1. HÄMTA DATA ---
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Grapes
        const { data: grapesData } = await supabase
          .from('grape_variety_master')
          .select('*')
          .order('name', { ascending: true });

        if (grapesData) {
          setDbGrapes(grapesData);
        }

        // Fetch Sparkling Types
        const { data: sparklingData } = await supabase
          .from('wine_sparkling')
          .select('*')
          .order('name', { ascending: true });

        if (sparklingData) {
          setDbSparklingTypes(sparklingData);
        }

        const saved = localStorage.getItem('wine_draft');
        if (saved) {
          const parsed = JSON.parse(saved);
          setFormData(prev => ({
            ...prev,
            ...parsed,
            wine_category: parsed.wine_category || '',
            wine_type: parsed.wine_type || '',
            bottle_volume_ml: parsed.bottle_volume_ml || '',
            wine_sparkling_attribute_number: parsed.wine_sparkling_attribute_number || '',
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

  // --- 2. BLEND MATCHING LOGIC ---
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (formData.grapes.length === 0) {
      setFormData(prev => ({ ...prev, variety_gpc_code: '' }));
      return;
    }

    const currentNames = formData.grapes.map(g => g.grape_name).sort();

    const match = dbGrapes.find(master => {
      if (formData.grapes.length === 1) {
        return !master.is_blend && master.name === currentNames[0];
      }

      if (!master.is_blend || !master.components || master.components.length !== currentNames.length) return false;

      const masterComponents = [...master.components].sort();
      return masterComponents.every((name, i) => name.toUpperCase() === currentNames[i].toUpperCase());
    });

    if (match) {
      setFormData(prev => ({ ...prev, variety_gpc_code: match.attribute_number }));
    } else {
      setFormData(prev => ({ ...prev, variety_gpc_code: '' }));
    }
  }, [formData.grapes, dbGrapes]);

  const addGrape = (grapeAttr: string) => {
    if (!grapeAttr) return;
    const grapeDetails = dbGrapes.find(g => g.attribute_number === grapeAttr);
    if (!grapeDetails) return;

    let grapesToAdd: { grape_name: string; percentage: string; attribute_number?: string }[] = [];

    if (grapeDetails.is_blend && grapeDetails.components.length > 0) {
      // If it's a blend, add each component
      grapeDetails.components.forEach(compName => {
        const compDetails = dbGrapes.find(g => g.name.toUpperCase() === compName.toUpperCase());
        if (compDetails && !formData.grapes.find(g => g.attribute_number === compDetails.attribute_number)) {
          grapesToAdd.push({
            grape_name: compDetails.name,
            percentage: '',
            attribute_number: compDetails.attribute_number
          });
        }
      });
    } else {
      // Single grape
      if (!formData.grapes.find(g => g.attribute_number === grapeAttr)) {
        grapesToAdd.push({
          grape_name: grapeDetails.name,
          percentage: '',
          attribute_number: grapeDetails.attribute_number
        });
      }
    }

    if (grapesToAdd.length > 0) {
      setFormData({
        ...formData,
        grapes: [...formData.grapes, ...grapesToAdd]
      });
    }
    setSearchTerm('');
    setIsDropdownOpen(false);
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
    router.push('/add-product/ingredients');
  };

  const handleBack = () => {
    saveToDraft();
    router.push('/add-product/general-info');
  };

  const filteredDbGrapes = dbGrapes.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 50); // Limit list for performance

  if (loading) return <div className="p-20 text-[#4E001D] animate-pulse uppercase tracking-widest text-xs font-bold">Loading options...</div>;

  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 text-left">
      <h1 className="text-3xl font-medium tracking-tight text-[#1A1A1A]">
        2. Product Information
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 leading-relaxed">
        {/* VÄNSTER: DROPDOWNS */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2 lowercase">
            <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Wine Category</label>
            <select
              className="border-b border-gray-200 py-3 bg-transparent outline-none focus:border-[#4E001D] transition-colors appearance-none cursor-pointer"
              value={formData.wine_category}
              onChange={(e) => {
                const newCat = e.target.value;
                setFormData({
                  ...formData,
                  wine_category: newCat,
                  // Reset sparkling type if category changes away from sparkling
                  wine_sparkling_attribute_number: newCat === 'Sparkling wine' ? formData.wine_sparkling_attribute_number : ''
                });
              }}
            >
              <option value="">Select category</option>
              {WINE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Conditional Sparkling Type */}
          {formData.wine_category === 'Sparkling wine' && (
            <div className="flex flex-col gap-2 lowercase animate-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-bold uppercase tracking-[3px] text-[#4E001D]">Sparkling type</label>
              <select
                className="border-b border-gray-200 py-3 bg-transparent outline-none focus:border-[#4E001D] transition-colors appearance-none cursor-pointer"
                value={formData.wine_sparkling_attribute_number}
                onChange={(e) => setFormData({ ...formData, wine_sparkling_attribute_number: e.target.value })}
              >
                <option value="">Select sparkling type</option>
                {dbSparklingTypes.map(type => (
                  <option key={type.attribute_number} value={type.attribute_number}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-2 lowercase">
            <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Wine Type</label>
            <select
              className="border-b border-gray-200 py-3 bg-transparent outline-none focus:border-[#4E001D] transition-colors appearance-none cursor-pointer"
              value={formData.wine_type}
              onChange={(e) => setFormData({ ...formData, wine_type: e.target.value })}
            >
              <option value="">Select type</option>
              {WINE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2 relative lowercase">
            <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400 font-sans">Net Quantity</label>
            <select
              className="border-b border-gray-200 py-3 bg-transparent outline-none focus:border-[#4E001D] transition-colors appearance-none cursor-pointer"
              value={formData.bottle_volume_ml}
              onChange={(e) => setFormData({ ...formData, bottle_volume_ml: e.target.value })}
            >
              <option value="">Select volume</option>
              {BOTTLE_VOLUMES.map(vol => <option key={vol} value={vol}>{vol}</option>)}
            </select>
          </div>

          {/* GS1 GPC Badge */}
          {formData.variety_gpc_code && (
            <div className="flex items-center gap-3 bg-[#4E001D]/5 p-4 rounded-2xl border border-[#4E001D]/10 animate-in fade-in zoom-in duration-500">
              <div className="w-8 h-8 rounded-full bg-[#4E001D] flex items-center justify-center shrink-0 shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
            </div>
          )}
        </div>

        {/* HÖGER: DRUVOR */}
        <div className="flex flex-col gap-6 bg-[#FDFDFD] p-8 rounded-[32px] border border-gray-100 shadow-sm relative">
          <label className="text-[10px] font-bold uppercase tracking-[3px] text-[#4E001D]">Grape Varieties & Blend %</label>

          <div className="relative">
            <input
              type="text"
              placeholder="Search grape or blend..."
              className="w-full bg-white border border-gray-100 rounded-xl p-3 pl-10 text-sm outline-none focus:border-[#4E001D] shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </div>

            {isDropdownOpen && searchTerm && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                {filteredDbGrapes.length > 0 ? (
                  filteredDbGrapes.map(g => (
                    <button
                      key={g.attribute_number}
                      className="w-full text-left px-5 py-4 hover:bg-[#4E001D]/5 text-sm transition-colors border-b border-gray-50 last:border-0 flex items-center justify-between group"
                      onClick={() => addGrape(g.attribute_number)}
                    >
                      <span className="font-medium text-gray-700">{g.name}</span>
                      <span className="text-[10px] uppercase tracking-widest text-[#4E001D] opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                    </button>
                  ))
                ) : (
                  <div className="p-10 text-center text-gray-400 text-xs italic">No matching varieties found.</div>
                )}
              </div>
            )}

            {/* Backdrop to close dropdown */}
            {isDropdownOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
            )}
          </div>

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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
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