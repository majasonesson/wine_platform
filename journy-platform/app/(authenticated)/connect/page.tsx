'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { sendPartnershipRequest, respondToPartnership, pausePartnership, deletePartnership, addWineToPortfolio } from './actions';
import Link from 'next/link';

export default function ConnectPage() {
    const [activeTab, setActiveTab] = useState<'discover' | 'requests'>('discover');
    const [userType, setUserType] = useState<'producer' | 'distributor' | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function checkUserType() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Check if producer
            const { data: producer } = await supabase.from('producer').select('id').eq('user_id', user.id).single();
            if (producer) {
                setUserType('producer');
                setLoading(false);
                return;
            }

            // Check if distributor
            const { data: distributor } = await supabase.from('distributor').select('id').eq('user_id', user.id).single();
            if (distributor) {
                setUserType('distributor');
            }

            setLoading(false);
        }
        checkUserType();
    }, [supabase]);

    if (loading) {
        return <div className="p-20 text-center text-gray-500 animate-pulse">Loading...</div>;
    }

    if (!userType) {
        return <div className="p-20 text-center text-red-500">User profile not found</div>;
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">Connect</h1>
                    <p className="text-gray-500">
                        {userType === 'producer'
                            ? 'Find and connect with distributors to expand your reach'
                            : 'Discover producers and build your wine portfolio'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('discover')}
                        className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'discover'
                            ? 'text-[#4E001D] border-b-2 border-[#4E001D]'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Discover {userType === 'producer' ? 'Distributors' : 'Producers'}
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'requests'
                            ? 'text-[#4E001D] border-b-2 border-[#4E001D]'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Connection Requests
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'discover' ? (
                    <DiscoverTab userType={userType} />
                ) : (
                    <RequestsTab userType={userType} />
                )}
            </div>
        </div>
    );
}

