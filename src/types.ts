export type ProjectCategory = 'ai' | 'systems' | 'security' | 'web';

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  context?: string;
  status?: string;
  featured?: boolean;
  description: string;
  tech: string[];
  categories: ProjectCategory[];
  links: ProjectLink[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights?: string[];
  tech?: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
  focus?: string;
  certifications?: string[];
}

export interface SkillCategory {
  name: string;
  skills: string[];
}
