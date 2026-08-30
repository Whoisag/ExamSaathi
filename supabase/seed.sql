-- ==============================================================================
-- ExamSaathi Comprehensive Seed Data: Exams, Chapters, Topics
-- ==============================================================================

-- 1. SEED EXAMS
insert into public.exams (code, slug, name, conductor, description, total_marks, duration_minutes, format)
values
  (
    'JEE_MAIN',
    'jee-main',
    'JEE Main 2026',
    'NTA',
    'Joint Entrance Examination (Main) for undergraduate engineering admissions across NITs, IIITs, and CFTIs.',
    300,
    180,
    '{"sections": ["Physics", "Chemistry", "Mathematics"], "questionsPerSection": 25, "marksPerQuestion": 4}'::jsonb
  ),
  (
    'JEE_ADVANCED',
    'jee-advanced',
    'JEE Advanced 2026',
    'IIT',
    'Premier entrance exam for admission into the 23 Indian Institutes of Technology (IITs).',
    360,
    360,
    '{"sections": ["Physics", "Chemistry", "Mathematics"], "papers": 2, "durationPerPaper": 180}'::jsonb
  ),
  (
    'NEET',
    'neet',
    'NEET UG 2026',
    'NTA',
    'National Eligibility cum Entrance Test for undergraduate medical admissions across India.',
    720,
    200,
    '{"sections": ["Physics", "Chemistry", "Biology"], "questionsPerSection": 45, "marksPerQuestion": 4}'::jsonb
  ),
  (
    'CBSE_12',
    'cbse-12',
    'CBSE Class 12 Boards',
    'CBSE',
    'Senior School Certificate Examination conducted by Central Board of Secondary Education.',
    100,
    180,
    '{"sections": ["Theory", "Practical"], "theoryMarks": 70, "practicalMarks": 30}'::jsonb
  ),
  (
    'CBSE_10',
    'cbse-10',
    'CBSE Class 10 Boards',
    'CBSE',
    'Secondary School Examination for standard 10 board certification.',
    100,
    180,
    '{"sections": ["Science", "Mathematics", "Social Science", "Languages"]}'::jsonb
  ),
  (
    'CUET',
    'cuet',
    'CUET UG 2026',
    'NTA',
    'Common University Entrance Test for admission to central and state universities in India.',
    250,
    45,
    '{"sections": ["Language", "Domain Subjects", "General Test"]}'::jsonb
  )
on conflict (slug) do update set
  name = excluded.name,
  conductor = excluded.conductor,
  total_marks = excluded.total_marks,
  duration_minutes = excluded.duration_minutes,
  format = excluded.format;

-- Helper to link exam_id for newly inserted exams
update public.chapters c
set exam_id = e.id
from public.exams e
where c.exam_slug = e.slug and c.exam_id is null;

-- 2. SEED CHAPTERS & TOPICS VIA CTEs

-- -----------------------------------------------------------------------------
-- JEE MAIN: PHYSICS CHAPTERS & TOPICS
-- -----------------------------------------------------------------------------
with e as (select id, slug from public.exams where slug = 'jee-main')
insert into public.chapters (exam_id, exam_slug, code, name, subject, ncert_chapter_number, syllabus_weight)
select e.id, e.slug, ch.code, ch.name, ch.subject, ch.ncert, ch.weight
from e, (values
  ('modern-physics', 'Modern Physics & Dual Nature', 'physics', 11, 1.35),
  ('phy-current-electricity', 'Current Electricity & Circuit Theorems', 'physics', 3, 1.25),
  ('phy-thermodynamics', 'Thermodynamics & Kinetic Theory', 'physics', 12, 1.20),
  ('phy-electrostatics', 'Electrostatics & Capacitors', 'physics', 1, 1.15),
  ('phy-optics', 'Ray Optics & Optical Instruments', 'physics', 9, 1.10),
  ('phy-magnetism', 'Moving Charges & Magnetism', 'physics', 4, 1.05),
  ('phy-emi-ac', 'Electromagnetic Induction & AC', 'physics', 6, 1.00),
  ('phy-rotational-motion', 'System of Particles & Rotational Motion', 'physics', 7, 0.95),
  ('phy-kinematics', 'Kinematics & Projectile Motion', 'physics', 3, 0.90),
  ('phy-work-energy-power', 'Work, Energy & Power', 'physics', 6, 0.85),
  ('phy-laws-of-motion', 'Laws of Motion & Friction', 'physics', 5, 0.85),
  ('phy-gravitation', 'Gravitation & Orbital Dynamics', 'physics', 8, 0.80),
  ('phy-oscillations-waves', 'Oscillations & Mechanical Waves', 'physics', 14, 0.80)
) as ch(code, name, subject, ncert, weight)
on conflict (exam_slug, code) do update set
  name = excluded.name,
  syllabus_weight = excluded.syllabus_weight;

