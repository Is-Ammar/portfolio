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
  category: 'Web' | 'System' | 'Infra' | 'Security' | 'Software Engineering' | 'Graphics & Simulation' | 'DevOps & Utilities';
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
