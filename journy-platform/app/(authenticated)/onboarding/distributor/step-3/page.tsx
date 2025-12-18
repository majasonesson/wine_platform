'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function DistributorStep3() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  
  const [foundingType, setFoundingType] = useState('not_specified');
  const [women, setWomen] = useState(0);
  const [men, setMen] = useState(0);
  const [nonBinary, setNonBinary] = useState(0);
  const [leadership, setLeadership] = useState(0);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('distributor')
          .select('id')
          .eq('user_id', user.id)
          .single();
        setProfileId(data?.id);
      }
    }
    getProfile();
  }, [supabase]);
const handleFinish = async () => {
    if (!profileId) return;

    // KONTROLL: Har användaren valt något annat än 'not_specified'?
    if (foundingType === 'not_specified') {
      alert("Please fill in all fields to continue.");
      return;
    }

    setLoading(true);
    
    const { error } = await supabase
      .from('distributor')
      .update({
        founding_team_type: foundingType,
        gender_dist_women: women,
        gender_dist_men: men,
        gender_dist_non_binary: nonBinary,
        women_in_leadership: leadership
      })
      .eq('id', profileId);

    if (!error) {
      router.push('/onboarding/distributor/step-4');
    } else {
      setLoading(false);
      alert("Error saving data: " + error.message);
    }
  };

  return (
    <div className="bg-[#FDFDFD] min-h-screen flex flex-col items-center justify-center p-4 text-black font-sans">
      <div className="mb-8 font-bold text-2xl tracking-tighter">Journy</div>

      <div className="bg-white rounded-[40px] shadow-[0px_4px_25px_rgba(0,0,0,0.06)] p-12 w-full max-w-[550px]">
        <h1 className="text-2xl font-semibold text-center mb-1 text-[#1A1A1A]">Diversity & Inclusion</h1>
        <p className="text-gray-500 text-sm text-center mb-10 px-4">
          Tell us more about your team and leadership representation.
        </p>

        <div className="space-y-10">
          <div className="flex flex-col gap-3">
            {[
              { label: 'Female Founded', value: 'female_founded' },
              { label: 'Male Founded', value: 'male_founded' },
              { label: 'Mixed founding team', value: 'mixed_team' }
            ].map((btn) => (
              <button
                key={btn.value}
                type="button"
                onClick={() => setFoundingType(btn.value)}
                className={`w-full py-4 rounded-full text-sm font-bold border transition-all ${
                  foundingType === btn.value 
                  ? 'bg-[#4E001D] border-[#4E001D] text-white' 
                  : 'bg-white border-gray-100 text-gray-700 hover:border-gray-300'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            <h3 className="text-center font-bold text-lg">Gender distribution</h3>
            <StepperInput label="Women" value={women} onChange={setWomen} />
            <StepperInput label="Men" value={men} onChange={setMen} />
            <StepperInput label="Non-Binary" value={nonBinary} onChange={setNonBinary} />
          </div>

          <div className="space-y-6 pt-8 border-t border-gray-50 text-center">
            <h3 className="font-bold text-lg leading-tight px-6">Women in leadership positions</h3>
            <StepperInput label="" value={leadership} onChange={setLeadership} />
          </div>

          <button 
            onClick={handleFinish}
            disabled={loading}
            className="w-full h-[60px] bg-[#4E001D] text-white rounded-full font-bold shadow-lg mt-4 text-lg hover:opacity-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Finishing...' : 'Continue'}
          </button>
        </div>
      </div>
      <p className="mt-12 text-[10px] text-gray-400 opacity-50 uppercase tracking-widest text-center">Step 2 of 3</p>
    </div>
  );
}

function StepperInput({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  const update = (amt: number) => {
    const newVal = Math.min(100, Math.max(0, value + amt));
    onChange(newVal);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {label && <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest">{label}</span>}
      <div className="flex items-center gap-8">
        <button 
          type="button"
          onClick={() => update(-1)}
          className="text-3xl text-gray-300 hover:text-[#4E001D] transition-colors p-2 font-light"
        >
          &lt;
        </button>
        <div className="flex items-baseline min-w-[90px] justify-center">
          <input 
            type="number"
            value={value}
            onChange={(e) => onChange(Math.min(100, Math.max(0, Number(e.target.value))))}
            className="w-16 text-center text-4xl font-bold bg-transparent focus:outline-none"
          />
          <span className="text-2xl font-bold">%</span>
        </div>
        <button 
          type="button"
          onClick={() => update(1)}
          className="text-3xl text-gray-300 hover:text-[#4E001D] transition-colors p-2 font-light"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
