# ⚡ ExamSaathi (Exam साथी)

> **AI-Powered Predictive PYQ Analytics, Brutalist Practice Drill Engine & Socratic Strategy Tutor for CBSE Class 12 Boards & JEE Main 2026.**

![ExamSaathi Banner](https://img.shields.io/badge/ExamSaathi-2026%20Edition-FF4D00?style=for-the-badge&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-16.3%20Turbopack-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-3.6%20Flash-4285F4?style=for-the-badge&logo=google)
![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify)

---

## 📖 Overview

**ExamSaathi** is an advanced exam-readiness platform built for CBSE Class 12 Boards and JEE Main 2026 aspirants. Combining predictive past-year question (PYQ) intelligence, high-yield drill engines, and real-time AI mentoring, ExamSaathi helps students identify high-ROI quick wins, eliminate critical conceptual gaps, and master complex numerical derivations.

Designed in a high-contrast **Neo-Brutalist design language** (`#FF4D00` International Orange, sharp 2px black borders, hard drop shadows, and monospaced typography).

---

## 🌟 Key Features

### 1. 📂 Chapter-Wise Predictive Analysis & Trend Heatmaps
- Historical shift pattern tracking across JEE Main (2019–2025) and CBSE Class 12 Boards.
- Predicted topic recurrence probability scoring and marks weightage distribution.
- Interactive topic heatmaps color-coded by importance and gap severity.

### 2. 📋 Brutalist Practice Question Drill Engine (`/dashboard/practice`)
- **3,000+ Curated Unique Questions** covering 43 chapters in Physics, Chemistry, and Mathematics.
- **Zero-Duplicate Bank**: Distinct conceptual derivations, 5-markers, 3-markers, case studies, and numerical drills.
- **Interactive MCQ Option Selection**: Instant green/red feedback validation.
- **Attempt Tracking & Session Metrics**: Mark cards as `[GOT IT]`, `[WRONG]`, or `[SKIP]` with live accuracy rate tracking.
- **Collapsible Chapter Sidebar & Bookmarks Filter**: Save tricky problems for targeted revision.
- **Interactive Drill Stopwatch**: Timed solving sessions (`MM:SS`).
- **One-Click AI Tutor Link**: Instantly open the AI Mentor with the exact question context pre-loaded.

### 3. 📊 My Prep Hub & Web-Grounded Analysis (`/my-dashboard`)
- **Exam Readiness Score** ($0 - 100\%$) based on real practice attempts.
- **Weak Spots Analyzer**: Identifies high-stakes topics dragging accuracy down.
- **Quick Win Sprints**: 15–30 minute high-ROI formula drills for guaranteed marks.
- **Web Grounding Toggle**: Real-time Gemini web grounding for the latest 2026 PYQ shift patterns.

### 4. 💬 Socratic AI Strategy Tutor (`/assistant`)
- Context-aware mentor pre-loaded with student readiness metrics.
- Mathematical rendering with **KaTeX** and GitHub-style markdown formatting.
- Multi-tier AI failover architecture ensuring 99.9% uptime.

### 5. ∑ Interactive Formula Sheets (`/formulas`)
- High-yield formula cards organized by subject and chapter.
- LaTeX formula rendering, variables breakdown, and AI-powered formula explanation modals.

---

## 🏗️ System Architecture

```mermaid
graph TD
    A[Student / Client Browser] -->|App Router UI| B[Next.js 16 Frontend]
    B -->|Interactive Drills| C[Practice Question Engine]
    B -->|Confidence & Metrics| D[My Prep Hub]
    B -->|Formulas & Trends| E[Analytics Engine]
    
    C -->|API Requests| F[/api/cbse/practice]
    D -->|AI Analysis Requests| G[/api/prephub/analyze]
    B -->|Socratic Chat| H[/api/assistant]
    
    G --> I{AI Multi-Tier Failover}
    H --> I
    
    I -->|Tier 1 - Primary| J[Google Gemini 3.6 Flash + Grounding]
    I -->|Tier 2 - Fallback| K[OpenRouter MiniMax / Llama]
    I -->|Tier 3 - Offline Fallback| L[Academic Knowledge Base Synthesizer]
    
    F --> M[(JSON Question Bank - 3000+ Drills)]
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 16 (App Router + Turbopack)](https://nextjs.org/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Neo-Brutalist Design System |
| **Motion** | [Framer Motion v13](https://www.framer.com/motion/) |
| **Math Rendering** | [KaTeX](https://katex.org/) |
| **Charts & Visuals** | [Recharts](https://recharts.org/), [Three.js](https://threejs.org/), [Lucide React](https://lucide.dev/) |
| **Backend & DB** | [Supabase SSR](https://supabase.com/) |
| **AI Providers** | Google Gemini 3.6 Flash, OpenRouter AI, DeepMind Agentic Tooling |
| **Deployment** | [Netlify](https://www.netlify.com/) via `@netlify/plugin-nextjs` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (Node 22 recommended)
- npm / yarn / pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/examsaathi.git
   cd examsaathi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Authentication & Database
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Primary AI Engine (Google Gemini)
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-3.6-flash

   # Secondary AI Failover (OpenRouter)
   OPENROUTER_API_KEY=your_openrouter_api_key
   OPENROUTER_MODEL_ANALYSIS=minimax/minimax-m3:free
   OPENROUTER_MODEL_ASSISTANT=minimax/minimax-m3:free
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploy to Netlify

This project includes a pre-configured `netlify.toml` for zero-config Netlify deployments:

1. Push this repository to GitHub.
2. In the [Netlify Dashboard](https://app.netlify.com/), click **"Add new site"** → **"Import an existing project"**.
3. Select your `examsaathi` GitHub repository.
4. Add the environment variables from `.env.local` in the Netlify site settings.
5. Deploy!

---

## 📄 License

This project is open-source and licensed under the MIT License.

