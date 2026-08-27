"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import {
  ShieldCheck,
  Cpu,
  AlertTriangle,
  BookOpen,
  Scale,
  Sparkles,
  Layers,
  HelpCircle,
} from "lucide-react";

export default function AboutPage() {
  return (
    <AppShell
      title="Methodology, Ethics & Limitations"
      subtitle="How ExamSaathi models historical examination data, safeguards student well-being, and handles statistical uncertainty."
      breadcrumbs={[{ label: "About & Methodology" }]}
    >
      <div className="max-w-4xl space-y-10">
        {/* Section 1: Methodology */}
        <section className="bg-white rounded-[12px] p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 text-[#3730A3] pb-2 border-b border-slate-100">
            <Cpu className="w-5 h-5" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              1. Mathematical & Statistical Methodology
            </h2>
          </div>

          <div className="prose prose-slate text-sm leading-relaxed space-y-4 text-slate-600">
            <p>
              ExamSaathi avoids simplistic moving averages or naive keyword counting. Question distributions in high-stakes examinations like <strong>JEE Main</strong> and <strong>NEET</strong> are constrained by syllabus guidelines, shift balance parity, and committee question-bank rotations.
            </p>

            <h3 className="text-sm font-bold text-slate-900 pt-2">
              A. Poisson Cyclic Recurrence Modeling
            </h3>
            <p>
              We model the appearance of niche and secondary subtopics (e.g., *Helical Magnetic Trajectories* or *Potentiometer Null Points*) using a non-homogeneous Poisson process with a recurrence recovery term:
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-3 text-center overflow-x-auto">
              <KaTeXMath
                math="P(k \text{ appearances in } t \text{ shifts}) = \frac{(\lambda(t))^k e^{-\lambda(t)}}{k!}"
                block
                className="text-slate-900 font-bold"
              />
              <p className="text-xs text-slate-500 mt-2 font-sans">
                Where intensity parameter <KaTeXMath math="\lambda(t) = \lambda_0 \cdot \left[1 + \beta \cdot \max\left(0, \frac{\Delta t - T_{\text{mean}}}{T_{\text{mean}}}\right)\right]" /> increases as the elapsed interval <KaTeXMath math="\Delta t" /> exceeds the empirical historical mean return cycle <KaTeXMath math="T_{\text{mean}}" />.
              </p>
            </div>

            <h3 className="text-sm font-bold text-slate-900 pt-2">
              B. Dirichlet-Multinomial Topic Weight Allocation
            </h3>
            <p>
              Because each session must contain an exact total number of marks (e.g., 100 marks per subject in JEE Main), individual topic counts are negatively correlated Dirichlet draws:
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-3 text-center overflow-x-auto">
              <KaTeXMath
                math="\mathbf{w} \sim \text{Dirichlet}(\alpha_1 + n_1, \alpha_2 + n_2, \dots, \alpha_K + n_K)"
                block
                className="text-slate-900 font-bold"
              />
            </div>
            <p className="text-xs text-slate-500">
              Prior hyperparameters <KaTeXMath math="\alpha_k" /> represent NCERT curriculum hour weights, updated by verified posterior counts <KaTeXMath math="n_k" /> across 60+ historical shifts.
            </p>
          </div>
        </section>

        {/* Section 2: Ethical Considerations */}
        <section className="bg-white rounded-[12px] p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 text-[#059669] pb-2 border-b border-slate-100">
            <Scale className="w-5 h-5" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              2. Ethical Considerations & Student Well-Being
            </h2>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-slate-600">
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
              <h4 className="font-bold text-[#059669] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Anti-Gamble Pledge & No False Guarantees
              </h4>
              <p className="text-xs text-slate-700">
                ExamSaathi will <strong>never</strong> tell a student to skip a syllabus chapter entirely. Predicting that a topic has a 25% frequency does not mean it cannot appear in your specific morning shift. We strictly categorize suggestions as <em>"Prioritize First"</em> vs. <em>"Standard Foundation"</em>, never <em>"Skip"</em>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/80 space-y-2">
            <h4 className="font-bold text-[#3730A3] flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Socio-Economic Equity in High-Stakes Prep
            </h4>
            <p className="text-xs text-slate-700">
              In India, expensive Kota coaching institutions charge upwards of ₹2-3 Lakhs annually for private question bank trend analysis. ExamSaathi's mission is to democratize high-level statistical intelligence freely for self-study students across rural and tier-2/3 regions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-2">
            <h4 className="font-bold text-[#D97706] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Reducing Exam Stress & Cognitive Overload
            </h4>
            <p className="text-xs text-slate-700">
              Student anxiety peaks during the last 30 days before exam sessions. Providing structured confidence trackers, actionable quick-wins, and clean KaTeX formula summaries helps students focus on mastery rather than panic.
            </p>
          </div>
        </div>
        </section>

        {/* Section 3: Limitations */}
        <section className="bg-white rounded-[12px] p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 text-[#EA580C] pb-2 border-b border-slate-100">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              3. Structural Limitations & Black-Box Paper Setting
            </h2>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-slate-600">
            <ul className="space-y-3 list-disc pl-5">
              <li>
                <strong>NTA Unannounced Rationalization:</strong> When government bodies unexpectedly cut or add chapters (e.g., deletion of P-Block elements or Transistors), prior historical weights undergo structural breaks.
              </li>
              <li>
                <strong>Paper-Setter Randomness:</strong> Individual exam setting committees possess idiosyncratic preferences that cannot be predicted by past statistics alone.
              </li>
              <li>
                <strong>Shift Variance:</strong> Multiple shifts across 5 exam days mean some shifts will inherently have easier or non-standard question distributions.
              </li>
            </ul>

            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
              ⚠️ <strong>Official Disclaimer:</strong> ExamSaathi is an independent analytical tool for academic study planning and is not affiliated with, endorsed by, or partnered with the National Testing Agency (NTA), Central Board of Secondary Education (CBSE), or any government examination body.
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
