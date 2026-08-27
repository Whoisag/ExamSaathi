// ExamSaathi Mock Data Architecture
// All data is mock/static for frontend shell presentation.

export type ExamId = "jee-main" | "neet" | "cbse-10" | "cbse-12" | "cuet";

export interface ExamInfo {
  id: ExamId;
  name: string;
  shortName: string;
  tagline: string;
  badge: string;
  color: string;
  bgLight: string;
  subjects: string[];
  totalCandidates: string;
  targetDate: string;
  totalMarks: number;
  duration: string;
  shiftsCount: string;
  pyqYearsRange: string;
}

export interface HeatmapTopic {
  id: string;
  name: string;
  category: string;
  yearsData: Record<number, { count: number; percentage: number }>;
}

export interface HeatmapData {
  years: number[];
  topics: HeatmapTopic[];
}

export interface TrendDataPoint {
  year: number;
  [topicKey: string]: number;
}

export interface TopicPrediction {
  id: string;
  topicName: string;
  category: string;
  rank: number;
  predictedProbability: number; // 0 to 100
  expectedQuestions: string; // e.g. "3-4"
  weightagePercent: number; // e.g. 12.5
  trend: "rising" | "falling" | "stable";
  trendReason: string;
  shiftCoverage: string; // e.g. "92% of shifts"
}

export interface GapAlertItem {
  id: string;
  topicName: string;
  subtopic: string;
  lastAppearedYear: number;
  recurrenceCycleYears: number; // e.g. 3.2
  overdueByYears: number; // e.g. 1.8
  predictedUrgency: "High" | "Medium" | "Low";
  marksAtStake: number;
  explanation: string;
}

export interface FormulaItem {
  id: string;
  name: string;
  chapter: string;
  latex: string;
  variables: { symbol: string; meaning: string; unit?: string }[];
  whenToUse: string;
  commonMistake: string;
  frequencyBadge: string; // e.g. "Appeared in 8/10 shifts"
  priority: "High" | "Medium" | "Low";
  tags: string[];
}

export interface UserTopicConfidence {
  id: string;
  topicName: string;
  chapter: string;
  subject: string;
  confidence: "mastered" | "revising" | "weak";
  lastRevisedDaysAgo: number;
  accuracyRate: number; // 0 to 100
}

export interface EvaluationMetricRow {
  examYear: string;
  sampleSize: string;
  mae: number;
  spearmanRho: number;
  precisionAt3: number; // percentage e.g. 100%
  precisionAt5: number; // percentage e.g. 90%
  precisionAt10: number; // percentage e.g. 84%
  status: "Validated" | "Benchmark";
}

