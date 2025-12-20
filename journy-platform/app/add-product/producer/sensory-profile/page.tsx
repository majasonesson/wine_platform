'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  COLOR_INTENSITY, 
  COLOR_HUES, 
  WINE_AROMAS, 
  WINE_CHARACTERISTICS, 
  WINE_TEXTURE, 
  TASTE_CLOCKS,
  FOOD_PAIRINGS,
  generateFullDescription,
  generateColorDescription
} from '@/utils/constants';

// --- TYPES ---
interface SearchOption {
  id: string;
  label: string;
}

interface FormData {
  intensity: string;
  hue: string;
  clocks: {
    sweetness: number;
    body: number;
    acidity: number;
    tannins: number;
  };
  selectedChars: string[];
  selectedTexture: string[];
  selectedAromas: string[];
  selectedFood: string[];
}

export default function SensoryProfilePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    intensity: '',
    hue: '',
    clocks: { sweetness: 0, body: 0, acidity: 0, tannins: 0 },
    selectedChars: [],
    selectedTexture: [],
    selectedAromas: [],
    selectedFood: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('wine_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, []);

  const colorText = useMemo(() => 
    generateColorDescription(formData.intensity, formData.hue), 
    [formData.intensity, formData.hue]
  );

  const tasteText = useMemo(() => 
    generateFullDescription(formData.selectedChars, formData.selectedTexture, formData.selectedAromas), 
    [formData.selectedChars, formData.selectedTexture, formData.selectedAromas]
  );

  const toggleMulti = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const currentList = prev[field] as string[];
      const newList = currentList.includes(value)
        ? currentList.filter((i: string) => i !== value)
        : [...currentList, value];
      return { ...prev, [field]: newList };
    });
  };

  const saveToDraft = () => {
    const saved = JSON.parse(localStorage.getItem('wine_draft') || '{}');
    localStorage.setItem('wine_draft', JSON.stringify({ 
      ...saved, 
      ...formData,
      taste_profile: tasteText,
      color_description: colorText
    }));
  };

  const handleNext = () => {
    saveToDraft();
    router.push('/add-product/producer/packaging');
  };

  const handleBack = () => {
    saveToDraft();
    const saved = JSON.parse(localStorage.getItem('wine_draft') || '{}');
    router.push(saved.wine_category === 'Sparkling wine' ? '/add-product/producer/fermentation-process' : '/add-product/producer/production-process');
  };

  const flattenedAromas = useMemo(() => {
    const flat: string[] = [];
    Object.values(WINE_AROMAS).forEach((cat: any) => {
      Object.values(cat).forEach((items: any) => {
        flat.push(...items);
      });
    });
    return Array.from(new Set(flat));
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-32 max-w-4xl mx-auto px-4 text-left animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-light text-[#1A1A1A]">4. Sensory Profile</h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest">Visual and taste characteristics</p>
      </div>

      {/* 1. TASTE STRUCTURE (CLOCKS) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-[#FDFDFD] p-10 rounded-[40px] border border-gray-50 shadow-sm">
        {TASTE_CLOCKS.map(clock => (
          <div key={clock.id} className="flex flex-col items-center gap-4">
            <ProfileClock label={clock.label} value={formData.clocks[clock.id as keyof typeof formData.clocks]} />
            <input 
              type="range" min="0" max="12" step="1"
              value={formData.clocks[clock.id as keyof typeof formData.clocks]}
              onChange={(e) => setFormData({
                ...formData, 
                clocks: {...formData.clocks, [clock.id]: parseInt(e.target.value)}
              })}
              className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#4E001D]" 
            />
          </div>
        ))}
      </section>

      {/* 2. DROPDOWNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
        <DropdownSelect 
          label="Color Intensity" 
          value={formData.intensity} 
          options={COLOR_INTENSITY} 
          onSelect={(val: string) => setFormData({...formData, intensity: val})} 
        />
        <DropdownSelect 
          label="Color Hue" 
          value={formData.hue} 
          options={COLOR_HUES} 
          onSelect={(val: string) => setFormData({...formData, hue: val})} 
        />
        <MultiDropdownSelect 
          label="Characteristics" 
          selected={formData.selectedChars} 
          options={WINE_CHARACTERISTICS} 
          onToggle={(val: string) => toggleMulti('selectedChars', val)} 
        />
        <MultiDropdownSelect 
          label="Texture & Mouthfeel" 
          selected={formData.selectedTexture} 
          options={WINE_TEXTURE} 
          onToggle={(val: string) => toggleMulti('selectedTexture', val)} 
        />
      </div>

      {/* 3. SEARCHABLES */}
      <div className="flex flex-col gap-12">
        <SearchableList 
          label="Aromas" 
          selected={formData.selectedAromas} 
          options={flattenedAromas} 
          onToggle={(val: string) => toggleMulti('selectedAromas', val)} 
        />
        <SearchableList 
          label="Food Pairings" 
          selected={formData.selectedFood} 
          options={FOOD_PAIRINGS.map(f => ({ id: f.id, label: f.label }))} 
          onToggle={(val: string) => toggleMulti('selectedFood', val)} 
        />
      </div>

      <div className="flex justify-between pt-16 items-center border-t border-gray-100">
        <button onClick={handleBack} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Previous</button>
        <button onClick={handleNext} className="bg-[#4E001D] text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-4 shadow-lg">
          Next
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ProfileClock({ value, label }: { value: number; label: string }) {
  const percentage = (value / 12) * 100;
  const circumference = 2 * Math.PI * 20;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">{label}</span>
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* rotate-[180deg] gör att den börjar vid klockan 9 */}
        <svg className="w-full h-full rotate-[180deg]">
          <circle cx="32" cy="32" r="20" stroke="#f3f4f6" strokeWidth="5" fill="transparent" />
          <circle 
            cx="32" cy="32" r="20" stroke="#4E001D" strokeWidth="5" 
            fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset} 
            strokeLinecap="round" 
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
      </div>
    </div>
  );
}

