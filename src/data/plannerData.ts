// Exam Planner Data & Full Syllabus Catalog for ExamSaathi
import { jsPDF } from "jspdf";

export type ExamCategory = "jee-main" | "cbse-12" | "bitsat" | "neet" | "other";
export type ExamType = "national" | "cbse-board" | "mock-test" | "pre-board" | "revision";
export type ExamStatus = "upcoming" | "in-progress" | "completed";
export type ChapterStatus = "mastered" | "revising" | "pending";

export interface PlannedExam {
  id: string;
  title: string;
  examType: ExamType;
  examCategory: ExamCategory;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  timeSlot?: string;
  targetScore?: string;
  subjects: ("Physics" | "Chemistry" | "Mathematics" | "Biology" | "English" | "Computer Science")[];
  chaptersMapped?: string[];
  status: ExamStatus;
  notes?: string;
  isOfficial: boolean;
  color: string;
  badgeLabel: string;
}

export interface SyllabusChapter {
  id: string;
  slug: string;
  name: string;
  subject: "Physics" | "Chemistry" | "Mathematics";
  classLevel: 11 | 12;
  examScope: ("jee-main" | "cbse-12")[];
  weightagePercent: number;
  questionCount: number;
  pyqFrequency: "Critical" | "High" | "Medium" | "Low";
  difficulty: "Easy" | "Moderate" | "Hard";
  description: string;
  status: ChapterStatus;
  targetDate?: string;
}

// =========================================================================
// PRE-LOADED OFFICIAL EXAM CALENDAR (2025–2026 ACADEMIC CYCLE)
// =========================================================================
export const OFFICIAL_UPCOMING_EXAMS: PlannedExam[] = [];

