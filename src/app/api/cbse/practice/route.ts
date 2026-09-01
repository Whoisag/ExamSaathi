import { NextRequest, NextResponse } from "next/server";
import { getPracticeQuestions, PracticeQuestion } from "@/data/mock";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const exam = searchParams.get("exam") || "cbse-12";
    const subject = searchParams.get("subject") || "All";

    let questions = getPracticeQuestions(exam, subject);

    // Load CSV parsed questions
    try {
      const qPath = path.join(process.cwd(), "public", "data", "csv_questions.json");
      if (fs.existsSync(qPath)) {
        const fileContent = fs.readFileSync(qPath, "utf-8");
        const csvQuestions = JSON.parse(fileContent);
        
        let filteredCsv = csvQuestions;
        if (subject && subject !== "All") {
          filteredCsv = csvQuestions.filter((q: any) => q.subject.toLowerCase() === subject.toLowerCase());
        }
        
        const limitParam = searchParams.get("limit");
        const limit = limitParam ? parseInt(limitParam, 10) : undefined;
        
        if (limit && limit > 0) {
          const shuffled = filteredCsv.sort(() => 0.5 - Math.random());
          questions = [...questions, ...shuffled.slice(0, limit)];
        } else {
          questions = [...questions, ...filteredCsv];
        }
      }
    } catch (csvErr) {
      console.warn("Could not load CSV questions:", csvErr);
    }

    return NextResponse.json(questions);
  } catch (err) {
    console.warn("Error in practice API route:", err);
    return NextResponse.json(getPracticeQuestions("cbse-12"));
  }
}