// ... DropdownSelect, MultiDropdownSelect och SearchableList förblir desamma som i föregående kodblock ...

function DropdownSelect({ label, value, options, onSelect }: { label: string, value: string, options: string[], onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-[#4E001D] transition-colors">{label}</label>
      <select 
        className="border-b border-gray-200 py-2 bg-transparent outline-none focus:border-[#4E001D] text-sm cursor-pointer appearance-none"
        value={value}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function MultiDropdownSelect({ label, selected, options, onToggle }: { label: string, selected: string[], options: string[], onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</label>
      <select 
        className="border-b border-gray-200 py-2 bg-transparent outline-none focus:border-[#4E001D] text-sm cursor-pointer appearance-none"
        onChange={(e) => { if(e.target.value) onToggle(e.target.value); e.target.value = ""; }}
      >
        <option value="">Add {label.toLowerCase()}...</option>
        {options.map((o) => !selected.includes(o) && <option key={o} value={o}>{o}</option>)}
      </select>
      <div className="flex flex-wrap gap-2 mt-3">
        {selected.map((s) => (
          <button key={s} type="button" onClick={() => onToggle(s)} className="bg-[#4E001D] text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-tighter flex items-center gap-2 hover:bg-red-800 transition-colors">
            {s} <span>×</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SearchableList({ label, selected, options, onToggle }: { label: string, selected: string[], options: (string | SearchOption)[], onToggle: (v: string) => void }) {
  const [query, setQuery] = useState('');
  const filtered = options.filter(o => {
    const s = typeof o === 'string' ? o : o.label;
    return s.toLowerCase().includes(query.toLowerCase());
  }).slice(0, 8);

  return (
    <div className="flex flex-col gap-4 bg-[#F9F9F9] p-8 rounded-[32px] border border-gray-100">
      <label className="text-[10px] font-bold uppercase tracking-widest text-[#4E001D]">{label}</label>
      <input 
        type="text" placeholder="Type to search..." value={query} onChange={e => setQuery(e.target.value)}
        className="bg-white border border-gray-100 rounded-xl p-4 text-sm outline-none focus:border-[#4E001D] transition-all shadow-sm"
      />
      <div className="flex flex-wrap gap-2">
        {selected.map(s => {
          const item = options.find(o => (typeof o === 'string' ? o : o.id) === s);
          const labelText = typeof item === 'string' ? item : item?.label;
          return (
            <button key={s} type="button" onClick={() => onToggle(s)} className="bg-[#4E001D] text-white px-4 py-2 rounded-full text-[10px] font-bold flex items-center gap-2">
              {labelText} ×
            </button>
          );
        })}
      </div>
      {query && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 mt-2">
          {filtered.map(o => {
            const val = typeof o === 'string' ? o : o.id;
            const lab = typeof o === 'string' ? o : o.label;
            if (selected.includes(val)) return null;
            return (
              <button key={val} type="button" onClick={() => { onToggle(val); setQuery(''); }} className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[10px] font-bold text-gray-500 hover:border-[#4E001D] hover:text-[#4E001D] transition-all">
                + {lab}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}