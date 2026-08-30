#!/usr/bin/env python3
"""
Load HuggingFace dataset "soughed/jee-main-questions" (physics, chemistry, mathematics configs).
Normalize into one table:
question_id, subject, topic, subtopic, year, difficulty, question_type.
Write /public/data/questions.json and /public/data/topics.json.
Print counts per subject and per year.
"""

import json
import re
from collections import defaultdict
from datasets import load_dataset
from pathlib import Path


def extract_year_from_paper(source_paper: str) -> int:
    """Extract year from source_paper filename."""
    # Try to find year in the filename
    year_match = re.search(r'(20\d{2}|19\d{2})', source_paper)
    if year_match:
        return int(year_match.group(1))

    # Some papers have dates like "24-8-2020" or "10 October" (assume 2020)
    date_match = re.search(r'(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})', source_paper)
    if date_match:
        date_str = date_match.group(1)
        parts = re.split(r'[-/]', date_str)
        if len(parts) == 3:
            year_part = parts[-1]
            if len(year_part) == 2:
                return 2000 + int(year_part)
            return int(year_part)

    # Month name papers without year - try to infer from pattern
    # "10 October", "30 October", "1Nov", "7 Jan", "15 Jan", "16 Jan" -> 2021 (JEE Main 2021)
    month_match = re.search(r'(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)', source_paper, re.IGNORECASE)
    if month_match:
        # Papers with month names but no year - likely 2020 or 2021
        # P-03 through P-24 are 2020, Ph-25+ are 2021
        if source_paper.startswith('Ph-') or source_paper.startswith('CH-2') or source_paper.startswith('CH-2') or source_paper.startswith('M-2'):
            return 2021
        return 2020

    # Default fallback
    return 2020


