import { useState, useRef, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck,
  Lock, 
  Unlock, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Eye, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  AlertTriangle,
  FileCode,
  User,
  Wrench,
  FolderGit2,
  Mail,
  Settings as SettingsIcon,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  Database,
  RefreshCw,
  Loader2,
  Image as ImageIcon,
  Sparkles,
  Clock,
  Cpu,
  Lightbulb,
  Globe,
  BookOpen,
  Target,
  FileText,
  GitBranch,
  Layers
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, Skill, ProjectCategory, AccentColor, ProjectStatus, AboutContent, WorkProcessStep, CreativeTool } from '../types';
import { PROJECT_CATEGORIES, PROJECT_STATUSES, DEFAULT_ABOUT_CONTENT, WORK_PROCESS_STEPS, CREATIVE_TOOLS } from '../data/defaultData';
import { getAccentClasses } from '../utils/theme';
import { AdminLoginView } from '../components/AdminLoginView';

export function Admin() {
  const { 
    data, 
    updateProfile, 
    updateAbout,
    addProject, 
    updateProject, 
    deleteProject, 
    reorderProjects,
    addSkill, 
    updateSkill, 
    deleteSkill, 
    updateSettings, 
    deleteMessage, 
    resetData, 
    exportData, 
    importData, 
    navigate,
    isAdminAuthenticated,
    adminUser,
    authMethod,
    logoutAdmin,
    isSupabaseConfigured,
    showToast,
    cloudSyncStatus,
    lastSyncTime,
    syncError,
    isSaving,
    refreshFromCloud,
    syncInitialDataToCloud
  } = usePortfolio();

  const accent = getAccentClasses(data.settings.accentColor);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab navigation
  type AdminTab = 'profile' | 'about' | 'projects' | 'skills' | 'contact' | 'settings' | 'messages';
  const [activeTab, setActiveTab] = useState<AdminTab>('profile');

  // Form states for profile
  const [profileForm, setProfileForm] = useState(data.profile);

  // Form states for about content
  const [aboutForm, setAboutForm] = useState<AboutContent>(
    data.about || DEFAULT_ABOUT_CONTENT
  );

  // Sync forms with latest data from cloud/context
  useEffect(() => {
    setProfileForm(data.profile);
    setAboutForm(data.about || DEFAULT_ABOUT_CONTENT);
    setSettingsForm(data.settings);
    setContactForm({
      email: data.profile.email,
      whatsapp: data.profile.whatsapp,
      instagram: data.profile.instagram,
      github: data.profile.github,
      location: data.profile.location,
    });
  }, [data]);

  // Form states for new project modal/drawer
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<{
    title: string;
    category: ProjectCategory;
    year: string;
    description: string;
    techStackString: string;
    liveDemoUrl: string;
    sourceCodeUrl: string;
    featured: boolean;
    active: boolean;
    imageUrl: string;
    gallery: string[];
    status: ProjectStatus;
    featuresString: string;
  }>({
    title: '',
    category: 'Web Development',
    year: '2025',
    description: '',
    techStackString: 'React, Tailwind CSS',
    liveDemoUrl: '',
    sourceCodeUrl: '',
    featured: false,
    active: true,
    imageUrl: '',
    gallery: [],
    status: 'Completed',
    featuresString: '',
  });

  const [galleryInputUrl, setGalleryInputUrl] = useState<string>('');
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);

  // Skill editing state
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillForm, setSkillForm] = useState<{
    name: string;
    category: 'Core Web' | 'Design & Visual' | 'Tools & Workflow';
    description: string;
    level: string;
  }>({
    name: '',
    category: 'Core Web',
    description: '',
    level: 'Pengembangan Aktif',
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(data.settings);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    email: data.profile.email,
    whatsapp: data.profile.whatsapp,
    instagram: data.profile.instagram,
    github: data.profile.github,
    location: data.profile.location,
  });

  // Handle file import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importData(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Avatar file input ref & handler for direct photo upload from mobile/laptop
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran file maksimal 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setProfileForm((prev) => ({
          ...prev,
          avatarUrl: dataUrl,
        }));
      }
    };
    reader.readAsDataURL(file);
    if (avatarFileInputRef.current) avatarFileInputRef.current.value = '';
  };

  // =========================================================================
  // 1. LOGIN GATE FOR ADMIN (Redirects / displays login view when not authenticated)
  // =========================================================================
  if (!isAdminAuthenticated) {
    return <AdminLoginView />;
  }

  // =========================================================================
  // 2. AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div id="admin-dashboard-screen" className="min-h-screen bg-[#070709] text-neutral-100 pt-24 pb-24 relative">
      {/* Background ambient pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

      {/* Hidden File Input for JSON Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-8">
        {/* Top Header & Global Actions Bar */}
        <div className="p-6 rounded-3xl border border-white/10 bg-[#0c0d12]/80 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${accent.dotBg}`} />
              <h1 className="text-2xl font-display font-bold text-white">
                Studio Admin Terminal
              </h1>
              {authMethod === 'supabase' ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>SUPABASE AUTH ACTIVE</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>LOCAL PREVIEW (TIDAK AMAN)</span>
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-mono">
              <span>Akun: <strong className="text-white">{adminUser?.email || 'Administrator (Demo Session)'}</strong></span>
              <span>•</span>
              <span className="text-[11px] text-neutral-400">
                {authMethod === 'supabase' ? 'Sesi Terverifikasi Supabase' : 'Penyimpanan Sesi Sementara'}
              </span>
            </div>
          </div>

          {/* Action Buttons: Preview, Export, Import, Reset, Logout */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="admin-preview-btn"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/15 bg-white/[0.03] text-xs font-mono text-neutral-300 hover:text-white hover:border-white/30 transition-all cursor-pointer"
              title="Pratinjau Tampilan Publik"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            <button
              id="admin-export-btn"
              onClick={exportData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/15 bg-white/[0.03] text-xs font-mono text-neutral-300 hover:text-white hover:border-white/30 transition-all cursor-pointer"
              title="Unduh Data JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              id="admin-import-btn"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/15 bg-white/[0.03] text-xs font-mono text-neutral-300 hover:text-white hover:border-white/30 transition-all cursor-pointer"
              title="Unggah File JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>

            <button
              id="admin-reset-btn"
              onClick={() => {
                if (window.confirm('Yakin ingin mereset seluruh data portofolio ke pengaturan awal bawaan?')) {
                  resetData();
                  setProfileForm(data.profile);
                  setSettingsForm(data.settings);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs font-mono text-rose-300 hover:bg-rose-500/15 transition-all cursor-pointer"
              title="Reset ke Default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

            <button
              id="admin-logout-btn"
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-mono transition-all cursor-pointer"
              title="Keluar dari Sesi Admin"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Cloud Database Status & Real-time Sync Hub */}
        <div className={`p-4 rounded-2xl border transition-all ${
          cloudSyncStatus === 'synced'
            ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
            : cloudSyncStatus === 'saving'
            ? 'border-amber-500/30 bg-amber-950/20 text-amber-300'
            : cloudSyncStatus === 'error'
            ? 'border-rose-500/30 bg-rose-950/25 text-rose-300'
            : cloudSyncStatus === 'not_seeded'
            ? 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300'
            : 'border-white/10 bg-white/[0.02] text-neutral-300'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {cloudSyncStatus === 'synced' && (
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <Database className="w-4 h-4" />
                </div>
              )}
              {cloudSyncStatus === 'saving' && (
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 animate-spin">
                  <Loader2 className="w-4 h-4" />
                </div>
              )}
              {cloudSyncStatus === 'error' && (
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              )}
              {cloudSyncStatus === 'not_seeded' && (
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                  <Database className="w-4 h-4" />
                </div>
              )}
              {(cloudSyncStatus === 'loading' || cloudSyncStatus === 'idle') && (
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0 mt-0.5 animate-spin">
                  <RefreshCw className="w-4 h-4" />
                </div>
              )}

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold tracking-wide uppercase">
                    {cloudSyncStatus === 'synced' && 'Cloud Database Terhubung: portfolio_content'}
                    {cloudSyncStatus === 'saving' && 'Menyimpan Perubahan Langsung ke Cloud Supabase...'}
                    {cloudSyncStatus === 'error' && 'Penyimpanan Database Cloud Gagal (Server-First Rejection)'}
                    {cloudSyncStatus === 'not_seeded' && 'Tabel Cloud Belum Terisi Data Awal'}
                    {cloudSyncStatus === 'loading' && 'Memeriksa Sinkronisasi Cloud Supabase...'}
                    {cloudSyncStatus === 'idle' && 'Status Database Portfolio'}
                  </span>
                  {cloudSyncStatus === 'synced' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      AKTIF & TERVERIFIKASI
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {cloudSyncStatus === 'synced' && (
                    <>Setiap perubahan langsung disimpan secara permanen ke tabel <code>portfolio_content</code> di Supabase.{lastSyncTime ? ` Terakhir disinkronkan pukul ${lastSyncTime}.` : ''}</>
                  )}
                  {cloudSyncStatus === 'saving' && (
                    <>Sedang mengirim mutasi data ke server Supabase. Mohon tunggu sejenak...</>
                  )}
                  {cloudSyncStatus === 'error' && (
                    <>Error: <code className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-rose-200">{syncError}</code>. Sesuai arsitektur Server-First, perubahan <strong>tidak</strong> disimpan diam-diam ke localStorage agar Anda dapat memperbaiki kendala tabel/RLS di Supabase.</>
                  )}
                  {cloudSyncStatus === 'not_seeded' && (
                    <>Tabel Supabase belum memiliki baris data atau belum dibuat. Silakan jalankan SQL setup di Supabase SQL Editor lalu klik tombol di samping untuk mengunggah data awal.</>
                  )}
                  {cloudSyncStatus === 'loading' && (
                    <>Menghubungkan ke endpoint Supabase untuk memuat data portofolio...</>
                  )}
                  {cloudSyncStatus === 'idle' && (
                    <>Website siap disinkronkan dengan Supabase.</>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
              {cloudSyncStatus === 'not_seeded' && (
                <button
                  type="button"
                  onClick={() => syncInitialDataToCloud()}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 text-xs font-mono transition-all cursor-pointer shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah Data Awal ke Cloud</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => refreshFromCloud()}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-mono transition-all cursor-pointer"
                title="Muat Ulang Data dari Supabase"
              >
                <RefreshCw className={`w-3 h-3 ${isSaving ? 'animate-spin' : ''}`} />
                <span>Refresh Cloud</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('profile')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'profile'
                ? `${accent.bg} text-black font-semibold shadow-md`
                : 'border border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Profil Utama</span>
          </button>

          <button
            id="tab-about-btn"
            onClick={() => setActiveTab('about')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'about'
                ? `${accent.bg} text-black font-semibold shadow-md`
                : 'border border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Konten About</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'projects'
                ? `${accent.bg} text-black font-semibold shadow-md`
                : 'border border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>3. Kelola Proyek ({data.projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'skills'
                ? `${accent.bg} text-black font-semibold shadow-md`
                : 'border border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>4. Keahlian ({data.skills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'contact'
                ? `${accent.bg} text-black font-semibold shadow-md`
                : 'border border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>5. Saluran Kontak</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'settings'
                ? `${accent.bg} text-black font-semibold shadow-md`
                : 'border border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>6. Pengaturan Website</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'messages'
                ? `${accent.bg} text-black font-semibold shadow-md`
                : 'border border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>7. Pesan Masuk ({data.messages.length})</span>
          </button>
        </div>

        {/* TAB 1: PROFILE MANAGEMENT */}
        {activeTab === 'profile' && (
          <div className="p-8 rounded-3xl border border-white/10 bg-[#0c0d12]/80 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-display font-bold text-white">
                  Data Identitas & Profil Pribadi
                </h2>
                <p className="text-xs text-neutral-400">
                  Perbarui nama, profesi, bio, dan headline yang tampil di seluruh website.
                </p>
              </div>
              <button
                onClick={() => updateProfile(profileForm)}
                disabled={isSaving}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border ${accent.border} ${accent.bg} text-black font-semibold text-xs font-mono uppercase cursor-pointer hover:opacity-90 disabled:opacity-50 transition-all`}
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSaving ? 'Menyimpan ke Cloud...' : 'Simpan Profil'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400">Nama Lengkap</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400">Bidang / Profesi</label>
                <input
                  type="text"
                  value={profileForm.profession}
                  onChange={(e) => setProfileForm({ ...profileForm, profession: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-mono text-neutral-400">Headline Ringkas</label>
                <input
                  type="text"
                  value={profileForm.headline}
                  onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-mono text-neutral-400">Deskripsi Profil (Bio Lengkap & Jujur)</label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400">Tagline Studio</label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400">Status Ketersediaan (Pill Header)</label>
                <input
                  type="text"
                  value={profileForm.statusText}
                  onChange={(e) => setProfileForm({ ...profileForm, statusText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Foto Profil Studio (Avatar) */}
              <div className="md:col-span-2 space-y-3 pt-2 border-t border-white/[0.06]">
                <label className="text-xs font-mono text-neutral-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Foto Profil Resmi Studio (Avatar / Potret Diri)</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">Tampil di About, Beranda, & CV Resume</span>
                </label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                  {/* Photo Preview Thumbnail */}
                  <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl border-2 border-white/20 overflow-hidden bg-black/60 shrink-0 shadow-lg relative group">
                    {profileForm.avatarUrl ? (
                      <img
                        src={profileForm.avatarUrl}
                        alt="Foto Profil"
                        className="w-full h-full object-cover grayscale contrast-125"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[10px] font-mono text-neutral-500 p-2 text-center">
                        <ImageIcon className="w-5 h-5 mb-1 opacity-50" />
                        <span>Belum ada foto</span>
                      </div>
                    )}
                  </div>

                  {/* Input & Quick Helpers */}
                  <div className="space-y-2 flex-1 w-full">
                    <input
                      type="text"
                      value={profileForm.avatarUrl || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                      placeholder="Masukkan URL foto atau path gambar lokal..."
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 font-mono text-xs"
                    />

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {/* Direct File Upload Button */}
                      <button
                        type="button"
                        onClick={() => avatarFileInputRef.current?.click()}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${accent.border} ${accent.bgMuted} text-white text-xs font-mono hover:border-white/40 transition-all cursor-pointer shadow-sm`}
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pilih Foto Asli dari Galeri HP / File Komputer</span>
                      </button>
                      <input
                        ref={avatarFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />

                      {profileForm.avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setProfileForm({ ...profileForm, avatarUrl: '' })}
                          className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-mono hover:bg-rose-500/20 transition-all cursor-pointer"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-neutral-500 font-mono">
                      * Foto ini otomatis tampil dengan bingkai editorial di halaman About, cuplikan beranda, serta pasfoto resmi di lembar CV / Resume A4.
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5 pt-2 border-t border-white/[0.06]">
                <label className="text-xs font-mono text-neutral-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Link File CV / Resume Eksternal (Opsional)</span>
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">Google Drive / Canva / Cloud Link</span>
                </label>
                <input
                  type="url"
                  value={profileForm.resumeUrl || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, resumeUrl: e.target.value })}
                  placeholder="https://drive.google.com/file/d/... atau https://my-resume.pdf"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 font-mono"
                />
                <p className="text-[11px] text-neutral-400 font-mono">
                  * Catatan: Jika dikosongkan, sistem secara otomatis merangkum data profil & portofolio Anda menjadi dokumen cetak PDF ATS-friendly. Jika Anda mengisi link di atas, pengunjung juga dapat membuka link file CV khusus Anda langsung.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB ABOUT: ABOUT PAGE CONTENT MANAGEMENT */}
        {activeTab === 'about' && (
          <div className="space-y-8">
            <div className="p-8 rounded-3xl border border-white/10 bg-[#0c0d12]/80 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h2 className="text-lg font-display font-bold text-white">
                      Konten & Narasi Halaman About
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Kelola narasi editorial, biografi diri, judul keahlian, target perkembangan & eksplorasi, alur kerja (Creative Process Timeline), dan perangkat kerja (Tools & Software) yang tampil di halaman /about.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/about')}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-mono text-neutral-300 hover:text-white transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Halaman</span>
                  </button>
                  <button
                    id="save-about-btn-top"
                    type="button"
                    onClick={() => updateAbout(aboutForm)}
                    disabled={isSaving}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border ${accent.border} ${accent.bg} text-black font-semibold text-xs font-mono uppercase cursor-pointer hover:opacity-90 disabled:opacity-50 transition-all`}
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{isSaving ? 'Menyimpan ke Cloud...' : 'Simpan Konten About'}</span>
                  </button>
                </div>
              </div>

              {/* Sub-section 1: Header & Judul */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg}`} />
                  <span>1. Header Narasi & Judul Halaman</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">
                      Badge Kategori / Sub-judul
                    </label>
                    <input
                      type="text"
                      value={aboutForm.badge}
                      onChange={(e) => setAboutForm({ ...aboutForm, badge: e.target.value })}
                      placeholder="Profile & Ethos"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                    />
                    <p className="text-[11px] text-neutral-500 font-mono">
                      Pill kecil di atas judul utama (default: Profile & Ethos)
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">
                      Judul Utama Halaman
                    </label>
                    <input
                      type="text"
                      value={aboutForm.title}
                      onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                      placeholder="Merajut Logika Kode & Keindahan Visual"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 font-display font-bold"
                    />
                    <p className="text-[11px] text-neutral-500 font-mono">
                      Judul besar editorial halaman About
                    </p>
                  </div>
                </div>
              </div>

              {/* Sub-section 2: Biografi Narasi */}
              <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg}`} />
                  <span>2. Biografi & Narasi Cerita Diri (Halaman /about)</span>
                </h3>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400 flex items-center justify-between">
                      <span>Paragraf 1: Narasi Pengantar & Visi Studio</span>
                      <span className="text-[10px] text-neutral-500 font-mono">Tampil di paragraf awal halaman /about</span>
                    </label>
                    <textarea
                      rows={4}
                      value={aboutForm.bioParagraph1}
                      onChange={(e) => setAboutForm({ ...aboutForm, bioParagraph1: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 resize-none leading-relaxed"
                      placeholder="Tulis narasi pembuka tentang perjalanan dan studio Anda..."
                    />
                    <p className="text-[11px] text-neutral-500 font-mono">
                      Tip: Buka dengan perkenalan nama, peran keahlian (Web Developer/Designer), dan latar belakang studio Anda.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400 flex items-center justify-between">
                      <span>Paragraf 2: Prinsip, Transparansi, & Keahlian Nyata</span>
                      <span className="text-[10px] text-neutral-500 font-mono">Tampil dengan warna teks kontras halus di halaman /about</span>
                    </label>
                    <textarea
                      rows={4}
                      value={aboutForm.bioParagraph2}
                      onChange={(e) => setAboutForm({ ...aboutForm, bioParagraph2: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 resize-none leading-relaxed"
                      placeholder="Jelaskan etos kerja nyata, kejujuran keahlian, dan teknologi yang Anda tekuni..."
                    />
                    <p className="text-[11px] text-neutral-500 font-mono">
                      Menjelaskan kejujuran portofolio tanpa klaim fiktif, serta alat kerja (HTML, CSS, React, Tailwind, Inkscape).
                    </p>
                  </div>
                </div>
              </div>

              {/* Sub-section 3: Cuplikan Profil Singkat (Tampil di Halaman Utama / Homepage) */}
              <div className="space-y-4 pt-4 border-t border-white/[0.06] bg-white/[0.015] p-5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>3. Cuplikan Profil Singkat di Halaman Utama (01 // Profil Singkat)</span>
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Bagian ini langsung mengatur teks narasi yang Anda tanyakan pada beranda utama (Home section "01 // Profil Singkat — Eksplorasi & Perkembangan").
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer shrink-0"
                  >
                    <span>Lihat di Beranda →</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Label Badge Kategori</label>
                    <input
                      type="text"
                      value={aboutForm.previewBadge || '01 // Profil Singkat'}
                      onChange={(e) => setAboutForm({ ...aboutForm, previewBadge: e.target.value })}
                      placeholder="01 // Profil Singkat"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Judul Bagian</label>
                    <input
                      type="text"
                      value={aboutForm.previewTitle || 'Eksplorasi & Perkembangan'}
                      onChange={(e) => setAboutForm({ ...aboutForm, previewTitle: e.target.value })}
                      placeholder="Eksplorasi & Perkembangan"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 font-display font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400 flex items-center justify-between">
                      <span>Paragraf 1 Cuplikan Beranda (Kejujuran Karya & Tanpa Klien Fiktif)</span>
                      <span className="text-[10px] text-amber-400 font-mono">Tampil di Beranda</span>
                    </label>
                    <textarea
                      rows={3}
                      value={aboutForm.previewParagraph1 || DEFAULT_ABOUT_CONTENT.previewParagraph1 || ''}
                      onChange={(e) => setAboutForm({ ...aboutForm, previewParagraph1: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 resize-none leading-relaxed"
                      placeholder="Sebagai web developer dan visual designer yang sedang aktif membangun portofolio..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400 flex items-center justify-between">
                      <span>Paragraf 2 Cuplikan Beranda (Inkscape, React, Tailwind & Pengasahan Skill)</span>
                      <span className="text-[10px] text-amber-400 font-mono">Tampil di Beranda</span>
                    </label>
                    <textarea
                      rows={3}
                      value={aboutForm.previewParagraph2 || DEFAULT_ABOUT_CONTENT.previewParagraph2 || ''}
                      onChange={(e) => setAboutForm({ ...aboutForm, previewParagraph2: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 resize-none leading-relaxed"
                      placeholder="Dari perancangan vektor di Inkscape hingga perakitan komponen interaktif..."
                    />
                  </div>
                </div>
              </div>

              {/* Sub-section 4: Pengaturan Bagian Karya Pilihan di Beranda (02 // Selected Archive) */}
              <div className="space-y-4 pt-4 border-t border-white/[0.06] bg-white/[0.015] p-5 rounded-2xl border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>4. Pengaturan Teks Karya Pilihan di Beranda (02 // Selected Archive)</span>
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Ubah label badge, judul utama, paragraf deskripsi pengantar, dan teks tombol bagian Karya Pilihan di halaman beranda.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveTab('projects')}
                      className="inline-flex items-center gap-1 text-xs font-mono text-neutral-300 hover:text-white underline cursor-pointer"
                    >
                      <span>Urutan Proyek (Tab 3) →</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="inline-flex items-center gap-1 text-xs font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      <span>Lihat di Beranda →</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Label Badge Kategori</label>
                    <input
                      type="text"
                      value={aboutForm.selectedWorksBadge || '02 // Selected Archive'}
                      onChange={(e) => setAboutForm({ ...aboutForm, selectedWorksBadge: e.target.value })}
                      placeholder="02 // Selected Archive"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Judul Bagian</label>
                    <input
                      type="text"
                      value={aboutForm.selectedWorksTitle || 'Karya Pilihan'}
                      onChange={(e) => setAboutForm({ ...aboutForm, selectedWorksTitle: e.target.value })}
                      placeholder="Karya Pilihan"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 font-display font-bold"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400 flex items-center justify-between">
                      <span>Paragraf Deskripsi / Pengantar Karya Pilihan</span>
                      <span className="text-[10px] text-amber-400 font-mono">Tampil di Beranda di bawah Judul</span>
                    </label>
                    <textarea
                      rows={3}
                      value={aboutForm.selectedWorksDescription || ''}
                      onChange={(e) => setAboutForm({ ...aboutForm, selectedWorksDescription: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 resize-none leading-relaxed"
                      placeholder="Tuliskan kalimat pengantar singkat untuk karya-karya pilihan Anda..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Teks Tombol Buka Galeri</label>
                    <input
                      type="text"
                      value={aboutForm.selectedWorksButtonText || `View All Works (${data.projects.length})`}
                      onChange={(e) => setAboutForm({ ...aboutForm, selectedWorksButtonText: e.target.value })}
                      placeholder="View All Works"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Sub-section 5: Pengaturan Teks Halaman Galeri Karya (/works) */}
              <div className="space-y-4 pt-4 border-t border-white/[0.06] bg-white/[0.015] p-5 rounded-2xl border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>5. Pengaturan Teks Header Halaman Galeri Karya (/works)</span>
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Ubah judul besar, label, dan deskripsi pembuka di bagian atas halaman galeri karya (/works).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/works')}
                    className="inline-flex items-center gap-1 text-xs font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer shrink-0"
                  >
                    <span>Lihat Halaman Works →</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Label Badge Kategori</label>
                    <input
                      type="text"
                      value={aboutForm.worksBadge || 'Studio Directory & Gallery'}
                      onChange={(e) => setAboutForm({ ...aboutForm, worksBadge: e.target.value })}
                      placeholder="Studio Directory & Gallery"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Judul Utama Halaman</label>
                    <input
                      type="text"
                      value={aboutForm.worksTitle || 'Selected Works'}
                      onChange={(e) => setAboutForm({ ...aboutForm, worksTitle: e.target.value })}
                      placeholder="Selected Works"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 font-display font-bold"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Paragraf Deskripsi Pengantar Galeri</label>
                    <textarea
                      rows={2}
                      value={aboutForm.worksDescription || ''}
                      onChange={(e) => setAboutForm({ ...aboutForm, worksDescription: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 resize-none leading-relaxed"
                      placeholder="Kumpulan proyek pengembangan web, antarmuka modern, dan undangan digital terkurasi..."
                    />
                  </div>
                </div>
              </div>

              {/* Sub-section 6: Pengaturan Teks Halaman Kontak (/contact) */}
              <div className="space-y-4 pt-4 border-t border-white/[0.06] bg-white/[0.015] p-5 rounded-2xl border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>6. Pengaturan Teks Header Halaman Kontak (/contact)</span>
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Ubah judul besar, label, dan kalimat ajakan kolaborasi di bagian atas halaman kontak (/contact).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/contact')}
                    className="inline-flex items-center gap-1 text-xs font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer shrink-0"
                  >
                    <span>Lihat Halaman Contact →</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Label Badge Kategori</label>
                    <input
                      type="text"
                      value={aboutForm.contactBadge || 'Connect & Inquire'}
                      onChange={(e) => setAboutForm({ ...aboutForm, contactBadge: e.target.value })}
                      placeholder="Connect & Inquire"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Judul Utama Halaman</label>
                    <input
                      type="text"
                      value={aboutForm.contactTitle || "Let's Work Together"}
                      onChange={(e) => setAboutForm({ ...aboutForm, contactTitle: e.target.value })}
                      placeholder="Let's Work Together"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 font-display font-bold"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Paragraf Deskripsi Pengantar Kontak</label>
                    <textarea
                      rows={2}
                      value={aboutForm.contactDescription || ''}
                      onChange={(e) => setAboutForm({ ...aboutForm, contactDescription: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 resize-none leading-relaxed"
                      placeholder="Terbuka untuk diskusi proyek pembuatan website portofolio, undangan pernikahan digital..."
                    />
                  </div>
                </div>
              </div>

              {/* Sub-section 7: Pengaturan Bagian Kolaborasi di Beranda (Let's Create Together) */}
              <div className="space-y-4 pt-4 border-t border-white/[0.06] bg-white/[0.015] p-5 rounded-2xl border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>7. Pengaturan Bagian Kolaborasi Beranda (CTA Bawah)</span>
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Ubah label, quote besar, kalimat penjelas, dan teks tombol pesan pada bagian penutup di beranda.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-1 text-xs font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer shrink-0"
                  >
                    <span>Lihat di Beranda →</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Label Badge</label>
                    <input
                      type="text"
                      value={aboutForm.collabBadge || "Let's Create Together"}
                      onChange={(e) => setAboutForm({ ...aboutForm, collabBadge: e.target.value })}
                      placeholder="Let's Create Together"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Teks Tombol Kirim Pesan</label>
                    <input
                      type="text"
                      value={aboutForm.collabButtonText || 'Kirim Pesan / Brief Proyek'}
                      onChange={(e) => setAboutForm({ ...aboutForm, collabButtonText: e.target.value })}
                      placeholder="Kirim Pesan / Brief Proyek"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Quote / Judul Besar Kolaborasi</label>
                    <input
                      type="text"
                      value={aboutForm.collabTitle || '“Open to learning, creative collaboration, and meaningful digital projects.”'}
                      onChange={(e) => setAboutForm({ ...aboutForm, collabTitle: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 font-display font-bold"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Paragraf Deskripsi Penjelas</label>
                    <textarea
                      rows={2}
                      value={aboutForm.collabDescription || ''}
                      onChange={(e) => setAboutForm({ ...aboutForm, collabDescription: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 resize-none leading-relaxed"
                      placeholder="Membuka ruang diskusi untuk pembuatan website portofolio, undangan pernikahan digital..."
                    />
                  </div>
                </div>
              </div>

              {/* Sub-section 8: Bagian Keahlian & Keterkaitan dengan Tab Keahlian */}
              <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg}`} />
                    <span>8. Pengaturan Bagian Keahlian (Skills Directory)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('skills')}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    <span>Kelola Item Keahlian ({data.skills.length}) →</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">
                      Judul Bagian Keahlian
                    </label>
                    <input
                      type="text"
                      value={aboutForm.skillsTitle}
                      onChange={(e) => setAboutForm({ ...aboutForm, skillsTitle: e.target.value })}
                      placeholder="Keahlian & Penguasaan"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 font-display font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">
                      Deskripsi Pengantar Keahlian
                    </label>
                    <input
                      type="text"
                      value={aboutForm.skillsDescription}
                      onChange={(e) => setAboutForm({ ...aboutForm, skillsDescription: e.target.value })}
                      placeholder="Daftar keahlian teknis dan artistik yang terus dilatih dan diterapkan..."
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                {/* Info preview of skills currently in portfolio */}
                <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-white block">
                      Daftar Keahlian Aktif ({data.skills.length} item)
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {data.skills.map((s) => (
                        <span
                          key={s.id}
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded-md border border-white/10 bg-white/[0.04] text-neutral-300"
                        >
                          {s.name} <span className="text-neutral-500">({s.category})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('skills')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.05] text-xs font-mono text-white hover:bg-white/[0.1] transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                    <span>Buka Tab Keahlian</span>
                  </button>
                </div>
              </div>

              {/* Sub-section 5: Target Perkembangan & Rencana Belajar (Eksplorasi & Pengembangan) */}
              <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span>5. Eksplorasi & Rencana Pengembangan (Milestones Target)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const current = aboutForm.milestones || DEFAULT_ABOUT_CONTENT.milestones;
                      setAboutForm({
                        ...aboutForm,
                        milestones: [
                          ...current,
                          {
                            title: `${current.length + 1}. Target Baru`,
                            description: 'Tuliskan deskripsi fokus eksplorasi dan pengembangan keahlian baru di sini...',
                          },
                        ],
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-white/10 bg-white/[0.03] text-[11px] font-mono text-amber-300 hover:text-white cursor-pointer hover:border-white/30 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Target Eksplorasi</span>
                  </button>
                </div>
                <p className="text-xs text-neutral-400">
                  Komitmen belajar berkelanjutan, eksplorasi teknologi baru, dan rencana pengembangan kemampuan yang tampil di bagian bawah halaman About.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {(aboutForm.milestones && aboutForm.milestones.length > 0
                    ? aboutForm.milestones
                    : DEFAULT_ABOUT_CONTENT.milestones
                  ).map((m, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-white/10 bg-black/40 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                        <span className="text-[11px] font-mono text-neutral-400">
                          Target #{idx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg}`} />
                          {(aboutForm.milestones || DEFAULT_ABOUT_CONTENT.milestones).length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const list = [...(aboutForm.milestones || DEFAULT_ABOUT_CONTENT.milestones)];
                                list.splice(idx, 1);
                                setAboutForm({ ...aboutForm, milestones: list });
                              }}
                              className="text-neutral-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                              title="Hapus Target"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-neutral-400">Judul Target</label>
                        <input
                          type="text"
                          value={m.title}
                          onChange={(e) => {
                            const newMilestones = [...(aboutForm.milestones || DEFAULT_ABOUT_CONTENT.milestones)];
                            newMilestones[idx] = { ...newMilestones[idx], title: e.target.value };
                            setAboutForm({ ...aboutForm, milestones: newMilestones });
                          }}
                          placeholder={`Target ${idx + 1}`}
                          className="w-full px-3 py-2 rounded-lg border border-white/10 bg-black/60 text-xs text-white focus:outline-none focus:border-white/30 font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-neutral-400">Deskripsi Rencana</label>
                        <textarea
                          rows={3}
                          value={m.description}
                          onChange={(e) => {
                            const newMilestones = [...(aboutForm.milestones || DEFAULT_ABOUT_CONTENT.milestones)];
                            newMilestones[idx] = { ...newMilestones[idx], description: e.target.value };
                            setAboutForm({ ...aboutForm, milestones: newMilestones });
                          }}
                          placeholder={`Deskripsi rencana target ${idx + 1}...`}
                          className="w-full px-3 py-2 rounded-lg border border-white/10 bg-black/60 text-xs text-neutral-300 focus:outline-none focus:border-white/30 resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-section 6: Creative Process Timeline (Metodologi Kerja) */}
              <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                    <GitBranch className="w-3.5 h-3.5 text-sky-400" />
                    <span>6. Creative Process Timeline (Alur & Metodologi Kerja)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const currentSteps = aboutForm.processSteps || WORK_PROCESS_STEPS;
                      const nextNum = (currentSteps.length + 1).toString().padStart(2, '0');
                      setAboutForm({
                        ...aboutForm,
                        processSteps: [
                          ...currentSteps,
                          {
                            number: nextNum,
                            title: `Fase ${nextNum}`,
                            subtitle: 'Sub-judul fase',
                            description: 'Penjelasan tahapan pengerjaan alur kerja...',
                          },
                        ],
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-white/10 bg-white/[0.03] text-[11px] font-mono text-sky-300 hover:text-white cursor-pointer hover:border-white/30 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Fase Proses</span>
                  </button>
                </div>
                <p className="text-xs text-neutral-400">
                  Alur kerja metodologi kreatif (Concept, Design, Development, Final Result) yang tampil di bagian tengah halaman About.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  {(aboutForm.processSteps && aboutForm.processSteps.length > 0
                    ? aboutForm.processSteps
                    : WORK_PROCESS_STEPS
                  ).map((step, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-white/10 bg-black/40 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full border ${accent.border} ${accent.bgMuted} flex items-center justify-center font-mono font-bold text-[11px] text-white`}>
                            {step.number || `0${idx + 1}`}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase">
                            Fase #{idx + 1}
                          </span>
                        </div>
                        {(aboutForm.processSteps || WORK_PROCESS_STEPS).length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...(aboutForm.processSteps || WORK_PROCESS_STEPS)];
                              list.splice(idx, 1);
                              setAboutForm({ ...aboutForm, processSteps: list });
                            }}
                            className="text-neutral-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                            title="Hapus Fase"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-neutral-400">Nomor / Kode</label>
                        <input
                          type="text"
                          value={step.number}
                          onChange={(e) => {
                            const list = [...(aboutForm.processSteps || WORK_PROCESS_STEPS)];
                            list[idx] = { ...list[idx], number: e.target.value };
                            setAboutForm({ ...aboutForm, processSteps: list });
                          }}
                          placeholder="01"
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 text-xs font-mono text-white focus:outline-none focus:border-white/30"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-neutral-400">Judul Fase</label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const list = [...(aboutForm.processSteps || WORK_PROCESS_STEPS)];
                            list[idx] = { ...list[idx], title: e.target.value };
                            setAboutForm({ ...aboutForm, processSteps: list });
                          }}
                          placeholder="Concept"
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 text-xs font-bold text-white focus:outline-none focus:border-white/30"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-neutral-400">Sub-judul / Fokus</label>
                        <input
                          type="text"
                          value={step.subtitle}
                          onChange={(e) => {
                            const list = [...(aboutForm.processSteps || WORK_PROCESS_STEPS)];
                            list[idx] = { ...list[idx], subtitle: e.target.value };
                            setAboutForm({ ...aboutForm, processSteps: list });
                          }}
                          placeholder="Ideation & Exploration"
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 text-xs font-mono text-neutral-300 focus:outline-none focus:border-white/30"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-neutral-400">Deskripsi Alur</label>
                        <textarea
                          rows={3}
                          value={step.description}
                          onChange={(e) => {
                            const list = [...(aboutForm.processSteps || WORK_PROCESS_STEPS)];
                            list[idx] = { ...list[idx], description: e.target.value };
                            setAboutForm({ ...aboutForm, processSteps: list });
                          }}
                          placeholder="Penjelasan tahapan alur..."
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 text-xs text-neutral-300 focus:outline-none focus:border-white/30 resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-section 7: Tools & Software (Perangkat & Ekosistem Desain/Kode) */}
              <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>7. Tools & Software (Alur Kerja Perangkat Lunak)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const currentTools = aboutForm.tools || CREATIVE_TOOLS;
                      setAboutForm({
                        ...aboutForm,
                        tools: [
                          ...currentTools,
                          {
                            name: 'Software Baru',
                            role: 'Peran Alat',
                            desc: 'Deskripsi penggunaan software dalam alur kerja harian...',
                          },
                        ],
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-white/10 bg-white/[0.03] text-[11px] font-mono text-emerald-300 hover:text-white cursor-pointer hover:border-white/30 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Software / Tool</span>
                  </button>
                </div>
                <p className="text-xs text-neutral-400">
                  Daftar perangkat lunak harian (VS Code, Inkscape, React, Tailwind, Git, DevTools) yang ditampilkan di bagian Tools & Software halaman About.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {(aboutForm.tools && aboutForm.tools.length > 0
                    ? aboutForm.tools
                    : CREATIVE_TOOLS
                  ).map((tool, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-white/10 bg-black/40 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase">
                          Tool #{idx + 1}
                        </span>
                        {(aboutForm.tools || CREATIVE_TOOLS).length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...(aboutForm.tools || CREATIVE_TOOLS)];
                              list.splice(idx, 1);
                              setAboutForm({ ...aboutForm, tools: list });
                            }}
                            className="text-neutral-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                            title="Hapus Tool"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-neutral-400">Nama Tool</label>
                          <input
                            type="text"
                            value={tool.name}
                            onChange={(e) => {
                              const list = [...(aboutForm.tools || CREATIVE_TOOLS)];
                              list[idx] = { ...list[idx], name: e.target.value };
                              setAboutForm({ ...aboutForm, tools: list });
                            }}
                            placeholder="VS Code"
                            className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 text-xs font-bold text-white focus:outline-none focus:border-white/30"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-neutral-400">Kategori / Peran</label>
                          <input
                            type="text"
                            value={tool.role}
                            onChange={(e) => {
                              const list = [...(aboutForm.tools || CREATIVE_TOOLS)];
                              list[idx] = { ...list[idx], role: e.target.value };
                              setAboutForm({ ...aboutForm, tools: list });
                            }}
                            placeholder="Primary Code Editor"
                            className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 text-xs font-mono text-neutral-300 focus:outline-none focus:border-white/30"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-neutral-400">Deskripsi Pemakaian</label>
                        <textarea
                          rows={2}
                          value={tool.desc}
                          onChange={(e) => {
                            const list = [...(aboutForm.tools || CREATIVE_TOOLS)];
                            list[idx] = { ...list[idx], desc: e.target.value };
                            setAboutForm({ ...aboutForm, tools: list });
                          }}
                          placeholder="Fungsi dalam alur kerja harian..."
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 text-xs text-neutral-300 focus:outline-none focus:border-white/30 resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Kembalikan isi form About ke teks default awal? Perubahan yang belum disimpan akan hilang.')) {
                        setAboutForm(DEFAULT_ABOUT_CONTENT);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-mono text-neutral-400 hover:text-white transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset ke Teks Awal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/about')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-mono text-neutral-300 hover:text-white transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Buka /about</span>
                  </button>
                </div>

                <button
                  id="save-about-btn-bottom"
                  type="button"
                  onClick={() => updateAbout(aboutForm)}
                  disabled={isSaving}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border ${accent.border} ${accent.bg} text-black font-semibold text-xs font-mono uppercase cursor-pointer hover:opacity-90 disabled:opacity-50 transition-all`}
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{isSaving ? 'Menyimpan ke Cloud...' : 'Simpan Konten About'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* Add / Edit Project Form Box */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#0c0d12]/80 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-lg font-display font-bold text-white">
                    {editingProjectId ? 'Edit Proyek' : 'Tambah Proyek Baru'}
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Masukkan rincian karya digital editorial. Format tidak membutuhkan gambar besar.
                  </p>
                </div>
                {editingProjectId && (
                  <button
                    onClick={() => {
                      setEditingProjectId(null);
                      setProjectForm({
                        title: '',
                        category: 'Web Development',
                        year: '2025',
                        description: '',
                        techStackString: 'React, Tailwind CSS',
                        liveDemoUrl: '',
                        sourceCodeUrl: '',
                        featured: false,
                        active: true,
                        imageUrl: '',
                        gallery: [],
                        status: 'Completed',
                        featuresString: '',
                      });
                      setImageLoadError(false);
                      setGalleryInputUrl('');
                    }}
                    className="text-xs font-mono text-neutral-400 hover:text-white"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!projectForm.title.trim()) {
                    showToast('Judul proyek tidak boleh kosong.', 'error');
                    return;
                  }

                  // Validate main image URL format if provided
                  if (projectForm.imageUrl && projectForm.imageUrl.trim()) {
                    const img = projectForm.imageUrl.trim();
                    if (!img.startsWith('http://') && !img.startsWith('https://') && !img.startsWith('/')) {
                      showToast('URL Gambar Utama harus diawali dengan http://, https://, atau /', 'error');
                      return;
                    }
                  }

                  // Validate Live Demo URL format if provided (Rule 12 & Rule 3: strictly optional if empty)
                  if (projectForm.liveDemoUrl && projectForm.liveDemoUrl.trim()) {
                    const demo = projectForm.liveDemoUrl.trim();
                    if (!demo.startsWith('http://') && !demo.startsWith('https://') && !demo.startsWith('/')) {
                      showToast('URL Live Demo harus diawali dengan http://, https://, atau /', 'error');
                      return;
                    }
                  }

                  // Validate Source Code (GitHub) URL format if provided (Rule 4: strictly optional)
                  if (projectForm.sourceCodeUrl && projectForm.sourceCodeUrl.trim()) {
                    const gh = projectForm.sourceCodeUrl.trim();
                    if (!gh.startsWith('http://') && !gh.startsWith('https://') && !gh.startsWith('/')) {
                      showToast('URL Source Code (GitHub) harus diawali dengan http://, https://, atau /', 'error');
                      return;
                    }
                  }

                  const techArray = projectForm.techStackString
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);

                  const featuresArray = projectForm.featuresString
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean);

                  const payload = {
                    title: projectForm.title.trim(),
                    category: projectForm.category,
                    year: projectForm.year.trim(),
                    description: projectForm.description.trim(),
                    techStack: techArray,
                    liveDemoUrl: projectForm.liveDemoUrl.trim(),
                    sourceCodeUrl: projectForm.sourceCodeUrl.trim(),
                    featured: projectForm.featured,
                    active: projectForm.active,
                    imageUrl: projectForm.imageUrl.trim(),
                    gallery: projectForm.gallery.filter(Boolean),
                    status: projectForm.status,
                    features: featuresArray,
                  };

                  if (editingProjectId) {
                    updateProject(editingProjectId, payload);
                    setEditingProjectId(null);
                  } else {
                    addProject(payload);
                  }

                  // Reset form
                  setProjectForm({
                    title: '',
                    category: 'Web Development',
                    year: '2025',
                    description: '',
                    techStackString: 'React, Tailwind CSS',
                    liveDemoUrl: '',
                    sourceCodeUrl: '',
                    featured: false,
                    active: true,
                    imageUrl: '',
                    gallery: [],
                    status: 'Completed',
                    featuresString: '',
                  });
                  setImageLoadError(false);
                  setGalleryInputUrl('');
                }}
                className="space-y-6"
              >
                {(() => {
                  const isWebsiteCat = 
                    projectForm.category === 'Web Development' || 
                    projectForm.category === 'Website Development' || 
                    projectForm.category === 'Digital Invitation' || 
                    projectForm.category === 'Web Design';
                  const isVisualCat = 
                    projectForm.category === 'Graphic Design' || 
                    projectForm.category === 'Branding';

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Judul */}
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs font-mono text-neutral-400">Judul Proyek *</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          placeholder="Contoh: Modern Editorial Wedding Invitation"
                          className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                        />
                      </div>

                      {/* Kategori */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-neutral-400">Kategori *</label>
                        <select
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as ProjectCategory })}
                          className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#0c0d12] text-sm text-white focus:outline-none focus:border-white/30"
                        >
                          {PROJECT_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {/* Status */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-neutral-400">Status Proyek *</label>
                        <select
                          value={projectForm.status}
                          onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as ProjectStatus })}
                          className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#0c0d12] text-sm text-white focus:outline-none focus:border-white/30"
                        >
                          {PROJECT_STATUSES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      {/* Tahun */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-neutral-400">Tahun Pembuatan *</label>
                        <input
                          type="text"
                          required
                          value={projectForm.year}
                          onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                          placeholder="2025"
                          className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                        />
                      </div>

                      {/* Tech Stack */}
                      <div className="md:col-span-3 space-y-1.5">
                        <label className="text-xs font-mono text-neutral-400">
                          Teknologi Digunakan (pisahkan dengan koma)
                        </label>
                        <input
                          type="text"
                          value={projectForm.techStackString}
                          onChange={(e) => setProjectForm({ ...projectForm, techStackString: e.target.value })}
                          placeholder="React, Tailwind CSS, UI Design, Inkscape"
                          className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                        />
                      </div>

                      {/* Deskripsi */}
                      <div className="md:col-span-4 space-y-1.5">
                        <label className="text-xs font-mono text-neutral-400">Deskripsi Proyek *</label>
                        <textarea
                          rows={3}
                          required
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          placeholder="Penjelasan ringkas konsep, estetika warna, dan fungsionalitas..."
                          className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 resize-none"
                        />
                      </div>

                      {/* =========================================================================
                          TAUTAN AKSES & LIVE DEMO (ATURAN 1, 2, 3, 4, 8)
                          ========================================================================= */}
                      <div className={`md:col-span-4 p-5 rounded-2xl border transition-all ${
                        isWebsiteCat
                          ? 'border-emerald-500/30 bg-emerald-500/[0.03]'
                          : 'border-white/[0.08] bg-white/[0.015]'
                      } space-y-4`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Globe className={`w-4 h-4 ${isWebsiteCat ? 'text-emerald-400' : 'text-neutral-400'}`} />
                            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-200 font-bold">
                              Tautan Akses & Live Demo
                            </h4>
                          </div>

                          {isWebsiteCat ? (
                            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto">
                              ★ Field Kunci Proyek Website
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-neutral-500">
                              Opsional
                            </span>
                          )}
                        </div>

                        {/* Petunjuk khusus Website vs Desain */}
                        {isWebsiteCat && (
                          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-neutral-300 space-y-1">
                            <p className="leading-relaxed">
                              <strong className="text-emerald-400">Prioritas Website:</strong> Jika status proyek <span className="text-white font-mono">Completed</span> atau <span className="text-white font-mono">In Progress</span> dan memiliki website yang dapat diakses, isi URL Live Demo di bawah. Tombol <span className="text-white font-semibold">"Live Demo"</span> akan otomatis menjadi tombol aksi utama di kartu karya.
                            </p>
                            <p className="text-[11px] text-neutral-400">
                              * URL Live Demo <strong>tidak diwajibkan</strong> untuk proyek Concept atau yang memang belum memiliki demo online. Gambar tambahan juga tidak diwajibkan.
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          {/* URL Live Demo */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-mono text-neutral-300 flex items-center justify-between">
                              <span>
                                URL Live Demo {isWebsiteCat ? '(Sangat Dianjurkan)' : '(Opsional)'}
                              </span>
                              {projectForm.liveDemoUrl && (
                                <span className="text-[10px] font-mono text-emerald-400">Terisi ✓</span>
                              )}
                            </label>
                            <input
                              type="url"
                              value={projectForm.liveDemoUrl}
                              onChange={(e) => setProjectForm({ ...projectForm, liveDemoUrl: e.target.value })}
                              placeholder="https://undangan-demo.fadiyel.my.id"
                              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-white focus:outline-none transition-all ${
                                isWebsiteCat
                                  ? 'border-emerald-500/30 bg-black/60 focus:border-emerald-400'
                                  : 'border-white/10 bg-black/40 focus:border-white/30'
                              }`}
                            />
                            <p className="text-[10px] font-mono text-neutral-400">
                              Format harus diawali <span className="text-neutral-300">https://</span>, <span className="text-neutral-300">http://</span>, atau <span className="text-neutral-300">/</span>
                            </p>
                          </div>

                          {/* URL GitHub */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-mono text-neutral-300 flex items-center justify-between">
                              <span>URL Source Code GitHub (Opsional)</span>
                              {projectForm.sourceCodeUrl && (
                                <span className="text-[10px] font-mono text-neutral-400">Terisi ✓</span>
                              )}
                            </label>
                            <input
                              type="url"
                              value={projectForm.sourceCodeUrl}
                              onChange={(e) => setProjectForm({ ...projectForm, sourceCodeUrl: e.target.value })}
                              placeholder="https://github.com/fadiyel/project"
                              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                            />
                            <p className="text-[10px] font-mono text-neutral-400">
                              Tautan repositori publik GitHub (dapat dikosongkan jika proyek privat)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* =========================================================================
                          MEDIA VISUAL & GAMBAR PROYEK (ATURAN 5, 6, 7, 8, 9)
                          ========================================================================= */}
                      <div className={`md:col-span-4 p-5 rounded-2xl border transition-all ${
                        isVisualCat
                          ? 'border-purple-500/30 bg-purple-500/[0.03]'
                          : 'border-white/[0.08] bg-white/[0.015]'
                      } space-y-4`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <ImageIcon className={`w-4 h-4 ${isVisualCat ? 'text-purple-400' : 'text-neutral-400'}`} />
                            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-200 font-bold">
                              Media Visual & Gambar Proyek (Sepenuhnya Opsional)
                            </h4>
                          </div>
                          <span className="text-[11px] font-mono text-neutral-400">
                            {isVisualCat ? '★ Prioritas Desain & Branding' : 'Bebas Dikosongkan'}
                          </span>
                        </div>

                        {/* Petunjuk Fallback Elegan */}
                        <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-neutral-300 space-y-1">
                          {isWebsiteCat ? (
                            <p className="leading-relaxed">
                              💡 <strong>Tampilan Fallback Otomatis:</strong> Proyek website dengan URL Live Demo <strong>tidak mewajibkan gambar sampul maupun galeri</strong>. Jika dikosongkan, kartu karya akan otomatis menampilkan visual representasi browser / wireframe modern yang elegan berdasarkan kategori <span className="text-white font-mono">{projectForm.category}</span>.
                            </p>
                          ) : isVisualCat ? (
                            <p className="leading-relaxed">
                              🎨 <strong>Prioritas Desain Visual:</strong> Untuk kategori <span className="text-white font-mono">{projectForm.category}</span>, pengunjung sangat menyukai melihat preview visual atau galeri karya. Namun field ini tetap opsional jika sedang berupa konsep.
                            </p>
                          ) : (
                            <p className="leading-relaxed">
                              ✨ Jika URL gambar dikosongkan, sistem akan otomatis menggunakan fallback blueprint grafis yang disesuaikan dengan kategori proyek.
                            </p>
                          )}
                        </div>

                        {/* Main Image URL Input */}
                        <div className="space-y-2">
                          <label className="text-xs font-mono text-neutral-300 flex items-center justify-between">
                            <span>URL Gambar Utama (Cover Image - Opsional)</span>
                            {projectForm.imageUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  setProjectForm({ ...projectForm, imageUrl: '' });
                                  setImageLoadError(false);
                                }}
                                className="text-[11px] font-mono text-rose-400 hover:text-rose-300 underline cursor-pointer"
                              >
                                Hapus Gambar Utama
                              </button>
                            )}
                          </label>
                          <input
                            type="url"
                            value={projectForm.imageUrl}
                            onChange={(e) => {
                              setProjectForm({ ...projectForm, imageUrl: e.target.value });
                              setImageLoadError(false);
                            }}
                            placeholder="https://images.unsplash.com/... atau https://domain.com/gambar.jpg"
                            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                          />

                          {/* Main Image Preview */}
                          {projectForm.imageUrl && projectForm.imageUrl.trim() && (
                            <div className="mt-3 p-3 rounded-xl border border-white/10 bg-black/50 space-y-2">
                              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                                Pratinjau Gambar Utama:
                              </span>
                              <div className="relative rounded-lg overflow-hidden border border-white/10 aspect-[16/9] max-h-48 bg-black/80 flex items-center justify-center">
                                <img
                                  src={projectForm.imageUrl}
                                  alt="Pratinjau Gambar Utama"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                  onLoad={() => setImageLoadError(false)}
                                  onError={() => setImageLoadError(true)}
                                />
                                {imageLoadError && (
                                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center space-y-1">
                                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                                    <span className="text-xs text-amber-300 font-mono">
                                      Gagal memuat pratinjau gambar
                                    </span>
                                    <span className="text-[11px] text-neutral-400">
                                      Pastikan URL dapat diakses secara publik dan mengarah ke file gambar langsung.
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Gallery Images Input */}
                        <div className="space-y-3 pt-3 border-t border-white/5">
                          <label className="text-xs font-mono text-neutral-300 block">
                            Galeri Gambar Tambahan (Opsional — untuk modal detail & zoom)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={galleryInputUrl}
                              onChange={(e) => setGalleryInputUrl(e.target.value)}
                              placeholder="Masukkan URL foto tambahan (https://...)"
                              className="flex-1 px-4 py-2 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!galleryInputUrl.trim()) return;
                                const trimmed = galleryInputUrl.trim();
                                if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/')) {
                                  showToast('URL foto galeri harus diawali http://, https://, atau /', 'error');
                                  return;
                                }
                                if (projectForm.gallery.includes(trimmed)) {
                                  showToast('URL foto ini sudah ada dalam galeri.', 'info');
                                  return;
                                }
                                setProjectForm({
                                  ...projectForm,
                                  gallery: [...projectForm.gallery, trimmed],
                                });
                                setGalleryInputUrl('');
                                showToast('Foto ditambahkan ke galeri!');
                              }}
                              className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-white transition-all cursor-pointer shrink-0"
                            >
                              + Tambah Foto
                            </button>
                          </div>

                          {/* Gallery Thumbnails List */}
                          {projectForm.gallery.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                              {projectForm.gallery.map((imgUrl, gIdx) => (
                                <div
                                  key={gIdx}
                                  className="relative rounded-xl overflow-hidden border border-white/10 bg-black/60 aspect-[16/10] group"
                                >
                                  <img
                                    src={imgUrl}
                                    alt={`Galeri ${gIdx + 1}`}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-neutral-300">
                                    #{gIdx + 1}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setProjectForm({
                                        ...projectForm,
                                        gallery: projectForm.gallery.filter((_, idx) => idx !== gIdx),
                                      });
                                    }}
                                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900 transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                                    title="Hapus foto dari galeri"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* FITUR & HIGHLIGHTS PROYEK */}
                      <div className="md:col-span-4 space-y-1.5">
                        <label className="text-xs font-mono text-neutral-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>Fitur & Sorotan Utama (Satu baris per fitur, opsional)</span>
                          </span>
                        </label>
                        <textarea
                          rows={3}
                          value={projectForm.featuresString}
                          onChange={(e) => setProjectForm({ ...projectForm, featuresString: e.target.value })}
                          placeholder="Contoh:&#10;Navigasi RSVP Interaktif&#10;Countdown Hari Bahagia&#10;Integrasi Google Maps Lokasi&#10;Musik Latar Audio Player"
                          className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30 resize-none font-mono text-xs"
                        />
                      </div>

                      {/* Checkboxes */}
                      <div className="md:col-span-4 flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                          <input
                            type="checkbox"
                            checked={projectForm.featured}
                            onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                            className="rounded"
                          />
                          <span>Featured (Tampilkan badge Sorotan)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                          <input
                            type="checkbox"
                            checked={projectForm.active}
                            onChange={(e) => setProjectForm({ ...projectForm, active: e.target.checked })}
                            className="rounded"
                          />
                          <span>Aktif (Tampilkan di Halaman Galeri)</span>
                        </label>
                      </div>
                    </div>
                  );
                })()}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full border ${accent.border} ${accent.bg} text-black font-semibold text-xs font-mono uppercase cursor-pointer hover:opacity-90 disabled:opacity-50 transition-all`}
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isSaving ? 'Menyimpan ke Cloud...' : (editingProjectId ? 'Perbarui Proyek' : 'Simpan Proyek Baru')}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Project List / Ordering */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#0c0d12]/80 space-y-4">
              <h3 className="text-base font-display font-bold text-white">
                Daftar & Urutan Proyek ({data.projects.length})
              </h3>

              <div className="divide-y divide-white/10">
                {data.projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      {/* Project Thumbnail or Fallback */}
                      <div className="w-12 h-12 rounded-xl border border-white/10 bg-black/50 shrink-0 overflow-hidden flex items-center justify-center">
                        {proj.imageUrl ? (
                          <img
                            src={proj.imageUrl}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-neutral-600" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono text-neutral-500">#{idx + 1}</span>
                          <h4 className="font-medium text-white text-sm">
                            {proj.title}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 text-neutral-400">
                            {proj.category}
                          </span>

                          {/* Status Badge */}
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            proj.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : proj.status === 'In Progress'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                              : proj.status === 'Prototype'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {proj.status || 'Completed'}
                          </span>

                          {proj.gallery && proj.gallery.length > 0 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/5">
                              +{proj.gallery.length} foto
                            </span>
                          )}

                          {!proj.active && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                              Nonaktif
                            </span>
                          )}
                          {proj.featured && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 line-clamp-1 max-w-xl">
                          {proj.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Move Up */}
                      <button
                        disabled={idx === 0}
                        onClick={() => {
                          const newList = [...data.projects];
                          const temp = newList[idx - 1];
                          newList[idx - 1] = newList[idx];
                          newList[idx] = temp;
                          reorderProjects(newList);
                        }}
                        className="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Geser ke Atas"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        disabled={idx === data.projects.length - 1}
                        onClick={() => {
                          const newList = [...data.projects];
                          const temp = newList[idx + 1];
                          newList[idx + 1] = newList[idx];
                          newList[idx] = temp;
                          reorderProjects(newList);
                        }}
                        className="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Geser ke Bawah"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Featured / Unggulan di Overview */}
                      <button
                        onClick={() => updateProject(proj.id, { featured: !proj.featured })}
                        className={`px-2.5 py-1 rounded text-xs font-mono border transition-all cursor-pointer ${
                          proj.featured
                            ? 'border-amber-500/40 text-amber-300 bg-amber-500/20 shadow-sm'
                            : 'border-white/10 text-neutral-400 hover:text-white bg-white/[0.02]'
                        }`}
                        title={proj.featured ? 'Hapus dari Karya Pilihan Utama' : 'Jadikan Karya Pilihan Utama (Prioritas di Beranda)'}
                      >
                        {proj.featured ? '★ Karya Pilihan' : '☆ Jadikan Pilihan'}
                      </button>

                      {/* Toggle Active */}
                      <button
                        onClick={() => updateProject(proj.id, { active: !proj.active })}
                        className={`px-2.5 py-1 rounded text-xs font-mono border transition-all cursor-pointer ${
                          proj.active
                            ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10'
                            : 'border-white/10 text-neutral-500'
                        }`}
                      >
                        {proj.active ? 'Aktif' : 'Disembunyikan'}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setEditingProjectId(proj.id);
                          setProjectForm({
                            title: proj.title,
                            category: proj.category,
                            year: proj.year,
                            description: proj.description,
                            techStackString: proj.techStack.join(', '),
                            liveDemoUrl: proj.liveDemoUrl || '',
                            sourceCodeUrl: proj.sourceCodeUrl || '',
                            featured: proj.featured,
                            active: proj.active,
                            imageUrl: proj.imageUrl || '',
                            gallery: Array.isArray(proj.gallery) ? proj.gallery : [],
                            status: proj.status || 'Completed',
                            featuresString: Array.isArray(proj.features) ? proj.features.join('\n') : '',
                          });
                          setImageLoadError(false);
                          setGalleryInputUrl('');
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-white cursor-pointer"
                        title="Edit Proyek"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus proyek "${proj.title}"?`)) {
                            deleteProject(proj.id);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        title="Hapus Proyek"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SKILLS MANAGEMENT */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            <div className="p-8 rounded-3xl border border-white/10 bg-[#0c0d12]/80 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-lg font-display font-bold text-white">
                    {editingSkillId ? 'Edit Keahlian' : 'Tambah Keahlian Baru'}
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Kelola keahlian awal (HTML, CSS, JavaScript dasar, React, Web Development, UI Design, Visual Design, Inkscape).
                  </p>
                </div>
                {editingSkillId && (
                  <button
                    onClick={() => {
                      setEditingSkillId(null);
                      setSkillForm({
                        name: '',
                        category: 'Core Web',
                        description: '',
                        level: 'Pengembangan Aktif',
                      });
                    }}
                    className="text-xs font-mono text-neutral-400 hover:text-white"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!skillForm.name.trim()) return;

                  if (editingSkillId) {
                    updateSkill(editingSkillId, skillForm);
                    setEditingSkillId(null);
                  } else {
                    addSkill(skillForm);
                  }
                  setSkillForm({
                    name: '',
                    category: 'Core Web',
                    description: '',
                    level: 'Pengembangan Aktif',
                  });
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Nama Keahlian *</label>
                    <input
                      type="text"
                      required
                      value={skillForm.name}
                      onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                      placeholder="Contoh: CSS / Inkscape"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Kategori</label>
                    <select
                      value={skillForm.category}
                      onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#0c0d12] text-sm text-white focus:outline-none focus:border-white/30"
                    >
                      <option value="Core Web">Core Web</option>
                      <option value="Design & Visual">Design & Visual</option>
                      <option value="Tools & Workflow">Tools & Workflow</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Tingkat / Label Status</label>
                    <input
                      type="text"
                      value={skillForm.level}
                      onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                      placeholder="Fondasi Kuat / Pengembangan Aktif"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Deskripsi Singkat Keahlian</label>
                    <input
                      type="text"
                      value={skillForm.description}
                      onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                      placeholder="Deskripsi fokus penguasaan..."
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full border ${accent.border} ${accent.bg} text-black font-semibold text-xs font-mono uppercase cursor-pointer hover:opacity-90 disabled:opacity-50 transition-all`}
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{isSaving ? 'Menyimpan ke Cloud...' : (editingSkillId ? 'Perbarui Keahlian' : 'Tambah Keahlian')}</span>
                </button>
              </form>
            </div>

            {/* Existing skills grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-5 rounded-2xl border border-white/10 bg-[#0c0d12]/80 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-white text-base">
                        {skill.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 text-neutral-400">
                        {skill.category}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light">
                      {skill.description}
                    </p>
                    {skill.level && (
                      <span className="text-[10px] font-mono text-amber-300/80 block">
                        • {skill.level}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => {
                        setEditingSkillId(skill.id);
                        setSkillForm({
                          name: skill.name,
                          category: skill.category,
                          description: skill.description,
                          level: skill.level || '',
                        });
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-white"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus keahlian "${skill.name}"?`)) {
                          deleteSkill(skill.id);
                        }
                      }}
                      className="p-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CONTACT INFO MANAGEMENT */}
        {activeTab === 'contact' && (
          <div className="p-8 rounded-3xl border border-white/10 bg-[#0c0d12]/80 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-display font-bold text-white">
                  Kelola Data Kontak & Media Sosial
                </h2>
                <p className="text-xs text-neutral-400">
                  Semua informasi kontak akan disinkronkan ke halaman /contact dan footer website.
                </p>
              </div>
              <button
                onClick={() => {
                  updateProfile({
                    ...data.profile,
                    email: contactForm.email,
                    whatsapp: contactForm.whatsapp,
                    instagram: contactForm.instagram,
                    github: contactForm.github,
                    location: contactForm.location,
                  });
                }}
                disabled={isSaving}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border ${accent.border} ${accent.bg} text-black font-semibold text-xs font-mono uppercase cursor-pointer hover:opacity-90 disabled:opacity-50 transition-all`}
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSaving ? 'Menyimpan ke Cloud...' : 'Simpan Kontak'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400">Nomor WhatsApp</label>
                <input
                  type="text"
                  value={contactForm.whatsapp}
                  onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                  placeholder="+6281234567890"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400">Alamat Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="fadiyel.studio@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400">Username Instagram</label>
                <input
                  type="text"
                  value={contactForm.instagram}
                  onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                  placeholder="fadiyel.id"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400">Username GitHub</label>
                <input
                  type="text"
                  value={contactForm.github}
                  onChange={(e) => setContactForm({ ...contactForm, github: e.target.value })}
                  placeholder="fadiyel"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400">Lokasi Basis</label>
                <input
                  type="text"
                  value={contactForm.location}
                  onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                  placeholder="Indonesia"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: WEBSITE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-8 rounded-3xl border border-white/10 bg-[#0c0d12]/80 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-display font-bold text-white">
                  Pengaturan Estetika & Tampilan Website
                </h2>
                <p className="text-xs text-neutral-400">
                  Ubah tema warna aksen (Soft Gold, Electric Blue, Emerald), teks tombol, dan visibilitas bagian.
                </p>
              </div>
              <button
                onClick={() => updateSettings(settingsForm)}
                disabled={isSaving}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border ${accent.border} ${accent.bg} text-black font-semibold text-xs font-mono uppercase cursor-pointer hover:opacity-90 disabled:opacity-50 transition-all`}
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSaving ? 'Menyimpan ke Cloud...' : 'Simpan Pengaturan'}</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Accent Color Selection */}
              <div className="space-y-3">
                <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
                  Pilihan Warna Aksen Sinematik
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Soft Gold */}
                  <button
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, accentColor: 'gold' })}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      settingsForm.accentColor === 'gold'
                        ? 'border-amber-400 bg-amber-400/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                      <div>
                        <span className="text-xs font-mono text-white block font-medium">Soft Gold</span>
                        <span className="text-[10px] text-neutral-400">Klasik & Mewah</span>
                      </div>
                    </div>
                    {settingsForm.accentColor === 'gold' && <Check className="w-4 h-4 text-amber-400" />}
                  </button>

                  {/* Electric Blue */}
                  <button
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, accentColor: 'blue' })}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      settingsForm.accentColor === 'blue'
                        ? 'border-sky-400 bg-sky-400/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                      <div>
                        <span className="text-xs font-mono text-white block font-medium">Electric Blue</span>
                        <span className="text-[10px] text-neutral-400">Futuristik & Tajam</span>
                      </div>
                    </div>
                    {settingsForm.accentColor === 'blue' && <Check className="w-4 h-4 text-sky-400" />}
                  </button>

                  {/* Emerald */}
                  <button
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, accentColor: 'emerald' })}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      settingsForm.accentColor === 'emerald'
                        ? 'border-emerald-400 bg-emerald-400/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                      <div>
                        <span className="text-xs font-mono text-white block font-medium">Emerald</span>
                        <span className="text-[10px] text-neutral-400">Botanis & Segar</span>
                      </div>
                    </div>
                    {settingsForm.accentColor === 'emerald' && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                </div>
              </div>

              {/* Tech Typography Selection */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
                    Tema Tipografi Teknologi (Tech Font Theme)
                  </label>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Kombinasi Display + Body + Monospace
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Aerospace HUD */}
                  <button
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, fontTheme: 'aerospace-rajdhani' })}
                    className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                      (settingsForm.fontTheme || 'aerospace-rajdhani') === 'aerospace-rajdhani'
                        ? 'border-white/40 bg-white/10 shadow-lg'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                          FADIYEL STUDIO
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/15 text-white">
                          Rekomendasi
                        </span>
                      </div>
                      <p className="text-xs font-medium text-neutral-300" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        Aerospace HUD — Rajdhani + Space Grotesk
                      </p>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Presisi geometris tajam, condensed, ala antarmuka sci-fi berteknologi tinggi.
                      </p>
                    </div>
                    {(settingsForm.fontTheme || 'aerospace-rajdhani') === 'aerospace-rajdhani' && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                    )}
                  </button>

                  {/* Cyber Sci-Fi Orbitron */}
                  <button
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, fontTheme: 'cyber-orbitron' })}
                    className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                      settingsForm.fontTheme === 'cyber-orbitron'
                        ? 'border-white/40 bg-white/10 shadow-lg'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white tracking-wider" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                          FADIYEL STUDIO
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-sky-500/20 text-sky-300">
                          Sci-Fi
                        </span>
                      </div>
                      <p className="text-xs font-medium text-neutral-300" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        Cyber Sci-Fi — Orbitron + Space Grotesk
                      </p>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Sudut tajam futuristik, gaya command center pesawat luar angkasa & cybernetics.
                      </p>
                    </div>
                    {settingsForm.fontTheme === 'cyber-orbitron' && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                    )}
                  </button>

                  {/* Mechanical Chakra */}
                  <button
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, fontTheme: 'chakra-tech' })}
                    className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                      settingsForm.fontTheme === 'chakra-tech'
                        ? 'border-white/40 bg-white/10 shadow-lg'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white tracking-wider" style={{ fontFamily: 'Chakra Petch, sans-serif' }}>
                          FADIYEL STUDIO
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300">
                          Cyberpunk
                        </span>
                      </div>
                      <p className="text-xs font-medium text-neutral-300" style={{ fontFamily: 'Chakra Petch, sans-serif' }}>
                        Cyber Mechanical — Chakra Petch + Space Grotesk
                      </p>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Karakter mekanikal tegas dengan sudut terpotong 45 derajat bergaya mecha tech.
                      </p>
                    </div>
                    {settingsForm.fontTheme === 'chakra-tech' && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                    )}
                  </button>

                  {/* Tech Grotesk */}
                  <button
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, fontTheme: 'tech-grotesk' })}
                    className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                      settingsForm.fontTheme === 'tech-grotesk'
                        ? 'border-white/40 bg-white/10 shadow-lg'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white tracking-wider" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          FADIYEL STUDIO
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300">
                          Dev Lab
                        </span>
                      </div>
                      <p className="text-xs font-medium text-neutral-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Silicon Valley Lab — Space Grotesk + JetBrains Mono
                      </p>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Modern tech grotesque minimalis yang digunakan studio software & Web3 mutakhir.
                      </p>
                    </div>
                    {settingsForm.fontTheme === 'tech-grotesk' && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                    )}
                  </button>
                </div>
              </div>

              {/* Text settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-400">Teks Tombol Hero Section</label>
                  <input
                    type="text"
                    value={settingsForm.heroCtaText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroCtaText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
                  Animasi & Visibilitas Komponen
                </label>

                {/* Opening Animation Style Selector */}
                <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
                  <div>
                    <label className="text-xs font-mono text-neutral-200 block font-semibold">
                      Gaya Animasi Pembuka Saat Pertama Buka Web
                    </label>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Pilih bagaimana animasi awal menyambut pengunjung saat pertama kali membuka website studio Anda.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, openingStyle: 'auto-reveal', openingScreenEnabled: false })}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        (settingsForm.openingStyle || 'auto-reveal') === 'auto-reveal' && !settingsForm.openingScreenEnabled
                          ? 'border-amber-400/60 bg-amber-400/10 text-white shadow-md'
                          : 'border-white/10 bg-black/40 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-bold text-white font-mono">1. Auto-Reveal Instan</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">Rekomendasi</span>
                      </div>
                      <span className="text-[11px] text-neutral-300 block leading-relaxed">
                        Animasi teks dan elemen beranda mengalir lembut (1.2s) otomatis tanpa tombol Enter. Cepat & nyaman di HP.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, openingStyle: 'cinematic-screen', openingScreenEnabled: true })}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        settingsForm.openingScreenEnabled
                          ? 'border-amber-400/60 bg-amber-400/10 text-white shadow-md'
                          : 'border-white/10 bg-black/40 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-bold text-white font-mono">2. Layar Sinematik Penuh</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">Intro Layar</span>
                      </div>
                      <span className="text-[11px] text-neutral-300 block leading-relaxed">
                        Menampilkan layar persen 0–100% dan tombol "Enter Experience" sebelum masuk ke beranda.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, openingStyle: 'clean', openingScreenEnabled: false })}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        settingsForm.openingStyle === 'clean' && !settingsForm.openingScreenEnabled
                          ? 'border-amber-400/60 bg-amber-400/10 text-white shadow-md'
                          : 'border-white/10 bg-black/40 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-bold text-white font-mono">3. Langsung Tampil</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-neutral-400">Minimalis</span>
                      </div>
                      <span className="text-[11px] text-neutral-300 block leading-relaxed">
                        Langsung membuka konten utama secara statis seketika tanpa jeda intro.
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.02] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.openingScreenEnabled}
                      onChange={(e) => setSettingsForm({ ...settingsForm, openingScreenEnabled: e.target.checked })}
                      className="rounded"
                    />
                    <div className="text-xs">
                      <span className="font-medium text-white block">Aktifkan Layar Pembuka Sinematik (Cinematic Opening)</span>
                      <span className="text-neutral-400">Menampilkan intro animasi FADIYEL pada kunjungan pertama sesi browser.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.02] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.showSkillsPreview}
                      onChange={(e) => setSettingsForm({ ...settingsForm, showSkillsPreview: e.target.checked })}
                      className="rounded"
                    />
                    <div className="text-xs">
                      <span className="font-medium text-white block">Tampilkan Bagian Skills Preview di Halaman Utama</span>
                      <span className="text-neutral-400">Menampilkan cuplikan ringkas keahlian teknis di bawah karya pilihan.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.02] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.showCollaborationSection}
                      onChange={(e) => setSettingsForm({ ...settingsForm, showCollaborationSection: e.target.checked })}
                      className="rounded"
                    />
                    <div className="text-xs">
                      <span className="font-medium text-white block">Tampilkan Bagian Kolaborasi di Halaman Utama</span>
                      <span className="text-neutral-400">Menampilkan ajakan kolaborasi terbuka sebelum footer.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: MESSAGES INBOX */}
        {activeTab === 'messages' && (
          <div className="p-8 rounded-3xl border border-white/10 bg-[#0c0d12]/80 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-display font-bold text-white">
                  Pesan Masuk dari Formulir Kontak ({data.messages.length})
                </h2>
                <p className="text-xs text-neutral-400">
                  Daftar pesan yang dikirimkan oleh pengunjung melalui halaman /contact.
                </p>
              </div>
            </div>

            {data.messages.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-neutral-500 border border-dashed border-white/10 rounded-2xl">
                Belum ada pesan masuk. Kirim pesan tes melalui halaman /contact untuk melihatnya di sini.
              </div>
            ) : (
              <div className="space-y-4">
                {data.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <div>
                        <span className="text-sm font-bold text-white block">{msg.name}</span>
                        <a href={`mailto:${msg.email}`} className="text-xs font-mono text-amber-400/80 hover:underline">
                          {msg.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-neutral-500">
                          {new Date(msg.timestamp).toLocaleString('id-ID')}
                        </span>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="text-rose-400 hover:text-rose-300 p-1"
                          title="Hapus Pesan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-neutral-400">
                      Topik: <span className="text-neutral-200">{msg.subject}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-300 font-light whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
