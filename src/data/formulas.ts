import { FormulaItem } from "./mock";

export interface MasterFormulaItem extends FormulaItem {
  subject: "Physics" | "Chemistry" | "Mathematics";
  derivationSnippet?: string;
  pyqExample?: string;
  examSlugs?: string[]; // optional filter for specific exam
}

export const MASTER_FORMULA_DATABASE: MasterFormulaItem[] = [
  // =========================================================================
  // PHYSICS — FULL SYLLABUS COVERAGE (CBSE 12 & JEE MAIN)
  // =========================================================================

  // 1. Units, Dimensions & Measurements
  {
    id: "f-phy-dim-01",
    subject: "Physics",
    name: "Dimensional Analysis & Fractional Error Propagation",
    chapter: "Units, Dimensions & Error Analysis",
    latex: "Z = \\frac{A^p B^q}{C^r} \\quad \\implies \\quad \\frac{\\Delta Z}{Z} = p\\frac{\\Delta A}{A} + q\\frac{\\Delta B}{B} + r\\frac{\\Delta C}{C}",
    variables: [
      { symbol: "\\Delta Z/Z", meaning: "Relative / Fractional error in calculated quantity Z" },
      { symbol: "p, q, r", meaning: "Power exponents of independent measured physical quantities" },
      { symbol: "\\Delta A, \\Delta B, \\Delta C", meaning: "Absolute instrumental uncertainties in measurements" },
    ],
    whenToUse: "Use to find maximum percentage error in multi-variable experimental physics calculations.",
    commonMistake: "Powers in denominator ($C^r$) are ALWAYS ADDED as positive terms ($+r \\Delta C/C$) when calculating maximum possible error.",
    frequencyBadge: "Tested in 10 of last 10 JEE shifts",
    priority: "High",
    tags: ["Error Analysis", "Vernier Caliper", "Screw Gauge"],
  },

  // 2. Kinematics
  {
    id: "f-phy-kin-01",
    subject: "Physics",
    name: "Kinematic Equations & Projectile Trajectory",
    chapter: "Kinematics: 1D & 2D Motion",
    latex: "y = x \\tan\\theta \\left(1 - \\frac{x}{R}\\right) = x \\tan\\theta - \\frac{g x^2}{2 u^2 \\cos^2\\theta}, \\quad R = \\frac{u^2 \\sin 2\\theta}{g}",
    variables: [
      { symbol: "y", meaning: "Instantaneous vertical displacement (meters)" },
      { symbol: "x", meaning: "Instantaneous horizontal displacement (meters)" },
      { symbol: "u", meaning: "Initial launch speed (m/s)" },
      { symbol: "\\theta", meaning: "Angle of projection above horizontal" },
      { symbol: "R", meaning: "Total horizontal range on flat ground ($u^2 \\sin 2\\theta / g$)" },
    ],
    whenToUse: "Use for projectile coordinates, target clearing problems, and calculating launch angles for two complementary trajectories ($R_\\theta = R_{90-\\theta}$).",
    commonMistake: "Assuming maximum height occurs at $x = R/2$ on an inclined plane. That symmetry only applies on flat ground.",
    frequencyBadge: "Tested in 8 of last 10 shifts",
    priority: "High",
    tags: ["Kinematics", "Projectile Motion", "Trajectory"],
  },

  // 3. Laws of Motion & Friction
  {
    id: "f-phy-nlm-01",
    subject: "Physics",
    name: "Banking of Curved Roads with Friction",
    chapter: "Laws of Motion & Friction",
    latex: "v_{\\text{max}} = \\sqrt{R g \\left(\\frac{\\mu_s + \\tan\\theta}{1 - \\mu_s \\tan\\theta}\\right)}, \\quad v_{\\text{optimum}} = \\sqrt{R g \\tan\\theta}",
    variables: [
      { symbol: "v_{\\text{max}}", meaning: "Maximum safe speed without skidding outwards (m/s)" },
      { symbol: "R", meaning: "Radius of circular curve (meters)" },
      { symbol: "\\mu_s", meaning: "Static coefficient of friction between tires and road" },
      { symbol: "\\theta", meaning: "Banking angle with horizontal" },
    ],
    whenToUse: "Use for banked race tracks, highway curves, and airplane coordinated turns.",
    commonMistake: "For minimum speed without sliding down the incline, flip the signs: $\\frac{\\tan\\theta - \\mu_s}{1 + \\mu_s \\tan\\theta}$.",
    frequencyBadge: "Tested in 7 of last 10 JEE shifts",
    priority: "High",
    tags: ["NLM", "Circular Motion", "Banking"],
  },

  // 4. Work, Energy & Power
  {
    id: "f-phy-wep-01",
    subject: "Physics",
    name: "Work-Energy Theorem & Vertical Circular Motion",
    chapter: "Work, Energy & Power",
    latex: "W_{\\text{all}} = \\Delta K = K_f - K_i, \\quad v_{\\text{bottom}} \\ge \\sqrt{5 g R}, \\quad v_{\\text{top}} \\ge \\sqrt{g R}",
    variables: [
      { symbol: "W_{\\text{all}}", meaning: "Work done by all forces (conservative + non-conservative + external)" },
      { symbol: "\\Delta K", meaning: "Change in kinetic energy ($\\frac{1}{2} m v_f^2 - \\frac{1}{2} m v_i^2$)" },
      { symbol: "R", meaning: "Radius of vertical circle with inextensible string" },
    ],
    whenToUse: "Use to evaluate minimum speeds for looping a vertical circle without string slackening ($T_{\\text{top}} \\ge 0$).",
    commonMistake: "For a mass attached to a massless light rigid ROD instead of a string, $v_{\\text{bottom}} \\ge \\sqrt{4 g R}$ because speed at top can be 0.",
    frequencyBadge: "Tested in 9 of last 10 shifts",
    priority: "High",
    tags: ["Work Energy", "Vertical Circle", "Conservation"],
  },

  // 5. Rotational Motion
  {
    id: "f-phy-rot-01",
    subject: "Physics",
    name: "Parallel Axis Theorem & Pure Rolling Acceleration",
    chapter: "System of Particles & Rotational Motion",
    latex: "I = I_{\\text{cm}} + M d^2, \\quad a_{\\text{rolling}} = \\frac{g \\sin\\theta}{1 + \\frac{k^2}{R^2}}, \\quad K_{\\text{total}} = \\frac{1}{2} M v^2 \\left(1 + \\frac{k^2}{R^2}\\right)",
    variables: [
      { symbol: "I_{\\text{cm}}", meaning: "Moment of inertia strictly about axis passing through Center of Mass" },
      { symbol: "d", meaning: "Perpendicular distance between parallel axes" },
      { symbol: "k^2/R^2", meaning: "Shape factor ($1/2$ for solid cylinder/disc, $2/5$ for solid sphere, $2/3$ for spherical shell, $1$ for ring)" },
      { symbol: "\\theta", meaning: "Inclination angle of rough ramp" },
    ],
    whenToUse: "Use for pure rolling down an inclined plane without slipping ($v = \\omega R$).",
    commonMistake: "Solid sphere ($k^2/R^2 = 0.4$) reaches the bottom FASTEST because it has the lowest shape factor and highest linear acceleration.",
    frequencyBadge: "Tested in 10 of last 10 JEE shifts",
    priority: "High",
    tags: ["Rotational Motion", "Moment of Inertia", "Rolling"],
  },

  // 6. Gravitation
  {
    id: "f-phy-grav-01",
    subject: "Physics",
    name: "Orbital Velocity, Escape Velocity & Kepler's 3rd Law",
    chapter: "Gravitation & Satellite Dynamics",
    latex: "v_o = \\sqrt{\\frac{G M}{R + h}}, \\quad v_e = \\sqrt{\\frac{2 G M}{R}} = \\sqrt{2} v_o, \\quad T^2 = \\frac{4\\pi^2}{G M} r^3",
    variables: [
      { symbol: "v_o", meaning: "Orbital speed of satellite at height h above Earth surface" },
      { symbol: "v_e", meaning: "Escape velocity from surface of planet ($11.2\\text{ km/s}$ for Earth)" },
      { symbol: "G", meaning: "Universal gravitational constant ($6.674 \\times 10^{-11}\\text{ N}\\cdot\\text{m}^2/\\text{kg}^2$)" },
      { symbol: "r", meaning: "Semi-major axis / orbital radius from center of planet ($r = R + h$)" },
    ],
    whenToUse: "Use for geostationary satellite period calculations ($T = 24\\text{ hrs}$) and satellite orbital energy transitions ($E = -\\frac{G M m}{2r}$).",
    commonMistake: "Binding energy of a satellite is $+G M m / (2r)$. Kinetic energy is equal to magnitude of total energy.",
    frequencyBadge: "Tested in 8 of last 10 shifts",
    priority: "High",
    tags: ["Gravitation", "Escape Velocity", "Kepler Laws"],
  },

  // 7. Mechanical Properties of Solids & Fluids
  {
    id: "f-phy-fluids-01",
    subject: "Physics",
    name: "Bernoulli Equation, Terminal Velocity & Surface Tension",
    chapter: "Mechanical Properties of Solids & Fluids",
    latex: "P + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{const}, \\quad v_t = \\frac{2 r^2 (\\rho - \\sigma) g}{9 \\eta}, \\quad \\Delta P_{\\text{soap bubble}} = \\frac{4 T}{R}",
    variables: [
      { symbol: "P", meaning: "Static fluid pressure (Pascals)" },
      { symbol: "v_t", meaning: "Terminal falling velocity of spherical drop (Stokes' law)" },
      { symbol: "\\eta", meaning: "Dynamic viscosity coefficient of fluid (Poiseuille / Pa$\\cdot$s)" },
      { symbol: "T", meaning: "Surface tension of liquid ($N/m$)" },
      { symbol: "\\Delta P", meaning: "Excess pressure inside curved bubble (for liquid drop $\\Delta P = 2T/R$)" },
    ],
    whenToUse: "Use for Venturi meters, Torricelli efflux speed $v = \\sqrt{2gh}$, and capillary rise $h = \\frac{2T\\cos\\theta}{r\\rho g}$.",
    commonMistake: "Soap bubble has TWO liquid-air interfaces, so excess pressure is $\\frac{4T}{R}$. A liquid droplet has only ONE interface, so $\\Delta P = \\frac{2T}{R}$.",
    frequencyBadge: "Tested in 8 of last 10 shifts",
    priority: "High",
    tags: ["Fluids", "Bernoulli", "Surface Tension"],
  },

  // 8. Thermodynamics & KTG
  {
    id: "f-phy-thermo-01",
    subject: "Physics",
    name: "First Law of Thermodynamics & Carnot Heat Engine",
    chapter: "Thermodynamics & Kinetic Theory",
    latex: "\\Delta Q = \\Delta U + W, \\quad W_{\\text{isothermal}} = n R T \\ln\\left(\\frac{V_2}{V_1}\\right), \\quad \\eta_{\\text{Carnot}} = 1 - \\frac{T_{\\text{sink}}}{T_{\\text{source}}}",
    variables: [
      { symbol: "\\Delta U", meaning: "Change in internal energy ($n C_v \\Delta T = \\frac{f}{2} n R \\Delta T$)" },
      { symbol: "W", meaning: "Work done by gas system ($P \\Delta V$)" },
      { symbol: "\\eta", meaning: "Carnot thermal efficiency ($0 < \\eta < 1$)" },
      { symbol: "T", meaning: "Absolute temperature strictly in Kelvin ($T_K = T_C + 273.15$)" },
    ],
    whenToUse: "Use for PV cyclic diagrams, adiabatic expansion ($P V^\\gamma = \\text{const}$, $W_{\\text{ad}} = \\frac{P_1 V_1 - P_2 V_2}{\\gamma - 1}$), and heat engines.",
    commonMistake: "Entering temperatures in Celsius instead of Kelvin ($T_K$).",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Thermodynamics", "Carnot Engine", "Adiabatic"],
  },

  // 9. Oscillations & Waves
  {
    id: "f-phy-shm-01",
    subject: "Physics",
    name: "Simple Harmonic Motion & Doppler Frequency Shift",
    chapter: "Oscillations & Waves",
    latex: "T = 2\\pi \\sqrt{\\frac{m}{k}} = 2\\pi\\sqrt{\\frac{l}{g}}, \\quad f' = f_0 \\left(\\frac{v \\pm v_o}{v \\mp v_s}\\right)",
    variables: [
      { symbol: "T", meaning: "Time period of spring-mass or simple pendulum (seconds)" },
      { symbol: "f'", meaning: "Apparent frequency heard by observer (Hz)" },
      { symbol: "v", meaning: "Speed of sound in medium (m/s)" },
      { symbol: "v_o, v_s", meaning: "Velocities of observer and source along the line of sight" },
    ],
    whenToUse: "Use for SHM energy ($E = \\frac{1}{2} k A^2$), resonance in organ pipes ($f_n = n \\frac{v}{4L}$ for closed pipe), and Doppler effect.",
    commonMistake: "Numerator takes $(+)$ when observer approaches source; Denominator takes $(-)$ when source approaches observer.",
    frequencyBadge: "Tested in 8 of last 10 shifts",
    priority: "High",
    tags: ["SHM", "Doppler Effect", "Waves"],
  },

  // 10. Electric Charges and Fields
  {
    id: "f-phy-ecf-01",
    subject: "Physics",
    name: "Gauss's Law & Electric Flux from Symmetrical Surfaces",
    chapter: "Electric Charges and Fields",
    latex: "\\begin{gathered} \\Phi = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{\\text{enclosed}}}{\\varepsilon_0} \\\\[5pt] E_{\\text{wire}} = \\frac{\\lambda}{2\\pi\\varepsilon_0 r}, \\quad E_{\\text{sheet}} = \\frac{\\sigma}{2\\varepsilon_0} \\end{gathered}",
    variables: [
      { symbol: "\\Phi", meaning: "Total electric flux through closed Gaussian surface ($\\text{N}\\cdot\\text{m}^2/\\text{C}$)" },
      { symbol: "q_{\\text{enclosed}}", meaning: "Net algebraic charge inside the Gaussian boundary" },
      { symbol: "\\lambda", meaning: "Linear charge density (C/m)" },
      { symbol: "\\sigma", meaning: "Surface charge density (C/m$^2$)" },
    ],
    whenToUse: "Use for deriving field around infinite line charge, uniform plane sheet, and conducting spherical shells.",
    commonMistake: "For a conducting plate with charge on both faces, field is $E = \\frac{\\sigma}{\\varepsilon_0}$ (twice the thin dielectric sheet).",
    frequencyBadge: "Mandatory CBSE 5-Marker Derivation",
    priority: "High",
    tags: ["Electrostatics", "Gauss Law", "Electric Field"],
  },

  // 11. Electrostatic Potential and Capacitance
  {
    id: "f-phy-pot-01",
    subject: "Physics",
    name: "Capacitance with Dielectric Slab & Energy Loss on Sharing",
    chapter: "Electrostatic Potential and Capacitance",
    latex: "C = \\frac{\\varepsilon_0 A}{d - t\\left(1 - \\frac{1}{K}\\right)}, \\quad \\Delta U = \\frac{C_1 C_2}{2(C_1 + C_2)}(V_1 - V_2)^2",
    variables: [
      { symbol: "C", meaning: "Capacitance with partial dielectric slab (Farads)" },
      { symbol: "t", meaning: "Thickness of dielectric slab of constant K ($t < d$)" },
      { symbol: "\\Delta U", meaning: "Energy dissipated as heat/spark during charge redistribution" },
      { symbol: "V_1, V_2", meaning: "Initial voltages of the two connected capacitors" },
    ],
    whenToUse: "Use when dielectric slabs are inserted or when two charged capacitors are connected in parallel.",
    commonMistake: "When battery remains CONNECTED during dielectric insertion: Voltage $V$ remains constant, $Q$ increases by $K$, $C$ increases by $K$, Energy $U$ increases by $K$.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Capacitance", "Dielectric", "Energy Loss"],
  },

  // 12. Current Electricity
  {
    id: "f-phy-ce-01",
    subject: "Physics",
    name: "Drift Velocity, Microscopic Ohm's Law & Wheatstone Bridge",
    chapter: "Current Electricity",
    latex: "I = n e A v_d, \\quad j = \\sigma E = \\frac{n e^2 \\tau}{m} E, \\quad \\frac{P}{Q} = \\frac{R}{S} \\quad (\\text{Balanced Bridge})",
    variables: [
      { symbol: "I", meaning: "Electric current through conductor (Amperes)" },
      { symbol: "v_d", meaning: "Electron drift velocity ($v_d = \\frac{e E \\tau}{m}$)" },
      { symbol: "\\tau", meaning: "Mean collision relaxation time" },
      { symbol: "P, Q, R, S", meaning: "Four arm resistances of Wheatstone bridge" },
    ],
    whenToUse: "Use for microscopic resistivity calculations, temperature coefficient $\\rho_T = \\rho_0[1 + \\alpha \\Delta T]$, and null point bridge analysis.",
    commonMistake: "Current density $j$ is a VECTOR ($\\vec{j} = \\sigma \\vec{E}$), whereas current $I$ is a SCALAR.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Current", "Drift Velocity", "Wheatstone Bridge"],
  },

  // 13. Moving Charges and Magnetism
  {
    id: "f-phy-mc-01",
    subject: "Physics",
    name: "Biot-Savart Loop Axis Field & Galvanometer Conversion",
    chapter: "Moving Charges and Magnetism",
    latex: "B = \\frac{\\mu_0 N I R^2}{2 (R^2 + x^2)^{3/2}}, \\quad S = \\frac{I_g G}{I - I_g}, \\quad R = \\frac{V}{I_g} - G",
    variables: [
      { symbol: "B", meaning: "Axial magnetic field (Tesla)" },
      { symbol: "S", meaning: "Shunt resistance in parallel to make Ammeter ($\\Omega$)" },
      { symbol: "R", meaning: "High series resistance to make Voltmeter ($\\Omega$)" },
      { symbol: "I_g", meaning: "Full-scale deflection current of galvanometer coil" },
      { symbol: "G", meaning: "Internal galvanometer coil resistance" },
    ],
    whenToUse: "Use for circular coil axis fields and designing ammeters/voltmeters with desired measuring ranges.",
    commonMistake: "An ammeter must have LOW internal resistance (connected in series); A voltmeter must have HIGH internal resistance (connected in parallel).",
    frequencyBadge: "Tested in 9 of last 10 shifts",
    priority: "High",
    tags: ["Moving Charges", "Biot Savart", "Galvanometer"],
  },

  // 14. Magnetism and Matter
  {
    id: "f-phy-mm-01",
    subject: "Physics",
    name: "Magnetic Dipole, Susceptibility & Curie Law",
    chapter: "Magnetism and Matter",
    latex: "\\vec{\\tau} = \\vec{M} \\times \\vec{B}, \\quad U = -\\vec{M}\\cdot\\vec{B}, \\quad \\chi_m = \\frac{C}{T} \\quad (\\text{Curie Law for Paramagnets})",
    variables: [
      { symbol: "\\vec{M}", meaning: "Magnetic dipole moment ($M = N I A$ or $m \\times 2l$)" },
      { symbol: "\\chi_m", meaning: "Magnetic susceptibility ($\\mu_r = 1 + \\chi_m$)" },
      { symbol: "C", meaning: "Curie constant" },
      { symbol: "T", meaning: "Absolute temperature (Kelvin)" },
    ],
    whenToUse: "Use to distinguish Dia ($\\chi < 0$), Para ($0 < \\chi \\ll 1$), and Ferro ($\\chi \\gg 1$) magnetic materials.",
    commonMistake: "Diamagnetic susceptibility is temperature-INDEPENDENT and slightly negative ($\\mu_r < 1$).",
    frequencyBadge: "Tested in 7 of last 10 shifts",
    priority: "High",
    tags: ["Magnetism", "Curie Law", "Magnetic Materials"],
  },

  // 15. Electromagnetic Induction
  {
    id: "f-phy-emi-01",
    subject: "Physics",
    name: "Faraday Law, Motional EMF & Self-Inductance",
    chapter: "Electromagnetic Induction",
    latex: "e = -\\frac{d\\Phi_B}{dt} = B v L, \\quad e = -L \\frac{dI}{dt}, \\quad U_B = \\frac{1}{2} L I^2, \\quad L = \\mu_0 n^2 A l",
    variables: [
      { symbol: "e", meaning: "Induced electromotive force (Volts)" },
      { symbol: "\\Phi_B", meaning: "Magnetic flux ($\\vec{B}\\cdot\\vec{A} = B A \\cos\\theta$)" },
      { symbol: "L", meaning: "Self inductance of solenoid (Henries)" },
      { symbol: "n", meaning: "Number of turns per unit length ($N/l$)" },
    ],
    whenToUse: "Use for rotating rods in magnetic field ($e = \\frac{1}{2} B \\omega L^2$) and magnetic energy density $u_B = \\frac{B^2}{2\\mu_0}$.",
    commonMistake: "For self inductance of solenoid, $L \\propto N^2$ (square of turns, not linear $N$).",
    frequencyBadge: "Tested in 9 of last 10 shifts",
    priority: "High",
    tags: ["EMI", "Motional EMF", "Self Inductance"],
  },

  // 16. Alternating Current
  {
    id: "f-phy-ac-01",
    subject: "Physics",
    name: "Series LCR Resonance, Power Factor & Transformer Ratio",
    chapter: "Alternating Current",
    latex: "Z = \\sqrt{R^2 + (X_L - X_C)^2}, \\quad \\omega_0 = \\frac{1}{\\sqrt{LC}}, \\quad P_{\\text{avg}} = V_{\\text{rms}} I_{\\text{rms}} \\cos\\phi, \\quad \\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{I_p}{I_s}",
    variables: [
      { symbol: "Z", meaning: "Total circuit impedance ($\\Omega$)" },
      { symbol: "\\cos\\phi", meaning: "Power factor ($R/Z$, equals 1 at resonance, 0 for pure L or C)" },
      { symbol: "V_{\\text{rms}}", meaning: "Root mean square voltage ($V_0 / \\sqrt{2}$)" },
      { symbol: "N_s/N_p", meaning: "Transformer turns ratio" },
    ],
    whenToUse: "Use for impedance, wattage consumption, quality factor $Q = \\frac{\\omega_0 L}{R}$, and step-up/step-down transformers.",
    commonMistake: "Wattless current occurs when phase difference $\\phi = 90^\\circ$ ($\\cos\\phi = 0$), so average power loss is $0\\text{ W}$.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["AC", "LCR Circuit", "Power Factor", "Transformer"],
  },

  // 17. Electromagnetic Waves
  {
    id: "f-phy-emw-01",
    subject: "Physics",
    name: "Displacement Current & Maxwell's Wave Speed",
    chapter: "Electromagnetic Waves",
    latex: "I_d = \\varepsilon_0 \\frac{d\\Phi_E}{dt}, \\quad c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}} = \\frac{E_0}{B_0}, \\quad I = \\frac{1}{2} \\varepsilon_0 c E_0^2",
    variables: [
      { symbol: "I_d", meaning: "Maxwell displacement current between charging capacitor plates (Amperes)" },
      { symbol: "c", meaning: "Speed of light in vacuum ($3 \\times 10^8\\text{ m/s}$)" },
      { symbol: "E_0, B_0", meaning: "Peak electric and magnetic field amplitudes ($E_0 = c B_0$)" },
      { symbol: "I", meaning: "Wave intensity / Poynting vector average ($W/m^2$)" },
    ],
    whenToUse: "Use to verify Ampere-Maxwell law $\\oint \\vec{B}\\cdot d\\vec{l} = \\mu_0(I_c + I_d)$ and calculate radiation pressure ($P = I/c$ for absorbing, $2I/c$ for reflecting).",
    commonMistake: "Electric field $\\vec{E}$ and magnetic field $\\vec{B}$ in an EM wave are in the SAME PHASE and mutually perpendicular to the direction of propagation.",
    frequencyBadge: "Tested in 7 of last 10 shifts",
    priority: "High",
    tags: ["EM Waves", "Displacement Current", "Maxwell"],
  },

  // 18. Ray Optics and Optical Instruments
  {
    id: "f-phy-ro-01",
    subject: "Physics",
    name: "Lens Maker, Prism Minimum Deviation & Compound Microscope",
    chapter: "Ray Optics and Optical Instruments",
    latex: "\\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right), \\quad \\mu = \\frac{\\sin\\left(\\frac{A + \\delta_m}{2}\\right)}{\\sin\\left(\\frac{A}{2}\\right)}, \\quad m = \\frac{L}{f_o}\\left(1 + \\frac{D}{f_e}\\right)",
    variables: [
      { symbol: "\\delta_m", meaning: "Angle of minimum deviation for prism of apex angle A" },
      { symbol: "m", meaning: "Magnifying power of compound microscope when image is at near point D" },
      { symbol: "f_o, f_e", meaning: "Focal lengths of objective and eyepiece lenses ($f_o < f_e$ for microscope)" },
      { symbol: "L", meaning: "Tube length of microscope" },
    ],
    whenToUse: "Use for equivalent focal length of combined thin lenses $\\frac{1}{F} = \\frac{1}{f_1} + \\frac{1}{f_2}$, silvered lenses, and astronomical telescopes ($m = f_o/f_e$).",
    commonMistake: "For an astronomical telescope, the objective focal length MUST be MUCH LARGER than eyepiece ($f_o \\gg f_e$), opposite of microscope.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Ray Optics", "Lens Maker", "Prism", "Microscope"],
  },

  // 19. Wave Optics
  {
    id: "f-phy-wo-01",
    subject: "Physics",
    name: "Young's Double Slit Fringe Width & Brewster's Polarization Law",
    chapter: "Wave Optics",
    latex: "\\beta = \\frac{\\lambda D}{d}, \\quad y_n = n \\frac{\\lambda D}{d}, \\quad \\Delta x = \\frac{d y}{D}, \\quad \\mu = \\tan i_p \\quad (\\text{Brewster Law})",
    variables: [
      { symbol: "\\beta", meaning: "Fringe width between adjacent maxima or minima (meters)" },
      { symbol: "D", meaning: "Distance from double slits to screen" },
      { symbol: "d", meaning: "Slit separation distance" },
      { symbol: "i_p", meaning: "Brewster polarizing angle (reflected light is 100% plane-polarized)" },
    ],
    whenToUse: "Use for interference pattern fringe shifts when thin glass sheet ($t$) is inserted ($\\Delta y = \\frac{(\\mu-1)t D}{d}$) and single slit diffraction width ($2\\lambda D / a$).",
    commonMistake: "If entire YDSE apparatus is immersed in water ($\mu = 4/3$), fringe width decreases to $\\beta / \\mu$.",
    frequencyBadge: "Tested in 9 of last 10 shifts",
    priority: "High",
    tags: ["Wave Optics", "Interference", "Diffraction", "YDSE"],
  },

  // 20. Dual Nature of Radiation and Matter
  {
    id: "f-phy-dn-01",
    subject: "Physics",
    name: "Einstein Photoelectric Equation & de Broglie Wavelength",
    chapter: "Dual Nature of Radiation and Matter",
    latex: "e V_0 = h \\nu - \\Phi_0 = h c \\left(\\frac{1}{\\lambda} - \\frac{1}{\\lambda_0}\\right), \\quad \\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2 m q V}} = \\frac{12.27}{\\sqrt{V}}\\text{ \\AA} \\quad (\\text{for } e^-)",
    variables: [
      { symbol: "V_0", meaning: "Stopping potential (Volts)" },
      { symbol: "\\Phi_0", meaning: "Work function of the photosensitive emitter" },
      { symbol: "\\lambda", meaning: "de Broglie matter wavelength" },
      { symbol: "V", meaning: "Accelerating potential difference (Volts)" },
    ],
    whenToUse: "Use for comparing de Broglie wavelengths of proton, deuteron ($m=2m_p, q=q_p$), and alpha particle ($m=4m_p, q=2q_p$).",
    commonMistake: "Thermal neutron de Broglie wavelength is $\\lambda = \\frac{h}{\\sqrt{3 m k_B T}}$, not $\\sqrt{2mqV}$.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Modern Physics", "Photoelectric", "de Broglie"],
  },

  // 21. Atoms
  {
    id: "f-phy-atom-01",
    subject: "Physics",
    name: "Bohr Model Orbit Radius, Velocity & Rydberg Spectral Series",
    chapter: "Atoms",
    latex: "r_n = 0.529 \\frac{n^2}{Z}\\text{ \\AA}, \\quad v_n = 2.18 \\times 10^6 \\frac{Z}{n}\\text{ m/s}, \\quad E_n = -13.6 \\frac{Z^2}{n^2}\\text{ eV}, \\quad \\frac{1}{\\lambda} = R Z^2 \\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)",
    variables: [
      { symbol: "n", meaning: "Principal quantum shell ($n=1,2,3\\dots$)" },
      { symbol: "Z", meaning: "Atomic number of hydrogenic ion ($Z=1$ for H, $Z=2$ for He$^+$)" },
      { symbol: "R", meaning: "Rydberg constant ($1.097 \\times 10^7\\text{ m}^{-1}$)" },
      { symbol: "n_1, n_2", meaning: "Spectral series lower/upper shell ($n_1=1$ Lyman, $n_1=2$ Balmer, $n_1=3$ Paschen)" },
    ],
    whenToUse: "Use for calculating shortest wavelength (series limit $n_2 \\to \\infty$) and longest wavelength ($n_2 = n_1 + 1$) for hydrogen spectra.",
    commonMistake: "Lyman series lies in ULTRAVIOLET region; Balmer series lies in VISIBLE region; Paschen/Brackett/Pfund lie in INFRARED region.",
    frequencyBadge: "Tested in 9 of last 10 shifts",
    priority: "High",
    tags: ["Atoms", "Bohr Model", "Rydberg Formula"],
  },

  // 22. Nuclei
  {
    id: "f-phy-nuc-01",
    subject: "Physics",
    name: "Nuclear Radius, Mass Defect & Binding Energy",
    chapter: "Nuclei",
    latex: "R = R_0 A^{1/3} \\quad (R_0 = 1.2\\text{ fm}), \\quad \\Delta m = [Z m_p + (A - Z) m_n] - M_{\\text{nucleus}}, \\quad E_b = \\Delta m \\times 931.5\\text{ MeV}",
    variables: [
      { symbol: "R", meaning: "Nuclear radius ($A$ is mass number)" },
      { symbol: "\\Delta m", meaning: "Mass defect in atomic mass units (a.m.u.)" },
      { symbol: "E_b / A", meaning: "Binding energy per nucleon (peaks at $\\approx 8.75\\text{ MeV}$ for $^{56}\\text{Fe}$)" },
    ],
    whenToUse: "Use to prove nuclear density $\\rho = \\frac{M}{V} = \\text{constant} \\approx 2.3 \\times 10^{17}\\text{ kg/m}^3$ independent of mass number $A$.",
    commonMistake: "Binding energy per nucleon curve explains why both fission of heavy nuclei ($A>200$) and fusion of light nuclei ($A<30$) release massive energy.",
    frequencyBadge: "Tested in 8 of last 10 shifts",
    priority: "High",
    tags: ["Nuclei", "Mass Defect", "Binding Energy"],
  },

  // 23. Semiconductor Electronics
  {
    id: "f-phy-semi-01",
    subject: "Physics",
    name: "Mass Action Law, Rectifier Ripple Factor & Dynamic Resistance",
    chapter: "Semiconductor Electronics: Materials & Simple Circuits",
    latex: "n_e n_h = n_i^2, \\quad \\sigma = e(n_e \\mu_e + n_h \\mu_h), \\quad r_d = \\frac{\\Delta V}{\\Delta I}, \\quad f_{\\text{full-wave}} = 2 f_{\\text{in}}",
    variables: [
      { symbol: "n_e, n_h", meaning: "Electron and hole charge carrier concentrations (m$^{-3}$)" },
      { symbol: "n_i", meaning: "Intrinsic carrier concentration" },
      { symbol: "\\mu_e, \\mu_h", meaning: "Mobilities of electrons and holes ($\\mu_e > \\mu_h$)" },
      { symbol: "f_{\\text{full-wave}}", meaning: "Output ripple frequency ($100\\text{ Hz}$ for $50\\text{ Hz}$ AC input)" },
    ],
    whenToUse: "Use for doping calculations ($n$-type vs $p$-type), diode $V-I$ characteristics, and half-wave vs full-wave center-tapped rectifiers.",
    commonMistake: "For half-wave rectifier $f_{\\text{out}} = f_{\\text{in}}$; For full-wave rectifier $f_{\\text{out}} = 2 f_{\\text{in}}$.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Semiconductors", "p-n Junction", "Rectifier"],
  },


  // =========================================================================
  // CHEMISTRY — FULL SYLLABUS COVERAGE (CBSE 12 & JEE MAIN)
  // =========================================================================

  // 1. Mole Concept
  {
    id: "f-chem-mole-01",
    subject: "Chemistry",
    name: "Molarity, Molality & Stoichiometric Limiting Reagent",
    chapter: "Basic Concepts of Chemistry (Mole Concept)",
    latex: "M = \\frac{w_B \\times 1000}{M_B \\times V_{\\text{mL}}}, \\quad m = \\frac{w_B \\times 1000}{M_B \\times W_A(\\text{g})}, \\quad x_B = \\frac{n_B}{n_A + n_B}",
    variables: [
      { symbol: "M", meaning: "Molarity (moles of solute per Liter of solution; temperature dependent)" },
      { symbol: "m", meaning: "Molality (moles of solute per kg of solvent; temperature INDEPENDENT)" },
      { symbol: "x_B", meaning: "Mole fraction of solute" },
    ],
    whenToUse: "Use for unit conversions between $M, m$, percentage by weight ($w/w$), and dilution formula $M_1 V_1 + M_2 V_2 = M_R (V_1 + V_2)$.",
    commonMistake: "Molality and Mole Fraction do NOT change with temperature because mass does not expand with heat.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Mole Concept", "Concentration Units", "Molarity"],
  },

  // 2. Atomic Structure
  {
    id: "f-chem-atom-01",
    subject: "Chemistry",
    name: "de Broglie Wavelength & Heisenberg Uncertainty Principle",
    chapter: "Atomic Structure & Quantum Mechanics",
    latex: "\\lambda = \\frac{h}{m v}, \\quad \\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi} \\quad \\implies \\quad \\Delta x \\cdot \\Delta v \\ge \\frac{h}{4\\pi m}",
    variables: [
      { symbol: "\\Delta x", meaning: "Uncertainty in position of electron (meters)" },
      { symbol: "\\Delta p", meaning: "Uncertainty in linear momentum ($m \\Delta v$)" },
      { symbol: "h", meaning: "Planck constant ($6.626 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$)" },
    ],
    whenToUse: "Use for electron quantum numbers ($n, l, m, s$), total radial nodes ($n - l - 1$), and angular nodes ($l$).",
    commonMistake: "Total nodes in an orbital is $n - 1$. Radial nodes = $n - l - 1$, Angular nodes = $l$.",
    frequencyBadge: "Tested in 9 of last 10 shifts",
    priority: "High",
    tags: ["Atomic Structure", "Heisenberg", "Quantum Numbers"],
  },

  // 3. Chemical Bonding
  {
    id: "f-chem-bond-01",
    subject: "Chemistry",
    name: "Bond Order (MOT) & Dipole Moment",
    chapter: "Chemical Bonding & Molecular Structure",
    latex: "\\text{Bond Order} = \\frac{N_b - N_a}{2}, \\quad \\mu = q \\times d \\quad (1\\text{ Debye} = 3.335 \\times 10^{-30}\\text{ C}\\cdot\\text{m})",
    variables: [
      { symbol: "N_b", meaning: "Number of electrons in bonding molecular orbitals" },
      { symbol: "N_a", meaning: "Number of electrons in antibonding molecular orbitals" },
      { symbol: "\\mu", meaning: "Net molecular dipole moment (vector sum)" },
    ],
    whenToUse: "Use for stability ($BO > 0$), magnetic property (unpaired electrons $\\implies$ paramagnetic), and bond length ($BL \\propto 1/BO$).",
    commonMistake: "For $\\text{O}_2$ ($16 e^-$), bond order is $2$ and it is PARAMAGNETIC due to 2 unpaired electrons in $\\pi^* 2p_x, \\pi^* 2p_y$.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["MOT", "Bond Order", "Dipole Moment"],
  },

  // 4. Chemical Thermodynamics
  {
    id: "f-chem-thermo-01",
    subject: "Chemistry",
    name: "Gibbs Free Energy & Spontaneity Criterion",
    chapter: "Chemical Thermodynamics & Thermochemistry",
    latex: "\\Delta G = \\Delta H - T \\Delta S, \\quad \\Delta G^0 = -R T \\ln K = -2.303 R T \\log K, \\quad \\Delta H = \\Delta U + \\Delta n_g R T",
    variables: [
      { symbol: "\\Delta G", meaning: "Gibbs free energy change (spontaneous if $\\Delta G < 0$)" },
      { symbol: "\\Delta H", meaning: "Enthalpy change (exothermic if $\\Delta H < 0$)" },
      { symbol: "\\Delta S", meaning: "Entropy change (positive for increasing disorder)" },
      { symbol: "\\Delta n_g", meaning: "Moles of gaseous products minus moles of gaseous reactants" },
    ],
    whenToUse: "Use to predict reaction feasibility at different temperatures and calculate equilibrium constants from $\\Delta G^0$.",
    commonMistake: "When substituting into $\\Delta G = \\Delta H - T \\Delta S$, ensure both $\\Delta H$ and $\\Delta S$ use the same energy units (convert kJ to J).",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Thermodynamics", "Gibbs Free Energy", "Spontaneity"],
  },

  // 5. Equilibrium
  {
    id: "f-chem-eq-01",
    subject: "Chemistry",
    name: "Equilibrium Constant Relation & Buffer Solution pH",
    chapter: "Chemical & Ionic Equilibrium",
    latex: "K_p = K_c (R T)^{\\Delta n_g}, \\quad \\text{pH} = \\text{p}K_a + \\log\\frac{[\\text{Salt}]}{[\\text{Acid}]} \\quad (\\text{Henderson-Hasselbalch})",
    variables: [
      { symbol: "K_p, K_c", meaning: "Equilibrium constants in terms of partial pressures and molar concentrations" },
      { symbol: "\\text{p}K_a", meaning: "Negative logarithm of weak acid dissociation constant ($-\\log K_a$)" },
      { symbol: "K_{sp}", meaning: "Solubility product for sparingly soluble salts" },
    ],
    whenToUse: "Use for acidic buffer solutions ($\text{CH}_3\text{COOH} + \text{CH}_3\text{COONa}$), basic buffers ($\\text{pOH} = \\text{p}K_b + \\log \\frac{[\\text{Salt}]}{[\\text{Base}]}$), and common ion effect.",
    commonMistake: "For a salt $A_x B_y \\rightleftharpoons x A^{y+} + y B^{x-}$, $K_{sp} = (x^x y^y) s^{x+y}$. For $\\text{Al}_2(\\text{SO}_4)_3$, $K_{sp} = 2^2 \\cdot 3^3 s^5 = 108 s^5$.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Equilibrium", "Buffer Solutions", "Solubility Product"],
  },

  // 6. Solutions
  {
    id: "f-chem-sol-01",
    subject: "Chemistry",
    name: "Raoult's Law & Colligative Elevation/Depression",
    chapter: "Solutions",
    latex: "P_T = P_A^0 x_A + P_B^0 x_B, \\quad \\frac{P_A^0 - P}{P_A^0} = i x_B, \\quad \\Delta T_b = i K_b m, \\quad \\Delta T_f = i K_f m, \\quad \\Pi = i C R T",
    variables: [
      { symbol: "i", meaning: "Van 't Hoff factor ($i = 1 + (n-1)\\alpha$ for dissociation; $i = 1 + (1/n - 1)\\alpha$ for association)" },
      { symbol: "K_b, K_f", meaning: "Ebullioscopic and Cryoscopic constants (K$\\cdot$kg/mol)" },
      { symbol: "\\Pi", meaning: "Osmotic pressure (atm)" },
    ],
    whenToUse: "Use for abnormal molar masses, reverse osmosis desalination, and binary liquid ideal vs non-ideal azeotropes.",
    commonMistake: "Benzoic acid in benzene dimerizes ($n=2, i < 1$), so $i = 1 - \\alpha/2$. Ionic salts ($\text{NaCl}$) ionize ($n=2, i > 1$), so $i = 1 + \\alpha$.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Solutions", "Raoult Law", "Van t Hoff"],
  },

  // 7. Electrochemistry
  {
    id: "f-chem-ec-01",
    subject: "Chemistry",
    name: "Nernst Equation & Kohlrausch Molar Conductivity",
    chapter: "Electrochemistry",
    latex: "E_{\\text{cell}} = E^0_{\\text{cell}} - \\frac{0.0591}{n} \\log Q, \\quad \\Delta G^0 = -n F E^0_{\\text{cell}}, \\quad \\Lambda_m^0 = \\nu_+ \\lambda_+^0 + \\nu_- \\lambda_-^0, \\quad m = Z I t",
    variables: [
      { symbol: "E_{\\text{cell}}", meaning: "Cell potential / EMF at non-standard conditions (Volts)" },
      { symbol: "n", meaning: "Number of moles of electrons transferred in balanced redox reaction" },
      { symbol: "Q", meaning: "Reaction quotient ($[\\text{Products}] / [\\text{Reactants}]$ with stoichiometric powers)" },
      { symbol: "F", meaning: "Faraday constant ($96,500\\text{ C/mol } e^-$)" },
    ],
    whenToUse: "Use for standard reduction potentials $E^0_{\\text{cell}} = E^0_{\\text{cathode}} - E^0_{\\text{anode}}$, Faraday's electrolysis, and weak acid degree of dissociation $\\alpha = \\Lambda_m^c / \\Lambda_m^0$.",
    commonMistake: "Pure solids have activity $= 1$. Do not include $[\text{Zn(s)}]$ or $[\text{Cu(s)}]$ in the reaction quotient $Q$.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Electrochemistry", "Nernst Equation", "Kohlrausch"],
  },

  // 8. Chemical Kinetics
  {
    id: "f-chem-ck-01",
    subject: "Chemistry",
    name: "Integrated First-Order Rate Equation & Arrhenius Activation Energy",
    chapter: "Chemical Kinetics",
    latex: "k = \\frac{2.303}{t} \\log\\frac{[A]_0}{[A]_t}, \\quad t_{1/2} = \\frac{0.693}{k}, \\quad \\log\\frac{k_2}{k_1} = \\frac{E_a}{2.303 R}\\left(\\frac{T_2 - T_1}{T_1 T_2}\\right)",
    variables: [
      { symbol: "k", meaning: "Reaction rate constant (units: $\\text{mol}^{1-n}\\text{ L}^{n-1}\\text{ s}^{-1}$ for order n)" },
      { symbol: "t_{1/2}", meaning: "Half life period (independent of initial concentration for 1st order)" },
      { symbol: "E_a", meaning: "Arrhenius activation energy (J/mol)" },
      { symbol: "R", meaning: "Universal gas constant ($8.314\\text{ J/mol}\\cdot\\text{K}$)" },
    ],
    whenToUse: "Use for order of reaction, radioactive decay, pseudo-first order hydrolysis, and temperature rate increase.",
    commonMistake: "For zero order reactions, $t_{1/2} = \\frac{[A]_0}{2k}$ (directly proportional to initial concentration, unlike 1st order).",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Kinetics", "First Order", "Arrhenius Equation"],
  },

  // 9. Coordination Compounds
  {
    id: "f-chem-coord-01",
    subject: "Chemistry",
    name: "Spin-Only Magnetic Moment & Crystal Field Splitting (CFSE)",
    chapter: "Coordination Compounds",
    latex: "\\mu_s = \\sqrt{n(n + 2)}\\text{ BM}, \\quad \\Delta_t = \\frac{4}{9} \\Delta_o, \\quad \\text{CFSE} = \\left(-0.4 n_{t_{2g}} + 0.6 n_{e_g}\\right)\\Delta_o + P",
    variables: [
      { symbol: "\\mu_s", meaning: "Spin-only magnetic moment in Bohr Magnetons (BM)" },
      { symbol: "n", meaning: "Number of unpaired $d$-electrons" },
      { symbol: "\\Delta_o", meaning: "Octahedral crystal field splitting energy" },
      { symbol: "\\Delta_t", meaning: "Tetrahedral crystal field splitting energy" },
    ],
    whenToUse: "Use for high-spin vs low-spin complexes (spectrochemical series: $\\text{CN}^- > \\text{CO} > \\text{en} > \\text{NH}_3 > \\text{H}_2\\text{O} > \\text{F}^- > \\text{Cl}^-$) and geometric isomerism.",
    commonMistake: "Strong field ligands ($\text{CN}^-, \text{CO}$) cause pairing ($\Delta_o > P$), yielding low-spin diamagnetic/inner orbital complexes ($d^2sp^3$).",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Coordination", "CFT", "Magnetic Moment"],
  },

  // 10. d- and f-Block Elements
  {
    id: "f-chem-df-01",
    subject: "Chemistry",
    name: "Lanthanoid Contraction & Potassium Dichromate/Permanganate Redox",
    chapter: "The d- and f-Block Elements",
    latex: "\\text{MnO}_4^- + 8\\text{H}^+ + 5e^- \\to \\text{Mn}^{2+} + 4\\text{H}_2\\text{O} \\quad (E^0 = +1.51\\text{ V}), \\quad \\text{Cr}_2\\text{O}_7^{2-} + 14\\text{H}^+ + 6e^- \\to 2\\text{Cr}^{3+} + 7\\text{H}_2\\text{O}",
    variables: [
      { symbol: "\\text{MnO}_4^-", meaning: "Permanganate ion (oxidizes $\\text{Fe}^{2+} \\to \\text{Fe}^{3+}$, $\\text{C}_2\\text{O}_4^{2-} \\to \\text{CO}_2$, $\\text{I}^- \\to \\text{I}_2$)" },
      { symbol: "\\text{Cr}_2\\text{O}_7^{2-}", meaning: "Dichromate ion in acidic medium ($n$-factor = 6)" },
      { symbol: "E^0", meaning: "Standard reduction potential" },
    ],
    whenToUse: "Use for transition metal oxidation states, colored ion absorption ($d-d$ transitions), catalytic properties, and interstitial alloy formation.",
    commonMistake: "Lanthanoid contraction causes the atomic radii of $4d$ and $5d$ series pairs (e.g. $\\text{Zr}/\\text{Hf}$ and $\\text{Nb}/\\text{Ta}$) to be virtually IDENTICAL.",
    frequencyBadge: "Tested in 9 of last 10 shifts",
    priority: "High",
    tags: ["d-Block", "f-Block", "Lanthanoid Contraction", "KMnO4"],
  },

  // 11. Organic Name Reactions & Haloalkanes
  {
    id: "f-chem-halo-01",
    subject: "Chemistry",
    name: "SN1 vs SN2 Nucleophilic Substitution & Grignard Reagents",
    chapter: "Haloalkanes and Haloarenes",
    latex: "\\text{SN1: Rate} = k[R\\text{-X}] \\quad (3^\\circ > 2^\\circ > 1^\\circ), \\quad \\text{SN2: Rate} = k[R\\text{-X}][\\text{Nu}^-] \\quad (1^\\circ > 2^\\circ > 3^\\circ)",
    variables: [
      { symbol: "\\text{SN1}", meaning: "Two-step unimolecular substitution via carbocation intermediate; produces RACEMIZATION" },
      { symbol: "\\text{SN2}", meaning: "Single-step bimolecular transition state; produces WALDEN INVERSION of configuration" },
      { symbol: "R\\text{-MgX}", meaning: "Grignard reagent ($R^- \\text{Mg}^{2+} X^-$)" },
    ],
    whenToUse: "Use for alkyl halide reactivity comparisons, polar protic vs polar aprotic solvent selection, and elimination (Saytzeff rule) vs substitution.",
    commonMistake: "SN2 reactions are favored in POLAR APROTIC solvents (DMSO, Acetone, DMF) with strong nucleophiles.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Organic", "SN1 SN2", "Haloalkanes"],
  },

  // 12. Alcohols, Phenols & Ethers
  {
    id: "f-chem-alc-01",
    subject: "Chemistry",
    name: "Lucas Test, Reimer-Tiemann & Kolbe's Reaction",
    chapter: "Alcohols, Phenols and Ethers",
    latex: "\\text{Phenol} + \\text{CO}_2 \\xrightarrow{\\text{NaOH}, \\text{H}^+} \\text{Salicylic Acid}, \\quad \\text{Phenol} + \\text{CHCl}_3 \\xrightarrow{\\text{NaOH}} \\text{Salicylaldehyde}",
    variables: [
      { symbol: "\\text{Lucas Reagent}", meaning: "Anhydrous $\\text{ZnCl}_2 + \\text{conc. HCl}$ (turbidity: $3^\\circ$ immediate, $2^\\circ$ in 5 mins, $1^\\circ$ only on heating)" },
      { symbol: "\\text{Kolbe}", meaning: "Synthesis of 2-hydroxybenzoic acid (aspirin precursor)" },
      { symbol: "\\text{Reimer-Tiemann}", meaning: "Formylation of phenol using dichlorocarbene intermediate ($:\\text{CCl}_2$)" },
    ],
    whenToUse: "Use for identifying primary/secondary/tertiary alcohols and electrophilic aromatic substitution on activated phenol rings.",
    commonMistake: "Williamson ether synthesis requires PRIMARY alkyl halide ($R\\text{X}$) and alkoxide ($R'\\text{O}^-\\text{Na}^+$). Tertiary alkyl halide gives ELIMINATION (alkene), not ether.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Alcohols", "Phenols", "Lucas Test", "Name Reactions"],
  },

  // 13. Aldehydes, Ketones & Carboxylic Acids
  {
    id: "f-chem-ald-01",
    subject: "Chemistry",
    name: "Aldol Condensation, Cannizzaro & Tollens/Fehling Tests",
    chapter: "Aldehydes, Ketones and Carboxylic Acids",
    latex: "2 \\text{CH}_3\\text{CHO} \\xrightarrow{\\text{dil. NaOH}} \\text{CH}_3\\text{CH(OH)CH}_2\\text{CHO} \\xrightarrow{\\Delta} \\text{CH}_3\\text{CH=CH-CHO} + \\text{H}_2\\text{O}",
    variables: [
      { symbol: "\\text{Aldol}", meaning: "Requires presence of at least one $\\alpha$-hydrogen" },
      { symbol: "\\text{Cannizzaro}", meaning: "Disproportionation of aldehydes with NO $\\alpha$-hydrogen (e.g. $\\text{HCHO}, \\text{PhCHO}$) in $50\\%\\text{ NaOH}$" },
      { symbol: "\\text{Tollens Reagent}", meaning: "$[\\text{Ag}(\\text{NH}_3)_2]^+$ yields silver mirror for all aldehydes (not ketones)" },
    ],
    whenToUse: "Use for distinguishing aldehydes from ketones (Tollens, Fehling, Iodoform test $\\text{CH}_3\\text{CO}-$ group) and nucleophilic additions.",
    commonMistake: "Benzaldehyde gives CANNIZZARO (forms benzyl alcohol + benzoate), while acetaldehyde gives ALDOL CONDENSATION.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Aldehydes", "Ketones", "Aldol", "Cannizzaro"],
  },

  // 14. Amines
  {
    id: "f-chem-amine-01",
    subject: "Chemistry",
    name: "Hoffmann Bromamide Degradation & Hinsberg Amine Test",
    chapter: "Amines",
    latex: "R\\text{-CONH}_2 + \\text{Br}_2 + 4\\text{NaOH} \\to R\\text{-NH}_2 + \\text{Na}_2\\text{CO}_3 + 2\\text{NaBr} + 2\\text{H}_2\\text{O}",
    variables: [
      { symbol: "R\\text{-CONH}_2", meaning: "Primary acid amide (degraded to primary amine with ONE FEWER carbon atom)" },
      { symbol: "\\text{Hinsberg Reagent}", meaning: "Benzenesulphonyl chloride ($\\text{C}_6\\text{H}_5\\text{SO}_2\\text{Cl}$)" },
      { symbol: "\\text{Diazonium Salt}", meaning: "$\\text{Ar-N}_2^+\\text{Cl}^-$ formed by $\\text{Ar-NH}_2 + \\text{HNO}_2$ at $0-5^\\circ\\text{C}$" },
    ],
    whenToUse: "Use for step-down synthesis of primary amines and Sandmeyer halogenation ($\text{CuCl}/\text{HCl}$, $\text{CuCN}$, $\text{KI}$).",
    commonMistake: "In Hinsberg test: $1^\\circ$ amine product dissolves in alkali; $2^\\circ$ amine product is INSOLUBLE in alkali; $3^\\circ$ amine does not react.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Amines", "Hoffmann Bromamide", "Diazonium", "Hinsberg"],
  },

  // 15. Biomolecules
  {
    id: "f-chem-bio-01",
    subject: "Chemistry",
    name: "Carbohydrates, Peptide Linkage & DNA/RNA Nucleotides",
    chapter: "Biomolecules",
    latex: "\\text{Glucose} \\xrightarrow{\\text{Br}_2/\\text{H}_2\\text{O}} \\text{Gluconic Acid}, \\quad \\text{Glucose} \\xrightarrow{\\text{conc. HNO}_3} \\text{Saccharic Acid}, \\quad -\\text{CO-NH}- \\quad (\\text{Peptide Bond})",
    variables: [
      { symbol: "D-(+)-\\text{Glucose}", meaning: "Aldohexose with 4 chiral carbon atoms ($2^4 = 16$ optical stereoisomers)" },
      { symbol: "-\\text{CO-NH}-", meaning: "Peptide linkage formed by condensation of $\\alpha$-amino acids with loss of $\\text{H}_2\\text{O}$" },
      { symbol: "\\text{Zwitterion}", meaning: "$^+\\text{H}_3\\text{N-CH(R)-COO}^-$ dipolar ionic form at isoelectric point" },
    ],
    whenToUse: "Use for protein primary/secondary/tertiary structures ($\alpha$-helix and $\beta$-pleated sheets stabilized by H-bonds) and DNA base pairing (A=T with 2 H-bonds, G$\\equiv$C with 3 H-bonds).",
    commonMistake: "During protein denaturation, secondary and tertiary structures are destroyed, but PRIMARY structure (peptide bonds) remains INTACT.",
    frequencyBadge: "Tested in 9 of last 10 shifts",
    priority: "High",
    tags: ["Biomolecules", "Glucose", "Peptide Bond", "Proteins"],
  },


  // =========================================================================
  // MATHEMATICS — FULL SYLLABUS COVERAGE (CBSE 12 & JEE MAIN)
  // =========================================================================

  // 1. Sets, Relations & Functions
  {
    id: "f-math-rel-01",
    subject: "Mathematics",
    name: "Equivalence Relations & Bijective Functions",
    chapter: "Relations and Functions",
    latex: "\\text{Equivalence} \\iff \\text{Reflexive } (a,a)\\in R \\;\\land\\; \\text{Symmetric } (a,b)\\in R \\Rightarrow (b,a)\\in R \\;\\land\\; \\text{Transitive}",
    variables: [
      { symbol: "f: A \\to B", meaning: "Function from set A to set B" },
      { symbol: "\\text{One-One (Injective)}", meaning: "$f(x_1) = f(x_2) \\implies x_1 = x_2$" },
      { symbol: "\\text{Onto (Surjective)}", meaning: "$\\text{Range}(f) = \\text{Codomain}(B)$" },
      { symbol: "\\text{Bijective}", meaning: "Both One-One and Onto $\\implies$ Inverse function $f^{-1}$ exists" },
    ],
    whenToUse: "Use for checking equivalence classes, domain/range of composite functions $(g \\circ f)(x)$, and finding functional inverses.",
    commonMistake: "A function $f(x) = x^2$ is NOT invertible on $\\mathbb{R}$, but IS bijective if domain is restricted to $[0, \\infty)$ and codomain is $[0, \\infty)$.",
    frequencyBadge: "Tested in 9 of last 10 shifts",
    priority: "High",
    tags: ["Relations", "Functions", "Bijective", "Equivalence"],
  },

  // 2. Inverse Trigonometric Functions
  {
    id: "f-math-itf-01",
    subject: "Mathematics",
    name: "Principal Value Branches & ITF Addition Formulas",
    chapter: "Inverse Trigonometric Functions",
    latex: "\\sin^{-1} x + \\cos^{-1} x = \\frac{\\pi}{2}, \\quad \\tan^{-1} x + \\tan^{-1} y = \\tan^{-1}\\left(\\frac{x + y}{1 - x y}\\right) \\quad (x y < 1)",
    variables: [
      { symbol: "\\sin^{-1} x", meaning: "Principal branch range $[-\\pi/2, \\pi/2]$, domain $[-1, 1]$" },
      { symbol: "\\cos^{-1} x", meaning: "Principal branch range $[0, \\pi]$, domain $[-1, 1]$" },
      { symbol: "\\tan^{-1} x", meaning: "Principal branch range $(-\\pi/2, \\pi/2)$, domain $\\mathbb{R}$" },
    ],
    whenToUse: "Use for simplifying trigonometric sums and solving inverse trig equations.",
    commonMistake: "If $x y > 1$ and $x, y > 0$, formula becomes $\\pi + \\tan^{-1}\\left(\\frac{x+y}{1-xy}\\right)$. Do not drop the $\\pi$.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["ITF", "Inverse Trig", "Principal Value"],
  },

  // 3. Matrices
  {
    id: "f-math-mat-01",
    subject: "Mathematics",
    name: "Matrix Multiplication, Symmetric/Skew-Symmetric & Inverse",
    chapter: "Matrices",
    latex: "A = \\frac{1}{2}(A + A^T) + \\frac{1}{2}(A - A^T), \\quad (A B)^T = B^T A^T, \\quad (A B)^{-1} = B^{-1} A^{-1}",
    variables: [
      { symbol: "A + A^T", meaning: "Symmetric matrix ($(P)^T = P$)" },
      { symbol: "A - A^T", meaning: "Skew-symmetric matrix ($(Q)^T = -Q$; all diagonal entries are 0)" },
      { symbol: "A^{-1}", meaning: "Inverse matrix ($A A^{-1} = I$)" },
    ],
    whenToUse: "Use for decomposing any square matrix into sum of symmetric and skew-symmetric components and solving matrix equations.",
    commonMistake: "Matrix multiplication is NOT commutative in general ($A B \\ne B A$). Reversal law applies to both transpose and inverse.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Matrices", "Matrix Inverse", "Transpose"],
  },

  // 4. Determinants
  {
    id: "f-math-det-01",
    subject: "Mathematics",
    name: "Adjoint Properties, Area of Triangle & Cramer's Rule",
    chapter: "Determinants",
    latex: "|\\text{adj}(A)| = |A|^{n-1}, \\quad |\\text{adj}(\\text{adj}(A))| = |A|^{(n-1)^2}, \\quad \\text{adj}(A B) = \\text{adj}(B) \\cdot \\text{adj}(A)",
    variables: [
      { symbol: "|A|", meaning: "Determinant of square matrix of order n" },
      { symbol: "\\text{adj}(A)", meaning: "Adjoint matrix (transpose of cofactor matrix)" },
      { symbol: "n", meaning: "Matrix dimension ($n=3$ for $3\\times 3$ matrices)" },
    ],
    whenToUse: "Use for solving systems of linear equations ($X = A^{-1} B = \\frac{1}{|A|}\\text{adj}(A) B$) and checking unique solution ($|A| \\ne 0$).",
    commonMistake: "For scalar $k$, $|k A| = k^n |A|$ (where $n$ is order of matrix). For $3 \\times 3$, $|2A| = 2^3 |A| = 8|A|$.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Determinants", "Adjoint", "Cramer Rule"],
  },

  // 5. Continuity and Differentiability
  {
    id: "f-math-cont-01",
    subject: "Mathematics",
    name: "Standard Derivatives, Chain Rule & L'Hôpital's Rule",
    chapter: "Continuity and Differentiability",
    latex: "\\frac{d}{dx}[\\ln|\\sec x + \\tan x|] = \\sec x, \\quad \\frac{d}{dx}[u^v] = u^v \\left(\\frac{v}{u} u' + v' \\ln u\\right), \\quad \\lim_{x\\to a}\\frac{f(x)}{g(x)} = \\lim_{x\\to a}\\frac{f'(x)}{g'(x)}",
    variables: [
      { symbol: "f'(x)", meaning: "Derivative representing instantaneous slope / rate of change" },
      { symbol: "u^v", meaning: "Logarithmic differentiation for variable-base variable-exponent terms" },
    ],
    whenToUse: "Use for checking continuity (LHL = RHL = $f(a)$), differentiability (LHD = RHD), and resolving $0/0$ or $\\infty/\\infty$ indeterminate forms.",
    commonMistake: "Differentiability IMPLIES continuity, but continuity does NOT imply differentiability (e.g. $f(x) = |x|$ is continuous at $x=0$ but not differentiable).",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Calculus", "Continuity", "Differentiation", "LHopital"],
  },

  // 6. Application of Derivatives
  {
    id: "f-math-aod-01",
    subject: "Mathematics",
    name: "Maxima/Minima, Tangent Slope & Increasing/Decreasing Tests",
    chapter: "Application of Derivatives",
    latex: "f'(x) > 0 \\implies \\text{Increasing}, \\quad f'(c) = 0 \\;\\land\\; f''(c) < 0 \\implies \\text{Local Maxima}, \\quad y - y_1 = f'(x_1)(x - x_1)",
    variables: [
      { symbol: "f'(c) = 0", meaning: "Critical points / stationary points" },
      { symbol: "f''(c)", meaning: "Second derivative curvature test ($f'' < 0$ local max; $f'' > 0$ local min)" },
      { symbol: "-1/f'(x_1)", meaning: "Slope of the normal line to curve at $(x_1, y_1)$" },
    ],
    whenToUse: "Use for optimization problems (maximum volume of cylinder in cone), rate of change word problems, and monotonicity intervals.",
    commonMistake: "If $f''(c) = 0$, second derivative test is inconclusive; must use first derivative sign test across $x = c$.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["AOD", "Maxima Minima", "Tangents"],
  },

  // 7. Integrals (Indefinite & Definite)
  {
    id: "f-math-int-01",
    subject: "Mathematics",
    name: "King's Property, Integration by Parts & Special Algebraic Forms",
    chapter: "Integrals",
    latex: "\\int_a^b f(x)\\,dx = \\int_a^b f(a + b - x)\\,dx, \\quad \\int \\frac{dx}{x^2 - a^2} = \\frac{1}{2a}\\ln\\left|\\frac{x - a}{x + a}\\right|, \\quad \\int e^x [f(x) + f'(x)]\\,dx = e^x f(x)",
    variables: [
      { symbol: "\\int_a^b f(x)dx", meaning: "Definite integral representing signed net area under curve" },
      { symbol: "a, b", meaning: "Lower and upper limits of integration" },
      { symbol: "e^x f(x)", meaning: "Standard exponential derivative identity" },
    ],
    whenToUse: "Use King's property for integrals like $\\int_0^{\\pi/2} \\frac{\\sin^n x}{\\sin^n x + \\cos^n x} dx = \\frac{\\pi}{4}$ and trigonometric substitutions.",
    commonMistake: "For even/odd functions on symmetric limits $[ -a, a]$: $\\int_{-a}^a f(x)dx = 0$ if $f(-x) = -f(x)$ (odd function).",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Integrals", "Definite Integrals", "King Property"],
  },

  // 8. Application of Integrals (Area Under Curve)
  {
    id: "f-math-aoi-01",
    subject: "Mathematics",
    name: "Area Enclosed by Parabolas, Lines & Standard Curves",
    chapter: "Application of Integrals",
    latex: "\\text{Area between } y^2 = 4ax \\text{ and } x^2 = 4by = \\frac{16 a b}{3}, \\quad \\text{Area} = \\int_a^b [y_{\\text{upper}}(x) - y_{\\text{lower}}(x)]\\,dx",
    variables: [
      { symbol: "\\text{Area}", meaning: "Total enclosed planar area between two bounding curves" },
      { symbol: "y_{\\text{upper}}", meaning: "Top boundary curve in terms of x" },
      { symbol: "y_{\\text{lower}}", meaning: "Bottom boundary curve in terms of x" },
    ],
    whenToUse: "Use for area bounded by parabolas, ellipses ($\\text{Area} = \\pi a b$), circles, and linear chord boundaries.",
    commonMistake: "Always find points of intersection first to determine exact integration limits $[a, b]$.",
    frequencyBadge: "Tested in 9 of last 10 shifts",
    priority: "High",
    tags: ["AOI", "Area Under Curve", "Definite Integrals"],
  },

  // 9. Differential Equations
  {
    id: "f-math-de-01",
    subject: "Mathematics",
    name: "Linear First-Order ODE & Homogeneous Equations",
    chapter: "Differential Equations",
    latex: "\\frac{dy}{dx} + P(x) y = Q(x) \\implies \\text{I.F.} = e^{\\int P(x)\\,dx}, \\quad y \\cdot (\\text{I.F.}) = \\int Q(x) \\cdot (\\text{I.F.})\\,dx + C",
    variables: [
      { symbol: "\\text{I.F.}", meaning: "Integrating Factor ($e^{\\int P(x)dx}$)" },
      { symbol: "P(x), Q(x)", meaning: "Continuous functions strictly of x (or constants)" },
      { symbol: "C", meaning: "Constant of integration (evaluated using initial boundary values)" },
    ],
    whenToUse: "Use for standard linear differential equations and homogeneous equations solved via substitution $y = v x \\implies \\frac{dy}{dx} = v + x \\frac{dv}{dx}$.",
    commonMistake: "Ensure leading coefficient of $\\frac{dy}{dx}$ is $+1$ before identifying $P(x)$ and $Q(x)$ (e.g. divide through by $x$ or $1-x^2$ first).",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Differential Equations", "Integrating Factor", "Calculus"],
  },

  // 10. Vector Algebra
  {
    id: "f-math-vec-01",
    subject: "Mathematics",
    name: "Dot Product, Cross Product & Vector Area of Triangle",
    chapter: "Vector Algebra",
    latex: "\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}| \\cos\\theta, \\quad \\vec{a} \\times \\vec{b} = |\\vec{a}||\\vec{b}| \\sin\\theta \\,\\hat{n}, \\quad \\text{Area}_{\\Delta} = \\frac{1}{2}|\\vec{a} \\times \\vec{b}|",
    variables: [
      { symbol: "\\vec{a}\\cdot\\vec{b}", meaning: "Scalar product (equals 0 iff vectors are perpendicular $\\vec{a} \\perp \\vec{b}$)" },
      { symbol: "\\vec{a}\\times\\vec{b}", meaning: "Vector cross product (equals $\\vec{0}$ iff vectors are parallel / collinear)" },
      { symbol: "\\text{Proj}_{\\vec{b}}(\\vec{a})", meaning: "Projection of $\\vec{a}$ on $\\vec{b} = \\frac{\\vec{a}\\cdot\\vec{b}}{|\\vec{b}|}$" },
    ],
    whenToUse: "Use for vector projections, finding unit vectors normal to two planes, and calculating torque / work.",
    commonMistake: "Cross product is ANTI-COMMUTATIVE: $\\vec{a} \\times \\vec{b} = -(\\vec{b} \\times \\vec{a})$.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Vectors", "Cross Product", "Dot Product"],
  },

  // 11. Three Dimensional Geometry
  {
    id: "f-math-3d-01",
    subject: "Mathematics",
    name: "Shortest Distance Between Skew Lines & Angle Between Lines",
    chapter: "Three Dimensional Geometry",
    latex: "d = \\frac{|(\\vec{a}_2 - \\vec{a}_1) \\cdot (\\vec{b}_1 \\times \\vec{b}_2)|}{|\\vec{b}_1 \\times \\vec{b}_2|}, \\quad \\cos\\theta = \\frac{|a_1 a_2 + b_1 b_2 + c_1 c_2|}{\\sqrt{a_1^2+b_1^2+c_1^2}\\sqrt{a_2^2+b_2^2+c_2^2}}",
    variables: [
      { symbol: "d", meaning: "Shortest perpendicular distance between non-parallel, non-intersecting lines in 3D" },
      { symbol: "\\vec{a}_1, \\vec{a}_2", meaning: "Passing point position vectors on Line 1 and Line 2" },
      { symbol: "\\vec{b}_1, \\vec{b}_2", meaning: "Direction ratio vectors parallel to Line 1 and Line 2" },
    ],
    whenToUse: "Use to find distance between skew lines, parallel line distance $d = \\frac{|(\\vec{a}_2 - \\vec{a}_1) \\times \\vec{b}|}{|\\vec{b}|}$, and coplanarity ($d=0$).",
    commonMistake: "If lines are parallel ($\\vec{b}_1 = \\vec{b}_2 = \\vec{b}$), you MUST use the parallel distance cross-product formula.",
    frequencyBadge: "Mandatory CBSE 5-Marker Derivation",
    priority: "High",
    tags: ["3D Geometry", "Skew Lines", "Direction Cosines"],
  },

  // 12. Linear Programming
  {
    id: "f-math-lpp-01",
    subject: "Mathematics",
    name: "Corner Point Method & Objective Function Optimization",
    chapter: "Linear Programming",
    latex: "Z = a x + b y \\quad (\\text{Maximize/Minimize subject to } \\sum a_i x + b_i y \\le c_i, \\; x, y \\ge 0)",
    variables: [
      { symbol: "Z", meaning: "Linear objective function to optimize" },
      { symbol: "(x, y)", meaning: "Corner points / vertices of the bounded feasible polygon region" },
    ],
    whenToUse: "Use for industrial profit maximization, diet cost minimization, and bounded vs unbounded feasible regions.",
    commonMistake: "For UNBOUNDED feasible regions, minimum/maximum $M$ is valid only if open half-plane $a x + b y < M$ (or $> M$) has NO common points with the feasible region.",
    frequencyBadge: "Guaranteed 5-mark board question",
    priority: "High",
    tags: ["LPP", "Linear Programming", "Optimization"],
  },

  // 13. Probability
  {
    id: "f-math-prob-01",
    subject: "Mathematics",
    name: "Bayes' Theorem, Conditional Probability & Total Probability",
    chapter: "Probability",
    latex: "P(E_i | A) = \\frac{P(E_i) \\cdot P(A | E_i)}{\\sum_{k=1}^n P(E_k) \\cdot P(A | E_k)}, \\quad P(A | B) = \\frac{P(A \\cap B)}{P(B)}",
    variables: [
      { symbol: "P(E_i | A)", meaning: "Posterior probability of partition / cause $E_i$ given event $A$ has occurred" },
      { symbol: "P(E_i)", meaning: "Prior probability of event $E_i$" },
      { symbol: "P(A | E_i)", meaning: "Conditional likelihood of observing $A$ under condition $E_i$" },
    ],
    whenToUse: "Use for multi-bag ball drawing, diagnostic test false positives, and independent events ($P(A \\cap B) = P(A) \\cdot P(B)$).",
    commonMistake: "For independent events: $P(A | B) = P(A)$ and $P(A \\cup B) = 1 - P(A') P(B')$.",
    frequencyBadge: "Tested in 10 of last 10 shifts",
    priority: "High",
    tags: ["Probability", "Bayes Theorem", "Conditional"],
  },

  // 14. Complex Numbers & Quadratic Equations (JEE Main)
  {
    id: "f-math-cplx-01",
    subject: "Mathematics",
    name: "Euler Form, De Moivre's Theorem & Cube Roots of Unity",
    chapter: "Complex Numbers & Quadratic Equations",
    latex: "z = r e^{i \\theta} = r(\\cos\\theta + i\\sin\\theta), \\quad 1 + \\omega + \\omega^2 = 0, \\quad \\omega^3 = 1, \\quad |z_1 + z_2| \\le |z_1| + |z_2|",
    variables: [
      { symbol: "r", meaning: "Modulus of complex number ($|z| = \\sqrt{x^2 + y^2}$)" },
      { symbol: "\\theta", meaning: "Principal argument ($-\\pi < \\text{Arg}(z) \\le \\pi$)" },
      { symbol: "\\omega", meaning: "Cube root of unity ($\\frac{-1 + i\\sqrt{3}}{2}$)" },
    ],
    whenToUse: "Use for rotating vectors in Argand plane ($z' = z e^{i\\alpha}$), geometric loci ($|z - z_0| = R$ circle), and symmetric polynomial roots.",
    commonMistake: "Triangle inequality: $||z_1| - |z_2|| \\le |z_1 \\pm z_2| \\le |z_1| + |z_2|$.",
    frequencyBadge: "Tested in 9 of last 10 JEE shifts",
    priority: "High",
    tags: ["Complex Numbers", "Euler Form", "Cube Roots"],
  },

  // 15. Coordinate Geometry & Conics (JEE Main)
  {
    id: "f-math-conic-01",
    subject: "Mathematics",
    name: "Conic Sections: Parabola, Ellipse & Hyperbola Standard Tangents",
    chapter: "Conic Sections (Parabola, Ellipse, Hyperbola)",
    latex: "y = m x + \\frac{a}{m} \\; (y^2=4ax), \\quad y = m x \\pm \\sqrt{a^2 m^2 + b^2} \\; \\left(\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1\\right), \\quad e_{\\text{ellipse}} = \\sqrt{1 - \\frac{b^2}{a^2}}",
    variables: [
      { symbol: "m", meaning: "Slope of the tangent line" },
      { symbol: "e", meaning: "Eccentricity ($e < 1$ for ellipse, $e > 1$ for hyperbola, $e = 1$ for parabola)" },
      { symbol: "a, b", meaning: "Semi-major and semi-minor axes" },
    ],
    whenToUse: "Use for condition of tangency $c = a/m$ for parabola and finding director circle loci ($x^2 + y^2 = a^2 + b^2$).",
    commonMistake: "For rectangular hyperbola ($x^2 - y^2 = a^2$ or $x y = c^2$), eccentricity is ALWAYS $e = \\sqrt{2}$.",
    frequencyBadge: "Tested in 10 of last 10 JEE shifts",
    priority: "High",
    tags: ["Conic Sections", "Parabola", "Ellipse", "Hyperbola"],
  }
];

