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
    subtitle: 'Ideation & Exploration',
    description: 'Menemukan inti gagasan, merumuskan arah artistik, moodboard warna, dan menyelaraskan kebutuhan fungsional dengan visi visual yang ingin dicapai.',
  },
  {
    number: '02',
    title: 'Design',
    subtitle: 'Layout & Typography',
    description: 'Mendesain tata letak antarmuka, pemilihan pasangan tipografi, perancangan aset grafis vektor di Inkscape, serta penataan hierarki visual asimetris.',
  },
  {
    number: '03',
    title: 'Development',
    subtitle: 'Clean & Semantic Code',
    description: 'Menerjemahkan rancangan visual menjadi kode terstruktur dengan HTML, modern CSS / Tailwind, dan komponen React yang interaktif serta responsif.',
  },
  {
    number: '04',
    title: 'Final Result',
    subtitle: 'Refinement & Delivery',
    description: 'Pengujian performa pada berbagai ukuran layar ponsel, tablet, dan desktop, penyempurnaan transisi animasi halus, serta peluncuran karya digital.',
  },
];

export const CREATIVE_TOOLS = [
  {
    name: 'VS Code',
    role: 'Primary Code Editor',
    desc: 'Lingkungan pengembangan utama untuk penulisan kode terstruktur dan efisien.',
  },
  {
    name: 'Inkscape',
    role: 'Vector Graphic Suite',
    desc: 'Perangkat lunak open-source untuk pembuatan ilustrasi vektor, ikon, dan manipulasi SVG.',
  },
  {
    name: 'React & Vite',
    role: 'Frontend Framework & Bundler',
    desc: 'Ekosistem modern untuk membangun antarmuka web yang reaktif dan super cepat.',
  },
  {
    name: 'Tailwind CSS',
    role: 'Utility-first CSS Framework',
    desc: 'Merancang tata letak yang presisi, responsif, dan konsisten secara visual.',
  },
  {
    name: 'Git & GitHub',
    role: 'Version Control & Repositories',
    desc: 'Pengelolaan riwayat kode, dokumentasi proyek, dan kolaborasi terbuka.',
  },
  {
    name: 'Browser DevTools',
    role: 'Inspection & Performance Audit',
    desc: 'Analisis tata letak CSS, debugging responsivitas mobile, dan audit aksesibilitas.',
  },
];

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  badge: 'Profile & Ethos',
  title: 'Merajut Logika Kode & Keindahan Visual',
  bioParagraph1:
    'Halo, saya Fadiyel — seorang Web Developer, Web Designer, dan Visual Creator. Saya membangun portofolio ini sebagai studio kreatif pribadi untuk mendokumentasikan eksplorasi nyata saya dalam dunia desain antarmuka dan rekayasa web modern.',
  bioParagraph2:
    'Prinsip utama saya adalah transparansi dan integritas karya: saya sedang giat mengembangkan kemampuan dalam ekosistem frontend (HTML, CSS, JavaScript, React, Tailwind CSS) serta desain visual dan perancangan vektor di Inkscape. Tidak ada klaim berlebihan atas jam terbang puluhan tahun atau daftar klien fiktif — setiap kode dan aset yang Anda lihat di sini adalah hasil eksplorasi mandiri yang dirawat dengan teliti.',
  skillsTitle: 'Keahlian & Penguasaan',
  skillsDescription:
    'Daftar keahlian teknis dan artistik yang terus dilatih dan diterapkan pada proyek-proyek riil.',
  milestones: [
    {
      title: '1. Mastering Frontend Ecosystem',
      description:
        'Memperdalam TypeScript, state management lanjutan, arsitektur headless CMS, dan optimasi performa web.',
    },
    {
      title: '2. High-Fashion Digital Invitations',
      description:
        'Mengembangkan seri undangan pernikahan digital dengan tipografi editorial mewah, animasi musik latar yang halus, dan sistem RSVP mandiri.',
    },
    {
      title: '3. Creative Coding & SVG Art',
      description:
        'Mengeksplorasi pembuatan aset vektor interaktif di Inkscape yang dapat digerakkan secara dinamis dengan manipulasi path SVG dan Motion.',
    },
  ],
  processSteps: WORK_PROCESS_STEPS,
  tools: CREATIVE_TOOLS,
  previewBadge: '01 // Profil Singkat',
  previewTitle: 'Eksplorasi & Perkembangan',
  previewParagraph1:
    'Sebagai web developer dan visual designer yang sedang aktif membangun portofolio, saya tidak menggunakan klaim berlebihan mengenai ratusan klien fiktif. Fokus saya adalah kejujuran karya: membangun antarmuka web yang bersih, responsif, dan memiliki kedalaman estetika yang matang.',
  previewParagraph2:
    'Dari perancangan vektor di Inkscape hingga perakitan komponen interaktif dengan React dan Tailwind CSS, setiap proyek adalah langkah nyata dalam mengasah keterampilan teknis dan kepekaan desain.',
  selectedWorksBadge: '02 // Selected Archive',
  selectedWorksTitle: 'Karya Pilihan',
  selectedWorksDescription:
    'Koleksi proyek terpilih yang mencerminkan eksplorasi desain web responsif, antarmuka sinematik, dan rekayasa kode terstruktur.',
  selectedWorksButtonText: 'View All Works',
  worksBadge: 'Studio Directory & Gallery',
  worksTitle: 'Selected Works',
  worksDescription:
    'Kumpulan proyek pengembangan web, antarmuka modern, dan undangan digital terkurasi. Setiap karya dirancang dengan fokus pada ketelitian tata letak, kecepatan, dan estetika yang bermakna.',
  contactBadge: 'Connect & Inquire',
  contactTitle: "Let's Work Together",
  contactDescription:
    'Terbuka untuk diskusi proyek pembuatan website portofolio, undangan pernikahan digital bertema khusus, perancangan antarmuka, atau eksplorasi ide kreatif digital bersama.',
  collabBadge: "Let's Create Together",
  collabTitle: '“Open to learning, creative collaboration, and meaningful digital projects.”',
  collabDescription:
    'Membuka ruang diskusi untuk pembuatan website portofolio, undangan pernikahan digital bertema artistik, antarmuka web responsif, atau proyek kreatif visual.',
  collabButtonText: 'Kirim Pesan / Brief Proyek',
};

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: 'Fadiyel',
    profession: 'Web Developer • Designer • Digital Creator',
    headline: 'Membangun Pengalaman Digital yang Elegan, Sinematik, dan Bernyawa.',
    bio: 'Saya adalah kreator independen yang sedang aktif mendalami dan mengembangkan keahlian di bidang pengembangan web modern serta desain visual. Setiap karya difokuskan pada harmoni antara struktur kode yang rapi, tipografi presisi, dan estetika visual yang berkarakter.',
    tagline: 'Building Digital Experiences',
    location: 'Indonesia',
    email: 'fadiyel.studio@gmail.com',
    whatsapp: '+6281234567890',
    instagram: 'fadiyel.id',
    github: 'fadiyel',
    statusText: 'Open to Learning & Creative Projects',
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
      techStack: ['React', 'Tailwind CSS', 'UI Design', 'Motion'],
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
      description: 'Undangan digital bertema floral botani dengan estetika minimalis, palet warna sage green lembut, ilustrasi dedaunan vektor, dan tata letak responsif ramah smartphone.',
      techStack: ['HTML', 'CSS', 'JavaScript', 'Visual Design', 'Inkscape'],
      features: ['Ilustrasi Floral Vektor Presisi', 'Tipografi Organik', 'Amplop Digital / Rekening Hadiah', 'Optimal untuk Smartphone'],
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
      description: 'Eksperimen tata letak editorial modern layaknya majalah fashion mewah, tipografi kontras tinggi monokrom dengan aksen tipis, galeri foto grid asimetris, dan transisi elegan.',
      techStack: ['React', 'UI Design', 'Web Development'],
      features: ['Editorial High-Fashion Layout', 'Galeri Grid Dinamis', 'Story Timeline Love Journey'],
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
      description: 'Struktur semantik dokumen web, aksesibilitas dasar (a11y), dan metadata SEO.',
      level: 'Fondasi Kuat',
    },
    {
      id: 'skill-2',
      name: 'CSS',
      category: 'Core Web',
      description: 'Flexbox, CSS Grid, animasi keyframe halus, custom properties, dan styling responsif.',
      level: 'Fondasi Kuat',
    },
    {
      id: 'skill-3',
      name: 'JavaScript dasar',
      category: 'Core Web',
      description: 'Manipulasi DOM, asynchronous fetch, event handling interaktif, dan logika ES6+.',
      level: 'Pengembangan Aktif',
    },
    {
      id: 'skill-4',
      name: 'React',
      category: 'Core Web',
      description: 'Komponen fungsional, hooks (useState, useEffect, custom hooks), dan arsitektur SPA.',
      level: 'Pengembangan Aktif',
    },
    {
      id: 'skill-5',
      name: 'Web Development',
      category: 'Core Web',
      description: 'Membangun situs web cepat, responsif multi-device, dan optimasi performa render.',
      level: 'Fokus Utama',
    },
    {
      id: 'skill-6',
      name: 'UI Design',
      category: 'Design & Visual',
      description: 'Hirarki tipografi, komposisi asimetris, aturan margin dan padding matematis.',
      level: 'Eksplorasi Mendalam',
    },
    {
      id: 'skill-7',
      name: 'Visual Design',
      category: 'Design & Visual',
      description: 'Harmoni warna, pencahayaan sinematik, estetika editorial, dan moodboard digital.',
      level: 'Eksplorasi Mendalam',
    },
    {
      id: 'skill-8',
      name: 'Inkscape',
      category: 'Tools & Workflow',
      description: 'Pembuatan aset grafis berbasis vektor, ikon kustom, manipulasi path SVG, dan elemen ilustrasi.',
      level: 'Desain Vektor',
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
