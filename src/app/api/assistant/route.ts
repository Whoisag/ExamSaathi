import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter, OpenRouterMessage } from "@/lib/openrouter";

// Comprehensive Chapter & Topic Encyclopedia for instant, guaranteed high-quality responses
const CHAPTER_TOPIC_REGISTRY: Record<string, { topics: string[]; formulas: string[]; tips: string }> = {
  "solutions": {
    topics: [
      "Concentration Terms: Molarity ($M$), Molality ($m$), Mole Fraction ($x_B$), and parts per million (ppm)",
      "Henry's Law: Gas solubility in liquids ($P = K_H \\cdot x$) and scuba diving/soda bottle applications",
      "Raoult's Law for volatile solutes and Ideal vs Non-Ideal Solutions",
      "Positive & Negative Deviations from Raoult's Law (intermolecular forces comparison & Azeotropic mixtures)",
      "Colligative Property 1: Relative Lowering of Vapour Pressure ($\\frac{P^0 - P_s}{P^0} = i \\cdot x_B$)",
      "Colligative Property 2: Elevation in Boiling Point ($\\Delta T_b = i \\cdot K_b \\cdot m$)",
      "Colligative Property 3: Depression in Freezing Point ($\\Delta T_f = i \\cdot K_f \\cdot m$) & Antifreeze solutions",
      "Colligative Property 4: Osmotic Pressure ($\\Pi = i \\cdot C R T = i \\cdot \\frac{w_B R T}{M_B V}$) & Reverse Osmosis",
      "Abnormal Molecular Mass & Van 't Hoff Factor: $i = 1 + (n - 1)\\alpha$ (dissociation) and $i = 1 + (1/n - 1)\\alpha$ (association)",
    ],
    formulas: [
      "P_{\\text{total}} = P_A^0 x_A + P_B^0 x_B",
      "\\Delta T_b = i \\cdot K_b \\cdot \\left(\\frac{w_B \\times 1000}{M_B \\times w_A}\\right)",
      "\\Delta T_f = i \\cdot K_f \\cdot \\left(\\frac{w_B \\times 1000}{M_B \\times w_A}\\right)",
      "\\Pi = i \\cdot \\left(\\frac{w_B}{M_B V}\\right) R T",
      "i = \\frac{\\text{Normal Molar Mass}}{\\text{Abnormal Molar Mass}} = \\frac{\\text{Observed Colligative Property}}{\\text{Calculated Colligative Property}}",
    ],
    tips: "In CBSE 12 and JEE Main, numericals combining Van 't Hoff factor $i$ with $\\Delta T_f$ or $\\Pi$ appear in almost every single shift. Always determine whether the solute dissociates ($i > 1$, e.g. $\\text{NaCl}, \\text{K}_2\\text{SO}_4$) or associates ($i < 1$, e.g. Benzoic acid in benzene) before substituting into formulas!",
  },
  "current electricity": {
    topics: [
      "Drift Velocity, Mobility & Microscopic Ohm's Law derivation ($I = n e A v_d = \\frac{n e^2 A \\tau}{m} E$)",
      "Temperature Dependence of Resistivity: $\\rho_T = \\rho_0[1 + \\alpha(T - T_0)]$ for conductors, semiconductors, and alloys",
      "Terminal Potential Difference ($V = E - I r$ during discharge, $V = E + I r$ during charging)",
      "Combination of non-identical cells in series and parallel ($E_{eq} = \\frac{\\sum E_i/r_i}{\\sum 1/r_i}$)",
      "Kirchhoff's Laws: Junction Rule (Conservation of Charge) and Loop Rule (Conservation of Energy)",
      "Wheatstone Bridge balanced condition derivation ($\\frac{P}{Q} = \\frac{R}{S}$) and Meter Bridge end-error correction",
      "Potentiometer: Comparison of EMFs ($\\frac{E_1}{E_2} = \\frac{l_1}{l_2}$) and Internal Resistance ($r = R\\left(\\frac{l_1}{l_2} - 1\\right)$)",
      "Electrical Heating ($H = I^2 R t$) and Maximum Power Transfer Theorem ($R_{ext} = r_{int}$)",
    ],
    formulas: [
      "I = n e A v_d, \\quad v_d = \\frac{e E \\tau}{m} = \\frac{e V \\tau}{m L}",
      "R = \\rho \\frac{L}{A} = \\frac{m}{n e^2 \\tau} \\frac{L}{A}",
      "V = E - I r \\quad \\Longleftrightarrow \\quad I = \\frac{E}{R + r}",
      "E_{eq} = \\frac{E_1 r_2 + E_2 r_1}{r_1 + r_2}, \\quad r_{eq} = \\frac{r_1 r_2}{r_1 + r_2}",
    ],
    tips: "Meter bridge end-error corrections and Kirchhoff's loop sign conventions are the highest-frequency testing areas in CBSE and JEE.",
  },
  "electrochemistry": {
    topics: [
      "Galvanic Cells, Standard Electrode Potentials ($E^0$), and Electrochemical Series",
      "Nernst Equation: $E_{cell} = E^0_{cell} - \\frac{2.303 R T}{n F} \\log Q = E^0_{cell} - \\frac{0.0591}{n} \\log Q$ at $298 \\text{ K}$",
      "Equilibrium Constant relation: $E^0_{cell} = \\frac{0.0591}{n} \\log K_c$ and Gibbs Free Energy: $\\Delta G^0 = -n F E^0_{cell}$",
      "Conductivity ($\\kappa = \\frac{G^*}{R}$) and Molar Conductivity ($\\Lambda_m = \\frac{\\kappa \\times 1000}{M}$)",
      "Kohlrausch's Law of Independent Migration of Ions: $\\Lambda_m^0 = \\nu_+ \\lambda_+^0 + \\nu_- \\lambda_-^0$",
      "Degree of Dissociation $\\alpha = \\frac{\\Lambda_m}{\\Lambda_m^0}$ and Weak Acid Dissociation Constant $K_a = \\frac{C \\alpha^2}{1 - \\alpha}$",
      "Faraday's Laws of Electrolysis: $w = Z I t = \\left(\\frac{M}{n F}\\right) I t$",
      "Commercial Batteries: Dry cell, Mercury cell, Lead storage battery (reactions during discharge and recharge), Fuel cells ($\text{H}_2\\text{-O}_2$)",
    ],
    formulas: [
      "E_{cell} = E^0_{cell} - \\frac{0.0591}{n} \\log\\frac{[\\text{Products}]}{[\\text{Reactants}]}",
      "\\Delta G^0 = -n F E^0_{cell} = -2.303 R T \\log K_c",
      "\\Lambda_m = \\frac{\\kappa \\times 1000}{\\text{Molarity}}",
      "w = \\frac{E_{eq} \\times I \\times t}{96500}",
    ],
    tips: "Lead storage battery electrode equations during discharge and recharge are virtually guaranteed 3-markers in CBSE board exams.",
  },
  "chemical kinetics": {
    topics: [
      "Rate of Reaction: Average vs Instantaneous rate and stoichiometric relations",
      "Order of Reaction vs Molecularity (elementary vs complex reaction differences)",
      "Zero Order Reaction: Integrated rate law ($[A]_0 - [A] = k t$) and Half-life ($t_{1/2} = \\frac{[A]_0}{2 k}$)",
      "First Order Reaction: Integrated rate law ($k = \\frac{2.303}{t} \\log\\frac{[A]_0}{[A]}$) and Half-life ($t_{1/2} = \\frac{0.693}{k}$)",
      "Pseudo-first order reactions (acidic hydrolysis of ester, inversion of cane sugar)",
      "Arrhenius Equation: $k = A e^{-E_a / R T}$ and $\\log\\frac{k_2}{k_1} = \\frac{E_a}{2.303 R}\\left[\\frac{T_2 - T_1}{T_1 T_2}\\right]$",
      "Activation Energy ($E_a$) determination from $\\log k$ vs $1/T$ slope ($\\text{Slope} = -\\frac{E_a}{2.303 R}$)",
    ],
    formulas: [
      "k = \\frac{2.303}{t} \\log\\frac{a}{a - x}, \\quad t_{1/2} = \\frac{0.693}{k}",
      "\\log k = \\log A - \\frac{E_a}{2.303 R T}",
      "\\log\\left(\\frac{k_2}{k_1}\\right) = \\frac{E_a}{2.303 R}\\left(\\frac{T_2 - T_1}{T_1 T_2}\\right)",
    ],
    tips: "First-order radioactive decay and Arrhenius two-temperature ratio problems comprise >75% of numericals in JEE/CBSE.",
  },
  "coordination compounds": {
    topics: [
      "Werner's Coordination Theory: Primary vs Secondary valencies",
      "IUPAC Nomenclature rules for coordination complexes and counter-ions",
      "Isomerism: Structural (Ionization, Hydrate, Linkage, Coordination) and Stereoisomerism (Geometrical cis/trans, Optical d/l)",
      "Valence Bond Theory (VBT): Hybridization, inner vs outer orbital ($d^2sp^3$ vs $sp^3d^2$), magnetic moments",
      "Crystal Field Theory (CFT): Splitting of $d$-orbitals in Octahedral ($\\Delta_o$) and Tetrahedral ($\\Delta_t = \\frac{4}{9}\\Delta_o$) fields",
      "Spectrochemical Series, Pairing Energy ($P$), and Strong-field vs Weak-field ligand configurations ($t_{2g}^p e_g^q$)",
      "Color of coordination complexes ($d\\text{-}d$ transitions) and Chelate effect stability",
    ],
    formulas: [
      "\\mu = \\sqrt{n(n + 2)} \\text{ B.M. (where } n = \\text{number of unpaired electrons)}",
      "\\Delta_t = \\frac{4}{9} \\Delta_o",
      "\\text{CFSE (Octahedral)} = (-0.4 n_{t_{2g}} + 0.6 n_{e_g}) \\Delta_o + m P",
    ],
    tips: "Draw clear crystal field energy diagrams showing $t_{2g}$ and $e_g$ splitting. Remember $\\text{CN}^-$ and $\\text{CO}$ are strong field, forcing pairing!",
  },
  "electrostatics": {
    topics: [
      "Coulomb's Law in vector form and dielectric permittivity ($F_m = F_0 / \\kappa$)",
      "Electric Field & Potential: Ring axis, electric dipole on axial and equatorial positions ($E_{axial} = 2 E_{equatorial}$)",
      "Gauss's Law applications: Infinite linear wire ($E = \\frac{\\lambda}{2 \\pi \\varepsilon_0 r}$), charged plane sheet ($E = \\frac{\\sigma}{2 \\varepsilon_0}$), spherical shell",
      "Capacitance of parallel plate capacitor with dielectric slab insertion ($C = \\frac{\\varepsilon_0 A}{d - t(1 - 1/\\kappa)}$)",
      "Energy stored in capacitors ($U = \\frac{1}{2} C V^2$) and energy loss during charge sharing: $\\Delta U = \\frac{C_1 C_2}{2(C_1 + C_2)}(V_1 - V_2)^2$",
    ],
    formulas: [
      "E_{\\text{axial}} = \\frac{2 k p}{r^3}, \\quad E_{\\text{equatorial}} = \\frac{k p}{r^3}",
      "V = \\frac{k p \\cos\\theta}{r^2}",
      "C = \\frac{\\kappa \\varepsilon_0 A}{d}, \\quad U = \\frac{1}{2} C V^2 = \\frac{Q^2}{2 C}",
    ],
    tips: "Gauss's Law derivations are virtually mandatory 5-markers in CBSE 12. In JEE, focus on charge redistribution across concentric metallic shells.",
  },
  "modern physics": {
    topics: [
      "Photoelectric Effect: Einstein's equation ($h\\nu = \\phi + K_{\\max}$), stopping potential vs frequency graphs",
      "De Broglie Wavelength of accelerated electrons ($\\lambda = \\frac{12.27}{\\sqrt{V}} \\text{ \\AA}$) and charged particles",
      "Bohr's Atomic Model: Energy levels ($E_n = -\\frac{13.6}{n^2} Z^2 \\text{ eV}$), radius ($r_n = 0.529 \\frac{n^2}{Z} \\text{ \\AA}$), and spectral series transitions",
      "Nuclear Binding Energy Curve, Mass Defect, and Q-value calculations ($\\Delta m \\times 931.5 \\text{ MeV}$)",
      "Radioactivity: Half-life ($T_{1/2} = \\frac{\\ln 2}{\\lambda}$), mean life ($\\tau = 1/\\lambda$), and decay law ($N = N_0 e^{-\\lambda t}$)",
    ],
    formulas: [
      "h \\nu = \\phi + e V_s = \\phi + \\frac{1}{2} m v_{max}^2",
      "\\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2 m q V}}",
      "\\frac{1}{\\lambda} = R Z^2 \\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)",
    ],
    tips: "High-scoring, formula-driven chapter. Memorize threshold wavelength relations and stopping potential graphs.",
  },
  "optics": {
    topics: [
      "Total Internal Reflection (TIR): Critical angle ($\\sin C = 1/\\mu$) and optical fibers",
      "Refraction at Spherical Surfaces: $\\frac{\\mu_2}{v} - \\frac{\\mu_1}{u} = \\frac{\\mu_2 - \\mu_1}{R}$ and Lens Maker's Formula: $\\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)$",
      "Prism formula: $\\mu = \\frac{\\sin((A + \\delta_m)/2)}{\\sin(A/2)}$",
      "Optical Instruments: Compound Microscope and Astronomical Telescope (Magnification in normal adjustment vs near point)",
      "Wave Optics: Huygens' Wavefront principle, reflection and refraction proof using wave theory",
      "Young's Double Slit Experiment (YDSE): Fringe width $\\beta = \\frac{\\lambda D}{d}$, intensity $I = 4 I_0 \\cos^2(\\phi/2)$",
      "Diffraction at Single Slit: Central maximum width $\\frac{2 \\lambda D}{a}$ and secondary maxima intensities",
    ],
    formulas: [
      "\\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)",
      "m_{\\text{telescope}} = -\\frac{f_o}{f_e} \\left(1 + \\frac{f_e}{D}\\right), \\quad L = f_o + f_e",
      "\\beta = \\frac{\\lambda D}{d}",
    ],
    tips: "Compound microscope ray diagrams and Lens Maker's formula derivations with convex/concave combinations are recurrent 5-markers.",
  },
  "integrals": {
    topics: [
      "Definite Integrals: King's Property $\\int_a^b f(x) dx = \\int_a^b f(a + b - x) dx$",
      "Periodic & Symmetric properties: $\\int_{-a}^a f(x) dx$ for even and odd functions",
      "Integration by Parts and standard form $\\int e^x [f(x) + f'(x)] dx = e^x f(x) + C$",
      "Partial fractions decomposition techniques",
      "Area under simple curves: Parabola with lines, circles, and ellipse quadrants",
      "Differential Equations: Linear first order with integrating factor $I.F. = e^{\\int P dx}$",
    ],
    formulas: [
      "\\int_0^a f(x) dx = \\int_0^a f(a - x) dx",
      "\\int e^x [f(x) + f'(x)] dx = e^x f(x) + C",
      "y \\cdot (I.F.) = \\int Q \\cdot (I.F.) dx + C",
    ],
    tips: "Over 80% of JEE Main definite integral questions yield instantly upon applying the King's property and adding equations.",
  },
};

