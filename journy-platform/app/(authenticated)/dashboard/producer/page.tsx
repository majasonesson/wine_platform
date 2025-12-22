import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import WineCard from './WineCard';
import { signOutAction } from '@/app/(auth)/signup/actions';

export default async function WinesPage() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch { }
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    const { data: producer } = await supabase
        .from('producer')
        .select('id, company_name')
        .eq('user_id', user?.id)
        .single();

    const { data: wines, error: wineError } = await supabase
        .from('wine')
        .select('gtin, wine_name, product_image_url, vintage')
        .eq('producer_id', producer?.id)
        .order('wine_name', { ascending: true });

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-10">

            {/* 1. WELCOME SECTION (Från din skiss) */}
            <div className="mb-10">
                <h1 className="text-4xl font-light text-[#1A1A1A] mb-6">
                    Welcome {user?.user_metadata?.first_name || producer?.company_name || 'Producer'}!
                </h1>

                {/* DIN KNAPP ÄR TILLBAKA HÄR */}
                <div className="flex gap-4">
                    <Link href="/add-product/general-info">
                        <button className="flex items-center gap-3 border border-gray-200 px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                            Add Product <span className="bg-[#4E001D] text-white w-5 h-5 rounded-full flex items-center justify-center text-lg">+</span>
                        </button>
                    </Link>

                    <form action={signOutAction}>
                        <button type="submit" className="px-6 py-2 border border-gray-100 text-gray-400 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors">
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>

            <hr className="border-gray-100 mb-10" />

            {/* 2. WINE GRID SECTION */}
            {wineError ? (
                <div className="text-red-500">Error loading wines: {wineError.message}</div>
            ) : wines && wines.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {wines.map((wine) => (
                        <WineCard key={wine.gtin} wine={wine} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                    <p className="text-gray-400">No products available</p>
                </div>
            )}
        </div>
    );
}