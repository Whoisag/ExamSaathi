import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getMockChapters, ChapterItem } from "@/data/mock";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const examSlug = (searchParams.get("exam") || "jee-main").toLowerCase();

  // 1. Try querying Supabase with strict 2-second timeout
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && !supabaseAnonKey.includes("placeholder")) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Supabase chapters query timeout")), 2000)
      );
      const queryPromise = supabase
        .from("chapters")
        .select("*")
        .eq("exam_id", examSlug);

      const dbRes: any = await Promise.race([queryPromise, timeoutPromise]).catch(() => null);

      if (dbRes && !dbRes.error && dbRes.data && dbRes.data.length > 0) {
        const formatted: ChapterItem[] = dbRes.data.map((c: any) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          subject: c.subject,
          examId: examSlug,
          questionCount: c.question_count || 30,
          weightagePercent: Number(c.weightage_percent) || 8.0,
          formulaCount: c.formula_count || 10,
          pyqFrequency: c.pyq_frequency || "High",
          difficulty: c.difficulty || "Moderate",
          trend: c.trend || "stable",
          description: c.description || `Official syllabus module for ${c.name}.`,
        }));

        return NextResponse.json({
          success: true,
          source: "supabase",
          exam: examSlug,
          chapters: formatted,
        });
      }
    }
  } catch (err) {
    console.warn("[/api/chapters] Supabase query fallback to local syllabus:", err);
  }

  // 2. Deterministic verified full syllabus fallback
  const fallbackChapters = getMockChapters(examSlug);
  return NextResponse.json({
    success: true,
    source: "local_syllabus",
    exam: examSlug,
    chapters: fallbackChapters,
  });
}
