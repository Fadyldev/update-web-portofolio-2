import { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Instagram, 
  Github, 
  ArrowUpRight, 
  Send, 
  Copy, 
  Check, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAccentClasses } from '../utils/theme';

export function Contact() {
  const { data, sendMessage, showToast } = usePortfolio();
  const accent = getAccentClasses(data.settings.accentColor);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Web Development / Digital Invitation',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`${label} disalin ke clipboard!`, 'info');
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Harap lengkapi semua kolom formulir.', 'error');
      return;
    }

    setIsSubmitting(true);

    const res = await sendMessage({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });

    setIsSubmitting(false);
    if (res.success) {
      setFormData({
        name: '',
        email: '',
        subject: 'Web Development / Digital Invitation',
        message: '',
      });
      setSubmittedSuccess(true);
      setTimeout(() => setSubmittedSuccess(false), 5000);
    }
  };

  // Format phone number to international wa.me standard (convert 08xx -> 628xx)
  const rawWaDigits = data.profile.whatsapp.replace(/[^0-9]/g, '');
  const whatsappClean = rawWaDigits.startsWith('0') 
    ? '62' + rawWaDigits.slice(1) 
    : rawWaDigits;

  const defaultWaMessage = encodeURIComponent(
    `Halo ${data.profile.name}, saya melihat website portofolio Anda dan tertarik untuk berdiskusi mengenai proyek kolaborasi / pembuatan website.`
  );

  return (
    <div id="contact-page" className="min-h-screen bg-[#070709] text-neutral-100 pt-32 pb-24 relative">
      {/* Background ambient pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-widest text-neutral-300 uppercase">
            <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg}`} />
            <span>{data.about?.contactBadge || 'Connect & Inquire'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white">
            {data.about?.contactTitle || "Let's Work Together"}
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed">
            {data.about?.contactDescription || 'Terbuka untuk diskusi proyek pembuatan website portofolio, undangan pernikahan digital bertema khusus, perancangan antarmuka, atau eksplorasi ide kreatif digital bersama.'}
          </p>
        </div>

        {/* Contact Grid: Direct Channels & Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Direct Channels Cards (Left Column) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xs font-mono tracking-widest text-neutral-300 uppercase pb-2 border-b border-white/[0.08]">
              Saluran Komunikasi Langsung
            </h2>

            {/* WhatsApp */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl border ${accent.border} ${accent.bgMuted}`}>
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-neutral-300 uppercase block">
                    WhatsApp Chat
                  </span>
                  <span className="text-sm font-medium text-white">
                    {data.profile.whatsapp}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(data.profile.whatsapp, 'Nomor WhatsApp')}
                  className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all cursor-pointer"
                  title="Salin Nomor"
                >
                  {copiedField === 'Nomor WhatsApp' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={`https://wa.me/${whatsappClean}?text=${defaultWaMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-2 rounded-lg border ${accent.border} text-white hover:bg-white/10 transition-all`}
                  title="Buka Chat WhatsApp"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className={`p-3 rounded-xl border ${accent.border} ${accent.bgMuted} shrink-0`}>
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="truncate">
                  <span className="text-[11px] font-mono text-neutral-300 uppercase block">
                    Electronic Mail
                  </span>
                  <span className="text-sm font-medium text-white truncate block">
                    {data.profile.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <button
                  onClick={() => handleCopy(data.profile.email, 'Alamat Email')}
                  className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all cursor-pointer"
                  title="Salin Email"
                >
                  {copiedField === 'Alamat Email' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={`mailto:${data.profile.email}`}
                  className={`p-2 rounded-lg border ${accent.border} text-white hover:bg-white/10 transition-all`}
                  title="Kirim Email"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Instagram */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl border ${accent.border} ${accent.bgMuted}`}>
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-neutral-300 uppercase block">
                    Instagram Direct
                  </span>
                  <span className="text-sm font-medium text-white">
                    @{data.profile.instagram.replace('@', '')}
                  </span>
                </div>
              </div>

              <a
                href={`https://instagram.com/${data.profile.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className={`p-2 rounded-lg border ${accent.border} text-white hover:bg-white/10 transition-all`}
                title="Buka Profil Instagram"
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* GitHub */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl border ${accent.border} ${accent.bgMuted}`}>
                  <Github className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-neutral-300 uppercase block">
                    GitHub Code Repository
                  </span>
                  <span className="text-sm font-medium text-white">
                    github.com/{data.profile.github}
                  </span>
                </div>
              </div>

              <a
                href={`https://github.com/${data.profile.github}`}
                target="_blank"
                rel="noreferrer"
                className={`p-2 rounded-lg border ${accent.border} text-white hover:bg-white/10 transition-all`}
                title="Buka Repositori GitHub"
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* Location indicator */}
            <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] flex items-center gap-3 text-xs font-mono text-neutral-300">
              <MapPin className="w-4 h-4 text-neutral-400" />
              <span>Berbasis di {data.profile.location} • Tersedia untuk kolaborasi daring (Remote)</span>
            </div>
          </div>

          {/* Contact Form (Right Column) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                Kirim Pesan atau Pertanyaan
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-light">
                Isi rincian di bawah dan pesan Anda akan diteruskan ke kotak masuk studio.
              </p>
            </div>

            {submittedSuccess && (
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Pesan berhasil dikirim dan tersimpan! Fadiyel akan merespons sesegera mungkin.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-mono text-neutral-400 block">
                    Nama Anda *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nama lengkap atau inisial"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-mono text-neutral-400 block">
                    Email Anda *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="text-xs font-mono text-neutral-400 block">
                  Topik / Keperluan
                </label>
                <select
                  id="contact-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#0c0d12] text-sm text-white focus:outline-none focus:border-white/30 transition-all"
                >
                  <option value="Web Development / Digital Invitation">Digital Invitation (Undangan Digital)</option>
                  <option value="Website Development">Pembuatan Website Portofolio / Brand</option>
                  <option value="UI & Visual Design">UI Design & Grafis Vektor (Inkscape)</option>
                  <option value="Creative Collaboration">Kolaborasi Belajar & Karya Terbuka</option>
                  <option value="Other">Lainnya</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-mono text-neutral-400 block">
                  Pesan atau Detail Gagasan *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ceritakan tentang proyek yang ingin dibuat, nuansa estetika yang diharapkan, atau pertanyaan..."
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all resize-none"
                />
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className={`w-full group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full border ${accent.border} ${accent.bgMuted} text-white text-sm font-medium tracking-wide transition-all duration-300 hover:border-white/40 ${accent.glow} cursor-pointer disabled:opacity-50`}
              >
                <Send className="w-4 h-4 text-neutral-300 group-hover:translate-x-1 group-hover:text-white transition-transform" />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
