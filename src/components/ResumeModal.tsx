import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Printer, 
  Download, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  FileText,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { PortfolioData } from '../types';
import { getAccentClasses } from '../utils/theme';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
}

export function ResumeModal({ isOpen, onClose, data }: ResumeModalProps) {
  const [printNotice, setPrintNotice] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showPrintGuide, setShowPrintGuide] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const accent = getAccentClasses(data.settings.accentColor);

  // Helper to ensure external links always have https:// to prevent 404 router errors
  const normalizeUrl = (url?: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const rawResumeUrl = data.profile?.resumeUrl?.trim();
  const customResumeUrl = normalizeUrl(rawResumeUrl);
  const avatarUrl = data.profile?.avatarUrl;

  const profileName = data.profile?.name || 'Fadiyel';
  const profileProfession = data.profile?.profession || 'Junior Full Stack Web Developer';
  const profileHeadline = data.profile?.headline || 'Membangun Aplikasi Web yang Fungsional, Rapi, dan Siap Digunakan.';
  const profileBio = data.profile?.bio || profileHeadline;

  // Safe skills categorization
  const allSkills = Array.isArray(data.skills) ? data.skills : [];
  const coreWebSkills = allSkills.filter(
    (s) => s.category === 'Core Web' || s.category?.toLowerCase().includes('web') || s.category?.toLowerCase().includes('dev')
  );
  const backendSkills = allSkills.filter(
    (s) =>
      s.category === 'Backend & Database' ||
      s.category?.toLowerCase().includes('backend') ||
      s.category?.toLowerCase().includes('database') ||
      s.category?.toLowerCase().includes('sql') ||
      s.category?.toLowerCase().includes('php')
  );
  const designSkills = allSkills.filter(
    (s) => s.category === 'Design & Visual' || s.category?.toLowerCase().includes('design') || s.category?.toLowerCase().includes('visual')
  );
  const middleSkills = backendSkills.length > 0 ? backendSkills : designSkills;
  const middleSkillLabel = backendSkills.length > 0 ? '// Backend & Database' : '// Design & Visual';
  const toolSkills = allSkills.filter(
    (s) => !coreWebSkills.includes(s) && !middleSkills.includes(s)
  );

  // Safe projects
  const allProjects = Array.isArray(data.projects) ? data.projects : [];
  const activeProjects = allProjects.filter((p) => p.active !== false).slice(0, 4);

  // 1-Click Direct PDF Generation using html2pdf.js
  const handleDirectPdfDownload = async () => {
    if (!resumeRef.current) return;
    setIsGeneratingPdf(true);
    setPrintNotice(null);

    try {
      const opt = {
        margin: [8, 0, 8, 0] as [number, number, number, number],
        filename: `CV_${profileName.replace(/\s+/g, '_')}_A4.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        enableLinks: true,
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait' as const,
          compress: true,
        },
      };

      await html2pdf().from(resumeRef.current).set(opt).save();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err: any) {
      console.warn('Direct PDF export encountered issue, offering HTML fallback:', err);
      handleDownloadATS();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Print or trigger browser Save as PDF
  const handlePrint = () => {
    setPrintNotice(null);
    try {
      window.print();
    } catch (err: any) {
      console.warn('Browser print invocation prevented:', err);
      setPrintNotice(
        'Pencetakan dialog browser dibatasi oleh iframe. Gunakan tombol "Unduh PDF (.pdf)" di atas untuk menyimpan dokumen langsung.'
      );
    }
  };

  // Generate self-contained standalone ATS-ready HTML document with precise print settings
  const handleDownloadATS = () => {
    try {
      const skillsHtml = `
        <div style="display: flex; gap: 20px; font-size: 12px; margin-top: 10px;">
          <div style="flex: 1;">
            <strong style="color: #111; font-family: monospace; display: block; margin-bottom: 6px;">// Frontend & Web</strong>
            <ul style="margin: 0; padding-left: 16px; color: #374151; line-height: 1.6;">
              ${(coreWebSkills.length > 0 ? coreWebSkills : allSkills.slice(0, 4))
                .map((s) => `<li>${s.name}</li>`)
                .join('')}
            </ul>
          </div>
          <div style="flex: 1;">
            <strong style="color: #111; font-family: monospace; display: block; margin-bottom: 6px;">${middleSkillLabel}</strong>
            <ul style="margin: 0; padding-left: 16px; color: #374151; line-height: 1.6;">
              ${(middleSkills.length > 0 ? middleSkills : allSkills.slice(4, 8))
                .map((s) => `<li>${s.name}</li>`)
                .join('')}
            </ul>
          </div>
          <div style="flex: 1;">
            <strong style="color: #111; font-family: monospace; display: block; margin-bottom: 6px;">// Tools & Workflow</strong>
            <ul style="margin: 0; padding-left: 16px; color: #374151; line-height: 1.6;">
              ${(toolSkills.length > 0 ? toolSkills : allSkills.slice(8, 12))
                .map((s) => `<li>${s.name}</li>`)
                .join('')}
            </ul>
          </div>
        </div>
      `;

      const projectsHtml = activeProjects
        .map((p) => {
          const stackStr = Array.isArray(p.techStack)
            ? p.techStack.join(', ')
            : typeof p.techStack === 'string'
            ? p.techStack
            : 'Web Development';
          return `
            <div style="margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #f3f4f6;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <span style="font-size: 14px; font-weight: bold; color: #111;">${p.title}</span>
                <span style="font-size: 11px; font-family: monospace; color: #6b7280;">${p.category || 'Project'} • ${p.year || '2025'}</span>
              </div>
              <p style="font-size: 12px; color: #374151; margin: 4px 0 6px 0; line-height: 1.5;">${p.description || ''}</p>
              <div style="font-size: 11px; font-family: monospace; color: #6b7280;">
                <strong>Stack:</strong> ${stackStr}
                ${p.liveDemoUrl ? ` | <span>Demo: ${p.liveDemoUrl}</span>` : ''}
              </div>
            </div>
          `;
        })
        .join('');

      const milestonesHtml =
        Array.isArray(data.about?.milestones) && data.about.milestones.length > 0
          ? `
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
            <h2 style="font-size: 12px; font-family: monospace; font-weight: bold; text-transform: uppercase; color: #111; letter-spacing: 1px; margin-bottom: 8px;">
              Continuous Growth & Focus Areas
            </h2>
            <div style="display: flex; gap: 14px; font-size: 11px;">
              ${data.about.milestones
                .map(
                  (m) => `
                <div style="flex: 1; border-left: 2px solid #111; padding-left: 8px;">
                  <strong style="display: block; color: #111; font-family: monospace;">${m.title}</strong>
                  <p style="margin: 2px 0 0 0; color: #4b5563; line-height: 1.4;">${m.description}</p>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        `
          : '';

      const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV_${profileName.replace(/\s+/g, '_')}_A4</title>
  <style>
    @page { 
      size: A4 portrait; 
      margin: 0; /* PENTING: Mencegah margin ganda browser agar presisi 1 halaman */
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0f172a;
      color: #111827;
      margin: 0;
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .guide-banner {
      width: 100%;
      max-width: 210mm;
      background: #1e293b;
      color: #f8fafc;
      border: 1px solid rgba(255,255,255,0.1);
      padding: 16px 20px;
      border-radius: 12px;
      margin-bottom: 16px;
      font-size: 13px;
      line-height: 1.5;
    }
    .guide-banner h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #fbbf24;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .guide-steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 10px;
      margin-top: 10px;
      font-family: monospace;
      font-size: 11px;
    }
    .guide-step {
      background: rgba(255,255,255,0.05);
      padding: 8px 12px;
      border-radius: 6px;
      border-left: 3px solid #38bdf8;
    }
    .print-btn-bar {
      margin-top: 12px;
      display: flex;
      gap: 10px;
    }
    .print-action-btn {
      background: #f59e0b;
      color: #000;
      font-weight: bold;
      padding: 10px 20px;
      border: none;
      border-radius: 9999px;
      cursor: pointer;
      font-family: monospace;
      font-size: 12px;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }
    .sheet {
      background: #ffffff;
      width: 210mm;
      min-height: 297mm;
      max-width: 210mm;
      padding: 14mm 16mm;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      border: 1px solid #e2e8f0;
    }
    @media print {
      body { 
        background: #ffffff !important; 
        padding: 0 !important; 
        margin: 0 !important; 
      }
      .sheet { 
        box-shadow: none !important; 
        border: none !important; 
        padding: 12mm 16mm !important; 
        width: 210mm !important; 
        max-width: 210mm !important; 
        min-height: 297mm !important;
        margin: 0 auto !important; 
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      .no-print { 
        display: none !important; 
      }
    }
    .header { border-bottom: 2px solid #111; padding-bottom: 18px; margin-bottom: 20px; }
    .name { font-size: 28px; font-weight: 900; letter-spacing: -0.5px; margin: 0 0 4px 0; color: #111; text-transform: uppercase; }
    .profession { font-size: 13px; font-weight: bold; font-family: monospace; text-transform: uppercase; color: #4b5563; margin-bottom: 6px; }
    .headline { font-size: 12px; color: #4b5563; line-height: 1.5; margin: 0 0 10px 0; }
    .contact-bar { display: flex; flex-wrap: wrap; gap: 14px; font-size: 11px; font-family: monospace; color: #374151; }
    .section-title { font-size: 12px; font-family: monospace; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #111; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-top: 18px; margin-bottom: 8px; }
    .bio { font-size: 12px; line-height: 1.6; color: #374151; text-align: justify; margin: 0; }
  </style>
</head>
<body>
  <div class="guide-banner no-print">
    <h4>💡 Panduan Cetak PDF Agar 100% Rapi & Presisi:</h4>
    <div>Saat jendela print browser muncul setelah mengklik tombol di bawah, pastikan mengatur 3 hal ini di kolom samping:</div>
    <div class="guide-steps">
      <div class="guide-step">
        <strong>1. Margins (Batas tepi):</strong><br>
        Ubah ke <em>"None"</em> / <em>"Tidak ada"</em> (bukan Default).
      </div>
      <div class="guide-step">
        <strong>2. Options (Opsi):</strong><br>
        Centang <em>"Background graphics"</em> (Grafik latar belakang).
      </div>
      <div class="guide-step">
        <strong>3. Header & Footer:</strong><br>
        Hilangkan centang agar tidak muncul link tanggal di kertas.
      </div>
    </div>
    <div class="print-btn-bar">
      <button class="print-action-btn" onclick="window.print()">🖨️ Buka Dialog Simpan sebagai PDF (Ctrl + P)</button>
    </div>
  </div>

  <div class="sheet">
    <div class="header">
      <div style="display: flex; justify-content: space-between; gap: 20px;">
        <div style="flex: 1;">
          <h1 class="name">${profileName}</h1>
          <div class="profession">${profileProfession}</div>
          <p class="headline">${profileHeadline}</p>
          <div class="contact-bar">
            ${data.profile?.email ? `<span>✉️ ${data.profile.email}</span>` : ''}
            ${data.profile?.whatsapp ? `<span>📞 ${data.profile.whatsapp}</span>` : ''}
            ${data.profile?.location ? `<span>📍 ${data.profile.location}</span>` : ''}
            ${data.profile?.github ? `<span>🐙 github.com/${data.profile.github.replace(/^https?:\/\/github\.com\/?/i, '')}</span>` : ''}
          </div>
        </div>
        ${
          avatarUrl
            ? `<div style="width: 95px; height: 125px; border: 2px solid #111; overflow: hidden; background: #f3f4f6; flex-shrink: 0;">
                <img src="${avatarUrl}" alt="${profileName}" style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%);">
              </div>`
            : ''
        }
      </div>
    </div>

    <div class="section-title">Professional Summary</div>
    <p class="bio">${profileBio}</p>

    <div class="section-title">Core Skills & Technical Arsenal</div>
    ${skillsHtml}

    <div class="section-title">Selected Featured Projects</div>
    ${projectsHtml}

    ${milestonesHtml}

    <div style="margin-top: 20px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 10px; font-family: monospace; color: #9ca3af; display: flex; justify-content: space-between;">
      <span>Verified Portfolio CV — ${profileName}</span>
      <span>Document Format: A4 Standard • ATS Friendly</span>
    </div>
  </div>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${profileName.replace(/\s+/g, '_')}_A4.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e: any) {
      console.error('Failed to generate ATS download:', e);
      setPrintNotice('Gagal menyiapkan unduhan. Silakan coba tombol Cetak PDF.');
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="resume-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md resume-modal-backdrop print:p-0 print:m-0 print:static print:overflow-visible print:bg-white print:backdrop-blur-none"
      >
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 print:hidden cursor-pointer"
          aria-label="Tutup Pratinjau CV"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-4xl max-h-[94vh] flex flex-col rounded-2xl bg-[#090a0f] border border-white/10 shadow-2xl overflow-hidden resume-modal-window print:max-w-none print:max-h-none print:border-none print:bg-white print:text-black print:rounded-none print:shadow-none print:overflow-visible"
        >
          {/* Top Bar for Screen Preview (Hidden on Print) */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-3.5 border-b border-white/10 bg-[#0c0d12] shrink-0 resume-modal-topbar print:hidden">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-lg border ${accent.border} ${accent.bgMuted}`}>
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                  <span>Curriculum Vitae / Resume A4</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.04] text-neutral-300">
                    A4 ATS-Ready
                  </span>
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Format dokumen standar yang siap diunduh sebagai PDF langsung atau dicetak.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* External file link if provided in admin */}
              {customResumeUrl && (
                <a
                  href={customResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-mono text-amber-300 transition-all cursor-pointer"
                  title="Buka atau unduh file CV asli (Google Drive / Canva / Cloud)"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>Buka File Asli</span>
                </a>
              )}

              {/* 1-Click Direct PDF Generation */}
              <button
                type="button"
                onClick={handleDirectPdfDownload}
                disabled={isGeneratingPdf}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl ${accent.bg} text-black font-semibold text-xs font-mono transition-all hover:opacity-90 shadow-md cursor-pointer disabled:opacity-50`}
                title="Unduh file dokumen .pdf langsung tanpa perlu setting browser"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Merender PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-black" />
                    <span>Unduh PDF (.pdf)</span>
                  </>
                )}
              </button>

              {/* Direct ATS HTML download button */}
              <button
                type="button"
                onClick={handleDownloadATS}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-mono transition-all cursor-pointer"
                title="Unduh file HTML ATS mandiri dengan panduan cetak"
              >
                {downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Unduh File HTML</span>
                  </>
                )}
              </button>

              {/* Print / Save PDF browser dialog */}
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white text-xs font-mono transition-all cursor-pointer"
                title="Buka dialog cetak browser (Ctrl + P)"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cetak Browser</span>
              </button>

              {/* Help Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPrintGuide(!showPrintGuide)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  showPrintGuide 
                    ? 'border-amber-400/40 bg-amber-400/10 text-amber-300' 
                    : 'border-white/10 text-neutral-400 hover:text-white'
                }`}
                title="Panduan agar PDF presisi 1 halaman"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all cursor-pointer ml-1"
                title="Tutup Pratinjau (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Explanation: Why browser print can be distorted and how to fix it */}
          {showPrintGuide && (
            <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 text-xs font-mono text-neutral-200 print:hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Kenapa saat disimpan ke PDF di browser hasilnya bisa bergeser atau 2 halaman?</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    Browser (Chrome/Edge) secara bawaan menambahkan <strong>"Margin Default" (1.5 cm)</strong> di sekeliling kertas sehingga dokumen tertekan ke bawah.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div className="p-2 rounded bg-black/40 border border-white/10">
                      <span className="text-amber-300 font-bold block">1. Atur Margins:</span>
                      <span>Ubah dari <em>Default</em> ke <strong>"Tidak ada" (None)</strong>.</span>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-white/10">
                      <span className="text-amber-300 font-bold block">2. Grafik Latar:</span>
                      <span>Centang <strong>"Grafik latar belakang"</strong> agar foto tajam.</span>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-white/10">
                      <span className="text-amber-300 font-bold block">3. Opsi Paling Mudah:</span>
                      <span>Gunakan tombol emas <strong>"Unduh PDF (.pdf)"</strong> di atas untuk unduhan instan tanpa setting manual!</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrintGuide(false)}
                  className="text-neutral-400 hover:text-white shrink-0 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Friendly alert if print notice is set */}
          {printNotice && (
            <div className="px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-xs font-mono text-amber-300 flex items-center justify-between gap-3 print:hidden">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{printNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setPrintNotice(null)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                Tutup
              </button>
            </div>
          )}

          {/* Workbench Canvas Background */}
          <div className="overflow-y-auto p-3 sm:p-8 bg-[#13141c] flex justify-center print:p-0 print:bg-white print:overflow-visible">
            {/* The Authentic Physical A4 Paper Sheet (Attached to Ref for direct PDF rendering) */}
            <div 
              ref={resumeRef}
              className="resume-a4-sheet w-full max-w-[794px] bg-white text-neutral-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] border border-neutral-300/80 p-6 sm:p-10 md:p-12 space-y-6 rounded-sm print:shadow-none print:border-none print:p-0 print:max-w-none font-sans"
            >
              {/* 1. Resume Header with Optional Professional Photo */}
              <div className="border-b-2 border-neutral-900 pb-5 print-avoid-break">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                  {/* Text details */}
                  <div className="space-y-2 flex-1">
                    <div className="space-y-1">
                      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
                        {profileName.toUpperCase()}
                      </h1>
                      <div className="text-xs sm:text-sm font-bold tracking-wider text-neutral-700 uppercase font-mono">
                        {profileProfession}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal max-w-xl">
                      {profileHeadline}
                    </p>

                    {/* Contact Strip */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-neutral-700 pt-2 font-mono">
                      {data.profile?.email && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                          <span>{data.profile.email}</span>
                        </span>
                      )}
                      {data.profile?.whatsapp && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                          <span>{data.profile.whatsapp}</span>
                        </span>
                      )}
                      {data.profile?.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                          <span>{data.profile.location}</span>
                        </span>
                      )}
                      {data.profile?.github && (
                        <span className="flex items-center gap-1.5">
                          <Github className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                          <span>github.com/{data.profile.github.replace(/^https?:\/\/github\.com\/?/i, '')}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Professional Portrait Photo */}
                  {avatarUrl && (
                    <div className="shrink-0 self-center sm:self-start">
                      <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-sm border-2 border-neutral-900 overflow-hidden shadow-sm bg-neutral-100">
                        <img
                          src={avatarUrl}
                          alt={profileName}
                          className="w-full h-full object-cover grayscale contrast-125"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="block text-[9px] font-mono text-center text-neutral-500 pt-1 uppercase tracking-wider">
                        Official Portrait
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Professional Summary */}
              <div className="space-y-2 print-avoid-break">
                <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-900 border-b border-neutral-300 pb-1">
                  Professional Summary
                </h2>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed text-justify">
                  {profileBio}
                </p>
              </div>

              {/* 3. Core Competencies & Skills */}
              <div className="space-y-3 print-avoid-break">
                <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-900 border-b border-neutral-300 pb-1">
                  Core Skills & Technical Arsenal
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-neutral-900 block mb-1 font-mono">
                      // Frontend & Web
                    </span>
                    <ul className="space-y-1 text-neutral-700">
                      {(coreWebSkills.length > 0 ? coreWebSkills : allSkills.slice(0, 4)).map((s, idx) => (
                        <li key={`${s.id}-${idx}`} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
                          <span>{s.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-neutral-900 block mb-1 font-mono">
                      {middleSkillLabel}
                    </span>
                    <ul className="space-y-1 text-neutral-700">
                      {(middleSkills.length > 0 ? middleSkills : allSkills.slice(4, 8)).map((s, idx) => (
                        <li key={`${s.id}-${idx}`} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
                          <span>{s.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-neutral-900 block mb-1 font-mono">
                      // Tools & Workflow
                    </span>
                    <ul className="space-y-1 text-neutral-700">
                      {(toolSkills.length > 0 ? toolSkills : allSkills.slice(8, 12)).map((s, idx) => (
                        <li key={`${s.id}-${idx}`} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
                          <span>{s.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 4. Featured Works & Projects */}
              <div className="space-y-3.5 print-avoid-break">
                <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-900 border-b border-neutral-300 pb-1 flex items-center justify-between">
                  <span>Selected Featured Projects</span>
                  <span className="text-[10px] text-neutral-500 font-normal font-mono">
                    {allProjects.length} Total Projects Cataloged
                  </span>
                </h2>

                <div className="space-y-3">
                  {activeProjects.map((proj, idx) => {
                    const stackString = Array.isArray(proj.techStack)
                      ? proj.techStack.join(', ')
                      : typeof proj.techStack === 'string'
                      ? proj.techStack
                      : 'React, Tailwind CSS';

                    return (
                      <div key={`${proj.id}-${idx}`} className="space-y-1 border-b border-neutral-100 pb-2.5 last:border-b-0 print-avoid-break">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <span className="text-sm font-bold text-neutral-900">
                            {proj.title}
                          </span>
                          <span className="text-[11px] font-mono text-neutral-600">
                            {proj.category} • {proj.year}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-700 leading-relaxed">
                          {proj.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-neutral-600 pt-0.5">
                          <span>
                            <strong>Stack:</strong> {stackString}
                          </span>
                          {proj.liveDemoUrl && (
                            <span className="text-neutral-900 underline truncate max-w-xs">
                              Live: {proj.liveDemoUrl}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Continuous Learning Commitments */}
              {Array.isArray(data.about?.milestones) && data.about.milestones.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-neutral-200 print-avoid-break">
                  <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-900">
                    Continuous Growth & Focus Areas
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-700">
                    {data.about.milestones.map((m, idx) => (
                      <div key={idx} className="border-l-2 border-neutral-900 pl-2 space-y-0.5">
                        <span className="font-bold text-neutral-900 block font-mono text-[11px]">
                          {m.title}
                        </span>
                        <p className="text-[11px] text-neutral-600 leading-tight">
                          {m.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Footnote */}
              <div className="text-[10px] font-mono text-neutral-400 pt-3 border-t border-neutral-200 flex justify-between items-center print-avoid-break">
                <span>Verified Studio Portfolio Sheet — {profileName}</span>
                <span>Document Format: A4 Standard • ATS Friendly</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
