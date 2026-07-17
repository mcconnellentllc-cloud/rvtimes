import { NextRequest, NextResponse } from "next/server";
import { getKnowledge, getRvInfo, getMaintenance } from "@/lib/airtable";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Hit = {
  source: string;
  title: string;
  detail: string;
  score: number;
};

function scoreText(query: string, ...fields: string[]): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const terms = q.split(/\s+/).filter(Boolean);
  const hay = fields.join(" • ").toLowerCase();
  let score = 0;
  for (const t of terms) {
    if (hay.includes(t)) score += 1;
  }
  // exact phrase bonus
  if (hay.includes(q)) score += 2;
  return score;
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") || "";
  if (!query.trim()) {
    return NextResponse.json({ hits: [] });
  }

  const [knowledge, info, maintenance] = await Promise.all([
    getKnowledge(),
    getRvInfo(),
    getMaintenance(),
  ]);

  const hits: Hit[] = [];

  for (const k of knowledge) {
    const score = scoreText(query, k.question, k.answer, k.tags || "");
    if (score > 0) {
      hits.push({ source: "Q&A", title: k.question, detail: k.answer, score: score + 1 });
    }
  }

  for (const i of info) {
    const score = scoreText(query, i.category, i.item, i.value, i.notes || "");
    if (score > 0) {
      hits.push({
        source: `Info · ${i.category}`,
        title: i.item,
        detail: [i.value, i.notes].filter(Boolean).join(" — "),
        score,
      });
    }
  }

  for (const m of maintenance) {
    const score = scoreText(query, m.service, m.vendor || "", m.notes || "", m.date);
    if (score > 0) {
      hits.push({
        source: "Maintenance",
        title: `${m.service} (${m.date})`,
        detail: [m.vendor, m.cost, m.notes].filter(Boolean).join(" — "),
        score,
      });
    }
  }

  hits.sort((a, b) => b.score - a.score);
  return NextResponse.json({ hits: hits.slice(0, 25) });
}
