"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ConfidenceSelector } from "@/components/my-dashboard/ConfidenceSelector";
import { WeakSpots } from "@/components/my-dashboard/WeakSpots";
import { QuickWins } from "@/components/my-dashboard/QuickWins";
import {
  UserTopicConfidence,
  EXAMS,
  ExamId,
  getPrepHubData,
  serializePrepHubForAI,
  WeakSpotItem,
  QuickWinItem,
} from "@/data/mock";
import {
  Target,
  Trophy,
  Flame,
  RotateCcw,
  Zap,
  Sparkles,
  Globe,
  Loader2,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { downloadStudyGuidePdf } from "@/lib/pdfGenerator";
import toast from "react-hot-toast";

const SUBJECTS = ["All", "Physics", "Chemistry", "Mathematics"];

const PREP_EXAM_TABS: { id: ExamId; shortName: string }[] = [
  { id: "jee-main", shortName: "JEE MAIN 2026" },
  { id: "cbse-12", shortName: "CBSE CLASS 12 BOARDS" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

function inferSubject(topic: string, subject?: string): "Physics" | "Chemistry" | "Mathematics" {
  if (subject) {
    const s = subject.toLowerCase().trim();
    if (s === "physics" || s.startsWith("phys")) return "Physics";
    if (s === "chemistry" || s.startsWith("chem")) return "Chemistry";
    if (s === "mathematics" || s.startsWith("math")) return "Mathematics";
  }
  const t = topic.toLowerCase();
  // Physics keywords
  if (/optic|lens|mirror|wave|ray|current|circuit|magnetic|charge|electric|faraday|induction|rectifier|diode|semiconductor|photoelectric|atom|nuclei|bohr|rotational|dynamics|gravitation|friction|kinematic|thermodynamic|shm|oscillation|emf|ac\b|transformer|displacement|gauss|capacit/i.test(t)) {
    return "Physics";
  }
  // Chemistry keywords
  if (/solut|electrochem|nernst|kohlrausch|kinetic|arrhenius|coordination|cfse|ligand|haloalkan|alcohol|phenol|ether|aldehyd|keton|cannizzaro|aldol|amine|hoffmann|diazonium|biomolecule|protein|glucose|dna|polymer|transition|kmno|k2cr2|lanthanoid|equilibrium|ph\b|buffer|bonding/i.test(t)) {
    return "Chemistry";
  }
  // Math keywords
  if (/integral|derivative|calculus|matrix|determinant|vector|geometry|skew|plane|probability|bayes|relation|function|trig|linear programming|conic|parabola|circle|binomial|series|complex number|differential equation/i.test(t)) {
    return "Mathematics";
  }
  return "Physics";
}

function MyDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawExam = searchParams?.get("exam");
  
  const [currentExam, setCurrentExam] = useState<ExamId>(() => {
    if (rawExam && rawExam in EXAMS) return rawExam as ExamId;
    return "cbse-12";
  });
  
  const [topics, setTopics] = useState<UserTopicConfidence[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("All");

  // Gemini Live Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [webAnalysisEnabled, setWebAnalysisEnabled] = useState(false);
  const [dynamicWeakSpots, setDynamicWeakSpots] = useState<WeakSpotItem[] | null>(null);
  const [dynamicQuickWins, setDynamicQuickWins] = useState<QuickWinItem[] | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const runGeminiAnalysis = async (enableWeb: boolean, subjectToAnalyze = selectedSubject) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/prephub/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam: currentExam,
          subject: subjectToAnalyze,
          topics,
          enableWebAnalysis: enableWeb,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.weakSpots) && Array.isArray(data.quickWins)) {
          setDynamicWeakSpots(data.weakSpots);
          setDynamicQuickWins(data.quickWins);
          if (data.aiSummary) setAiSummary(data.aiSummary);
        }
      }
    } catch (err) {
      console.warn("Gemini dynamic analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleWebAnalysis = (enabled: boolean) => {
    setWebAnalysisEnabled(enabled);
    if (enabled) {
      runGeminiAnalysis(true, selectedSubject);
    } else {
      // When OFF: immediately restore the authentic academic syllabus database without web search
      setDynamicWeakSpots(null);
      setDynamicQuickWins(null);
      setAiSummary(null);
    }
  };

  // Sync exam with localStorage or search params
  useEffect(() => {
    if (rawExam === "jee-main" || rawExam === "cbse-12") {
      setCurrentExam(rawExam as ExamId);
      return;
    }
    try {
      const savedExam = localStorage.getItem("examsaathi_target_exam");
      if (savedExam === "jee-main" || savedExam === "cbse-12") {
        setCurrentExam(savedExam as ExamId);
        return;
      }
      const stored = localStorage.getItem("exam_saathi_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.targetExam === "jee-main" || u.targetExam === "cbse-12") {
          setCurrentExam(u.targetExam as ExamId);
        }
      }
    } catch {
      // fallback
    }
  }, [rawExam]);

  // Load saved confidence ratings from client storage on exam switch
  useEffect(() => {
    const defaultData = getPrepHubData(currentExam);
    try {
      const saved = localStorage.getItem(`examsaathi_confidence_${currentExam}`);
      if (saved) {
        const parsed: UserTopicConfidence[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge user-customized confidence values into complete syllabus list
          const savedMap = new Map<string, "mastered" | "revising" | "weak">();
          parsed.forEach((p) => {
            if (p.id) savedMap.set(p.id, p.confidence);
            if (p.topicName) savedMap.set(p.topicName, p.confidence);
          });
          const merged = defaultData.topics.map((t) => ({
            ...t,
            confidence: savedMap.get(t.id) || savedMap.get(t.topicName) || t.confidence,
          }));
          setTopics(merged);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not load saved topics:", e);
    }
    setTopics(defaultData.topics);
  }, [currentExam]);

  const handleConfidenceChange = (
    id: string,
    newConfidence: "mastered" | "revising" | "weak"
  ) => {
    setTopics((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, confidence: newConfidence } : t));
      try {
        localStorage.setItem(`examsaathi_confidence_${currentExam}`, JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save topic confidence:", e);
      }
      return updated;
    });
  };

  const prepHubData = getPrepHubData(currentExam);
  const rawWeakSpots = dynamicWeakSpots || prepHubData.weakSpots;
  const rawQuickWins = dynamicQuickWins || prepHubData.quickWins;

  // Calculations for summary stats (using the mutable topics state)
  const totalTopics = topics.length;
  const masteredCount = topics.filter((t) => t.confidence === "mastered").length;
  const revisingCount = topics.filter((t) => t.confidence === "revising").length;
  const weakCount = topics.filter((t) => t.confidence === "weak").length;
  const readinessScore = totalTopics > 0 
    ? Math.round(((masteredCount * 1.0 + revisingCount * 0.5) / totalTopics) * 100)
    : 0;

  const filteredTopics = selectedSubject === "All" 
    ? topics 
    : topics.filter(t => t.subject === selectedSubject);

  const filteredWeakSpots = rawWeakSpots
    .map((w) => ({ ...w, subject: inferSubject(w.topic, w.subject) }))
    .filter((w) => selectedSubject === "All" || w.subject.toLowerCase() === selectedSubject.toLowerCase());

  const filteredQuickWins = rawQuickWins
    .map((q) => ({ ...q, subject: inferSubject(q.topic, q.subject) }))
    .filter((q) => selectedSubject === "All" || q.subject.toLowerCase() === selectedSubject.toLowerCase());

  return (
    <AppShell
      currentExam={currentExam}
      title="My Personal Prep Hub"
      subtitle="Track your syllabus mastery, resolve high-stakes vulnerabilities, and bank quick-win marks."
      breadcrumbs={[{ label: "My Dashboard" }]}
      actionSlot={
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              toast.success(`Compiling official ${currentExam.toUpperCase()} syllabus cheatsheet...`);
              downloadStudyGuidePdf({
                title: `${currentExam === "cbse-12" ? "CBSE Class 12 Boards" : "JEE Main 2026"} — Complete Syllabus Study Guide`,
                subject: selectedSubject === "All" ? "PCM Sciences" : selectedSubject,
                exam: currentExam.toUpperCase(),
                chapter: "Personalized Prep Hub",
              });
            }}
            className="flex items-center gap-1.5 bg-black text-[#FF4D00] p-2 sm:px-3 border-2 border-black text-xs font-meta font-bold shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FF4D00] hover:text-black hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer"
            title="Download full revision cheatsheet (PDF)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1-CLICK</span> PDF
          </button>
          <button
            onClick={() => router.push(`/assistant?exam=${currentExam}&prepHub=1`)}
            className="flex items-center gap-1.5 bg-[#FF4D00] p-2 sm:px-3 border-2 border-black text-xs font-meta font-bold shadow-[2px_2px_0px_0px_#000000] text-black hover:bg-black hover:text-white hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>⚡ ASK AI TO PLAN</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* ── Kinetic Exam Switcher Bar ─────────────────────────────────── */}
        <div className="grid grid-cols-2 bg-black text-white p-1.5 border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
          {PREP_EXAM_TABS.map((exam) => {
            const isSelected = currentExam === exam.id;
            return (
              <button
                key={exam.id}
                onClick={() => {
                  setCurrentExam(exam.id);
                  localStorage.setItem("examsaathi_target_exam", exam.id);
                  // Reset dynamic analysis for new exam
                  setDynamicWeakSpots(null);
                  setDynamicQuickWins(null);
                }}
                className={`px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold tracking-wider uppercase whitespace-nowrap transition-all text-center flex items-center justify-center gap-2 ${
                  isSelected
                    ? "bg-[#FF4D00] text-black shadow-[2px_2px_0px_0px_#FFFFFF]"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <span>{exam.shortName}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse hidden sm:inline-block" />}
              </button>
            );
          })}
        </div>

        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* ── Kinetic Readiness Metric Strip ───────────────────────────── */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
            {/* Metric 1: Readiness Score */}
            <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 transition-all space-y-2 border-l-4 border-l-[#FF4D00] relative overflow-hidden group">
              <div className="flex items-center justify-between text-xs text-neutral-500 font-meta">
                <span className="font-bold uppercase tracking-wider text-black">Exam Readiness</span>
                <Target className="w-4 h-4 text-[#FF4D00]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-headline text-black tracking-tight">
                  {readinessScore}%
                </span>
                <span className="text-xs font-meta text-emerald-700 bg-emerald-100 px-1.5 py-0.2 border border-emerald-500 font-bold">
                  +6% THIS WEEK
                </span>
              </div>
              <div className="w-full bg-neutral-100 border border-black h-2.5 overflow-hidden">
                <div
                  className="bg-[#FF4D00] h-full transition-all duration-500 shadow-[0_0_8px_rgba(255,77,0,0.5)]"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>
              <p className="font-meta text-[10px] text-neutral-500">Real-time confidence weighted index</p>
            </div>

            {/* Metric 2: Mastered Chapters */}
            <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 transition-all space-y-2 relative overflow-hidden group">
              <div className="flex items-center justify-between text-xs text-neutral-500 font-meta">
                <span className="font-bold uppercase tracking-wider text-black">Mastered High-Yield</span>
                <Trophy className="w-4 h-4 text-black" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-headline text-black tracking-tight">
                  {masteredCount}
                </span>
                <span className="text-xs font-meta text-neutral-600 font-bold">/ {totalTopics} chapters</span>
              </div>
              <div className="flex items-center gap-1.5 font-meta text-[11px] text-neutral-700">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span>Average mock test accuracy ~88%</span>
              </div>
              <p className="font-meta text-[10px] text-neutral-500">Firmly in score retention zone</p>
            </div>

            {/* Metric 3: Critical Gaps */}
            <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 transition-all space-y-2 relative overflow-hidden group border-l-4 border-l-red-600">
              <div className="flex items-center justify-between text-xs text-neutral-500 font-meta">
                <span className="font-bold uppercase tracking-wider text-black">Attention Required</span>
                <Flame className="w-4 h-4 text-[#FF4D00]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-headline text-[#FF4D00] tracking-tight">
                  {weakCount}
                </span>
                <span className="text-xs font-meta text-red-600 bg-red-50 px-1.5 py-0.2 border border-red-300 font-bold">
                  HIGH VULNERABILITY
                </span>
              </div>
              <p className="font-meta text-[11px] text-neutral-700 font-bold">High-priority revision items</p>
              <p className="font-meta text-[10px] text-neutral-500">Resolve to prevent negative marking traps</p>
            </div>

            {/* Metric 4: In Active Revision */}
            <div className="bg-black text-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 transition-all space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-meta">
                <span className="font-bold uppercase tracking-wider text-[#FF4D00]">In Revision Loop</span>
                <RotateCcw className="w-4 h-4 text-[#FF4D00]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-headline text-white tracking-tight">
                  {revisingCount}
                </span>
                <span className="text-xs font-meta text-[#FF4D00] font-bold">TOPICS</span>
              </div>
              <p className="font-meta text-[11px] text-neutral-300">Next scheduled revision: Today</p>
              <p className="font-meta text-[10px] text-neutral-400">Spaced repetition queue active</p>
            </div>
          </motion.div>

          {/* Subject Filter Bar & Web Analysis Toggle Control Strip */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
            {/* Subject Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {SUBJECTS.map((subj) => {
                const count = subj === "All" ? topics.length : topics.filter(t => t.subject === subj).length;
                return (
                  <button
                    key={subj}
                    onClick={() => {
                      setSelectedSubject(subj);
                      if (webAnalysisEnabled) {
                        runGeminiAnalysis(true, subj);
                      }
                    }}
                    className={`px-4 py-2 border-2 border-black font-meta text-xs font-bold transition-all whitespace-nowrap shadow-[2px_2px_0px_0px_#000000] flex items-center gap-2 ${
                      selectedSubject === subj
                        ? "bg-black text-[#FF4D00]"
                        : "bg-white text-black hover:bg-neutral-100"
                    }`}
                  >
                    <span>{subj.toUpperCase()}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-sm ${
                      selectedSubject === subj ? "bg-[#FF4D00] text-black font-bold" : "bg-neutral-200 text-neutral-700"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Web Analysis Toggle Placed Above High-ROI Section */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => handleToggleWebAnalysis(!webAnalysisEnabled)}
                disabled={isAnalyzing}
                className={`font-meta text-xs font-bold px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-2 cursor-pointer ${
                  webAnalysisEnabled
                    ? "bg-black text-[#FF4D00]"
                    : "bg-white text-black hover:bg-neutral-100"
                }`}
                title="Toggle Gemini Web Search Grounding for real-time 2025/2026 PYQ shift patterns"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF4D00]" />
                ) : (
                  <Globe className={`w-3.5 h-3.5 ${webAnalysisEnabled ? "text-[#FF4D00]" : "text-black"}`} />
                )}
                <span>WEB ANALYSIS: {webAnalysisEnabled ? "ON" : "OFF"}</span>
                <span className={`w-2 h-2 rounded-full ${webAnalysisEnabled ? "bg-[#FF4D00] animate-pulse" : "bg-neutral-300"}`} />
              </button>
            </div>
          </motion.div>

          {/* 2-Column Section: Weak Spots & Quick Wins (Subject-Filtered & Gemini-Powered) */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeakSpots
              items={filteredWeakSpots}
              isLoading={false}
              isAnalyzing={isAnalyzing}
              isEmpty={filteredWeakSpots.length === 0}
              onReanalyze={() => runGeminiAnalysis(webAnalysisEnabled, selectedSubject)}
            />
            <QuickWins
              items={filteredQuickWins}
              isLoading={false}
              isAnalyzing={isAnalyzing}
              isEmpty={filteredQuickWins.length === 0}
              webAnalysisEnabled={webAnalysisEnabled}
            />
          </motion.div>

          {/* Confidence Selector Table (Subject-Filtered) */}
          <motion.div variants={itemVariants} className="space-y-4">
            <ConfidenceSelector
              topics={filteredTopics}
              onConfidenceChange={handleConfidenceChange}
              isLoading={false}
              isEmpty={filteredTopics.length === 0}
            />
          </motion.div>
        </motion.div>
      </div>
    </AppShell>
  );
}

export default function MyDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="border-2 border-black bg-white p-8 shadow-[4px_4px_0px_0px_#000000] font-headline text-lg uppercase">
            Loading Prep Hub...
          </div>
        </div>
      }
    >
      <MyDashboardContent />
    </Suspense>
  );
}

