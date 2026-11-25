import { PortfolioData, ProjectCategory, AboutContent } from '../types';

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Web Development',
  'Digital Invitation',
  'Web Design',
  'Branding',
  'Graphic Design',
  'Other Projects',
];

export const PROJECT_STATUSES = [
  'Completed',
  'In Progress',
  'Prototype',
  'Concept',
] as const;

export const WORK_PROCESS_STEPS = [
  {
    number: '01',
    title: 'Concept',
    subtitle: 'Problem & Requirement',
    description: 'Memahami inti gagasan serta permasalahan klien atau pengguna, lalu merumuskan kebutuhan fitur dan alur kerja sistem yang tepat sebelum mulai menulis kode.',
  },
  {
    number: '02',
    title: 'Planning & UI',
    subtitle: 'Structure & Layout',
    description: 'Merancang struktur data dan tata letak antarmuka yang sederhana, rapi, serta mudah digunakan dengan dukungan referensi desain dan AI tools.',
  },
  {
    number: '03',
    title: 'Development',
    subtitle: 'Build & Integration',
    description: 'Membangun tampilan menggunakan HTML dan Tailwind CSS serta mengintegrasikan komponen React, logika aplikasi, dan database dengan alur kerja AI-assisted development sambil terus memperdalam pemahaman kode.',
  },
  {
    number: '04',
    title: 'Final Result',
    subtitle: 'Testing & Deployment',
    description: 'Menguji fungsi fitur dan tampilan responsif di berbagai ukuran layar, memperbaiki bug, serta melakukan deployment agar aplikasi siap digunakan.',
  },
];

