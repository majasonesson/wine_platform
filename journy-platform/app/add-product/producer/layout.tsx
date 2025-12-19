'use client';
import { usePathname } from 'next/navigation';

export default function AddProductLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Mappa alla dina specifika sidnamn till de 5 visuella stegen
  const getActiveStep = () => {
    if (pathname.includes('general-info')) return 1;
    if (pathname.includes('product-info') || pathname.includes('ingredients')) return 2;
    if (pathname.includes('production-process') || pathname.includes('fermentation-process')) return 3;
    if (pathname.includes('packaging')) return 4;
    if (pathname.includes('generate-qr-code')) return 5;
    return 1;
  };

  const currentStep = getActiveStep();

  const steps = [
    { id: 1, label: 'General Info' },
    { id: 2, label: 'Product Info' },
    { id: 3, label: 'Production' },
    { id: 4, label: 'Packaging' },
    { id: 5, label: 'QR-Code' },
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header - Minimalistisk som din Figma */}
      <header className="p-10 px-20 flex justify-between items-center">
        <div className="text-[32px] font-medium tracking-tight">Journy</div>
        <div className="w-10 h-10 bg-[#D9D9D9] rounded-full" />
      </header>

      {/* Stegmätare 1-5 */}
      <div className="max-w-5xl mx-auto px-20 mb-24">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative z-10">
                {/* Cirkel med Röd Ring för det aktiva huvudsteget */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
                  currentStep === step.id 
                    ? 'border-2 border-[#4E001D] text-[#4E001D] bg-white scale-110' 
                    : currentStep > step.id 
                      ? 'bg-[#4E001D] text-white' 
                      : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.id}
                </div>
                {/* Etikett under cirkeln */}
                <span className={`absolute top-12 whitespace-nowrap text-[10px] uppercase tracking-[2px] font-bold ${
                  currentStep === step.id ? 'text-[#1A1A1A]' : 'text-gray-300'
                }`}>
                  {step.label}
                </span>
              </div>

              {/* Linje mellan cirklarna */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-[1px] mx-6 bg-gray-100 relative">
                  <div 
                    className="absolute h-full bg-[#4E001D] transition-all duration-700" 
                    style={{ width: currentStep > step.id ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Innehållet för varje specifik sida */}
      <main className="max-w-4xl mx-auto px-20 pb-20">
        {children}
      </main>
    </div>
  );
}