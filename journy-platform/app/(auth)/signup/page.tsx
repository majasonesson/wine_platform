'use client';

import Link from 'next/link';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Sign Up for Journy</h1>
        
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded mb-6">
          <p className="font-bold">Migration Note:</p>
          <p>The full signup flow with Stripe integration needs to be migrated from the original frontend components.</p>
          <p className="mt-2">Original files: <code>journy-importers-main/frontend/src/Components/Auth/RegisterUser.jsx</code></p>
        </div>

        <div className="space-y-4 p-6 border rounded-lg">
          <h2 className="text-xl font-bold">Required Features:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Multi-step registration form</li>
            <li>Role selection (Producer/Importer)</li>
            <li>Certification details for producers</li>
            <li>Stripe checkout integration for importers</li>
            <li>Plan selection</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-blue-600 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </main>
  );
}