// 1. All Exams Configuration
export const EXAMS: Record<ExamId, ExamInfo> = {
  "jee-main": {
    id: "jee-main",
    name: "JEE Main 2026",
    shortName: "JEE Main",
    tagline: "Joint Entrance Examination for Engineering Admissions (NTA)",
    badge: "14.2 Lakh Candidates",
    color: "#3730A3",
    bgLight: "#EEF2FF",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    totalCandidates: "14,26,000",
    targetDate: "Jan 24 - Feb 01, 2026",
    totalMarks: 300,
    duration: "180 mins",
    shiftsCount: "10 Shifts / Session",
    pyqYearsRange: "2019 - 2025 (60+ Papers)",
  },
  neet: {
    id: "neet",
    name: "NEET (UG) 2026",
    shortName: "NEET",
    tagline: "National Eligibility cum Entrance Test for Medical (NTA)",
    badge: "24.1 Lakh Candidates",
    color: "#059669",
    bgLight: "#ECFDF5",
    subjects: ["Biology", "Physics", "Chemistry"],
    totalCandidates: "24,08,000",
    targetDate: "May 03, 2026",
    totalMarks: 720,
    duration: "200 mins",
    shiftsCount: "Pen & Paper Single Shift",
    pyqYearsRange: "2017 - 2025 (15+ Papers)",
  },
  "cbse-12": {
    id: "cbse-12",
    name: "CBSE Class 12 Boards",
    shortName: "CBSE 12",
    tagline: "Senior School Certificate Examination (CBSE Board 2026)",
    badge: "16.8 Lakh Students",
    color: "#EA580C",
    bgLight: "#FFF7ED",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    totalCandidates: "16,80,000",
    targetDate: "Feb 15 - Apr 02, 2026",
    totalMarks: 100,
    duration: "180 mins",
    shiftsCount: "National + Delhi Sets (Set 1/2/3)",
    pyqYearsRange: "2018 - 2025 (All Regions)",
  },
  "cbse-10": {
    id: "cbse-10",
    name: "CBSE Class 10 Boards",
    shortName: "CBSE 10",
    tagline: "Secondary School Examination (CBSE Board 2026)",
    badge: "21.6 Lakh Students",
    color: "#D97706",
    bgLight: "#FFFBEB",
    subjects: ["Mathematics", "Science", "Social Science"],
    totalCandidates: "21,60,000",
    targetDate: "Feb 15 - Mar 18, 2026",
    totalMarks: 80,
    duration: "180 mins",
    shiftsCount: "National + International Sets",
    pyqYearsRange: "2018 - 2025 (Standard & Basic)",
  },
  cuet: {
    id: "cuet",
    name: "CUET (UG) 2026",
    shortName: "CUET",
    tagline: "Common University Entrance Test for Central Universities",
    badge: "13.5 Lakh Registrations",
    color: "#4F46E5",
    bgLight: "#EEF2FF",
    subjects: ["General Test", "Physics", "Chemistry", "Mathematics"],
    totalCandidates: "13,47,000",
    targetDate: "May 15 - May 31, 2026",
    totalMarks: 250,
    duration: "60 mins / Domain",
    shiftsCount: "Hybrid CBT & OMR Shifts",
    pyqYearsRange: "2022 - 2025 (All Slots)",
  },
};

