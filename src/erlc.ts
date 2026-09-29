const API_BASE = 'https://api.erlc.gg';
const TIMEOUT_MS = 12_000;

export type ApiVersion = 'v1' | 'v2';

export type V2Includes = Partial<Record<
  'Players' | 'Staff' | 'JoinLogs' | 'Queue' | 'KillLogs' | 'CommandLogs' |
  'ModCalls' | 'EmergencyCalls' | 'Vehicles',
  boolean
>>;

export class ErlcApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
    public retryAfter?: number
  ) {
    super(message);
    this.name = 'ErlcApiError';
  }
}

function serverKey(): string {
  const value = process.env.ERLC_SERVER_KEY?.trim();
  if (!value) throw new Error('ERLC_SERVER_KEY is not configured');

  return value
    .replace(/^(?:server-key|bearer)(?:\s*[:=]\s*|\s+)/i, '')
    .trim();
}

async function request(path: string, init: RequestInit = {}): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'server-key': serverKey(),
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers
      }
    });

    const raw = await response.text();
    let body: unknown = null;

    if (raw) {
      try {
        body = JSON.parse(raw);
      } catch {
        body = raw;
      }
    }

    if (!response.ok) {
      const messages: Record<number, string> = {
        400: 'ER:LC rejected the request',
        403: 'Authentication failed. Check the server key.',
        422: 'The private server currently has no players',
        429: 'ER:LC API rate limit reached',
        500: 'ER:LC could not communicate with Roblox'
      };

      const retry = response.headers.get('retry-after');
      throw new ErlcApiError(
        response.status,
        messages[response.status] ?? `ER:LC API error ${response.status}`,
        body,
        retry ? Number(retry) : undefined
      );
    }

    return body;
  } finally {
    clearTimeout(timer);
  }
}

export async function getV2Server(includes: V2Includes = {}) {
  const query = new URLSearchParams();

  for (const [name, enabled] of Object.entries(includes)) {
    if (enabled) query.set(name, 'true');
  }

  return request(`/v2/server${query.size ? `?${query}` : ''}`);
}

export async function getV1(path: string) {
  const allowed = new Set([
    'server',
    'server/players',
    'server/staff',
    'server/joinlogs',
    'server/queue',
    'server/killlogs',
    'server/commandlogs',
    'server/modcalls',
    'server/bans',
    'server/vehicles'
  ]);

  if (!allowed.has(path)) throw new Error(`Unsupported v1 path: ${path}`);
  return request(`/v1/${path}`);
}

export async function runCommand(command: string, version: ApiVersion = 'v2') {
  const normalized = command.trim();

  if (!normalized) throw new Error('Command cannot be empty');
  if (normalized.length > 500) throw new Error('Command is too long');

  return request(`/${version}/server/command`, {
    method: 'POST',
    body: JSON.stringify({ command: normalized })
  });
}
