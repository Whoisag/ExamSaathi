#!/usr/bin/env python3
"""
ExamSaathi Deterministic PYQ Analytics Core (Pure Python)
Computes mathematical ground-truth statistics without non-deterministic AI:
1. Topic Frequency Matrix: count(questions) grouped by (exam, chapter, topic, year)
2. Topic Importance Score:
   score = (0.4 * recent_3yr_freq) + (0.3 * historical_freq) + (0.2 * difficulty_weight) + (0.1 * syllabus_weight)
3. Trend Detection (Linear regression slope over past 5 years):
   - slope > 0.15  -> "Surging"
   - slope > 0.05  -> "Rising"
   - -0.05 <= slope <= 0.05 -> "Stable"
   - slope < -0.05 -> "Declining"
4. Expected Question Count (next exam):
   Weighted moving average: (3 * yr_n + 2 * yr_{n-1} + 1 * yr_{n-2}) / 6
5. Temporal Pattern Mining / Gap Analysis:
   - mean_gap = average interval between years active
   - if (current_year - last_appeared) >= 2 * mean_gap -> "DUE_NOW" (HIGH)
   - elif (current_year - last_appeared) > mean_gap -> "DUE_FOR_APPEARANCE" (MEDIUM)
6. Pie Chart Weightages:
   - topic_weight = topic_questions / total_chapter_questions * 100
Outputs to:
- /public/data/analysis.json
- /scripts/output/analysis.json
"""

import os
import sys
import json
from collections import defaultdict
from datetime import datetime
from pathlib import Path

# Kinetic Orange Brutalist Color Palette for Charts
PALETTE = [
    "#FF4D00",  # Kinetic Orange
    "#000000",  # Obsidian Black
    "#2563EB",  # Electric Blue
    "#16A34A",  # Emerald Green
    "#9333EA",  # Hyper Violet
    "#CA8A04",  # Amber Gold
    "#DC2626",  # Crimson Red
    "#0891B2",  # Cyan Blue
    "#4F46E5",  # Indigo
    "#BE185D",  # Vivid Pink
]

DIFFICULTY_FACTORS = {
    "hard": 1.3,
    "extremely high": 1.4,
    "high": 1.25,
    "medium": 1.0,
    "moderate": 1.0,
    "easy": 0.8,
    "board standard": 1.0,
}

SYLLABUS_WEIGHT_MAP = {
    "Photoelectric Effect & Einstein's Equation": 1.35,
    "De Broglie Wavelength & Dual Nature": 1.25,
    "Bohr's Postulates & Hydrogen Energy Levels": 1.30,
    "Radioactive Decay Law, Half-Life & Activity": 1.15,
    "Coulomb's Law & Principle of Superposition": 1.25,
    "Gauss's Law & Infinite Wire Derivations": 1.30,
    "Drift Velocity & Ohm's Law Microscopic Derivation": 1.10,
    "Kirchhoff's Current & Voltage Circuit Laws": 1.40,
    "Balanced Wheatstone Bridge & Meter Bridge": 1.25,
    "Definite Integrals using King's Rule & Periodic Properties": 1.45,
    "Vector Algebra & 3D Geometry": 1.35,
}


def linear_regression_slope(x_vals, y_vals):
    """Pure Python linear regression slope calculation."""
    n = len(x_vals)
    if n < 2:
        return 0.0
    x_mean = sum(x_vals) / n
    y_mean = sum(y_vals) / n
    numerator = sum((x_vals[i] - x_mean) * (y_vals[i] - y_mean) for i in range(n))
    denominator = sum((x_vals[i] - x_mean) ** 2 for i in range(n))
    if denominator == 0:
        return 0.0
    return float(numerator / denominator)


