import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PortfolioData, 
  Profile, 
  Project, 
  Skill, 
  SiteSettings, 
  ContactMessage,
  CloudSyncStatus,
  AboutContent
} from '../types';
import { DEFAULT_PORTFOLIO_DATA, DEFAULT_ABOUT_CONTENT } from '../data/defaultData';
import { supabase, isSupabaseConfigured, User, Session } from '../lib/supabase';

const STORAGE_KEY = 'fadiyel_portfolio_data_v1';
const OPENING_SHOWN_KEY = 'fadiyel_opening_shown_session';
const FALLBACK_SESSION_KEY = 'fadiyel_preview_admin_session';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface PortfolioContextType {
  data: PortfolioData;
  updateProfile: (profile: Profile) => Promise<boolean>;
  updateAbout: (about: AboutContent) => Promise<boolean>;
  addProject: (project: Omit<Project, 'id' | 'order'>) => Promise<boolean>;
  updateProject: (id: string, updated: Partial<Project>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  reorderProjects: (projects: Project[]) => Promise<boolean>;
  addSkill: (skill: Omit<Skill, 'id'>) => Promise<boolean>;
  updateSkill: (id: string, updated: Partial<Skill>) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<boolean>;
  sendMessage: (msg: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>) => Promise<{ success: boolean; error?: string }>;
  deleteMessage: (id: string) => Promise<boolean>;
  resetData: () => Promise<boolean>;
  exportData: () => void;
  importData: (jsonString: string) => Promise<boolean>;
  currentPath: string;
  navigate: (path: string) => void;
  
  // Database & Cloud Sync States
  cloudSyncStatus: CloudSyncStatus;
  lastSyncTime: string | null;
  syncError: string | null;
  isSaving: boolean;
  refreshFromCloud: () => Promise<void>;
  syncInitialDataToCloud: () => Promise<{ success: boolean; error?: string }>;

  // Authentication states & actions
  isSupabaseConfigured: boolean;
  adminUser: User | null;
  adminSession: Session | null;
  authLoading: boolean;
  isAdminAuthenticated: boolean;
  authMethod: 'supabase' | 'preview_fallback' | null;
  loginWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithPreviewFallback: () => void;
  logoutAdmin: () => Promise<void>;
  
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  hasSeenOpening: boolean;
  setHasSeenOpening: (seen: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  // Initialize from localStorage cache or default
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const parsedProjects = Array.isArray(parsed.projects)
          ? parsed.projects.map((p: any) => ({
              ...p,
              status: p.status || 'Completed',
              gallery: Array.isArray(p.gallery) ? p.gallery : [],
              features: Array.isArray(p.features) ? p.features : [],
            }))
          : DEFAULT_PORTFOLIO_DATA.projects;

        return {
          ...DEFAULT_PORTFOLIO_DATA,
          ...parsed,
          projects: parsedProjects,
          profile: { ...DEFAULT_PORTFOLIO_DATA.profile, ...(parsed.profile || {}) },
          settings: { ...DEFAULT_PORTFOLIO_DATA.settings, ...(parsed.settings || {}) },
          about: { ...DEFAULT_ABOUT_CONTENT, ...(parsed.about || {}) },
        };
      }
    } catch {
      // Fallback to default
    }
    return DEFAULT_PORTFOLIO_DATA;
  });

  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path && path !== '' ? path : '/';
    }
    return '/';
  });

  // Cloud Sync Statuses
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Supabase Auth State
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [adminSession, setAdminSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [fallbackSession, setFallbackSession] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(FALLBACK_SESSION_KEY) === 'true';
    }
    return false;
  });

  const [hasSeenOpening, setHasSeenOpeningState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(OPENING_SHOWN_KEY) === 'true';
    }
    return false;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Calculate authenticated status
  const isAdminAuthenticated = isSupabaseConfigured
    ? !!adminSession && !!adminUser
    : fallbackSession;

  const authMethod: 'supabase' | 'preview_fallback' | null = isSupabaseConfigured
    ? (adminSession ? 'supabase' : null)
    : (fallbackSession ? 'preview_fallback' : null);

  const isSaving = cloudSyncStatus === 'saving';

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setHasSeenOpening = (seen: boolean) => {
    setHasSeenOpeningState(seen);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(OPENING_SHOWN_KEY, seen ? 'true' : 'false');
    }
  };

  // Initialize and listen to Supabase Authentication session
  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!isMounted) return;
      if (error) {
        console.error('Supabase getSession error:', error.message);
      }
      setAdminSession(session);
      setAdminUser(session?.user ?? null);
      setAuthLoading(false);
    }).catch(() => {
      if (isMounted) setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setAdminSession(session);
      setAdminUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch initial portfolio content from Supabase database
  const refreshFromCloud = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setCloudSyncStatus('idle');
      return;
    }

    setCloudSyncStatus('loading');
    try {
      const { data: row, error } = await supabase
        .from('portfolio_content')
        .select('content, updated_at')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.warn('Supabase portfolio_content read notice:', error.message);
        if (error.message.includes('does not exist') || error.code === '42P01') {
          setCloudSyncStatus('not_seeded');
          setSyncError('Tabel database "portfolio_content" belum dibuat di Supabase SQL Editor.');
        } else {
          setCloudSyncStatus('error');
          setSyncError(error.message);
        }
        return;
      }

      if (row && row.content) {
        const cloudContent = row.content as Partial<PortfolioData>;
        const normalizedProjects = Array.isArray(cloudContent.projects)
          ? cloudContent.projects.map((p: any) => ({
              ...p,
              status: p.status || 'Completed',
              gallery: Array.isArray(p.gallery) ? p.gallery : [],
              features: Array.isArray(p.features) ? p.features : [],
            }))
          : DEFAULT_PORTFOLIO_DATA.projects;

        const merged: PortfolioData = {
          ...DEFAULT_PORTFOLIO_DATA,
          ...cloudContent,
          projects: normalizedProjects,
          profile: { ...DEFAULT_PORTFOLIO_DATA.profile, ...(cloudContent.profile || {}) },
          settings: { ...DEFAULT_PORTFOLIO_DATA.settings, ...(cloudContent.settings || {}) },
          about: { ...DEFAULT_ABOUT_CONTENT, ...(cloudContent.about || {}) },
          messages: data.messages, // retain messages loaded separately
        };
        setData(merged);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch {}
        setCloudSyncStatus('synced');
        setSyncError(null);
        if (row.updated_at) {
          setLastSyncTime(new Date(row.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } else {
        setCloudSyncStatus('not_seeded');
        setSyncError('Tabel portfolio_content sudah ada namun baris data id=1 masih kosong.');
      }
    } catch (err: any) {
      console.error('Failed to load portfolio from Supabase:', err);
      setCloudSyncStatus('error');
      setSyncError(err?.message || 'Gagal terhubung ke database cloud');
    }
  };

  useEffect(() => {
    refreshFromCloud();
  }, [isSupabaseConfigured]);

  // Load contact messages from Supabase when admin is authenticated
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client || !adminUser) return;

    let isMounted = true;
    const loadMessages = async () => {
      try {
        const { data: rows, error } = await client
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (!isMounted) return;
        if (!error && rows) {
          const mapped: ContactMessage[] = rows.map((r: any) => ({
            id: r.id,
            name: r.name,
            email: r.email,
            subject: r.subject || '',
            message: r.message,
            timestamp: r.created_at || new Date().toISOString(),
            read: !!r.is_read,
          }));
          setData((prev) => ({ ...prev, messages: mapped }));
        }
      } catch (e) {
        console.warn('Notice loading contact messages:', e);
      }
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [adminUser, isSupabaseConfigured]);

  // Window history popstate listener
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Real Supabase Login
  const loginWithSupabase = async (
    email: string, 
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { 
        success: false, 
        error: 'Supabase belum dikonfigurasi. Lengkapi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di .env.' 
      };
    }

    setAuthLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthLoading(false);
        return { success: false, error: error.message };
      }

      setAdminSession(authData.session);
      setAdminUser(authData.user);
      setAuthLoading(false);
      showToast(`Login berhasil! Selamat datang, ${authData.user.email}`, 'success');
      refreshFromCloud();
      return { success: true };
    } catch (err: any) {
      setAuthLoading(false);
      return { 
        success: false, 
        error: err.message || 'Terjadi kesalahan saat menghubungi server autentikasi Supabase.' 
      };
    }
  };

  // Supabase User Sign Up helper
  const signUpWithSupabase = async (
    email: string, 
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { 
        success: false, 
        error: 'Supabase belum dikonfigurasi.' 
      };
    }

    setAuthLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthLoading(false);
        return { success: false, error: error.message };
      }

      setAuthLoading(false);
      if (authData.session) {
        setAdminSession(authData.session);
        setAdminUser(authData.user);
        showToast('Pendaftaran admin berhasil dan Anda telah login!', 'success');
      } else {
        showToast('Pendaftaran akun dikirim! Silakan periksa konfirmasi email atau aktifkan auto-confirm di Supabase.', 'info');
      }
      return { success: true };
    } catch (err: any) {
      setAuthLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Preview Fallback Login (Only allowed when Supabase is not configured)
  const loginWithPreviewFallback = () => {
    if (isSupabaseConfigured) {
      showToast('Supabase sudah aktif. Harap login menggunakan email dan password akun terdaftar.', 'error');
      return;
    }
    setFallbackSession(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(FALLBACK_SESSION_KEY, 'true');
    }
    showToast('Masuk ke Dashboard dalam Mode Pratinjau Lokal (Tanpa Cloud Auth)', 'info');
  };

  // Logout Handler
  const logoutAdmin = async () => {
    setAuthLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Supabase sign out error:', err);
      }
    }
    setAdminSession(null);
    setAdminUser(null);
    setFallbackSession(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(FALLBACK_SESSION_KEY);
    }
    setAuthLoading(false);
    showToast('Sesi admin berakhir. Anda telah keluar.', 'info');
  };

  // Access Control Guard helper
  const verifyAdminAccess = (): boolean => {
    if (!isAdminAuthenticated) {
      showToast('Akses ditolak: Hanya admin yang telah login yang dapat mengubah data.', 'error');
      return false;
    }
    return true;
  };

  /**
   * CORE SERVER-FIRST SAVING LOGIC
   * Mandatory: Writes to Supabase FIRST.
   * If Supabase fails, DO NOT touch local state and DO NOT touch localStorage!
   */
  const savePortfolioContent = async (newData: PortfolioData): Promise<{ success: boolean; error?: string }> => {
    if (!verifyAdminAccess()) {
      return { success: false, error: 'Akses ditolak: Anda belum login sebagai admin.' };
    }

    // When Supabase is configured and admin is authenticated via Supabase:
    if (isSupabaseConfigured && supabase && adminUser) {
      setCloudSyncStatus('saving');
      setSyncError(null);

      try {
        const payload = {
          id: 1,
          content: {
            profile: newData.profile,
            projects: newData.projects,
            skills: newData.skills,
            settings: newData.settings,
            about: newData.about || DEFAULT_ABOUT_CONTENT,
          },
          updated_at: new Date().toISOString(),
          updated_by: adminUser.id,
        };

        const { error } = await supabase
          .from('portfolio_content')
          .upsert(payload, { onConflict: 'id' });

        if (error) {
          // STRICT RULE: DO NOT FALLBACK TO LOCALSTORAGE ON FAILURE!
          setCloudSyncStatus('error');
          setSyncError(error.message);
          showToast(`Gagal menyimpan ke Supabase: ${error.message}`, 'error');
          return { success: false, error: error.message };
        }

        // ONLY on verified Supabase success:
        setData(newData);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        } catch (e) {
          console.warn('LocalStorage cache update notice:', e);
        }
        setCloudSyncStatus('synced');
        setSyncError(null);
        setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        return { success: true };
      } catch (err: any) {
        const msg = err?.message || 'Gagal menghubungi server database Supabase.';
        setCloudSyncStatus('error');
        setSyncError(msg);
        showToast(`Gagal menyimpan ke Supabase: ${msg}`, 'error');
        return { success: false, error: msg };
      }
    }

    // Local preview mode ONLY when Supabase is not configured
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch {}
    return { success: true };
  };

  // Sync initial data from current state to Supabase
  const syncInitialDataToCloud = async (): Promise<{ success: boolean; error?: string }> => {
    if (!verifyAdminAccess()) {
      return { success: false, error: 'Akses ditolak: Anda belum login sebagai admin.' };
    }
    if (!isSupabaseConfigured || !supabase || !adminUser) {
      return { success: false, error: 'Supabase belum terkonfigurasi atau sesi admin belum aktif.' };
    }

    setCloudSyncStatus('saving');
    try {
      const payload = {
        id: 1,
        content: {
          profile: data.profile,
          projects: data.projects,
          skills: data.skills,
          settings: data.settings,
          about: data.about || DEFAULT_ABOUT_CONTENT,
        },
        updated_at: new Date().toISOString(),
        updated_by: adminUser.id,
      };

      const { error } = await supabase
        .from('portfolio_content')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        setCloudSyncStatus('error');
        setSyncError(error.message);
        showToast(`Gagal mengunggah data awal: ${error.message}`, 'error');
        return { success: false, error: error.message };
      }

      setCloudSyncStatus('synced');
      setSyncError(null);
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      showToast('Data awal portfolio berhasil diunggah ke database Supabase!', 'success');
      return { success: true };
    } catch (err: any) {
      const msg = err?.message || 'Terjadi kesalahan.';
      setCloudSyncStatus('error');
      setSyncError(msg);
      showToast(`Gagal mengunggah data awal: ${msg}`, 'error');
      return { success: false, error: msg };
    }
  };

  // Guarded Profile actions
  const updateProfile = async (profile: Profile): Promise<boolean> => {
    const updated = { ...data, profile };
    const res = await savePortfolioContent(updated);
    if (res.success) {
      showToast('Data profil berhasil disimpan ke database cloud!');
      return true;
    }
    return false;
  };

  // Guarded About actions
  const updateAbout = async (about: AboutContent): Promise<boolean> => {
    const updated = { ...data, about };
    const res = await savePortfolioContent(updated);
    if (res.success) {
      showToast('Konten halaman About berhasil disimpan ke database cloud!');
      return true;
    }
    return false;
  };

  // Guarded Project actions
  const addProject = async (projectData: Omit<Project, 'id' | 'order'>): Promise<boolean> => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      order: data.projects.length + 1,
    };
    const updated = {
      ...data,
      projects: [...data.projects, newProject],
    };
    const res = await savePortfolioContent(updated);
    if (res.success) {
      showToast(`Proyek "${newProject.title}" berhasil ditambahkan ke database!`);
      return true;
    }
    return false;
  };

  const updateProject = async (id: string, updatedFields: Partial<Project>): Promise<boolean> => {
    const updated = {
      ...data,
      projects: data.projects.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
    };
    const res = await savePortfolioContent(updated);
    if (res.success) {
      showToast('Proyek berhasil diperbarui di database!');
      return true;
    }
    return false;
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    const updated = {
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    };
    const res = await savePortfolioContent(updated);
    if (res.success) {
      showToast('Proyek telah dihapus dari database', 'info');
      return true;
    }
    return false;
  };

  const reorderProjects = async (newProjects: Project[]): Promise<boolean> => {
    const updated = {
      ...data,
      projects: newProjects.map((p, idx) => ({ ...p, order: idx + 1 })),
    };
    const res = await savePortfolioContent(updated);
    if (res.success) {
      showToast('Urutan proyek berhasil diperbarui di database');
      return true;
    }
    return false;
  };

  // Guarded Skill actions
  const addSkill = async (skillData: Omit<Skill, 'id'>): Promise<boolean> => {
    const newSkill: Skill = {
      ...skillData,
      id: `skill-${Date.now()}`,
    };
    const updated = {
      ...data,
      skills: [...data.skills, newSkill],
    };
    const res = await savePortfolioContent(updated);
    if (res.success) {
      showToast(`Keahlian "${newSkill.name}" berhasil ditambahkan ke database!`);
      return true;
    }
    return false;
  };

  const updateSkill = async (id: string, updatedFields: Partial<Skill>): Promise<boolean> => {
    const updated = {
      ...data,
      skills: data.skills.map((s) => (s.id === id ? { ...s, ...updatedFields } : s)),
    };
    const res = await savePortfolioContent(updated);
    if (res.success) {
      showToast('Keahlian berhasil diperbarui di database!');
      return true;
    }
    return false;
  };

  const deleteSkill = async (id: string): Promise<boolean> => {
    const updated = {
      ...data,
      skills: data.skills.filter((s) => s.id !== id),
    };
    const res = await savePortfolioContent(updated);
    if (res.success) {
      showToast('Keahlian telah dihapus dari database', 'info');
      return true;
    }
    return false;
  };

  // Guarded Settings
  const updateSettings = async (settingsUpdate: Partial<SiteSettings>): Promise<boolean> => {
    const updated = {
      ...data,
      settings: { ...data.settings, ...settingsUpdate },
    };
    const res = await savePortfolioContent(updated);
    if (res.success) {
      showToast('Pengaturan website berhasil disimpan ke database!');
      return true;
    }
    return false;
  };

  // Public Contact message action (visitor submits message into contact_messages table)
  const sendMessage = async (
    msgData: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>
  ): Promise<{ success: boolean; error?: string }> => {
    const newMsgId = `msg-${Date.now()}`;
    const nowIso = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('contact_messages')
          .insert({
            id: newMsgId,
            name: msgData.name.trim(),
            email: msgData.email.trim(),
            subject: msgData.subject?.trim() || null,
            message: msgData.message.trim(),
            is_read: false,
            created_at: nowIso,
          });

        if (error) {
          console.error('Failed to send contact message to Supabase:', error.message);
          showToast(`Gagal mengirim pesan: ${error.message}`, 'error');
          return { success: false, error: error.message };
        }

        showToast('Pesan berhasil terkirim ke database studio. Terima kasih!', 'success');
        return { success: true };
      } catch (err: any) {
        const msg = err?.message || 'Terjadi kesalahan jaringan saat mengirim pesan.';
        showToast(msg, 'error');
        return { success: false, error: msg };
      }
    }

    // Local fallback when Supabase is not configured
    const fallbackMsg: ContactMessage = {
      ...msgData,
      id: newMsgId,
      timestamp: nowIso,
      read: false,
    };
    setData((prev) => ({
      ...prev,
      messages: [fallbackMsg, ...prev.messages],
    }));
    showToast('Pesan tersimpan secara lokal.', 'info');
    return { success: true };
  };

  // Guarded Delete Message (from contact_messages table)
  const deleteMessage = async (id: string): Promise<boolean> => {
    if (!verifyAdminAccess()) return false;

    if (isSupabaseConfigured && supabase && adminUser) {
      try {
        const { error } = await supabase
          .from('contact_messages')
          .delete()
          .eq('id', id);

        if (error) {
          showToast(`Gagal menghapus pesan: ${error.message}`, 'error');
          return false;
        }
      } catch (err: any) {
        showToast(`Gagal menghapus pesan: ${err?.message}`, 'error');
        return false;
      }
    }

    setData((prev) => ({
      ...prev,
      messages: prev.messages.filter((m) => m.id !== id),
    }));
    showToast('Pesan telah dihapus', 'info');
    return true;
  };

  // Guarded Reset data
  const resetData = async (): Promise<boolean> => {
    if (!verifyAdminAccess()) return false;
    const res = await savePortfolioContent(DEFAULT_PORTFOLIO_DATA);
    if (res.success) {
      showToast('Data portofolio telah direset ke pengaturan awal', 'info');
      return true;
    }
    return false;
  };

  // Export JSON (safe utility)
  const exportData = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `fadiyel-portfolio-export-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Data portofolio berhasil diekspor ke JSON!');
    } catch {
      showToast('Gagal mengekspor data', 'error');
    }
  };

  // Guarded Import JSON
  const importData = async (jsonString: string): Promise<boolean> => {
    if (!verifyAdminAccess()) return false;
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.profile || !parsed.projects || !parsed.skills) {
        showToast('Format file JSON tidak valid. Pastikan data berasal dari export Fadiyel Studio.', 'error');
        return false;
      }
      const newDataset: PortfolioData = {
        ...DEFAULT_PORTFOLIO_DATA,
        ...parsed,
      };
      const res = await savePortfolioContent(newDataset);
      if (res.success) {
        showToast('Data portofolio berhasil diimpor dan disimpan ke database!');
        return true;
      }
      return false;
    } catch {
      showToast('Gagal membaca file JSON. Periksa sintaks dokumen.', 'error');
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
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
        sendMessage,
        deleteMessage,
        resetData,
        exportData,
        importData,
        currentPath,
        navigate,
        cloudSyncStatus,
        lastSyncTime,
        syncError,
        isSaving,
        refreshFromCloud,
        syncInitialDataToCloud,
        isSupabaseConfigured,
        adminUser,
        adminSession,
        authLoading,
        isAdminAuthenticated,
        authMethod,
        loginWithSupabase,
        signUpWithSupabase,
        loginWithPreviewFallback,
        logoutAdmin,
        toasts,
        showToast,
        removeToast,
        hasSeenOpening,
        setHasSeenOpening,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
