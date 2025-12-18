'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { updateDistributorAction } from './actions';

export default function DistributorStep2() {
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [countries, setCountries] = useState<any[]>([]);
  const [geoData, setGeoData] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  useEffect(() => {
    async function loadCountries() {
      const { data } = await supabase.from('country').select('code, name_sv').order('name_sv');
      setCountries(data || []);
    }
    loadCountries();
  }, [supabase]);

  useEffect(() => {
    async function loadGeoData() {
      if (!selectedCountry) return setGeoData([]);
      const { data } = await supabase.from('geo_region').select('*').eq('country_code', selectedCountry);
      setGeoData(data || []);
    }
    loadGeoData();
  }, [selectedCountry, supabase]);

  const regions = Array.from(new Set(geoData.map(g => g.geographical_area)));
  const districts = geoData.filter(g => g.geographical_area === selectedArea);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateDistributorAction(formData);
    if (result?.error) { 
        alert(result.error); 
        setLoading(false); 
    }
  }

  return (
    <div className="bg-[#FDFDFD] min-h-screen flex flex-col items-center justify-center p-4 text-black font-sans">
      <div className="mb-8 font-bold text-2xl tracking-tighter">Journy</div>
      
      {/* Stegmätare - Samma som Producer */}
      <div className="flex items-center gap-4 mb-12">
        <span className="w-8 h-8 rounded-full bg-[#4E001D] text-white flex items-center justify-center text-sm">1</span>
        <div className="h-[2px] w-8 bg-[#4E001D]"></div>
        <span className="w-8 h-8 rounded-full bg-[#4E001D] text-white flex items-center justify-center text-sm">2</span>
        <div className="h-[2px] w-8 bg-gray-200"></div>
        <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-sm">3</span>
      </div>

      <h1 className="text-xl mb-2 font-semibold">Company Details</h1>
      <p className="text-gray-500 mb-10 text-sm">Tell us more about your company</p>

      <div className="bg-white rounded-[40px] shadow-[0px_4px_25px_rgba(0,0,0,0.06)] p-12 w-full max-w-[850px]">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-10">
            
            {/* 1. GLN */}
            <InputField label="GLN (Global Location Number)" name="gln" placeholder="13 digits" required={false} />

            {/* 2. Company Registration Number */}
            <InputField label="Company Registration Number" name="company_reg_number" placeholder="Company number" />

            {/* 3. Company Name */}
            <InputField label="Company Name" name="company_name" placeholder="Company name" />

            {/* 4. Address */}
            <InputField label="Address" name="distributor_address" placeholder="Street" />
            
            {/* 5. Country */}
            <SelectField 
              label="Country" 
              name="country_code" 
              options={countries.map(c => ({ value: c.code, label: c.name_sv }))}
              onChange={(e: any) => { setSelectedCountry(e.target.value); setSelectedArea(''); }}
            />

            {/* 6. Region */}
            <SelectField 
              label="Region" 
              name="region_area"
              disabled={!selectedCountry}
              placeholder={!selectedCountry ? "Select a country first" : "Select region"}
              options={regions.map(r => ({ value: r, label: r }))}
              onChange={(e: any) => setSelectedArea(e.target.value)}
            />

            {/* 7. District */}
            <div className="md:col-span-2">
              <SelectField 
                label="District" 
                name="geo_region_id"
                disabled={!selectedArea}
                placeholder={!selectedArea ? "Select a region first" : "Select district"}
                options={districts.map(d => ({ value: d.id, label: d.region_name || d.geographical_area }))}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-[#4E001D] text-white w-[320px] h-[55px] rounded-full font-medium hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
            >
              {loading ? 'Saving details...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
      <p className="mt-12 text-[10px] text-gray-400 opacity-50 uppercase tracking-widest text-center">Step 1 of 3</p>
    </div>
  );
}

// HJÄLP-KOMPONENTER (Samma styling som Producer)

function InputField({ label, name, placeholder, required = true }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-semibold text-gray-600 ml-1 uppercase tracking-wider">{label}</label>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full h-[50px] px-6 rounded-full border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#4E001D] text-sm transition-all shadow-sm"
      />
    </div>
  );
}

function SelectField({ label, name, options, onChange, disabled, placeholder = "Select option" }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-semibold text-gray-600 ml-1 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <select
          name={name}
          required={!disabled}
          disabled={disabled}
          onChange={onChange}
          className="w-full h-[50px] px-6 rounded-full border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#4E001D] text-sm transition-all shadow-sm appearance-none disabled:opacity-30 cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}