export type AccentColor = 'gold' | 'blue' | 'emerald';

export type FontTheme = 
  | 'aerospace-rajdhani' 
  | 'cyber-orbitron' 
  | 'chakra-tech' 
  | 'tech-grotesk';

export type ProjectStatus = 'Completed' | 'In Progress' | 'Prototype' | 'Concept';

export type ProjectCategory = 
  | 'Web Development'
  | 'Website Development'
  | 'Digital Invitation'
  | 'Web Design'
  | 'Branding'
  | 'Graphic Design'
  | 'Other Projects';

export interface Project {
  id: string;
  order: number;
  title: string;
  category: ProjectCategory;
  year: string;
  description: string;
  techStack: string[];
  liveDemoUrl?: string;
  sourceCodeUrl?: string;
  featured: boolean;
  active: boolean;
  imageUrl?: string;
  gallery?: string[];
  status?: ProjectStatus;
  features?: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'Core Web' | 'Design & Visual' | 'Tools & Workflow';
  description: string;
  level?: string;
}

export interface ToolItem {
  name: string;
  category: string;
  description: string;
}

export interface Profile {
  name: string;
  profession: string;
  headline: string;
  bio: string;
  tagline: string;
  location: string;
  email: string;
  whatsapp: string;
  instagram: string;
  github: string;
  statusText: string;
  avatarUrl?: string;
  resumeUrl?: string;
}

export interface SiteSettings {
  accentColor: AccentColor;
  heroCtaText: string;
  showSkillsPreview: boolean;
  showCollaborationSection: boolean;
  openingScreenEnabled: boolean;
  openingStyle?: 'auto-reveal' | 'cinematic-screen' | 'clean';
  fontTheme?: FontTheme;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AboutMilestone {
  title: string;
  description: string;
}

export interface WorkProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface CreativeTool {
  name: string;
  role: string;
  desc: string;
}

export interface AboutContent {
  badge: string;
  title: string;
  bioParagraph1: string;
  bioParagraph2: string;
  skillsTitle: string;
  skillsDescription: string;
  milestones: AboutMilestone[];
  processSteps?: WorkProcessStep[];
  tools?: CreativeTool[];
  previewBadge?: string;
  previewTitle?: string;
  previewParagraph1?: string;
  previewParagraph2?: string;
  selectedWorksBadge?: string;
  selectedWorksTitle?: string;
  selectedWorksDescription?: string;
  selectedWorksButtonText?: string;
  worksBadge?: string;
  worksTitle?: string;
  worksDescription?: string;
  contactBadge?: string;
  contactTitle?: string;
  contactDescription?: string;
  collabBadge?: string;
  collabTitle?: string;
  collabDescription?: string;
  collabButtonText?: string;
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  settings: SiteSettings;
  messages: ContactMessage[];
  about?: AboutContent;
}

export type CloudSyncStatus = 'idle' | 'loading' | 'saving' | 'synced' | 'error' | 'not_seeded';
