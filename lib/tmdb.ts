const TMDB = "https://api.themoviedb.org/3";
const tokenOrKey = process.env.TMDB_API_KEY!;
if (!tokenOrKey) throw new Error("Missing TMDB_API_KEY");

const isV4 = tokenOrKey.startsWith("eyJ"); // JWT → v4 token

function toQS(params: Record<string, string | number>) {
  return new URLSearchParams(
    Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
  ).toString();
}

async function fetchWithRetry(url: string, init: RequestInit, tries = 3) {
  let lastErr: any;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { ...init, cache: "no-store" });
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      return r;
    } catch (e) {
      lastErr = e;
      await new Promise((res) => setTimeout(res, 300 * Math.pow(2, i)));
    }
  }
  throw lastErr;
}

async function t(path: string, params: Record<string, string | number> = {}) {
  const url = isV4
    ? `${TMDB}${path}?${toQS(params)}`
    : `${TMDB}${path}?${toQS({ api_key: tokenOrKey, ...params })}`;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (isV4) headers.Authorization = `Bearer ${tokenOrKey}`;

  const r = await fetchWithRetry(url, { method: "GET", headers });
  return r.json();
}

export async function tmdbDiscover(opts: {
  page?: number;
  with_genres?: string;
  with_original_language?: string;
  sort_by?: string;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
  certification_lte?: string;
  "vote_count.gte"?: number;
}) {
  return t("/discover/movie", opts as any);
}

export function posterUrl(path: string) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : "/placeholder.svg";
}
