import { Project, Experience, Education, SkillCategory } from './types';

export const SOCIALS = {
  email: "eammarpro@gmail.com",
  github: "https://github.com/is-ammar",
  linkedin: "https://linkedin.com/in/is-ammar",
  resume: "/resume.pdf"
};

export const SKILLS: SkillCategory[] = [
  {
    name: "Security & Systems",
    skills: ["Linux", "Networking", "C", "C++", "Python"]
  },
  {
    name: "Backend & Systems",
    skills: ["FastAPI", "Django", "Node.js", "NestJS", "PostgreSQL", "MongoDB"]
  },
  {
    name: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "React Native", "Tailwind CSS"]
  },
  {
    name: "DevOps & Cloud",
    skills: ["AWS", "Docker", "Kubernetes", "Git", "GitHub Actions"]
  }
];

export const EXPERIENCE: Experience[] = [
  {
    id: "exp-0",
    role: "Full-Stack & Security Engineer",
    company: "Freelance / Consultant",
    period: "2025 - Present",
    description: "Building full-stack products for clients, with security treated as part of the job rather than an afterthought.",
    highlights: [
      "Design and build APIs with proper auth, rate limiting, and audit logging from day one.",
      "Ship full-stack apps with monitoring in place and sane, hardened defaults.",
      "Help teams triage vulnerabilities and review the security of what they already run."
    ],
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL", "Linux"]
  },
  {
    id: "exp-1",
    role: "Board Member | Recruiter | Web Player | DFIR Player",
    company: "M4SEC Team",
    period: "2024 - Present",
    description: "Academic CTF team representing 1337 Coding School in Rabat (UM6P / 42 Network). I sit on the board, run recruitment, and play the web security and DFIR categories.",
    highlights: [
      "Ranked #1 in Morocco for the 2025 season and #135 worldwide on CTFtime (late 2025).",
      "Placed top 10 in major CTFs, including CyberSphere CTF (1st, 2024), L3akCTF (4th, 2024), DeadSec CTF (5th, 2024), RSTCON CTF (4th, 2025), and FortID CTF (6th, 2025).",
      "Run recruiting and onboarding, and help newer players pick and grow into a category."
    ],
    tech: ["Web Security", "DFIR", "Incident Response", "CTF Strategy", "Linux", "Networking"]
  },
  {
    id: "exp-2",
    role: "Software Engineering Scholar",
    company: "1337 School (42 Network)",
    period: "2024 - Present",
    description: "Project-based curriculum with no classes and no teachers: you learn C, systems programming, and algorithms by building things and having peers tear them apart in review.",
    highlights: [
      "Built a Unix shell, a 3D ray tracer, and a multi-threaded server from scratch in C.",
      "Got deeply comfortable with manual memory management and the POSIX API.",
      "Peer-reviewed dozens of projects, which taught me to read other people's C as carefully as I write my own."
    ],
    tech: ["C", "C++", "Unix API", "Multithreading", "Algorithms"]
  },
  {
    id: "exp-3",
    role: "Navigation Systems Lead",
    company: "Royal Moroccan Navy",
    period: "2022 - 2024",
    description: "Ran shipboard navigation systems and real-time telemetry, where a mistake isn't a bug ticket.",
    highlights: [
      "Kept a network of navigation sensors running at 99.9% uptime at sea.",
      "Led small teams through high-precision maneuvers under real pressure.",
      "Debugged hardware and software issues live, on running systems."
    ],
    tech: ["Systems Monitoring", "Incident Response", "Real-time Telemetry", "Navigation Software"]
  },
  {
    id: "exp-4",
    role: "Technical Analyst (Intern)",
    company: "Royal Moroccan Navy",
    period: "2020 - 2022",
    description: "Maintained and calibrated integrated bridge systems and their telemetry.",
    highlights: [
      "Analyzed telemetry data to improve operational trajectories.",
      "Worked on the seam between hardware and software during maintenance.",
      "Kept technical documentation current under international regulatory standards."
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
    focus: "Deep dive into low-level C/C++, Unix kernel concepts, and algorithmic optimization."
  },
  {
    id: "edu-2",
    degree: "Maritime Professional Certifications",
    school: "Royal Moroccan Navy Training Center",
    year: "2020 - 2023",
    focus: "Technical specialization in naval operations and system safety.",
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
    focus: "Quantitative analysis, management theory, and strategic decision-making."
  },
  {
    id: "edu-4",
    degree: "High School Diploma",
    school: "Scientific Stream",
    year: "2019"
  }
];

export const PROJECTS: Project[] = [
  {
    id: "p8",
    title: "Minishell",
    description: "A Unix shell written in C, with a hand-rolled AST parser, pipelines, and its own memory management.",
    role: "System Programmer",
    impact: "Wrote a recursive descent parser and a custom garbage collector so complex command chains run without leaking a byte.",
    tech: ["C", "Unix API", "POSIX Signals", "Process Management"],
    featured: true,
    category: "Software Engineering",
    github: "https://github.com/Is-Ammar/MINI-SHELL"
  },
  {
    id: "p7",
    title: "Wordle Clone",
    description: "A Wordle clone with daily puzzles, persistent game state, and proper letter-scoring logic.",
    role: "Frontend Dev",
    impact: "Built a state machine that keeps animations, the virtual keyboard, and daily puzzle fetching in sync.",
    tech: ["React", "TypeScript", "LocalStorage", "CSS3 Animations"],
    featured: true,
    category: "Web",
    github: "https://github.com/is-ammar/wordle"
  },
  {
    id: "p3",
    title: "BioGuide",
    description: "A full-stack app for exploring biomedical research data, with interactive dashboards and search.",
    role: "Full-Stack Dev",
    impact: "Renders large PMC research datasets in the browser without breaking a sweat.",
    tech: ["React", "Node.js", "MongoDB", "D3.js", "Tailwind"],
    featured: true,
    category: "Web",
    github: "https://github.com/Is-Ammar/BioGuide"
  },
  {
    id: "p4",
    title: "LANG-ME",
    description: "A language-learning site that brings together dictionary lookups, book discovery, and learning resources from public APIs.",
    role: "Frontend Dev",
    impact: "Wired external APIs into a responsive interface built from small, reusable React components.",
    tech: ["React", "Styled Components", "REST APIs", "CSS Grid"],
    featured: false,
    category: "Web",
    github: "https://github.com/is-ammar/lang-me"
  },
  {
    id: "p5",
    title: "Cloud_Wishes CTF challenge",
    description: "A gamified web security challenge featuring hidden telemetry data, URL manipulation, and API exploitation.",
    role: "Security Researcher / Developer",
    impact: "Designed a multi-stage puzzle involving Base64 decoding, broken access control, and logic flaws.",
    tech: ["React", "TypeScript", "Tailwind CSS", "REST API"],
    featured: true,
    category: "Security",
    github: "https://github.com/is-ammar/Cloud_Wishes"
  },
  {
    id: "p6",
    title: "Cloud Wishlist server",
    description: "A Node.js security challenge backend featuring token-based authentication, rate limiting, and Base64 obfuscation.",
    role: "Backend Dev / Security Designer",
    impact: "Implemented a multi-layered verification system with environment-driven CORS and state-based rate limiting.",
    tech: ["Node.js", "Express", "CORS", "Buffer"],
    featured: false,
    category: "Security",
    github: "https://github.com/is-ammar/server"
  },
  {
    id: "p9",
    title: "Dining Philosophers",
    description: "A multi-threaded simulation of the classic synchronization problem, implementing deadlock prevention and thread safety in C.",
    role: "System Developer",
    impact: "Avoids deadlock with an asymmetric fork-pickup order, and monitors threads so nobody starves.",
    tech: ["C", "pthreads", "Mutexes", "Synchronization"],
    featured: false,
    category: "Software Engineering",
    github: "https://github.com/Is-Ammar/PHILOSOPHERS"
  },
  {
    id: "p10",
    title: "miniRT",
    description: "A CPU-driven ray tracing engine that simulates light physics to render 3D scenes with shadows, reflections, and Phong shading.",
    role: "Graphics Engineer",
    impact: "Developed a custom 3D math library for vector/matrix operations and implemented an optimized ray-object intersection algorithm.",
    tech: ["C", "MiniLibX", "Linear Algebra", "Ray Tracing"],
    featured: true,
    category: "Graphics & Simulation",
    github: "https://github.com/Is-Ammar/miniRT"
  },
  {
    id: "p11",
    title: "React Chess Engine",
    description: "A chess engine that runs in the browser inside a React app, built on Minimax search with alpha-beta pruning.",
    role: "Full-Stack Developer",
    impact: "The engine plays at roughly 1400 ELO, evaluating positions in real time and knowing when to offer a draw.",
    tech: ["React", "TypeScript", "Minimax Algorithm", "Tailwind CSS"],
    featured: true,
    category: "Software Engineering",
    github: "https://github.com/Is-Ammar/ichess"
  },
  {
    id: "p12",
    title: "Fract-ol",
    description: "A real-time fractal explorer in C that renders the Mandelbrot, Julia, and Tricorn sets.",
    role: "Graphics Programmer",
    impact: "Implemented smooth mouse-centered zooming and optimized escape-time algorithms to maintain high frame rates during exploration.",
    tech: ["C", "MiniLibX", "Complex Mathematics", "Computer Graphics"],
    featured: false,
    category: "Graphics & Simulation",
    github: "https://github.com/Is-ammar/fract-ol"
  },
  {
    id: "p13",
    title: "Push_Swap",
    description: "An optimized sorting algorithm that sorts data across two stacks using a restricted instruction set, achieving O(n log n) complexity.",
    role: "Algorithm Developer",
    impact: "A chunk-based pre-sorting strategy sorts 500 numbers in under 5,500 operations.",
    tech: ["C", "Algorithms", "Data Structures", "Complexity Analysis"],
    featured: false,
    category: "Software Engineering",
    github: "https://github.com/Is-ammar/push_swap"
  },
  {
    id: "p14",
    title: "Push_Swap Utility Tester",
    description: "An automated Python testing suite that validates sorting logic, benchmarks instruction counts, and identifies edge-case failures.",
    role: "QA / Automation Engineer",
    impact: "Automated the validation of 1000+ random permutations, ensuring the algorithm stays within the 5500-move limit for 500 integers.",
    tech: ["Python", "Subprocess", "CLI Testing", "Randomization"],
    featured: false,
    category: "DevOps & Utilities",
    github: "https://github.com/Is-ammar/push_swap_tester"
  }
];