// 2. Heatmap Mock Data (Topics x Years)
export const MOCK_HEATMAP_DATA: Record<string, HeatmapData> = {
  "jee-main-physics": {
    years: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
    topics: [
      {
        id: "rotational",
        name: "Rotational Dynamics & MOI",
        category: "Mechanics",
        yearsData: {
          2019: { count: 3, percentage: 10.0 },
          2020: { count: 4, percentage: 13.3 },
          2021: { count: 3, percentage: 10.0 },
          2022: { count: 4, percentage: 13.3 },
          2023: { count: 5, percentage: 16.7 },
          2024: { count: 4, percentage: 13.3 },
          2025: { count: 5, percentage: 16.7 },
        },
      },
      {
        id: "thermo",
        name: "Thermodynamics & KTG",
        category: "Thermal Physics",
        yearsData: {
          2019: { count: 3, percentage: 10.0 },
          2020: { count: 3, percentage: 10.0 },
          2021: { count: 4, percentage: 13.3 },
          2022: { count: 3, percentage: 10.0 },
          2023: { count: 4, percentage: 13.3 },
          2024: { count: 4, percentage: 13.3 },
          2025: { count: 4, percentage: 13.3 },
        },
      },
      {
        id: "current",
        name: "Current Electricity & Circuits",
        category: "Electrodynamics",
        yearsData: {
          2019: { count: 3, percentage: 10.0 },
          2020: { count: 4, percentage: 13.3 },
          2021: { count: 4, percentage: 13.3 },
          2022: { count: 5, percentage: 16.7 },
          2023: { count: 4, percentage: 13.3 },
          2024: { count: 5, percentage: 16.7 },
          2025: { count: 4, percentage: 13.3 },
        },
      },
      {
        id: "modern",
        name: "Modern Physics & Dual Nature",
        category: "Modern Physics",
        yearsData: {
          2019: { count: 4, percentage: 13.3 },
          2020: { count: 4, percentage: 13.3 },
          2021: { count: 5, percentage: 16.7 },
          2022: { count: 5, percentage: 16.7 },
          2023: { count: 6, percentage: 20.0 },
          2024: { count: 5, percentage: 16.7 },
          2025: { count: 6, percentage: 20.0 },
        },
      },
      {
        id: "optics",
        name: "Ray & Wave Optics",
        category: "Optics",
        yearsData: {
          2019: { count: 3, percentage: 10.0 },
          2020: { count: 3, percentage: 10.0 },
          2021: { count: 3, percentage: 10.0 },
          2022: { count: 3, percentage: 10.0 },
          2023: { count: 3, percentage: 10.0 },
          2024: { count: 4, percentage: 13.3 },
          2025: { count: 3, percentage: 10.0 },
        },
      },
      {
        id: "electrostatics",
        name: "Electrostatics & Capacitance",
        category: "Electrodynamics",
        yearsData: {
          2019: { count: 3, percentage: 10.0 },
          2020: { count: 2, percentage: 6.7 },
          2021: { count: 3, percentage: 10.0 },
          2022: { count: 4, percentage: 13.3 },
          2023: { count: 3, percentage: 10.0 },
          2024: { count: 3, percentage: 10.0 },
          2025: { count: 3, percentage: 10.0 },
        },
      },
      {
        id: "semiconductor",
        name: "Semiconductors & Logic Gates",
        category: "Electronics",
        yearsData: {
          2019: { count: 1, percentage: 3.3 },
          2020: { count: 1, percentage: 3.3 },
          2021: { count: 2, percentage: 6.7 },
          2022: { count: 1, percentage: 3.3 },
          2023: { count: 2, percentage: 6.7 },
          2024: { count: 2, percentage: 6.7 },
          2025: { count: 2, percentage: 6.7 },
        },
      },
      {
        id: "gravitation",
        name: "Gravitation & Planetary Motion",
        category: "Mechanics",
        yearsData: {
          2019: { count: 1, percentage: 3.3 },
          2020: { count: 2, percentage: 6.7 },
          2021: { count: 1, percentage: 3.3 },
          2022: { count: 2, percentage: 6.7 },
          2023: { count: 1, percentage: 3.3 },
          2024: { count: 2, percentage: 6.7 },
          2025: { count: 2, percentage: 6.7 },
        },
      },
    ],
  },
};

// 3. Trend Line Chart Data Points
export const MOCK_TREND_DATA: TrendDataPoint[] = [
  { year: 2019, modern: 13.3, current: 10.0, thermo: 10.0, rotational: 10.0, optics: 10.0 },
  { year: 2020, modern: 13.3, current: 13.3, thermo: 10.0, rotational: 13.3, optics: 10.0 },
  { year: 2021, modern: 16.7, current: 13.3, thermo: 13.3, rotational: 10.0, optics: 10.0 },
  { year: 2022, modern: 16.7, current: 16.7, thermo: 10.0, rotational: 13.3, optics: 10.0 },
  { year: 2023, modern: 20.0, current: 13.3, thermo: 13.3, rotational: 16.7, optics: 10.0 },
  { year: 2024, modern: 16.7, current: 16.7, thermo: 13.3, rotational: 13.3, optics: 13.3 },
  { year: 2025, modern: 20.0, current: 13.3, thermo: 13.3, rotational: 16.7, optics: 10.0 },
];

export const MOCK_TREND_TOPICS = [
  { key: "modern", name: "Modern Physics", color: "#3730A3" },
  { key: "rotational", name: "Rotational Motion", color: "#EA580C" },
  { key: "current", name: "Current Electricity", color: "#059669" },
  { key: "thermo", name: "Thermodynamics", color: "#D97706" },
  { key: "optics", name: "Optics", color: "#6366F1" },
];

