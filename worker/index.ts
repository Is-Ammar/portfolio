import { respond, type Message } from './grounding';

type Env = {
  AI: { run: (model: string, inputs: Record<string, unknown>) => Promise<unknown> };
  MODEL?: string;
  ALLOWED_ORIGINS?: string;
};

const DEFAULT_MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8-fast';
const MAX_BODY_CHARS = 4096;
const MAX_QUESTION_CHARS = 500;

const corsHeaders = (request: Request, env: Env): Record<string, string> => {
  const allowed = (env.ALLOWED_ORIGINS ?? '*').split(',').map((origin) => origin.trim());
  const origin = request.headers.get('Origin') ?? '';
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (allowed.includes('*')) headers['Access-Control-Allow-Origin'] = '*';
  else if (origin && allowed.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
};

const json = (status: number, payload: unknown, cors: Record<string, string>): Response =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

const readQuestion = async (request: Request): Promise<string | null> => {
  if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BODY_CHARS) return null;
  const body = await request.text();
  if (body.length > MAX_BODY_CHARS) return null;
  try {
    const question = (JSON.parse(body) as { question?: unknown } | null)?.question;
    return typeof question === 'string' ? question.trim().slice(0, MAX_QUESTION_CHARS) : '';
  } catch {
    return null;
  }
};

const generator =
  (env: Env) =>
  async (messages: Message[]): Promise<string> => {
    const output = await env.AI.run(env.MODEL || DEFAULT_MODEL, {
      messages,
      max_tokens: 220,
      temperature: 0,
      repetition_penalty: 1,
    });
    const result = output as { response?: unknown; choices?: { message?: { content?: unknown } }[] } | null;
    const text = typeof result?.response === 'string' ? result.response : result?.choices?.[0]?.message?.content;
    return typeof text === 'string' ? text : '';
  };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request, env);
    const path = new URL(request.url).pathname.replace(/\/+$/, '') || '/';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method === 'GET' && (path === '/' || path === '/health')) return json(200, { ok: true }, cors);
    if (request.method !== 'POST' || path !== '/chat') return json(404, { error: 'POST /chat' }, cors);
    const question = await readQuestion(request);
    if (question === null) return json(400, { error: 'send JSON: {"question": "..."}' }, cors);
    if (!question) return json(400, { error: 'empty question' }, cors);
    try {
      const { answer, source } = await respond(question, generator(env));
      return json(200, { answer, source }, cors);
    } catch (error) {
      console.error('chat failed', error);
      return json(503, { error: 'model unavailable' }, cors);
    }
  },
};
