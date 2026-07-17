"use client";

import { useState } from "react";
import Nav from "@/components/Nav";

type Hit = { source: string; title: string; detail: string; score: number };

export default function AskPage() {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/ask?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setHits(data.hits || []);
    setLoading(false);
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Ask about your RV</h1>
        <p className="mt-1 text-sm text-slate-500">
          Search across your RV info, maintenance log, and saved Q&amp;A.
        </p>

        <form onSubmit={search} className="mt-6 flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. tire pressure, fresh water capacity, last oil change"
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand px-5 py-2 font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "…" : "Search"}
          </button>
        </form>

        {hits !== null && (
          <div className="mt-8 space-y-3">
            {hits.length === 0 ? (
              <p className="text-slate-500">
                No matches. Try different words, or add the answer to the{" "}
                <strong>Knowledge</strong> table in Airtable so it shows up next time.
              </p>
            ) : (
              hits.map((h, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand">
                    {h.source}
                  </span>
                  <h3 className="mt-1 font-semibold text-slate-900">{h.title}</h3>
                  {h.detail && <p className="mt-1 text-sm text-slate-600">{h.detail}</p>}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </>
  );
}
