'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { updateProducerAction } from './actions';

export default function ProducerStep1() {
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // States för data
  const [countries, setCountries] = useState<any[]>([]);
  const [dbOrigins, setDbOrigins] = useState<{ attribute_number: number, country_name: string, region_name: string | null, district_name: string | null }[]>([]);

  // States för val
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [originAttributeNumber, setOriginAttributeNumber] = useState('');

  // 1. Hämta länder och origins vid start
  useEffect(() => {
    async function loadData() {
      // Load origins from origin_master
      const { data: originsData } = await supabase
        .from('origin_master')
        .select('attribute_number, country_name, region_name, district_name')
        .order('country_name')
        .order('region_name')
        .order('district_name');

      if (originsData) {
        setDbOrigins(originsData);
        // Extract unique countries
        const uniqueCountries = [...new Set(originsData.map(o => o.country_name))].sort();
        setCountries(uniqueCountries.map(c => ({ code: c, name: c })));
      }
    }
    loadData();
  }, []);

  // Derived data based on selections
  const regions = [...new Set(dbOrigins
    .filter(o => o.country_name === selectedCountry && o.region_name)
    .map(o => o.region_name)
  )].sort();

  const districts = dbOrigins
    .filter(o => o.country_name === selectedCountry && o.region_name === selectedRegion && o.district_name);



  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateProducerAction(formData);
    if (result?.error) {
      alert(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#FDFDFD] min-h-screen flex flex-col items-center justify-center p-4 text-black font-sans">
      <div className="mb-8 font-bold text-2xl tracking-tighter">Journy</div>

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
            <InputField label="Company Registration Number" name="regNumber" placeholder="Company number" />

            {/* 3. Company Name */}
            <InputField label="Company Name" name="companyName" placeholder="Full legal name" />

            {/* 4. Address */}
            <InputField label="Address" name="address" placeholder="Street" />

            {/* 5. Country */}
            <SelectField
              label="Country"
              name="country_code"
              options={countries.map(c => ({ value: c.code, label: c.name }))}
              onChange={(e: any) => {
                setSelectedCountry(e.target.value);
                setSelectedRegion('');
                setSelectedDistrict('');
                setOriginAttributeNumber('');
              }}
            />

            {/* 6. Region */}
            <SelectField
              label="Region"
              name="region_area"
              disabled={!selectedCountry}
              placeholder={!selectedCountry ? "Select a country first" : "Select region"}
              options={regions.map(r => ({ value: r, label: r }))}
              onChange={(e: any) => {
                const newRegion = e.target.value;
                setSelectedRegion(newRegion);
                setSelectedDistrict('');
                // Find the best matching origin (region without district)
                const match = dbOrigins.find(o =>
                  o.country_name === selectedCountry &&
                  o.region_name === newRegion && !o.district_name
                ) || dbOrigins.find(o =>
                  o.country_name === selectedCountry && o.region_name === newRegion
                );
                setOriginAttributeNumber(match?.attribute_number?.toString() || '');
              }}
            />

            {/* 7. District */}
            <div className="md:col-span-2">
              <SelectField
                label="District"
                name="origin_attribute_number"
                disabled={!selectedRegion}
                placeholder={!selectedRegion ? "Select a region first" : "Select district (optional)"}
                options={districts.map(d => ({ value: d.attribute_number.toString(), label: d.district_name }))}
                onChange={(e: any) => {
                  setSelectedDistrict(e.target.value);
                  setOriginAttributeNumber(e.target.value);
                }}
              />
              {/* Hidden field to always submit the origin_attribute_number */}
              <input type="hidden" name="origin_attribute_number_final" value={originAttributeNumber} />
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

      <p className="mt-12 text-[10px] text-gray-400 opacity-50 uppercase tracking-widest">Step 1 of 3</p>
    </div>
  );
}

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
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}