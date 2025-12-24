'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleProfilePublic } from '@/app/(authenticated)/profile/profile-actions';

interface VisibilityToggleProps {
    type: 'producer' | 'distributor';
    initialValue: boolean | null;
}

export default function VisibilityToggle({ type, initialValue }: VisibilityToggleProps) {
    const [isPublic, setIsPublic] = useState(initialValue ?? false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        setLoading(true);
        try {
            const newValue = !isPublic;
            console.log("Toggle clicked. Current:", isPublic, "New:", newValue, "Type:", type);
            const result = await toggleProfilePublic(type, newValue);

            if (result && result.success) {
                console.log("Toggle success. Refreshing...");
                setIsPublic(newValue);
                router.refresh();
            } else {
                const errMsg = result?.error || "Unknown error occurred";
                console.error("Toggle failed:", errMsg);
                alert("Error toggling visibility: " + errMsg);
            }
        } catch (error: any) {
            console.error("Fatal toggle error:", error);
            alert("A fatal error occurred: " + (error.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${isPublic
                ? 'bg-green-500 text-white shadow-lg hover:bg-green-600'
                : 'bg-white border border-gray-200 text-gray-400 hover:border-gray-300'
                }`}
        >
            <div className={`w-2 h-2 rounded-full ${isPublic ? 'bg-white animate-pulse' : 'bg-gray-300'}`} />
            {loading ? 'Updating...' : isPublic ? 'Public Profile' : 'Make Profile Public'}
        </button>
    );
}
