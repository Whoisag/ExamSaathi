import { jsPDF } from "jspdf";

export interface PdfOptions {
  title: string;
  subject?: string;
  exam?: string;
  chapter?: string;
  sections?: Array<{
    heading: string;
    content: string | string[];
  }>;
  rawContent?: string;
}

/**
 * Curated high-yield study sheet data keyed by chapter name fragments
 * Each entry has sections with exam-ready formula lines.
 */
const CURATED_TOPIC_DATA: Record<string, {
  title: string;
  subject: string;
  sections: Array<{ heading: string; content: string[] }>;
}> = {
  "inverse trigonometric": {
    title: "Inverse Trigonometric Functions — Class 12 Complete Formula Guide",
    subject: "Mathematics",
    sections: [
      {
        heading: "1. Principal Value Branches (Domain & Range Table)",
        content: [
          "• sin⁻¹(x) | Domain: [-1, 1]         | Principal Range: [-π/2, π/2]",
          "• cos⁻¹(x) | Domain: [-1, 1]         | Principal Range: [0, π]",
          "• tan⁻¹(x) | Domain: ℝ               | Principal Range: (-π/2, π/2)",
          "• cot⁻¹(x) | Domain: ℝ               | Principal Range: (0, π)",
          "• sec⁻¹(x) | Domain: ℝ - (-1, 1)     | Principal Range: [0, π] - {π/2}",
          "• cosec⁻¹(x)| Domain: ℝ - (-1, 1)    | Principal Range: [-π/2, π/2] - {0}",
        ]
      },
      {
        heading: "2. Negative-Angle & Complementary Properties",
        content: [
          "• sin⁻¹(-x) = -sin⁻¹(x),   tan⁻¹(-x) = -tan⁻¹(x),  cosec⁻¹(-x) = -cosec⁻¹(x)",
          "• cos⁻¹(-x) = π - cos⁻¹(x), cot⁻¹(-x) = π - cot⁻¹(x), sec⁻¹(-x) = π - sec⁻¹(x)",
          "• sin⁻¹(x) + cos⁻¹(x) = π/2  [x ∈ [-1,1]]",
          "• tan⁻¹(x) + cot⁻¹(x) = π/2  [x ∈ ℝ]",
          "• sec⁻¹(x) + cosec⁻¹(x) = π/2 [|x| ≥ 1]",
        ]
      },
      {
        heading: "3. Addition & Double-Angle Formulas",
        content: [
          "• tan⁻¹x + tan⁻¹y = tan⁻¹((x+y)/(1-xy))          [xy < 1]",
          "• tan⁻¹x + tan⁻¹y = π + tan⁻¹((x+y)/(1-xy))       [x>0, y>0, xy>1]",
          "• 2tan⁻¹x = sin⁻¹(2x/(1+x²)) = cos⁻¹((1-x²)/(1+x²)) = tan⁻¹(2x/(1-x²))",
        ]
      },
      {
        heading: "4. High-Yield CBSE PYQs & Traps",
        content: [
          "TRAP: sin⁻¹(sin(2π/3)) = π/3  (NOT 2π/3 — always reduce to principal branch!)",
          "TRAP: cos⁻¹(cos(7π/6)) = 5π/6 (NOT 7π/6)",
          "PYQ 2024: sin(π/3 - sin⁻¹(-1/2)) = sin(π/3 + π/6) = sin(π/2) = 1",
          "PYQ 2023: tan⁻¹((x-1)/(x-2)) + tan⁻¹((x+1)/(x+2)) = π/4 → x = ±1/√2",
        ]
      }
    ]
  },

  "electric charges": {
    title: "Electric Charges and Fields — Class 12 Master Formula Guide",
    subject: "Physics",
    sections: [
      {
        heading: "1. Coulomb's Law & Electric Force",
        content: [
          "• F = (1/4πε₀) × (q₁q₂/r²)  where ε₀ = 8.85 × 10⁻¹² C²/Nm²",
          "• 1/4πε₀ = 9 × 10⁹ N m²/C²",
          "• In medium: F_medium = F_vacuum / K  (K = dielectric constant)",
          "• Coulomb's law is valid for point charges at rest (electrostatics)",
        ]
      },
      {
        heading: "2. Electric Field",
        content: [
          "• E = F/q₀ (field due to test charge q₀)",
          "• Due to point charge Q: E = (1/4πε₀) × (Q/r²), direction: away from +Q",
          "• On axial point of dipole: E = (1/4πε₀) × (2p/r³)",
          "• On equatorial point of dipole: E = (1/4πε₀) × (p/r³), direction: antiparallel to p",
        ]
      },
      {
        heading: "3. Electric Dipole & Flux",
        content: [
          "• Dipole moment: p = q × 2l (vector from -q to +q)",
          "• Torque on dipole in uniform E: τ = p × E = pE sinθ",
          "• Potential energy: U = -p·E = -pE cosθ",
          "• Gauss's Law: Φ = ∮E·dA = Q_enclosed / ε₀",
          "• Field due to infinite sheet: E = σ/2ε₀ (both sides)",
          "• Field between parallel plates: E = σ/ε₀",
        ]
      },
      {
        heading: "4. Key Concepts & CBSE Traps",
        content: [
          "TRAP: Gauss's Law Φ depends only on enclosed charge, NOT on shape of surface.",
          "TRAP: Electric field lines never cross; closer lines = stronger field.",
          "PYQ: Find field at centre of square with 4 charges — use symmetry, answer is often zero.",
          "PYQ: Torque is maximum when dipole is perpendicular to E (θ = 90°); zero when parallel.",
        ]
      }
    ]
  },

  "electrostatic potential": {
    title: "Electrostatic Potential & Capacitance — Class 12 Master Guide",
    subject: "Physics",
    sections: [
      {
        heading: "1. Electric Potential",
        content: [
          "• V = W/q₀ = (1/4πε₀) × (Q/r)  [due to point charge]",
          "• Potential is a scalar; superposition: V = V₁ + V₂ + ...",
          "• E = -dV/dr  (E points from high V to low V)",
          "• Equipotential surfaces are always perpendicular to E field lines",
        ]
      },
      {
        heading: "2. Capacitors & Capacitance",
        content: [
          "• C = Q/V  (unit: Farad)",
          "• Parallel plate capacitor: C = ε₀A/d  (with dielectric: C = Kε₀A/d)",
          "• Series: 1/C_eq = 1/C₁ + 1/C₂ + ...",
          "• Parallel: C_eq = C₁ + C₂ + ...",
          "• Energy stored: U = (1/2)CV² = Q²/2C = QV/2",
        ]
      },
      {
        heading: "3. Key Formulas & CBSE PYQs",
        content: [
          "PYQ: When dielectric inserted (battery connected): V constant, C increases, Q increases, E unchanged.",
          "PYQ: When dielectric inserted (battery disconnected): Q constant, C increases, V decreases, U decreases.",
          "TRAP: Common confusion between series and parallel — remember: in series same Q, in parallel same V.",
        ]
      }
    ]
  },

  "current electricity": {
    title: "Current Electricity — Class 12 Master Formula Guide",
    subject: "Physics",
    sections: [
      {
        heading: "1. Fundamental Relations",
        content: [
          "• I = nqAv_d  (drift velocity: v_d = eEτ/m = eVτ/mL)",
          "• Ohm's Law: V = IR,  R = ρL/A  (ρ = resistivity)",
          "• Conductance G = 1/R, Conductivity σ = 1/ρ",
          "• Resistivity: ρ_T = ρ₀[1 + α(T - T₀)]  (for conductors, α > 0)",
        ]
      },
      {
        heading: "2. EMF, Terminal Voltage & Cells",
        content: [
          "• EMF ε = I(R + r)  →  Terminal PD: V = ε - Ir (discharging), V = ε + Ir (charging)",
          "• Cells in series: ε_eq = Σεᵢ,  r_eq = Σrᵢ",
          "• Cells in parallel (same ε): ε_eq = ε, r_eq = r/n",
          "• Max power in external: R_ext = r_int (Max Power Transfer Theorem)",
        ]
      },
      {
        heading: "3. Kirchhoff's Laws & Bridge Circuits",
        content: [
          "• KCL: ΣI_in = ΣI_out at any junction (Conservation of charge)",
          "• KVL: ΣV = 0 around any closed loop (Conservation of energy)",
          "• Wheatstone Bridge balanced: P/Q = R/S (no current through galvanometer)",
          "• Meter Bridge: R/S = l/(100-l),  Unknown resistance X = R(100-l)/l",
          "• Potentiometer EMF comparison: ε₁/ε₂ = l₁/l₂",
        ]
      },
      {
        heading: "4. CBSE Traps & PYQs",
        content: [
          "TRAP: End error in meter bridge — account for resistance of connecting wires.",
          "PYQ: Why potentiometer preferred over voltmeter? — It draws no current at balance, so true EMF is measured.",
          "PYQ: Electron drift speed in a wire ~ 10⁻⁴ m/s; electric signal speed ~ 3×10⁸ m/s (not same thing!).",
        ]
      }
    ]
  },

  "ray optics": {
    title: "Ray Optics & Optical Instruments — Class 12 Master Guide",
    subject: "Physics",
    sections: [
      {
        heading: "1. Mirrors — Spherical Mirror Formula",
        content: [
          "• Mirror formula: 1/v + 1/u = 1/f  (f = R/2)",
          "• Magnification: m = -v/u = h'/h  (m < 0 → inverted, m > 0 → erect)",
          "• Sign convention: all distances from pole; incident light travels left to right",
        ]
      },
      {
        heading: "2. Refraction & Lenses",
        content: [
          "• Snell's Law: n₁ sinθ₁ = n₂ sinθ₂",
          "• Lens formula: 1/v - 1/u = 1/f  (Note: opposite sign from mirror!)",
          "• Lens maker's equation: 1/f = (n-1)[1/R₁ - 1/R₂]",
          "• Power: P = 1/f (metres), Unit: Dioptre (D). Lenses in contact: P = P₁ + P₂",
          "• Critical angle: sin C = 1/n (for TIR to occur: θ > C, light in denser medium)",
        ]
      },
      {
        heading: "3. Optical Instruments",
        content: [
          "• Compound microscope: m = m_o × m_e = (L/f_o) × (D/f_e)  [normal adjustment]",
          "• Astronomical telescope: m = -f_o/f_e  [at infinity]",
          "• For greater magnifying power: small f_o and small f_e for microscope; large f_o for telescope",
        ]
      },
      {
        heading: "4. CBSE Traps & PYQs",
        content: [
          "TRAP: For mirrors u is always negative (object in front). For lenses, u is negative but v can be ±.",
          "PYQ: A glass slab shifts image laterally: shift = t(1 - 1/n). Does NOT change focal length of lens.",
          "PYQ: Concave mirror → real inverted image when |u| > f. Virtual erect image when |u| < f (used as shaving mirror).",
        ]
      }
    ]
  },

  "electrochemistry": {
    title: "Electrochemistry — Class 12 Complete Formula Guide",
    subject: "Chemistry",
    sections: [
      {
        heading: "1. Electrochemical Cells & EMF",
        content: [
          "• E°_cell = E°_cathode - E°_anode  (reduction potentials from SHE table)",
          "• Nernst equation: E_cell = E°_cell - (0.0591/n) × log Q  [at 298 K]",
          "• ΔG° = -nFE°_cell = -2.303RT log K_c",
          "• Relation: E°_cell = (0.0591/n) × log K_c  [at 298 K]",
        ]
      },
      {
        heading: "2. Conductance & Kohlrausch's Law",
        content: [
          "• Conductance G = 1/R, Conductivity κ = G × (l/A) = G × G*",
          "• Molar conductivity: Λ_m = (κ × 1000) / Molarity",
          "• Kohlrausch's Law: Λ°_m = ν₊λ°₊ + ν₋λ°₋",
          "• Degree of dissociation: α = Λ_m / Λ°_m",
        ]
      },
      {
        heading: "3. Faraday's Laws of Electrolysis",
        content: [
          "• First Law: w = Z × I × t  (Z = electrochemical equivalent = M/nF)",
          "• Second Law: w₁/w₂ = E₁/E₂  (equivalent weights ratio)",
          "• 1 Faraday = 96500 C = charge of 1 mole of electrons",
          "• w = (M/nF) × I × t  [n = number of electrons in electrode reaction]",
        ]
      },
      {
        heading: "4. Batteries & CBSE PYQs",
        content: [
          "Lead storage battery: PbO₂ + Pb + 2H₂SO₄ → 2PbSO₄ + 2H₂O  (discharge)",
          "TRAP: During recharging, anode and cathode REVERSE: PbSO₄ reconverts.",
          "PYQ: Conductivity of strong electrolyte increases with dilution but Λ_m approaches Λ°_m asymptotically.",
          "PYQ: At infinite dilution, weak acid Λ°_m cannot be measured directly — use Kohlrausch's law.",
        ]
      }
    ]
  },

  "chemical kinetics": {
    title: "Chemical Kinetics — Class 12 Master Formula Guide",
    subject: "Chemistry",
    sections: [
      {
        heading: "1. Rate & Rate Law",
        content: [
          "• Rate = -d[A]/dt = -d[B]/dt = +d[C]/dt  (stoichiometric relation)",
          "• Rate law: Rate = k[A]^m [B]^n  (m, n determined experimentally, NOT from stoichiometry!)",
          "• Overall order = m + n; k = rate constant (depends only on T)",
        ]
      },
      {
        heading: "2. Integrated Rate Laws & Half-Life",
        content: [
          "• Zero order: [A] = [A]₀ - kt,  t₁/₂ = [A]₀/2k",
          "• First order: k = (2.303/t) log([A]₀/[A]),  t₁/₂ = 0.693/k  (independent of [A]₀!)",
          "• Graphical: First order → log[A] vs t is linear  (slope = -k/2.303)",
        ]
      },
      {
        heading: "3. Arrhenius Equation & Temperature Dependence",
        content: [
          "• k = A × e^(-Ea/RT)   (A = frequency factor)",
          "• log(k₂/k₁) = (Ea/2.303R) × [(T₂-T₁)/(T₁T₂)]",
          "• Ea from graph: slope of log k vs 1/T  = -Ea/2.303R",
          "• Rule of thumb: Rate doubles for every 10°C rise (approximate)",
        ]
      },
      {
        heading: "4. CBSE Traps & PYQs",
        content: [
          "TRAP: Molecularity is always a whole number; order can be zero, fractional, or negative.",
          "TRAP: t₁/₂ of first-order is independent of initial concentration — unique property!",
          "PYQ 2024: Radioactive decay is always first-order: N = N₀e^(-λt), t₁/₂ = 0.693/λ",
          "PYQ: Pseudo-first order — e.g. acid hydrolysis of ester in excess water: rate = k'[ester]",
        ]
      }
    ]
  },

  "semiconductor": {
    title: "Semiconductor Electronics — Class 12 Master Guide",
    subject: "Physics",
    sections: [
      {
        heading: "1. Intrinsic & Extrinsic Semiconductors",
        content: [
          "• Intrinsic: pure Si or Ge; n_e = n_h at all temperatures",
          "• n-type: doped with pentavalent (P, As, Sb) → majority carriers: electrons",
          "• p-type: doped with trivalent (B, Al, In) → majority carriers: holes",
          "• Relation: n_e × n_h = n_i²  (n_i = intrinsic carrier concentration)",
        ]
      },
      {
        heading: "2. p-n Junction & Diode",
        content: [
          "• Forward bias: barrier reduced, current flows (diode ON) — threshold ~0.7V for Si",
          "• Reverse bias: barrier increased, only small reverse saturation current (diode OFF)",
          "• Half-wave rectifier: output frequency = input frequency",
          "• Full-wave rectifier: output frequency = 2 × input frequency",
        ]
      },
      {
        heading: "3. Transistors & Logic Gates",
        content: [
          "• Transistor: NPN or PNP; emitter-base junction forward biased, collector-base reverse biased",
          "• Current: I_E = I_B + I_C;  β = I_C/I_B;  α = I_C/I_E;  β = α/(1-α)",
          "• NOT gate: output = Ā;  AND: A·B;  OR: A+B;  NAND: NOT AND;  NOR: NOT OR",
          "• NAND and NOR are universal gates (can implement any logic)",
        ]
      },
      {
        heading: "4. CBSE Traps & PYQs",
        content: [
          "TRAP: In n-type semiconductor, electrons are majority but crystal is ELECTRICALLY NEUTRAL.",
          "PYQ: A transistor as switch: saturation (ON) and cut-off (OFF) modes used — NOT active mode.",
          "PYQ: Zener diode works in reverse bias for voltage regulation; breakdown voltage is fixed.",
        ]
      }
    ]
  },

  "magnetic effects": {
    title: "Magnetic Effects of Current — Class 12 Master Guide",
    subject: "Physics",
    sections: [
      {
        heading: "1. Biot-Savart Law & Ampere's Law",
        content: [
          "• Biot-Savart: dB = (μ₀/4π) × (Idl sinθ)/r²",
          "• Field at centre of circular loop: B = μ₀I/2R",
          "• Infinite straight wire: B = μ₀I/2πr  (circles around wire, right-hand thumb rule)",
          "• Ampere's Law: ∮B·dl = μ₀I_enclosed  (for symmetric current distributions)",
          "• Solenoid: B = μ₀nI  (n = turns per metre); Toroid: B = μ₀NI/2πr",
        ]
      },
      {
        heading: "2. Force on Current & Moving Charge",
        content: [
          "• Force on wire: F = BIL sinθ  (F = IL × B in vector form)",
          "• Lorentz force: F = q(v × B)  (magnitude: qvB sinθ)",
          "• Cyclotron frequency: f = qB/2πm  (independent of speed!)",
          "• Radius in magnetic field: r = mv/qB",
        ]
      },
      {
        heading: "3. Galvanometer, Ammeter & Voltmeter",
        content: [
          "• Galvanometer → Ammeter: add shunt S = I_g G / (I - I_g) in parallel",
          "• Galvanometer → Voltmeter: add series R = (V/I_g) - G",
          "• Torque on coil: τ = NIBA sinα  (N turns, I current, B field, A area)",
          "• At equilibrium: NIBA sinα = kφ  (k = spring constant)",
        ]
      },
      {
        heading: "4. CBSE Traps & PYQs",
        content: [
          "TRAP: Ammeter has very low resistance (ideal = 0); Voltmeter very high resistance (ideal = ∞).",
          "TRAP: Cyclotron CANNOT accelerate neutrons (uncharged) or electrons (relativistic at high speeds).",
          "PYQ: Two parallel current-carrying wires attract if currents same direction; repel if opposite.",
        ]
      }
    ]
  },
};