-- JEE MAIN: CHEMISTRY CHAPTERS
with e as (select id, slug from public.exams where slug = 'jee-main')
insert into public.chapters (exam_id, exam_slug, code, name, subject, ncert_chapter_number, syllabus_weight)
select e.id, e.slug, ch.code, ch.name, ch.subject, ch.ncert, ch.weight
from e, (values
  ('chemical-bonding', 'Chemical Bonding & Molecular Structure', 'chemistry', 4, 1.30),
  ('chem-coordination', 'Coordination Compounds & CFT', 'chemistry', 9, 1.25),
  ('chem-general-organic', 'General Organic Chemistry & Resonance', 'chemistry', 12, 1.25),
  ('chem-thermodynamics', 'Chemical Thermodynamics & Enthalpy', 'chemistry', 6, 1.15),
  ('chem-electrochemistry', 'Electrochemistry & Redox Reactions', 'chemistry', 3, 1.10),
  ('chem-carbonyl-compounds', 'Aldehydes, Ketones & Carboxylic Acids', 'chemistry', 12, 1.10),
  ('chem-equilibrium', 'Equilibrium & Ionic Solutions', 'chemistry', 7, 1.05),
  ('chem-hydrocarbons', 'Hydrocarbons & Alkyl Halides', 'chemistry', 13, 0.95),
  ('chem-solutions', 'Solutions & Colligative Properties', 'chemistry', 2, 0.90),
  ('chem-kinetics', 'Chemical Kinetics & Rate Laws', 'chemistry', 4, 0.85)
) as ch(code, name, subject, ncert, weight)
on conflict (exam_slug, code) do update set
  name = excluded.name,
  syllabus_weight = excluded.syllabus_weight;

-- JEE MAIN: MATHEMATICS CHAPTERS
with e as (select id, slug from public.exams where slug = 'jee-main')
insert into public.chapters (exam_id, exam_slug, code, name, subject, ncert_chapter_number, syllabus_weight)
select e.id, e.slug, ch.code, ch.name, ch.subject, ch.ncert, ch.weight
from e, (values
  ('integral-calculus', 'Definite Integration & Area Under Curves', 'mathematics', 7, 1.35),
  ('vectors-3d', 'Vector Algebra & 3D Geometry', 'mathematics', 10, 1.30),
  ('matrices-determinants', 'Matrices & System of Linear Equations', 'mathematics', 3, 1.20),
  ('math-conic-sections', 'Conic Sections: Parabola, Ellipse, Hyperbola', 'mathematics', 11, 1.15),
  ('math-calculus-derivatives', 'Application of Derivatives & Tangents', 'mathematics', 6, 1.10),
  ('probability-statistics', 'Probability Distribution & Statistics', 'mathematics', 13, 1.05),
  ('complex-numbers', 'Complex Numbers & Quadratic Equations', 'mathematics', 5, 0.95),
  ('sequences-series', 'Sequences & Series: AP, GP, Special Series', 'mathematics', 9, 0.90),
  ('differential-equations', 'Differential Equations & Integrating Factors', 'mathematics', 9, 0.85)
) as ch(code, name, subject, ncert, weight)
on conflict (exam_slug, code) do update set
  name = excluded.name,
  syllabus_weight = excluded.syllabus_weight;

-- -----------------------------------------------------------------------------
-- NEET: BIOLOGY CHAPTERS
-- -----------------------------------------------------------------------------
with e as (select id, slug from public.exams where slug = 'neet')
insert into public.chapters (exam_id, exam_slug, code, name, subject, ncert_chapter_number, syllabus_weight)
select e.id, e.slug, ch.code, ch.name, ch.subject, ch.ncert, ch.weight
from e, (values
  ('genetics-evolution', 'Principles of Inheritance & Molecular Genetics', 'biology', 5, 1.45),
  ('human-physiology', 'Human Physiology: Circulation, Respiration & Neural', 'biology', 16, 1.40),
  ('cell-biology', 'Cell: The Unit of Life & Cell Cycle Division', 'biology', 8, 1.25),
  ('plant-physiology', 'Plant Physiology: Photosynthesis & Respiration', 'biology', 11, 1.15),
  ('ecology-environment', 'Ecology, Biodiversity & Conservation', 'biology', 13, 1.10),
  ('biotechnology', 'Biotechnology: Principles & Applications', 'biology', 11, 1.05),
  ('reproduction', 'Human Reproduction & Reproductive Health', 'biology', 3, 0.95)
) as ch(code, name, subject, ncert, weight)
on conflict (exam_slug, code) do update set
  name = excluded.name,
  syllabus_weight = excluded.syllabus_weight;