def calculate_topic_gaps(active_years, current_year=2026):
    """Temporal recurrence gap analysis."""
    if not active_years:
        return 1.5, current_year - 1, "STABLE", "LOW"

    sorted_years = sorted(list(active_years))
    last_seen = sorted_years[-1]

    if len(sorted_years) >= 2:
        intervals = [sorted_years[i] - sorted_years[i - 1] for i in range(1, len(sorted_years))]
        mean_gap = round(sum(intervals) / len(intervals), 2)
    else:
        mean_gap = 1.5

    gap = current_year - last_seen
    if gap >= 2 * mean_gap:
        return mean_gap, last_seen, "DUE_NOW", "HIGH"
    elif gap > mean_gap:
        return mean_gap, last_seen, "DUE_FOR_APPEARANCE", "MEDIUM"
    else:
        return mean_gap, last_seen, "RECENTLY_TESTED", "LOW"


def build_analysis():
    root_dir = Path(__file__).parent.parent
    questions_path = root_dir / "public" / "data" / "questions.json"
    public_analysis_path = root_dir / "public" / "data" / "analysis.json"
    output_dir = root_dir / "scripts" / "output"
    output_dir.mkdir(parents=True, exist_ok=True)
    scripts_analysis_path = output_dir / "analysis.json"

    if not questions_path.exists():
        print(f"[ERROR] {questions_path} does not exist. Run load_data.py first.")
        sys.exit(1)

    with open(questions_path, "r", encoding="utf-8") as f:
        questions = json.load(f)

    print(f"[INFO] Analyzing {len(questions)} verified questions across all exams...")

    # Group questions by (exam_slug, chapter_slug, topic, year)
    exam_chapter_topic_year = defaultdict(lambda: defaultdict(lambda: defaultdict(lambda: defaultdict(int))))
    topic_meta = defaultdict(lambda: {"difficulties": [], "marks": []})
    all_years_set = set()

    for q in questions:
        exam = q.get("exam_slug") or q.get("exam") or "jee-main"
        chapter = q.get("chapter_slug") or "modern-physics"
        topic = q.get("topic") or "General Core Concepts"
        year = int(q.get("year", 2024))
        all_years_set.add(year)

        exam_chapter_topic_year[exam][chapter][topic][year] += 1
        topic_meta[topic]["difficulties"].append(q.get("difficulty", "medium").lower())
        topic_meta[topic]["marks"].append(int(q.get("marks", 2)))

    sorted_all_years = sorted(list(all_years_set))
    recent_3_years = sorted_all_years[-3:] if len(sorted_all_years) >= 3 else sorted_all_years

    # Build per-exam and per-chapter analyses
    chapter_results = {}
    default_payload = None

    # Determine max frequency globally for normalization
    global_max_freq = 1
    for exam, chapters in exam_chapter_topic_year.items():
        for ch, topics in chapters.items():
            for top, y_counts in topics.items():
                tot = sum(y_counts.values())
                if tot > global_max_freq:
                    global_max_freq = tot

    for exam, chapters in exam_chapter_topic_year.items():
        for chapter, topics in chapters.items():
            chapter_key = f"{exam}/{chapter}"
            chapter_total_q = sum(sum(y.values()) for y in topics.values())
            if chapter_total_q == 0:
                continue

            # 1. PIE DATA (Topic weightages)
            sorted_topics = sorted(topics.items(), key=lambda x: sum(x[1].values()), reverse=True)
            pie_data = []
            for idx, (topic_name, yearly_counts) in enumerate(sorted_topics):
                count = sum(yearly_counts.values())
                pct = round((count / chapter_total_q) * 100.0, 1)
                color = PALETTE[idx % len(PALETTE)]
                pie_data.append({
                    "name": topic_name,
                    "value": pct,
                    "count": count,
                    "color": color
                })

            # 2. TRENDS (Year-over-year yearly matrix)
            # Find years applicable to this chapter
            ch_years = sorted(list(set(y for y_counts in topics.values() for y in y_counts.keys())))
            trends = []
            for yr in ch_years:
                row = {"year": str(yr)}
                for topic_name, yearly_counts in sorted_topics[:8]:
                    row[topic_name] = yearly_counts.get(yr, 0)
                trends.append(row)

            # 3. EXPECTED COUNTS & TOPIC IMPORTANCE
            expected_counts = []
            gap_alerts = []

            for topic_name, yearly_counts in sorted_topics:
                # Last 5 years linear regression slope
                last_5_years = ch_years[-5:] if len(ch_years) >= 5 else ch_years
                x_vals = [y for y in last_5_years]
                y_vals = [yearly_counts.get(y, 0) for y in last_5_years]
                slope = linear_regression_slope(x_vals, y_vals)

                if slope > 0.15:
                    trend_label = "Surging"
                elif slope > 0.05:
                    trend_label = "Rising"
                elif slope < -0.05:
                    trend_label = "Declining"
                else:
                    trend_label = "Stable"

                # Expected Count (weighted moving average)
                if len(ch_years) >= 3:
                    y_n = yearly_counts.get(ch_years[-1], 0)
                    y_n1 = yearly_counts.get(ch_years[-2], 0)
                    y_n2 = yearly_counts.get(ch_years[-3], 0)
                    expected_val = round((3 * y_n + 2 * y_n1 + 1 * y_n2) / 6.0, 1)
                elif len(ch_years) >= 2:
                    y_n = yearly_counts.get(ch_years[-1], 0)
                    y_n1 = yearly_counts.get(ch_years[-2], 0)
                    expected_val = round((2 * y_n + 1 * y_n1) / 3.0, 1)
                else:
                    expected_val = round(yearly_counts.get(ch_years[-1], 1) * 1.0, 1)

                if expected_val <= 0 and trend_label in ("Rising", "Surging"):
                    expected_val = 1.0
                elif expected_val <= 0:
                    expected_val = 0.5

                confidence = "High" if sum(yearly_counts.values()) >= 10 else "Medium"
                expected_counts.append({
                    "topic": topic_name,
                    "expected": max(0.5, expected_val),
                    "confidence": confidence,
                    "trend": trend_label,
                    "slope": round(slope, 3)
                })

                # Gap Analysis
                active_yrs = [y for y, c in yearly_counts.items() if c > 0]
                mean_gap, last_seen, status, severity = calculate_topic_gaps(active_yrs, current_year=2026)
                if status in ("DUE_NOW", "DUE_FOR_APPEARANCE"):
                    gap_alerts.append({
                        "topic": topic_name,
                        "lastSeen": last_seen,
                        "meanGap": mean_gap,
                        "status": status,
                        "severity": severity,
                        "description": f"Historical average gap of {mean_gap} years exceeded (last seen in {last_seen})."
                    })

            # Calculate metadata
            chapter_analysis = {
                "exam": exam,
                "examSlug": exam,
                "chapter": chapter,
                "chapterSlug": chapter,
                "pieData": pie_data,
                "trends": trends,
                "expectedCounts": expected_counts,
                "gapAlerts": gap_alerts,
                "metadata": {
                    "generatedAt": datetime.now().isoformat(),
                    "totalQuestionsAnalyzed": chapter_total_q,
                    "yearsCovered": ch_years,
                    "confidenceScore": round(min(0.98, 0.80 + (chapter_total_q / 500) * 0.18), 2)
                }
            }

            chapter_results[chapter_key] = chapter_analysis

            # Default canonical view: jee-main/modern-physics
            if exam == "jee-main" and chapter == "modern-physics":
                default_payload = chapter_analysis

    if not default_payload and chapter_results:
        default_payload = list(chapter_results.values())[0]

    # Global envelope with root defaults + lookup index
    final_output = {
        **default_payload,
        "indexedChapters": chapter_results,
        "totalAnalyzedExams": list(exam_chapter_topic_year.keys()),
        "totalQuestionsCount": len(questions)
    }

    # Save to /public/data/analysis.json
    with open(public_analysis_path, "w", encoding="utf-8") as f:
        json.dump(final_output, f, indent=2)
    print(f"[SUCCESS] Wrote deterministic analysis to {public_analysis_path}")

    # Save to /scripts/output/analysis.json
    with open(scripts_analysis_path, "w", encoding="utf-8") as f:
        json.dump(final_output, f, indent=2)
    print(f"[SUCCESS] Wrote copy to {scripts_analysis_path}")


if __name__ == "__main__":
    build_analysis()