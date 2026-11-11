import { Project, ProjectCategory, Experience, Education, SkillCategory } from './types';

export const SOCIALS = {
  email: "eammarpro@gmail.com",
  github: "https://github.com/is-ammar",
  linkedin: "https://linkedin.com/in/is-ammar",
  resume: "/resume.pdf"
};

export const SKILLS: SkillCategory[] = [
  {
    name: "AI Engineering",
    skills: [
      "Python",
      "FastAPI",
      "RAG / vector search",
      "pgvector",
      "Ollama (local LLMs)",
      "PyTorch",
      "scikit-learn",
      "Pydantic",
      "SQLAlchemy",
      "PostgreSQL"
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
    name: "Offensive Security",
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
    role: "Software Engineering Program",
    company: "1337 School (42 Network)",
    period: "2024 - Present",
    description: "I'm in a project-based software engineering program with no classes and no teachers. I build each project myself or with a team, and my peers review it.",
    highlights: [
      "I'm the product owner of ShieldCore, the bug bounty platform my team of five is building for ft_transcendence, and I build its AI service: duplicate report detection with pgvector, then pre-triage and CVSS severity suggestions from local LLMs.",
      "I built an IRC server in C++98 with non-blocking sockets and a poll() event loop, in a team of three.",
      "I built a Unix shell (minishell), a ray tracer (miniRT) and a dining philosophers simulation in C."
    ],
    tech: ["Python", "C", "C++98", "Unix API", "Docker"]
  },
  {
    id: "exp-m4sec",
    role: "Board Member, Recruiter, Web & DFIR Player",
    company: "M4SEC Team",
    period: "2024 - Present",
    description: "M4SEC is the academic CTF team of 1337 Coding School in Rabat (UM6P / 42 Network). I serve on the board, lead recruiting, and compete in the web security and DFIR categories.",
    highlights: [
      "We ranked #1 in Morocco for the 2025 season and #135 worldwide on CTFtime (late 2025).",
      "We finished in the top 10 at CyberSphere CTF (1st, 2024), L3akCTF (4th, 2024), DeadSec CTF (5th, 2024), RSTCON CTF (4th, 2025) and FortID CTF (6th, 2025).",
      "I lead recruiting and onboarding, and I mentor new players as they choose and develop a category."
    ],
    tech: ["Web Security", "DFIR", "Linux", "Networking"]
  },
  {
    id: "exp-freelance",
    role: "Freelance Developer (Web & Security)",
    company: "Freelance",
    period: "2025 - Present",
    description: "I build web applications and APIs for clients, and I review the security of the systems they already run.",
    highlights: [
      "I build APIs with authentication, rate limiting and audit logging set up from the start.",
      "I build React and TypeScript frontends on top of Node.js and PostgreSQL backends, with monitoring in place.",
      "I help clients triage vulnerabilities and review the security of their existing apps."
    ],
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL", "Linux"]
  },
  {
    id: "exp-navy-lead",
    role: "Navigation Systems Lead",
    company: "Royal Moroccan Navy",
    period: "2022 - 2024",
    description: "I ran shipboard navigation systems and their real-time telemetry.",
    highlights: [
      "I kept the network of navigation sensors at 99.9% uptime at sea.",
      "I led small teams during high-precision maneuvers.",
      "I diagnosed hardware and software faults on running systems."
    ],
    tech: ["Systems Monitoring", "Incident Response", "Real-time Telemetry", "Navigation Software"]
  },
  {
    id: "exp-navy-intern",
    role: "Technical Analyst (Intern)",
    company: "Royal Moroccan Navy",
    period: "2020 - 2022",
    description: "I maintained and calibrated integrated bridge systems and their telemetry.",
    highlights: [
      "I analyzed telemetry data to correct operational trajectories.",
      "I worked on both the hardware and the software side during maintenance.",
      "I kept technical documentation in line with international maritime regulations."
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
    focus: "I work in C, C++98, Unix system calls, networking and Docker, with peer code review on every project."
  },
  {
    id: "edu-2",
    degree: "Maritime Professional Certifications",
    school: "Royal Moroccan Navy Training Center",
    year: "2020 - 2023",
    focus: "I trained in navigation and maritime technical systems.",
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
    focus: "I took economics, statistics and management courses."
  },
  {
    id: "edu-4",
    degree: "High School Diploma",
    school: "Scientific Stream",
    year: "2019"
  }
];

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  ai: "AI Engineering",
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
    description: "I'm the product owner of ShieldCore, a multi-tenant bug bounty platform my team of five is building at 1337, and I build its AI service. It finds duplicate vulnerability reports with pgvector, and I'm adding pre-triage and CVSS severity suggestions from local LLMs.",
    tech: ["Python", "FastAPI", "PostgreSQL", "pgvector", "Ollama", "Docker"],
    categories: ["ai"],
    links: [{ label: "GitHub", href: "https://github.com/yel-alja/FT_TRANSCENDENCE" }]
  },
  {
    id: "bioguide",
    title: "BioGuide",
    featured: true,
    context: "NASA Space Apps Challenge 2025",
    description: "My team and I built this web app for exploring NASA space biology research, with search across publications, data dashboards and an AI chat assistant.",
    tech: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "D3.js"],
    categories: ["ai", "web"],
    links: [{ label: "GitHub", href: "https://github.com/Is-Ammar/BioGuide" }]
  },
  {
    id: "navguard",
    title: "NavGuard",
    featured: true,
    context: "Maritime security",
    description: "I built this anomaly detector for ship networks. It watches GPS, AIS and engine control traffic, and I combine machine learning with rules to spot spoofing and tampering.",
    tech: ["Python", "scikit-learn", "PyTorch", "Dash", "Docker"],
    categories: ["ai", "security"],
    links: [{ label: "GitHub", href: "https://github.com/Is-Ammar/navguard" }]
  },
  {
    id: "ft-irc",
    title: "ft_irc",
    featured: true,
    context: "1337 team project",
    description: "I built this IRC server in C++98 with two teammates. It works with standard IRC clients and handles many connections in a single thread with non-blocking sockets and poll().",
    tech: ["C++98", "Sockets", "poll()", "TCP"],
    categories: ["systems"],
    links: [{ label: "GitHub", href: "https://github.com/Is-Ammar/ft_irc" }]
  },
  {
    id: "minishell",
    title: "Minishell",
    context: "1337 team project",
    description: "I wrote this small Bash-like shell in C as a team project, with pipes, redirections, heredocs, && and ||, subshells and wildcards.",
    tech: ["C", "Unix API", "Processes", "Signals"],
    categories: ["systems"],
    links: [{ label: "GitHub", href: "https://github.com/Is-Ammar/MINI-SHELL" }]
  },
  {
    id: "inception",
    title: "Inception",
    context: "1337 project",
    description: "I set up a WordPress stack (Nginx, PHP-FPM and MariaDB) in Docker Compose, with every image built from scratch on Debian and HTTPS only.",
    tech: ["Docker", "Docker Compose", "Nginx", "MariaDB"],
    categories: ["systems"],
    links: [{ label: "GitHub", href: "https://github.com/Is-Ammar/inception" }]
  },
  {
    id: "philosophers",
    title: "Philosophers",
    context: "1337 project",
    description: "I solved the dining philosophers problem in C with threads and mutexes, without deadlocks or starvation.",
    tech: ["C", "pthreads", "Mutexes"],
    categories: ["systems"],
    links: [{ label: "GitHub", href: "https://github.com/Is-Ammar/PHILOSOPHERS" }]
  },
  {
    id: "minirt",
    title: "miniRT",
    context: "1337 team project",
    description: "I built this ray tracer in C as a team project. It renders spheres, planes and cylinders from scene files, with lighting and shadows.",
    tech: ["C", "MiniLibX", "Linear algebra"],
    categories: ["systems"],
    links: [{ label: "GitHub", href: "https://github.com/Is-Ammar/miniRT" }]
  },
  {
    id: "cloud-wishes",
    title: "Cloud Wishes",
    context: "CTF challenge",
    description: "I wrote this multi-stage web security challenge for a CTF. Players find hidden data in the frontend and use it against the API to get the flag.",
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
    description: "I built a chess game for the browser with its own engine, which picks moves with minimax search and alpha-beta pruning.",
    tech: ["React", "TypeScript", "chess.js"],
    categories: ["web"],
    links: [
      { label: "GitHub", href: "https://github.com/Is-Ammar/ichess" },
      { label: "Live", href: "https://ichess-phi.vercel.app" }
    ]
  }
];