/**
 * Match chapter name to curated data key (fuzzy)
 */
function findCuratedData(chapter: string) {
  const lower = chapter.toLowerCase();
  for (const [key, data] of Object.entries(CURATED_TOPIC_DATA)) {
    if (lower.includes(key) || key.split(" ").some(w => lower.includes(w) && w.length > 4)) {
      return data;
    }
  }
  return null;
}

/**
 * Parses raw markdown text (from AI response) into formatted sections for jsPDF
 */
function parseTextToSections(raw: string): Array<{ heading: string; content: string[] }> {
  // Strip pdf-download tags and other special markers from raw content
  const cleaned = raw
    .replace(/:::pdf-download[^:]*:::/g, "")
    .replace(/:::diagram[^:]*:::/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "");

  const lines = cleaned.split("\n");
  const sections: Array<{ heading: string; content: string[] }> = [];
  let currentHeading = "Summary & Key Highlights";
  let currentLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
      if (currentLines.length > 0) {
        sections.push({ heading: currentHeading, content: [...currentLines] });
        currentLines = [];
      }
      currentHeading = trimmed.replace(/^#{1,4}\s+/, "").replace(/\*\*/g, "").replace(/[⚡🎯📌]/g, "").trim();
    } else {
      const cleanLine = trimmed
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\$\$?([^$]+)\$\$?/g, "$1"); // strip LaTeX for plain PDF
      if (cleanLine.length > 0) {
        currentLines.push(cleanLine);
      }
    }
  }

  if (currentLines.length > 0) {
    sections.push({ heading: currentHeading, content: currentLines });
  }

  return sections.length > 0 ? sections : [
    { heading: "Revision Notes", content: lines.filter(l => l.trim().length > 0) }
  ];
}

