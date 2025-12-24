import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ProfilePicture from '@/app/(authenticated)/profile/ProfilePicture';
import CompanyInformation from '@/app/(authenticated)/profile/CompanyInformation';
import DiversityInclusion from '@/app/(authenticated)/profile/DiversityInclusion';
import Certifications from '@/app/(authenticated)/profile/Certifications';
import VisibilityToggle from '@/app/(authenticated)/profile/VisibilityToggle';

export default async function ProfilePage() {
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
    if (!user) redirect('/login');

    // Check if producer
    let { data: profile } = await supabase
        .from('producer')
        .select(`
            *,
            origin_master (country_name, region_name, district_name)
        `)
        .eq('user_id', user.id)
        .single();

    let userType: 'producer' | 'distributor' = 'producer';

    if (!profile) {
        // Check if distributor
        const { data: distProfile } = await supabase
            .from('distributor')
            .select(`
                *,
                origin_master (country_name, region_name, district_name)
            `)
            .eq('user_id', user.id)
            .single();

        if (distProfile) {
            profile = distProfile;
            userType = 'distributor';
        }
    }

    if (!profile) return <div className="p-20 text-center">Profile not found.</div>;

    // Fetch certifications
    const { data: certs } = await supabase
        .from('owner_certificate_instance')
        .select(`
            *,
            certificate (certificate_code)
        `)
        .eq(userType === 'producer' ? 'producer_id' : 'distributor_id', profile.id);

    // Fetch all origin data for the edit forms
    const { data: originMaster } = await supabase
        .from('origin_master')
        .select('attribute_number, country_name, region_name, district_name')
        .order('country_name')
        .order('region_name');

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-8 md:p-12">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <Link href={`/dashboard/${userType}`} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#4E001D] transition-all flex items-center gap-2 mb-2">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
                            Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-light text-gray-900 tracking-tight">Profile</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <VisibilityToggle type={userType} initialValue={profile.is_public} />
                        <Link href="/settings">
                            <button className="flex items-center gap-2 border border-gray-200 px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all text-gray-600">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                                Settings
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Photo & Quick Info */}
                    <div className="lg:w-1/3 flex flex-col items-center">
                        <ProfilePicture type={userType} id={profile.id} imageUrl={profile.profile_image_url} />
                        <div className="mt-8 text-center">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-1">{profile.company_name}</h2>
                            <p className="text-sm text-gray-400 capitalize">{userType}</p>
                        </div>
                    </div>

                    {/* Right Column: Detailed Components */}
                    <div className="lg:w-2/3 space-y-8">
                        <CompanyInformation type={userType} initialData={profile} originMaster={originMaster || []} />
                        <DiversityInclusion type={userType} initialData={profile} />
                        <Certifications certificates={certs || []} />
                    </div>
                </div>
            </div>
        </div>
    );
}