// 4. Topic Predictor Ranked List
export const MOCK_PREDICTIONS: TopicPrediction[] = [
  {
    id: "pred-1",
    topicName: "Dual Nature & Photoelectric Effect",
    category: "Modern Physics",
    rank: 1,
    predictedProbability: 98,
    expectedQuestions: "2-3 Qs (8-12 Marks)",
    weightagePercent: 18.5,
    trend: "rising",
    trendReason: "Appeared in 100% of 2024 & 2025 shifts; post-rationalized syllabus weightage concentrated here.",
    shiftCoverage: "100% Shifts",
  },
  {
    id: "pred-2",
    topicName: "Current Electricity: Kirchhoff's Laws & Potentiometer Equivalents",
    category: "Electrodynamics",
    rank: 2,
    predictedProbability: 94,
    expectedQuestions: "2 Qs (8 Marks)",
    weightagePercent: 15.0,
    trend: "stable",
    trendReason: "Consistently tested as 1 theoretical/assertion + 1 numerical per session.",
    shiftCoverage: "95% Shifts",
  },
  {
    id: "pred-3",
    topicName: "Thermodynamics: First Law, P-V Cycles & Heat Engines",
    category: "Thermal Physics",
    rank: 3,
    predictedProbability: 91,
    expectedQuestions: "2 Qs (8 Marks)",
    weightagePercent: 14.2,
    trend: "rising",
    trendReason: "Carnot cycle questions shifted towards indicator diagrams & polytropic processes.",
    shiftCoverage: "90% Shifts",
  },
  {
    id: "pred-4",
    topicName: "Rotational Dynamics: MOI & Rolling Without Slipping",
    category: "Mechanics",
    rank: 4,
    predictedProbability: 86,
    expectedQuestions: "1-2 Qs (4-8 Marks)",
    weightagePercent: 11.0,
    trend: "stable",
    trendReason: "Standard staple question in Section B (Numerical response).",
    shiftCoverage: "88% Shifts",
  },
  {
    id: "pred-5",
    topicName: "Wave Optics: Young's Double Slit & Fringe Shifts",
    category: "Optics",
    rank: 5,
    predictedProbability: 79,
    expectedQuestions: "1-2 Qs (4-8 Marks)",
    weightagePercent: 9.5,
    trend: "rising",
    trendReason: "YDSE with mica sheet medium modification has cyclic 2-year resurgence pattern.",
    shiftCoverage: "80% Shifts",
  },
  {
    id: "pred-6",
    topicName: "Gravitation: Escape Velocity & Orbital Energy",
    category: "Mechanics",
    rank: 6,
    predictedProbability: 68,
    expectedQuestions: "1 Q (4 Marks)",
    weightagePercent: 6.5,
    trend: "falling",
    trendReason: "Kepler's laws questions reduced after 2024 syllabus cleanup.",
    shiftCoverage: "70% Shifts",
  },
];

// 5. Gap Alert Warning Cards
export const MOCK_GAP_ALERTS: GapAlertItem[] = [
  {
    id: "gap-1",
    topicName: "Magnetic Force on Moving Charge & Helical Motion",
    subtopic: "Pitch of helix & radius in combined E-B field",
    lastAppearedYear: 2021,
    recurrenceCycleYears: 3.2,
    overdueByYears: 1.8,
    predictedUrgency: "High",
    marksAtStake: 4,
    explanation: "Historically appears every ~3.2 years in JEE Main. Completely absent in 2022, 2023, and 2024. High probability for Session 1.",
  },
  {
    id: "gap-2",
    topicName: "Capacitors with Variable Dielectric Slab",
    subtopic: "Dielectric constant varying linearly with distance $k(x) = k_0(1 + \\alpha x)$",
    lastAppearedYear: 2022,
    recurrenceCycleYears: 2.1,
    overdueByYears: 1.2,
    predictedUrgency: "High",
    marksAtStake: 4,
    explanation: "Cyclic multi-shift gap pattern detected. Last tested in July 2022 Session 2 shift 1.",
  },
  {
    id: "gap-3",
    topicName: "Diffraction Due to Single Slit (Central Maxima Width)",
    subtopic: "Angular spread of central maxima vs wavelength dependency",
    lastAppearedYear: 2023,
    recurrenceCycleYears: 1.8,
    overdueByYears: 0.6,
    predictedUrgency: "Medium",
    marksAtStake: 4,
    explanation: "Moderate recurrence gap. Often rotated with YDSE intensity distribution questions.",
  },
];

