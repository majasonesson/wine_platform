'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { removeWineFromPortfolio } from '@/app/(authenticated)/connect/actions';

interface DistributorManagementBarProps {
    wine: any;
}

export default function DistributorManagementBar({ wine }: DistributorManagementBarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [syncingStatus, setSyncingStatus] = useState<string | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);
    const router = useRouter();

    const handleSync = (platform: string) => {
        setIsMenuOpen(false);
        setSyncingStatus(platform);

        // Mock sync process
        setTimeout(() => {
            setSyncingStatus(null);
            alert(`Successfully synced ${wine.wine_name} to ${platform}!`);
        }, 2000);
    };

    const handleRemove = async () => {
        if (!confirm(`Are you sure you want to remove ${wine.wine_name} from your portfolio?`)) return;

        setIsRemoving(true);
        const result = await removeWineFromPortfolio(wine.gtin);
        if (result.success) {
            router.push('/dashboard/distributor');
            router.refresh();
        } else {
            alert(result.error);
            setIsRemoving(false);
        }
    };

    return (
        <div className="w-full max-w-[340px] flex flex-col gap-4 mt-8 pb-12">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl flex flex-col gap-6 relative">
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <h5 className="text-[10px] font-black uppercase tracking-[3px] text-[#4E001D]">Management</h5>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[8px] font-bold uppercase text-green-600 tracking-tighter">Connected</span>
                        </div>
                    </div>
                    <p className="text-[11px] text-gray-400">Manage data & platform synchronizations.</p>
                </div>

                <div className="flex flex-col gap-3">
                    {/* Sync Dropdown Trigger */}
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            disabled={syncingStatus !== null}
                            className={`w-full py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-3 border ${syncingStatus
                                ? 'bg-gray-50 text-gray-400'
                                : 'bg-[#1A1A1A] text-white hover:bg-[#4E001D]'
                                }`}
                        >
                            {syncingStatus ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-gray-300 border-t-white rounded-full animate-spin" />
                                    Syncing to {syncingStatus}...
                                </>
                            ) : (
                                <>
                                    <span>Sync Information</span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}>
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Sync Menu */}
                        {isMenuOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[24px] border border-gray-100 shadow-2xl p-2 z-[70] animate-in fade-in slide-in-from-top-2">
                                <SyncOption
                                    name="Validoo"
                                    color="#00AEEF"
                                    onClick={() => handleSync('Validoo')}
                                    desc="GS1 data synchronization"
                                />
                                <SyncOption
                                    name="Visma"
                                    color="#FF6A00"
                                    onClick={() => handleSync('Visma')}
                                    desc="ERP & Inventory mapping"
                                />
                                <SyncOption
                                    name="Wordpress"
                                    color="#21759B"
                                    onClick={() => handleSync('Wordpress')}
                                    desc="WooCommerce product sync"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {/* Remove from Portfolio */}
                        <button
                            onClick={handleRemove}
                            disabled={isRemoving}
                            className="bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-100 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest text-center transition-all"
                        >
                            {isRemoving ? 'Removing...' : 'Remove from Portfolio'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SyncOption({ name, color, onClick, desc }: { name: string; color: string; onClick: () => void; desc: string }) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left p-3 rounded-[16px] hover:bg-gray-50 transition-colors group flex items-start gap-3"
        >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-[10px] shrink-0 shadow-sm transition-transform group-hover:scale-105" style={{ backgroundColor: color }}>
                {name[0]}
            </div>
            <div>
                <p className="text-[11px] font-bold text-gray-900 group-hover:text-[#4E001D] transition-colors">{name}</p>
                <p className="text-[9px] text-gray-400 leading-tight">{desc}</p>
            </div>
        </button>
    );
}
