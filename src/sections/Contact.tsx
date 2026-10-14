import React from 'react';
import { m } from 'framer-motion';
import { Download, Github, Linkedin, Mail } from 'lucide-react';
import { SOCIALS } from '../constants';
import { CONTAINER_CLASS, SECTION_CLASS, SectionHeading } from '../components/SectionHeading';
import { fadeInUp, staggerContainer } from '../utils/motion';

const LINKS = [
  { label: 'GitHub', href: SOCIALS.github, Icon: Github },
  { label: 'LinkedIn', href: SOCIALS.linkedin, Icon: Linkedin },
  { label: 'Resume PDF', href: SOCIALS.resume, Icon: Download },
];

export const Contact = () => (
  <section id="contact" className={SECTION_CLASS}>
    <m.div
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      className={CONTAINER_CLASS}
    >
      <SectionHeading index="06" title="Contact" />

      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <m.div variants={fadeInUp} className="min-w-0">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line/70 bg-bg-elev-1/80 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent motion-reduce:animate-none" />
            Open to new work
          </div>
          <h3 className="mb-6 font-display text-4xl font-semibold leading-tight text-text-strong md:text-5xl">
            Get in touch
          </h3>
          <p className="mb-10 max-w-xl text-lg leading-relaxed text-text-muted">
            Email is the fastest way to reach me and I usually reply within a day. I take freelance work, and
            I&apos;m happy to talk about AI services, systems programming or security.
          </p>
          <a
            href={`mailto:${SOCIALS.email}`}
            className="inline-flex max-w-full items-center gap-3 rounded-full border border-line-strong/70 bg-bg-elev-1/80 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-text-strong transition-colors hover:border-accent/60 hover:text-accent hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <Mail size={16} className="shrink-0" /> Send me an email
          </a>
        </m.div>

        <m.div variants={fadeInUp} className="flex flex-col items-start justify-end lg:items-end">
          <div className="w-full rounded-[28px] border border-white/10 bg-bg-elev-2/80 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset]">
            <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted">Elsewhere</div>
            <div className="flex flex-col gap-5">
              {LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-full px-2 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  <span className="transition-transform group-hover:translate-x-1">{label}</span> <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </m.div>
      </div>
    </m.div>
  </section>
);
