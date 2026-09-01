"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { ExamCardItem } from "@/data/mock";

interface ExamCardProps {
  exam: ExamCardItem;
  isLoading?: boolean;
}

export function ExamCard({ exam, isLoading = false }: ExamCardProps) {
  if (isLoading) {
    return (
      <div className="border-brutal bg-neutral-100 p-6 animate-pulse space-y-4">
        <div className="h-4 bg-neutral-300 w-1/3"></div>
        <div className="h-8 bg-neutral-300 w-3/4"></div>
        <div className="h-16 bg-neutral-200 w-full"></div>
        <div className="h-10 bg-neutral-300 w-full"></div>
      </div>
    );
  }

  return (
    <div className="border-brutal bg-white p-6 sm:p-8 flex flex-col justify-between relative group hover:-translate-y-1 transition-all duration-200">
      {/* Top Status Tag */}
      <div className="flex items-center justify-between border-brutal-b pb-3 mb-5">
        <span className="font-meta text-xs font-bold text-[#FF4D00]">
          // {exam.authority}
        </span>
        <div className="flex items-center gap-1.5">
          {exam.status === "Upcoming" && (
            <span className="bg-[#FF4D00] text-black border border-black font-meta text-[10px] px-2 py-0.5 font-bold animate-pulse">
              COMING SOON
            </span>
          )}
          <span className="bg-black text-white font-meta text-[10px] px-2 py-0.5 font-bold">
            {exam.difficulty}
          </span>
        </div>
      </div>

      <div>
        {/* Title */}
        <h3 className="font-headline text-2xl sm:text-3xl text-black mb-2 group-hover:text-[#FF4D00] transition-colors">
          {exam.name}
        </h3>
        <p className="text-sm text-neutral-600 mb-6 line-clamp-2 leading-relaxed">
          {exam.tagline}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 bg-neutral-50 p-3.5 border-brutal mb-6 font-meta text-xs">
          <div>
            <span className="text-neutral-500 text-[10px] block">CANDIDATES</span>
            <span className="font-bold text-black">{exam.stats.candidates}</span>
          </div>
          <div>
            <span className="text-neutral-500 text-[10px] block">TOTAL MARKS</span>
            <span className="font-bold text-black">{exam.stats.totalMarks} Marks</span>
          </div>
          <div className="border-t border-neutral-200 pt-2 mt-1">
            <span className="text-neutral-500 text-[10px] block">DURATION</span>
            <span className="font-bold text-black">{exam.stats.duration}</span>
          </div>
          <div className="border-t border-neutral-200 pt-2 mt-1">
            <span className="text-neutral-500 text-[10px] block">SHIFTS / YR</span>
            <span className="font-bold text-black">{exam.stats.shiftsPerYear}</span>
          </div>
        </div>

        {/* Subjects Pills */}
        <div className="mb-6">
          <span className="font-meta text-[10px] text-neutral-500 block mb-1.5 uppercase font-bold">
            Track Subjects:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {exam.subjects.map((sub) => (
              <span
                key={sub}
                className="bg-white border-brutal px-2.5 py-1 font-meta text-[11px] text-black"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-brutal-t">
        {exam.status === "Upcoming" ? (
          <div className="space-y-2">
            <div className="w-full bg-neutral-200 text-neutral-600 py-3 border-brutal font-headline text-sm flex items-center justify-center gap-2 cursor-not-allowed select-none">
              <Clock className="w-4 h-4 text-neutral-500" />
              <span>COMING SOON</span>
            </div>
            <p className="font-meta text-[11px] text-center text-neutral-500 font-bold uppercase tracking-wider">
              [ DATASET & PREDICTION MODEL IN TRAINING ]
            </p>
          </div>
        ) : (
          <Link
            href={`/dashboard/exams/${exam.slug}/chapters`}
            className="w-full bg-[#FF4D00] text-black py-3 border-brutal font-headline text-sm hover:bg-black hover:text-[#FF4D00] transition-colors flex items-center justify-center gap-2"
          >
            <span>SELECT CHAPTERS & ANALYZE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