// 6. Formula Cards Data (with KaTeX, Variables, When-To-Use, Mistakes)
export const MOCK_FORMULAS: FormulaItem[] = [
  {
    id: "f-1",
    name: "de Broglie Wavelength of Charged Particle",
    chapter: "Dual Nature of Matter",
    latex: "\\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2 m q V}}",
    variables: [
      { symbol: "h", meaning: "Planck's constant ($6.626 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$)" },
      { symbol: "m", meaning: "Rest mass of charged particle (kg)" },
      { symbol: "q", meaning: "Charge on particle (Coulombs)" },
      { symbol: "V", meaning: "Accelerating potential difference (Volts)" },
    ],
    whenToUse: "Use when an electron, proton, deuteron, or alpha particle is accelerated from rest through a potential difference V.",
    commonMistake: "Confusing the proton/alpha particle mass ratio ($m_\\alpha \\approx 4 m_p$) and charge ratio ($q_\\alpha = 2 q_p$).",
    frequencyBadge: "Tested in 9 of last 10 JEE shifts",
    priority: "High",
    tags: ["Modern Physics", "De Broglie", "High Yield"],
  },
  {
    id: "f-2",
    name: "Drift Velocity & Current Density Relation",
    chapter: "Current Electricity",
    latex: "I = n e A v_d \\quad \\implies \\quad j = \\sigma E = \\frac{n e^2 \\tau}{m} E",
    variables: [
      { symbol: "n", meaning: "Free electron number density (m$^{-3}$)" },
      { symbol: "e", meaning: "Elementary charge ($1.6 \\times 10^{-19}\\text{ C}$)" },
      { symbol: "A", meaning: "Cross-sectional area of conductor" },
      { symbol: "v_d", meaning: "Drift velocity of electrons" },
      { symbol: "\\tau", meaning: "Mean relaxation time between collisions" },
    ],
    whenToUse: "Use to evaluate microscopic transport properties, temperature dependence of resistance, or conductivity $\\sigma$.",
    commonMistake: "Forgetting that relaxation time $\\tau$ decreases with increasing temperature in metallic conductors.",
    frequencyBadge: "Tested in 8 of last 10 JEE shifts",
    priority: "High",
    tags: ["Current", "Microscopic", "Circuits"],
  },
  {
    id: "f-3",
    name: "Parallel Axis Theorem for Moment of Inertia",
    chapter: "Rotational Motion",
    latex: "I = I_{cm} + M d^2",
    variables: [
      { symbol: "I", meaning: "Moment of inertia about arbitrary target axis" },
      { symbol: "I_{cm}", meaning: "Moment of inertia about parallel axis strictly through Center of Mass" },
      { symbol: "M", meaning: "Total mass of rigid body" },
      { symbol: "d", meaning: "Perpendicular distance between the two parallel axes" },
    ],
    whenToUse: "Use only when the known axis passes through the CM. Both axes MUST be strictly parallel.",
    commonMistake: "Applying theorem between two arbitrary parallel axes where neither axis passes through the Center of Mass.",
    frequencyBadge: "Tested in 7 of last 10 JEE shifts",
    priority: "High",
    tags: ["Mechanics", "Rigid Body", "MOI"],
  },
  {
    id: "f-4",
    name: "Carnot Engine Thermal Efficiency",
    chapter: "Thermodynamics",
    latex: "\\eta = 1 - \\frac{Q_2}{Q_1} = 1 - \\frac{T_2}{T_1} = \\frac{W}{Q_1}",
    variables: [
      { symbol: "\\eta", meaning: "Cycle efficiency ($0 \\le \\eta < 1$)" },
      { symbol: "T_1", meaning: "Absolute temperature of source / hot reservoir (Kelvin)" },
      { symbol: "T_2", meaning: "Absolute temperature of sink / cold reservoir (Kelvin)" },
      { symbol: "W", meaning: "Net mechanical work done per cycle ($W = Q_1 - Q_2$)" },
    ],
    whenToUse: "Use to find maximum theoretical work or sink temperature for reversible thermodynamic cycles.",
    commonMistake: "Entering temperatures in Celsius instead of converting to absolute Kelvin ($T(K) = T(^\\circ C) + 273.15$).",
    frequencyBadge: "Tested in 6 of last 10 JEE shifts",
    priority: "Medium",
    tags: ["Thermodynamics", "Heat Engines"],
  },
  {
    id: "f-5",
    name: "Young's Double Slit Experiment (Fringe Width)",
    chapter: "Wave Optics",
    latex: "\\beta = \\frac{\\lambda D}{d}, \\quad y_n = n \\frac{\\lambda D}{d} \\quad (\\text{Bright Fringe})",
    variables: [
      { symbol: "\\beta", meaning: "Fringe width (distance between consecutive bright or dark fringes)" },
      { symbol: "\\lambda", meaning: "Wavelength of monochromatic light in medium" },
      { symbol: "D", meaning: "Distance from double slits to observation screen" },
      { symbol: "d", meaning: "Separation distance between the two coherent slits" },
    ],
    whenToUse: "Use when $d \\ll D$ and $\\lambda \\ll d$ to determine fringe positions, angular width, or film thickness shifts.",
    commonMistake: "Mixing up capital $D$ (screen distance $\\sim 1\\text{ m}$) with small $d$ (slit distance $\\sim 1\\text{ mm}$).",
    frequencyBadge: "Tested in 6 of last 10 JEE shifts",
    priority: "Medium",
    tags: ["Optics", "Interference"],
  },
  {
    id: "f-6",
    name: "Energy Stored in Charged Inductor & Magnetic Energy Density",
    chapter: "Electromagnetic Induction",
    latex: "U_B = \\frac{1}{2} L I^2, \\quad u_B = \\frac{B^2}{2 \\mu_0}",
    variables: [
      { symbol: "U_B", meaning: "Total stored magnetic potential energy (Joules)" },
      { symbol: "L", meaning: "Self-inductance of solenoid (Henries)" },
      { symbol: "I", meaning: "Instantaneous current through coil (Amperes)" },
      { symbol: "u_B", meaning: "Energy density per unit volume (J/m$^3$)" },
    ],
    whenToUse: "Use in LC oscillation energy conservation or magnetic field volume energy integration.",
    commonMistake: "Forgetting factor of $1/2$ or confusing with capacitor electrostatic energy density $\\frac{1}{2} \\varepsilon_0 E^2$.",
    frequencyBadge: "Tested in 4 of last 10 JEE shifts",
    priority: "Low",
    tags: ["Magnetism", "Inductance"],
  },
];

