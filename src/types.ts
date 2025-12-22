export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  impact: string;
  tech: string[];
  link?: string;
  github?: string;
  featured: boolean;
  category: 'AI' | 'Web' | 'System' | 'Infra';
  imagePlaceholder?: string; // For visual variety
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Metric {
  label: string;
  value: string;
  suffix?: string;
}
