import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import DistributorManagementBar from './DistributorManagementBar';
import WinePassportView from '@/components/wine/WinePassportView';

export default async function DistributorProductPage({
    params,
}: {
    params: Promise<{ gtin: string }>;
}) {
    const { gtin } = await params;

    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: distributor } = await supabase
        .from('distributor')
        .select('id')
        .eq('user_id', user.id)
        .single();
    if (!distributor) redirect('/profile');

    // Fetch from the complete view
    const { data: wine, error } = await supabase
        .from('wine_full_card')
        .select('*')
        .eq('gtin', gtin)
        .single();

    if (error || !wine) {
        return notFound();
    }

    // Check if in portfolio
    const { data: portfolioEntry } = await supabase
        .from('distributor_portfolio')
        .select('id')
        .eq('distributor_id', distributor.id)
        .eq('wine_gtin', gtin)
        .single();

    if (!portfolioEntry) {
        // If not in portfolio, redirect back to dashboard
        redirect('/dashboard/distributor');
    }

    return (
        <main className="min-h-screen bg-[#FDFDFD] py-12 px-4 flex flex-col items-center gap-8">

            {/* 1. BACK TO DASHBOARD BUTTON */}
            <div className="w-full max-w-[340px] flex justify-start">
                <Link href="/dashboard/distributor" className="group flex items-center gap-3 text-gray-400 hover:text-[#4E001D] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Portfolio</span>
                </Link>
            </div>

            {/* 2. THE PHONE PREVIEW (Using Shared Component) */}
            <WinePassportView wine={wine} />

            {/* 3. DISTRIBUTOR MANAGEMENT BAR (Sync Feature) */}
            <DistributorManagementBar wine={wine} />

        </main>
    );
}
