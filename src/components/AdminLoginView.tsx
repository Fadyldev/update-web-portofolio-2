import { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  BookOpen, 
  Server, 
  ArrowRight,
  ShieldCheck,
  UserPlus,
  LogIn,
  Loader2
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { supabaseConfigStatus } from '../lib/supabase';
import { getAccentClasses } from '../utils/theme';

export function AdminLoginView() {
  const { 
    isSupabaseConfigured, 
    loginWithSupabase, 
    signUpWithSupabase, 
    loginWithPreviewFallback, 
    authLoading,
    navigate,
    data,
    showToast 
  } = usePortfolio();

  const accent = getAccentClasses(data.settings.accentColor);

  // Form states - NEVER hardcode passwords!
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [activeTab, setActiveTab] = useState<'login' | 'setup_guide'>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Email dan password wajib diisi.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage('Supabase belum terhubung. Konfigurasikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY terlebih dahulu untuk autentikasi server-side sesungguhnya.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (authMode === 'signin') {
        const result = await loginWithSupabase(email, password);
        if (!result.success) {
          setErrorMessage(result.error || 'Gagal masuk. Periksa kembali email dan password Anda.');
        }
      } else {
        const result = await signUpWithSupabase(email, password);
        if (!result.success) {
          setErrorMessage(result.error || 'Gagal mendaftarkan akun admin.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="admin-login-screen" className="min-h-screen bg-[#070709] text-neutral-100 flex items-center justify-center p-4 sm:p-6 relative">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      <div className="max-w-xl w-full relative z-10 space-y-6">
        {/* Status Bar / Disclosure Banner */}
        {isSupabaseConfigured ? (
          <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-xs flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                <span>Supabase Authentication Terhubung</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">
                  Aktif & Aman
                </span>
              </div>
              <p className="opacity-90 leading-relaxed text-[11px]">
                Sesi autentikasi diverifikasi langsung oleh server Supabase menggunakan encrypted JWT tokens. Hanya akun admin yang terdaftar yang diizinkan mengelola data portofolio.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-mono font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Status: Supabase Belum Terhubung</span>
            </div>
            <p className="leading-relaxed opacity-90 text-[11px]">
              Variabel lingkungan <code className="bg-black/40 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_URL</code> dan <code className="bg-black/40 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_ANON_KEY</code> belum dikonfigurasi.
            </p>
            <div className="pt-2 border-t border-amber-500/20 text-[11px] text-amber-300/90 leading-relaxed">
              ⚠️ <strong>Pernyataan Keamanan Penting:</strong> Sistem ini tidak mengklaim login aman sebelum Supabase terhubung. <em>LocalStorage BUKAN sistem keamanan</em> karena dapat dibaca oleh siapa saja di browser lokal.
            </div>
          </div>
        )}

        {/* Card Container with Tabs: Login Form vs Setup Guide */}
        <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0c0d12]/95 backdrop-blur-xl shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className={`w-12 h-12 mx-auto rounded-full border ${accent.border} ${accent.bgMuted} flex items-center justify-center text-white`}>
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white tracking-wide">
              Fadiyel Studio Terminal
            </h1>
            <p className="text-xs text-neutral-400 font-light">
              Portal Otentikasi Administrator Portofolio
            </p>
          </div>

          {/* Navigation Tabs between Form & Setup Guide */}
          <div className="flex rounded-xl border border-white/10 p-1 bg-black/40 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'login'
                  ? `${accent.bg} text-black font-semibold shadow`
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login Admin</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('setup_guide')}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'setup_guide'
                  ? `${accent.bg} text-black font-semibold shadow`
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Panduan Setup Supabase</span>
            </button>
          </div>

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              {/* Sign in vs Sign up sub-toggle if Supabase is active */}
              {isSupabaseConfigured && (
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                  <span className="text-neutral-400">Pilih Operasi:</span>
                  <div className="flex gap-2 font-mono">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signin'); setErrorMessage(null); }}
                      className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        authMode === 'signin' ? 'bg-white/15 text-white font-medium' : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      Masuk (Sign In)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signup'); setErrorMessage(null); }}
                      className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        authMode === 'signup' ? 'bg-white/15 text-white font-medium' : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      Daftar (Sign Up)
                    </button>
                  </div>
                </div>
              )}

              {/* Error notice */}
              {errorMessage && (
                <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Email Admin Terdaftar *</span>
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@domain.com"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/60 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-all font-mono"
                  />
                </div>

                {/* Password Input (no password hardcoded or displayed) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Password *</span>
                    </span>
                    <span className="text-[10px] text-neutral-500">Kerahasian Dijamin</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-white/10 bg-black/60 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer p-1"
                      title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || authLoading || !isSupabaseConfigured}
                  className={`w-full py-3.5 rounded-xl border ${accent.border} ${accent.bg} text-black font-semibold text-xs font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi Akun...</span>
                    </>
                  ) : authMode === 'signin' ? (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Masuk dengan Supabase Auth</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Daftarkan Akun Admin Baru</span>
                    </>
                  )}
                </button>
              </form>

              {/* Notice when Supabase is not yet configured */}
              {!isSupabaseConfigured && (
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs space-y-2">
                    <p className="text-neutral-300 font-medium">
                      Ingin melihat tampilan dashboard sebelum menyambungkan Supabase?
                    </p>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Anda dapat menguji tata letak dan UI dengan Mode Pratinjau Lokal. Mode ini tidak menggunakan enkripsi server dan hanya untuk tujuan demonstrasi.
                    </p>
                    <button
                      type="button"
                      onClick={loginWithPreviewFallback}
                      className="w-full py-2.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 font-mono text-xs hover:bg-amber-500/20 transition-all cursor-pointer font-semibold"
                    >
                      Buka Mode Pratinjau Lokal (Demo UI - Tidak Aman)
                    </button>
                  </div>
                </div>
              )}

              {/* Back to Public website */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>&larr; Kembali ke Website Publik Fadiyel</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SETUP GUIDE (Cara Menghubungkan Supabase & Membuat Akun Admin) */}
          {activeTab === 'setup_guide' && (
            <div className="space-y-5 text-xs text-neutral-300 leading-relaxed">
              <div className="space-y-1 pb-3 border-b border-white/10">
                <h3 className="font-display font-bold text-white text-sm">
                  Panduan Menghubungkan Supabase & Membuat Akun Admin
                </h3>
                <p className="text-neutral-400 text-[11px]">
                  Ikuti langkah-langkah di bawah ini untuk mengaktifkan sistem autentikasi server-side sejati.
                </p>
              </div>

              <div className="space-y-4 font-sans">
                {/* Step 1 */}
                <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-white font-semibold">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">1</span>
                    <span>Buat Akun & Proyek di Supabase (Gratis)</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] pl-7">
                    Buka <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-amber-300 underline inline-flex items-center gap-1">supabase.com <ExternalLink className="w-2.5 h-2.5" /></a> dan buat project baru (pilih region terdekat seperti Singapore).
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-white font-semibold">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">2</span>
                    <span>Ambil Project URL & Anon Public Key</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] pl-7">
                    Di dashboard proyek Supabase Anda, buka <strong>Project Settings &gt; API</strong>. Salin dua nilai berikut:
                  </p>
                  <ul className="pl-11 list-disc text-neutral-400 text-[11px] space-y-1 font-mono">
                    <li><strong>Project URL</strong> (contoh: <span className="text-neutral-300">https://xyz.supabase.co</span>)</li>
                    <li><strong>Project API Keys: anon public</strong> (string panjang berawalan <span className="text-neutral-300">ey...</span>)</li>
                  </ul>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-white font-semibold">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">3</span>
                    <span>Masukkan Environment Variables di AI Studio</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] pl-7">
                    Buka panel <strong>Settings / Environment Variables</strong> di AI Studio dan masukkan:
                  </p>
                  <div className="pl-7 pt-1 font-mono text-[11px] space-y-1">
                    <div className="p-2 rounded bg-black/50 border border-white/10 text-neutral-200">
                      VITE_SUPABASE_URL=https://proyek-anda.supabase.co
                    </div>
                    <div className="p-2 rounded bg-black/50 border border-white/10 text-neutral-200">
                      VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-white font-semibold">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">4</span>
                    <span>Buat Akun Admin Pertama di Supabase Dashboard</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] pl-7">
                    Cara paling aman dan instan untuk membuat akun admin:
                  </p>
                  <ol className="pl-11 list-decimal text-neutral-400 text-[11px] space-y-1">
                    <li>Buka menu <strong>Authentication &gt; Users</strong> di Supabase.</li>
                    <li>Klik tombol <strong>"Add user"</strong> &gt; pilih <strong>"Create user"</strong>.</li>
                    <li>Masukkan email Anda (misal: <span className="font-mono text-neutral-200">fadilanugrah2232007@gmail.com</span>) dan password rahasia Anda.</li>
                    <li>Centang opsi <strong>"Auto Confirm User"</strong> agar akun langsung aktif tanpa konfirmasi email.</li>
                    <li>Klik <strong>Create user</strong>. Selesai!</li>
                  </ol>
                </div>

                {/* Step 5 */}
                <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-white font-semibold">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">5</span>
                    <span>Login & Kelola Portofolio</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] pl-7">
                    Kembali ke tab <strong>Login Admin</strong>, masukkan email dan password yang baru Anda buat. Sesi autentikasi aman Supabase akan langsung tersimpan di browser Anda dengan auto-refresh token.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`w-full py-2.5 rounded-xl border ${accent.border} ${accent.bg} text-black font-semibold text-xs font-mono uppercase tracking-wider cursor-pointer`}
                >
                  Kembali ke Form Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