/**
 * Generates and triggers browser download of a chapter-specific ExamSaathi PDF study sheet
 */
export function downloadStudyGuidePdf(options: PdfOptions): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Try curated data first (chapter-specific), then fall back to parsing raw AI content
  const curated = findCuratedData(options.chapter || options.title || "");

  const title = curated?.title || options.title || "ExamSaathi AI Study Guide";
  const subject = curated?.subject || options.subject || "Academic Sciences";
  const exam = options.exam || "CBSE Class 12 / JEE Main";
  const sections: Array<{ heading: string; content: string[] }> =
    curated?.sections ||
    options.sections?.map(s => ({
      heading: s.heading,
      content: Array.isArray(s.content) ? s.content : [s.content],
    })) ||
    (options.rawContent ? parseTextToSections(options.rawContent) : [
      { heading: "Study Notes", content: ["Content for this chapter will be generated based on your conversation."] }
    ]);

  let y = margin;

  const drawHeader = () => {
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, y, contentWidth, 18, "F");

    doc.setFillColor(255, 77, 0);
    doc.rect(margin, y + 18, contentWidth, 2, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("EXAMSAATHI.AI", margin + 5, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(255, 77, 0);
    doc.text(`TARGET: ${exam.toUpperCase()}`, margin + 5, y + 14);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("OFFICIAL REVISION CHEATSHEET", pageWidth - margin - 5, y + 11, { align: "right" });

    y += 26;

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    const splitTitle = doc.splitTextToSize(title, contentWidth);
    doc.text(splitTitle, margin, y);
    y += splitTitle.length * 6 + 2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(90, 90, 90);
    doc.text(`Subject: ${subject}  |  Generated: ${new Date().toLocaleDateString()}  |  Confidential Student Study Guide`, margin, y);
    y += 6;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;
  };

  const drawFooter = (pageNum: number) => {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text("ExamSaathi • Socratic AI Academic Mentor • IGMHS", margin, pageHeight - 7);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 7, { align: "right" });
  };

  let pageNum = 1;
  drawHeader();

  for (const sec of sections) {
    if (y > pageHeight - 40) {
      drawFooter(pageNum);
      doc.addPage();
      pageNum++;
      y = margin;
      drawHeader();
    }

    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y, contentWidth, 7.5, "F");
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentWidth, 7.5, "S");

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(sec.heading, margin + 3, y + 5.2);
    y += 11;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(20, 20, 20);

    const items = Array.isArray(sec.content) ? sec.content : [sec.content];
    for (const item of items) {
      const splitLines = doc.splitTextToSize(item, contentWidth - 4);
      if (y + splitLines.length * 4.5 > pageHeight - 20) {
        drawFooter(pageNum);
        doc.addPage();
        pageNum++;
        y = margin;
        drawHeader();
      }

      doc.text(splitLines, margin + 2, y);
      y += splitLines.length * 4.5 + 1.5;
    }

    y += 4;
  }

  drawFooter(pageNum);

  const cleanName = (options.chapter || options.title || "ExamSaathi_Study_Guide")
    .replace(/[^a-zA-Z0-9_\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 40);

  doc.save(`${cleanName}_Class12_Revision.pdf`);
}
