import { Project, ProjectCategory, Experience, Education, SkillCategory } from './types';

export const SOCIALS = {
  email: "eammarpro@gmail.com",
  github: "https://github.com/is-ammar",
  linkedin: "https://linkedin.com/in/is-ammar",
  resume: "/resume.pdf"
};

export const SKILLS: SkillCategory[] = [
  {
    name: "AI & Backend",
    skills: [
      "Python",
      "FastAPI",
      "Pydantic",
      "SQLAlchemy",
      "PostgreSQL",
      "pgvector",
      "RAG / vector search",
      "Ollama (local LLMs)",
      "scikit-learn"
    ]
  },
  {
    name: "Systems & DevOps",
    skills: [
      "C",
      "C++98",
      "Linux",
      "POSIX sockets",
      "poll()",
      "pthreads",
      "Docker",
      "Docker Compose",
      "Nginx",
      "Make",
      "Git"
    ]
  },
  {
    name: "Security",
    skills: ["Web security", "Bug bounty / CTF", "DFIR", "Network protocols"]
  },
  {
    name: "Web",
    skills: ["TypeScript", "React", "Node.js", "Express", "MongoDB", "Tailwind CSS"]
  }
];

export const EXPERIENCE: Experience[] = [
  {
    id: "exp-1337",
    role: "Software Engineering Student",
    company: "1337 School (42 Network)",
    period: "2024 - Present",
    description: "Project-based school with no classes and no teachers. You learn by building things and having other students review your code.",
    highlights: [
      "Wrote a Unix shell (minishell), a ray tracer (miniRT) and a dining philosophers simulation in C.",
      "Wrote an IRC server in C++98 with non-blocking sockets and a poll() event loop, in a team of three.",
      "Currently working with my team on ft_transcendence, a bug bounty platform with an AI triage service."
    ],
    tech: ["C", "C++98", "Python", "Unix API", "Docker"]
  },
  {
    id: "exp-m4sec",
    role: "Board Member, Recruiter, Web & DFIR Player",
    company: "M4SEC Team",
    period: "2024 - Present",
    description: "Academic CTF team of 1337 Coding School in Rabat (UM6P / 42 Network). I sit on the board, run recruiting, and play the web security and DFIR categories.",
    highlights: [
      "Ranked #1 in Morocco for the 2025 season and #135 worldwide on CTFtime (late 2025).",
      "Top 10 finishes include CyberSphere CTF (1st, 2024), L3akCTF (4th, 2024), DeadSec CTF (5th, 2024), RSTCON CTF (4th, 2025) and FortID CTF (6th, 2025).",
      "Run recruiting and onboarding, and help new players pick a category and get better at it."
    ],
    tech: ["Web Security", "DFIR", "Linux", "Networking"]
  },
  {
    id: "exp-freelance",
    role: "Freelance Developer (Web & Security)",
    company: "Freelance",
    period: "2025 - Present",
    description: "I build web apps and APIs for clients, and review the security of what they already run.",
    highlights: [
      "Build APIs with authentication, rate limiting and audit logging set up from the start.",
      "Build React and TypeScript frontends on top of Node.js and PostgreSQL backends, with monitoring in place.",
      "Help clients triage vulnerabilities and review the security of their existing apps."
    ],
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL", "Linux"]
  },
  {
    id: "exp-navy-lead",
    role: "Navigation Systems Lead",
    company: "Royal Moroccan Navy",
    period: "2022 - 2024",
    description: "Ran shipboard navigation systems and their real-time telemetry.",
    highlights: [
      "Kept the network of navigation sensors at 99.9% uptime at sea.",
      "Led small teams during high-precision maneuvers.",
      "Diagnosed hardware and software faults on running systems."
    ],
    tech: ["Systems Monitoring", "Incident Response", "Real-time Telemetry", "Navigation Software"]
  },
  {
    id: "exp-navy-intern",
    role: "Technical Analyst (Intern)",
    company: "Royal Moroccan Navy",
    period: "2020 - 2022",
    description: "Maintained and calibrated integrated bridge systems and their telemetry.",
    highlights: [
      "Analyzed telemetry data to correct operational trajectories.",
      "Worked on both the hardware and the software side during maintenance.",
      "Kept technical documentation in line with international maritime regulations."
    ],
    tech: ["Data Analysis", "Integrated Systems", "Compliance"]
  }
];

export const EDUCATION: Education[] = [
  {
    id: "edu-1",
    degree: "Software Engineering",
    school: "1337 School (42 Network)",
    year: "2024 - Present",
    focus: "C, C++98, Unix system calls, networking, Docker, and peer code review."
  },
  {
    id: "edu-2",
    degree: "Maritime Professional Certifications",
    school: "Royal Moroccan Navy Training Center",
    year: "2020 - 2023",
    focus: "Navigation and maritime technical training.",
    certifications: [
      "Brevet Élémentaire en Navigation (B.E)",
      "Certificat Maritime Militaire (Military Maritime Qualification)",
      "Certificat de Spécialité Maritime (Specialized Technical Training)"
    ]
  },
  {
    id: "edu-3",
    degree: "Economics and Management",
    school: "Hassan First University",
    year: "2019 - 2021",
    focus: "Economics, statistics and management courses."
  },
  {
    id: "edu-4",
    degree: "High School Diploma",
    school: "Scientific Stream",
    year: "2019"
  }
];

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  ai: "AI & Backend",
  systems: "C/C++ & Systems",
  security: "Security",
  web: "Web"
};

