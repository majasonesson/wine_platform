'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function DistributorStep4() {
  const [certs, setCerts] = useState<any[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [distributorId, setDistributorId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, { ref: string, date: string }>>({});

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      // Hämta certifikatstyper
      const { data: certTypes } = await supabase.from('certificate').select('*');
      setCerts(certTypes || []);

      // Hämta Distributör-ID
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: dist } = await supabase
          .from('distributor')
          .select('id')
          .eq('user_id', user.id)
          .single();
        setDistributorId(dist?.id);
      }
    }
    getData();
  }, [supabase]);

  const handleInputChange = (certId: string, field: 'ref' | 'date', value: string) => {
    setFormValues(prev => ({
      ...prev,
      [certId]: { ...prev[certId], [field]: value }
    }));
  };

  const handleUpload = async (certId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !distributorId) return;

    const metadata = formValues[certId];
    if (!metadata?.ref || !metadata?.date) {
      alert("Please fill in Reference Number and Expiry Date first.");
      return;
    }

    setUploadingId(certId);

    try {
      // VIKTIGT: Vi skickar filename, type=certificate, och distributorId
      // Din API-route måste ha logik för att hantera 'distributorId'
      const res = await fetch(
        `/api/avatar/upload?filename=${file.name}&type=certificate&distributorId=${distributorId}&certificateId=${certId}&refNumber=${metadata.ref}&expiryDate=${metadata.date}`,
        { method: 'POST', body: file }
      );

      if (res.ok) {
        alert("Certificate saved for distributor!");
      } else {
        const err = await res.json();
        alert("Error: " + err.error);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="bg-[#FDFDFD] min-h-screen flex flex-col items-center justify-center p-4 text-black font-sans">
      <div className="mb-8 font-bold text-2xl tracking-tighter uppercase tracking-widest">Journy</div>
      
      <div className="bg-white rounded-[40px] shadow-[0px_4px_25px_rgba(0,0,0,0.05)] p-12 w-full max-w-[600px]">
        <h1 className="text-xl mb-2 font-semibold text-center">Sustainability Certifications</h1>
        
        <div className="space-y-6 mb-10">
          {certs.map((cert) => (
            <div key={cert.id} className="p-6 rounded-3xl border border-gray-100 bg-gray-50/50 transition-all hover:bg-white hover:shadow-sm">
              <span className="font-bold block mb-4 text-[#4E001D] uppercase text-xs tracking-wider">{cert.certificate_code}</span>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Reference</label>
                  <input 
                    type="text" 
                    placeholder="Ref #" 
                    className="text-sm p-3 rounded-xl border border-gray-100 bg-white outline-none focus:border-[#4E001D]"
                    onChange={(e) => handleInputChange(cert.id, 'ref', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Expiry Date</label>
                  <input 
                    type="date" 
                    className="text-sm p-3 rounded-xl border border-gray-100 bg-white outline-none focus:border-[#4E001D]"
                    onChange={(e) => handleInputChange(cert.id, 'date', e.target.value)}
                  />
                </div>
              </div>

              <label className={`block text-center cursor-pointer py-3 rounded-full text-xs font-bold shadow-md transition-all ${uploadingId === cert.id ? 'bg-gray-200' : 'bg-[#4E001D] text-white hover:opacity-90'}`}>
                {uploadingId === cert.id ? 'Uploading...' : 'Upload & Save'}
                <input type="file" className="hidden" onChange={(e) => handleUpload(cert.id, e)} disabled={!!uploadingId} />
              </label>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => router.push('/dashboard/distributor')} 
            className="w-full h-14 bg-black text-white rounded-full font-bold hover:bg-gray-900 transition-all"
          >
            Continue
          </button>
          <button 
            onClick={() => router.push('/dashboard/distributor')} 
            className="text-gray-400 text-[10px] font-bold uppercase tracking-widest"
          >
            Skip for now
          </button>
        </div>
        
      </div>
       <p className="text-gray-400 text-[10px] mb-10 uppercase tracking-[0.2em] font-bold text-center">Step 3 of 3</p>

    </div>
  );
}