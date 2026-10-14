import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { useSmoothScroll } from '../components/SmoothScroll';
import { AlertTriangle, ArrowUpRight, FileText, Terminal, X } from 'lucide-react';
import { CONTAINER_CLASS, SECTION_CLASS, SectionHeading } from '../components/SectionHeading';
import { SectionBlob } from '../components/SectionBlob';
import { DURATION, EASE_OUT, fadeInUp, staggerContainer } from '../utils/motion';

// The markdown + syntax highlighting bundle is heavy, so it only loads
// once a writeup is actually opened.
const WriteupMarkdown = lazy(() => import('../components/WriteupMarkdown'));

// If the lazy chunk fails to load (offline, or a stale deploy), show a
// message inside the modal instead of letting the error unmount the app.
class MarkdownErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-accent-2/40 bg-accent-2/10 p-4 text-sm text-text-muted">
          Couldn&apos;t load the reader. Refresh the page, or use the GitHub link below.
        </div>
      );
    }
    return this.props.children;
  }
}

const API_ROOT = 'https://api.github.com/repos/Is-Ammar/writeups/contents';
const CACHE_KEY = 'htb-writeups-cache-v1';
const CACHE_TTL = 10 * 60 * 1000;

type GitHubContentItem = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file' | 'dir';
};

type WriteupItem = {
  name: string;
  path: string;
  title: string;
  category: string;
  badge: 'HTB' | 'Web';
  htmlUrl: string;
  rawUrl: string;
  size: number;
};

const BADGE_STYLES: Record<WriteupItem['badge'], { badge: string; dot: string }> = {
  HTB: {
    badge: 'border-accent/40 bg-accent/15 text-accent',
    dot: 'bg-accent',
  },
  Web: {
    badge: 'border-accent-3/40 bg-accent-3/15 text-accent-3',
    dot: 'bg-accent-3',
  },
};

const buildContentsUrl = (path: string) => {
  if (!path) return API_ROOT;
  const safePath = path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `${API_ROOT}/${safePath}`;
};

const isAbortError = (error: unknown) =>
  error instanceof DOMException && error.name === 'AbortError';

const formatTitle = (filename: string) => {
  const withoutExtension = filename.replace(/\.[^/.]+$/, '');
  const withoutIndex = withoutExtension.replace(/^\d+([_-])?/, '');
  const tokens = withoutIndex.split(/[_-]+/).filter(Boolean);
  const cleaned = tokens.filter((token) => !/^(htb|writeups?|web)$/i.test(token));
  const finalTokens = cleaned.length ? cleaned : tokens;
  if (!finalTokens.length) {
    return withoutIndex || withoutExtension || 'Untitled';
  }
  return finalTokens
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join(' ');
};

const formatCategory = (value: string) =>
  value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .trim();

const deriveCategory = (path: string, name: string) => {
  const segments = path.split('/');
  if (segments.length > 1) {
    return formatCategory(segments[0]);
  }
  if (/web/i.test(name)) return 'Web';
  if (/htb|hackthebox/i.test(name)) return 'HTB';
  return 'HTB';
};

const deriveBadge = (path: string, name: string): WriteupItem['badge'] => {
  const fingerprint = `${path} ${name}`.toLowerCase();
  return fingerprint.includes('web') ? 'Web' : 'HTB';
};

const buildRawUrl = (item: GitHubContentItem) => {
  if (item.download_url) return item.download_url;
  if (item.html_url.includes('/blob/')) {
    return item.html_url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
  }
  return item.html_url;
};

const formatSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

const toWriteupItem = (item: GitHubContentItem): WriteupItem => ({
  name: item.name,
  path: item.path,
  title: formatTitle(item.name),
  category: deriveCategory(item.path, item.name),
  badge: deriveBadge(item.path, item.name),
  htmlUrl: item.html_url,
  rawUrl: buildRawUrl(item),
  size: item.size,
});

