'use client';

import { useState } from 'react';
import { updateProfileStep1 } from '@/app/(authenticated)/profile/profile-actions';

interface CompanyInformationProps {
    type: 'producer' | 'distributor';
    initialData: any;
    originMaster: any[];
}

export default function CompanyInformation({ type, initialData, originMaster }: CompanyInformationProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        company_name: initialData.company_name || '',
        company_reg_number: initialData.company_reg_number || '',
        gln: initialData.gln || '',
        address: type === 'producer' ? initialData.producer_address : initialData.distributor_address,
        origin_attribute_number: initialData.origin_attribute_number?.toString() || '',
    });

    const [selectedCountry, setSelectedCountry] = useState(initialData.origin_master?.country_name || '');
    const [selectedRegion, setSelectedRegion] = useState(initialData.origin_master?.region_name || '');
    const [selectedDistrict, setSelectedDistrict] = useState(initialData.origin_master?.district_name || '');

    const countries = [...new Set(originMaster.map(o => o.country_name))].sort();
    const regions = [...new Set(originMaster
        .filter(o => o.country_name === selectedCountry && o.region_name)
        .map(o => o.region_name)
    )].sort();
    const districts = originMaster
        .filter(o => o.country_name === selectedCountry && o.region_name === selectedRegion && o.district_name);

    const handleSave = async () => {
        setLoading(true);
        try {
            const result = await updateProfileStep1(type, formData);
            if (result && result.success) {
                setIsEditing(false);
            } else {
                alert("Error: " + (result?.error || "Save failed"));
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("An unexpected error occurred while saving.");
        } finally {
            setLoading(false);
        }
    };

    if (!isEditing) {
        return (
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Information</h2>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Step 1 Details</p>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-[11px] font-bold uppercase tracking-widest text-[#4E001D] border border-[#4E001D]/20 px-4 py-2 rounded-full hover:bg-[#4E001D]/5 transition-all"
                    >
                        Edit
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <DataPoint label="Company Name" value={initialData.company_name} />
                    <DataPoint label="Country" value={initialData.origin_master?.country_name} />
                    <DataPoint label="Registration Number" value={initialData.company_reg_number} />
                    <DataPoint label="Region" value={initialData.origin_master?.region_name} />
                    <DataPoint label="GLN" value={initialData.gln} />
                    <DataPoint label="District" value={initialData.origin_master?.district_name} />
                    <DataPoint label="Address" value={type === 'producer' ? initialData.producer_address : initialData.distributor_address} fullWidth />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] p-8 border border-[#4E001D]/20 shadow-lg">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-xl font-bold text-[#4E001D]">Edit Information</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Step 1 Details</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    label="Company Name"
                    value={formData.company_name}
                    onChange={(v: string) => setFormData({ ...formData, company_name: v })}
                />
                <SelectField
                    label="Country"
                    value={selectedCountry}
                    options={countries}
                    onChange={(v: string) => {
                        setSelectedCountry(v);
                        setSelectedRegion('');
                        setSelectedDistrict('');
                        setFormData({ ...formData, origin_attribute_number: '' });
                    }}
                />
                <InputField
                    label="Registration Number"
                    value={formData.company_reg_number}
                    onChange={(v: string) => setFormData({ ...formData, company_reg_number: v })}
                />
                <SelectField
                    label="Region"
                    value={selectedRegion}
                    options={regions}
                    disabled={!selectedCountry}
                    onChange={(v: string) => {
                        setSelectedRegion(v);
                        setSelectedDistrict('');
                        const match = originMaster.find(o => o.country_name === selectedCountry && o.region_name === v && !o.district_name)
                            || originMaster.find(o => o.country_name === selectedCountry && o.region_name === v);
                        setFormData({ ...formData, origin_attribute_number: match?.attribute_number?.toString() || '' });
                    }}
                />
                <InputField
                    label="GLN"
                    value={formData.gln}
                    onChange={(v: string) => setFormData({ ...formData, gln: v })}
                />
                <SelectField
                    label="District"
                    value={selectedDistrict}
                    options={districts.map(d => ({ label: d.district_name, value: d.attribute_number.toString() }))}
                    disabled={!selectedRegion}
                    isOriginSelect
                    onChange={(v: string) => {
                        setSelectedDistrict(districts.find(d => d.attribute_number.toString() === v)?.district_name || '');
                        setFormData({ ...formData, origin_attribute_number: v });
                    }}
                />
                <div className="md:col-span-2">
                    <InputField
                        label="Address"
                        value={formData.address}
                        onChange={(v: string) => setFormData({ ...formData, address: v })}
                    />
                </div>
            </div>
        </div>
    );
}

function DataPoint({ label, value, fullWidth }: { label: string, value: string | null, fullWidth?: boolean }) {
    return (
        <div className={fullWidth ? "md:col-span-2" : ""}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-medium text-gray-900">{value || 'Not specified'}</p>
        </div>
    );
}

function InputField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{label}</label>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full h-12 px-5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#4E001D] text-sm transition-all"
            />
        </div>
    );
}

function SelectField({ label, value, options, onChange, disabled, isOriginSelect }: any) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{label}</label>
            <select
                value={isOriginSelect ? value : value}
                disabled={disabled}
                onChange={e => onChange(e.target.value)}
                className="w-full h-12 px-5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#4E001D] text-sm transition-all appearance-none disabled:opacity-30"
            >
                <option value="">Select {label}</option>
                {options.map((opt: any) => (
                    typeof opt === 'string'
                        ? <option key={opt} value={opt}>{opt}</option>
                        : <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}