export const CLASS_11_CHAPTERS = new Set<string>([
  // Physics (Class 11 - JEE only)
  "Units, Dimensions & Error Analysis",
  "Kinematics: 1D & 2D Motion",
  "Laws of Motion & Friction",
  "Work, Energy & Power",
  "System of Particles & Rotational Motion",
  "Gravitation & Satellite Dynamics",
  "Mechanical Properties of Solids & Fluids",
  "Thermodynamics & Kinetic Theory",
  "Oscillations & Waves",

  // Chemistry (Class 11 - JEE only)
  "Basic Concepts of Chemistry (Mole Concept)",
  "Atomic Structure & Quantum Mechanics",
  "Chemical Bonding & Molecular Structure",
  "Chemical Thermodynamics & Thermochemistry",
  "Chemical & Ionic Equilibrium",

  // Mathematics (Class 11 - JEE only)
  "Complex Numbers & Quadratic Equations",
  "Conic Sections (Parabola, Ellipse, Hyperbola)",
]);

export function getFormulasBySubjectAndExam(subject: string, examSlug: string): MasterFormulaItem[] {
  const normSub = subject.toLowerCase();
  let filtered = MASTER_FORMULA_DATABASE.filter((f) => f.subject.toLowerCase() === normSub);
  if (filtered.length === 0) {
    filtered = MASTER_FORMULA_DATABASE;
  }

  // If target is CBSE Class 12 Boards, strictly filter to Class 12 syllabus only!
  if (examSlug === "cbse-12") {
    filtered = filtered.filter((f) => !CLASS_11_CHAPTERS.has(f.chapter));
  }

  return filtered;
}