// =========================================================================
// COMPLETE WHOLE SYLLABUS CATALOG (CLASS 11 + CLASS 12)
// =========================================================================
export const COMPLETE_SYLLABUS: SyllabusChapter[] = [
  // --- PHYSICS CLASS 11 (JEE MAIN) ---
  {
    id: "syl-phy-11-01",
    slug: "units-dimensions",
    name: "Units, Dimensions & Error Analysis",
    subject: "Physics",
    classLevel: 11,
    examScope: ["jee-main"],
    weightagePercent: 4.5,
    questionCount: 32,
    pyqFrequency: "Critical",
    difficulty: "Easy",
    description: "Dimensional formulas, percentage error propagation, Vernier caliper and screw gauge least count.",
    status: "mastered",
  },
  {
    id: "syl-phy-11-02",
    slug: "kinematics",
    name: "Kinematics: 1D & 2D Motion",
    subject: "Physics",
    classLevel: 11,
    examScope: ["jee-main"],
    weightagePercent: 6.0,
    questionCount: 44,
    pyqFrequency: "Critical",
    difficulty: "Moderate",
    description: "Calculus kinematics, projectile trajectories on horizontal and inclined planes, relative velocity.",
    status: "revising",
  },
  {
    id: "syl-phy-11-03",
    slug: "laws-of-motion",
    name: "Laws of Motion & Friction",
    subject: "Physics",
    classLevel: 11,
    examScope: ["jee-main"],
    weightagePercent: 6.5,
    questionCount: 42,
    pyqFrequency: "High",
    difficulty: "Moderate",
    description: "Free body diagrams, wedge-pulley systems, static and kinetic friction, banking of roads.",
    status: "revising",
  },
  {
    id: "syl-phy-11-04",
    slug: "work-energy-power",
    name: "Work, Energy & Power",
    subject: "Physics",
    classLevel: 11,
    examScope: ["jee-main"],
    weightagePercent: 5.5,
    questionCount: 38,
    pyqFrequency: "High",
    difficulty: "Moderate",
    description: "Work-energy theorem, conservative force potentials, vertical circular motion, 1D/2D elastic collisions.",
    status: "mastered",
  },
  {
    id: "syl-phy-11-05",
    slug: "rotational-motion",
    name: "System of Particles & Rotational Dynamics",
    subject: "Physics",
    classLevel: 11,
    examScope: ["jee-main"],
    weightagePercent: 8.5,
    questionCount: 52,
    pyqFrequency: "Critical",
    difficulty: "Hard",
    description: "Moment of inertia theorems, torque equilibrium, angular momentum conservation, rolling without slipping.",
    status: "pending",
  },
  {
    id: "syl-phy-11-06",
    slug: "gravitation",
    name: "Gravitation & Satellite Dynamics",
    subject: "Physics",
    classLevel: 11,
    examScope: ["jee-main"],
    weightagePercent: 5.0,
    questionCount: 36,
    pyqFrequency: "High",
    difficulty: "Easy",
    description: "Gravitational potential and field, Kepler's laws, escape speed, orbital speed of satellites.",
    status: "mastered",
  },
  {
    id: "syl-phy-11-07",
    slug: "solids-fluids",
    name: "Mechanical Properties of Solids & Fluids",
    subject: "Physics",
    classLevel: 11,
    examScope: ["jee-main"],
    weightagePercent: 6.0,
    questionCount: 40,
    pyqFrequency: "High",
    difficulty: "Moderate",
    description: "Hooke's law, Young's modulus, Bernoulli theorem, Stokes law terminal velocity, surface tension.",
    status: "revising",
  },
  {
    id: "syl-phy-11-08",
    slug: "thermodynamics-ktg",
    name: "Thermodynamics & Kinetic Theory (KTG)",
    subject: "Physics",
    classLevel: 11,
    examScope: ["jee-main"],
    weightagePercent: 7.5,
    questionCount: 46,
    pyqFrequency: "Critical",
    difficulty: "Moderate",
    description: "First and second laws, indicator diagrams (isothermal, adiabatic), Carnot engine efficiency, degrees of freedom.",
    status: "revising",
  },
  {
    id: "syl-phy-11-09",
    slug: "oscillations-waves",
    name: "Oscillations & Waves (SHM & Doppler)",
    subject: "Physics",
    classLevel: 11,
    examScope: ["jee-main"],
    weightagePercent: 6.0,
    questionCount: 39,
    pyqFrequency: "High",
    difficulty: "Hard",
    description: "Simple harmonic motion dynamics, spring-mass systems, standing waves on strings and organ pipes, Doppler effect.",
    status: "pending",
  },

  // --- PHYSICS CLASS 12 (CBSE 12 & JEE MAIN) ---
  {
    id: "syl-phy-12-01",
    slug: "electric-charges-fields",
    name: "Electric Charges and Fields",
    subject: "Physics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 8.5,
    questionCount: 55,
    pyqFrequency: "Critical",
    difficulty: "Moderate",
    description: "Coulomb law, electric dipole on axial/equatorial axis, Gauss law cylinder/sheet derivations.",
    status: "mastered",
  },
  {
    id: "syl-phy-12-02",
    slug: "electrostatic-potential",
    name: "Electrostatic Potential and Capacitance",
    subject: "Physics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 8.0,
    questionCount: 51,
    pyqFrequency: "Critical",
    difficulty: "Moderate",
    description: "Equipotential surfaces, dipole potential, parallel plate capacitance with dielectric slab, energy loss.",
    status: "mastered",
  },
  {
    id: "syl-phy-12-03",
    slug: "current-electricity",
    name: "Current Electricity",
    subject: "Physics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 9.0,
    questionCount: 58,
    pyqFrequency: "Critical",
    difficulty: "Moderate",
    description: "Drift velocity derivation, Ohm's microscopic law, Kirchhoff rules, Wheatstone bridge, meter bridge.",
    status: "revising",
  },
  {
    id: "syl-phy-12-04",
    slug: "moving-charges-magnetism",
    name: "Moving Charges and Magnetism",
    subject: "Physics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 7.5,
    questionCount: 48,
    pyqFrequency: "Critical",
    difficulty: "Moderate",
    description: "Biot-Savart circular coil axis derivation, Ampere law, force between parallel currents, galvanometer conversion.",
    status: "revising",
  },
  {
    id: "syl-phy-12-05",
    slug: "magnetism-matter",
    name: "Magnetism and Matter",
    subject: "Physics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 4.0,
    questionCount: 28,
    pyqFrequency: "Medium",
    difficulty: "Easy",
    description: "Bar magnet as equivalent solenoid, magnetic dipole moment, dia-, para-, and ferromagnetic classification.",
    status: "mastered",
  },
  {
    id: "syl-phy-12-06",
    slug: "emi",
    name: "Electromagnetic Induction",
    subject: "Physics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 6.0,
    questionCount: 41,
    pyqFrequency: "High",
    difficulty: "Moderate",
    description: "Faraday and Lenz laws, motional EMF derivation, self & mutual inductance, eddy currents.",
    status: "revising",
  },
  {
    id: "syl-phy-12-07",
    slug: "alternating-current",
    name: "Alternating Current",
    subject: "Physics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 6.5,
    questionCount: 44,
    pyqFrequency: "High",
    difficulty: "Moderate",
    description: "Phasors for series LCR, resonance frequency, quality factor, power factor, transformer working & efficiency.",
    status: "revising",
  },
  {
    id: "syl-phy-12-08",
    slug: "em-waves",
    name: "Electromagnetic Waves",
    subject: "Physics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 3.5,
    questionCount: 24,
    pyqFrequency: "Medium",
    difficulty: "Easy",
    description: "Displacement current definition, transverse nature of EM waves, electromagnetic spectrum applications.",
    status: "mastered",
  },
  {
    id: "syl-phy-12-09",
    slug: "ray-optics",
    name: "Ray Optics and Optical Instruments",
    subject: "Physics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 10.0,
    questionCount: 64,
    pyqFrequency: "Critical",
    difficulty: "Hard",
    description: "Lens Maker's formula derivation, total internal reflection, prism deviation angle, compound microscope & telescope.",
    status: "pending",
  },
  {
    id: "syl-phy-12-10",
    slug: "wave-optics",
    name: "Wave Optics",
    subject: "Physics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 7.0,
    questionCount: 45,
    pyqFrequency: "High",
    difficulty: "Moderate",
    description: "Huygens wavelets proof of reflection/refraction, Young's double slit fringe width derivation, single slit diffraction.",
    status: "mastered",
  },
  {
    id: "syl-phy-12-11",
    slug: "dual-nature",
    name: "Dual Nature of Radiation and Matter",
    subject: "Physics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 6.0,
    questionCount: 42,
    pyqFrequency: "High",
    difficulty: "Easy",
    description: "Photoelectric effect experiments, Einstein photoelectric equation, stopping potential, de Broglie matter waves.",
    status: "mastered",
  },
  {
    id: "syl-phy-12-12",
    slug: "atoms",
    name: "Atoms",
    subject: "Physics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 5.5,
    questionCount: 36,
    pyqFrequency: "High",
    difficulty: "Easy",
    description: "Rutherford alpha scattering experiment, Bohr model postulates, energy states and hydrogen spectral series.",
    status: "mastered",
  },
  {
    id: "syl-phy-12-13",
    slug: "nuclei",
    name: "Nuclei",
    subject: "Physics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 5.0,
    questionCount: 34,
    pyqFrequency: "Medium",
    difficulty: "Easy",
    description: "Nuclear density, mass defect, binding energy per nucleon curve, nuclear fission and fusion energetics.",
    status: "revising",
  },
  {
    id: "syl-phy-12-14",
    slug: "semiconductors",
    name: "Semiconductor Electronics",
    subject: "Physics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 8.5,
    questionCount: 56,
    pyqFrequency: "Critical",
    difficulty: "Moderate",
    description: "Energy bands in solids, intrinsic/extrinsic p-n junctions, half and full-wave rectifiers, Zener regulator, logic gates.",
    status: "mastered",
  },

  // --- CHEMISTRY CLASS 11 (JEE MAIN) ---
  {
    id: "syl-chm-11-01",
    slug: "mole-concept",
    name: "Basic Concepts of Chemistry (Mole Concept)",
    subject: "Chemistry",
    classLevel: 11,
    examScope: ["jee-main"],
    weightagePercent: 4.5,
    questionCount: 35,
    pyqFrequency: "High",
    difficulty: "Easy",
    description: "Mole conversions, empirical & molecular formulas, limiting reagent stoichiometry, concentration units.",
    status: "mastered",
  },
  {
    id: "syl-chm-11-02",
    slug: "atomic-structure",
    name: "Atomic Structure & Quantum Numbers",
    subject: "Chemistry",
    classLevel: 11,
    examScope: ["jee-main"],
    weightagePercent: 6.0,
    questionCount: 42,
    pyqFrequency: "Critical",
    difficulty: "Moderate",
    description: "Bohr orbit calculations, de Broglie wavelength, Heisenberg uncertainty, quantum numbers & orbital shapes.",
    status: "mastered",
  },
  {
    id: "syl-chm-11-03",
    slug: "chemical-bonding",
    name: "Chemical Bonding & Molecular Structure",
    subject: "Chemistry",
    classLevel: 11,
    examScope: ["jee-main"],
    weightagePercent: 8.5,
    questionCount: 58,
    pyqFrequency: "Critical",
    difficulty: "Hard",
    description: "VSEPR geometry, hybridization sp/sp2/sp3/sp3d, Molecular Orbital Theory (MOT) bond orders, dipole moments.",
    status: "revising",
  },
  {
    id: "syl-chm-11-04",
    slug: "chemical-thermodynamics",
    name: "Chemical Thermodynamics & Thermochemistry",
    subject: "Chemistry",
    classLevel: 11,
    examScope: ["jee-main"],
    weightagePercent: 7.0,
    questionCount: 48,
    pyqFrequency: "Critical",
    difficulty: "Hard",
    description: "Enthalpy, Hess law, entropy, Gibbs free energy spontaneity, equilibrium constant thermodynamic relation.",
    status: "pending",
  },
  {
    id: "syl-chm-11-05",
    slug: "equilibrium",
    name: "Chemical & Ionic Equilibrium",
    subject: "Chemistry",
    classLevel: 11,
    examScope: ["jee-main"],
    weightagePercent: 8.0,
    questionCount: 52,
    pyqFrequency: "Critical",
    difficulty: "Hard",
    description: "Le Chatelier principle, Kp/Kc relations, pH calculations, buffer solutions, solubility product (Ksp).",
    status: "revising",
  },

  // --- CHEMISTRY CLASS 12 (CBSE 12 & JEE MAIN) ---
  {
    id: "syl-chm-12-01",
    slug: "solutions",
    name: "Solutions",
    subject: "Chemistry",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 10.0,
    questionCount: 60,
    pyqFrequency: "Critical",
    difficulty: "Moderate",
    description: "Henry's law, Raoult's law ideal/non-ideal deviations, colligative properties, van 't Hoff factor calculations.",
    status: "mastered",
  },
  {
    id: "syl-chm-12-02",
    slug: "electrochemistry",
    name: "Electrochemistry",
    subject: "Chemistry",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 11.0,
    questionCount: 66,
    pyqFrequency: "Critical",
    difficulty: "Hard",
    description: "Nernst equation cell EMF, Gibbs energy, molar conductivity, Kohlrausch law, Faraday's laws of electrolysis.",
    status: "revising",
  },
  {
    id: "syl-chm-12-03",
    slug: "chemical-kinetics",
    name: "Chemical Kinetics",
    subject: "Chemistry",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 10.0,
    questionCount: 58,
    pyqFrequency: "Critical",
    difficulty: "Moderate",
    description: "Integrated rate laws for zero and first order, pseudo first order, half-life formula, Arrhenius activation energy.",
    status: "mastered",
  },
  {
    id: "syl-chm-12-04",
    slug: "d-f-block",
    name: "The d- and f-Block Elements",
    subject: "Chemistry",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 8.5,
    questionCount: 49,
    pyqFrequency: "High",
    difficulty: "Moderate",
    description: "Transition metal trends, variable oxidation states, catalytic action, potassium dichromate & permanganate reactions.",
    status: "revising",
  },
  {
    id: "syl-chm-12-05",
    slug: "coordination-compounds",
    name: "Coordination Compounds",
    subject: "Chemistry",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 9.5,
    questionCount: 54,
    pyqFrequency: "Critical",
    difficulty: "Hard",
    description: "IUPAC nomenclature, geometrical/optical isomerism, Valence Bond Theory, Crystal Field Theory (CFSE) and magnetism.",
    status: "revising",
  },
  {
    id: "syl-chm-12-06",
    slug: "haloalkanes-haloarenes",
    name: "Haloalkanes and Haloarenes",
    subject: "Chemistry",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 8.0,
    questionCount: 46,
    pyqFrequency: "High",
    difficulty: "Moderate",
    description: "SN1 vs SN2 mechanisms, stereochemical inversion/retention, Sandmeyer reaction, electrophilic substitution.",
    status: "mastered",
  },
  {
    id: "syl-chm-12-07",
    slug: "alcohols-phenols-ethers",
    name: "Alcohols, Phenols and Ethers",
    subject: "Chemistry",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 8.5,
    questionCount: 50,
    pyqFrequency: "High",
    difficulty: "Moderate",
    description: "Hydroboration-oxidation, acidity of phenols vs alcohols, Kolbe's reaction, Reimer-Tiemann, Williamson ether synthesis.",
    status: "revising",
  },
  {
    id: "syl-chm-12-08",
    slug: "aldehydes-ketones",
    name: "Aldehydes, Ketones and Carboxylic Acids",
    subject: "Chemistry",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 11.5,
    questionCount: 68,
    pyqFrequency: "Critical",
    difficulty: "Hard",
    description: "Nucleophilic addition, Aldol condensation, Cannizzaro reaction, Tollens/Fehling tests, HVZ carboxylic acid reaction.",
    status: "pending",
  },
  {
    id: "syl-chm-12-09",
    slug: "amines",
    name: "Amines",
    subject: "Chemistry",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 7.5,
    questionCount: 42,
    pyqFrequency: "High",
    difficulty: "Moderate",
    description: "Hoffmann bromamide degradation, basicity order in aqueous phase, carbylamine test, diazotization and coupling.",
    status: "mastered",
  },
  {
    id: "syl-chm-12-10",
    slug: "biomolecules",
    name: "Biomolecules",
    subject: "Chemistry",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 6.0,
    questionCount: 38,
    pyqFrequency: "High",
    difficulty: "Easy",
    description: "Glucose structure proofs, peptide linkages, primary to quaternary protein structures, DNA vs RNA nucleotides.",
    status: "mastered",
  },

  // --- MATHEMATICS CLASS 11 (JEE MAIN) ---
  {
    id: "syl-mat-11-01",
    slug: "complex-numbers",
    name: "Complex Numbers & Quadratic Equations",
    subject: "Mathematics",
    classLevel: 11,
    examScope: ["jee-main"],
    weightagePercent: 6.5,
    questionCount: 45,
    pyqFrequency: "Critical",
    difficulty: "Hard",
    description: "Euler form, cube roots of unity (omega), triangle inequality loci, location of roots of quadratic equations.",
    status: "revising",
  },
  {
    id: "syl-mat-11-02",
    slug: "conic-sections",
    name: "Conic Sections (Parabola, Ellipse, Hyperbola)",
    subject: "Mathematics",
    classLevel: 11,
    examScope: ["jee-main"],
    weightagePercent: 9.0,
    questionCount: 56,
    pyqFrequency: "Critical",
    difficulty: "Hard",
    description: "Standard tangents and normals, director circles, eccentricity formulas, focal chords and parametric forms.",
    status: "pending",
  },

  // --- MATHEMATICS CLASS 12 (CBSE 12 & JEE MAIN) ---
  {
    id: "syl-mat-12-01",
    slug: "relations-functions",
    name: "Relations and Functions",
    subject: "Mathematics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 6.5,
    questionCount: 40,
    pyqFrequency: "High",
    difficulty: "Moderate",
    description: "Equivalence relations, reflexive/symmetric/transitive proofs, one-one (injective) and onto (surjective) functions.",
    status: "mastered",
  },
  {
    id: "syl-mat-12-02",
    slug: "itf",
    name: "Inverse Trigonometric Functions",
    subject: "Mathematics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 5.0,
    questionCount: 34,
    pyqFrequency: "High",
    difficulty: "Moderate",
    description: "Principal value branches, domain and range restrictions, identities: sin^-1(x) + cos^-1(x) = pi/2.",
    status: "mastered",
  },
  {
    id: "syl-mat-12-03",
    slug: "matrices",
    name: "Matrices",
    subject: "Mathematics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 7.5,
    questionCount: 48,
    pyqFrequency: "High",
    difficulty: "Moderate",
    description: "Matrix multiplication non-commutativity, symmetric and skew-symmetric decomposition, invertible matrices.",
    status: "mastered",
  },
  {
    id: "syl-mat-12-04",
    slug: "determinants",
    name: "Determinants",
    subject: "Mathematics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 8.0,
    questionCount: 52,
    pyqFrequency: "Critical",
    difficulty: "Moderate",
    description: "Minors and cofactors, adjoint formulas |adj(A)| = |A|^(n-1), solving 3x3 system of linear equations by matrix method.",
    status: "mastered",
  },
  {
    id: "syl-mat-12-05",
    slug: "continuity-differentiability",
    name: "Continuity and Differentiability",
    subject: "Mathematics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 9.5,
    questionCount: 58,
    pyqFrequency: "Critical",
    difficulty: "Hard",
    description: "Continuity conditions, chain rule, implicit functions, logarithmic differentiation, second order derivatives.",
    status: "revising",
  },
  {
    id: "syl-mat-12-06",
    slug: "application-of-derivatives",
    name: "Application of Derivatives (AOD)",
    subject: "Mathematics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 9.0,
    questionCount: 55,
    pyqFrequency: "Critical",
    difficulty: "Hard",
    description: "Rate of change, strictly increasing/decreasing intervals, local maxima and minima word optimization problems.",
    status: "revising",
  },
  {
    id: "syl-mat-12-07",
    slug: "integrals",
    name: "Integrals (Indefinite & Definite)",
    subject: "Mathematics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 12.0,
    questionCount: 72,
    pyqFrequency: "Critical",
    difficulty: "Hard",
    description: "Integration by parts, partial fractions, King's property f(a+b-x), periodic properties, standard rational forms.",
    status: "revising",
  },
  {
    id: "syl-mat-12-08",
    slug: "application-of-integrals",
    name: "Application of Integrals (Area Under Curve)",
    subject: "Mathematics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 5.5,
    questionCount: 36,
    pyqFrequency: "High",
    difficulty: "Moderate",
    description: "Area bounded by standard parabolas, circles, ellipses and lines, vertical vs horizontal strip integration.",
    status: "mastered",
  },
  {
    id: "syl-mat-12-09",
    slug: "differential-equations",
    name: "Differential Equations",
    subject: "Mathematics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 7.0,
    questionCount: 44,
    pyqFrequency: "High",
    difficulty: "Moderate",
    description: "Order and degree, variable separation method, homogeneous substitution y=vx, linear differential equations with I.F.",
    status: "revising",
  },
  {
    id: "syl-mat-12-10",
    slug: "vector-algebra",
    name: "Vector Algebra",
    subject: "Mathematics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 7.5,
    questionCount: 46,
    pyqFrequency: "High",
    difficulty: "Moderate",
    description: "Dot product projections, cross product area of triangle/parallelogram, scalar triple product properties.",
    status: "mastered",
  },
  {
    id: "syl-mat-12-11",
    slug: "three-dimensional-geometry",
    name: "Three Dimensional Geometry (3D)",
    subject: "Mathematics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 10.5,
    questionCount: 65,
    pyqFrequency: "Critical",
    difficulty: "Hard",
    description: "Direction cosines and ratios, line equation in symmetric vector form, shortest distance between skew lines.",
    status: "pending",
  },
  {
    id: "syl-mat-12-12",
    slug: "linear-programming",
    name: "Linear Programming (LPP)",
    subject: "Mathematics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 5.0,
    questionCount: 32,
    pyqFrequency: "High",
    difficulty: "Easy",
    description: "Mathematical formulation of objective functions, feasible bounded region, corner-point evaluation method.",
    status: "mastered",
  },
  {
    id: "syl-mat-12-13",
    slug: "probability",
    name: "Probability & Bayes' Theorem",
    subject: "Mathematics",
    classLevel: 12,
    examScope: ["jee-main", "cbse-12"],
    weightagePercent: 8.0,
    questionCount: 50,
    pyqFrequency: "Critical",
    difficulty: "Moderate",
    description: "Conditional probability, multiplication theorem, independent events, total probability law, Bayes theorem.",
    status: "mastered",
  },
];

