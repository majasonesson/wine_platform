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
                <p className="text-gray-500">Wines you've added from connected producers</p>
            </div>

            {portfolioError ? (
                <div className="text-red-500">Error loading portfolio: {portfolioError.message}</div>
            ) : portfolioWines && portfolioWines.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {portfolioWines.map((item: any) => (
                        <div key={item.wine_gtin} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col">
                            <div className="h-40 w-full mb-4 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
                                {item.wine?.product_image_url ? (
                                    <img
                                        src={item.wine.product_image_url}
                                        alt={item.wine.wine_name}
                                        className="h-full object-contain mix-blend-multiply p-2"
                                    />
                                ) : (
                                    <div className="w-6 h-10 border-2 border-dashed border-gray-200 rounded-sm"></div>
                                )}
                            </div>
                            <div className="text-center mb-4">
                                <h3 className="font-medium text-gray-900 leading-tight">
                                    {item.wine?.wine_name} {item.wine?.vintage}
                                </h3>
                                <p className="text-xs text-[#4E001D] font-medium mt-1">
                                    {item.wine?.producer?.company_name}
                                </p>
                            </div>
                            <Link
                                href={`/dashboard/distributor/product/${item.wine_gtin}`}
                                className="w-full bg-[#4E001D] text-white py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-center hover:opacity-90 transition-opacity"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-3xl text-center">
                    <p className="text-gray-400 mb-4">Your portfolio is empty</p>
                    <Link href="/connect">
                        <button className="text-[#4E001D] font-semibold hover:underline">
                            Find producers and add wines
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
