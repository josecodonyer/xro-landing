const BASE = process.env.XRO_API_URL;
const SECRET = process.env.XRO_API_SECRET;

type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

async function call<T>(path: string, body: unknown): Promise<ApiResult<T>> {
  if (!BASE || !SECRET) {
    return { ok: false, status: 500, error: 'api_not_configured' };
  }
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SECRET}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
  } catch {
    return { ok: false, status: 0, error: 'network_error' };
  }

  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    return { ok: false, status: res.status, error: (json.error as string) ?? 'unknown_error' };
  }
  return { ok: true, data: json as T };
}

// ── Registro ──────────────────────────────────────────────────────────────────
export const registerPending = (b: {
  userid: string; email: string; user_pass: string; sex: 'M' | 'F'; code: string; expires_at: string;
}) => call<{ ok: true }>('/register/pending', b);

export const registerVerify = (b: { email: string; code: string }) =>
  call<{ ok: true }>('/register/verify', b);

// ── Login + account ───────────────────────────────────────────────────────────
export const login = (b: { userid: string; user_pass: string }) =>
  call<{ ok: true; account_id: number; userid: string; email: string }>('/login', b);

export const accountGet = (b: { account_id: number }) =>
  call<{ ok: true; account_id: number; userid: string; email: string; user_pass: string }>('/account/get', b);

// ── Characters ────────────────────────────────────────────────────────────────
export const charactersGet = (b: { account_id: number }) =>
  call<{ ok: true; characters: Array<{
    char_id: number; name: string; class: number; base_level: number;
    sex: 'M' | 'F';
    hair: number; hair_color: number; clothes_color: number;
    head_top: number; head_mid: number; head_bottom: number;
    weapon: number; shield: number;
  }> }>('/characters', b);

// ── Password change ───────────────────────────────────────────────────────────
export const passwordRequest = (b: {
  account_id: number; current_pass: string; code: string; expires_at: string;
}) => call<{ ok: true }>('/password/request', b);

export const passwordConfirm = (b: { account_id: number; code: string; new_pass: string }) =>
  call<{ ok: true }>('/password/confirm', b);

// ── Email change ──────────────────────────────────────────────────────────────
export const emailRequest = (b: {
  account_id: number; new_email: string; code: string; expires_at: string;
}) => call<{ ok: true }>('/email/request', b);

export const emailConfirm = (b: { account_id: number; code: string }) =>
  call<{ ok: true; new_email: string }>('/email/confirm', b);
