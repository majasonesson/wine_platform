'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addWineToPortfolio, removeWineFromPortfolio } from '@/app/(authenticated)/connect/actions';

interface ConnectActionBarProps {
    wine: any;
    isInPortfolio: boolean;
}

export default function ConnectActionBar({ wine, isInPortfolio }: ConnectActionBarProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAction = async () => {
        setLoading(true);
        if (isInPortfolio) {
            // Optional: allow removing from here too? User asked for remove on dashboard, maybe keep it simple here.
            // But logic for toggle is good UX.
            const result = await removeWineFromPortfolio(wine.gtin);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error);
            }
        } else {
            const result = await addWineToPortfolio(wine.gtin);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error);
            }
        }
        setLoading(false);
    };

    return (
        <div className="w-full max-w-[340px] flex flex-col gap-4 mt-8 pb-12">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h5 className="text-[10px] font-black uppercase tracking-[3px] text-[#4E001D]">Actions</h5>
                    <p className="text-[11px] text-gray-400">Manage this wine in your portfolio.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={handleAction}
                        disabled={loading}
                        className={`w-full py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl ${isInPortfolio
                                ? 'bg-green-50 text-green-600 border border-green-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100'
                                : 'bg-[#4E001D] text-white hover:bg-black'
                            }`}
                    >
                        {loading
                            ? 'Processing...'
                            : (isInPortfolio ? 'In Portfolio (Tap to Remove)' : 'Add to Portfolio')
                        }
                    </button>

                    {isInPortfolio && (
                        <div className="text-center">
                            <p className="text-[10px] text-gray-400">This wine is currently visible in your dashboard.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
