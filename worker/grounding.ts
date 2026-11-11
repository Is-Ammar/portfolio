import {
  always,
  answerFromCards,
  rank,
  retrieve,
  SCOPE_REPLY,
  settings,
  tokenize,
  type Card,
} from '../src/persona/retrieval';

export type Message = { role: 'system' | 'user' | 'assistant'; content: string };

export type Reply = {
  answer: string;
  source: 'gate' | 'model' | 'fallback';
  cards: string[];
  reasons: string[];
  rejected?: string;
  retried?: boolean;
};

const SYSTEM_PROMPT =
  'You are Ismail Ammar on your portfolio website. You speak in first-person as an engineer specializing in ' +
  'systems architecture, offensive security, and AI tooling. Be direct, technically precise, and honest. If ' +
  'asked about experience, credentials, or personal details not documented in your portfolio, explicitly ' +
  'state that you do not have that information rather than guessing or hallucinating. Every question comes ' +
  'with FACTS taken from your portfolio. Answer only from those FACTS and never add a name, number, tool or ' +
  'detail that is not in them. If the question is not about you and your documented work, say that it is ' +
  'outside the scope of this portfolio. Answer the visitor directly and conversationally, in your own words, in ' +
  'one to three short sentences. Do not copy the FACTS word for word and do not add anything that is not in ' +
  'them. Do not use lists, headings or a preamble, and do not mention the FACTS.';

const RETRY_PROMPT =
  'Part of that answer is not in the FACTS. Answer the QUESTION again in one to three short sentences, ' +
  'using only the FACTS and staying close to their wording.';

const FALLBACK_SENTENCES = [
  "I don't have that information in my background.",
  "That's not something I've documented on this portfolio.",
  "I haven't worked with that specific tool yet, so I can't speak on it from personal experience.",
  "I don't have that information available here.",
];
const SCOPE_SENTENCE = "That's outside the scope of this portfolio.";
const OWN_WORK_SENTENCE = 'I only present my own work here';
const SCOPE_MARK = SCOPE_SENTENCE.toLowerCase().replace(/\.+$/, '');
const MIN_SUPPORT = 0.8;
const MIN_SENTENCE_SUPPORT = 0.75;

const POLICY_WORDS = `
 yes no both two three four five six things thing part parts entry entries area areas
 document documented documents list listed lists state stated claim claims confirm name named publish
 answer question ask asked present presentation general technical explanation explanations advice
 recommendation recommendations code request debug teach attack technique techniques learning homework
 work works worked project projects build builds built building write wrote written use uses used using
 run runs running make makes made hold holds held take takes include includes cover covers covered
 read reads reading find finds found show shows shown call called mean means meant
 one first second also only still currently now today since from until right kind level detail details
 section page portfolio repository github here there alongside together next closest thing related
 own myself can cannot want need see point look tell talk speak discuss reach reply
 legal medical lawyer doctor pharmacist illegal authorized permission politics financial
 assistant represent directly person talking experience available detail personal
 role roles title then number numbers hello instead side apply applies
 professionally math give technology
 through via get touch various including like such
`;

const REFUSAL_MARKERS = [
  "i don't have that information",
  "not something i've documented on this portfolio",
  "i haven't worked with that specific tool yet",
  'outside the scope of this portfolio',
];

const NEGATION = /(?<![\p{L}\p{N}_])(?:not|no|never|without|neither|nor|cannot)(?![\p{L}\p{N}_])|n't/iu;
const NAME_TOKEN = /[A-Za-z_][A-Za-z0-9_+#./-]*(?:\(\))?/g;
const NUMBER = /\p{Nd}+(?:\.\p{Nd}+)?/gu;
const LIST_MARK = /(?:^|(?<=\n))\s*(?:[-*•]|\p{Nd}+[.)])\s+/gu;
const META_LEAD =
  /(^|(?<=[.!?]\s))(?:based on|according to|from|per|as per|as stated in)\s+(?:the\s+)?(?:provided\s+|given\s+|above\s+)?facts(?:\s+(?:provided|given|above))?\s*,\s*([\p{L}\p{N}_])/giu;

const policy = new Set(tokenize([...FALLBACK_SENTENCES, SCOPE_SENTENCE, OWN_WORK_SENTENCE, POLICY_WORDS].join(' ')));
const alwaysIds = new Set(always.map((card) => card.id));

const sentences = (text: string): string[] =>
  text
    .trim()
    .split(/(?<=[.;?!])\s+/)
    .filter(Boolean);

const formatFacts = (cards: Card[]): string => cards.map((card) => `[${card.title}] ${card.text}`).join('\n');

const buildMessages = (question: string, cards: Card[]): Message[] => [
  { role: 'system', content: SYSTEM_PROMPT },
  { role: 'user', content: `FACTS:\n${formatFacts(cards)}\n\nQUESTION: ${question.trim()}` },
];

