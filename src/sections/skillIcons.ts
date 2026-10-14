import type { LucideIcon } from 'lucide-react';
import {
  Atom,
  Boxes,
  Bug,
  Code2,
  Container,
  Cpu,
  Database,
  FileSearch,
  Flag,
  GitBranch,
  Globe,
  Hammer,
  Layers,
  Network,
  Orbit,
  Paintbrush,
  Plug,
  Repeat,
  Route,
  Search,
  Server,
  Shield,
  ShieldCheck,
  Sigma,
  Terminal,
  Zap,
} from 'lucide-react';

export const SKILL_ICONS: Record<string, LucideIcon> = {
  Python: Terminal,
  FastAPI: Zap,
  Pydantic: ShieldCheck,
  SQLAlchemy: Layers,
  PostgreSQL: Database,
  pgvector: Orbit,
  'RAG / vector search': Search,
  'Ollama (local LLMs)': Cpu,
  'scikit-learn': Sigma,
  C: Terminal,
  'C++98': Terminal,
  Linux: Terminal,
  'POSIX sockets': Plug,
  'poll()': Repeat,
  pthreads: GitBranch,
  Docker: Container,
  'Docker Compose': Boxes,
  Nginx: Globe,
  Make: Hammer,
  Git: GitBranch,
  'Web security': Shield,
  'Bug bounty / CTF': Flag,
  DFIR: FileSearch,
  'Network protocols': Network,
  TypeScript: Code2,
  React: Atom,
  'Node.js': Server,
  Express: Route,
  MongoDB: Database,
  'Tailwind CSS': Paintbrush,
};

export const SKILL_FALLBACK_ICON: LucideIcon = Bug;

export type SkillTone = { icon: string; badge: string; label: string; glow: string };

export const SKILL_TONES: Record<string, SkillTone> = {
  'AI & Backend': {
    icon: 'text-accent-3',
    badge: 'border-accent-3/40 bg-accent-3/10',
    label: 'text-accent-3/80',
    glow: 'from-accent-3/30 via-transparent to-transparent',
  },
  'Systems & DevOps': {
    icon: 'text-accent',
    badge: 'border-accent/40 bg-accent/10',
    label: 'text-accent/80',
    glow: 'from-accent/30 via-transparent to-transparent',
  },
  Security: {
    icon: 'text-accent-2',
    badge: 'border-accent-2/40 bg-accent-2/10',
    label: 'text-accent-2/80',
    glow: 'from-accent-2/30 via-transparent to-transparent',
  },
  Web: {
    icon: 'text-text-strong',
    badge: 'border-line-strong/70 bg-bg/70',
    label: 'text-text-muted',
    glow: 'from-white/15 via-transparent to-transparent',
  },
};

export const DEFAULT_SKILL_TONE: SkillTone = {
  icon: 'text-text-strong',
  badge: 'border-line-strong/70 bg-bg/70',
  label: 'text-text-muted',
  glow: 'from-white/10 via-transparent to-transparent',
};

export const CARD_GLOWS = [
  'from-accent-3/20 via-transparent to-accent/20',
  'from-accent/25 via-transparent to-accent-2/20',
  'from-accent-2/20 via-transparent to-accent-3/20',
  'from-accent/25 via-transparent to-accent-3/15',
];
