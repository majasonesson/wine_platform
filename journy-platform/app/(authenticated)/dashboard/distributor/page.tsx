import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { signOutAction } from '@/app/(auth)/signup/actions';

export default async function DistributorDashboard() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    const { data: distributor } = await supabase
        .from('distributor')
        .select('id, company_name')
        .eq('user_id', user?.id)
        .single();

    // Fetch wines in distributor's portfolio
    const { data: portfolioWines, error: portfolioError } = await supabase
        .from('distributor_portfolio')
        .select(`
            wine_gtin,
            wine:wine_gtin (
                gtin,
                wine_name,
                product_image_url,
                vintage,
                producer:producer_id (
                    company_name
                )
            )
        `)
        .eq('distributor_id', distributor?.id);

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-10">
            <div className="mb-10">
                <h1 className="text-4xl font-light text-[#1A1A1A] mb-6">
                    Welcome {user?.user_metadata?.first_name || distributor?.company_name || 'Distributor'}!
                </h1>

                <div className="flex flex-wrap gap-4">
                    <Link href="/connect">
                        <button className="flex items-center gap-3 border border-gray-200 px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all text-[#4E001D]">
                            Connect
                        </button>
                    </Link>

                    <Link href="/profile">
                        <button className="flex items-center gap-3 border border-gray-200 px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all text-gray-600">
                            Profile
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

            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#1A1A1A]">Your Wine Portfolio</h2>
                <p className="text-gray-500 text-sm">Wines you've added from connected producers</p>
            </div>

            {portfolioError ? (
                <div className="text-red-500">Error loading portfolio: {portfolioError.message}</div>
            ) : portfolioWines && portfolioWines.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {portfolioWines.map((item: any) => (
                        <div key={item.wine_gtin} className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all flex flex-col group">
                            {/* Photo Container */}
                            <div className="h-44 w-full mb-6 flex items-center justify-center bg-gray-50 rounded-[24px] overflow-hidden group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-50">
                                {item.wine?.product_image_url ? (
                                    <img
                                        src={item.wine.product_image_url}
                                        alt={item.wine.wine_name}
                                        className="h-full object-contain mix-blend-multiply p-3"
                                    />
                                ) : (
                                    <div className="w-6 h-10 border-2 border-dashed border-gray-200 rounded-sm"></div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="text-center mb-6">
                                <h3 className="font-bold text-gray-900 leading-tight mb-1 text-[15px]">
                                    {item.wine?.wine_name}
                                </h3>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-[11px] text-[#4E001D] font-bold uppercase tracking-wider">{item.wine?.vintage || 'NV'}</span>
                                    <span className="text-[11px] text-gray-300">•</span>
                                    <span className="text-[11px] text-gray-400 font-medium">{item.wine?.producer?.company_name}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <Link
                                href={`/dashboard/distributor/product/${item.wine_gtin}`}
                                className="w-full bg-[#1A1A1A] text-white py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-center hover:bg-[#4E001D] transition-all shadow-sm"
                            >
                                View More
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-[40px] text-center bg-gray-50/50">
                    <p className="text-gray-400 mb-4 font-medium">Your portfolio is empty</p>
                    <Link href="/connect">
                        <button className="bg-[#4E001D] text-white px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                            Find producers and add wines
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