function DiscoverTab({ userType }: { userType: 'producer' | 'distributor' }) {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function loadProfiles() {
            setLoading(true);

            if (userType === 'producer') {
                // Load distributors
                const { data, error } = await supabase
                    .from('distributor')
                    .select(`
                        id,
                        company_name,
                        origin_attribute_number,
                        origin_master(country_name, region_name, district_name)
                    `)
                    .eq('is_public', true)
                    .order('company_name');

                if (error) console.error("Error loading distributors:", error);
                setProfiles(data || []);
            } else {
                // Load producers
                const { data, error } = await supabase
                    .from('producer')
                    .select(`
                        id,
                        company_name,
                        origin_attribute_number,
                        origin_master(country_name, region_name, district_name)
                    `)
                    .eq('is_public', true)
                    .order('company_name');

                if (error) console.error("Error loading producers:", error);
                setProfiles(data || []);
            }

            setLoading(false);
        }
        loadProfiles();
    }, [userType, supabase]);

    const filteredProfiles = profiles.filter(p =>
        p.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="text-center py-12 text-gray-500 animate-pulse">Loading...</div>;
    }

    return (
        <div>
            {/* Search */}
            <div className="mb-8">
                <input
                    type="text"
                    placeholder={`Search ${userType === 'producer' ? 'distributors' : 'producers'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4E001D] transition-colors"
                />
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((profile) => (
                    userType === 'producer' ? (
                        <DistributorCard key={profile.id} distributor={profile} />
                    ) : (
                        <ProducerCard key={profile.id} producer={profile} />
                    )
                ))}
            </div>

            {filteredProfiles.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No {userType === 'producer' ? 'distributors' : 'producers'} found
                </div>
            )}
        </div>
    );
}

function DistributorCard({ distributor }: { distributor: any }) {
    const [connecting, setConnecting] = useState(false);
    const origin = distributor.origin_master;
    const locationText = origin
        ? `${distributor.company_name || 'Unknown'} distributor from ${origin.region_name || origin.country_name}`
        : 'Location unknown';

    async function handleConnect() {
        setConnecting(true);
        const result = await sendPartnershipRequest(distributor.id, 'producer');
        if (result.error) {
            alert(result.error);
        } else {
            alert('Connection request sent!');
        }
        setConnecting(false);
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{distributor.company_name}</h3>
            <p className="text-sm text-gray-600 mb-4">{locationText}</p>
            <button
                onClick={handleConnect}
                disabled={connecting}
                className="w-full bg-[#4E001D] text-white py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
                {connecting ? 'Sending...' : 'Connect'}
            </button>
        </div>
    );
}

function ProducerCard({ producer }: { producer: any }) {
    const [connecting, setConnecting] = useState(false);
    const [showPortfolio, setShowPortfolio] = useState(false);
    const origin = producer.origin_master;
    const locationText = origin
        ? `${origin.country_name} producer from ${origin.region_name || origin.district_name || origin.country_name}`
        : 'Location unknown';

    async function handleConnect() {
        setConnecting(true);
        const result = await sendPartnershipRequest(producer.id, 'distributor');
        if (result.error) {
            alert(result.error);
        } else {
            alert('Connection request sent!');
        }
        setConnecting(false);
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{producer.company_name}</h3>
            <p className="text-sm text-gray-600 mb-4">{locationText}</p>
            <div className="flex gap-2">
                <button
                    onClick={() => setShowPortfolio(true)}
                    className="flex-1 bg-gray-100 text-[#4E001D] py-2.5 rounded-full font-medium hover:bg-gray-200 transition-colors"
                >
                    View Portfolio
                </button>
                <button
                    onClick={handleConnect}
                    disabled={connecting}
                    className="flex-1 bg-[#4E001D] text-white py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {connecting ? 'Sending...' : 'Connect'}
                </button>
            </div>

            {showPortfolio && (
                <ViewPortfolio producerId={producer.id} onClose={() => setShowPortfolio(false)} producerName={producer.company_name} />
            )}
        </div>
    );
}

function RequestsTab({ userType }: { userType: 'producer' | 'distributor' }) {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function loadRequests() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            if (userType === 'producer') {
                const { data: producer } = await supabase.from('producer').select('id').eq('user_id', user.id).single();
                if (!producer) return;

                const { data } = await supabase
                    .from('partnership')
                    .select(`
            producer_id,
            distributor_id,
            status,
            linked_at,
            distributor:distributor_id (
              company_name,
              origin_master:origin_attribute_number (country_name, region_name)
            )
          `)
                    .eq('producer_id', producer.id)
                    .eq('status', 'pending');

                setRequests(data || []);
            } else {
                const { data: distributor } = await supabase.from('distributor').select('id').eq('user_id', user.id).single();
                if (!distributor) return;

                const { data } = await supabase
                    .from('partnership')
                    .select(`
            producer_id,
            distributor_id,
            status,
            linked_at,
            producer:producer_id (
              company_name,
              origin_master:origin_attribute_number (country_name, region_name)
            )
          `)
                    .eq('distributor_id', distributor.id)
                    .eq('status', 'pending');

                setRequests(data || []);
            }

            setLoading(false);
        }
        loadRequests();
    }, [userType, supabase]);

    async function handleResponse(producerId: string, distributorId: string, accept: boolean) {
        const result = await respondToPartnership(producerId, distributorId, accept);
        if (result.error) {
            alert(result.error);
        } else {
            // Reload requests
            setRequests(requests.filter(r => !(r.producer_id === producerId && r.distributor_id === distributorId)));
            alert(accept ? 'Connection accepted!' : 'Connection declined');
        }
    }

    if (loading) {
        return <div className="text-center py-12 text-gray-500 animate-pulse">Loading requests...</div>;
    }

    if (requests.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No pending connection requests
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => {
                const partner = userType === 'producer' ? request.distributor : request.producer;
                const origin = partner?.origin_master;
                const locationText = origin
                    ? `${origin.country_name} ${userType === 'producer' ? 'distributor' : 'producer'} from ${origin.region_name || origin.country_name}`
                    : 'Location unknown';

                return (
                    <div key={`${request.producer_id}-${request.distributor_id}`} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{partner?.company_name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{locationText}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleResponse(request.producer_id, request.distributor_id, true)}
                                className="flex-1 bg-green-500 text-white py-2.5 rounded-full font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                                Accept
                            </button>
                            <button
                                onClick={() => handleResponse(request.producer_id, request.distributor_id, false)}
                                className="flex-1 bg-red-500 text-white py-2.5 rounded-full font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                                Decline
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ViewPortfolio({ producerId, onClose, producerName }: { producerId: string; onClose: () => void; producerName: string }) {
    const [wines, setWines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState<string | null>(null);
    const [portfolioIds, setPortfolioIds] = useState<Set<string>>(new Set());

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function loadData() {
            setLoading(true);

            // Get user's existing portfolio to show status
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: distributor } = await supabase.from('distributor').select('id').eq('user_id', user.id).single();
                if (distributor) {
                    const { data: existing } = await supabase
                        .from('distributor_portfolio')
                        .select('wine_gtin')
                        .eq('distributor_id', distributor.id);

                    if (existing) {
                        setPortfolioIds(new Set(existing.map(e => e.wine_gtin)));
                    }
                }
            }

            // Load producer's wines
            const { data } = await supabase
                .from('wine_full_card')
                .select('*')
                .eq('producer_id', producerId)
                .eq('is_published', true);

            setWines(data || []);
            setLoading(false);
        }
        loadData();
    }, [producerId, supabase]);

    const handleAddToPortfolio = async (gtin: string) => {
        setAdding(gtin);
        const result = await addWineToPortfolio(gtin);
        if (result.success) {
            setPortfolioIds(prev => new Set([...prev, gtin]));
        } else {
            alert(result.error);
        }
        setAdding(null);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all" onClick={onClose}>
            <div className="bg-white rounded-[40px] p-10 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={(e) => e.stopPropagation()}>

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-8 right-8 text-gray-300 hover:text-[#4E001D] transition-all hover:scale-110">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                <div className="mb-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4E001D] mb-2">Portfolio</p>
                    <h2 className="text-4xl font-light text-[#1A1A1A] tracking-tight">{producerName}</h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[380px] bg-gray-50 rounded-[32px] animate-pulse" />
                        ))}
                    </div>
                ) : wines.length === 0 ? (
                    <div className="text-center py-24 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
                        <p className="text-gray-400 font-medium">No published wines yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wines.map((wine) => (
                            <WineDiscoveryCard
                                key={wine.gtin}
                                wine={wine}
                                isInPortfolio={portfolioIds.has(wine.gtin)}
                                isAdding={adding === wine.gtin}
                                onAdd={() => handleAddToPortfolio(wine.gtin)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function WineDiscoveryCard({ wine, isInPortfolio, isAdding, onAdd }: { wine: any; isInPortfolio: boolean; isAdding: boolean; onAdd: () => void }) {

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 p-6 flex flex-col hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group">
            {/* Image Container */}
            <div className="h-56 w-full mb-6 flex items-center justify-center bg-gray-50 rounded-[24px] overflow-hidden group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-50">
                {wine.product_image_url ? (
                    <img
                        src={wine.product_image_url}
                        alt={wine.wine_name}
                        className="h-full object-contain mix-blend-multiply p-4"
                    />
                ) : (
                    <div className="w-12 h-20 border-2 border-dashed border-gray-200 rounded-sm"></div>
                )}
            </div>

            {/* Info */}
            <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                    {wine.wine_name}
                </h3>
                <p className="text-sm text-gray-400 font-medium">
                    {wine.vintage || 'NV'} • {wine.wine_type || 'Wine'}
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-auto">
                <Link
                    href={`/connect/product/${wine.gtin}`}
                    className="w-full bg-[#1A1A1A] text-white py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-[#4E001D] transition-all text-center"
                >
                    View More
                </Link>
                <button
                    onClick={onAdd}
                    disabled={isInPortfolio || isAdding}
                    className={`w-full py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all border ${isInPortfolio
                        ? 'bg-green-50 text-green-600 border-green-100 cursor-default'
                        : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
                        }`}
                >
                    {isAdding ? 'Adding...' : isInPortfolio ? 'In Portfolio' : 'Add to Portfolio'}
                </button>
            </div>
        </div>
    );
}
