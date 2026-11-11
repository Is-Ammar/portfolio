import knowledge from './knowledge.json';

export type Card = {
  id: string;
  title: string;
  text: string;
  keywords?: string;
  names?: string[];
};

type Ranked = { card: Card; score: number };

export const settings = knowledge.retrieval;
const cards: Card[] = knowledge.cards;
export const always: Card[] = knowledge.always
  .map((id) => cards.find((card) => card.id === id))
  .filter((card): card is Card => Boolean(card));
const stopwords = new Set(settings.stopwords);

export const SCOPE_REPLY =
  "That's outside the scope of this portfolio. I only present my own work here. Ask me about my projects, my experience or my security work.";

const stem = (token: string): string => {
  if (token.length > 4 && token.endsWith('ies')) return `${token.slice(0, -3)}y`;
  if (token.endsWith('sses')) return token.slice(0, -2);
  let word = token;
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) word = word.slice(0, -1);
  if (word.length > 5 && word.endsWith('ing')) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith('ed')) return word.slice(0, -2);
  return word;
};

export const tokenize = (text: string): string[] => {
  const normalized = text
    .toLowerCase()
    .replaceAll('’', "'")
    .replaceAll('()', ' ')
    .replaceAll('-', ' ')
    .replaceAll('/', ' ');
  const tokens: string[] = [];
  for (const match of normalized.match(/[a-z0-9_+#.]+/g) ?? []) {
    const raw = match.replace(/^[.#]+|[.#]+$/g, '');
    if (!raw || stopwords.has(raw)) continue;
    tokens.push(stem(raw));
  }
  return tokens;
};

const repeat = (tokens: string[], times: number): string[] => Array.from({ length: times }, () => tokens).flat();

const documents = cards.map((card) => {
  const tokens = [
    ...repeat(tokenize(card.title), settings.title_weight),
    ...tokenize(card.text),
    ...repeat(tokenize(card.keywords ?? ''), settings.keyword_weight),
  ];
  const counts = new Map<string, number>();
  for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
  return { counts, length: tokens.length };
});

const averageLength = documents.reduce((sum, doc) => sum + doc.length, 0) / documents.length;

const inverseFrequency = new Map<string, number>();
for (const term of new Set(documents.flatMap((doc) => [...doc.counts.keys()]))) {
  const containing = documents.filter((doc) => doc.counts.has(term)).length;
  inverseFrequency.set(term, Math.log(1 + (documents.length - containing + 0.5) / (containing + 0.5)));
}

export const rank = (question: string): Ranked[] => {
  const terms = [...new Set(tokenize(question))].sort();
  const ranked: Ranked[] = [];
  cards.forEach((card, index) => {
    const { counts, length } = documents[index];
    let score = 0;
    for (const term of terms) {
      const frequency = counts.get(term) ?? 0;
      if (!frequency) continue;
      const norm = frequency + settings.k1 * (1 - settings.b + (settings.b * length) / averageLength);
      score += ((inverseFrequency.get(term) ?? 0) * frequency * (settings.k1 + 1)) / norm;
    }
    if (score > 0) ranked.push({ card, score });
  });
  return ranked.sort((a, b) => b.score - a.score || (a.card.id < b.card.id ? -1 : 1));
};

export const retrieve = (question: string): Card[] => {
  const ranked = rank(question);
  const chosen = [...always];
  if (!ranked.length) return chosen;
  const best = ranked[0].score;
  for (const { card, score } of ranked) {
    if (chosen.length - always.length >= settings.max_cards || score < best * settings.min_relative_score) break;
    if (!chosen.includes(card)) chosen.push(card);
  }
  return chosen;
};

const splitSentences = (text: string): string[] => {
  const parts: string[] = [];
  let start = 0;
  for (let index = 0; index < text.length; index += 1) {
    if ('.?!'.includes(text[index]) && /\s/.test(text[index + 1] ?? '')) {
      parts.push(text.slice(start, index + 1).trim());
      start = index + 1;
    }
  }
  const rest = text.slice(start).trim();
  if (rest) parts.push(rest);
  return parts;
};

const MAX_SENTENCES = 3;
const SHORT_CARD = 420;

export const answerFromCards = (question: string): string => {
  const terms = new Set(tokenize(question));
  const ranked = rank(question);
  if (terms.size > 0 && !ranked.length) return SCOPE_REPLY;

  const card = ranked.length ? ranked[0].card : always[0];
  if (card.text.length <= SHORT_CARD) return card.text;

  const sentences = splitSentences(card.text);
  const specific = sentences
    .map((sentence, index) => ({
      index,
      hits: new Set(tokenize(sentence).filter((token) => terms.has(token))).size,
    }))
    .filter((entry) => entry.index > 0 && entry.hits > 0)
    .sort((a, b) => b.hits - a.hits || a.index - b.index)
    .slice(0, MAX_SENTENCES)
    .map((entry) => entry.index)
    .sort((a, b) => a - b);

  if (!specific.length) return card.text;
  return [0, ...specific].map((index) => sentences[index]).join(' ');
};