const escapePattern = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const mentions = (question: string, name: string): boolean =>
  new RegExp(`(?<![a-z0-9_])${escapePattern(name.toLowerCase())}(?![a-z0-9_])`).test(question.toLowerCase());

const percent = (value: number): string => {
  const scaled = value * 100;
  const floor = Math.floor(scaled);
  const fraction = scaled - floor;
  return `${fraction > 0.5 || (fraction === 0.5 && floor % 2 === 1) ? floor + 1 : floor}%`;
};

const head = (text: string, length: number): string => Array.from(text).slice(0, length).join('');

const trimName = (token: string): string => token.replace(/[.,;:]+$/, '');

const isNameLike = (token: string): boolean => /[A-Z0-9_]/.test(token);

const isPlainCapitalized = (token: string): boolean =>
  /^[A-Z]/.test(token) && /[a-z]/.test(token.slice(1)) && !/[A-Z]/.test(token.slice(1));

const overlap = (words: Set<string>, terms: Set<string>): number => {
  let count = 0;
  for (const word of words) if (terms.has(word)) count += 1;
  return count;
};

const supportRatio = (answer: string, cards: Card[], question: string): number => {
  const words = tokenize(answer);
  if (!words.length) return 1;
  const allowed = new Set([...tokenize(formatFacts(cards)), ...tokenize(question), ...policy]);
  return words.filter((word) => allowed.has(word)).length / words.length;
};

const unsupportedNames = (answer: string, cards: Card[], question: string): string[] => {
  const factsLow = formatFacts(cards).toLowerCase();
  const questionLow = question.toLowerCase();
  const factNumbers = new Set(factsLow.match(NUMBER) ?? []);
  const questionNumbers = new Set(questionLow.match(NUMBER) ?? []);
  const bad = new Set<string>();
  for (const sentence of sentences(answer)) {
    const denies = NEGATION.test(sentence);
    (sentence.match(NAME_TOKEN) ?? []).forEach((raw, index) => {
      const token = trimName(raw);
      if (token.length < 2 || !isNameLike(token)) return;
      if (index === 0 && isPlainCapitalized(token)) return;
      const low = token.toLowerCase();
      if (factsLow.includes(low) || (low.length > 3 && low.endsWith('s') && factsLow.includes(low.slice(0, -1)))) return;
      if (questionLow.includes(low) && denies) return;
      bad.add(token);
    });
    for (const number of sentence.match(NUMBER) ?? []) {
      if (factNumbers.has(number)) continue;
      if (questionNumbers.has(number) && denies) continue;
      bad.add(number);
    }
  }
  return [...bad].sort();
};

const weakestSentence = (answer: string, cards: Card[], question: string): [number, string] => {
  const perCard = cards.map((card) => {
    const title = tokenize(card.title);
    return card.text
      .trim()
      .split(/(?<=[.?!])\s+/)
      .filter(Boolean)
      .map((sentence) => new Set([...title, ...tokenize(sentence)]));
  });
  const questionTerms = new Set(tokenize(question));
  let worst: [number, string] = [1, ''];
  for (const sentence of sentences(answer)) {
    const words = new Set(tokenize(sentence).filter((word) => !policy.has(word)));
    if (!words.size) continue;
    const base = new Set([...words].filter((word) => questionTerms.has(word)));
    let bestCovered = base.size;
    for (const cardSets of perCard) {
      let remaining = new Set([...words].filter((word) => !base.has(word)));
      let covered = base.size;
      for (let round = 0; round < 2; round += 1) {
        if (!remaining.size || !cardSets.length) break;
        let best = cardSets[0];
        let bestHits = overlap(remaining, best);
        for (const terms of cardSets.slice(1)) {
          const hits = overlap(remaining, terms);
          if (hits > bestHits) {
            best = terms;
            bestHits = hits;
          }
        }
        covered += bestHits;
        remaining = new Set([...remaining].filter((word) => !best.has(word)));
      }
      bestCovered = Math.max(bestCovered, covered);
    }
    const support = bestCovered / words.size;
    if (support < worst[0]) worst = [support, sentence];
  }
  return worst;
};

const unsupportedDenials = (answer: string, cards: Card[], question: string): string[] => {
  const factsLow = formatFacts(cards).toLowerCase();
  const factTerms = new Set(tokenize(factsLow));
  const questionTerms = new Set(tokenize(question));
  const negatedCards: Set<string>[] = [];
  for (const card of cards) {
    const title = new Set(tokenize(card.title));
    for (const sentence of sentences(card.text)) {
      if (NEGATION.test(sentence)) {
        negatedCards.push(new Set(tokenize(sentence).filter((word) => !title.has(word) && !policy.has(word))));
      }
    }
  }
  const bad: string[] = [];
  for (const sentence of sentences(answer)) {
    if (!NEGATION.test(sentence)) continue;
    const tokens = (sentence.match(NAME_TOKEN) ?? []).map(trimName);
    const names = tokens.filter(
      (token, index) => token.length >= 2 && isNameLike(token) && !(index === 0 && isPlainCapitalized(token)),
    );
    const aboutFacts = names.some((token) => factsLow.includes(token.toLowerCase()));
    const words = new Set(tokenize(sentence).filter((word) => !policy.has(word)));
    const fromQuestionOnly = [...words].some((word) => questionTerms.has(word) && !factTerms.has(word));
    const onlyFacts = words.size > 0 && [...words].every((word) => factTerms.has(word));
    if (fromQuestionOnly || !(aboutFacts || onlyFacts)) continue;
    if (!negatedCards.some((terms) => overlap(words, terms) > 0)) bad.push(sentence);
  }
  return bad;
};

