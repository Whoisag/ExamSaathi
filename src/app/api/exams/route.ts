import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MOCK_EXAMS_LIST, ExamCardItem } from "@/data/mock";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && !supabaseAnonKey.includes("placeholder")) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Supabase exams query timeout")), 2000)
      );
      const queryPromise = supabase
        .from("exams")
        .select("*")
        .order("name", { ascending: true });

      const dbRes: any = await Promise.race([queryPromise, timeoutPromise]).catch(() => null);

      if (dbRes && !dbRes.error && dbRes.data && dbRes.data.length > 0) {
        const formatted: ExamCardItem[] = dbRes.data.map((e: any) => ({
          id: e.slug || e.id,
          name: e.name,
          slug: e.slug || e.id,
          authority: e.authority || "National Examination Board",
          difficulty: e.difficulty || "High",
          tagline: e.tagline || "Official Target Examination Track",
          subjects: e.subjects || ["Physics", "Chemistry", "Mathematics"],
          stats: {
            candidates: e.candidates || "10+ Lakh",
            totalMarks: e.total_marks || 300,
            shiftsPerYear: e.shifts_per_year || "10 Shifts",
            pyqRange: e.pyq_range || "2016 - 2025",
          },
        }));

        return NextResponse.json({
          success: true,
          source: "supabase",
          exams: formatted,
        });
      }
    }
  } catch (err) {
    console.warn("[/api/exams] Supabase query fallback to local catalogue:", err);
  }

  // Graceful fallback to verified exams list
  return NextResponse.json({
    success: true,
    source: "local_catalogue",
    exams: MOCK_EXAMS_LIST,
  });
}
