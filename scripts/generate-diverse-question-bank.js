const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const file1 = '/home/whoisag/Downloads/Class12_PCM_1000_Question_Bank.csv';
const file2 = '/home/whoisag/Downloads/Class12_PCM_Additional_1000_Question_Bank.csv';
const file3 = '/home/whoisag/Downloads/Class12_PCM_All_Chapters_Exactly_1000.csv';
const outputFile = path.join(__dirname, '../public/data/csv_questions.json');

function getTemplateKey(text) {
  return text
    .replace(/-?\d+(\.\d+)?/g, "#")
    .replace(/\s+/g, " ")
    .trim();
}

// 1. Extract deduplicated base from CSVs (keeping 1 instance per template)
const csvQuestions = [];
const seenTemplates = new Map();
let idCounter = 1;

[file1, file2, file3].forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    const parsed = Papa.parse(content, { header: true, skipEmptyLines: true });
    parsed.data.forEach(row => {
      if (!row.Subject || !row.Question) return;
      let subject = row.Subject.trim();
      if (subject.toLowerCase() === 'maths' || subject.toLowerCase() === 'math') subject = 'Mathematics';
      if (subject.toLowerCase() === 'physics') subject = 'Physics';
      if (subject.toLowerCase() === 'chemistry') subject = 'Chemistry';

      const chapter = row.Chapter ? row.Chapter.trim() : 'General';
      const templateKey = `${subject}::${chapter}::${getTemplateKey(row.Question)}`;

      const count = seenTemplates.get(templateKey) || 0;
      if (count < 1) {
        seenTemplates.set(templateKey, count + 1);
        const rawDiff = (row.Difficulty || 'Medium').trim();
        const difficulty = rawDiff.charAt(0).toUpperCase() + rawDiff.slice(1).toLowerCase();
        csvQuestions.push({
          id: `qb-csv-${idCounter++}`,
          exam: 'cbse-12',
          subject,
          chapter,
          year: 2024,
          marks: difficulty === 'Hard' ? 5 : (difficulty === 'Medium' ? 3 : 1),
          questionType: 'Numerical Drill',
          difficulty,
          questionText: row.Question.trim(),
          sourceType: 'csv_bank',
          analyzerTags: ['CSV Bank', chapter],
          answer: row.Answer ? row.Answer.trim() : 'Apply standard formulas for this topic.',
          hint: 'Identify given parameters, write down the formula, and substitute standard SI units.'
        });
      }
    });
  }
});

console.log(`Deduplicated CSV questions retained: ${csvQuestions.length}`);

