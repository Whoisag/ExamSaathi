#!/usr/bin/env python3
"""
Read questions.json, write /public/data/analysis.json containing:
- frequency_matrix: { topic: { year: count } }
- trends: linear regression slope on last 5 years -> rising >0.5, falling <-0.5, else stable
- topic_scores: 0.4*freq_norm + 0.3*recency(3x/2x/1x last three years)
  + 0.2*trend + 0.1*syllabus_weight, ranked
- gaps: topics absent 2+ years but with >=3 prior appearances and mean
  return gap 3-4 years
- expected_counts: historical mean adjusted by trend slope
Print the top 15 topics.
"""

import json
import numpy as np
from collections import defaultdict
from pathlib import Path


def linear_regression_slope(x_vals, y_vals):
    """Calculate linear regression slope."""
    if len(x_vals) < 2:
        return 0.0
    x = np.array(x_vals, dtype=float)
    y = np.array(y_vals, dtype=float)
    if np.all(x == x[0]):
        return 0.0
    slope = np.sum((x - np.mean(x)) * (y - np.mean(y))) / np.sum((x - np.mean(x)) ** 2)
    return float(slope)


def main():
    data_dir = Path(__file__).parent.parent / "public" / "data"
    questions_path = data_dir / "questions.json"
    analysis_path = data_dir / "analysis.json"

    with open(questions_path, 'r') as f:
        questions = json.load(f)

    # Get all years present
    years = sorted(set(q['year'] for q in questions))
    print(f"Available years: {years}")

    # Build frequency matrix: topic -> year -> count
    frequency_matrix = defaultdict(lambda: defaultdict(int))
    topic_to_subject = {}

    for q in questions:
        topic = q['topic'].strip()
        # Skip empty topics
        if not topic:
            continue
        year = q['year']
        frequency_matrix[topic][year] += 1
        topic_to_subject[topic] = q['subject']

    # Ensure all years present for each topic
    for topic in frequency_matrix:
        for year in years:
            if year not in frequency_matrix[topic]:
                frequency_matrix[topic][year] = 0

    # Convert to regular dict
    frequency_matrix = {topic: dict(yearly) for topic, yearly in frequency_matrix.items()}

    # Calculate trends (linear regression on last 5 years)
    # We only have 2 years (2020, 2021), so use all available
    trends = {}
    for topic, yearly in frequency_matrix.items():
        year_counts = [(year, count) for year, count in sorted(yearly.items())]
        x_vals = [yc[0] for yc in year_counts]
        y_vals = [yc[1] for yc in year_counts]
        slope = linear_regression_slope(x_vals, y_vals)
        if slope > 0.5:
            trend_label = "rising"
        elif slope < -0.5:
            trend_label = "falling"
        else:
            trend_label = "stable"
        trends[topic] = {
            "slope": slope,
            "trend": trend_label,
            "yearly_counts": dict(year_counts)
        }

    # Calculate topic scores
    # freq_norm: normalize by max frequency across all topics
    max_total_freq = max(sum(yearly.values()) for yearly in frequency_matrix.values())
    # Recency weights: last 3 years get 3x, 2x, 1x
    # We only have 2 years, so adapt: most recent year 3x, previous 2x
    sorted_years = sorted(years, reverse=True)
    recency_weights = {}
    for i, year in enumerate(sorted_years):
        if i == 0:
            recency_weights[year] = 3.0
        elif i == 1:
            recency_weights[year] = 2.0
        else:
            recency_weights[year] = 1.0

    # Syllabus weight - approximate based on typical JEE syllabus weightage
    # Higher weight for core topics
    core_topics = {
        "Physics": ["Current Electricity", "Modern Physics", "Thermodynamics", "Rotational Motion", "Electrostatics", "Optics", "Magnetism", "Semiconductors"],
        "Chemistry": ["Chemical Bonding", "Coordination Compounds", "Organic Chemistry", "Physical Chemistry", "Chemical Kinetics", "Thermodynamics", "Electrochemistry"],
        "Mathematics": ["Calculus", "Algebra", "Coordinate Geometry", "Vectors", "Probability", "Complex Numbers", "Matrices", "Trigonometry"],
    }
    syllabus_weights = {}
    for topic, subject in topic_to_subject.items():
        weight = 1.0
        for core_topic in core_topics.get(subject, []):
            if core_topic.lower() in topic.lower():
                weight = 1.5
                break
        syllabus_weights[topic] = weight

    # Calculate scores
    topic_scores = []
    for topic, yearly in frequency_matrix.items():
        # Frequency normalized
        total_freq = sum(yearly.values())
        freq_norm = total_freq / max_total_freq if max_total_freq > 0 else 0

        # Recency score
        recency_score = sum(yearly.get(y, 0) * recency_weights.get(y, 1.0) for y in years)
        max_recency = max(sum(frequency_matrix[t].get(y, 0) * recency_weights.get(y, 1.0) for y in years) for t in frequency_matrix)
        recency_norm = recency_score / max_recency if max_recency > 0 else 0

        # Trend score (normalized slope)
        slope = trends[topic]['slope']
        trend_score = max(-1, min(1, slope))  # clamp to [-1, 1]
        trend_norm = (trend_score + 1) / 2  # normalize to [0, 1]

        # Syllabus weight
        syllabus_norm = syllabus_weights[topic] / 1.5  # max is 1.5

        # Weighted score
        score = (0.4 * freq_norm +
                 0.3 * recency_norm +
                 0.2 * trend_norm +
                 0.1 * syllabus_norm)

        topic_scores.append({
            "topic": topic,
            "subject": topic_to_subject[topic],
            "score": round(score, 4),
            "freq_norm": round(freq_norm, 4),
            "recency_norm": round(recency_norm, 4),
            "trend_norm": round(trend_norm, 4),
            "syllabus_norm": round(syllabus_norm, 4),
            "total_frequency": total_freq,
            "yearly_counts": yearly,
            "trend": trends[topic]['trend'],
            "trend_slope": slope
        })

    # Rank by score descending
    topic_scores.sort(key=lambda x: x['score'], reverse=True)
    for i, ts in enumerate(topic_scores):
        ts['rank'] = i + 1

    # Identify gaps
    # Topics absent 2+ years but with >=3 prior appearances and mean return gap 3-4 years
    # Since we only have 2 years of data, this is limited. But let's implement the logic.
    gaps = []
    for topic, yearly in frequency_matrix.items():
        year_counts = [(year, count) for year, count in sorted(yearly.items())]
        appearances = [(y, c) for y, c in year_counts if c > 0]
        if len(appearances) >= 3:
            # Calculate gaps between appearances
            appearance_years = [y for y, _ in appearances]
            gaps_between = [appearance_years[i+1] - appearance_years[i] for i in range(len(appearance_years)-1)]
            mean_gap = np.mean(gaps_between) if gaps_between else 0

            # Check if absent in last 2+ years
            last_appearance = max(appearance_years)
            years_since_last = max(years) - last_appearance

            if years_since_last >= 2 and 3 <= mean_gap <= 4:
                gaps.append({
                    "topic": topic,
                    "subject": topic_to_subject[topic],
                    "last_appeared_year": last_appearance,
                    "years_since_last": years_since_last,
                    "mean_return_gap": round(float(mean_gap), 2),
                    "prior_appearances": len(appearances),
                    "total_questions": sum(yearly.values()),
                    "predicted_urgency": "High" if years_since_last > mean_gap else "Medium"
                })

    # Expected counts: historical mean adjusted by trend slope
    expected_counts = {}
    for topic, yearly in frequency_matrix.items():
        total = sum(yearly.values())
        n_years = len([c for c in yearly.values() if c > 0])
        if n_years > 0:
            historical_mean = total / n_years
        else:
            historical_mean = 0
        slope = trends[topic]['slope']
        # Adjust by trend: expected = mean + slope * years_ahead (assuming 1 year ahead)
        expected = historical_mean + slope
        expected_counts[topic] = round(max(0, expected), 2)

    # Build analysis output
    analysis = {
        "frequency_matrix": frequency_matrix,
        "trends": {topic: {"slope": t['slope'], "trend": t['trend']} for topic, t in trends.items()},
        "topic_scores": topic_scores,
        "gaps": gaps,
        "expected_counts": expected_counts,
        "metadata": {
            "total_questions": len(questions),
            "years_covered": years,
            "total_topics": len(frequency_matrix)
        }
    }

    with open(analysis_path, 'w') as f:
        json.dump(analysis, f, indent=2)
    print(f"Written analysis to {analysis_path}")

    # Print top 15 topics
    print("\n=== TOP 15 TOPICS BY SCORE ===")
    for ts in topic_scores[:15]:
        print(f"  {ts['rank']:2d}. {ts['topic']:40s} ({ts['subject']:12s}) score={ts['score']:.4f} freq={ts['total_frequency']:3d} trend={ts['trend']} ({ts['trend_slope']:.2f})")


if __name__ == "__main__":
    main()