const verify = (answer: string, cards: Card[], question: string): [boolean, string[]] => {
  if (!answer.trim()) return [false, ['empty answer']];
  const reasons: string[] = [];
  const names = unsupportedNames(answer, cards, question);
  if (names.length) reasons.push(`not in the facts: ${names.join(', ')}`);
  const ratio = supportRatio(answer, cards, question);
  if (ratio < MIN_SUPPORT) reasons.push(`only ${percent(ratio)} of the wording comes from the facts`);
  const [support, sentence] = weakestSentence(answer, cards, question);
  if (support < MIN_SENTENCE_SUPPORT) {
    reasons.push(`no card states this (${percent(support)} backed): ${head(sentence, 80)}`);
  }
  for (const denial of unsupportedDenials(answer, cards, question)) {
    reasons.push(`denies a documented subject without a card saying so: ${head(denial, 80)}`);
  }
  const named = cards.flatMap((card) => card.names ?? []).filter((name) => mentions(question, name));
  if (named.length && answer.toLowerCase().includes(SCOPE_MARK)) {
    reasons.push(`declines a question about a documented subject (${named[0]})`);
  }
  return [reasons.length === 0, reasons];
};

const ignoresBestCard = (answer: string, cards: Card[], question: string): boolean => {
  const low = answer.toLowerCase().replaceAll('’', "'");
  if (REFUSAL_MARKERS.some((marker) => low.includes(marker))) return false;
  const ranked = rank(question);
  if (!ranked.length || ranked[0].score < settings.strong_match || alwaysIds.has(ranked[0].card.id)) return false;
  const best = ranked[0].card;
  const questionTerms = new Set(tokenize(question));
  const facts = new Set(tokenize(answer).filter((word) => !policy.has(word) && !questionTerms.has(word)));
  if (facts.size < 2) return false;
  const support = new Map(cards.map((card) => [card.id, overlap(facts, new Set(tokenize(`${card.title} ${card.text}`)))]));
  const others = Math.max(0, ...[...support].filter(([id]) => id !== best.id).map(([, count]) => count));
  return (support.get(best.id) ?? 0) < others;
};

const check = (draft: string, cards: Card[], question: string): [boolean, string[]] => {
  const [ok, reasons] = verify(draft, cards, question);
  if (ok && ignoresBestCard(draft, cards, question)) return [false, ['the answer is not built from the best-matching card']];
  return [ok, reasons];
};

const cleanAnswer = (text: string): string =>
  text
    .replaceAll('**', '')
    .replaceAll('`', '')
    .replace(LIST_MARK, '')
    .replace(/[ \t]*\n+[ \t]*/g, ' ')
    .trim()
    .replace(META_LEAD, (_match, lead: string, first: string) => lead + first.toUpperCase());

export const respond = async (input: string, generate: (messages: Message[]) => Promise<string>): Promise<Reply> => {
  const question = input.trim();
  const ranked = rank(question);
  if (tokenize(question).length && !ranked.length) {
    return { answer: SCOPE_REPLY, source: 'gate', cards: [], reasons: ['no fact card matches'] };
  }
  const cards = retrieve(question);
  const cardIds = cards.map((card) => card.id);
  const messages = buildMessages(question, cards);
  const draft = cleanAnswer(await generate(messages));
  const [ok, reasons] = check(draft, cards, question);
  if (ok) return { answer: draft, source: 'model', cards: cardIds, reasons: [] };
  const namesSubject = cards.some((card) => (card.names ?? []).some((name) => mentions(question, name)));
  const weakMatch = (ranked[0]?.score ?? 0) < settings.weak_match;
  if (draft.toLowerCase().includes(SCOPE_MARK) && weakMatch && !namesSubject) {
    return { answer: SCOPE_REPLY, source: 'fallback', cards: cardIds, reasons, rejected: draft };
  }
  const retry = cleanAnswer(
    await generate([...messages, { role: 'assistant', content: draft }, { role: 'user', content: RETRY_PROMPT }]),
  );
  const [retryOk, retryReasons] = check(retry, cards, question);
  if (retryOk) return { answer: retry, source: 'model', cards: cardIds, reasons: [], retried: true };
  return {
    answer: answerFromCards(question, `${draft} ${retry}`),
    source: 'fallback',
    cards: cardIds,
    reasons: [...reasons, ...retryReasons],
    rejected: draft,
  };
};
