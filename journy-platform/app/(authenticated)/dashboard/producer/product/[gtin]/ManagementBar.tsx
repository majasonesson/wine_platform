'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toggleVisibilityAction, generateQRCodeAction } from '@/app/actions/wine';

interface ManagementBarProps {
    gtin: string;
    isPublished: boolean;
    qrCodeUrl: string | null;
}

export default function ManagementBar({ gtin, isPublished, qrCodeUrl }: ManagementBarProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const handleToggleVisibility = async () => {
        setIsToggling(true);
        try {
            const result = await toggleVisibilityAction(gtin, isPublished);
            if (!result.success) {
                alert(`Error toggling visibility: ${result.error}`);
            }
        } catch (error: any) {
            alert(`Unexpected error: ${error.message}`);
        } finally {
            setIsToggling(false);
        }
    };

    const handleGenerateQR = async () => {
        setIsGenerating(true);
        try {
            const result = await generateQRCodeAction(gtin);
            if (result.success && result.qrUrl) {
                // Trigger download automatically
                const response = await fetch(result.qrUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `QR_${gtin}.png`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                alert("QR Code generated and downloaded!");
            } else {
                alert(`Error generating QR: ${result.error}`);
            }
        } catch (error: any) {
            alert(`Unexpected error: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full max-w-[340px] flex flex-col gap-4 mt-8 pb-12">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h5 className="text-[10px] font-black uppercase tracking-[3px] text-[#4E001D]">Producer Management</h5>
                    <p className="text-[11px] text-gray-400">Manage visibility and assets for this product.</p>
                </div>

                <div className="flex flex-col gap-3">
                    {/* Toggle Visibility */}
                    <button
                        onClick={handleToggleVisibility}
                        disabled={isToggling}
                        className={`w-full py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isPublished
                            ? 'bg-green-50 text-green-700 border border-green-100'
                            : 'bg-gray-50 text-gray-400 border border-gray-100'} ${isToggling ? 'opacity-50' : ''}`}
                    >
                        {isPublished ? 'Visible to Partners' : 'Hidden from Partners'}
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Edit Wine */}
                        <Link
                            href={`/add-product/general-info?gtin=${gtin}`}
                            className="bg-white border border-gray-100 text-gray-400 hover:text-black py-4 rounded-full text-[10px] font-bold uppercase tracking-widest text-center transition-all"
                        >
                            Edit Wine
                        </Link>

                        {/* Generate & Download QR */}
                        <button
                            onClick={handleGenerateQR}
                            disabled={isGenerating}
                            className={`w-full h-full bg-white border border-gray-100 text-[#4E001D] hover:bg-[#4E001D] hover:text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isGenerating ? 'opacity-50' : ''}`}
                        >
                            {isGenerating ? 'Saving...' : (qrCodeUrl ? 'Regen & Save' : 'Gen & Save QR')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