// 7. My Dashboard User State
export const MOCK_USER_TOPICS: UserTopicConfidence[] = [
  {
    id: "ut-1",
    topicName: "Dual Nature & Photoelectric Effect",
    chapter: "Dual Nature",
    subject: "Physics",
    confidence: "mastered",
    lastRevisedDaysAgo: 2,
    accuracyRate: 92,
  },
  {
    id: "ut-2",
    topicName: "Rotational Dynamics & MOI",
    chapter: "Rotational Motion",
    subject: "Physics",
    confidence: "weak",
    lastRevisedDaysAgo: 14,
    accuracyRate: 44,
  },
  {
    id: "ut-3",
    topicName: "Current Electricity: Kirchhoff & Meters",
    chapter: "Current Electricity",
    subject: "Physics",
    confidence: "revising",
    lastRevisedDaysAgo: 5,
    accuracyRate: 68,
  },
  {
    id: "ut-4",
    topicName: "Thermodynamic Indicator Diagrams",
    chapter: "Thermodynamics",
    subject: "Physics",
    confidence: "revising",
    lastRevisedDaysAgo: 7,
    accuracyRate: 74,
  },
  {
    id: "ut-5",
    topicName: "Ray Optics: Lenses & Total Internal Reflection",
    chapter: "Ray Optics",
    subject: "Physics",
    confidence: "weak",
    lastRevisedDaysAgo: 20,
    accuracyRate: 51,
  },
  {
    id: "ut-6",
    topicName: "Semiconductors: Diodes & Logic Gates",
    chapter: "Semiconductors",
    subject: "Physics",
    confidence: "mastered",
    lastRevisedDaysAgo: 3,
    accuracyRate: 88,
  },
];

