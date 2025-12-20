'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HARVEST_METHODS, 
  FERMENTATION_VESSELS, 
  VINEYARD_SOURCES, 
  AGING_VESSELS 
} from '@/utils/constants';

export default function ProductionProcessPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    vineyard_source: '',
    harvest_method: '',
    fermentation_vessel: '',
    aging_vessel: '',
    aging_duration_months: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('wine_draft');
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(prev => ({
        ...prev,
        vineyard_source: parsed.vineyard_source || '',
        harvest_method: parsed.harvest_method || '',
        fermentation_vessel: parsed.fermentation_vessel || '',
        aging_vessel: parsed.aging_vessel || '',
        aging_duration_months: parsed.aging_duration_months || ''
      }));
    }
  }, []);

  const saveToDraft = () => {
    const saved = JSON.parse(localStorage.getItem('wine_draft') || '{}');
    localStorage.setItem('wine_draft', JSON.stringify({ ...saved, ...formData }));
  };

  const handleNext = () => {
    const saved = JSON.parse(localStorage.getItem('wine_draft') || '{}');
    const updatedDraft = { ...saved, ...formData };
    localStorage.setItem('wine_draft', JSON.stringify(updatedDraft));

    if (updatedDraft.wine_category === 'Sparkling wine') {
      router.push('/add-product/producer/fermentation-process');
    } else {
      router.push('/add-product/producer/sensory-profile');
    }
  };

  // FIX: Ersätt router.back() med en explicit push för att undvika historik-loopar
  const handleBack = () => {
    saveToDraft();
    router.push('/add-product/producer/ingredients');
  };

  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <h1 className="text-3xl font-medium tracking-tight text-[#1A1A1A] text-left">
        3. Production Process
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
        
        {/* GRAPE SOURCE */}
        <div className="flex flex-col gap-2 text-left">
          <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Grape Source</label>
          <select 
            className="border-b border-gray-200 py-3 bg-transparent outline-none focus:border-[#4E001D] transition-colors appearance-none cursor-pointer"
            value={formData.vineyard_source}
            onChange={(e) => setFormData({...formData, vineyard_source: e.target.value})}
          >
            <option value="">Select source</option>
            {VINEYARD_SOURCES.map(source => <option key={source} value={source}>{source}</option>)}
          </select>
        </div>

        {/* HARVEST METHOD */}
        <div className="flex flex-col gap-2 text-left">
          <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Harvest Method</label>
          <select 
            className="border-b border-gray-200 py-3 bg-transparent outline-none focus:border-[#4E001D] appearance-none cursor-pointer"
            value={formData.harvest_method}
            onChange={(e) => setFormData({...formData, harvest_method: e.target.value})}
          >
            <option value="">Select method</option>
            {HARVEST_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* FERMENTATION */}
        <div className="flex flex-col gap-2 text-left">
          <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Fermentation Vessel</label>
          <select 
            className="border-b border-gray-200 py-3 bg-transparent outline-none focus:border-[#4E001D] appearance-none cursor-pointer"
            value={formData.fermentation_vessel}
            onChange={(e) => setFormData({...formData, fermentation_vessel: e.target.value})}
          >
            <option value="">Select vessel</option>
            {FERMENTATION_VESSELS.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        {/* AGING PROCESS */}
        <div className="flex flex-col gap-2 text-left">
          <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Aging Process</label>
          <div className="flex flex-col gap-4">
            <select 
              className="border-b border-gray-200 py-3 bg-transparent outline-none focus:border-[#4E001D] appearance-none cursor-pointer"
              value={formData.aging_vessel}
              onChange={(e) => setFormData({...formData, aging_vessel: e.target.value})}
            >
              <option value="">Select aging vessel</option>
              {AGING_VESSELS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>

            {formData.aging_vessel !== 'No aging' && formData.aging_vessel !== '' && (
              <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">Duration</span>
                  <input 
                    type="number"
                    placeholder="0"
                    className="bg-transparent border-b border-gray-200 py-1 text-lg font-medium outline-none focus:border-[#4E001D] w-full"
                    value={formData.aging_duration_months}
                    onChange={(e) => setFormData({...formData, aging_duration_months: e.target.value})}
                  />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#4E001D]">Months</span>
              </div>
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
          className="flex items-center gap-6 group"
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