def normalize_topic(topic: str, subject: str) -> str:
    """Normalize topic names to handle case variations and duplicates."""
    if not topic or not topic.strip():
        return ""

    topic = topic.strip()

    # Topic normalization mapping (lowercase -> canonical)
    normalization_map = {
        # Physics
        'atomic physics': 'Atomic Physics',
        'kinetic theory of gases': 'Kinetic Theory of Gases',
        'kinetic theory of gasses': 'Kinetic Theory of Gases',
        'capacitor': 'Capacitance',
        'electromagnetic induction': 'EMI',
        'electronic devices': 'Semiconductors',
        'electronic device': 'Semiconductors',
        'magnetics': 'Magnetism',
        'mangetism': 'Magnetism',
        'mechanical properties of liquid': 'Mechanical Properties of Fluids',
        'mechanical properties of matter': 'Mechanical Properties of Fluids',
        'mechanical properties of solid': 'Mechanical Properties of Solids',
        'mechanical property of solids': 'Mechanical Properties of Solids',
        'modern physics': 'Modern Physics',
        'nuclear physics': 'Nuclear Physics',
        'rotational motion': 'Rigid Body Dynamics',
        'kinetic theory of gases': 'Kinetic Theory of Gases',
        'moving charges and': 'Moving Charges and Magnetism',
        'magnetic effect of current': 'Magnetic Effects of Current',
        'magnetic effects of current': 'Magnetic Effects of Current',
        'ray optics': 'Ray Optics',
        'wave optics': 'Wave Optics',
        'wave on string': 'Waves',
        'wave on a string': 'Waves',
        'system of particle': 'System of Particles',
        'system of particles': 'System of Particles',
        'centre of mass': 'Centre of Mass',
        'center of mass': 'Centre of Mass',
        'behaviour of perfect gases': 'Behaviour of Perfect Gases',
        'thermodynamic': 'Thermodynamics',
        'thermal properties of matter': 'Thermal Properties of Matter',
        'work power & energy': 'Work, Power & Energy',
        'unit and dimension': 'Units & Dimensions',
        'error analysis': 'Error Analysis',
        'newton\'s laws of motion': 'Newton\'s Laws of Motion',
        'projectile motion': 'Projectile Motion',
        'simple harmonic motion': 'Simple Harmonic Motion',
        'dual nature of matter': 'Dual Nature of Matter',
        'current electricity': 'Current Electricity',
        'electrostatics': 'Electrostatics',
        'ac circuit': 'AC Circuits',
        'gravitation': 'Gravitation',
        'elasticity': 'Elasticity',
        'sound wave': 'Sound Waves',
        'communication system': 'Communication Systems',
        'digital electronics': 'Digital Electronics',
        'e-m waves': 'EM Waves',
        'em wave': 'EM Waves',
        'emi': 'EMI',
        'semi-conductors': 'Semiconductors',
        'semiconductors': 'Semiconductors',

        # Chemistry
        'organic chemistry': 'Organic Chemistry',
        'physical chemistry': 'Physical Chemistry',
        'inorganic chemistry': 'Inorganic Chemistry',
        'chemical bonding': 'Chemical Bonding',
        'coordination compounds': 'Coordination Compounds',
        'chemical kinetics': 'Chemical Kinetics',
        'electrochemistry': 'Electrochemistry',
        'mole concept': 'Mole Concept',
        'equivalent concept': 'Equivalent Concept',
        'iupac nomenclature': 'IUPAC Nomenclature',
        'iupac nomenclature and structural isomerism': 'IUPAC & Structural Isomerism',
        'iupac and structural isomerism': 'IUPAC & Structural Isomerism',
        'structural isomerism': 'Structural Isomerism',
        'isomerism': 'Isomerism',
        'stereoisomerism': 'Stereoisomerism',
        'carbonayl compound (aldehyde and ketone)': 'Carbonyl Compounds',
        'carbonyl compound (aldehyde and ketone)': 'Carbonyl Compounds',
        'alcohol, phenol and ethers': 'Alcohols, Phenols & Ethers',
        'p-block va, via, viia elements': 'P-Block Elements',
        'p-block': 'P-Block Elements',
        's-block': 'S-Block Elements',
        'periodic table': 'Periodic Table',
        'atomic structure': 'Atomic Structure',
        'ideal gas': 'Ideal Gas',
        'real gas': 'Real Gas',
        'redox reaction': 'Redox Reactions',
        'surface chemistry': 'Surface Chemistry',
        'salt analysis': 'Salt Analysis',
        'eudiometry': 'Eudiometry',
        'halogen': 'Halogen Chemistry',
        'hydrocarbon': 'Hydrocarbons',

        # Mathematics
        'straight lines': 'Straight Lines',
        'circles': 'Circles',
        'conic sections': 'Conic Sections',
        '3d': '3D Geometry',
        'three dimension': '3D Geometry',
        'parabola': 'Parabola',
        'ellipse': 'Ellipse',
        'hyperbola': 'Hyperbola',
        'circle and parabola': 'Circles & Parabola',
        'vectors': 'Vectors',
        'vector': 'Vectors',
        'probability': 'Probability',
        'complex numbers': 'Complex Numbers',
        'functions': 'Functions',
        'limits': 'Limits',
        'limit': 'Limits',
        'continuity and differentiability': 'Continuity & Differentiability',
        'continuity and derivability': 'Continuity & Differentiability',
        'limits, continuity and differentiability': 'Limits, Continuity & Differentiability',
        'limits, continuity and derivability': 'Limits, Continuity & Differentiability',
        'differentiation': 'Differentiation',
        'differntiation': 'Differentiation',
        'application of derivative': 'Application of Derivatives',
        'application of derivatives': 'Application of Derivatives',
        'monotonocity': 'Monotonicity',
        'indefinite integration': 'Indefinite Integration',
        'indefinite integration': 'Indefinite Integration',
        'definite integration': 'Definite Integration',
        'integrals': 'Integration',
        'integration': 'Integration',
        'area under curve': 'Area Under Curve',
        'differential equation': 'Differential Equations',
        'differential equations': 'Differential Equations',
        'differcntiation': 'Differentiation',
        'quadratic equations': 'Quadratic Equations',
        'quadratic equation nature of roots': 'Quadratic Equations',
        'theory of equations': 'Theory of Equations',
        'thoery of equation': 'Theory of Equations',
        'sequences and series': 'Sequences & Series',
        'sequence & series': 'Sequences & Series',
        'series and progressions': 'Series & Progressions',
        'binomial theorem': 'Binomial Theorem',
        'permutations and combinations': 'Permutations & Combinations',
        'pemutation and combination': 'Permutations & Combinations',
        'matrix and determinant': 'Matrices & Determinants',
        'matrix and determinants': 'Matrices & Determinants',
        'matrix': 'Matrices',
        'trigonometry': 'Trigonometry',
        'trigonometric ratio & equations': 'Trigonometric Ratios & Equations',
        'trigonometric ratio and equation': 'Trigonometric Ratios & Equations',
        'compound angles': 'Compound Angles',
        'inverse trigonometric functions': 'Inverse Trigonometric Functions',
        'itf': 'Inverse Trigonometric Functions',
        'properties of triangle': 'Properties of Triangles',
        'triangles': 'Properties of Triangles',
        'logarithm': 'Logarithms',
        'logarithm and its applications': 'Logarithms & Applications',
        'mathematical induction': 'Mathematical Induction',
        'mathematical reasoning': 'Mathematical Reasoning',
        'logical reasoning': 'Logical Reasoning',
        'sets': 'Sets',
        'set': 'Sets',
        'statistics': 'Statistics',
        'inequalities': 'Inequalities',
        'inequalities and absolute value': 'Inequalities & Absolute Value',
    }

    # Try exact match first (case-insensitive)
    topic_lower = topic.lower()
    if topic_lower in normalization_map:
        return normalization_map[topic_lower]

    # Return original if no match
    return topic


