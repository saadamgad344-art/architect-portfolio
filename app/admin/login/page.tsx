'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);

    if (error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        <h1 className="text-white/80 text-2xl font-light tracking-widest uppercase mb-12 text-center">
          Admin Access
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none placeholder:text-white/30 focus:border-white/60 transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none placeholder:text-white/30 focus:border-white/60 transition-colors"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 border border-white/20 text-white/80 py-4 tracking-widest uppercase text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}