'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GenerateQrCodePage() {
  const router = useRouter();
  const [wineData, setWineData] = useState<any>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('wine_draft');
    if (saved) {
      setWineData(JSON.parse(saved));
    }
  }, []);

  const handleFinish = async () => {
    console.log("Saving to Supabase:", wineData);
    alert("Wine saved!");
    router.push('/dashboard/producer');
  };

  if (!wineData) return <div className="p-20 text-center uppercase text-xs tracking-widest animate-pulse">Loading Preview...</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      {/* NAVIGATION BAR */}
      <div className="flex justify-between items-center p-6 bg-white border-b border-gray-100 mb-10">
        <button onClick={() => router.back()} className="text-[11px] font-bold uppercase tracking-[3px] text-gray-400 hover:text-black transition-colors">
          Previous
        </button>
        <h2 className="text-[11px] font-bold uppercase tracking-[4px] text-[#4E001D]">Step 5: Final Review</h2>
        <button onClick={handleFinish} className="bg-[#4E001D] text-white px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-md">
          Finish
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-16 items-start">
        
        {/* VÄNSTER SIDA: FÖRKLARING */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-light text-[#1A1A1A]">Scroll down to look at the whole page</h1>
          
          
        </div>

        {/* HÖGER SIDA: IPHONE PREVIEW (Tailwind-only) */}
        <div className={`relative transition-all duration-500 ${isZoomed ? 'scale-110' : 'scale-100'}`}>
          
          {/* Mobilskal i Tailwind */}
          <div className="w-[320px] h-[650px] bg-black rounded-[50px] border-[8px] border-[#222] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden relative">
            
            {/* Själva skärmen (Scrollbar) */}
            <div className="absolute inset-0 bg-white overflow-y-auto no-scrollbar pt-10 pb-10">
              
              {/* App Logo */}
              <div className="px-6 mb-8 text-center">
                <span className="font-serif italic text-xl tracking-tighter text-[#4E001D]">Journy</span>
              </div>

              {/* Vin Header */}
              <div className="px-6 mb-8">
                <div className="aspect-[2/3] w-32 bg-gray-100 mx-auto rounded-lg mb-4 shadow-sm overflow-hidden border border-gray-50 flex items-center justify-center italic text-[10px] text-gray-300">
                   Bottle Image
                </div>
                <h3 className="text-center text-2xl font-medium mb-1">{wineData.wine_name || 'Unnamed'}</h3>
                <p className="text-center text-gray-400 text-xs uppercase tracking-widest">{wineData.brand_name} • {wineData.vintage}</p>
              </div>

              {/* Technical Grid */}
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

              {/* Ingredients */}
              <div className="px-6 mb-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 border-b pb-2">Ingredients</p>
                <p className="text-xs leading-relaxed text-gray-600 italic">
                  Grapes, {wineData.selected_ingredients?.join(', ') || 'no additives selected'}.
                </p>
              </div>

              {/* Recycling Selection (Här dyker Steg 4 upp!) */}
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

            {/* iPhone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl"></div>
          </div>

          {/* Zoom Toggle för användaren */}
          <button 
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute -right-4 top-10 bg-white border border-gray-200 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-all active:scale-90"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
          </button>
        </div>

      </div>
    </div>
  );
}