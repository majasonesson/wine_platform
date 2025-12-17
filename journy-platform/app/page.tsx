'use client';
import { useState } from 'react';

export default function AvatarUpload() {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);

    const file = e.target.files[0];
    const response = await fetch(`/api/user/update-avatar?filename=${file.name}`, {
      method: 'POST',
      body: file,
    });

    const newBlob = await response.json();
    setUrl(newBlob.url);
    setUploading(false);
  };

  return (
    <div className="p-10 border rounded-lg">
      <h3 className="text-xl mb-4">Upload Profile Picture</h3>
      <input type="file" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading to Vercel Blob...</p>}
      {url && (
        <div className="mt-4">
          <p>Saved to Supabase!</p>
          <img src={url} alt="Avatar" className="w-20 h-20 rounded-full mt-2" />
        </div>
      )}
    </div>
  );
}