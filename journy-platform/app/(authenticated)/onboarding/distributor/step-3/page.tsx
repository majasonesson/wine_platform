'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function DistributorStep3() {
  const [certs, setCerts] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [distributorId, setDistributorId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, { ref: string, date: string, uploaded: boolean }>>({});

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();

  useEffect(() => {
    async function getData() {
      const { data: certTypes } = await supabase.from('certificate').select('*');
      if (certTypes && certTypes.length > 0) {
        setCerts(certTypes);
        setActiveId(certTypes[0].id);
      }

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
      const res = await fetch(
        `/api/users/update-avatar?filename=${file.name}&type=certificate&id=${distributorId}&distributorId=${distributorId}&certificateId=${certId}&refNumber=${metadata.ref}&expiryDate=${metadata.date}`,
        { method: 'POST', body: file }
      );

      if (res.ok) {
        setFormValues(prev => ({
          ...prev,
          [certId]: { ...prev[certId], uploaded: true }
        }));
      } else {
        const err = await res.json();
        alert("Upload failed: " + err.error);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploadingId(null);
    }
  };

  const activeCert = certs.find(c => c.id === activeId);

  return (
    <div className="bg-[#FDFDFD] min-h-screen flex flex-col items-center justify-center p-4 text-black font-sans">
      <div className="mb-8 font-bold text-2xl tracking-tighter uppercase">Journy</div>

      <div className="bg-white rounded-[40px] shadow-[0px_4px_25px_rgba(0,0,0,0.05)] p-12 w-full max-w-[1000px]">
        <h1 className="text-xl mb-2 font-semibold text-center">Sustainability Certifications</h1>
        <p className="text-gray-400 text-[10px] mb-10 uppercase tracking-[0.2em] font-bold text-center">Step 3 of 3</p>

        <div className="flex flex-col md:flex-row gap-12 min-h-[450px]">
          {/* LEFT SIDE: List of Certificates */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col gap-1 pb-6 md:pb-0 md:pr-6 overflow-y-auto max-h-[450px] scrollbar-hide">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4 sticky top-0 bg-white py-2">
              Available Certificates
            </label>
            {certs.map((cert) => {
              const isUploaded = formValues[cert.id]?.uploaded;
              const isActive = activeId === cert.id;
              return (
                <button
                  key={cert.id}
                  onClick={() => setActiveId(cert.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all text-left group ${isActive ? 'bg-[#4E001D]/5' : 'hover:bg-gray-50'
                    }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all ${isUploaded
                      ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                      : 'bg-gray-200 group-hover:bg-gray-300'
                    }`} />
                  <span className={`text-[11px] font-bold uppercase tracking-tight transition-all ${isActive ? 'text-[#4E001D]' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                    {cert.certificate_code}
                  </span>
                </button>
              );
            })}
          </div>

          {/* RIGHT SIDE: Detail Form */}
          <div className="flex-1 flex flex-col justify-center">
            {activeCert ? (
              <div key={activeCert.id} className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-lg font-bold text-[#4E001D] uppercase tracking-wider mb-2">{activeCert.certificate_code}</h2>
                  <p className="text-xs text-gray-400">Provide the details below to verify your certification.</p>
                </div>

                <div className="space-y-8 max-w-[400px] mx-auto md:mx-0">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Reference Number</label>
                    <input
                      type="text"
                      placeholder="Enter reference number"
                      value={formValues[activeCert.id]?.ref || ''}
                      className="text-sm p-4 rounded-[20px] border border-gray-100 bg-gray-50/50 outline-none focus:border-[#4E001D] focus:bg-white transition-all shadow-sm"
                      onChange={(e) => handleInputChange(activeCert.id, 'ref', e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Expiry Date</label>
                    <input
                      type="date"
                      value={formValues[activeCert.id]?.date || ''}
                      className="text-sm p-4 rounded-[20px] border border-gray-100 bg-gray-50/50 outline-none focus:border-[#4E001D] focus:bg-white transition-all shadow-sm"
                      onChange={(e) => handleInputChange(activeCert.id, 'date', e.target.value)}
                    />
                  </div>

                  <div className="pt-4">
                    <label className={`block text-center cursor-pointer py-5 rounded-full text-[11px] font-bold shadow-lg transition-all transform active:scale-95 ${uploadingId === activeCert.id
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : formValues[activeCert.id]?.uploaded
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-[#4E001D] text-white hover:opacity-90 hover:shadow-[#4E001D]/20 hover:scale-[1.02]'
                      }`}>
                      {uploadingId === activeCert.id ? 'UPLOADING...' : formValues[activeCert.id]?.uploaded ? '✓ CERTIFICATE SAVED' : 'UPLOAD & SAVE CERTIFICATE'}
                      <input type="file" className="hidden" onChange={(e) => handleUpload(activeCert.id, e)} disabled={!!uploadingId} />
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300 italic text-sm py-20">
                Select a certification from the menu
              </div>
            )}
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="mt-16 flex flex-col sm:flex-row items-center gap-4 border-t border-gray-50 pt-10">
          <button
            onClick={() => router.push('/dashboard/distributor')}
            className="w-full sm:flex-1 h-16 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all shadow-2xl hover:scale-[1.01] active:scale-[0.99]"
          >
            Finish Onboarding
          </button>
          <button
            onClick={() => router.push('/dashboard/distributor')}
            className="w-full sm:w-auto px-10 h-16 bg-white text-gray-400 border border-gray-100 rounded-full font-bold hover:bg-gray-50 transition-all"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}