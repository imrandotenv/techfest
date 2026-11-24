/**
 * Centralized Legal & Privacy Configuration for SETTech
 * Tailored for SETGOI School of Engineering (B.Tech) & MAKAUT Academic Portal
 *
 * NOTE FOR AI AGENTS & DEVELOPERS:
 * When adding new third-party APIs, data stores (e.g., Prisma/Neon), analytics,
 * cookies, or localStorage keys in future updates, update this file so that all
 * legal pages (/privacy, /terms, /cookies, /disclaimer) reflect current practices.
 */

export interface ThirdPartyProcessor {
  id: string;
  name: string;
  provider: string;
  category: 'Authentication' | 'AI & Machine Learning' | 'Speech Processing' | 'Database & Storage' | 'Academic Network';
  purpose: string;
  dataProcessed: string;
  retention: string;
  privacyUrl: string;
  location: string;
}

export interface StorageItem {
  id: string;
  name: string;
  type: 'cookie' | 'localStorage' | 'sessionStorage';
  category: 'strictly_necessary' | 'functional' | 'preferences';
  provider: string;
  purpose: string;
  duration: string;
  defaultStatus: 'Mandatory' | 'Optional';
}

export interface LegalConfig {
  platformName: string;
  tagline: string;
  scope: string;
  contactEmail: string;
  grievanceEmail: string;
  grievanceOfficer: {
    title: string;
    desk: string;
    address: string;
  };
  policyVersion: string;
  lastUpdated: string;
  governingLaw: string;
  processors: ThirdPartyProcessor[];
  storageItems: StorageItem[];
}