const fetchContents = async (path: string, signal: AbortSignal): Promise<GitHubContentItem[]> => {
  const response = await fetch(buildContentsUrl(path), {
    signal,
    headers: { Accept: 'application/vnd.github+json' },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error (${response.status})`);
  }

  const data = await response.json();
  return Array.isArray(data) ? (data as GitHubContentItem[]) : [];
};

const fetchWriteups = async (path: string, signal: AbortSignal): Promise<WriteupItem[]> => {
  const items = await fetchContents(path, signal);
  const files = items.filter(
    (item) => item.type === 'file' && item.name.toLowerCase().endsWith('.md')
  );
  const directories = items.filter((item) => item.type === 'dir');
  const nested = await Promise.all(directories.map((dir) => fetchWriteups(dir.path, signal)));
  return [...files.map(toWriteupItem), ...nested.flat()];
};

const sortWriteups = (items: WriteupItem[]) =>
  items.sort(
    (a, b) =>
      a.category.localeCompare(b.category) || a.title.localeCompare(b.title)
  );

const mergeWriteups = (current: WriteupItem[], incoming: WriteupItem[]) => {
  const map = new Map(current.map((item) => [item.path, item]));
  incoming.forEach((item) => map.set(item.path, item));
  return sortWriteups(Array.from(map.values()));
};

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { timestamp: number; items: WriteupItem[] };
    if (!parsed?.items?.length) return null;
    if (Date.now() - parsed.timestamp > CACHE_TTL) return null;
    return parsed.items;
  } catch {
    return null;
  }
};

const writeCache = (items: WriteupItem[]) => {
  try {
    const payload = JSON.stringify({ timestamp: Date.now(), items });
    localStorage.setItem(CACHE_KEY, payload);
  } catch {}
};

export const HTBWriteups = () => {
  const reduceMotion = useReducedMotion();
  const lenis = useSmoothScroll();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [writeups, setWriteups] = useState<WriteupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [selectedWriteup, setSelectedWriteup] = useState<WriteupItem | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [contentMap, setContentMap] = useState<Record<string, string>>({});
  const [contentError, setContentError] = useState<string | null>(null);
  const [isContentLoading, setIsContentLoading] = useState(false);

  // Only call the GitHub API once the visitor gets close to this section,
  // so the first page load stays light on slow connections.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || shouldLoad) return undefined;
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '800px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  const loadWriteups = useCallback(async (signal: AbortSignal) => {
    setError(null);
    const cached = readCache();
    if (cached?.length) {
      setWriteups(sortWriteups([...cached]));
      setIsLoading(false);
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
      setIsRefreshing(false);
    }

    try {
      const rootItems = await fetchContents('', signal);
      const files = rootItems.filter(
        (item) => item.type === 'file' && item.name.toLowerCase().endsWith('.md')
      );
      const dirs = rootItems.filter((item) => item.type === 'dir');
      const rootWriteups = files.map(toWriteupItem);

      if (!signal.aborted && rootWriteups.length) {
        setWriteups((prev) => mergeWriteups(prev, rootWriteups));
        setIsLoading(false);
      }

      if (!dirs.length) {
        const merged = mergeWriteups(rootWriteups, []);
        if (merged.length) {
          setWriteups((prev) => mergeWriteups(prev, rootWriteups));
          writeCache(merged);
        }
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      let completed = 0;
      const collected: WriteupItem[] = [];

      await Promise.all(
        dirs.map(async (dir) => {
          try {
            const result = await fetchWriteups(dir.path, signal);
            if (signal.aborted) return;
            if (result.length) {
              collected.push(...result);
              setWriteups((prev) => mergeWriteups(prev, result));
              setIsLoading(false);
            }
          } catch (err) {
            if (isAbortError(err)) throw err;
          } finally {
            completed += 1;
            if (completed === dirs.length && !signal.aborted) {
              const merged = mergeWriteups(rootWriteups, collected);
              if (merged.length) writeCache(merged);
              setIsLoading(false);
              setIsRefreshing(false);
            }
          }
        })
      );
    } catch (err) {
      if (isAbortError(err)) return;
      if (!cached?.length) {
        setError(err instanceof Error ? err.message : 'Failed to load writeups.');
      }
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!shouldLoad) return undefined;
    const controller = new AbortController();
    loadWriteups(controller.signal);
    return () => controller.abort();
  }, [loadWriteups, refreshToken, shouldLoad]);

  // Clear any error left behind by a previous writeup so cached content
  // renders instead of a stale failure message.
  useEffect(() => {
    setContentError(null);
  }, [selectedWriteup]);

  useEffect(() => {
    if (!selectedWriteup) return;
    const hasContent = Object.prototype.hasOwnProperty.call(contentMap, selectedWriteup.path);
    if (hasContent) return;

    const controller = new AbortController();
    const loadContent = async () => {
      setIsContentLoading(true);
      setContentError(null);
      try {
        const response = await fetch(selectedWriteup.rawUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Raw file error (${response.status})`);
        }
        const text = await response.text();
        setContentMap((prev) => ({ ...prev, [selectedWriteup.path]: text }));
      } catch (err) {
        if (!isAbortError(err)) {
          setContentError(err instanceof Error ? err.message : 'Failed to load writeup.');
        }
      } finally {
        setIsContentLoading(false);
      }
    };

    loadContent();
    return () => controller.abort();
  }, [contentMap, selectedWriteup]);

  // Keyboard handling for the dialog: Escape closes, Tab stays inside,
  // and focus returns to wherever it was once the dialog closes.
  useEffect(() => {
    if (!selectedWriteup) return undefined;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedWriteup(null);
        return;
      }
      if (event.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !dialog.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !dialog.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [selectedWriteup]);

  useEffect(() => {
    if (!selectedWriteup) return undefined;
    const root = document.documentElement;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = root.style.overflow;
    const originalPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    document.body.style.overflow = 'hidden';
    root.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    lenis?.stop();

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      root.style.overflow = originalHtmlOverflow;
      document.body.style.paddingRight = originalPadding;
      lenis?.start();
    };
  }, [selectedWriteup, lenis]);

  const activeContent = selectedWriteup ? contentMap[selectedWriteup.path] : '';
  const showLoading = isLoading && writeups.length === 0;
  const badgeCounts = useMemo(
    () =>
      writeups.reduce(
        (acc, item) => ({ ...acc, [item.badge]: (acc[item.badge] ?? 0) + 1 }),
        {} as Record<WriteupItem['badge'], number>
      ),
    [writeups]
  );

  return (
    <section id="writeups" ref={sectionRef} className={SECTION_CLASS}>
      <SectionBlob className="-top-20 right-[8%] h-80 w-80" color="rgb(99 102 241 / 0.16)" />
      <SectionBlob className="bottom-0 left-[10%] h-80 w-80" color="rgb(34 211 238 / 0.12)" />

      <m.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        className={CONTAINER_CLASS}
      >
        <SectionHeading index="05" title="Writeups" />

        <m.div variants={fadeInUp} className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-white/10 bg-bg-elev-1/80 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset]">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted">
              <span className="flex items-center gap-2 text-text-strong">
                <Terminal size={12} className="text-accent" />
                Hack The Box & CTF notes
              </span>
              <span className="h-px w-8 bg-line/70" />
              <span>Pulled live from GitHub</span>
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-text-muted">
              Notes I take while working through Hack The Box machines and web challenges, loaded from my writeups
              repo. Click any file to read it here.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-bg-elev-2/80 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset]">
            <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted">
              <span>Repository</span>
              <span className="text-text-strong">
                {showLoading ? 'Loading...' : isRefreshing ? 'Refreshing...' : `${writeups.length} files`}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
              {(['HTB', 'Web'] as const).map((badge) => {
                const styles = BADGE_STYLES[badge];
                return (
                  <span key={badge} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${styles.badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                    {badge}
                    <span className="text-text-muted/70">{badgeCounts[badge] ?? 0}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </m.div>

        {showLoading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="relative overflow-hidden rounded-[28px] border border-white/10 bg-bg-elev-1/60 p-6"
              >
                <div className="animate-pulse space-y-5 motion-reduce:animate-none">
                  <div className="h-4 w-24 rounded-full bg-line/70" />
                  <div className="h-7 w-3/4 rounded-full bg-line/70" />
                  <div className="h-3 w-full rounded-full bg-line/70" />
                  <div className="h-4 w-20 rounded-full bg-line/70" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && writeups.length === 0 && (
          <div className="rounded-[28px] border border-accent-2/40 bg-accent-2/10 p-6">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-accent-2">
              <AlertTriangle size={14} />
              Couldn&apos;t reach GitHub
            </div>
            <p className="mt-4 text-sm text-text-muted">{error} Give it a few seconds and try again.</p>
            <button
              type="button"
              onClick={() => setRefreshToken((prev) => prev + 1)}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent-2/40 bg-bg/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent-2 transition-colors hover:border-accent-2/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60"
            >
              Try again
            </button>
          </div>
        )}

        {writeups.length > 0 && (
          <m.div
            variants={staggerContainer}
            initial={reduceMotion ? false : 'initial'}
            animate="animate"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {writeups.map((writeup) => {
              const styles = BADGE_STYLES[writeup.badge];
              return (
                <m.button
                  key={writeup.path}
                  type="button"
                  variants={fadeInUp}
                  whileHover={reduceMotion ? undefined : { y: -6 }}
                  transition={{ duration: DURATION.sm, ease: EASE_OUT }}
                  onClick={() => setSelectedWriteup(writeup)}
                  className="glow-card group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-bg-elev-1/80 p-6 text-left shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] transition-colors duration-500 hover:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60"
                  aria-label={`Open writeup ${writeup.title}`}
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -inset-12 bg-[radial-gradient(circle_at_20%_20%,rgb(99_102_241/0.22),transparent_60%)]" />
                  </div>

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] ${styles.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                        {writeup.badge}
                      </span>
                      {writeup.category !== writeup.badge && (
                        <span className="truncate font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
                          {writeup.category}
                        </span>
                      )}
                    </div>

                    <div className="mt-5">
                      <h3 className="text-xl font-semibold text-text-strong transition-colors group-hover:text-accent">
                        {writeup.title}
                      </h3>
                      <div className="mt-3 flex min-w-0 items-center gap-2 font-mono text-[11px] text-text-muted">
                        <FileText size={12} className="shrink-0 text-accent/70" />
                        <span className="truncate" title={writeup.path}>
                          {writeup.path}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-4 border-t border-line/60 pt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
                      <span className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        Read writeup
                      </span>
                      <span>{formatSize(writeup.size)}</span>
                    </div>
                  </div>
                </m.button>
              );
            })}
          </m.div>
        )}
      </m.div>

      {createPortal(
        <AnimatePresence>
          {selectedWriteup && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] flex items-center justify-center bg-bg/90 p-3 sm:p-4 md:p-10"
              onClick={() => setSelectedWriteup(null)}
            >
              <m.div
                ref={dialogRef}
                tabIndex={-1}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: DURATION.sm, ease: EASE_OUT }}
                className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-bg-elev-2 shadow-[0_24px_70px_rgba(0,0,0,0.6)] focus:outline-none"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={`${selectedWriteup.title} writeup`}
                data-lenis-prevent
              >
                <div className="flex max-h-[85vh] flex-col">
                  <div className="flex items-center justify-between gap-4 border-b border-line/60 bg-bg-elev-2 px-5 py-4 sm:px-6">
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">Writeup</div>
                      <h3 className="truncate text-xl font-semibold text-text-strong">{selectedWriteup.title}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedWriteup(null)}
                      className="shrink-0 rounded-full border border-white/10 bg-bg/70 p-2 text-text-muted transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60"
                      aria-label="Close writeup"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-6 sm:px-6" data-lenis-prevent>
                    {isContentLoading && (
                      <div className="animate-pulse space-y-4 motion-reduce:animate-none">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <div key={`content-skeleton-${index}`} className="h-4 w-full rounded-full bg-line/70" />
                        ))}
                      </div>
                    )}

                    {!isContentLoading && contentError && (
                      <div className="rounded-[20px] border border-accent-2/40 bg-accent-2/10 p-4 text-sm text-text-muted">
                        {contentError}
                      </div>
                    )}

                    {!isContentLoading && !contentError && (
                      <MarkdownErrorBoundary>
                        <Suspense
                          fallback={
                            <div className="animate-pulse space-y-4 motion-reduce:animate-none">
                              {Array.from({ length: 6 }).map((_, index) => (
                                <div key={`md-skeleton-${index}`} className="h-4 w-full rounded-full bg-line/70" />
                              ))}
                            </div>
                          }
                        >
                          <WriteupMarkdown content={activeContent ?? ''} />
                        </Suspense>
                      </MarkdownErrorBoundary>
                    )}
                  </div>

                  <div className="border-t border-line/60 bg-bg-elev-2 px-5 py-4 sm:px-6">
                    <a
                      href={selectedWriteup.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-line-strong/70 bg-bg-elev-1/80 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-text-strong transition-colors hover:border-accent/60 hover:text-accent hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60"
                    >
                      View on GitHub <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};
