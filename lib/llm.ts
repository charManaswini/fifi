export async function extractIntentLLM(userText: string) {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return {
      emotions: [],
      intensity: "medium",
      energy: "medium",
      target: [],
      avoid: [],
      language: null,
      ratingMax: "PG-13",
      length: "feature",
    };
  }

  const system = `
You are a movie recommender AI. 
Your job: analyze what the user says and return a JSON intent object.
- If the user names a genre (e.g. horror, comedy, romance, thriller), ALWAYS include it in "target".
- If the user talks about mood (e.g. sad, happy, stressed, bad day), map that to "emotions".
- If the user mentions kids/child/family, set ratingMax to "PG" and target to include "family".
- Never recommend adult or erotic content if the user asks for wholesome / kid-friendly films.
- Always try to combine explicit genres + emotional vibe.
- If unclear, guess a reasonable intent.

Return ONLY valid JSON with this schema:
{
  "emotions": string[],
  "intensity": "low"|"medium"|"high",
  "energy": "low"|"medium"|"high",
  "target": string[],         // genres/keywords they explicitly want
  "avoid": string[],          // things they say they don't want
  "language": string|null,    // e.g. "en", "hi", "fr" if specified
  "ratingMax": "G"|"PG"|"PG-13"|"R",
  "length": "feature"|"series"
}
`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages: [
        { role: "system", content: system },
        { role: "user", content: userText },
      ],
      temperature: 0.3,
    }),
  });

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || "{}";

  try {
    const match = content.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : content);
  } catch {
    return {};
  }
}
