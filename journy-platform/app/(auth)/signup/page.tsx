'use client';
import { useState } from 'react';
import { signUpAction } from './actions';

export default function SignUpPage() {
  const [role, setRole] = useState<'Producer' | 'Distributor'>('Producer');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('role', role); // Lägg till den valda rollen

    const result = await signUpAction(formData);

    if (result?.error) {
      alert(result.error);
    } else {
      alert("Success! Please check your email.");
    }
    setLoading(false);
  }

  return (
    <div className="bg-[#FDFDFD] min-h-screen flex flex-col items-center justify-center p-4 text-black font-sans">
      {/* Logo Placeholder */}
      <div className="mb-8 font-bold text-2xl tracking-tighter">Journy</div>

      <h1 className="text-xl mb-12">Sign up</h1>

      {/* Main Card */}
      <div className="bg-white rounded-[40px] shadow-[0px_4px_25px_rgba(0,0,0,0.08)] p-12 w-full max-w-[850px]">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">

          <p className="text-sm mb-6 text-gray-500">I am a</p>

          {/* Role Toggle */}
          <div className="flex bg-white gap-4 mb-10">
            <button
              type="button"
              onClick={() => setRole('Producer')}
              className={`h-[48px] w-[180px] rounded-full text-sm transition-all border-2 ${role === 'Producer'
                  ? 'bg-[#4E001D] text-white border-[#4E001D]'
                  : 'bg-white text-[#4E001D] border-[#4E001D]'
                }`}
            >
              Producer
            </button>
            <button
              type="button"
              onClick={() => setRole('Distributor')}
              className={`h-[48px] w-[180px] rounded-full text-sm transition-all border-2 ${role === 'Distributor'
                  ? 'bg-[#4E001D] text-white border-[#4E001D]'
                  : 'bg-white text-[#4E001D] border-[#4E001D]'
                }`}
            >
              Distributor
            </button>
          </div>

          {/* Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-full mb-8">
            <InputField label="First name" name="firstName" placeholder="Write here" />
            <InputField label="Last name" name="lastName" placeholder="Write here" />
            <InputField label="Email" name="email" type="email" placeholder="Write here" />
            <InputField label="Password" name="password" type="password" placeholder="Write here" />
          </div>

          {/* Terms */}
          <div className="flex items-center gap-3 mb-8">
            <input
              type="checkbox"
              name="acceptsTerms"
              required
              className="w-4 h-4 rounded border-gray-300 accent-[#4E001D]"
            />
            <span className="text-xs text-gray-600">I agree to the Terms & Conditions</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#4E001D] text-white w-[280px] h-[52px] rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Wait...' : 'Sign up'}
          </button>
        </form>
      </div>

      <p className="mt-8 text-sm">
        or <a href="/login" className="underline font-bold">Log in</a> if you already have an account
      </p>

      <p className="mt-12 text-[10px] text-gray-400 opacity-50">@Journy2025 all rights reserved</p>
    </div>
  );
}

// En liten hjälp-komponent för inputfälten så koden blir renare
function InputField({ label, name, type = "text", placeholder }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] text-gray-700 ml-1">{label}</label>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full h-[45px] px-6 rounded-full border border-gray-200 focus:outline-none focus:border-[#4E001D] text-sm placeholder:text-gray-300"
      />
    </div>
  );
}