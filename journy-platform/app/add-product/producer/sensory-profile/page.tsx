'use client';

import { useState, useMemo, useEffect } from 'react';
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

// --- HJÄLPKOMPONENT FÖR KLOCKOR ---
const ProfileClock = ({ value, label }: { value: number; label: string }) => {
  const percentage = (value / 12) * 100;
  const circumference = 2 * Math.PI * 20;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-tight text-gray-400">{label}</span>
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle cx="28" cy="28" r="20" stroke="#f3f4f6" strokeWidth="6" fill="transparent" />
          <circle 
            cx="28" cy="28" r="20" stroke="#4E001D" strokeWidth="6" 
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (percentage / 100) * circumference}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-[11px] font-black">{value}</span>
      </div>
    </div>
  );
};

export default function SensoryProfilePage() {
  const router = useRouter();

  // --- STATE ---
  const [selectedIntensity, setSelectedIntensity] = useState('Medium');
  const [selectedHue, setSelectedHue] = useState('Ruby');
  const [clocks, setClocks] = useState({ sweetness: 0, body: 0, acidity: 0, tannins: 0 });
  const [selectedChars, setSelectedChars] = useState<string[]>([]);
  const [selectedTexture, setSelectedTexture] = useState<string[]>([]);
  const [selectedAromas, setSelectedAromas] = useState<string[]>([]);
  const [selectedFood, setSelectedFood] = useState<string[]>([]); // NY STATE FÖR MAT

  // Ladda data
  useEffect(() => {
    const saved = localStorage.getItem('wine_draft');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.clocks) setClocks(parsed.clocks);
      if (parsed.selectedChars) setSelectedChars(parsed.selectedChars);
      if (parsed.selectedTexture) setSelectedTexture(parsed.selectedTexture);
      if (parsed.selectedAromas) setSelectedAromas(parsed.selectedAromas);
      if (parsed.selectedFood) setSelectedFood(parsed.selectedFood);
      if (parsed.intensity) setSelectedIntensity(parsed.intensity);
      if (parsed.hue) setSelectedHue(parsed.hue);
    }
  }, []);

  const colorText = useMemo(() => generateColorDescription(selectedIntensity, selectedHue), [selectedIntensity, selectedHue]);
  const tasteText = useMemo(() => generateFullDescription(selectedChars, selectedTexture, selectedAromas), [selectedChars, selectedTexture, selectedAromas]);

  const toggleSelection = (item: string, state: string[], setState: (val: string[]) => void) => {
    setState(state.includes(item) ? state.filter(i => i !== item) : [...state, item]);
  };

  const handleNext = () => {
    const saved = JSON.parse(localStorage.getItem('wine_draft') || '{}');
    const currentData = { 
      ...saved, 
      intensity: selectedIntensity,
      hue: selectedHue,
      clocks,
      selectedChars,
      selectedTexture,
      selectedAromas,
      selectedFood, // SPARA MATEN HÄR
      taste_profile: tasteText,
      color_description: colorText 
    };
    localStorage.setItem('wine_draft', JSON.stringify(currentData));
    router.push('/add-product/producer/packaging');
  };

  const handleBack = () => {
    const saved = JSON.parse(localStorage.getItem('wine_draft') || '{}');
    router.push(saved.wine_category === 'Sparkling wine' ? '/add-product/producer/fermentation-process' : '/add-product/producer/production-process');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 pb-40 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. VISUAL PROFILE */}
      <section className="space-y-6 text-left">
        <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-[#4E001D]">1. Visual Profile</h2>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
            {/* ... Intensitet & Nyans-knappar ... */}
            <div className="flex flex-col gap-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Intensity</p>
                <div className="flex flex-wrap gap-2">
                    {COLOR_INTENSITY.map(i => (
                        <button key={i} onClick={() => setSelectedIntensity(i)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedIntensity === i ? 'bg-[#4E001D] text-white border-[#4E001D]' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}>{i}</button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Hue</p>
                <div className="flex flex-wrap gap-2">
                    {COLOR_HUES.map(h => (
                        <button key={h} onClick={() => setSelectedHue(h)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedHue === h ? 'bg-[#4E001D] text-white border-[#4E001D]' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}>{h}</button>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* 2. TASTE STRUCTURE */}
      <section className="space-y-6 text-left">
        <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-[#4E001D]">2. Taste Structure</h2>
        <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TASTE_CLOCKS.map(clock => (
              <div key={clock.id} className="space-y-4">
                <ProfileClock label={clock.label} value={clocks[clock.id as keyof typeof clocks]} />
                <input type="range" min="0" max="12" step="1" value={clocks[clock.id as keyof typeof clocks]} onChange={(e) => setClocks({...clocks, [clock.id]: parseInt(e.target.value)})} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#4E001D]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CHARACTER & TEXTURE (Förenklat här för rymd, behåll din fulla version) */}
      <section className="space-y-6 text-left">
        <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-[#4E001D]">3. Character & Texture</h2>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-10">
            <div className="flex flex-wrap gap-2">
                {WINE_CHARACTERISTICS.map(char => (
                    <button key={char} onClick={() => toggleSelection(char, selectedChars, setSelectedChars)} className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${selectedChars.includes(char) ? 'bg-[#4E001D] text-white' : 'bg-white text-gray-400'}`}>{char}</button>
                ))}
            </div>
        </div>
      </section>

      {/* 4. AROMA WHEEL (Behåll din fulla Object.entries mappning här) */}
      <section className="space-y-6 text-left">
        <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-[#4E001D]">4. Aroma Wheel</h2>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-12">
            {Object.entries(WINE_AROMAS).map(([mainCat, subCats]) => (
                <div key={mainCat} className="space-y-6">
                    <h3 className="text-xs font-black text-[#4E001D] border-b border-gray-50 pb-2 uppercase">{mainCat}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {Object.entries(subCats).map(([subTitle, items]) => (
                            <div key={subTitle} className="space-y-3">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{subTitle}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {(items as string[]).map(aroma => (
                                        <button key={aroma} onClick={() => toggleSelection(aroma, selectedAromas, setSelectedAromas)} className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-all ${selectedAromas.includes(aroma) ? 'bg-amber-50 border-amber-200 text-[#4E001D]' : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'}`}>{aroma}</button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* 5. FOOD PAIRINGS */}
<section className="space-y-6 text-left">
  <h2 className="text-[11px] font-bold uppercase tracking-[3px] text-[#4E001D]">5. Food Pairings</h2>
  <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-10">
    
    {/* Vi grupperar efter kategori för bättre överblick */}
    {Array.from(new Set(FOOD_PAIRINGS.map(f => f.category))).map(cat => (
      <div key={cat} className="space-y-4">
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[2px] border-b border-gray-50 pb-2">
          {cat}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {FOOD_PAIRINGS.filter(f => f.category === cat).map((food) => (
            <button
              key={food.id}
              type="button" // Viktigt för att inte trigga form submit
              onClick={() => toggleSelection(food.id, selectedFood, setSelectedFood)}
              className={`flex flex-col items-center justify-center py-4 px-2 rounded-2xl border transition-all gap-2 ${
                selectedFood.includes(food.id)
                  ? 'bg-[#4E001D] border-[#4E001D] text-white'
                  : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-tighter text-center">
                {food.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>
</section>

      {/* FOOTER NAV & PREVIEW */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 p-6 shadow-2xl z-50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <button onClick={handleBack} className="text-[11px] font-bold uppercase tracking-[3px] text-gray-400 hover:text-black">Previous</button>
          <div className="flex-1 space-y-1 text-center md:text-left">
            <p className="text-[10px] font-black uppercase text-[#4E001D] tracking-widest">Live Profile Preview</p>
            <p className="text-xs text-gray-500 italic line-clamp-2">{tasteText || "Select characteristics and aromas..."}</p>
          </div>
          <button onClick={handleNext} className="flex items-center gap-6 group">
            <span className="text-[13px] font-bold uppercase tracking-[3px]">Next</span>
            <div className="w-14 h-14 bg-[#4E001D] rounded-full flex items-center justify-center transition-transform group-hover:translate-x-2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
}