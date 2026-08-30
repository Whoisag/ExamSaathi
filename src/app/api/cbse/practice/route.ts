import { NextResponse } from "next/server";
import { getMockPracticeQuestions } from "@/data/mock";

export async function GET() {
  const questions = getMockPracticeQuestions();
  return NextResponse.json(questions);
}