export const LEGAL_CONFIG: LegalConfig = {
  platformName: 'SETTech',
  tagline: 'Engineer-First Academic Platform for SETGOI B.Tech Students',
  scope: 'Independent Student-Led Academic Platform — Not an Official College or MAKAUT Administration Portal',
  contactEmail: 'legal@settech.dev',
  grievanceEmail: 'grievance@settech.dev',
  grievanceOfficer: {
    title: 'Grievance Redressal Officer (Student Portal)',
    desk: 'SETTech Engineering Desk',
    address: 'SETGOI Campus, Malandighi, Durgapur, Paschim Bardhaman, West Bengal 713212, India',
  },
  policyVersion: '1.4.0',
  lastUpdated: 'November 24, 2026',
  governingLaw: 'Information Technology Act, 2000 & Digital Personal Data Protection (DPDP) Act, 2023 of the Republic of India',

  processors: [
    {
      id: 'clerk-auth',
      name: 'Clerk Auth',
      provider: 'Clerk, Inc.',
      category: 'Authentication',
      purpose: 'User authentication, session token generation, role verification (STUDENT, FACULTY, ADMIN), and multi-factor security.',
      dataProcessed: 'Institutional/personal email address, student/faculty name, IP address, user agent, secure session tokens.',
      retention: 'Duration of account activity; deleted upon user account deletion request.',
      privacyUrl: 'https://clerk.com/legal/privacy',
      location: 'United States & Global Edge CDN',
    },
    {
      id: 'neon-cloud',
      name: 'Neon Cloud (PostgreSQL & Object Storage via S3 API)',
      provider: 'Neon, Inc.',
      category: 'Database & Storage',
      purpose: 'Persistent cloud PostgreSQL database and S3-compatible Object Storage storing B.Tech academic profiles (branch, semester, passout year, roll number), user onboarding states, MAKAUT PDF lecture notes/lab manuals, student forum threads, and account-wise AI Viva chat transcripts.',
      dataProcessed: 'Clerk User ID, institutional/personal email address, full student name, B.Tech engineering branch, semester, graduation passout year, MAKAUT university roll number, uploaded PDF notes, campus forum discussions, and AI Viva practice transcripts.',
      retention: 'Retained for active student account lifecycle; erased upon student deletion request under DPDP Act 2023.',
      privacyUrl: 'https://neon.tech/privacy-policy',
      location: 'AWS Cloud Infrastructure (Asia-South / ap-southeast-1 Global High-Availability)',
    },
    {
      id: 'groq-whisper',
      name: 'Groq Whisper API (whisper-large-v3-turbo)',
      provider: 'Groq, Inc.',
      category: 'Speech Processing',
      purpose: 'Ultra-accurate voice-to-text transcription of student oral viva answers in English and Hinglish.',
      dataProcessed: 'Recorded student audio stream sent ephemerally for instant transcription. Zero audio bytes or voice recordings are retained or stored on servers after transcription.',
      retention: '0-day retention; discarded immediately after returning transcript.',
      privacyUrl: 'https://groq.com/privacy-policy/',
      location: 'United States (Ultra-fast LPU Cloud)',
    },
    {
      id: 'groq-ai',
      name: 'Groq Inference Engine (Llama 3.3)',
      provider: 'Groq, Inc.',
      category: 'AI & Machine Learning',
      purpose: 'Ultra-low-latency oral viva question generation, real-time speech evaluation, and engineering feedback.',
      dataProcessed: 'Student technical answers, subject codes, practice difficulty tier, and interview transcripts. Processed ephemerally in-memory; not used to train public models.',
      retention: 'Ephemeral processing per session (0-day retention on inference endpoint).',
      privacyUrl: 'https://groq.com/privacy-policy/',
      location: 'United States (Ultra-fast LPU Cloud)',
    },
    {
      id: 'google-gemini',
      name: 'Google Gemini API (Gemini 2.5 Flash)',
      provider: 'Google LLC',
      category: 'AI & Machine Learning',
      purpose: 'Automatic fallback reasoning engine for complex academic explanations and conceptual viva breakdowns.',
      dataProcessed: 'Engineering query prompts, textbook reference concepts, and student question contexts.',
      retention: 'Transient processing via Google Cloud API under enterprise data governance.',
      privacyUrl: 'https://policies.google.com/privacy',
      location: 'Global Google Cloud Infrastructure',
    },
    {
      id: 'browser-web-speech',
      name: 'Browser Web Speech API',
      provider: 'Client-Side Web Browser Native Engine',
      category: 'Speech Processing',
      purpose: 'Speech-to-text viva voice input (SpeechRecognition) and real-time audio voice output (SpeechSynthesis).',
      dataProcessed: 'Audio input processed locally in-browser. Zero raw audio recordings are stored on or uploaded to SETTech backend servers.',
      retention: 'Real-time client memory only (cleared upon tab close).',
      privacyUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API',
      location: 'Local Student Device / Browser Engine',
    },
  ],

  storageItems: [
    {
      id: 'clerk-session',
      name: '__session',
      type: 'cookie',
      category: 'strictly_necessary',
      provider: 'Clerk Auth',
      purpose: 'Cryptographically signed JSON Web Token (JWT) identifying your active student/faculty login session.',
      duration: '1 Year (or until sign-out)',
      defaultStatus: 'Mandatory',
    },
    {
      id: 'clerk-client-uat',
      name: '__client_uat',
      type: 'cookie',
      category: 'strictly_necessary',
      provider: 'Clerk Auth',
      purpose: 'Unix timestamp marking when client authentication was last updated to ensure multi-tab freshness.',
      duration: '1 Year',
      defaultStatus: 'Mandatory',
    },
    {
      id: 'cookie-consent',
      name: 'settech_cookie_consent',
      type: 'localStorage',
      category: 'preferences',
      provider: 'SETTech',
      purpose: 'Saves your cookie consent selection ("all" or "essential") so the banner is not shown repeatedly.',
      duration: '180 Days / Persistent until cleared',
      defaultStatus: 'Optional',
    },
    {
      id: 'viva-free-count',
      name: 'settech_viva_free_count',
      type: 'localStorage',
      category: 'functional',
      provider: 'SETTech AI Viva',
      purpose: 'Remembers the 2 free practice viva question attempts for guest students before requiring Clerk sign-in.',
      duration: 'Persistent until browser cache reset',
      defaultStatus: 'Optional',
    },
    {
      id: 'exam-targets',
      name: 'settech_exam_targets',
      type: 'localStorage',
      category: 'functional',
      provider: 'SETTech Tools',
      purpose: 'Stores your custom countdown target dates for upcoming MAKAUT semester theory and lab/practical examinations.',
      duration: 'Persistent until manually changed',
      defaultStatus: 'Optional',
    },
    {
      id: 'preferred-role',
      name: 'settech_preferred_role',
      type: 'localStorage',
      category: 'functional',
      provider: 'SETTech RBAC',
      purpose: 'Caches your active workspace role view (Student/Faculty/Admin) for instantaneous UI rendering.',
      duration: 'Persistent until role switch',
      defaultStatus: 'Optional',
    },
  ],
};
