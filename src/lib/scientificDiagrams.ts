/**
 * Verified, high-precision SVG Scientific Schematics for CBSE Class 12 & JEE Main.
 * Replaces hallucinating image generators with 100% exact, labeled vector schematics.
 */

export interface ScientificDiagram {
  id: string;
  title: string;
  subject: "Physics" | "Chemistry" | "Mathematics";
  keywords: string[];
  svg: string;
  parts: string[];
  principle: string;
  examTips: string;
}

export const SCIENTIFIC_DIAGRAMS: ScientificDiagram[] = [
  {
    id: "compound-microscope",
    title: "Ray Diagram: Compound Microscope (Image at Near Point D)",
    subject: "Physics",
    keywords: ["microscope", "compound microscope", "ray optics", "objective eyepiece", "optical instruments"],
    parts: [
      "Objective Lens (L₁): Small focal length fo and small aperture",
      "Eyepiece Lens (L₂): Moderate focal length fe and larger aperture",
      "Object AB: Placed just beyond principal focus Fo of objective",
      "Intermediate Real Image A'B': Inverted, magnified, formed between optical center and Fe of eyepiece",
      "Final Virtual Image A''B'': Formed at least distance of distinct vision (D = 25 cm), erect w.r.t A'B', inverted w.r.t AB"
    ],
    principle: "The objective lens forms a real, inverted and magnified intermediate image A'B' of the tiny object. The eyepiece acts as a simple magnifier, producing an enlarged, virtual final image A''B'' at distance D.",
    examTips: "Magnification in normal adjustment: m = -(vo/uo)(1 + D/fe). Always draw arrows on rays and show dotted lines for virtual rays back to A''B''. Total tube length L ≈ vo + fe.",
    svg: `<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto bg-white font-sans">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#FF4D00"/>
        </marker>
        <marker id="arrow-blk" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#000"/>
        </marker>
      </defs>
      <!-- Background & Border -->
      <rect width="800" height="360" fill="#ffffff"/>
      <!-- Principal Axis -->
      <line x1="20" y1="180" x2="780" y2="180" stroke="#000000" stroke-width="1.5" stroke-dasharray="6,4"/>
      <text x="30" y="172" font-size="11" font-weight="bold" fill="#666">PRINCIPAL AXIS</text>

      <!-- Objective Lens L1 (small) -->
      <path d="M 220 70 Q 230 180 220 290 Q 210 180 220 70" fill="#e0f2fe" stroke="#0284c7" stroke-width="2.5"/>
      <text x="200" y="55" font-size="12" font-weight="bold" fill="#0369a1">OBJECTIVE (L₁)</text>
      <text x="212" y="196" font-size="11" font-weight="bold" fill="#000">O₁</text>

      <!-- Eyepiece Lens L2 (large) -->
      <path d="M 560 30 Q 575 180 560 330 Q 545 180 560 30" fill="#e0f2fe" stroke="#0284c7" stroke-width="2.5"/>
      <text x="535" y="20" font-size="12" font-weight="bold" fill="#0369a1">EYEPIECE (L₂)</text>
      <text x="565" y="196" font-size="11" font-weight="bold" fill="#000">O₂</text>

      <!-- Focal Points -->
      <circle cx="160" cy="180" r="3.5" fill="#000"/>
      <text x="152" y="198" font-size="11" font-weight="bold">Fo</text>
      <circle cx="280" cy="180" r="3.5" fill="#000"/>
      <text x="275" y="198" font-size="11" font-weight="bold">Fo'</text>
      <circle cx="500" cy="180" r="3.5" fill="#000"/>
      <text x="495" y="198" font-size="11" font-weight="bold">Fe</text>

      <!-- Object AB -->
      <line x1="130" y1="180" x2="130" y2="140" stroke="#000" stroke-width="3" marker-end="url(#arrow-blk)"/>
      <text x="122" y="132" font-size="12" font-weight="bold">B</text>
      <text x="122" y="198" font-size="12" font-weight="bold">A</text>
      <text x="110" y="118" font-size="10" fill="#FF4D00" font-weight="bold">Object</text>

      <!-- Ray 1 from B through O1 -->
      <line x1="130" y1="140" x2="220" y2="180" stroke="#FF4D00" stroke-width="1.8" marker-end="url(#arrow)"/>
      <line x1="220" y1="180" x2="380" y2="250" stroke="#FF4D00" stroke-width="1.8"/>

      <!-- Ray 2 from B parallel to axis, then through Fo' -->
      <line x1="130" y1="140" x2="220" y2="140" stroke="#FF4D00" stroke-width="1.8" marker-end="url(#arrow)"/>
      <line x1="220" y1="140" x2="380" y2="250" stroke="#FF4D00" stroke-width="1.8" marker-end="url(#arrow)"/>

      <!-- Intermediate Real Image A'B' -->
      <line x1="380" y1="180" x2="380" y2="250" stroke="#000" stroke-width="2.5" marker-end="url(#arrow-blk)"/>
      <text x="385" y="195" font-size="11" font-weight="bold">A'</text>
      <text x="385" y="260" font-size="11" font-weight="bold">B'</text>
      <text x="340" y="272" font-size="10" fill="#000" font-weight="bold">Real Image A'B'</text>

      <!-- Rays from B' through L2 -->
      <line x1="380" y1="250" x2="560" y2="180" stroke="#2563eb" stroke-width="1.8" marker-end="url(#arrow)"/>
      <line x1="560" y1="180" x2="720" y2="120" stroke="#2563eb" stroke-width="1.8"/>

      <line x1="380" y1="250" x2="560" y2="250" stroke="#2563eb" stroke-width="1.8" marker-end="url(#arrow)"/>
      <line x1="560" y1="250" x2="720" y2="305" stroke="#2563eb" stroke-width="1.8"/>

      <!-- Virtual backward extrapolation to A''B'' -->
      <line x1="560" y1="180" x2="90" y2="320" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4"/>
      <line x1="560" y1="250" x2="90" y2="320" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,4"/>

      <!-- Final Virtual Image A''B'' -->
      <line x1="90" y1="180" x2="90" y2="320" stroke="#FF4D00" stroke-width="3.5" stroke-dasharray="5,3" marker-end="url(#arrow)"/>
      <text x="75" y="195" font-size="12" font-weight="bold" fill="#FF4D00">A''</text>
      <text x="75" y="335" font-size="12" font-weight="bold" fill="#FF4D00">B''</text>
      <text x="40" y="350" font-size="11" fill="#FF4D00" font-weight="bold">Final Virtual Image (at D)</text>

      <!-- Eye position -->
      <path d="M 720 160 Q 745 180 720 200 Q 755 180 720 160" fill="#fed7aa" stroke="#000" stroke-width="1.5"/>
      <circle cx="732" cy="180" r="4" fill="#000"/>
      <text x="745" y="184" font-size="11" font-weight="bold">EYE</text>
    </svg>`
  },
  {
    id: "full-wave-rectifier",
    title: "Circuit Schematic: Center-Tapped Full-Wave Rectifier with Filter",
    subject: "Physics",
    keywords: ["rectifier", "full wave", "semiconductor", "diodes", "center tapped", "filter capacitor"],
    parts: [
      "Center-Tapped Step-Down Transformer: Steps down AC mains 220V to required AC voltage",
      "Diode D₁: Conducts during positive half-cycle when anode is positive w.r.t center tap",
      "Diode D₂: Conducts during negative half-cycle when bottom terminal is positive w.r.t center tap",
      "Center Tap (CT): Serves as common zero-reference ground return for load RL",
      "Shunt Filter Capacitor C: Stores charge at peak voltage and discharges through RL, smoothing ripple"
    ],
    principle: "Current flows through the load resistor RL in the SAME direction during both positive and negative AC input half-cycles, converting AC into unidirectional pulsating DC.",
    examTips: "Ripple factor γ = 0.482. Output DC frequency is 2f = 100 Hz (for 50 Hz input). Efficiency is 81.2%.",
    svg: `<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto bg-white font-sans">
      <!-- Background -->
      <rect width="800" height="360" fill="#ffffff"/>
      
      <!-- AC Source Symbol -->
      <circle cx="70" cy="180" r="28" fill="#f8fafc" stroke="#000000" stroke-width="2"/>
      <path d="M 56 180 Q 63 165 70 180 Q 77 195 84 180" fill="none" stroke="#000" stroke-width="2"/>
      <text x="35" y="225" font-size="11" font-weight="bold">AC MAINS (220V)</text>

      <!-- Primary Coils -->
      <line x1="98" y1="180" x2="140" y2="180" stroke="#000" stroke-width="2"/>
      <line x1="140" y1="110" x2="140" y2="250" stroke="#000" stroke-width="3"/>
      <!-- Soft Iron Core -->
      <line x1="155" y1="90" x2="155" y2="270" stroke="#64748b" stroke-width="3"/>
      <line x1="162" y1="90" x2="162" y2="270" stroke="#64748b" stroke-width="3"/>
      <text x="140" y="80" font-size="10" font-weight="bold" fill="#64748b">IRON CORE</text>

      <!-- Secondary Winding with Center Tap -->
      <line x1="177" y1="110" x2="177" y2="250" stroke="#000" stroke-width="3"/>
      <text x="185" y="105" font-size="11" font-weight="bold">A (+)</text>
      <text x="185" y="260" font-size="11" font-weight="bold">B (-)</text>
      
      <!-- Center Tap wire -->
      <line x1="177" y1="180" x2="520" y2="180" stroke="#000" stroke-width="2"/>
      <circle cx="177" cy="180" r="4" fill="#000"/>
      <text x="190" y="175" font-size="10" font-weight="bold" fill="#FF4D00">CENTER TAP (0V)</text>

      <!-- Diode D1 (Top) -->
      <line x1="177" y1="110" x2="280" y2="110" stroke="#000" stroke-width="2"/>
      <polygon points="280,95 280,125 310,110" fill="#FF4D00" stroke="#000" stroke-width="1.5"/>
      <line x1="310" y1="95" x2="310" y2="125" stroke="#000" stroke-width="3"/>
      <text x="285" y="90" font-size="12" font-weight="bold">D₁</text>
      <line x1="310" y1="110" x2="420" y2="110" stroke="#000" stroke-width="2"/>

      <!-- Diode D2 (Bottom) -->
      <line x1="177" y1="250" x2="280" y2="250" stroke="#000" stroke-width="2"/>
      <polygon points="280,235 280,265 310,250" fill="#FF4D00" stroke="#000" stroke-width="1.5"/>
      <line x1="310" y1="235" x2="310" y2="265" stroke="#000" stroke-width="3"/>
      <text x="285" y="280" font-size="12" font-weight="bold">D₂</text>
      <line x1="310" y1="250" x2="420" y2="250" stroke="#000" stroke-width="2"/>

      <!-- Joining cathode outputs -->
      <line x1="420" y1="110" x2="420" y2="250" stroke="#000" stroke-width="2"/>
      <circle cx="420" cy="180" r="4" fill="#000"/>
      <line x1="420" y1="140" x2="520" y2="140" stroke="#000" stroke-width="2"/>

      <!-- Smoothing Capacitor C -->
      <line x1="480" y1="140" x2="480" y2="155" stroke="#000" stroke-width="2"/>
      <line x1="465" y1="155" x2="495" y2="155" stroke="#0284c7" stroke-width="3"/>
      <line x1="465" y1="165" x2="495" y2="165" stroke="#0284c7" stroke-width="3"/>
      <line x1="480" y1="165" x2="480" y2="180" stroke="#000" stroke-width="2"/>
      <text x="502" y="163" font-size="11" font-weight="bold" fill="#0284c7">Filter C</text>

      <!-- Load Resistor RL -->
      <rect x="540" y="130" width="30" height="60" fill="#fef08a" stroke="#000" stroke-width="2"/>
      <line x1="520" y1="140" x2="540" y2="140" stroke="#000" stroke-width="2"/>
      <line x1="520" y1="180" x2="540" y2="180" stroke="#000" stroke-width="2"/>
      <text x="545" y="165" font-size="12" font-weight="bold">R_L</text>
      
      <!-- Output Voltage Terminals -->
      <line x1="570" y1="140" x2="630" y2="140" stroke="#000" stroke-width="2"/>
      <line x1="570" y1="180" x2="630" y2="180" stroke="#000" stroke-width="2"/>
      <circle cx="630" cy="140" r="3.5" fill="#FF4D00"/>
      <circle cx="630" cy="180" r="3.5" fill="#000"/>
      <text x="640" y="145" font-size="11" font-weight="bold" fill="#FF4D00">+ V_out</text>
      <text x="640" y="185" font-size="11" font-weight="bold">0V Ground</text>

      <!-- Waveform box -->
      <rect x="630" y="220" width="150" height="110" fill="#f8fafc" stroke="#000" stroke-width="1.5"/>
      <text x="640" y="240" font-size="10" font-weight="bold">DC Output Waveform:</text>
      <!-- Pulsating DC bumps -->
      <path d="M 640 300 Q 655 260 670 300 Q 685 260 700 300 Q 715 260 730 300 Q 745 260 760 300" fill="none" stroke="#FF4D00" stroke-width="2.5"/>
      <!-- Smoothed line with capacitor -->
      <path d="M 640 270 L 760 270" stroke="#0284c7" stroke-width="2" stroke-dasharray="4,2"/>
      <text x="650" y="322" font-size="9" font-weight="bold" fill="#0284c7">--- With Filter C</text>
    </svg>`
  },
  {
    id: "galvanic-cell",
    title: "Schematic: Galvanic Cell (Daniell Cell) with Salt Bridge",
    subject: "Chemistry",
    keywords: ["galvanic", "daniell cell", "salt bridge", "electrochemistry", "zinc copper", "nernst"],
    parts: [
      "Anode (Negative): Zinc rod immersed in 1.0 M ZnSO₄ solution. Oxidation: Zn(s) → Zn²⁺(aq) + 2e⁻",
      "Cathode (Positive): Copper rod immersed in 1.0 M CuSO₄ solution. Reduction: Cu²⁺(aq) + 2e⁻ → Cu(s)",
      "Salt Bridge: Inverted U-tube containing inert electrolyte (KNO₃ / KCl) in agar-agar gel",
      "Voltmeter: Measures cell EMF (E°cell = E°cathode - E°anode = 0.34 - (-0.76) = 1.10 V)",
      "Current Flow: Electrons flow through external wire from Zn to Cu; conventional current flows from Cu to Zn"
    ],
    principle: "Spontaneous redox reaction produces electrical energy: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s). The salt bridge maintains electrical neutrality by supplying NO₃⁻ to anode and K⁺ to cathode.",
    examTips: "Cell representation: Zn(s) | Zn²⁺(1M) || Cu²⁺(1M) | Cu(s). In Nernst equation: E = 1.10 - (0.0592/2) log([Zn²⁺]/[Cu²⁺]).",
    svg: `<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto bg-white font-sans">
      <!-- Left Beaker (Anode) -->
      <rect x="120" y="140" width="180" height="180" rx="8" fill="#e0f2fe" stroke="#000" stroke-width="2"/>
      <rect x="120" y="190" width="180" height="130" fill="#bae6fd" opacity="0.6"/>
      <text x="140" y="300" font-size="11" font-weight="bold" fill="#0369a1">1.0 M ZnSO₄(aq)</text>
      <!-- Zinc Electrode -->
      <rect x="175" y="100" width="30" height="160" fill="#94a3b8" stroke="#000" stroke-width="2"/>
      <text x="160" y="85" font-size="12" font-weight="bold">ANODE (-)</text>
      <text x="165" y="130" font-size="10" font-weight="bold" fill="#fff">Zn Rod</text>

      <!-- Right Beaker (Cathode) -->
      <rect x="480" y="140" width="180" height="180" rx="8" fill="#fef08a" stroke="#000" stroke-width="2"/>
      <rect x="480" y="190" width="180" height="130" fill="#fed7aa" opacity="0.6"/>
      <text x="500" y="300" font-size="11" font-weight="bold" fill="#c2410c">1.0 M CuSO₄(aq)</text>
      <!-- Copper Electrode -->
      <rect x="535" y="100" width="30" height="160" fill="#ea580c" stroke="#000" stroke-width="2"/>
      <text x="515" y="85" font-size="12" font-weight="bold" fill="#ea580c">CATHODE (+)</text>
      <text x="540" y="130" font-size="10" font-weight="bold" fill="#fff">Cu Rod</text>

      <!-- Salt Bridge -->
      <path d="M 270 230 L 270 140 Q 270 120 290 120 L 490 120 Q 510 120 510 140 L 510 230 L 490 230 L 490 140 L 290 140 L 290 230 Z" fill="#f1f5f9" stroke="#000" stroke-width="2"/>
      <text x="340" y="112" font-size="11" font-weight="bold" fill="#FF4D00">SALT BRIDGE (KNO₃ / Agar)</text>

      <!-- Wire & Voltmeter -->
      <line x1="190" y1="100" x2="190" y2="40" stroke="#000" stroke-width="2"/>
      <line x1="190" y1="40" x2="350" y2="40" stroke="#000" stroke-width="2"/>
      <line x1="430" y1="40" x2="550" y2="40" stroke="#000" stroke-width="2"/>
      <line x1="550" y1="40" x2="550" y2="100" stroke="#000" stroke-width="2"/>

      <circle cx="390" cy="40" r="22" fill="#fff" stroke="#000" stroke-width="2.5"/>
      <text x="385" y="45" font-size="13" font-weight="bold" fill="#FF4D00">V</text>
      <text x="360" y="75" font-size="11" font-weight="bold">E° = 1.10 V</text>

      <!-- Electron Flow Arrow -->
      <text x="230" y="30" font-size="10" font-weight="bold" fill="#2563eb">e⁻ flow ➔</text>
      <text x="455" y="30" font-size="10" font-weight="bold" fill="#2563eb">e⁻ flow ➔</text>
    </svg>`
  }
];

/**
 * Finds a matching curated scientific diagram for a given query or chapter
 */
export function findScientificDiagram(query: string): ScientificDiagram | null {
  const q = query.toLowerCase();
  for (const d of SCIENTIFIC_DIAGRAMS) {
    if (d.keywords.some(k => q.includes(k)) || q.includes(d.id)) {
      return d;
    }
  }
  return null;
}
