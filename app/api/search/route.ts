import { NextRequest, NextResponse } from "next/server";
import { tmdbDiscover, posterUrl } from "@/lib/tmdb";
import {
  intentToGenres,
  intentToRuntime,
  ratingCap,
  lang,
  detectKidFriendly,
  detectMotivationSchool,
} from "@/lib/mapping";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TMDbParam = string | number | boolean;

function looksMotivationalSchoolish(title = "", overview = "") {
  const hay = `${title} ${overview}`.toLowerCase();
  return /(school|college|university|campus|class|exam|study|student|teacher|professor|coach|team|tournament|competition|scholar|debate|training|practice|discipline|focus|goal|ambition|success|persever|grit|comeback|inspir)/.test(
    hay
  );
}

async function fetchPages(baseParams: Record<string, TMDbParam>) {
  const [p1, p2] = await Promise.all([
    tmdbDiscover({ ...baseParams, page: 1 }),
    tmdbDiscover({ ...baseParams, page: 2 }),
  ]);
  return [...(p1?.results ?? []), ...(p2?.results ?? [])];
}

export async function POST(req: NextRequest) {
  const { intent, filters, text } = await req.json();

  try {
    const genres = filters?.genre || intentToGenres(intent, text);
    const { min, max } = intentToRuntime(intent);
    const kid = detectKidFriendly(text || "", intent);
    const eduMotiv = detectMotivationSchool(text || "", intent);

    // ---------- pass 1: strict (quality-first) ----------
    const baseParams1: Record<string, TMDbParam> = {
      with_genres: genres,
      with_runtime_gte: min,
      with_runtime_lte: max,
      certification_country: "US",
      certification_lte: ratingCap(intent, text),
      include_adult: false,
      "vote_count.gte": eduMotiv ? 800 : kid ? 500 : 200,
      sort_by: eduMotiv ? "vote_average.desc" : "popularity.desc",
    };
    if (kid) (baseParams1 as any).without_genres = "27,53,80,10749,18";
    else if (eduMotiv) (baseParams1 as any).without_genres = "10749,27,53";

    const language = lang(intent);
    if (language) (baseParams1 as any).with_original_language = language;

    let pool = await fetchPages(baseParams1);

    // post-filter by “school/coach/study” cues when in motivation mode
    if (eduMotiv) {
      const filtered = pool.filter((m: any) =>
        looksMotivationalSchoolish(m?.title, m?.overview)
      );
      if (filtered.length >= 6) pool = filtered;
    }

    // ---------- pass 2: relaxed (if too few) ----------
    if (pool.length < 6) {
      const baseParams2: Record<string, TMDbParam> = {
        with_genres: eduMotiv ? "18,99,10751,35" : genres, // broaden to drama/doc/family/comedy
        with_runtime_gte: min,
        with_runtime_lte: max,
        certification_country: "US",
        certification_lte: ratingCap(intent, text),
        include_adult: false,
        "vote_count.gte": 300,
        sort_by: "popularity.desc",
      };
      if (kid) (baseParams2 as any).without_genres = "27,53,80,10749,18";
      const more = await fetchPages(baseParams2);
      pool = [...pool, ...more];
    }

    // de-dupe
    const map = new Map<number, any>();
    for (const m of pool) map.set(m.id, m);
    const uniq = Array.from(map.values());

    // final safety for kid mode
    const finalSafe = uniq.filter((m: any) => {
      if (!kid) return true;
      const ids: number[] = m?.genre_ids || [];
      const bad = new Set([27, 53, 80, 18, 10749]); // horror/thriller/crime/drama/romance
      return !ids.some((g) => bad.has(g));
    });

    // shuffle
    for (let i = finalSafe.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalSafe[i], finalSafe[j]] = [finalSafe[j], finalSafe[i]];
    }

    // top 10
    const top = finalSafe.slice(0, 10).map((m: any) => ({
      id: m.id,
      title: m.title,
      overview: m.overview,
      poster: posterUrl(m.poster_path),
      year: (m.release_date || "").slice(0, 4),
      rationale: kid
        ? "Family-friendly picks based on your request."
        : eduMotiv
        ? "Inspiring school/college/coach themed picks."
        : "Matched to your request based on mood & genre.",
    }));

    return NextResponse.json({ results: top });
  } catch (e: any) {
    console.error("search error:", e);
    return NextResponse.json({ error: e?.message || "search failed" }, { status: 500 });
  }
}
