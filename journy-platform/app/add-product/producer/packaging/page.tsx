'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BOTTLE_MATERIALS, CAP_MATERIALS, CORK_MATERIALS, 
  CAGE_MATERIALS, CARDBOARD_MATERIALS, BAG_MATERIALS, 
  TAP_MATERIALS, SEAL_MATERIALS, RECYCLING_INSTRUCTIONS 
} from '@/utils/constants';

export default function PackagingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    bottle_type: '', material_code_bottle: '', disposal_bottle: '',
    cap_type: '', material_code_cap: '', disposal_cap: '',
    cork_type: '', material_code_cork: '', disposal_cork: '',
    cage_type: '', material_code_cage: '', disposal_cage: '',
    cardboard_type: '', material_code_cardboard: '', disposal_cardboard: '',
    bag_type: '', material_code_bag: '', disposal_bag: '',
    tap_type: '', material_code_tap: '', disposal_tap: '',
    seal_type: '', material_code_seal: '', disposal_seal: '',
    // Vi lägger till wine_category här för att veta var vi ska navigera bakåt
    wine_category: '' 
  });

  // 1. Ladda data från localStorage när sidan startar
  useEffect(() => {
    const saved = localStorage.getItem('wine_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev: any) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, []);

  // 2. Hantera val av material
  const handleSelect = (key: string, label: string, options: any[]) => {
    const item = options.find(o => o.label === label);
    const code = item?.material || '';
    
    // @ts-ignore
    const instruction = RECYCLING_INSTRUCTIONS[code] || '';

    setFormData((prev: any) => ({
      ...prev,
      [`${key}_type`]: label,
      [`material_code_${key}`]: code,
      [`disposal_${key}`]: instruction
    }));
  };

  
  const handleBack = () => {
    // Spara det vi valt i Packaging hittills
    const saved = JSON.parse(localStorage.getItem('wine_draft') || '{}');
    localStorage.setItem('wine_draft', JSON.stringify({ ...saved, ...formData }));

        router.push('/add-product/producer/sensory-profile'); 

  };

  // 4. Hantera Next
  const handleNext = () => {
    const saved = JSON.parse(localStorage.getItem('wine_draft') || '{}');
    localStorage.setItem('wine_draft', JSON.stringify({ ...saved, ...formData }));
    router.push('/add-product/producer/generate-qr-code');
  };
   

  return (
    <div className="flex flex-col gap-12 pb-20 max-w-4xl mx-auto px-4">
      <div className="flex flex-col gap-2 text-left">
        <h1 className="text-4xl font-light text-[#1A1A1A]">5. Packaging</h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest">Environmental Selection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
        <PackSelect label="Bottle material" value={formData.bottle_type} code={formData.material_code_bottle} options={BOTTLE_MATERIALS} onSelect={(v: string) => handleSelect('bottle', v, BOTTLE_MATERIALS)} />
        <PackSelect label="Cap or capsule" value={formData.cap_type} code={formData.material_code_cap} options={CAP_MATERIALS} onSelect={(v: string) => handleSelect('cap', v, CAP_MATERIALS)} />
        <PackSelect label="Cork" value={formData.cork_type} code={formData.material_code_cork} options={CORK_MATERIALS} onSelect={(v: string) => handleSelect('cork', v, CORK_MATERIALS)} />
        <PackSelect label="Cage (Sparkling)" value={formData.cage_type} code={formData.material_code_cage} options={CAGE_MATERIALS} onSelect={(v: string) => handleSelect('cage', v, CAGE_MATERIALS)} />
        <PackSelect label="Outer box" value={formData.cardboard_type} code={formData.material_code_cardboard} options={CARDBOARD_MATERIALS} onSelect={(v: string) => handleSelect('cardboard', v, CARDBOARD_MATERIALS)} />
        <PackSelect label="Bag (Bag-in-box)" value={formData.bag_type} code={formData.material_code_bag} options={BAG_MATERIALS} onSelect={(v: string) => handleSelect('bag', v, BAG_MATERIALS)} />
        <PackSelect label="Tap (Bag-in-box)" value={formData.tap_type} code={formData.material_code_tap} options={TAP_MATERIALS} onSelect={(v: string) => handleSelect('tap', v, TAP_MATERIALS)} />
        <PackSelect label="Wax or seal" value={formData.seal_type} code={formData.material_code_seal} options={SEAL_MATERIALS} onSelect={(v: string) => handleSelect('seal', v, SEAL_MATERIALS)} />
      </div>

      <div className="flex justify-between pt-16 items-center border-t border-gray-50">
        <button 
          onClick={handleBack} 
          className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          Previous
        </button>
        <button 
          onClick={handleNext} 
          className="bg-[#4E001D] text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg flex items-center gap-4"
        >
          Next
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}

// --- SUB-KOMPONENT FÖR SELECTS ---

interface PackSelectProps {
  label: string;
  value: string;
  code: string;
  options: any[];
  onSelect: (val: string) => void;
}

function PackSelect({ label, value, code, options, onSelect }: PackSelectProps) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-[#4E001D] transition-colors">{label}</label>
      <select 
        className="border-b border-gray-200 py-2 bg-transparent outline-none focus:border-[#4E001D] text-sm cursor-pointer hover:border-gray-400 transition-all appearance-none"
        value={value}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Choose material</option>
        {options.map((o: any) => (
          <option key={o.label} value={o.label}>{o.label}</option>
        ))}
      </select>
      <div className="h-4">
        {code && (
          <span className="text-[9px] font-bold text-[#4E001D] tracking-tighter italic animate-in fade-in slide-in-from-left-1 duration-300">
            System code: {code}
          </span>
        )}
      </div>
    </div>
  );
}