import { NextRequest, NextResponse } from "next/server";
import { extractIntentLLM } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });

  try {
    const intent = await extractIntentLLM(text);
    return NextResponse.json({ intent });
  } catch (e: any) {
    console.error("Intent API error:", e);
    return NextResponse.json({
      intent: {
        emotions: [],
        intensity: "medium",
        energy: "medium",
        target: [],
        avoid: [],
        language: null,
        ratingMax: "PG-13",
        length: "feature",
      },
      warning: "Intent extraction failed, using fallback.",
    });
  }
}
