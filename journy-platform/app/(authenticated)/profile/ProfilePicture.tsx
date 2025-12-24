'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProfilePictureProps {
    type: 'producer' | 'distributor';
    id: string;
    imageUrl: string | null;
}

export default function ProfilePicture({ type, id, imageUrl }: ProfilePictureProps) {
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(`/api/users/update-avatar?filename=${file.name}&type=${type}&id=${id}`, {
                method: 'POST',
                body: file,
            });

            if (res.ok) {
                router.refresh();
            } else {
                const err = await res.json();
                alert("Upload failed: " + err.error);
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("An error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative group w-48 h-48">
            <div className="w-full h-full bg-gray-100 rounded-[32px] overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-200 group-hover:border-[#4E001D]/20 transition-all">
                {imageUrl ? (
                    <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                )}
            </div>

            <label className="absolute bottom-2 right-2 cursor-pointer bg-white p-2 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-all">
                <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
                {uploading ? (
                    <div className="w-5 h-5 border-2 border-[#4E001D] border-t-transparent rounded-full animate-spin" />
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4E001D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                    </svg>
                )}
            </label>
        </div>
    );
}
