"use client";

import React, { useState } from "react";
import { PlannedExam, ExamCategory, ExamType } from "@/data/plannerData";
import { X, Calendar, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface AddExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExam: (exam: PlannedExam) => void;
  defaultDate?: string;
  defaultExamCategory?: ExamCategory;
}

export function AddExamModal({
  isOpen,
  onClose,
  onAddExam,
  defaultDate,
  defaultExamCategory = "jee-main",
}: AddExamModalProps) {
  const [title, setTitle] = useState("");
  const [examType, setExamType] = useState<ExamType>("mock-test");
  const [examCategory, setExamCategory] = useState<ExamCategory>(defaultExamCategory);
  const [startDate, setStartDate] = useState(defaultDate || new Date().toISOString().split("T")[0]);
  const [timeSlot, setTimeSlot] = useState("9:00 AM – 12:00 PM");
  const [targetScore, setTargetScore] = useState("200+ / 300 Marks");
  const [selectedSubjects, setSelectedSubjects] = useState<("Physics" | "Chemistry" | "Mathematics" | "English" | "Computer Science")[]>([
    "Physics",
    "Chemistry",
    "Mathematics",
  ]);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please provide an exam or milestone title");
      return;
    }

    const typeColors: Record<ExamType, { color: string; badge: string }> = {
      national: { color: "#FF4D00", badge: "NATIONAL CBT" },
      "cbse-board": { color: "#000000", badge: "CBSE BOARD" },
      "mock-test": { color: "#059669", badge: "MOCK TEST" },
      "pre-board": { color: "#2563eb", badge: "SCHOOL PRE-BOARD" },
      revision: { color: "#7c3aed", badge: "REVISION SPRINT" },
    };

    const newExam: PlannedExam = {
      id: `custom-exam-${Date.now()}`,
      title: title.trim(),
      examType,
      examCategory,
      startDate,
      timeSlot: timeSlot.trim() || undefined,
      targetScore: targetScore.trim() || undefined,
      subjects: selectedSubjects,
      status: "upcoming",
      notes: notes.trim() || undefined,
      isOfficial: false,
      color: typeColors[examType].color,
      badgeLabel: typeColors[examType].badge,
    };

    onAddExam(newExam);
    toast.success("Exam milestone added to your planner!");
    onClose();
  };

  const toggleSubject = (sub: "Physics" | "Chemistry" | "Mathematics" | "English" | "Computer Science") => {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length === 1) return; // keep at least one
      setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs font-sans">
      <div className="bg-white border-2 border-black w-full max-w-lg shadow-[6px_6px_0px_0px_#000000] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#FF4D00] border-b-2 border-black p-4 flex items-center justify-between text-black">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-black" />
            <h3 className="font-headline text-lg tracking-tight">ADD EXAM / MOCK MILESTONE</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black hover:text-white border border-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="font-meta text-[11px] font-bold uppercase text-black block mb-1">
              Exam / Milestone Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Allen Mock Test 4, CBSE Pre-Board Physics, BITSAT Full Drill"
              required
              className="w-full bg-neutral-50 border-2 border-black p-2.5 text-xs font-sans focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-meta text-[11px] font-bold uppercase text-black block mb-1">
                Category
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as ExamType)}
                className="w-full bg-neutral-50 border-2 border-black p-2.5 text-xs font-sans focus:bg-white cursor-pointer"
              >
                <option value="mock-test">Coaching Mock Test</option>
                <option value="pre-board">School Pre-Board</option>
                <option value="cbse-board">CBSE Board Exam</option>
                <option value="national">National Exam (JEE/BITSAT)</option>
                <option value="revision">Targeted Revision Day</option>
              </select>
            </div>

            <div>
              <label className="font-meta text-[11px] font-bold uppercase text-black block mb-1">
                Target Track
              </label>
              <select
                value={examCategory}
                onChange={(e) => setExamCategory(e.target.value as ExamCategory)}
                className="w-full bg-neutral-50 border-2 border-black p-2.5 text-xs font-sans focus:bg-white cursor-pointer"
              >
                <option value="jee-main">JEE Main 2026</option>
                <option value="cbse-12">CBSE Class 12</option>
                <option value="bitsat">BITSAT</option>
                <option value="neet">NEET (UG)</option>
                <option value="other">School / General</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-meta text-[11px] font-bold uppercase text-black block mb-1">
                Exam Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full bg-neutral-50 border-2 border-black p-2 text-xs font-sans focus:bg-white"
              />
            </div>

            <div>
              <label className="font-meta text-[11px] font-bold uppercase text-black block mb-1">
                Shift / Time Slot
              </label>
              <input
                type="text"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="e.g. 9:00 AM – 12:00 PM"
                className="w-full bg-neutral-50 border-2 border-black p-2 text-xs font-sans focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="font-meta text-[11px] font-bold uppercase text-black block mb-1">
              Target Marks / Goal
            </label>
            <input
              type="text"
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              placeholder="e.g. 220+ / 300 or 95%+"
              className="w-full bg-neutral-50 border-2 border-black p-2 text-xs font-sans focus:bg-white"
            />
          </div>

          <div>
            <label className="font-meta text-[11px] font-bold uppercase text-black block mb-1">
              Subjects Included
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(["Physics", "Chemistry", "Mathematics", "English", "Computer Science"] as const).map((sub) => {
                const active = selectedSubjects.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleSubject(sub)}
                    className={`px-3 py-1 font-meta text-[10px] font-bold border-2 border-black transition-colors cursor-pointer ${
                      active ? "bg-[#FF4D00] text-black" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-meta text-[11px] font-bold uppercase text-black block mb-1">
              Notes & High-Yield Strategy
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Specific chapters to review, negative-marking rules, or revision targets..."
              className="w-full bg-neutral-50 border-2 border-black p-2 text-xs font-sans focus:bg-white"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t-2 border-black flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 border-black bg-neutral-100 hover:bg-neutral-200 text-black font-meta text-xs font-bold cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 border-2 border-black bg-black text-white hover:bg-[#FF4D00] hover:text-black font-meta text-xs font-bold transition-colors shadow-[2px_2px_0px_0px_#000000] cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>SAVE TO PLANNER</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
