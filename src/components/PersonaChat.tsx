import React, { useEffect, useRef, useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { ArrowUp, X } from 'lucide-react';
import { DURATION, EASE_OUT } from '../utils/motion';

export type ChatMessage = {
  id: number;
  from: 'visitor' | 'ismail';
  text: string;
};

type PersonaChatProps = {
  id: string;
  messages: ChatMessage[];
  pending: boolean;
  onAsk: (question: string) => void;
  onClose: () => void;
};

const SUGGESTIONS = [
  'What are you building now?',
  'Tell me about ft_irc',
  "What are M4SEC's results?",
  'How do I reach you?',
];
const MAX_LENGTH = 300;
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

const BUBBLE = {
  ismail: 'mr-auto rounded-bl-md border-white/10 bg-bg/70 text-text',
  visitor: 'ml-auto rounded-br-md border-accent/35 bg-accent/15 text-text-strong',
};

const PersonaChat = ({ id, messages, pending, onAsk, onClose }: PersonaChatProps) => {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [draft, setDraft] = useState('');

  const hasAsked = messages.some((message) => message.from === 'visitor');
  const canSend = draft.trim().length > 0 && !pending;

  useEffect(() => {
    if (window.matchMedia(FINE_POINTER).matches) inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    const panel = panelRef.current;
    if (!viewport || !panel) return undefined;
    const update = () => {
      const keyboard = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      panel.style.setProperty('--keyboard', `${keyboard}px`);
      panel.style.setProperty('--room', `${viewport.height - (keyboard > 0 ? 24 : 112)}px`);
    };
    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [messages, pending, reduceMotion]);

  const send = (raw: string) => {
    const question = raw.trim().slice(0, MAX_LENGTH);
    if (!question || pending) return;
    setDraft('');
    onAsk(question);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    send(draft);
  };

  return (
    <m.div
      ref={panelRef}
      id={id}
      role="dialog"
      aria-label="Chat with me"
      data-lenis-prevent
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.97 }}
      transition={{ duration: DURATION.sm, ease: EASE_OUT }}
      style={{ transformOrigin: 'bottom right' }}
      className="fixed inset-x-3 bottom-[max(5.25rem,calc(var(--keyboard,0px)_+_0.75rem))] h-[min(33rem,var(--room,calc(100dvh_-_7rem)))] sm:absolute sm:inset-x-auto sm:bottom-full sm:right-0 sm:mb-3 sm:h-[min(34rem,calc(100dvh_-_8rem))] sm:w-[24rem]"
    >
      <div className="glow-card flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-bg-elev-1/95 shadow-[0_22px_60px_rgba(0,0,0,0.6),2px_4px_16px_0px_rgba(248,248,248,0.04)_inset] backdrop-blur-xl">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent"
        />

        <header className="relative z-[2] flex items-center gap-3 border-b border-line/70 px-5 py-4">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/15">
            <img
              src="/avatar.webp"
              alt=""
              width={40}
              height={40}
              decoding="async"
              className="h-full w-full object-cover"
            />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-display text-base font-semibold leading-tight text-text-strong">Ismail Ammar</div>
            <div className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-glow" />
              <span className="truncate">Ask me about my work</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-strong/70 bg-bg/60 text-text-muted transition-colors hover:border-accent/60 hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60"
          >
            <X size={14} />
          </button>
        </header>

        <div
          ref={listRef}
          role="log"
          aria-live="polite"
          aria-label="Conversation"
          data-lenis-prevent
          className="no-scrollbar relative z-[2] flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 py-5"
        >
          {messages.map((message) => (
            <m.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.sm, ease: EASE_OUT }}
              className={`w-fit max-w-[86%] whitespace-pre-wrap break-words rounded-2xl border px-3.5 py-2.5 text-sm leading-relaxed ${BUBBLE[message.from]}`}
            >
              {message.text}
            </m.div>
          ))}

          {pending && (
            <div
              role="status"
              aria-label="Writing a reply"
              className="mr-auto flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-bg/70 px-4 py-3.5"
            >
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="anim-typing h-1.5 w-1.5 rounded-full bg-accent"
                  style={{ animationDelay: `${dot * 0.16}s` }}
                />
              ))}
            </div>
          )}

          {!hasAsked && !pending && (
            <div className="flex flex-wrap gap-2 pt-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => send(suggestion)}
                  className="rounded-full border border-line/70 bg-bg-elev-2/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted transition-colors hover:border-accent/60 hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="relative z-[2] border-t border-line/70 px-4 pb-3 pt-3">
          <div className="flex items-center gap-2 rounded-full border border-line-strong/70 bg-bg/70 py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-accent/60">
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={MAX_LENGTH}
              placeholder="Ask me something"
              aria-label="Your question"
              autoComplete="off"
              enterKeyHint="send"
              className="min-w-0 flex-1 bg-transparent text-base text-text-strong placeholder:text-text-muted/70 focus:outline-none sm:text-sm"
            />
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-bg shadow-glow transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-35 disabled:shadow-none"
            >
              <ArrowUp size={16} strokeWidth={2.5} />
            </button>
          </div>
          <p className="mt-2.5 px-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted/70">
            Automated replies from my documented work
          </p>
        </form>
      </div>
    </m.div>
  );
};

export default PersonaChat;
