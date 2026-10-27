import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { LoginPage } from './LoginPage';

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const supabase = getSupabaseClient();
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession);
        setLoading(false);
      }
    });

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error('Failed to read Supabase session:', error.message);
        setSession(data.session);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error('Failed to initialize Supabase session:', error);
        setLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
        <section className="max-w-xl w-full rounded-2xl border border-amber-800/70 bg-neutral-900 p-6">
          <h1 className="text-xl font-bold text-white">Konfigurasi Supabase diperlukan</h1>
          <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
            Dashboard tetap terkunci sampai autentikasi dikonfigurasi. Tambahkan variabel lingkungan berikut pada runtime/build aplikasi:
          </p>
          <pre className="mt-4 rounded-lg bg-neutral-950 border border-neutral-800 p-4 text-xs text-emerald-300 overflow-x-auto">{'VITE_SUPABASE_URL=https://PROJECT_REF.supabase.co\nVITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…'}</pre>
          <p className="mt-3 text-xs text-neutral-400 leading-relaxed">
            Ambil URL dan publishable key dari Supabase Project Settings / Connect. Jangan gunakan secret key atau service_role key di frontend.
          </p>
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-neutral-300">
          <span className="h-5 w-5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
          Memeriksa sesi autentikasi…
        </div>
      </main>
    );
  }

  if (!session) return <LoginPage />;

  const signOut = async () => {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) console.error('Failed to sign out:', error.message);
  };

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] min-w-0">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-neutral-400 hidden sm:inline">Sesi aman</span>
            <span className="text-neutral-200 truncate">{session.user.email || 'Pengguna terautentikasi'}</span>
          </div>
          <button type="button" onClick={() => { void signOut(); }}
            className="rounded-md border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:border-rose-700 hover:text-rose-300 transition-colors shrink-0">
            Keluar
          </button>
        </div>
      </div>
      {children}
    </>
  );
};
