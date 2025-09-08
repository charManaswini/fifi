// lib/mapping.ts

// TMDb genre ids
// 28 Action, 12 Adventure, 16 Animation, 35 Comedy, 80 Crime, 99 Documentary,
// 18 Drama, 10751 Family, 14 Fantasy, 36 History, 27 Horror, 10402 Music,
// 9648 Mystery, 10749 Romance, 878 Sci-Fi, 10770 TV Movie, 53 Thriller, 10752 War, 37 Western

export const GENRE_MAP: Record<string, string> = {
  // direct genres & synonyms
  action: "28",
  adventure: "12",
  animation: "16",
  cartoon: "16",
  anime: "16",
  comedy: "35",
  funny: "35",
  family: "10751",
  kids: "10751",
  child: "10751",
  children: "10751",
  fantasy: "14",
  history: "36",
  horror: "27",
  scary: "27",
  spooky: "27",
  thriller: "53",
  mystery: "9648",
  romance: "10749",
  romcom: "10749,35",
  drama: "18",
  documentary: "99",
  doc: "99",
  scifi: "878",
  "sci-fi": "878",
  sci: "878",
  war: "10752",
  western: "37",

  // vibes → genres
  uplifting: "35,18,10751",
  "feel-good": "35,10751",
  happy: "35,10751",
  comfort: "35,10751",
  inspirational: "18,99,10751",
  inspiring: "18,99,10751",
  motivate: "18,99,10751",
  motivation: "18,99,10751",
  motivational: "18,99,10751",
  cozy: "35,10751",
  chill: "35",
};

function tokenize(s: string): string[] {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function detectKidFriendly(text: string, intent: any) {
  const hay = `${text || ""} ${(intent?.target || []).join(" ")}`.toLowerCase();
  return /(kid|kids|child|children|family|cartoon|animation)/.test(hay);
}

// NEW: detect “motivation for school/college” vibe
export function detectMotivationSchool(text: string, intent?: any) {
  const hay = `${text || ""} ${(intent?.target || []).join(" ")}`.toLowerCase();
  const wantsMotivation = /(motivat|inspir|push|study|discipline|focus|goal|ambition)/.test(hay);
  const schoolish = /(school|college|university|campus|exam|class|teacher|coach|team|student|freshman|senior)/.test(hay);
  return wantsMotivation || schoolish;
}

function keywordsToGenres(tokens: string[]): string[] {
  const set = new Set<string>();
  for (const t of tokens) {
    if (GENRE_MAP[t]) {
      for (const id of GENRE_MAP[t].split(",")) set.add(id);
    }
  }
  return Array.from(set);
}

export function intentToGenres(intent: any, rawText?: string) {
  const bag = new Set<string>();

  const fromIntent = [
    ...(Array.isArray(intent?.target) ? intent.target : []),
    ...(Array.isArray(intent?.emotions) ? intent.emotions : []),
  ].map((s) => (typeof s === "string" ? s.toLowerCase() : ""));

  keywordsToGenres(fromIntent).forEach((id) => bag.add(id));
  keywordsToGenres(tokenize(rawText || "")).forEach((id) => bag.add(id));

  // Kid safety: force Family/Animation/Comedy, drop scary/drama-heavy
  if (detectKidFriendly(rawText || "", intent)) {
    bag.add("10751"); // Family
    bag.add("16");    // Animation
    bag.add("35");    // Comedy
    ["27", "53", "80", "18"].forEach((bad) => bag.delete(bad));
  }

  // Motivation/school bias: Drama + Documentary + Family + (some Comedy)
  if (detectMotivationSchool(rawText || "", intent)) {
    ["18", "99", "10751", "35"].forEach((id) => bag.add(id));
    // if user also said “horror” etc., drama/doc will still be included; we'll filter later.
  }

  if (!bag.size) bag.add("18"); // fallback drama
  return Array.from(bag).join(",");
}

export function intentToRuntime(intent: any) {
  if (intent?.length === "series") return { min: 85, max: 240 };
  return { min: 70, max: 150 };
}

export function ratingCap(intent: any, rawText?: string) {
  if (detectKidFriendly(rawText || "", intent)) return "PG";
  // Motivation/school: cap at PG-13 by default
  if (detectMotivationSchool(rawText || "", intent)) return "PG-13";
  return intent?.ratingMax || "PG-13";
}

export function lang(intent: any) {
  return intent?.language || undefined;
}