// 2. Curated Diverse Question Bank Covering ALL CBSE Class 12 & JEE Main Topics
const diverseBank = [
  // ==========================================
  // PHYSICS
  // ==========================================
  // Electric Charges & Fields
  {
    subject: "Physics",
    chapter: "Electric Charges and Fields",
    difficulty: "Easy",
    marks: 1,
    questionType: "MCQ",
    questionText: "An electric dipole of dipole moment p is placed in a uniform electric field E. The torque experienced by the dipole is maximum when the angle between p and E is:",
    options: [{ label: "A", text: "0°" }, { label: "B", text: "45°" }, { label: "C", text: "90°" }, { label: "D", text: "180°" }],
    correctOption: "C",
    answer: "Torque τ = p × E = pE sin(θ). Torque is maximum when sin(θ) = 1, i.e., θ = 90° (dipole perpendicular to field).",
    hint: "Use τ = pE sin θ. Find θ where sin θ achieves its maximum value.",
    analyzerTags: ["Electric Dipole", "Torque in Uniform Field", "1-Marker"]
  },
  {
    subject: "Physics",
    chapter: "Electric Charges and Fields",
    difficulty: "Hard",
    marks: 5,
    questionType: "Derivation Drill",
    questionText: "State Gauss's Law in electrostatics. Using Gauss's law, derive an expression for the electric field due to an infinitely long straight uniformly charged wire of linear charge density λ at a perpendicular distance r.",
    answer: "Gauss's Law states that the total electric flux through a closed Gaussian surface is equal to 1/ε₀ times the net charge enclosed: ∮ E·dA = q_enc / ε₀.\n\nDerivation:\n1. Consider a coaxial cylindrical Gaussian surface of radius r and length L.\n2. Charge enclosed = q_enc = λL.\n3. By symmetry, E is radially outward. Flux through flat circular end caps is zero (E ⊥ dA).\n4. Flux through curved surface = E × (2πrL).\n5. Applying Gauss's Law: E(2πrL) = λL / ε₀ → E = λ / (2πε₀r) = (1 / 4πε₀)(2λ / r).",
    hint: "Draw a cylindrical Gaussian surface of radius r and length L. Flat end caps contribute zero flux.",
    analyzerTags: ["Gauss Law", "Infinite Wire", "Section D 5-Marker"]
  },
  {
    subject: "Physics",
    chapter: "Electric Charges and Fields",
    difficulty: "Medium",
    marks: 3,
    questionType: "Short Answer",
    questionText: "A point charge +q is placed at the center of a hollow conducting sphere of inner radius R₁ and outer radius R₂. Find the surface charge density on the inner and outer surfaces of the shell.",
    answer: "1. Due to electrostatic induction, charge -q is induced on the inner surface of radius R₁.\nSurface charge density on inner surface: σ_inner = -q / (4πR₁²).\n2. Since the shell was originally neutral, charge +q appears on the outer surface of radius R₂.\nSurface charge density on outer surface: σ_outer = +q / (4πR₂²).",
    hint: "Apply charge conservation on the conducting shell and Gauss's law inside the conductor where E = 0.",
    analyzerTags: ["Electrostatic Induction", "Concentric Shells", "Charge Density"]
  },

  // Electrostatic Potential & Capacitance
  {
    subject: "Physics",
    chapter: "Electrostatic Potential and Capacitance",
    difficulty: "Medium",
    marks: 3,
    questionType: "Numerical",
    questionText: "A parallel plate capacitor with air between the plates has a capacitance of 8 pF. The separation between the plates is reduced by half and the space between them is filled with a substance of dielectric constant K = 6. Calculate the new capacitance.",
    answer: "Original capacitance: C₀ = ε₀A / d = 8 pF.\nNew plate separation: d' = d / 2.\nWith dielectric K = 6:\nC = K(ε₀A / d') = K(ε₀A / (d/2)) = 2K · (ε₀A / d) = 2 × 6 × C₀ = 12 × 8 pF = 96 pF.",
    hint: "C = K ε₀A / d'. When d is halved, capacitance doubles. With dielectric K, it multiplies by K.",
    analyzerTags: ["Parallel Plate Capacitor", "Dielectric Constant", "Capacitance Calculation"]
  },
  {
    subject: "Physics",
    chapter: "Electrostatic Potential and Capacitance",
    difficulty: "Hard",
    marks: 4,
    questionType: "Short Answer",
    questionText: "Two capacitors of capacitances C₁ and C₂ charged to potentials V₁ and V₂ respectively are connected in parallel. Derive the expression for the common potential V and the loss in electrostatic energy during sharing of charges.",
    answer: "1. Common Potential V = Total Charge / Total Capacitance = (C₁V₁ + C₂V₂) / (C₁ + C₂).\n2. Initial Energy: U_i = (1/2)C₁V₁² + (1/2)C₂V₂².\n3. Final Energy: U_f = (1/2)(C₁ + C₂)V² = (1/2)(C₁V₁ + C₂V₂)² / (C₁ + C₂).\n4. Energy Loss ΔU = U_i - U_f = [C₁C₂ / 2(C₁ + C₂)] × (V₁ - V₂)². Since (V₁ - V₂)² ≥ 0, energy is always lost as heat and spark radiation.",
    hint: "Use charge conservation: Q_total = C₁V₁ + C₂V₂ = (C₁ + C₂)V.",
    analyzerTags: ["Energy Loss", "Charge Sharing", "Common Potential"]
  },

  // Current Electricity
  {
    subject: "Physics",
    chapter: "Current Electricity",
    difficulty: "Easy",
    marks: 2,
    questionType: "Short Answer",
    questionText: "Define drift velocity of free electrons and relaxation time in a metallic conductor. Write the relation between drift velocity and electric current.",
    answer: "Drift velocity (v_d) is the average velocity acquired by free electrons in a conductor under the influence of an applied electric field.\nRelaxation time (τ) is the average time elapsed between two successive collisions of an electron with the fixed metal ions.\nRelation: I = n · e · A · v_d, where n is number density of free electrons, e is electron charge, and A is cross-sectional area.",
    hint: "v_d = (eE/m)τ and I = n e A v_d.",
    analyzerTags: ["Drift Velocity", "Relaxation Time", "Microscopic Current"]
  },
  {
    subject: "Physics",
    chapter: "Current Electricity",
    difficulty: "Hard",
    marks: 5,
    questionType: "Derivation Drill",
    questionText: "State Kirchhoff's rules for electrical networks. Use Kirchhoff's rules to obtain the condition of balance in a Wheatstone bridge network: P / Q = R / S.",
    answer: "Kirchhoff's Rules:\n1. Junction Rule: Σ I = 0 at any node (conservation of charge).\n2. Loop Rule: Σ ΔV = 0 around any closed mesh (conservation of energy).\n\nWheatstone Bridge Balance Proof:\nAt balance, current through galvanometer I_g = 0, so potential at B equals potential at D (V_B = V_D).\nLoop ABDA: -I₁P + I₂R = 0 → I₁P = I₂R (Equation 1)\nLoop BCDB: -I₁Q + I₂S = 0 → I₁Q = I₂S (Equation 2)\nDividing Eq (1) by Eq (2): (I₁P) / (I₁Q) = (I₂R) / (I₂S) → P / Q = R / S.",
    hint: "Set I_g = 0. Apply Kirchhoff's Loop rule to loop ABDA and loop BCDB.",
    analyzerTags: ["Kirchhoff Rules", "Wheatstone Bridge", "Section D 5-Marker"]
  },
  {
    subject: "Physics",
    chapter: "Current Electricity",
    difficulty: "Medium",
    marks: 3,
    questionType: "Numerical",
    questionText: "A battery of emf 10 V and internal resistance 3 Ω is connected to an external resistor R. If the current in the circuit is 0.5 A, determine: (i) the resistance of the resistor R, and (ii) the terminal voltage of the battery.",
    answer: "(i) Total resistance = R + r = E / I = 10 V / 0.5 A = 20 Ω.\nExternal resistance: R = 20 Ω - 3 Ω = 17 Ω.\n\n(ii) Terminal voltage: V = E - Ir = 10 V - (0.5 A × 3 Ω) = 10 - 1.5 = 8.5 V.\n(Or V = I · R = 0.5 A × 17 Ω = 8.5 V).",
    hint: "I = E / (R + r) and Terminal Voltage V = E - Ir.",
    analyzerTags: ["Internal Resistance", "Terminal Voltage", "Ohm's Law Drill"]
  },

  // Moving Charges & Magnetism
  {
    subject: "Physics",
    chapter: "Moving Charges and Magnetism",
    difficulty: "Medium",
    marks: 3,
    questionType: "Short Answer",
    questionText: "How can a galvanometer of resistance G and full-scale deflection current I_g be converted into: (i) an ammeter of range 0 to I, and (ii) a voltmeter of range 0 to V?",
    answer: "(i) Ammeter conversion: Connect a low resistance (shunt S) in parallel with the galvanometer.\nS = (I_g · G) / (I - I_g).\n\n(ii) Voltmeter conversion: Connect a high resistance R in series with the galvanometer.\nR = (V / I_g) - G.",
    hint: "Ammeter needs parallel shunt S; Voltmeter needs series multiplier resistor R.",
    analyzerTags: ["Galvanometer Conversion", "Ammeter & Voltmeter", "Instrumentation"]
  },
  {
    subject: "Physics",
    chapter: "Moving Charges and Magnetism",
    difficulty: "Hard",
    marks: 5,
    questionType: "Derivation Drill",
    questionText: "State Biot-Savart law. Use it to derive the expression for the magnetic field B along the axial line of a circular current-carrying loop of radius R and N turns at a distance x from its center.",
    answer: "Biot-Savart Law: dB = (μ₀ / 4π) · (I dl × r̂) / r² = (μ₀ / 4π) (I dl sin θ) / r².\n\nDerivation for circular loop:\n1. Distance from current element to axial point P: r = √(R² + x²).\n2. Component of dB along the axis: dB_x = dB · sin α = dB · (R / r).\n3. Radial components cancel due to diametrically opposite pairs.\n4. B_total = ∮ dB_x = (μ₀ I R / (4π r³)) ∮ dl = (μ₀ I R / (4π r³)) · (2πR) = (μ₀ I R²) / [2(R² + x²)^(3/2)].\n5. For N turns: B = (μ₀ N I R²) / [2(R² + x²)^(3/2)]. At center (x = 0): B = μ₀ N I / (2R).",
    hint: "Integrate axial components dB_x = dB sin α where sin α = R / r. Perpendicular components cancel.",
    analyzerTags: ["Biot-Savart Law", "Circular Loop Axis", "Section D 5-Marker"]
  },

  // Magnetism & Matter
  {
    subject: "Physics",
    chapter: "Magnetism and Matter",
    difficulty: "Easy",
    marks: 3,
    questionType: "Short Answer",
    questionText: "Distinguish between Diamagnetic, Paramagnetic, and Ferromagnetic substances on the basis of: (i) magnetic susceptibility (χ), (ii) relative permeability (μ_r), and (iii) behavior in a non-uniform magnetic field.",
    answer: "1. Diamagnetic: (i) χ is small and negative (-1 ≤ χ < 0), (ii) 0 ≤ μ_r < 1, (iii) Expelled from stronger to weaker field regions.\n2. Paramagnetic: (i) χ is small and positive (0 < χ < ε), (ii) μ_r > 1, (iii) Weakly attracted toward stronger field regions.\n3. Ferromagnetic: (i) χ is very large and positive (χ >> 1000), (ii) μ_r >> 1, (iii) Strongly attracted toward stronger field regions.",
    hint: "Recall: Dia = repelled (negative χ); Para = weakly attracted (small positive χ); Ferro = strongly attracted (large positive χ).",
    analyzerTags: ["Dia-Para-Ferro", "Magnetic Properties", "Comparative Drill"]
  },

  // Electromagnetic Induction
  {
    subject: "Physics",
    chapter: "Electromagnetic Induction",
    difficulty: "Medium",
    marks: 3,
    questionType: "Short Answer",
    questionText: "A metallic rod of length L is rotated with an angular frequency ω in a uniform magnetic field B perpendicular to the plane of rotation about one of its ends. Derive the expression for the induced EMF between the center and the rim.",
    answer: "Consider an element of length dr at distance r from the pivot.\n1. Linear speed of element: v = ω · r.\n2. Induced EMF in element: dε = B · v · dr = B (ω r) dr.\n3. Total induced EMF: ε = ∫[0 to L] B ω r dr = B ω [r² / 2]₀ᴸ = (1/2) B ω L².",
    hint: "Integrate dε = B v dr with v = ωr from r = 0 to L.",
    analyzerTags: ["Motional EMF", "Rotating Rod", "Electromagnetic Induction"]
  },

  // Alternating Current
  {
    subject: "Physics",
    chapter: "Alternating Current",
    difficulty: "Hard",
    marks: 5,
    questionType: "Derivation Drill",
    questionText: "In a series LCR circuit connected to an AC source V = V₀ sin(ωt), derive the expression for impedance Z and phase angle φ using phasor diagrams. Explain the phenomenon of electrical resonance and deduce the formula for resonant frequency.",
    answer: "1. Phasor Diagram Analysis:\nVoltage across resistor V_R = I·R is in phase with current I.\nVoltage across inductor V_L = I·X_L leads current by π/2.\nVoltage across capacitor V_C = I·X_C lags current by π/2.\nResultant reactive voltage: V_react = V_L - V_C = I(X_L - X_C).\n\n2. Total Applied Voltage: V₀² = V_R² + (V_L - V_C)² = I₀² [R² + (X_L - X_C)²].\nImpedance Z = V₀ / I₀ = √[R² + (ωL - 1/(ωC))²].\nPhase Angle: tan φ = (X_L - X_C) / R = (ωL - 1/(ωC)) / R.\n\n3. Electrical Resonance:\nResonance occurs when impedance Z is minimum (Z = R), which happens when X_L = X_C.\nω₀L = 1 / (ω₀C) → ω₀² = 1 / (LC) → ω₀ = 1 / √(LC) → f₀ = 1 / [2π√(LC)].",
    hint: "Draw phasors V_R, V_L, V_C. Set X_L = X_C for resonance.",
    analyzerTags: ["LCR Series Circuit", "Resonance Condition", "Impedance Derivation"]
  },

  // Ray Optics & Optical Instruments
  {
    subject: "Physics",
    chapter: "Ray Optics and Optical Instruments",
    difficulty: "Hard",
    marks: 5,
    questionType: "Derivation Drill",
    questionText: "Derive the Lens Maker's formula: 1/f = (μ - 1)[1/R₁ - 1/R₂] for a thin double convex lens of refractive index μ placed in air.",
    answer: "Consider refraction at two spherical interfaces of radii R₁ and R₂:\n1. First interface (air to glass μ): μ/v₁ - 1/u = (μ - 1)/R₁ (Eq 1)\n2. Second interface (glass μ to air): (1/μ)/v - 1/v₁ = ((1/μ) - 1)/R₂ → 1/v - μ/v₁ = -(μ - 1)/R₂ (Eq 2)\n3. Adding Eq (1) and Eq (2): 1/v - 1/u = (μ - 1)[1/R₁ - 1/R₂]\n4. By thin lens formula, 1/v - 1/u = 1/f.\nTherefore: 1/f = (μ - 1)[1/R₁ - 1/R₂].",
    hint: "Apply spherical surface refraction formula μ₂/v - μ₁/u = (μ₂ - μ₁)/R at both surfaces and add equations.",
    analyzerTags: ["Lens Maker Formula", "Ray Optics", "Section D 5-Marker"]
  },
  {
    subject: "Physics",
    chapter: "Ray Optics and Optical Instruments",
    difficulty: "Medium",
    marks: 3,
    questionType: "Short Answer",
    questionText: "Draw a labeled ray diagram of an astronomical telescope in normal adjustment (image at infinity). Write the formula for its magnifying power and tube length.",
    answer: "1. Ray Diagram: Parallel rays from distant object focus at principal focus of objective (f_o). The intermediate image forms at focus of eyepiece (f_e), producing final parallel rays entering eye.\n2. Magnifying Power: m = -f_o / f_e (negative indicates inverted image).\n3. Tube Length: L = f_o + f_e.",
    hint: "Normal adjustment means image at infinity, so L = f_o + f_e and m = -f_o / f_e.",
    analyzerTags: ["Astronomical Telescope", "Ray Diagram", "Normal Adjustment"]
  },

  // Wave Optics
  {
    subject: "Physics",
    chapter: "Wave Optics",
    difficulty: "Hard",
    marks: 5,
    questionType: "Derivation Drill",
    questionText: "State Huygens' Principle. Use Huygens' wave theory to verify Snell's law of refraction of light at a plane surface separating two media.",
    answer: "Huygens' Principle:\n1. Every point on a wavefront acts as a source of secondary wavelets spreading with the speed of light in that medium.\n2. The forward envelope/tangent to these secondary wavelets at any later time gives the new wavefront.\n\nRefraction Proof (Snell's Law):\n1. Let plane wavefront AB be incident on interface at angle i. Time taken to reach C from B is τ = BC / v₁.\n2. In time τ, secondary wavelet from A travels distance AE = v₂ · τ in medium 2.\n3. In right-angled ΔABC: sin i = BC / AC = (v₁ τ) / AC.\n4. In right-angled ΔAEC: sin r = AE / AC = (v₂ τ) / AC.\n5. Dividing: (sin i) / (sin r) = v₁ / v₂ = μ₂ / μ₁ → μ₁ sin i = μ₂ sin r (Snell's Law).",
    hint: "Draw incident wavefront AB and refracted wavefront EC. Express sin i and sin r in terms of v₁τ and v₂τ.",
    analyzerTags: ["Huygens Principle", "Snell's Law Proof", "Wave Optics Derivation"]
  },

  // Dual Nature of Radiation & Matter
  {
    subject: "Physics",
    chapter: "Dual Nature of Radiation and Matter",
    difficulty: "Easy",
    marks: 3,
    questionType: "Short Answer",
    questionText: "Write Einstein's photoelectric equation: hν = Φ₀ + (1/2)m v_max². Explain how it accounts for: (i) existence of threshold frequency, and (ii) independence of maximum kinetic energy on light intensity.",
    answer: "Einstein's Photoelectric Equation: K_max = hν - Φ₀ = h(ν - ν₀).\n(i) Threshold Frequency: If ν < ν₀, K_max is negative which is impossible, so no photoelectrons are emitted regardless of intensity.\n(ii) Intensity Independence: Intensity represents the number of photons per second, not energy per photon. Each electron absorbs one photon of energy hν, so K_max depends only on frequency ν.",
    hint: "K_max = hν - Φ₀. Intensity increases electron quantity, while frequency increases individual kinetic energy.",
    analyzerTags: ["Photoelectric Effect", "Einstein Equation", "Work Function"]
  },

  // Semiconductors & Electronic Devices
  {
    subject: "Physics",
    chapter: "Semiconductors",
    difficulty: "Medium",
    marks: 3,
    questionType: "Short Answer",
    questionText: "Explain the formation of depletion region and potential barrier in a p-n junction diode. How does the width of the depletion layer change under: (i) forward bias, and (ii) reverse bias?",
    answer: "1. Formation: When p and n type semiconductors join, holes diffuse from p to n and electrons from n to p. Near the junction, unneutralized immobile ionized donor (+ve) and acceptor (-ve) ions create a depletion region and an electric field (potential barrier) opposing further diffusion.\n2. Bias effect:\n(i) Forward bias: Applied field opposes internal barrier → depletion width decreases.\n(ii) Reverse bias: Applied field aids internal barrier → depletion width increases.",
    hint: "Forward bias shrinks the barrier width; reverse bias widens the depletion layer.",
    analyzerTags: ["PN Junction", "Depletion Layer", "Barrier Potential"]
  },

  // ==========================================
  // CHEMISTRY
  // ==========================================
  // Solutions
  {
    subject: "Chemistry",
    chapter: "Solutions",
    difficulty: "Medium",
    marks: 3,
    questionType: "Numerical",
    questionText: "45 g of ethylene glycol (C₂H₆O₂) is mixed with 600 g of water. Calculate: (i) the freezing point depression, and (ii) the freezing point of the solution. (K_f for water = 1.86 K kg mol⁻¹, Molar mass of C₂H₆O₂ = 62 g/mol)",
    answer: "1. Moles of ethylene glycol = 45 g / 62 g·mol⁻¹ = 0.7258 mol.\n2. Mass of water = 600 g = 0.600 kg.\n3. Molality (m) = 0.7258 mol / 0.600 kg = 1.2097 mol/kg.\n4. Freezing point depression: ΔT_f = K_f × m = 1.86 K kg mol⁻¹ × 1.2097 mol/kg = 2.25 K.\n5. Freezing point of solution: T_f = 273.15 K - 2.25 K = 270.90 K (-2.25 °C).",
    hint: "Find molality m = (mass / molar mass) / (kg of solvent), then ΔT_f = K_f · m.",
    analyzerTags: ["Colligative Properties", "Freezing Point Depression", "Numerical Drill"]
  },
  {
    subject: "Chemistry",
    chapter: "Solutions",
    difficulty: "Easy",
    marks: 2,
    questionType: "Short Answer",
    questionText: "State Raoult's Law for a solution of volatile liquids. What type of deviation from Raoult's law is exhibited by a mixture of ethanol and acetone? Give reason.",
    answer: "Raoult's Law: For a solution of volatile liquids, the partial vapour pressure of each component in the solution is directly proportional to its mole fraction: P_A = P_A° · x_A.\n\nEthanol + Acetone exhibits POSITIVE deviation from Raoult's Law.\nReason: In pure ethanol, molecules are held by strong intermolecular hydrogen bonds. Adding acetone breaks these hydrogen bonds, weakening solute-solvent interactions (A-B < A-A, B-B), thereby increasing vapour pressure.",
    hint: "Ethanol-acetone breaks hydrogen bonds → positive deviation (weaker A-B attraction).",
    analyzerTags: ["Raoult Law", "Positive Deviation", "Hydrogen Bonding"]
  },

  // Electrochemistry
  {
    subject: "Chemistry",
    chapter: "Electrochemistry",
    difficulty: "Hard",
    marks: 5,
    questionType: "Numerical",
    questionText: "Calculate the EMF of the following cell at 298 K:\nMg(s) | Mg²⁺ (0.001 M) || Cu²⁺ (0.0001 M) | Cu(s)\nGiven: E°(Mg²⁺/Mg) = -2.37 V, E°(Cu²⁺/Cu) = +0.34 V. (log 10 = 1, 2.303 RT/F = 0.059 V)",
    answer: "1. Cell Reaction: Mg(s) + Cu²⁺(aq) → Mg²⁺(aq) + Cu(s) with n = 2 electrons transferred.\n2. Standard Cell Potential: E°_cell = E°_cathode - E°_anode = 0.34 - (-2.37) = +2.71 V.\n3. Reaction Quotient Q = [Mg²⁺] / [Cu²⁺] = 0.001 / 0.0001 = 10.\n4. Nernst Equation: E_cell = E°_cell - (0.059 / n) log Q\nE_cell = 2.71 - (0.059 / 2) log(10) = 2.71 - 0.0295 = 2.6805 V.",
    hint: "E°_cell = E°_cathode - E°_anode. Apply Nernst equation with n = 2 and Q = [Mg²⁺]/[Cu²⁺].",
    analyzerTags: ["Nernst Equation", "Cell Potential", "Electrochemistry Drill"]
  },
  {
    subject: "Chemistry",
    chapter: "Electrochemistry",
    difficulty: "Medium",
    marks: 3,
    questionType: "Short Answer",
    questionText: "State Kohlrausch's Law of independent migration of ions. How does this law help in determining the limiting molar conductivity (Λ°_m) of weak electrolytes like acetic acid (CH₃COOH)?",
    answer: "Kohlrausch's Law states that the limiting molar conductivity of an electrolyte can be represented as the sum of the individual contributions of the anion and cation: Λ°_m(AxBy) = x λ°_+ + y λ°_-.\n\nDetermination for CH₃COOH:\nBy combining limiting molar conductivities of strong electrolytes (CH₃COONa, HCl, NaCl):\nΛ°_m(CH₃COOH) = Λ°_m(CH₃COONa) + Λ°_m(HCl) - Λ°_m(NaCl)\n= (λ°_CH₃COO⁻ + λ°_Na⁺) + (λ°_H⁺ + λ°_Cl⁻) - (λ°_Na⁺ + λ°_Cl⁻) = λ°_CH₃COO⁻ + λ°_H⁺.",
    hint: "Add Λ°_m(CH₃COONa) + Λ°_m(HCl) and subtract Λ°_m(NaCl).",
    analyzerTags: ["Kohlrausch Law", "Limiting Molar Conductivity", "Weak Electrolyte"]
  },

  // Chemical Kinetics
  {
    subject: "Chemistry",
    chapter: "Chemical Kinetics",
    difficulty: "Medium",
    marks: 3,
    questionType: "Numerical",
    questionText: "A first order reaction has a rate constant k = 1.15 × 10⁻³ s⁻¹. How long will 5 g of this reactant take to reduce to 3 g? (log 5/3 = log 1.667 = 0.2219)",
    answer: "First order integrated rate law: t = (2.303 / k) × log([A]₀ / [A])\nGiven: [A]₀ = 5 g, [A] = 3 g, k = 1.15 × 10⁻³ s⁻¹.\nt = (2.303 / 1.15 × 10⁻³) × log(5 / 3)\nt = 2002.6 × 0.2219 = 444.38 seconds (≈ 7.41 minutes).",
    hint: "Use t = (2.303/k) log([A]₀/[A]).",
    analyzerTags: ["First Order Kinetics", "Rate Constant", "Half-Life & Decay"]
  },

  // d and f Block Elements
  {
    subject: "Chemistry",
    chapter: "d and f Block Elements",
    difficulty: "Medium",
    marks: 3,
    questionType: "Short Answer",
    questionText: "What is Lanthanoid Contraction? State its primary cause and mention two important consequences of lanthanoid contraction.",
    answer: "1. Definition: The steady and gradual decrease in the atomic and ionic radii of lanthanoid elements with increasing atomic number from La to Lu.\n2. Cause: Imperfect shielding of 4f electrons due to their diffused spatial shape, causing effective nuclear charge (Z_eff) to increase.\n3. Consequences:\n(i) Similarity in properties of 4d and 5d series elements (e.g. Zr and Hf have almost identical atomic radii ~160 pm).\n(ii) Basic strength of hydroxides decreases from La(OH)₃ to Lu(OH)₃.",
    hint: "Poor shielding of 4f electrons causes radii of 4d (Zr) and 5d (Hf) elements to become nearly identical.",
    analyzerTags: ["Lanthanoid Contraction", "Shielding Effect", "Transition Elements"]
  },

  // Coordination Compounds
  {
    subject: "Chemistry",
    chapter: "Coordination Compounds",
    difficulty: "Medium",
    marks: 3,
    questionType: "Short Answer",
    questionText: "Using Crystal Field Theory (CFT), explain why [Co(NH₃)₆]³⁺ is diamagnetic (low spin) whereas [CoF₆]³⁻ is paramagnetic (high spin). [Atomic number of Co = 27]",
    answer: "Co³⁺ has electronic configuration [Ar] 3d⁶.\n1. In [Co(NH₃)₆]³⁺: NH₃ is a STRONG field ligand, so crystal field splitting Δ_o > P (pairing energy). All 6 d-electrons pair up in t_2g orbitals (t_2g⁶ e_g⁰). With 0 unpaired electrons, it is DIAMAGNETIC and low spin.\n2. In [CoF₆]³⁻: F⁻ is a WEAK field ligand, so Δ_o < P. Electrons occupy all orbitals singly first before pairing (t_2g⁴ e_g²). With 4 unpaired electrons, it is PARAMAGNETIC and high spin.",
    hint: "NH₃ has large Δ_o (pairing occurs → t_2g⁶); F⁻ has small Δ_o (no pairing → t_2g⁴ e_g²).",
    analyzerTags: ["CFT", "Spectrochemical Series", "Magnetic Moment"]
  },

  // Haloalkanes & Haloarenes
  {
    subject: "Chemistry",
    chapter: "Haloalkanes and Haloarenes",
    difficulty: "Medium",
    marks: 3,
    questionType: "Short Answer",
    questionText: "Differentiate between S_N1 and S_N2 reaction mechanisms on the basis of: (i) kinetics & order, (ii) stereochemical outcome, and (iii) substrate reactivity order.",
    answer: "1. S_N1 Mechanism:\n(i) Unimolecular, 1st order: Rate = k[R-X]. Two-step mechanism via carbocation intermediate.\n(ii) Racemization (formation of both retention and inversion enantiomers).\n(iii) Substrate order: 3° > 2° > 1° > methyl (stabilized by carbocation stability).\n\n2. S_N2 Mechanism:\n(i) Bimolecular, 2nd order: Rate = k[R-X][Nu⁻]. Single-step concerted mechanism via transition state.\n(ii) Complete inversion of configuration (Walden Inversion).\n(iii) Substrate order: methyl > 1° > 2° > 3° (governed by minimal steric hindrance).",
    hint: "S_N1: carbocation, 3°>2°>1°, racemization. S_N2: backside attack, 1°>2°>3°, Walden inversion.",
    analyzerTags: ["SN1 vs SN2", "Walden Inversion", "Reaction Mechanisms"]
  },

  // Aldehydes, Ketones & Carboxylic Acids
  {
    subject: "Chemistry",
    chapter: "Aldehydes, Ketones and Carboxylic Acids",
    difficulty: "Hard",
    marks: 5,
    questionType: "Short Answer",
    questionText: "Write complete chemical equations with reaction conditions for the following named organic reactions:\n(i) Aldol Condensation of ethanal\n(ii) Cannizzaro reaction of benzaldehyde\n(iii) Rosenmund reduction of ethanoyl chloride\n(iv) Hell-Volhard-Zelinsky (HVZ) reaction of acetic acid",
    answer: "(i) Aldol Condensation: 2 CH₃CHO --[dil. NaOH]--> CH₃-CH(OH)-CH₂-CHO --[Δ, -H₂O]--> CH₃-CH=CH-CHO (But-2-enal).\n\n(ii) Cannizzaro Reaction: 2 C₆H₅CHO + conc. NaOH → C₆H₅COONa (Sodium benzoate) + C₆H₅CH₂OH (Benzyl alcohol).\n\n(iii) Rosenmund Reduction: CH₃COCl + H₂ --[Pd / BaSO₄, quinoline]--> CH₃CHO + HCl.\n\n(iv) HVZ Reaction: CH₃COOH + Cl₂ --[Red P]--> Cl-CH₂-COOH + HCl (Monochloroacetic acid).",
    hint: "Aldol requires α-H; Cannizzaro requires absence of α-H (benzaldehyde).",
    analyzerTags: ["Name Reactions", "Aldol & Cannizzaro", "Organic Syntheses"]
  },

  // Amines
  {
    subject: "Chemistry",
    chapter: "Amines",
    difficulty: "Medium",
    marks: 3,
    questionType: "Short Answer",
    questionText: "Account for the following observations:\n(i) Primary amines have higher boiling points than tertiary amines of comparable molecular mass.\n(ii) In aqueous solution, the order of basic strength of methyl substituted amines is (CH₃)₂NH > CH₃NH₂ > (CH₃)₃N.",
    answer: "(i) Primary amines (R-NH₂) have two hydrogen atoms attached to nitrogen, enabling extensive intermolecular hydrogen bonding. Tertiary amines (R₃N) have no N-H bonds and cannot form intermolecular hydrogen bonds among themselves, leading to lower boiling points.\n\n(ii) The basic strength in aqueous solution is a combined result of inductive effect (+I), steric hindrance, and hydration energy of conjugate cations:\n- (CH₃)₂NH (2°) balances strong +I effect with favorable hydration and minimal steric hindrance.\n- (CH₃)₃N (3°) suffers from severe steric hindrance that reduces hydration of its conjugate acid.",
    hint: "Primary amines have hydrogen bonds (higher BP); 2° amine in aqueous medium has best balance of inductive and hydration effects.",
    analyzerTags: ["Amines Basicity", "Hydrogen Bonding", "Organic Reasoning"]
  },

  // Biomolecules
  {
    subject: "Chemistry",
    chapter: "Biomolecules",
    difficulty: "Easy",
    marks: 3,
    questionType: "Short Answer",
    questionText: "What is meant by denaturation of proteins? What changes occur in the primary, secondary, and tertiary structures of proteins upon denaturation?",
    answer: "Denaturation is the process in which a protein loses its native biological activity when subjected to physical changes (temperature change) or chemical changes (pH alteration).\n\nStructural impact:\n- Secondary (α-helix, β-pleated sheets) and Tertiary structures are destroyed due to disruption of hydrogen bonds and disulfide linkages.\n- Primary structure (the sequence of amino acids joined by covalent peptide bonds) remains INTACT and unaffected.",
    hint: "Denaturation uncoils tertiary/secondary structures (like egg white coagulation), leaving primary peptide backbone intact.",
    analyzerTags: ["Protein Denaturation", "Peptide Linkage", "Biomolecules Drill"]
  },

  // ==========================================
  // MATHEMATICS
  // ==========================================
  // Relations & Functions
  {
    subject: "Mathematics",
    chapter: "Relations and Functions",
    difficulty: "Medium",
    marks: 3,
    questionType: "Short Answer",
    questionText: "Let R be a relation on the set Z of all integers defined by R = {(a, b) : (a - b) is divisible by 5}. Prove that R is an equivalence relation.",
    answer: "1. Reflexive: For any a ∈ Z, a - a = 0 = 5(0), which is divisible by 5. Hence (a, a) ∈ R for all a ∈ Z.\n2. Symmetric: Let (a, b) ∈ R → (a - b) = 5k for some integer k. Then b - a = -(a - b) = 5(-k), which is also divisible by 5. Hence (b, a) ∈ R.\n3. Transitive: Let (a, b) ∈ R and (b, c) ∈ R → a - b = 5k₁ and b - c = 5k₂. Adding both: (a - b) + (b - c) = a - c = 5(k₁ + k₂). Since k₁ + k₂ is an integer, (a - c) is divisible by 5. Hence (a, c) ∈ R.\nSince R is reflexive, symmetric, and transitive, R is an equivalence relation.",
    hint: "Show (a, a) ∈ R, if (a, b) ∈ R then (b, a) ∈ R, and (a, b),(b, c) ∈ R implies (a, c) ∈ R.",
    analyzerTags: ["Equivalence Relation", "Reflexive Symmetric Transitive", "Proof Drill"]
  },

  // Matrices & Determinants
  {
    subject: "Mathematics",
    chapter: "Matrices and Determinants",
    difficulty: "Hard",
    marks: 5,
    questionType: "Short Answer",
    questionText: "Solve the following system of linear equations using the Matrix Inverse method:\n2x + 3y + 3z = 5\nx - 2y + z = -4\n3x - y - 2z = 3",
    answer: "Matrix formulation: A · X = B where\nA = [[2, 3, 3], [1, -2, 1], [3, -1, -2]], X = [x, y, z]ᵀ, B = [5, -4, 3]ᵀ.\n\n1. Determinant |A|: |A| = 2(4 - (-1)) - 3(-2 - 3) + 3(-1 - (-6)) = 2(5) - 3(-5) + 3(5) = 10 + 15 + 15 = 40 ≠ 0 (Inverse exists).\n2. Adjoint of A: adj(A) = [[5, 3, 9], [5, -13, 1], [5, 11, -7]].\n3. X = A⁻¹ B = (1 / 40) × [[5, 3, 9], [5, -13, 1], [5, 11, -7]] × [5, -4, 3]ᵀ\nx = (1/40)(25 - 12 + 27) = 40 / 40 = 1\ny = (1/40)(25 + 52 + 3) = 80 / 40 = 2\nz = (1/40)(25 - 44 - 21) = -40 / 40 = -1.\nSolution: x = 1, y = 2, z = -1.",
    hint: "Find |A|, compute cofactors to build adj(A), then X = (1/|A|) adj(A) B.",
    analyzerTags: ["Matrix Method", "System of Linear Equations", "Section D 5-Marker"]
  },

  // Continuity & Differentiability
  {
    subject: "Mathematics",
    chapter: "Continuity and Differentiability",
    difficulty: "Medium",
    marks: 4,
    questionType: "Short Answer",
    questionText: "If y = (sin x)^(cos x) + (cos x)^(sin x), find dy/dx.",
    answer: "Let u = (sin x)^(cos x) and v = (cos x)^(sin x), so y = u + v → dy/dx = du/dx + dv/dx.\n\n1. For u: ln u = cos x · ln(sin x)\n(1/u)(du/dx) = -sin x · ln(sin x) + cos x · (cot x)\ndu/dx = (sin x)^(cos x) [cos x · cot x - sin x · ln(sin x)].\n\n2. For v: ln v = sin x · ln(cos x)\n(1/v)(dv/dx) = cos x · ln(cos x) + sin x · (-tan x)\ndv/dx = (cos x)^(sin x) [cos x · ln(cos x) - sin x · tan x].\n\nTherefore: dy/dx = (sin x)^(cos x)[cos x cot x - sin x ln(sin x)] + (cos x)^(sin x)[cos x ln(cos x) - sin x tan x].",
    hint: "Use logarithmic differentiation separately on u and v: dy/dx = du/dx + dv/dx.",
    analyzerTags: ["Logarithmic Differentiation", "Derivatives", "Calculus Drill"]
  },

  // Application of Derivatives
  {
    subject: "Mathematics",
    chapter: "Application of Derivatives",
    difficulty: "Hard",
    marks: 5,
    questionType: "Case-Based",
    questionText: "Show that the semi-vertical angle of a right circular cone of given surface area and maximum volume is sin⁻¹(1/3).",
    answer: "Let radius = r, slant height = l, height = h, semi-vertical angle = α (where r = l sin α, h = l cos α).\n1. Total Surface Area: S = πr² + πrl = constant → l = (S - πr²) / (πr).\n2. Height h = √(l² - r²) = √[((S - πr²)/(πr))² - r²] = √[S(S - 2πr²)] / (πr).\n3. Volume V = (1/3)πr² h → V² = (1/9)π²r⁴ · [S(S - 2πr²) / (π²r²)] = (S/9)(Sr² - 2πr⁴).\n4. For max V, d(V²)/dr = (S/9)(2Sr - 8πr³) = 0 → S = 4πr².\n5. Substitute S: πr² + πrl = 4πr² → πrl = 3πr² → l = 3r → r / l = 1/3.\n6. Since sin α = r / l, we get sin α = 1/3 → α = sin⁻¹(1/3).",
    hint: "Express volume V in terms of r and constant S. Differentiate V² with respect to r and set to 0.",
    analyzerTags: ["Maxima & Minima", "Optimization", "Section E 5-Marker"]
  },

  // Integrals & Calculus
  {
    subject: "Mathematics",
    chapter: "Integrals",
    difficulty: "Hard",
    marks: 4,
    questionType: "Derivation Drill",
    questionText: "Evaluate the definite integral: I = ∫[0 to π/2] [sin x / (sin x + cos x)] dx using properties of definite integrals.",
    answer: "Given: I = ∫[0 to π/2] [sin x / (sin x + cos x)] dx (Eq 1)\n\nApplying property ∫₀ᵃ f(x) dx = ∫₀ᵃ f(a - x) dx:\nI = ∫[0 to π/2] [sin(π/2 - x) / (sin(π/2 - x) + cos(π/2 - x))] dx\nI = ∫[0 to π/2] [cos x / (cos x + sin x)] dx (Eq 2)\n\nAdding Eq (1) and Eq (2):\n2I = ∫[0 to π/2] [(sin x + cos x) / (sin x + cos x)] dx = ∫[0 to π/2] 1 dx = [x]₀^(π/2) = π/2.\nTherefore, I = π / 4.",
    hint: "Use King's property f(π/2 - x) to interchange sin x and cos x, then add 2I.",
    analyzerTags: ["King's Property", "Definite Integrals", "High ROI Drill"]
  },

  // Differential Equations
  {
    subject: "Mathematics",
    chapter: "Differential Equations",
    difficulty: "Medium",
    marks: 4,
    questionType: "Short Answer",
    questionText: "Find the general solution of the first-order linear differential equation: x (dy/dx) + 2y = x² (where x ≠ 0).",
    answer: "1. Rewrite in standard linear form dy/dx + P(x)y = Q(x):\ndy/dx + (2/x)y = x.\n2. Identify P(x) = 2/x, Q(x) = x.\n3. Integrating Factor (I.F.): I.F. = e^(∫(2/x)dx) = e^(2 ln x) = e^(ln x²) = x².\n4. General Solution: y × (I.F.) = ∫ Q(x) × (I.F.) dx + C\ny · x² = ∫ x · x² dx + C = ∫ x³ dx + C = (x⁴ / 4) + C.\n5. Therefore: y = (x² / 4) + C · x⁻².",
    hint: "Compute Integrating Factor I.F. = e^(∫P dx) = x², then y(I.F.) = ∫Q(I.F.)dx + C.",
    analyzerTags: ["Linear Differential Equation", "Integrating Factor", "General Solution"]
  },

  // Vectors & 3D Geometry
  {
    subject: "Mathematics",
    chapter: "3D Geometry",
    difficulty: "Hard",
    marks: 5,
    questionType: "Short Answer",
    questionText: "Find the shortest distance between the two skew lines:\nLine 1: r = (i + 2j - 4k) + λ(2i + 3j + 6k)\nLine 2: r = (3i + 3j - 5k) + μ(2i + 3j + 6k)... wait, if parallel, or skew:\nLine 2: r = (3i + 3j - 5k) + μ(i + 2j + 2k).",
    answer: "Given:\na₁ = (1, 2, -4), b₁ = (2, 3, 6)\na₂ = (3, 3, -5), b₂ = (1, 2, 2)\n\n1. Vector (a₂ - a₁) = (3 - 1)i + (3 - 2)j + (-5 - (-4))k = 2i + j - k.\n2. Cross Product (b₁ × b₂):\n|i  j  k|\n|2  3  6|\n|1  2  2| = i(6 - 12) - j(4 - 6) + k(4 - 3) = -6i + 2j + k.\n3. Magnitude |b₁ × b₂| = √[(-6)² + 2² + 1²] = √(36 + 4 + 1) = √41.\n4. Dot Product (a₂ - a₁) · (b₁ × b₂) = 2(-6) + 1(2) + (-1)(1) = -12 + 2 - 1 = -11.\n5. Shortest Distance d = |(a₂ - a₁) · (b₁ × b₂)| / |b₁ × b₂| = |-11| / √41 = 11 / √41 units.",
    hint: "Shortest distance formula for skew lines: d = |(a₂ - a₁) · (b₁ × b₂)| / |b₁ × b₂|.",
    analyzerTags: ["Shortest Distance", "Skew Lines", "3D Geometry Drill"]
  },

  // Linear Programming
  {
    subject: "Mathematics",
    chapter: "Linear Programming",
    difficulty: "Medium",
    marks: 4,
    questionType: "Case-Based",
    questionText: "Solve the following Linear Programming Problem graphically:\nMaximize Z = 4x + y\nSubject to constraints: x + y ≤ 50, 3x + y ≤ 90, x ≥ 0, y ≥ 0.",
    answer: "1. Plot boundary lines:\nLine 1: x + y = 50 → passes through (50, 0) and (0, 50).\nLine 2: 3x + y = 90 → passes through (30, 0) and (0, 90).\nIntersection of Line 1 & Line 2: 3x + y - (x + y) = 90 - 50 → 2x = 40 → x = 20, y = 30 → Point B(20, 30).\n\n2. Corner points of feasible region:\n- O(0, 0): Z = 4(0) + 0 = 0\n- A(30, 0): Z = 4(30) + 0 = 120 (from 3x+y=90)\n- B(20, 30): Z = 4(20) + 30 = 80 + 30 = 110\n- C(0, 50): Z = 4(0) + 50 = 50.\n\n3. Conclusion: Maximum value of Z is 120 at point A(30, 0).",
    hint: "Find corner points (0,0), (30,0), (20,30), (0,50) and evaluate Z = 4x + y at each vertex.",
    analyzerTags: ["LPP Corner Point", "Objective Function", "Linear Programming"]
  },

  // Probability
  {
    subject: "Mathematics",
    chapter: "Probability",
    difficulty: "Hard",
    marks: 5,
    questionType: "Case-Based",
    questionText: "A doctor is called to see a patient. From past experience, it is known that the probabilities that he comes by train, bus, scooter or other means are 3/10, 1/5, 1/10 and 2/5 respectively. The probabilities that he will be late are 1/4, 1/3, and 1/12 if he comes by train, bus and scooter; but if he comes by other means, he will not be late (prob = 0). When he arrives, he is late. What is the probability that he came by train?",
    answer: "Let E₁, E₂, E₃, E₄ be events that doctor comes by train, bus, scooter, other means.\nP(E₁) = 3/10, P(E₂) = 1/5 = 2/10, P(E₃) = 1/10, P(E₄) = 2/5 = 4/10.\nLet L = doctor is late.\nP(L|E₁) = 1/4, P(L|E₂) = 1/3, P(L|E₃) = 1/12, P(L|E₄) = 0.\n\n1. Total Probability P(L):\nP(L) = (3/10)(1/4) + (2/10)(1/3) + (1/10)(1/12) + (4/10)(0)\n= 3/40 + 2/30 + 1/120 = (9 + 8 + 1)/120 = 18/120 = 3/20.\n\n2. By Bayes' Theorem:\nP(E₁|L) = [P(E₁) · P(L|E₁)] / P(L) = (3/40) / (3/20) = (3/40) × (20/3) = 1/2.\nProbability that doctor came by train is 1/2 (50%).",
    hint: "Apply Bayes' Theorem: P(Train|Late) = P(Train)P(Late|Train) / Σ P(Eᵢ)P(Late|Eᵢ).",
    analyzerTags: ["Bayes Theorem", "Total Probability", "Section E 5-Marker"]
  }
];

// Combine deduplicated CSV questions with rich diverse bank
const finalQuestionBank = [];

// Add the curated diverse questions first
diverseBank.forEach((q, idx) => {
  finalQuestionBank.push({
    id: `qb-curated-${idx + 1}`,
    exam: 'cbse-12',
    subject: q.subject,
    chapter: q.chapter,
    year: 2025,
    marks: q.marks,
    questionType: q.questionType,
    difficulty: q.difficulty,
    questionText: q.questionText,
    sourceType: 'ai_generated',
    analyzerTags: q.analyzerTags || [q.chapter],
    answer: q.answer,
    hint: q.hint,
    options: q.options || undefined,
    correctOption: q.correctOption || undefined
  });
});

// Add all distinct deduplicated CSV questions (1 per unique template concept)
csvQuestions.forEach(q => {
  finalQuestionBank.push(q);
});

fs.writeFileSync(outputFile, JSON.stringify(finalQuestionBank, null, 2));
console.log(`\nSUCCESS! Created non-repetitive, diverse question bank: ${finalQuestionBank.length} total unique questions saved to ${outputFile}`);