def main():
    output_dir = Path(__file__).parent.parent / "public" / "data"
    output_dir.mkdir(parents=True, exist_ok=True)

    all_questions = []
    subjects_count = defaultdict(int)
    years_count = defaultdict(int)
    topics_by_subject = defaultdict(set)

    for config in ['physics', 'chemistry', 'mathematics']:
        print(f"Loading {config}...")
        ds = load_dataset('soughed/jee-main-questions', config)

        for split_name, split_data in ds.items():
            for row in split_data:
                year = extract_year_from_paper(row['source_paper'])
                topic = normalize_topic(row['topic'], row['subject'])
                subtopic = row['subtopic'].strip() if row['subtopic'] else ""

                # Skip empty topics
                if not topic:
                    continue

                question = {
                    "question_id": row['question_id'],
                    "subject": row['subject'],
                    "topic": topic,
                    "subtopic": subtopic,
                    "year": year,
                    "difficulty": row['difficulty'],
                    "question_type": row['question_type'],
                }
                all_questions.append(question)

                subjects_count[row['subject']] += 1
                years_count[year] += 1
                topics_by_subject[row['subject']].add(topic)

    # Write questions.json
    questions_path = output_dir / "questions.json"
    with open(questions_path, 'w') as f:
        json.dump(all_questions, f, indent=2)
    print(f"Written {len(all_questions)} questions to {questions_path}")

    # Write topics.json
    topics_data = {
        "subjects": {
            subject: sorted(list(topics))
            for subject, topics in topics_by_subject.items()
        },
        "total_questions": len(all_questions),
        "subjects_count": dict(subjects_count),
        "years_count": dict(sorted(years_count.items())),
        "total_topics_per_subject": {
            subject: len(topics)
            for subject, topics in topics_by_subject.items()
        }
    }
    topics_path = output_dir / "topics.json"
    with open(topics_path, 'w') as f:
        json.dump(topics_data, f, indent=2)
    print(f"Written topics data to {topics_path}")

    # Print counts
    print("\n=== COUNTS PER SUBJECT ===")
    for subject, count in sorted(subjects_count.items()):
        print(f"  {subject}: {count}")

    print("\n=== COUNTS PER YEAR ===")
    for year, count in sorted(years_count.items()):
        print(f"  {year}: {count}")

    print(f"\nTotal questions: {len(all_questions)}")
    print(f"Total unique topics: {sum(len(t) for t in topics_by_subject.values())}")


if __name__ == "__main__":
    main()