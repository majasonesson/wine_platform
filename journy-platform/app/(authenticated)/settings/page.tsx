'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
    const [language, setLanguage] = useState('English');
    const [loading, setLoading] = useState(false);

    const languages = ['English', 'Swedish', 'French', 'Italian', 'Spanish', 'German'];

    const handlePasswordReset = async () => {
        // This would typically trigger a Supabase auth password reset email
        alert("Password reset functionality would be integrated here (e.g., Supabase reset password email).");
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-8 md:p-12">
            <div className="max-w-2xl mx-auto">
                <div className="mb-12">
                    <Link href="/profile" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#4E001D] transition-all flex items-center gap-2 mb-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
                        Back to Profile
                    </Link>
                    <h1 className="text-4xl font-light text-gray-900 tracking-tight">Settings</h1>
                </div>

                <div className="space-y-8">
                    {/* Language Selection */}
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4E001D" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                            Language
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${language === lang
                                            ? 'bg-[#4E001D] border-[#4E001D] text-white shadow-md'
                                            : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Security / Password */}
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4E001D" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                            Security
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
                            <div>
                                <p className="text-sm font-bold text-gray-900">Change Password</p>
                                <p className="text-xs text-gray-400">Receive a password reset link to your email.</p>
                            </div>
                            <button
                                onClick={handlePasswordReset}
                                className="w-full sm:w-auto px-6 py-3 bg-[#4E001D] text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md"
                            >
                                Send Reset Link
                            </button>
                        </div>
                    </div>

                    {/* Support / Help */}
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm opacity-50 cursor-not-allowed">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4E001D" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                            Help & Support
                        </h2>
                        <p className="text-xs text-gray-400 italic">Coming soon: Contact support and view documentation.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
