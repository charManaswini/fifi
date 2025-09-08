// components/classic-filters.tsx
"use client";

import { useState } from "react";
import Button from "@/components/ui/button";

const GENRES = [
  { id: "28", name: "Action" },
  { id: "35", name: "Comedy" },
  { id: "18", name: "Drama" },
  { id: "10749", name: "Romance" },
  { id: "27", name: "Horror" },
];

export default function ClassicFilters() {
  const [genre, setGenre] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!genre) return;
    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filters: { genre } }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-3">Browse by Genre</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {GENRES.map((g) => (
          <button
            key={g.id}
            className={`px-3 py-1 rounded-md border ${
              genre === g.id ? "bg-[var(--brand)] text-white" : "border-zinc-600"
            }`}
            onClick={() => setGenre(g.id)}
          >
            {g.name}
          </button>
        ))}
      </div>
      <Button onClick={handleSearch}>Search</Button>

      {loading && <p className="mt-4 text-zinc-400">Loading…</p>}
      {results.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {results.map((m) => (
            <div key={m.id} className="border border-zinc-800 rounded-lg p-2">
              <img src={m.poster} alt={m.title} className="w-full h-56 object-cover rounded-md" />
              <div className="mt-2 text-sm">
                <p className="font-semibold">{m.title}</p>
                <p className="text-zinc-400 text-xs">{m.rationale}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