export const MOCK_WEAK_SPOTS = [
  {
    id: "ws-1",
    topic: "Rotational Dynamics (Rolling Without Slipping)",
    reason: "Accuracy only 44% in mock practice. High exam weightage (~8-12 marks).",
    suggestedAction: "Revise conservation of angular momentum & parallel axis theorem.",
    urgency: "Critical",
    marksImpact: 12,
  },
  {
    id: "ws-2",
    topic: "Ray Optics (Combination of Thin Lenses & Silvering)",
    reason: "Accuracy 51%. 20 days since last revision.",
    suggestedAction: "Practice 5 PyQs on equivalent focal length with lens immersed in liquids.",
    urgency: "High",
    marksImpact: 8,
  },
];

export const MOCK_QUICK_WINS = [
  {
    id: "qw-1",
    topic: "Modern Physics (de Broglie & Bohr Radii)",
    reason: "High Return on Investment: Only 4 straightforward formulas, guarantees 8-12 marks.",
    timeRequired: "45 mins",
    marksReward: "+8 to +12 Marks",
  },
  {
    id: "qw-2",
    topic: "Semiconductors & Logic Truth Tables",
    reason: "100% predictable 4-mark question in every JEE shift.",
    timeRequired: "30 mins",
    marksReward: "+4 Marks Guaranteed",
  },
];

// 8. Evaluation Benchmark Data (Empty state & Populated backtest results)
export const MOCK_EVALUATION_METRICS: EvaluationMetricRow[] = [
  {
    examYear: "JEE Main 2024 (Jan Session)",
    sampleSize: "10 Shifts (300 Qs)",
    mae: 0.42,
    spearmanRho: 0.88,
    precisionAt3: 100.0,
    precisionAt5: 100.0,
    precisionAt10: 90.0,
    status: "Validated",
  },
  {
    examYear: "JEE Main 2024 (Apr Session)",
    sampleSize: "10 Shifts (300 Qs)",
    mae: 0.51,
    spearmanRho: 0.84,
    precisionAt3: 100.0,
    precisionAt5: 80.0,
    precisionAt10: 85.0,
    status: "Validated",
  },
  {
    examYear: "NEET (UG) 2024",
    sampleSize: "1 Paper (200 Qs)",
    mae: 0.65,
    spearmanRho: 0.81,
    precisionAt3: 100.0,
    precisionAt5: 80.0,
    precisionAt10: 80.0,
    status: "Validated",
  },
  {
    examYear: "CBSE Class 12 Boards 2024",
    sampleSize: "3 Regional Sets (105 Qs)",
    mae: 0.38,
    spearmanRho: 0.91,
    precisionAt3: 100.0,
    precisionAt5: 100.0,
    precisionAt10: 92.0,
    status: "Validated",
  },
  {
    examYear: "CUET (UG) 2024",
    sampleSize: "8 Slots (400 Qs)",
    mae: 0.58,
    spearmanRho: 0.79,
    precisionAt3: 100.0,
    precisionAt5: 80.0,
    precisionAt10: 80.0,
    status: "Validated",
  },
];

export const MOCK_EVAL_CHART_DATA = [
  { exam: "JEE Jan 24", mae: 0.42, spearman: 0.88, p5: 100 },
  { exam: "JEE Apr 24", mae: 0.51, spearman: 0.84, p5: 80 },
  { exam: "NEET 2024", mae: 0.65, spearman: 0.81, p5: 80 },
  { exam: "CBSE 12 24", mae: 0.38, spearman: 0.91, p5: 100 },
  { exam: "CUET 2024", mae: 0.58, spearman: 0.79, p5: 80 },
];