-- -----------------------------------------------------------------------------
-- CBSE 12 CHAPTERS
-- -----------------------------------------------------------------------------
with e as (select id, slug from public.exams where slug = 'cbse-12')
insert into public.chapters (exam_id, exam_slug, code, name, subject, ncert_chapter_number, syllabus_weight)
select e.id, e.slug, ch.code, ch.name, ch.subject, ch.ncert, ch.weight
from e, (values
  ('modern-physics', 'Dual Nature, Atoms & Nuclei', 'physics', 11, 1.30),
  ('cbse-current-electricity', 'Current Electricity & Potentiometer', 'physics', 3, 1.20),
  ('cbse-optics', 'Wave Optics & Huygens Principle', 'physics', 10, 1.15),
  ('chemical-bonding', 'Coordination Compounds & d-Block Elements', 'chemistry', 9, 1.20),
  ('integral-calculus', 'Integrals & Differential Equations', 'mathematics', 7, 1.30)
) as ch(code, name, subject, ncert, weight)
on conflict (exam_slug, code) do update set
  name = excluded.name,
  syllabus_weight = excluded.syllabus_weight;

-- -----------------------------------------------------------------------------
-- 3. SEED TOPICS FOR KEY CHAPTERS
-- -----------------------------------------------------------------------------

-- Topics for Modern Physics (JEE Main)
insert into public.topics (chapter_id, name, subtopic_order, syllabus_weight)
select c.id, t.name, t.ord, t.weight
from public.chapters c, (values
  ('Photoelectric Effect & Einsteins Work Function', 1, 1.35),
  ('De Broglie Wavelength & Davisson-Germer Experiment', 2, 1.20),
  ('Bohrs Model of Hydrogen Atom & Spectral Series', 3, 1.30),
  ('Radioactive Decay Law, Half-Life & Activity', 4, 1.15),
  ('Nuclear Fission, Fusion & Binding Energy per Nucleon', 5, 1.10),
  ('X-Ray Spectra & Moseleys Law', 6, 0.90)
) as t(name, ord, weight)
where c.exam_slug = 'jee-main' and c.code = 'modern-physics'
on conflict do nothing;

-- Topics for Current Electricity (JEE Main)
insert into public.topics (chapter_id, name, subtopic_order, syllabus_weight)
select c.id, t.name, t.ord, t.weight
from public.chapters c, (values
  ('Drift Velocity, Current Density & Ohms Law', 1, 1.10),
  ('Kirchhoffs Current & Voltage Laws in Complex Circuits', 2, 1.40),
  ('Meter Bridge & Balanced Wheatstone Bridge', 3, 1.25),
  ('Potentiometer: EMF Comparison & Internal Resistance', 4, 1.20),
  ('RC Circuits: Charging and Discharging Time Constants', 5, 1.15),
  ('Temperature Dependence of Resistance & Color Coding', 6, 0.90)
) as t(name, ord, weight)
where c.exam_slug = 'jee-main' and c.code = 'phy-current-electricity'
on conflict do nothing;

-- Topics for Chemical Bonding (JEE Main)
insert into public.topics (chapter_id, name, subtopic_order, syllabus_weight)
select c.id, t.name, t.ord, t.weight
from public.chapters c, (values
  ('VSEPR Theory & Molecular Geometry Prediction', 1, 1.25),
  ('Hybridization ($sp, sp^2, sp^3, sp^3d, sp^3d^2$)', 2, 1.30),
  ('Molecular Orbital Theory & Bond Order Calculation', 3, 1.40),
  ('Dipole Moment & Percentage Ionic Character', 4, 1.10),
  ('Hydrogen Bonding (Inter & Intra-molecular) Impacts', 5, 1.05),
  ('Fajans Rules for Covalent Character in Ionic Compounds', 6, 1.00)
) as t(name, ord, weight)
where c.exam_slug = 'jee-main' and c.code = 'chemical-bonding'
on conflict do nothing;

-- Topics for Coordination Compounds (JEE Main)
insert into public.topics (chapter_id, name, subtopic_order, syllabus_weight)
select c.id, t.name, t.ord, t.weight
from public.chapters c, (values
  ('IUPAC Nomenclature of Mononuclear & Polynuclear Complexes', 1, 1.20),
  ('Geometrical & Optical Isomerism in Coordination Complexes', 2, 1.35),
  ('Crystal Field Theory: $\Delta_o$ and $\Delta_t$ Splitting', 3, 1.40),
  ('Valence Bond Theory: Inner vs Outer Orbital Complexes', 4, 1.10),
  ('Magnetic Moments & Spin-Only Formula ($\sqrt{n(n+2)}$ BM)', 5, 1.25),
  ('Synergic Bonding in Metal Carbonyls', 6, 1.05)
) as t(name, ord, weight)
where c.exam_slug = 'jee-main' and c.code = 'chem-coordination'
on conflict do nothing;