export const PROJECTS: Project[] = [
  {
    id: "ft-transcendence",
    title: "ft_transcendence",
    featured: true,
    context: "1337 team project",
    status: "In progress",
    description: "Bug bounty platform where companies publish programs and researchers submit vulnerability reports. An AI service finds duplicate reports with vector search and suggests a triage and severity using local LLMs.",
    tech: ["Python", "FastAPI", "PostgreSQL", "pgvector", "Ollama", "Docker"],
    categories: ["ai"],
    links: [{ label: "GitHub", href: "https://github.com/yel-alja/FT_TRANSCENDENCE" }]
  },
  {
    id: "bioguide",
    title: "BioGuide",
    featured: true,
    context: "NASA Space Apps Challenge 2025",
    description: "Web app for exploring NASA space biology research, with search across publications, data dashboards and an AI chat assistant.",
    tech: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "D3.js"],
    categories: ["ai", "web"],
    links: [{ label: "GitHub", href: "https://github.com/Is-Ammar/BioGuide" }]
  },
  {
    id: "navguard",
    title: "NavGuard",
    featured: true,
    context: "Maritime security",
    description: "Anomaly detection for ship networks. It watches GPS, AIS and engine control traffic and combines machine learning with rules to spot spoofing and tampering.",
    tech: ["Python", "scikit-learn", "PyTorch", "Dash", "Docker"],
    categories: ["ai", "security"],
    links: [{ label: "GitHub", href: "https://github.com/Is-Ammar/navguard" }]
  },
  {
    id: "ft-irc",
    title: "ft_irc",
    featured: true,
    context: "1337 team project",
    description: "IRC server in C++98 that works with standard IRC clients. It handles many connections in a single thread with non-blocking sockets and poll().",
    tech: ["C++98", "Sockets", "poll()", "TCP"],
    categories: ["systems"],
    links: [{ label: "GitHub", href: "https://github.com/Is-Ammar/ft_irc" }]
  },
  {
    id: "minishell",
    title: "Minishell",
    context: "1337 team project",
    description: "A small Bash-like shell in C with pipes, redirections, heredocs, && and ||, subshells and wildcards.",
    tech: ["C", "Unix API", "Processes", "Signals"],
    categories: ["systems"],
    links: [{ label: "GitHub", href: "https://github.com/Is-Ammar/MINI-SHELL" }]
  },
  {
    id: "inception",
    title: "Inception",
    context: "1337 project",
    description: "A WordPress stack (Nginx, PHP-FPM and MariaDB) running in Docker Compose, with every image built from scratch on Debian and HTTPS only.",
    tech: ["Docker", "Docker Compose", "Nginx", "MariaDB"],
    categories: ["systems"],
    links: [{ label: "GitHub", href: "https://github.com/Is-Ammar/inception" }]
  },
  {
    id: "philosophers",
    title: "Philosophers",
    context: "1337 project",
    description: "The dining philosophers problem in C, solved with threads and mutexes without deadlocks or starvation.",
    tech: ["C", "pthreads", "Mutexes"],
    categories: ["systems"],
    links: [{ label: "GitHub", href: "https://github.com/Is-Ammar/PHILOSOPHERS" }]
  },
  {
    id: "minirt",
    title: "miniRT",
    context: "1337 team project",
    description: "A ray tracer in C that renders spheres, planes and cylinders from scene files, with lighting and shadows.",
    tech: ["C", "MiniLibX", "Linear algebra"],
    categories: ["systems"],
    links: [{ label: "GitHub", href: "https://github.com/Is-Ammar/miniRT" }]
  },
  {
    id: "cloud-wishes",
    title: "Cloud Wishes",
    context: "CTF challenge",
    description: "A multi-stage web security challenge I wrote for a CTF. Players find hidden data in the frontend and use it against the API to get the flag.",
    tech: ["React", "TypeScript", "Express"],
    categories: ["security", "web"],
    links: [
      { label: "Frontend", href: "https://github.com/Is-Ammar/Cloud_Wishes" },
      { label: "Backend", href: "https://github.com/Is-Ammar/server" }
    ]
  },
  {
    id: "ichess",
    title: "Chess engine",
    context: "Personal project",
    description: "Play chess in the browser against a built-in engine that picks moves with minimax search and alpha-beta pruning.",
    tech: ["React", "TypeScript", "chess.js"],
    categories: ["web"],
    links: [
      { label: "GitHub", href: "https://github.com/Is-Ammar/ichess" },
      { label: "Live", href: "https://ichess-phi.vercel.app" }
    ]
  }
];