// Helper to get syllabus filtered by target exam
export function getSyllabusForExam(examId: "jee-main" | "cbse-12" | string): SyllabusChapter[] {
  if (examId === "cbse-12") {
    return COMPLETE_SYLLABUS.filter((c) => c.classLevel === 12);
  }
  // For JEE Main / Advanced, full Class 11 + 12
  return COMPLETE_SYLLABUS;
}

// Generate standard RFC 5545 iCalendar (.ics) string for export
export function generateIcsCalendar(exams: PlannedExam[]): string {
  const formatDate = (dateStr: string) => {
    return dateStr.replace(/-/g, "");
  };

  let ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ExamSaathi//Academic Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:ExamSaathi Academic Schedule",
  ];

  exams.forEach((exam) => {
    const start = formatDate(exam.startDate);
    const end = exam.endDate ? formatDate(exam.endDate) : start;
    ics.push(
      "BEGIN:VEVENT",
      `UID:${exam.id}@examsaathi.ai`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${exam.title}`,
      `DESCRIPTION:${exam.notes || exam.targetScore || "ExamSaathi Academic Milestone"}`,
      `CATEGORIES:${exam.badgeLabel}`,
      "STATUS:CONFIRMED",
      "END:VEVENT"
    );
  });

  ics.push("END:VCALENDAR");
  return ics.join("\r\n");
}

// Helper to trigger browser download of .ics
export function downloadIcsFile(exams: PlannedExam[]) {
  const icsString = generateIcsCalendar(exams);
  const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ExamSaathi_Exam_Planner.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Generate printable PDF Timetable with jsPDF
export function downloadPlannerPdf(exams: PlannedExam[], targetExam: string) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(255, 77, 0); // Kinetic Orange
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("EXAMSAATHI // ACADEMIC PLANNER", 14, 12);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Official Examination Timetable & Revision Tracker • Target: ${targetExam.toUpperCase()}`, 14, 19);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, 14, 24);

  // Table header
  let y = 38;
  doc.setFillColor(0, 0, 0);
  doc.rect(14, y, pageWidth - 28, 8, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("DATE", 18, y + 5.5);
  doc.text("EXAMINATION / MILESTONE", 45, y + 5.5);
  doc.text("TYPE", 130, y + 5.5);
  doc.text("TARGET SCORE", 165, y + 5.5);

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  exams.forEach((ex, idx) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 2, pageWidth - 28, 10, "F");
    }

    // Border line
    doc.setDrawColor(226, 232, 240);
    doc.line(14, y + 8, pageWidth - 14, y + 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(ex.startDate, 18, y + 4);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(doc.splitTextToSize(ex.title, 80), 45, y + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(ex.badgeLabel, 130, y + 4);
    doc.text(doc.splitTextToSize(ex.targetScore || "Confirmed", 30), 165, y + 4);

    y += 11;
  });

  // Footer note
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Powered by ExamSaathi AI Analytics Engine. Keep pushing for 100% syllabus mastery!", 14, 287);

  doc.save(`ExamSaathi_Planner_${targetExam.toUpperCase()}.pdf`);
}
