import { Project, Experience, Education, SkillCategory, Metric } from './types';

export const SOCIALS = {
  email: "eammarpro@gmail.com",
  github: "https://github.com/is-ammar",
  linkedin: "https://linkedin.com/in/is-ammar",
  resume: "/resume.pdf"
};

export const METRICS: Metric[] = [
  { label: "Inference Cost Reduction", value: "45", suffix: "%" },
  { label: "Retrieval Latency", value: "<1", suffix: "s" },
  { label: "Backend Perf Boost", value: "40", suffix: "%" },
  { label: "Client Satisfaction", value: "100", suffix: "%" },
];

export const SKILLS: SkillCategory[] = [
  {
    name: "AI & ML",
    skills: ["Python", "PyTorch", "LangChain", "RAG", "OpenAI API", "HuggingFace"]
  },
  {
    name: "Backend & Systems",
    skills: ["FastAPI", "Django", "Node.js", "NestJS", "PostgreSQL", "Redis", "MongoDB"]
  },
  {
    name: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "React Native", "Tailwind CSS"]
  },
  {
    name: "DevOps & Cloud",
    skills: ["AWS", "Docker", "Kubernetes", "Linux", "Git", "GitHub Actions"]
  }
];

export const EXPERIENCE: Experience[] = [
  {
    id: "exp-1",
    role: "Full-Stack & AI Engineer",
    company: "Freelance / Consultant",
    period: "2023 - Present",
    description: "Designing and shipping bespoke AI solutions for global clients. Specializing in RAG systems, process automation, and high-performance web applications."
  },
  {
    id: "exp-2",
    role: "Software Engineering Student",
    company: "1337 School (42 Network)",
    period: "2021 - Present",
    description: "Deep dive into low-level algorithms, system architecture, and peer-to-peer learning. Completed rigorous core curriculum in C/C++ and web technologies."
  }
];

export const EDUCATION: Education[] = [
  {
    id: "edu-1",
    degree: "Software Engineering",
    school: "1337 School (42 Network)",
    year: "2021 - Present"
  },
  {
    id: "edu-2",
    degree: "Economics and Management",
    school: "University Hassan I",
    year: "2019 - 2021"
  },
  {
    id: "edu-3",
    degree: "High School Diploma",
    school: "Scientific Stream",
    year: "2019"
  }
];

export const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Enterprise RAG Pipeline",
    description: "A scalable Retrieval-Augmented Generation system for a legal firm, indexing over 100k documents with sub-second retrieval.",
    role: "Lead Engineer",
    impact: "Reduced research time by 70%",
    tech: ["Python", "LangChain", "Pinecone", "FastAPI", "React"],
    featured: true,
    category: "AI",
    github: "https://github.com/is-ammar",
    link: "https://github.com/is-ammar"
  },
  {
    id: "p2",
    title: "Auto-MLOps Platform",
    description: "An orchestration platform for training and deploying custom vision models on edge devices automatically.",
    role: "Backend Architect",
    impact: "Cut deployment time from 2 days to 15 mins",
    tech: ["Kubernetes", "Docker", "Python", "Celery", "Redis"],
    featured: true,
    category: "Infra",
    github: "https://github.com/is-ammar"
  },
  {
    id: "p3",
    title: "Real-time Financial Dashboard",
    description: "High-frequency trading data visualization tool handling 50k+ websocket messages per second.",
    role: "Full-Stack Dev",
    impact: "Zero-latency rendering for 500+ active users",
    tech: ["Next.js", "WebSockets", "D3.js", "Go"],
    featured: true,
    category: "Web",
    github: "https://github.com/is-ammar"
  },
  {
    id: "p4",
    title: "Smart Inventory Tracker",
    description: "IoT-enabled inventory management system using Computer Vision for automated stock counting.",
    role: "AI Engineer",
    impact: "99% accuracy in stock tracking",
    tech: ["OpenCV", "Python", "Raspberry Pi", "React Native"],
    featured: false,
    category: "System",
    github: "https://github.com/is-ammar"
  },
  {
    id: "p5",
    title: "Legacy Code Migrator",
    description: "LLM-powered CLI tool to assist in migrating legacy PHP codebases to modern TypeScript.",
    role: "Solo Dev",
    impact: "Automated 40% of boilerplate conversion",
    tech: ["Node.js", "OpenAI API", "TypeScript"],
    featured: false,
    category: "AI",
    github: "https://github.com/is-ammar"
  },
  {
    id: "p6",
    title: "E-Commerce Microservices",
    description: "Scalable backend architecture for a multi-vendor marketplace.",
    role: "Backend Lead",
    impact: "Scales to 10k concurrent users",
    tech: ["NestJS", "RabbitMQ", "PostgreSQL"],
    featured: false,
    category: "System",
    github: "https://github.com/is-ammar"
  }
];
