'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function ProducerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    }
    loadData();
  }, [supabase, router]);

  const handleAddProduct = () => {
    router.push('/add-product/producer/general-info');
  };

  if (loading) return null;

  return (
    <div className="bg-white min-h-screen font-sans p-10 px-20 relative">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-32">
        <div className="text-[32px] font-medium tracking-tight">Journy</div>
        
        <div className="flex items-center gap-10">
          <button className="text-[16px] hover:opacity-50">Connect</button>
          <button className="text-[16px] hover:opacity-50">Home</button>
          {/* Profile Icon - Bare and simple as in Figma */}
          <div className="w-12 h-12 bg-[#D9D9D9] rounded-full overflow-hidden flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl">
        <h1 className="text-[18px] text-gray-500 mb-12 lowercase">
          Welcome {user?.user_metadata?.first_name || 'maja'}!
        </h1>

        <div className="flex flex-col items-start gap-4">
          {/* Add Product Button */}
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-3 border border-gray-200 rounded-full px-6 py-2 hover:bg-gray-50 transition-all group"
          >
            <span className="text-[14px] font-medium tracking-widest text-gray-400 uppercase">
              Add Product
            </span>
            <div className="w-6 h-6 bg-[#4E001D] rounded-full flex items-center justify-center text-white text-lg">
              +
            </div>
          </button>
        </div>

        {/* Placeholder Text */}
        <div className="mt-[250px] w-full flex justify-center">
          <p className="text-[14px] text-gray-300 font-light">
            Press on "Add Product" to add a new product
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-10 left-0 w-full text-center">
        <p className="text-[12px] text-gray-300">@Journy2025 all rights reserved</p>
      </footer>
    </div>
  );
}