export const CREATIVE_TOOLS = [
  {
    name: 'VS Code',
    role: 'Primary Code Editor',
    desc: 'Editor kode utama untuk menulis, membaca, dan merapikan struktur proyek web.',
  },
  {
    name: 'PHP & SQL',
    role: 'Backend & Database Basics',
    desc: 'Dasar pemrograman sisi server serta pengelolaan tabel dan query CRUD database relasional.',
  },
  {
    name: 'Tailwind CSS',
    role: 'Utility-First Styling',
    desc: 'Membantu menyusun tata letak antarmuka responsif dengan lebih cepat dan konsisten.',
  },
  {
    name: 'React & Vite',
    role: 'AI-Assisted Frontend Workflow',
    desc: 'Membangun antarmuka interaktif modern dengan bantuan AI tools sambil mempelajari alur komponennya.',
  },
  {
    name: 'Git & GitHub',
    role: 'Version Control & Repositories',
    desc: 'Menyimpan riwayat kode proyek dan mempersiapkan proses deployment online.',
  },
  {
    name: 'Supabase & DevTools',
    role: 'Cloud Data & Debugging',
    desc: 'Eksplorasi dasar autentikasi/database cloud serta inspeksi layout dan error di browser.',
  },
];

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  badge: 'Profile & Ethos',
  title: 'Membangun Solusi Web yang Fungsional & Terstruktur',
  bioParagraph1:
    'Halo, saya Fadiyel — seorang pembelajar aktif di bidang Full Stack Web Development. Saya membangun website portofolio ini untuk mendokumentasikan proyek serta perkembangan nyata saya dalam merancang antarmuka web hingga pengelolaan data.',
  bioParagraph2:
    'Prinsip utama saya adalah kejujuran kompetensi dan kemauan belajar: saya telah mempelajari dasar HTML, CSS, JavaScript dasar, PHP, serta SQL, dan terus mengasahnya lewat proyek nyata bersama Tailwind CSS, Supabase dasar, serta alur kerja React yang dibantu AI. Tidak ada klaim berlebihan—setiap proyek di sini adalah langkah konkret dalam mempersiapkan diri untuk dunia kerja dan magang IT.',
  skillsTitle: 'Keahlian & Teknologi',
  skillsDescription:
    'Daftar keahlian dasar hingga lanjutan yang saya pelajari, latih, dan terapkan pada proyek-proyek nyata.',
  milestones: [
    {
      title: '1. Pendalaman Backend & Database (PHP & SQL)',
      description:
        'Memperkuat pemahaman logika server-side menggunakan PHP, struktur tabel relasional, serta query SQL (CRUD) untuk membangun aplikasi web fungsional.',
    },
    {
      title: '2. Pengembangan Web Modern & UI Responsif',
      description:
        'Melatih penggunaan HTML, Tailwind CSS, dan JavaScript dasar agar antarmuka web tetap rapi, ringan, dan nyaman digunakan di perangkat mobile maupun desktop.',
    },
    {
      title: '3. Proyek Nyata & Kesiapan Magang',
      description:
        'Membangun studi kasus nyata seperti web profil, katalog, dan sistem pencatatan/kasir sederhana dengan bantuan AI tools sambil memahami setiap alur kodenya.',
    },
  ],
  processSteps: WORK_PROCESS_STEPS,
  tools: CREATIVE_TOOLS,
  previewBadge: '01 // Profil Singkat',
  previewTitle: 'Fokus & Perkembangan',
  previewParagraph1:
    'Sebagai calon Full Stack Web Developer yang sedang menyiapkan diri untuk magang, saya mengutamakan kejujuran karya: fokus membangun aplikasi web yang jelas alurnya, responsif, dan terhubung dengan database.',
  previewParagraph2:
    'Berbekal fondasi HTML, CSS, JavaScript dasar, PHP, dan SQL—serta eksplorasi Tailwind CSS, Supabase, dan AI-assisted workflow—setiap proyek menjadi sarana belajar langsung dari kebutuhan nyata.',
  selectedWorksBadge: '02 // Selected Archive',
  selectedWorksTitle: 'Karya Pilihan',
  selectedWorksDescription:
    'Koleksi proyek web terpilih yang mencerminkan proses belajar pengembangan antarmuka responsif dan struktur kode yang rapi.',
  selectedWorksButtonText: 'View All Works',
  worksBadge: 'Project Directory & Archive',
  worksTitle: 'Selected Works',
  worksDescription:
    'Kumpulan proyek pengembangan website, aplikasi web, dan undangan digital yang dibangun sebagai bagian dari eksplorasi dan latihan nyata.',
  contactBadge: 'Connect & Inquire',
  contactTitle: "Let's Work Together",
  contactDescription:
    'Terbuka untuk kesempatan magang, diskusi pengembangan website sederhana, atau kolaborasi proyek web bersama.',
  collabBadge: 'Open for Internship & Projects',
  collabTitle: '“Open to learning, internship opportunities, and meaningful web projects.”',
  collabDescription:
    'Terbuka untuk peluang magang Web Developer / Full Stack serta diskusi pembuatan website portofolio, landing page, atau aplikasi web sederhana.',
  collabButtonText: 'Kirim Pesan / Diskusi',
};

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: 'Fadiyel',
    profession: 'Junior Full Stack Web Developer',
    headline: 'Membangun Aplikasi Web yang Fungsional, Rapi, dan Siap Digunakan.',
    bio: 'Saya adalah pembelajar aktif di bidang Full Stack Web Development yang fokus membangun aplikasi web terstruktur—mulai dari antarmuka responsif hingga pengolahan data dan database. Memiliki dasar HTML, CSS, JavaScript dasar, PHP, dan SQL, serta memanfaatkan Tailwind CSS, Supabase dasar, dan AI-assisted workflow untuk mempercepat pengembangan proyek.',
    tagline: 'Full Stack Web Development',
    location: 'Indonesia',
    email: 'fadiyel.studio@gmail.com',
    whatsapp: '+6281234567890',
    instagram: 'fadiyel.id',
    github: 'fadiyel',
    statusText: 'Open to Internship & Web Development Projects',
    avatarUrl: '',
    resumeUrl: '',
  },
  projects: [
    {
      id: 'proj-1',
      order: 1,
      title: 'Elegant Romantic Wedding Invitation',
      category: 'Digital Invitation',
      year: '2025',
      status: 'Completed',
      description: 'Konsep undangan pernikahan digital bernuansa romantis dengan tipografi klasik, palet warna hangat bernuansa champagne-gold, countdown interaktif, dan navigasi RSVP yang halus.',
      techStack: ['HTML', 'Tailwind CSS', 'JavaScript', 'React'],
      features: ['Countdown Hari Bahagia', 'Navigasi RSVP Interaktif', 'Integrasi Google Maps Lokasi', 'Musik Latar Lembut'],
      liveDemoUrl: 'https://demo.fadiyel.studio/romantic-invitation',
      sourceCodeUrl: 'https://github.com/fadiyel/romantic-wedding-invitation',
      featured: true,
      active: true,
    },
    {
      id: 'proj-2',
      order: 2,
      title: 'Botanical Minimalist Wedding Invitation',
      category: 'Digital Invitation',
      year: '2025',
      status: 'Completed',
      description: 'Undangan digital bertema floral botani dengan estetika minimalis, palet warna sage green lembut, dan tata letak responsif ramah smartphone.',
      techStack: ['HTML', 'CSS', 'JavaScript'],
      features: ['Tata Letak Minimalis', 'Tipografi Organik', 'Amplop Digital / Rekening Hadiah', 'Optimal untuk Smartphone'],
      liveDemoUrl: 'https://demo.fadiyel.studio/botanical-invitation',
      sourceCodeUrl: 'https://github.com/fadiyel/botanical-wedding-invitation',
      featured: true,
      active: true,
    },
    {
      id: 'proj-3',
      order: 3,
      title: 'Modern Editorial Wedding Invitation',
      category: 'Digital Invitation',
      year: '2025',
      status: 'In Progress',
      description: 'Eksperimen tata letak editorial modern dengan tipografi kontras tinggi, galeri foto grid responsif, dan transisi halaman yang halus.',
      techStack: ['HTML', 'Tailwind CSS', 'Web Development'],
      features: ['Editorial Layout', 'Galeri Grid Responsif', 'Story Timeline Love Journey'],
      liveDemoUrl: 'https://demo.fadiyel.studio/editorial-invitation',
      sourceCodeUrl: 'https://github.com/fadiyel/editorial-wedding-invitation',
      featured: true,
      active: true,
    },
  ],
  skills: [
    {
      id: 'skill-1',
      name: 'HTML',
      category: 'Core Web',
      description: 'Struktur semantik dokumen web, elemen formulir, dan dasar metadata halaman.',
      level: 'Dasar Terkuasai',
    },
    {
      id: 'skill-2',
      name: 'CSS & Tailwind CSS',
      category: 'Core Web',
      description: 'Flexbox, CSS Grid, layout responsif multi-perangkat, serta styling cepat dengan Tailwind CSS.',
      level: 'Pengembangan Aktif',
    },
    {
      id: 'skill-3',
      name: 'JavaScript Dasar',
      category: 'Core Web',
      description: 'Manipulasi DOM, event handling dasar, dan logika interaktivitas halaman web.',
      level: 'Dasar Terkuasai',
    },
    {
      id: 'skill-4',
      name: 'PHP',
      category: 'Backend & Database',
      description: 'Dasar pemrograman sisi server, pemrosesan form, dan logika backend sederhana.',
      level: 'Dasar Terkuasai',
    },
    {
      id: 'skill-5',
      name: 'SQL',
      category: 'Backend & Database',
      description: 'Perancangan tabel dasar serta query CRUD (SELECT, INSERT, UPDATE, DELETE) pada database relasional.',
      level: 'Dasar Terkuasai',
    },
    {
      id: 'skill-6',
      name: 'Supabase',
      category: 'Backend & Database',
      description: 'Penggunaan dasar autentikasi admin dan penyimpanan data cloud untuk proyek web.',
      level: 'Tahap Eksplorasi',
    },
    {
      id: 'skill-7',
      name: 'Git & GitHub',
      category: 'Tools & Workflow',
      description: 'Pengelolaan riwayat kode dasar, penyimpanan repositori proyek, dan workflow deployment.',
      level: 'Pengembangan Aktif',
    },
    {
      id: 'skill-8',
      name: 'AI-Assisted Dev',
      category: 'Tools & Workflow',
      description: 'Memanfaatkan AI tools untuk membantu membangun antarmuka React/Tailwind dan debugging sambil mempelajari konsep kodenya.',
      level: 'Workflow Harian',
    },
  ],
  settings: {
    accentColor: 'gold',
    heroCtaText: 'Explore My Work',
    showSkillsPreview: false,
    showCollaborationSection: true,
    openingScreenEnabled: true,
    fontTheme: 'aerospace-rajdhani',
  },
  messages: [],
  about: DEFAULT_ABOUT_CONTENT,
};
