"use client";

import { useState } from "react";
import Carousel from "@/components/carousel";

export default function MoodForm() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  async function handleGo() {
    if (!text.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const intentRes = await fetch("/api/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const { intent } = await intentRes.json();

      const searchRes = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, text }), // ← include raw text
});

      const { results } = await searchRes.json();
      setResults(results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full flex justify-center">
      <div className="w-full max-w-5xl px-4">
        {/* textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='e.g., "Had a rough day, want something comforting and hopeful."'
          className="fifi-textarea"
        />

        {/* centered button outside the box */}
        <div className="mt-6 flex justify-center">
          <button className="fifi-btn" onClick={handleGo}>Find my vibe</button>
        </div>

        {/* loading & results */}
        {loading && <p className="text-gray-400 mt-6">Finding your film…</p>}

        {!loading && results.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl section-title mb-3">Your Matches</h2>
            <Carousel movies={results} />
          </div>
        )}
      </div>
    </section>
  );
}
