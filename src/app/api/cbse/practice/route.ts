import { NextResponse } from "next/server";
import { getMockPracticeQuestions, PracticeQuestion } from "@/data/mock";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const qPath = path.join(process.cwd(), "public", "data", "questions.json");
    if (fs.existsSync(qPath)) {
      const allQuestions = JSON.parse(fs.readFileSync(qPath, "utf-8"));
      if (Array.isArray(allQuestions) && allQuestions.length > 0) {
        // Map canonical questions to PracticeQuestion format
        const formatted: PracticeQuestion[] = allQuestions.slice(0, 40).map((q: any, idx: number) => {
          const rawSubj = (q.subject || "Physics").toLowerCase();
          const subject =
            rawSubj.includes("chem")
              ? "Chemistry"
              : rawSubj.includes("math")
              ? "Mathematics"
              : "Physics";

          const rawDiff = (q.difficulty || "medium").toLowerCase();
          const difficultyBadge =
            rawDiff === "easy" ? "Easy" : rawDiff === "hard" ? "Hard" : "Medium";

          return {
            id: q.id || `pr-${idx + 1}`,
            subject,
            chapter: q.chapter || "Core Physics",
            year: Number(q.year) || 2024,
            marks: Number(q.marks) || 4,
            questionType: q.type || "Multiple Choice",
            difficulty: difficultyBadge,
            questionText: q.question_latex || q.question || "Calculate the standard quantity given the parameters.",
            sourceType: "ai_generated" as const,
            analyzerTags: [q.topic || "Core Syllabus", `${q.exam || "CBSE"} PYQ`],
          };
        });

        if (formatted.length > 0) {
          return NextResponse.json(formatted);
        }
      }
    }
  } catch (err) {
    console.warn("Could not read questions.json for /api/cbse/practice, using mock:", err);
  }

  const questions = getMockPracticeQuestions();
  return NextResponse.json(questions);
}