-- Topics for Integral Calculus (JEE Main)
insert into public.topics (chapter_id, name, subtopic_order, syllabus_weight)
select c.id, t.name, t.ord, t.weight
from public.chapters c, (values
  ('Definite Integrals using Kings Rule & Periodic Properties', 1, 1.45),
  ('Leibnitz Rule of Differentiation Under Integral Sign', 2, 1.30),
  ('Area Bounded Between Curves & Straight Lines', 3, 1.35),
  ('Integration by Parts & Special Reduction Formulae', 4, 1.15),
  ('Limits as Sum of Integrals (Riemann Sum Formation)', 5, 1.20),
  ('Homogeneous & Linear First-Order Differential Equations', 6, 1.25)
) as t(name, ord, weight)
where c.exam_slug = 'jee-main' and c.code = 'integral-calculus'
on conflict do nothing;

-- Topics for Vectors & 3D Geometry (JEE Main)
insert into public.topics (chapter_id, name, subtopic_order, syllabus_weight)
select c.id, t.name, t.ord, t.weight
from public.chapters c, (values
  ('Scalar & Vector Triple Products with Geometric Interpretation', 1, 1.30),
  ('Shortest Distance Between Two Skew Lines', 2, 1.40),
  ('Equation of Line in Vector and Cartesian Forms', 3, 1.25),
  ('Intersection of Lines, Coplanarity & Distance from Point', 4, 1.30),
  ('Projections and Angle Bisectors in Three Dimensions', 5, 1.10)
) as t(name, ord, weight)
where c.exam_slug = 'jee-main' and c.code = 'vectors-3d'
on conflict do nothing;

-- Topics for Genetics & Evolution (NEET)
insert into public.topics (chapter_id, name, subtopic_order, syllabus_weight)
select c.id, t.name, t.ord, t.weight
from public.chapters c, (values
  ('Mendelian Dihybrid Crosses & Non-Allelic Interactions', 1, 1.40),
  ('Linkage, Recombination & Chromosome Mapping', 2, 1.35),
  ('DNA Replication: Meselson-Stahl & Semiconservative Machinery', 3, 1.45),
  ('Transcription, RNA Processing & Genetic Code Degeneracy', 4, 1.40),
  ('Translation & Regulation of Gene Expression (Lac Operon)', 5, 1.35),
  ('Pedigree Analysis & Chromosomal Disorders (Down, Turner, Kline)', 6, 1.25)
) as t(name, ord, weight)
where c.exam_slug = 'neet' and c.code = 'genetics-evolution'
on conflict do nothing;

-- Topics for Human Physiology (NEET)
insert into public.topics (chapter_id, name, subtopic_order, syllabus_weight)
select c.id, t.name, t.ord, t.weight
from public.chapters c, (values
  ('Cardiac Cycle, ECG Waveforms & Blood Pressure Regulation', 1, 1.40),
  ('Oxygen-Hemoglobin Dissociation Curve & Carbon Dioxide Transport', 2, 1.35),
  ('Mechanism of Urine Formation & Counter-Current System', 3, 1.40),
  ('Transmission of Nerve Impulses & Synaptic Cleft Action', 4, 1.30),
  ('Sliding Filament Theory of Muscle Contraction & Calcium Role', 5, 1.25),
  ('Endocrine Regulation: Pituitary, Thyroid & Adrenal Feedback Loops', 6, 1.30)
) as t(name, ord, weight)
where c.exam_slug = 'neet' and c.code = 'human-physiology'
on conflict do nothing;

-- Topics for Modern Physics (CBSE 12)
insert into public.topics (chapter_id, name, subtopic_order, syllabus_weight)
select c.id, t.name, t.ord, t.weight
from public.chapters c, (values
  ('Photoelectric Effect Laws & Einstein Equation Derivation', 1, 1.30),
  ('Bohr Hydrogen Spectral Lines & Energy Level Diagrams', 2, 1.25),
  ('Nuclear Density, Mass Defect & Packing Fraction', 3, 1.15),
  ('Semiconductor Diodes: IV Characteristics & Full Wave Rectifier', 4, 1.40)
) as t(name, ord, weight)
where c.exam_slug = 'cbse-12' and c.code = 'modern-physics'
on conflict do nothing;
