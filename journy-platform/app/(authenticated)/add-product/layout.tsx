'use client';
import { usePathname } from 'next/navigation';

export default function AddProductLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Mappa alla dina specifika sidnamn till de 6 visuella stegen
  const getActiveStep = () => {
    if (pathname.includes('general-info')) return 1;
    if (pathname.includes('product-info') || pathname.includes('ingredients')) return 2;
    if (pathname.includes('production-process') || pathname.includes('fermentation-process')) return 3;
    if (pathname.includes('sensory-profile')) return 4; // Nytt steg 4
    if (pathname.includes('packaging')) return 5;      // Packaging blir steg 5
    if (pathname.includes('generate-qr-code')) return 6; // QR blir steg 6
    return 1;
  };

  const currentStep = getActiveStep();

  const steps = [
    { id: 1, label: 'General Info' },
    { id: 2, label: 'Product Info' },
    { id: 3, label: 'Production' },
    { id: 4, label: 'Sensory' },
    { id: 5, label: 'Packaging' },
    { id: 6, label: 'QR-Code' },
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <header className="p-10 px-20 flex justify-between items-center">
        <div className="text-[32px] font-medium tracking-tight">Journy</div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
                localStorage.removeItem('wine_draft');
                window.location.href = '/dashboard/producer';
              }
            }}
            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors"
          >
            Cancel Edit
          </button>
          <div className="w-10 h-10 bg-[#D9D9D9] rounded-full" />
        </div>
      </header>

      {/* Stegmätare 1-6 */}
      <div className="max-w-6xl mx-auto px-20 mb-24">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative z-10">
                {/* Cirkel med status-färg */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${currentStep === step.id
                    ? 'border-2 border-[#4E001D] text-[#4E001D] bg-white scale-110 shadow-sm'
                    : currentStep > step.id
                      ? 'bg-[#4E001D] text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                  {step.id}
                </div>
                {/* Etikett */}
                <span className={`absolute top-12 whitespace-nowrap text-[9px] uppercase tracking-[2px] font-bold transition-colors duration-300 ${currentStep === step.id ? 'text-[#1A1A1A]' : 'text-gray-300'
                  }`}>
                  {step.label}
                </span>
              </div>

              {/* Linje mellan cirklarna */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-[1px] mx-4 bg-gray-100 relative">
                  <div
                    className="absolute h-full bg-[#4E001D] transition-all duration-700 ease-in-out"
                    style={{ width: currentStep > step.id ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Innehåll */}
      <main className="max-w-4xl mx-auto px-20 pb-20">
        {children}
      </main>
    </div>
  );
}