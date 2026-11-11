import { answerFromCards } from './retrieval';

const endpoint = (import.meta.env.VITE_PERSONA_API as string | undefined)?.replace(/\/+$/, '');

const REQUEST_TIMEOUT_MS = 25000;
const LOCAL_DELAY_MS = 420;

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const askServer = async (question: string): Promise<string | null> => {
  if (!endpoint) return null;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${endpoint}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    const answer = (data as { answer?: unknown }).answer;
    return typeof answer === 'string' && answer.trim() ? answer.trim() : null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
};

export const ask = async (question: string): Promise<string> => {
  const fromServer = await askServer(question);
  if (fromServer) return fromServer;
  await wait(LOCAL_DELAY_MS);
  return answerFromCards(question);
};
