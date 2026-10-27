import React, { useState } from 'react';
import { Sprout, ShieldCheck } from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';

type AuthMode = 'signin' | 'signup';

export const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [messageIsError, setMessageIsError] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setMessageIsError(false);
    try {
      const supabase = getSupabaseClient();
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          setMessage('Pendaftaran diterima. Periksa email untuk mengonfirmasi akun sebelum login.');
        } else {
          setMessage('Akun berhasil dibuat. Membuka dashboard…');
        }
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Autentikasi gagal. Silakan coba lagi.');
      setMessageIsError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-7">
          <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center">
            <Sprout className="w-6 h-6 text-emerald-400" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">AgriPulse</h1>
            <p className="text-xs text-neutral-400">AI Smart Farm Management Platform</p>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl">
          <div className="flex items-start gap-3 mb-6">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-bold text-white">
                {mode === 'signin' ? 'Masuk ke dashboard' : 'Buat akun AgriPulse'}
              </h2>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Login diperlukan untuk membuka dashboard dan menggunakan endpoint AI.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="agri-email" className="block text-xs font-medium text-neutral-300 mb-1.5">Email</label>
              <input id="agri-email" type="email" autoComplete="email" required value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none focus:border-emerald-400"
                placeholder="nama@perusahaan.com" />
            </div>
            <div>
              <label htmlFor="agri-password" className="block text-xs font-medium text-neutral-300 mb-1.5">Password</label>
              <input id="agri-password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none focus:border-emerald-400"
                placeholder="Minimal 8 karakter" />
            </div>
            {message && (
              <div role="status" className={`rounded-lg border px-3 py-2.5 text-xs leading-relaxed ${messageIsError ? 'border-rose-800 bg-rose-950/50 text-rose-300' : 'border-emerald-800 bg-emerald-950/40 text-emerald-300'}`}>
                {message}
              </div>
            )}
            <button type="submit" disabled={busy}
              className="w-full rounded-lg bg-emerald-400 py-3 text-sm font-bold text-neutral-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60">
              {busy ? 'Memproses…' : mode === 'signin' ? 'Masuk' : 'Daftar dengan email'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-neutral-800 text-center">
            <p className="text-xs text-neutral-400">
              {mode === 'signin' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
              <button type="button"
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage(''); setMessageIsError(false); }}
                className="font-semibold text-emerald-400 hover:text-emerald-300">
                {mode === 'signin' ? 'Buat akun' : 'Masuk'}
              </button>
            </p>
          </div>
        </div>
        <p className="mt-5 text-center text-[11px] text-neutral-500">
          Akses dashboard hanya diberikan kepada pengguna yang terautentikasi.
        </p>
      </section>
    </main>
  );
};
