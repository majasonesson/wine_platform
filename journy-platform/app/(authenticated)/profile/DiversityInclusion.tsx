'use client';

import { useState } from 'react';
import { updateProfileStep2 } from '@/app/(authenticated)/profile/profile-actions';

interface DiversityInclusionProps {
    type: 'producer' | 'distributor';
    initialData: any;
}

export default function DiversityInclusion({ type, initialData }: DiversityInclusionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        founding_team_type: initialData.founding_team_type || 'not_specified',
        gender_dist_women: initialData.gender_dist_women || 0,
        gender_dist_men: initialData.gender_dist_men || 0,
        gender_dist_non_binary: initialData.gender_dist_non_binary || 0,
        women_in_leadership: initialData.women_in_leadership || 0,
        men_in_leadership: initialData.men_in_leadership || 0,
        non_binary_in_leadership: initialData.non_binary_in_leadership || 0,
    });

    const handleSave = async () => {
        setLoading(true);
        const result = await updateProfileStep2(type, formData);
        if (result.success) {
            setIsEditing(false);
        } else {
            alert("Error: " + result.error);
        }
        setLoading(false);
    };

    const foundingTypes = [
        { label: 'Female Founded', value: 'female_founded' },
        { label: 'Male Founded', value: 'male_founded' },
        { label: 'Mixed founding team', value: 'mixed_team' }
    ];

    if (!isEditing) {
        return (
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Diversity & Inclusion</h2>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Step 2 Details</p>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-[11px] font-bold uppercase tracking-widest text-[#4E001D] border border-[#4E001D]/20 px-4 py-2 rounded-full hover:bg-[#4E001D]/5 transition-all"
                    >
                        Edit
                    </button>
                </div>

                <div className="space-y-8">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Founding Team</p>
                        <div className="inline-block bg-[#4E001D]/5 text-[#4E001D] px-4 py-2 rounded-full text-xs font-bold">
                            {foundingTypes.find(t => t.value === initialData.founding_team_type)?.label || 'Not specified'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Gender Distribution</p>
                            <div className="space-y-3">
                                <StatBar label="Women" value={initialData.gender_dist_women} />
                                <StatBar label="Men" value={initialData.gender_dist_men} />
                                <StatBar label="Non-Binary" value={initialData.gender_dist_non_binary} />
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Leadership Positions</p>
                            <div className="space-y-3">
                                <StatBar label="Women" value={initialData.women_in_leadership} />
                                <StatBar label="Men" value={initialData.men_in_leadership} />
                                <StatBar label="Non-Binary" value={initialData.non_binary_in_leadership} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] p-8 border border-[#4E001D]/20 shadow-lg">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-xl font-bold text-[#4E001D]">Edit Diversity</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Step 2 Details</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="text-[11px] font-bold uppercase tracking-widest text-gray-400 px-4 py-2 rounded-full hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="text-[11px] font-bold uppercase tracking-widest bg-[#4E001D] text-white px-6 py-2 rounded-full hover:opacity-90 disabled:opacity-50 shadow-md"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="space-y-10">
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Founding Team Type</label>
                    <div className="flex flex-wrap gap-2">
                        {foundingTypes.map((type) => (
                            <button
                                key={type.value}
                                onClick={() => setFormData({ ...formData, founding_team_type: type.value })}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${formData.founding_team_type === type.value
                                    ? 'bg-[#4E001D] border-[#4E001D] text-white shadow-md'
                                    : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-300'
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-50 pt-8">
                    <div className="space-y-6">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block text-center">Gender Distribution</label>
                        <StepperInput label="Women" value={formData.gender_dist_women} onChange={(v: number) => setFormData({ ...formData, gender_dist_women: v })} />
                        <StepperInput label="Men" value={formData.gender_dist_men} onChange={(v: number) => setFormData({ ...formData, gender_dist_men: v })} />
                        <StepperInput label="Non-Binary" value={formData.gender_dist_non_binary} onChange={(v: number) => setFormData({ ...formData, gender_dist_non_binary: v })} />
                    </div>

                    <div className="space-y-6">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block text-center">Leadership Positions</label>
                        <StepperInput label="Women" value={formData.women_in_leadership} onChange={(v: number) => setFormData({ ...formData, women_in_leadership: v })} />
                        <StepperInput label="Men" value={formData.men_in_leadership} onChange={(v: number) => setFormData({ ...formData, men_in_leadership: v })} />
                        <StepperInput label="Non-Binary" value={formData.non_binary_in_leadership} onChange={(v: number) => setFormData({ ...formData, non_binary_in_leadership: v })} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBar({ label, value }: { label: string, value: number }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight">
                <span className="text-gray-400">{label}</span>
                <span className="text-[#4E001D]">{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#4E001D] rounded-full transition-all duration-500"
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

function StepperInput({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
    const update = (amt: number) => {
        const newVal = Math.min(100, Math.max(0, value + amt));
        onChange(newVal);
    };

    return (
        <div className="flex flex-col items-center gap-2 bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
            <div className="flex items-center gap-6">
                <button
                    type="button"
                    onClick={() => update(-5)}
                    className="text-xl text-gray-300 hover:text-[#4E001D] transition-colors p-1"
                >
                    &lt;
                </button>
                <div className="flex items-baseline min-w-[60px] justify-center">
                    <span className="text-2xl font-bold text-gray-900">{value}</span>
                    <span className="text-sm font-bold text-gray-400 ml-0.5">%</span>
                </div>
                <button
                    type="button"
                    onClick={() => update(5)}
                    className="text-xl text-gray-300 hover:text-[#4E001D] transition-colors p-1"
                >
                    &gt;
                </button>
            </div>
        </div>
    );
}
