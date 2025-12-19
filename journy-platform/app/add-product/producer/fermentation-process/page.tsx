'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  SPARKLING_DOSAGE_LEVELS, 
  RIDDLING_METHODS, 
  DISGORGEMENT_METHODS, 
  PRIMARY_FERMENTATION_VESSELS,
  SECONDARY_FERMENTATION_TIME 
} from '@/utils/constants';

export default function FermentationProcessPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    primary_fermentation: '',
    riddling_method: '',
    disgorgement_method: '',
    dosage_level: '',
    secondary_fermentation_time: '',
    secondary_fermentation_custom: '',
    co2_pressure: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('wine_draft');
    if (saved) {
      setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
    }
  }, []);

  const saveToDraft = () => {
    const saved = JSON.parse(localStorage.getItem('wine_draft') || '{}');
    localStorage.setItem('wine_draft', JSON.stringify({ ...saved, ...formData }));
  };

  const handleNext = () => {
    saveToDraft();
    router.push('/add-product/producer/packaging');
  };

  const handleBack = () => {
    saveToDraft();
    router.push('/add-product/producer/production-process');
  };

  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 text-left">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-medium tracking-tight text-[#1A1A1A]">3. Production Process</h1>
        <p className="text-[11px] text-[#4E001D] font-bold uppercase tracking-[2px]">Secondary fermentation & Finishing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
        
        {/* PRIMARY FERMENTATION (ÅTERSTÄLLD) */}
        <div className="flex flex-col gap-4 text-left">
          <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Primary Fermentation</label>
          <div className="flex flex-wrap gap-2">
            {PRIMARY_FERMENTATION_VESSELS.map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setFormData({...formData, primary_fermentation: v})}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                  formData.primary_fermentation === v 
                  ? 'bg-[#4E001D] text-white border-[#4E001D]' 
                  : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* SECONDARY FERMENTATION TIME (NY MED "OTHER") */}
        <div className="flex flex-col gap-4 text-left">
          <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Secondary Fermentation</label>
          <div className="flex flex-col gap-3">
            <select 
              className="border-b border-gray-200 py-3 bg-transparent outline-none focus:border-[#4E001D] text-sm appearance-none cursor-pointer"
              value={formData.secondary_fermentation_time}
              onChange={(e) => setFormData({...formData, secondary_fermentation_time: e.target.value})}
            >
              <option value="">Select time</option>
              {SECONDARY_FERMENTATION_TIME.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>

            {formData.secondary_fermentation_time === 'Other (please specify)' && (
              <input 
                type="text"
                placeholder="Specify time (e.g. 36 months)..."
                className="border-b border-gray-200 py-2 bg-transparent outline-none focus:border-[#4E001D] text-sm animate-in slide-in-from-top-2"
                value={formData.secondary_fermentation_custom}
                onChange={(e) => setFormData({...formData, secondary_fermentation_custom: e.target.value})}
              />
            )}
          </div>
        </div>

        {/* RIDDLING METHOD */}
        <div className="flex flex-col gap-4 text-left">
          <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Riddling Method</label>
          <div className="flex gap-2">
            {RIDDLING_METHODS.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setFormData({...formData, riddling_method: m})}
                className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                  formData.riddling_method === m ? 'bg-[#4E001D] text-white border-[#4E001D]' : 'bg-white text-gray-400 border-gray-100'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* DISGORGEMENT METHOD */}
        <div className="flex flex-col gap-4 text-left">
          <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Disgorgement Method</label>
          <div className="flex gap-2">
            {DISGORGEMENT_METHODS.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setFormData({...formData, disgorgement_method: m})}
                className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                  formData.disgorgement_method === m ? 'bg-[#4E001D] text-white border-[#4E001D]' : 'bg-white text-gray-400 border-gray-100'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* SUGAR LEVEL (DOSAGE) */}
        <div className="flex flex-col gap-4 text-left">
          <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">Sugar Level (Dosage)</label>
          <select 
            className="border-b border-gray-200 py-3 bg-transparent outline-none focus:border-[#4E001D] text-sm"
            value={formData.dosage_level}
            onChange={(e) => setFormData({...formData, dosage_level: e.target.value})}
          >
            <option value="">Select dosage</option>
            {SPARKLING_DOSAGE_LEVELS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* CO2 PRESSURE */}
        <div className="flex flex-col gap-4 text-left">
          <label className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400">CO2 Pressure (Bar)</label>
          <input 
            type="text"
            className="border-b border-gray-200 py-3 bg-transparent outline-none focus:border-[#4E001D] text-lg font-medium"
            value={formData.co2_pressure}
            onChange={(e) => setFormData({...formData, co2_pressure: e.target.value})}
            placeholder="6.0"
          />
        </div>
      </div>

      {/* FOOTER NAV */}
      <div className="flex justify-between items-center pt-12 border-t border-gray-50">
        <button onClick={handleBack} className="text-[11px] font-bold uppercase tracking-[3px] text-gray-400 hover:text-black transition-colors">Previous</button>
        <button onClick={handleNext} className="flex items-center gap-6 group">
          <span className="text-[13px] font-bold uppercase tracking-[3px]">Next</span>
          <div className="w-14 h-14 bg-[#4E001D] rounded-full flex items-center justify-center shadow-lg group-hover:translate-x-2 transition-transform">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </div>
        </button>
      </div>
    </div>
  );
}