// Helper: Extract any mentioned chapter name from the user message
function extractChapterName(text: string): string | null {
  const match = text.match(/(?:chapter|unit|topic|from|in|for|about)\s+([a-zA-Z0-9\s]{3,30})(?:\s+class|\s+chemistry|\s+physics|\s+math|\s+for|\s+cbse|\s+jee|$)/i);
  if (match && match[1]) {
    const candidate = match[1].trim();
    if (!["the", "some", "any", "this", "that", "important", "stuff"].includes(candidate.toLowerCase())) {
      return candidate;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { messages = [], exam = "cbse-12", chapter = "General Strategy", confidence, prepHubContext } = body;

    const lastUserMessage = (messages[messages.length - 1]?.content || "").toLowerCase();
    const detectedChapter = extractChapterName(lastUserMessage) || chapter;

    const systemPrompt = `You are Saathi AI — an expert academic mentor, tutor, and exam strategist for Indian competitive exams (JEE Main, JEE Advanced, and CBSE Class 12 Boards).
You provide clear, authoritative, direct, and pedagogically rich explanations with step-by-step logic, key topic breakdowns, and formulas formatted in clean LaTeX ($...$ and $$...$$).

CRITICAL INSTRUCTIONS:
1. Always directly answer what the user asked immediately. Output ONLY the final pedagogical answer.
2. NEVER output internal monologues, reasoning transcripts, scratchpads, or headers like "Here's a thinking process:" or "1. Analyze User Input:".
3. Structure your response with clean Markdown headings (###), bullet points, and LaTeX formulas.
4. Active context: Target Exam: ${exam.toUpperCase()}, Module: ${detectedChapter}.${prepHubContext ? `\n\n## STUDENT'S CURRENT PREP STATUS (from their Prep Hub):\n${prepHubContext}\n\nIMPORTANT: When the student asks for a study plan, revision schedule, or "make a plan", use this data to:\n1. Prioritize weak topics with high marks impact first\n2. Schedule quick wins to build confidence\n3. Reference their actual accuracy rates and days since last revision\n4. Create a specific, personalized timetable with chapter names they are tracking\n` : ""}
5. ON-DEMAND VISUAL DIAGRAMS & ILLUSTRATIONS:
Whenever the student asks to "draw", "diagram", "illustrate", "show visually", or "generate an image" (e.g. for physics ray optics, circuits, meters, chemistry cells, orbital splitting, or math graphs):
- You MUST synthesize a high-resolution educational diagram image by including a Markdown image tag:
  ![Diagram: <Topic Title>](https://image.pollinations.ai/prompt/<URL-encoded detailed educational prompt, e.g. clean%202D%20scientific%20diagram%20of%20compound%20microscope%20ray%20optics%20labeled%20white%20background>?width=800&height=500&nologo=true)
- Immediately underneath the image, break down:
  • Key Component Labels (e.g. Objective, Eyepiece, Principal Axis, Focal Points)
  • Working Principle & Ray/Current Tracing
  • Essential Exam Scoring & Negative Marking Traps!`;

    const formattedMessages: OpenRouterMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-5).map((m: any) => ({
        role: (m.role === "user" || m.role === "assistant" ? m.role : "user") as "user" | "assistant",
        content: String(m.content || ""),
      })),
    ];

    if (formattedMessages.length === 1) {
      formattedMessages.push({
        role: "user",
        content: `What are the most important high-yield topics and formula priorities for ${detectedChapter} in ${exam}?`,
      });
    }

    // Call high-speed AI engine with generous token capacity (4096) to fully accommodate multi-question sets and derivations
    const aiResult = await callOpenRouter(formattedMessages, {
      model: process.env.OPENROUTER_MODEL_ASSISTANT || "google/gemini-2.0-flash-lite-001",
      temperature: 0.25,
      maxTokens: 4096,
      timeoutMs: 16000,
    });

    if (aiResult.text && !aiResult.error) {
      return NextResponse.json({
        success: true,
        source: "live_ai",
        provider: aiResult.provider || "openrouter",
        message: {
          role: "assistant",
          content: aiResult.text,
        },
      });
    }

    // Intelligent Fallback: Check knowledge base registry
    let matchedChapterKey = "";
    for (const key of Object.keys(CHAPTER_TOPIC_REGISTRY)) {
      if (lastUserMessage.includes(key) || detectedChapter.toLowerCase().includes(key)) {
        matchedChapterKey = key;
        break;
      }
    }

    let fallbackText = "";

    if (matchedChapterKey && CHAPTER_TOPIC_REGISTRY[matchedChapterKey]) {
      const info = CHAPTER_TOPIC_REGISTRY[matchedChapterKey];
      const title = matchedChapterKey.toUpperCase();
      fallbackText = `### ⚡ High-Yield Topics for ${title} (${exam.toUpperCase()})\n\n` +
        `Here is the verified pedagogical breakdown of **high-weightage topics and recurring numericals**:\n\n`;
      info.topics.forEach((t, i) => {
        fallbackText += `${i + 1}. **${t}**\n`;
      });
      fallbackText += `\n#### 📌 Essential Mathematical Relations & Formulas:\n`;
      info.formulas.forEach((f) => {
        fallbackText += `- ${f}\n`;
      });
      fallbackText += `\n> **Exam Scoring Tip:** ${info.tips}`;
    } else if (detectedChapter && detectedChapter.toLowerCase() !== "general strategy") {
      fallbackText = `### ⚡ High-Yield Topics for ${detectedChapter.toUpperCase()} (${exam.toUpperCase()})\n\n` +
        `Based on historical PYQ frequency trends for **${detectedChapter}**:\n\n` +
        `1. **Core NCERT In-Text Numericals**: Ensure all solved exemplar questions are mastered.\n` +
        `2. **Fundamental Laws & Derivations**: Memorize boundary conditions and standard state conversions.\n` +
        `3. **High-Probability Subtopics**: Review the weightage distribution in the Chapter Analyzer.\n` +
        `4. **Previous 5 Years Shifts**: Solve at least 15 verified questions under timed conditions to avoid sign-convention traps.`;
    } else {
      fallbackText = `### 🎯 Strategic Revision Directive for ${exam.toUpperCase()}\n\n` +
        `To maximize your score in your target exam:\n\n` +
        `1. **Core NCERT Mastery**: Complete all in-text numericals and Exemplar problems.\n` +
        `2. **Historical PYQ Frequency**: Prioritize the top-weighted subtopics identified in the Chapter Analyzer.\n` +
        `3. **Error Logging**: Note sign conventions and negative-marking traps from past 3 years' shifts.`;
    }

    return NextResponse.json({
      success: true,
      source: "deterministic_fallback",
      fallbackReason: aiResult.error || "TIMEOUT_FAILOVER",
      message: {
        role: "assistant",
        content: fallbackText,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
