'use client';

import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { generateDigitalLink } from '@/utils/gs1';

interface WineCardProps {
  wine: {
    gtin: string;
    wine_name: string;
    product_image_url: string | null;
    vintage: number | null;
    alcohol_content_percent?: number;
    best_before_date?: string;
  };
}

export default function WineCard({ wine }: WineCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${wine.wine_name}?`)) return;

    setIsDeleting(true);
    const { error } = await supabase
      .from('wine')
      .delete()
      .eq('gtin', wine.gtin);

    if (error) {
      alert("Error: " + error.message);
      setIsDeleting(false);
    } else {
      router.refresh();
    }
  };

  // Generate GS1 Digital Link URL
  const digitalLink = generateDigitalLink({
    gtin: wine.gtin,
    alcoholPercent: wine.alcohol_content_percent,
    expiryDate: wine.best_before_date,
    domain: '' // Use relative path for internal routing
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-center">

      {/* PHOTO OF WINE */}
      <div className="h-40 w-full mb-4 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
        {wine.product_image_url ? (
          <img
            src={wine.product_image_url}
            alt={wine.wine_name}
            className="h-full object-contain mix-blend-multiply p-2"
          />
        ) : (
          <div className="w-6 h-10 border-2 border-dashed border-gray-200 rounded-sm"></div>
        )}
      </div>

      {/* WINE NAME & GTIN */}
      <div className="text-center mb-6">
        <h3 className="font-medium text-gray-900 leading-tight mb-1">
          {wine.wine_name} {wine.vintage}
        </h3>
        <p className="text-[10px] text-gray-400 font-mono tracking-tighter">
          GTIN: {wine.gtin}
        </p>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col gap-2 w-full mt-auto">
        <div className="flex gap-2 w-full">
          {/* VIEW (Management) - Producer sees the management page */}
          <Link
            href={`/dashboard/producer/product/${wine.gtin}`}
            className="flex-1 bg-[#4E001D] text-white py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-center hover:bg-black transition-colors"
          >
            Manage
          </Link>

          {/* EDIT - Link directly to General Info with GTIN */}
          <Link
            href={`/add-product/general-info?gtin=${wine.gtin}`}
            className="flex-1 bg-white border border-gray-100 text-gray-400 hover:text-black py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-center transition-all"
          >
            Edit
          </Link>
        </div>

        <div className="flex gap-2 w-full">
          {/* DELETE - On click trigger */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-400 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"
          >
            {isDeleting ? '...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}