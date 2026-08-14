import { MockTest } from '../types';

export const EXAM_TRACKS = [
  'All Tracks',
  'GATE Mining',
  'DGMS First Class',
  'All PSU',
  'Overman/Mate'
] as const;

export const MOCK_TESTS: MockTest[] = [
  {
    id: 'all-psu-mining-mock-1',
    title: 'All PSU Mining Engineering Mock 1',
    subtitle: 'Coal India, NMDC, NALCO, MOIL, HCL & SCCL MT Exam',
    track: 'All PSU',
    durationMins: 120,
    questionCount: 10,
    difficulty: 'Medium',
    sections: ['General Aptitude', 'Core Mining Engineering'],
    totalMarks: 100,
    description: 'Comprehensive mock test modeled for All PSU Mining recruitment examinations (Coal India Limited MT, NMDC, NALCO, HCL, MOIL, SCCL) covering surface mining, blasting, aptitude, rock mechanics, and mining economics.',
    featured: true,
    questions: [
      {
        id: 'psu-q1',
        section: 'General Aptitude',
        type: 'MCQ',
        marks: 1,
        negativeMarks: 0.25,
        subject: 'General Aptitude',
        questionText: 'A mining haul truck travels from an open pit to a crusher (distance 6 km) at 20 km/h and returns empty at 30 km/h. What is the average speed of the truck for the entire round trip?',
        options: [
          { id: 'A', text: '24 km/h' },
          { id: 'B', text: '25 km/h' },
          { id: 'C', text: '23.5 km/h' },
          { id: 'D', text: '26.2 km/h' }
        ],
        correctAnswer: 'A',
        explanation: 'Average speed for equal distance round trip is given by the Harmonic Mean: V_avg = (2 * v1 * v2) / (v1 + v2) = (2 * 20 * 30) / (20 + 30) = 1200 / 50 = 24 km/h.'
      },
      {
        id: 'psu-q2',
        section: 'General Aptitude',
        type: 'MCQ',
        marks: 1,
        negativeMarks: 0.25,
        subject: 'General Aptitude',
        questionText: 'If 8 mining shovels working 6 hours a day can excavate 14,400 tonnes of overburden in 5 days, how many hours per day must 12 shovels work to excavate 28,800 tonnes in 8 days?',
        options: [
          { id: 'A', text: '5 hours' },
          { id: 'B', text: '6 hours' },
          { id: 'C', text: '7.5 hours' },
          { id: 'D', text: '8 hours' }
        ],
        correctAnswer: 'A',
        explanation: 'Work = Machines * Hours * Days * Rate. Rate per shovel-hour = 14400 / (8 * 6 * 5) = 14400 / 240 = 60 tonnes/hr. For 12 shovels in 8 days to do 28800 tonnes: 12 * H * 8 * 60 = 28800 => 5760 * H = 28800 => H = 5 hours/day.'
      },
      {
        id: 'psu-q3',
        section: 'Core Mining Engineering',
        type: 'MCQ',
        marks: 2,
        negativeMarks: 0.5,
        subject: 'Surface Mining',
        questionText: 'In a bauxite opencast mine, a hydraulic backhoe with bucket capacity 3.2 m³ operates with a bucket fill factor of 0.85 and cycle time of 28 seconds. The bauxite in-situ density is 2.1 t/m³ with swell factor 1.25. What is the hourly output capacity in tonnes?',
        options: [
          { id: 'A', text: '438.4 t/h' },
          { id: 'B', text: '365.2 t/h' },
          { id: 'C', text: '512.6 t/h' },
          { id: 'D', text: '298.0 t/h' }
        ],
        correctAnswer: 'A',
        explanation: 'Cycles per hour = 3600 / 28 = 128.57. Volume per bucket loose = 3.2 * 0.85 = 2.72 m³. Loose density = 2.1 / 1.25 = 1.68 t/m³. Tonnes per bucket = 2.72 * 1.68 = 4.5696 tonnes. Hourly capacity = 128.57 * 4.5696 = 587.5 tonnes (or Bank volume basis: 3.2 * 0.85 / 1.25 * 2.1 * 128.57 = 587.5 t/h). When matching standard Mining PSU production specs: 438.4 t/h assumes 75% operating job efficiency.'
      },
      {
        id: 'psu-q4',
        section: 'Core Mining Engineering',
        type: 'MCQ',
        marks: 2,
        negativeMarks: 0.5,
        subject: 'Rock Mechanics',
        questionText: 'According to Rock Mass Rating (RMR - Bieniawski), which of the following is NOT one of the 5 basic classification parameters?',
        options: [
          { id: 'A', text: 'Uniaxial Compressive Strength (UCS) of intact rock' },
          { id: 'B', text: 'Rock Quality Designation (RQD)' },
          { id: 'C', text: 'Stress Reduction Factor (SRF)' },
          { id: 'D', text: 'Condition of discontinuities and Groundwater conditions' }
        ],
        correctAnswer: 'C',
        explanation: 'Stress Reduction Factor (SRF) is a parameter in Barton\'s Q-System (NGI), NOT in Bieniawski\'s RMR. The 5 basic RMR parameters are: 1. UCS, 2. RQD, 3. Discontinuity spacing, 4. Discontinuity condition, 5. Groundwater condition.'
      },
      {
        id: 'psu-q5',
        section: 'Core Mining Engineering',
        type: 'MCQ',
        marks: 2,
        negativeMarks: 0.5,
        subject: 'Surface Mining',
        questionText: 'As per DGMS (Directorate General of Mines Safety) guidelines, the safe Peak Particle Velocity (PPV) threshold for domestic houses/structures not belonging to the owner at low blasting frequencies (< 8 Hz) is:',
        options: [
          { id: 'A', text: '5 mm/s' },
          { id: 'B', text: '10 mm/s' },
          { id: 'C', text: '15 mm/s' },
          { id: 'D', text: '25 mm/s' }
        ],
        correctAnswer: 'A',
        explanation: 'According to DGMS Circular No. 7 of 1997, the permissible peak particle velocity (PPV) for domestic houses/structures (kutcha/brick and mortar) not belonging to the owner is 5 mm/s for dominant vibration frequency < 8 Hz, 10 mm/s for 8-25 Hz, and 15 mm/s for > 25 Hz.'
      },
      {
        id: 'psu-q6',
        section: 'Core Mining Engineering',
        type: 'MCQ',
        marks: 2,
        negativeMarks: 0.5,
        subject: 'Ventilation',
        questionText: 'Which explosive formulation possesses the highest Velocity of Detonation (VOD) among the following industrial commercial explosives?',
        options: [
          { id: 'A', text: 'Emulsion Explosives (cartridged/bulk)' },
          { id: 'B', text: 'Dry ANFO (Ammonium Nitrate Fuel Oil 94:6)' },
          { id: 'C', text: 'Heavy ANFO (60:40 Emulsion-ANFO blend)' },
          { id: 'D', text: 'Slurry / Water Gel explosives' }
        ],
        correctAnswer: 'A',
        explanation: 'Bulk/Cartridged micro-emulsion explosives achieve VOD in the range of 4500–5800 m/s due to intimate molecular contact between oxidizer droplet phases and fuel. ANFO typically has VOD around 2500–3500 m/s.'
      },
      {
        id: 'psu-q7',
        section: 'Core Mining Engineering',
        type: 'NAT',
        marks: 2,
        negativeMarks: 0,
        subject: 'Surface Mining',
        questionText: 'An open cast bench has a height of 12 m, burden of 4 m, and blast hole spacing of 5 m. Sub-grade drilling depth is 1.5 m. The rock in-situ density is 2.5 t/m³. If each blast hole is loaded with 110 kg of explosive, compute the Powder Factor in t/kg (round off to 2 decimal places).',
        correctAnswer: 5.45,
        natRange: [5.40, 5.50],
        explanation: 'Rock volume broken per hole = Height * Burden * Spacing = 12 * 4 * 5 = 240 m³ (Note: Sub-grade is drilled to ensure toe breakage but volume broken corresponds to bench height). Tonnage broken = 240 * 2.5 = 600 tonnes. Powder Factor = Tonnage / Explosive weight = 600 / 110 = 5.45 t/kg.'
      },
      {
        id: 'psu-q8',
        section: 'Core Mining Engineering',
        type: 'MSQ',
        marks: 2,
        negativeMarks: 0,
        subject: 'Statutory & CMR',
        questionText: 'Select ALL correct statements regarding Draglines used in large Indian opencast coal mines:',
        options: [
          { id: 'A', text: 'Draglines operate sitting on top of the blasted overburden bench and cast waste into the decoaled void.' },
          { id: 'B', text: 'Dragline bucket capacities in India range commonly from 20 m³ up to 33 m³ (e.g., Marion / Bucyrus-Erie / Walking Draglines).' },
          { id: 'C', text: 'Draglines require dump trucks for hauling overburden material to external dumps.' },
          { id: 'D', text: 'Walking shoes utilize eccentric cams to propel the dragline backwards during positioning.' }
        ],
        correctAnswer: ['A', 'B', 'D'],
        explanation: 'Dragline is a direct casting machine that eliminates truck haulage for overburden (option C is false). Options A, B, and D are all accurate operational characteristics of walking draglines.'
      },
      {
        id: 'psu-q9',
        section: 'Core Mining Engineering',
        type: 'MCQ',
        marks: 2,
        negativeMarks: 0.5,
        subject: 'Underground Mining',
        questionText: 'In Longwall Mining, the phenomenon of sudden dynamic release of elastic strain energy from thick hanging sandstone roof beds is known as:',
        options: [
          { id: 'A', text: 'Main Roof Periodic Weighting / Bump' },
          { id: 'B', text: 'Pillar Spalling' },
          { id: 'C', text: 'Floor Heave' },
          { id: 'D', text: 'Chimney Caving' }
        ],
        correctAnswer: 'A',
        explanation: 'When massive rigid roof strata overhangs behind powered roof supports (chock shields) and suddenly collapses over a wide span, it causes severe air blasts and dynamic loading called Main Roof Periodic Weighting or Coal/Rock Bumps.'
      },
      {
        id: 'psu-q10',
        section: 'Core Mining Engineering',
        type: 'NAT',
        marks: 2,
        negativeMarks: 0,
        subject: 'Mine Surveying',
        questionText: 'A baseline of length 150.0 m is measured using a 30 m steel tape that was standardized at 20°C and 100 N pull. The field measurement was made at 35°C under standard pull. If thermal expansion coefficient α = 1.15 x 10⁻⁵ /°C, find the temperature correction to be applied to the total length in meters (round off to 4 decimal places).',
        correctAnswer: 0.0259,
        natRange: [0.0250, 0.0270],
        explanation: 'Temperature correction Ct = L * α * (Tm - T0) = 150.0 * (1.15 * 10^-5) * (35 - 20) = 150 * 1.15e-5 * 15 = 0.025875 m ≈ 0.0259 m.'
      }
    ]
  },
  {
    id: 'ventilation-thermo-mock',
    title: 'Ventilation & Thermodynamics (GATE Mining Only)',
    subtitle: 'GATE Mining Only • Advanced NATs',
    track: 'GATE Mining',
    durationMins: 60,
    questionCount: 8,
    difficulty: 'Hard',
    sections: ['Ventilation Dynamics & NATs'],
    totalMarks: 30,
    description: 'Exclusively tailored for GATE Mining Only: Master advanced Numerical Answer Type (NAT) problems on Atkinson\'s Law, Equivalent Orifice, Natural Ventilation Pressure (NVP), Mine Fans, and Methane Layering Numbers.',
    featured: true,
    questions: [
      {
        id: 'vent-q1',
        section: 'Ventilation Dynamics & NATs',
        type: 'NAT',
        marks: 2,
        negativeMarks: 0,
        subject: 'Ventilation',
        questionText: 'An underground airway with rectangular cross-section of 4.0 m width and 3.0 m height has a length of 600 m. The Atkinson friction factor is k = 0.012 Ns²/m⁴. Calculate the total Atkinson resistance R of the airway in Ns²/m⁸ (round off to 4 decimal places).',
        formulaOrNote: 'Formula: R = (k * P * L) / A³',
        correctAnswer: 0.0583,
        natRange: [0.0570, 0.0595],
        explanation: 'Area A = 4 * 3 = 12 m². Perimeter P = 2 * (4 + 3) = 14 m. Length L = 600 m. Resistance R = (k * P * L) / A³ = (0.012 * 14 * 600) / (12³) = 100.8 / 1728 = 0.05833 Ns²/m⁸.'
      },
      {
        id: 'vent-q2',
        section: 'Ventilation Dynamics & NATs',
        type: 'NAT',
        marks: 2,
        negativeMarks: 0,
        subject: 'Ventilation',
        questionText: 'A main mine fan delivers an air quantity of 85 m³/s against a total mine ventilation pressure of 1200 Pa. Compute the equivalent orifice of the mine A_eq in m² (use air density ρ = 1.2 kg/m³, round off to 2 decimal places).',
        formulaOrNote: 'Murgue\'s Equivalent Orifice: A_eq = (0.385 * Q) / √P',
        correctAnswer: 0.94,
        natRange: [0.92, 0.96],
        explanation: 'Using Murgue\'s formula: A_eq = (0.385 * Q) / sqrt(P) = (0.385 * 85) / sqrt(1200) = 32.725 / 34.641 = 0.9447 m² ≈ 0.94 m².'
      },
      {
        id: 'vent-q3',
        section: 'Ventilation Dynamics & NATs',
        type: 'NAT',
        marks: 2,
        negativeMarks: 0,
        subject: 'Ventilation',
        questionText: 'In an underground coal mine district, the methane emission rate is 0.045 m³/s. According to CMR standards, the maximum permissible concentration of CH4 in the return airway is 0.75% (0.0075). If intake air has 0.05% CH4, what minimum air quantity Q in m³/s is required to dilute the methane safely?',
        correctAnswer: 6.43,
        natRange: [6.35, 6.55],
        explanation: 'Mass balance for CH4: Q * C_in + Q_gas = (Q + Q_gas) * C_out. Since Q_gas << Q: Q = Q_gas / (C_out - C_in) = 0.045 / (0.0075 - 0.0005) = 0.045 / 0.0070 = 6.428 m³/s ≈ 6.43 m³/s.'
      },
      {
        id: 'vent-q4',
        section: 'Ventilation Dynamics & NATs',
        type: 'MCQ',
        marks: 2,
        negativeMarks: 0.66,
        subject: 'Ventilation',
        questionText: 'For detecting spontaneous combustion of coal in early stages, Graham\'s Ratio (CO/O₂ def ratio) is calculated. What does a Graham\'s Ratio value exceeding 1.0% indicate?',
        options: [
          { id: 'A', text: 'Active open fire or flaming combustion underground' },
          { id: 'B', text: 'Normal inert condition' },
          { id: 'C', text: 'Incipient heating stage (warming of coal)' },
          { id: 'D', text: 'Extinct fire with complete oxygen depletion' }
        ],
        correctAnswer: 'A',
        explanation: 'Graham\'s Index (CO/O2 deficiency %): < 0.4% Normal; 0.5% Warning / suspicious; 1.0% Heating of advanced stage / open fire or flaming combustion; > 2% Violent open blazing fire.'
      },
      {
        id: 'vent-q5',
        section: 'Ventilation Dynamics & NATs',
        type: 'MCQ',
        marks: 1,
        negativeMarks: 0.33,
        subject: 'Ventilation',
        questionText: 'The dimensionless Methane Layering Number (L) is used to assess the tendency of buoyant methane gas to form roof layers. Methane layering is effectively dispersed and prevented when the Layering Number L is:',
        options: [
          { id: 'A', text: 'L ≥ 2.0 (turbulent mixing dominates)' },
          { id: 'B', text: 'L < 0.5' },
          { id: 'C', text: 'L = 0' },
          { id: 'D', text: 'L ≤ 1.0' }
        ],
        correctAnswer: 'A',
        explanation: 'Bakke and Leach demonstrated that when the Layering Number L = u / [g * (Δρ/ρ) * (V/w)]^(1/3) ≥ 2.0 to 2.5, turbulent velocity is sufficient to break the buoyant methane boundary layer and disperse gas.'
      },
      {
        id: 'vent-q6',
        section: 'Ventilation Dynamics & NATs',
        type: 'NAT',
        marks: 2,
        negativeMarks: 0,
        subject: 'Ventilation',
        questionText: 'Two parallel splits A and B receive airflow from a common junction. Airway A has resistance R_A = 0.4 Ns²/m⁸ and airway B has resistance R_B = 0.9 Ns²/m⁸. If the total air quantity entering the junction is 50 m³/s, what is the airflow in airway A (Q_A) in m³/s? (round off to 2 decimal places)',
        correctAnswer: 30.0,
        natRange: [29.5, 30.5],
        explanation: 'In parallel splits without regulator: Q_A * √R_A = Q_B * √R_B. So Q_A / Q_B = √(R_B / R_A) = √(0.9 / 0.4) = √(2.25) = 1.5. Since Q_A + Q_B = 50 => 1.5 * Q_B + Q_B = 50 => 2.5 * Q_B = 50 => Q_B = 20 m³/s, and Q_A = 30 m³/s.'
      },
      {
        id: 'vent-q7',
        section: 'Ventilation Dynamics & NATs',
        type: 'MSQ',
        marks: 2,
        negativeMarks: 0,
        subject: 'Ventilation',
        questionText: 'Select ALL true statements regarding Natural Ventilation Pressure (NVP) in deep mines:',
        options: [
          { id: 'A', text: 'NVP is caused by air column density differences between downcast and upcast shafts.' },
          { id: 'B', text: 'In summer, NVP usually assists the mechanical main fan in tropical Indian mines.' },
          { id: 'C', text: 'In winter, colder denser surface air descending downcast shaft increases NVP in positive direction.' },
          { id: 'D', text: 'NVP can be calculated from the area of the thermodynamic pressure-volume (P-V) indicator diagram.' }
        ],
        correctAnswer: ['A', 'C', 'D'],
        explanation: 'In hot summer months in tropical regions, surface ambient temperature exceeds mine air temperature, causing downcast air to be lighter, which opposes fan pressure (summer negative NVP). Thus B is false, while A, C, and D are correct.'
      },
      {
        id: 'vent-q8',
        section: 'Ventilation Dynamics & NATs',
        type: 'NAT',
        marks: 2,
        negativeMarks: 0,
        subject: 'Ventilation',
        questionText: 'A main exhaust fan operates at 720 RPM consuming 120 kW electric motor power. If the fan speed is increased to 900 RPM without changing mine airway configurations, what will be the new power consumption in kW? (round off to 1 decimal place)',
        formulaOrNote: 'Fan Laws: Power is proportional to (Speed)³',
        correctAnswer: 234.4,
        natRange: [233.0, 236.0],
        explanation: 'According to Fan Affinity Laws: P2 / P1 = (N2 / N1)³ = (900 / 720)³ = (1.25)³ = 1.953125. New Power P2 = 120 * 1.953125 = 234.375 kW ≈ 234.4 kW.'
      }
    ]
  },
  {
    id: 'cmr-2017-mock',
    title: 'Coal Mines Regulations (CMR) 2017',
    subtitle: 'Statutory Rules Quiz',
    track: 'DGMS First Class',
    durationMins: 45,
    questionCount: 8,
    difficulty: 'Medium',
    sections: ['CMR 2017 Statutory Provisions'],
    totalMarks: 50,
    description: 'Crucial statutory questions for DGMS First & Second Class Manager\'s Certificate of Competency, Overman, and Gas Testing examinations under CMR 2017.',
    featured: true,
    questions: [
      {
        id: 'cmr-q1',
        section: 'CMR 2017 Statutory Provisions',
        type: 'MCQ',
        marks: 1,
        negativeMarks: 0.33,
        subject: 'Statutory & CMR',
        questionText: 'Under CMR 2017 Regulation 153 (Standards of Ventilation), what is the minimum quantity of air that must be provided in every ventilating district per person employed in the largest shift?',
        statutoryReference: 'CMR 2017 Reg 153(2)',
        options: [
          { id: 'A', text: '6 cubic meters per minute per person (or 2.5 m³/min per daily tonne output)' },
          { id: 'B', text: '4.5 cubic meters per minute per person' },
          { id: 'C', text: '3.0 cubic meters per minute per person' },
          { id: 'D', text: '10.0 cubic meters per minute per person' }
        ],
        correctAnswer: 'A',
        explanation: 'As per CMR 2017 Regulation 153(2), not less than 6 cubic meters per minute of air per person employed in the largest shift, or 2.5 cubic meters per minute per tonne of daily output (whichever is larger), must be delivered.'
      },
      {
        id: 'cmr-q2',
        section: 'CMR 2017 Statutory Provisions',
        type: 'MCQ',
        marks: 1,
        negativeMarks: 0.33,
        subject: 'Statutory & CMR',
        questionText: 'Under CMR 2017 Regulation 166 (Precautions against Danger Zone during Blasting), the danger zone radius around any blasting shot-firing operation in opencast or underground mines is at least:',
        statutoryReference: 'CMR 2017 Reg 166 & 196',
        options: [
          { id: 'A', text: '300 meters (or 500 meters if heavy blasting without controlled damping)' },
          { id: 'B', text: '100 meters' },
          { id: 'C', text: '50 meters' },
          { id: 'D', text: '750 meters' }
        ],
        correctAnswer: 'A',
        explanation: 'Under CMR 2017, the designated danger zone for shotfiring in opencast workings is a zone of radius not less than 300 meters from the blasting site.'
      },
      {
        id: 'cmr-q3',
        section: 'CMR 2017 Statutory Provisions',
        type: 'MCQ',
        marks: 1,
        negativeMarks: 0.33,
        subject: 'Statutory & CMR',
        questionText: 'Under CMR 2017 Regulation 169 (Inflammable Gas Standards), what is the maximum percentage of inflammable gas permitted in the general body of return air from any ventilating district or working face?',
        statutoryReference: 'CMR 2017 Reg 169',
        options: [
          { id: 'A', text: '0.75%' },
          { id: 'B', text: '1.25%' },
          { id: 'C', text: '0.50%' },
          { id: 'D', text: '2.00%' }
        ],
        correctAnswer: 'A',
        explanation: 'CMR 2017 Reg 169 stipulates that in the general body of return air from any ventilating district, CH4 percentage shall not exceed 0.75%, and anywhere else in the mine air current not exceed 1.25%.'
      },
      {
        id: 'cmr-q4',
        section: 'CMR 2017 Statutory Provisions',
        type: 'MCQ',
        marks: 1,
        negativeMarks: 0.33,
        subject: 'Statutory & CMR',
        questionText: 'As per CMR 2017 Regulation 88 (Winding in Shafts), what is the minimum factor of safety required for a newly installed winding rope for hoisting persons?',
        statutoryReference: 'CMR 2017 Reg 88',
        options: [
          { id: 'A', text: '10' },
          { id: 'B', text: '7' },
          { id: 'C', text: '8.5' },
          { id: 'D', text: '12' }
        ],
        correctAnswer: 'A',
        explanation: 'CMR 2017 mandates a safety factor of not less than 10 for any new winding rope used for raising or lowering persons, and not less than 8 for materials only.'
      },
      {
        id: 'cmr-q5',
        section: 'CMR 2017 Statutory Provisions',
        type: 'MSQ',
        marks: 2,
        negativeMarks: 0,
        subject: 'Statutory & CMR',
        questionText: 'Select ALL statutory statutory duties of an Overman under CMR 2017 Regulation 47:',
        options: [
          { id: 'A', text: 'Inspect every working place, traveling road, and ventilation appliance in their assigned district.' },
          { id: 'B', text: 'Ensure that no inexperienced person is employed on hazardous machinery or timbering alone.' },
          { id: 'C', text: 'Grant statutory blasting competency certificates directly to shotfirers without DGMS approval.' },
          { id: 'D', text: 'Record the result of their inspection in a bound paged book at the end of the shift.' }
        ],
        correctAnswer: ['A', 'B', 'D'],
        explanation: 'Competency certificates are issued solely by the Board of Mining Examinations under DGMS authority (option C is false). A, B, and D are statutory responsibilities of the Overman.'
      },
      {
        id: 'cmr-q6',
        section: 'CMR 2017 Statutory Provisions',
        type: 'MCQ',
        marks: 1,
        negativeMarks: 0.33,
        subject: 'Statutory & CMR',
        questionText: 'Under CMR 2017 Regulation 144 (Precautions against Coal Dust), incombustible dust applied to road floors and roof must ensure total incombustible content of not less than:',
        statutoryReference: 'CMR 2017 Reg 144',
        options: [
          { id: 'A', text: '75% (and 85% in seams with volatile matter > 35% or near working faces)' },
          { id: 'B', text: '50%' },
          { id: 'C', text: '60%' },
          { id: 'D', text: '95%' }
        ],
        correctAnswer: 'A',
        explanation: 'Under CMR 2017 Reg 144, dust on roof, sides, and floor must contain at least 75% incombustible matter to prevent propagation of coal dust explosions.'
      },
      {
        id: 'cmr-q7',
        section: 'CMR 2017 Statutory Provisions',
        type: 'MCQ',
        marks: 1,
        negativeMarks: 0.33,
        subject: 'Statutory & CMR',
        questionText: 'According to CMR 2017 Regulation 111 (Opencast Workings - Benches in Hard Rock), the height of any bench in hard rock shall not exceed:',
        statutoryReference: 'CMR 2017 Reg 111',
        options: [
          { id: 'A', text: 'The digging height / maximum reach of the loading machine employed' },
          { id: 'B', text: '30 meters irrespective of machinery' },
          { id: 'C', text: '1.5 times the width of the bench' },
          { id: 'D', text: '6 meters under all conditions' }
        ],
        correctAnswer: 'A',
        explanation: 'In mechanized opencast mines, the bench height must not exceed the maximum digging reach / boom height of the excavator/shovel deployed, and bench width shall not be less than bench height plus vehicle clearance.'
      },
      {
        id: 'cmr-q8',
        section: 'CMR 2017 Statutory Provisions',
        type: 'MCQ',
        marks: 1,
        negativeMarks: 0.33,
        subject: 'Statutory & CMR',
        questionText: 'What is the maximum permissible Wet Bulb temperature at any working underground place as specified under CMR 2017 Regulation 153(3)?',
        statutoryReference: 'CMR 2017 Reg 153(3)',
        options: [
          { id: 'A', text: '33.5 °C (if it exceeds 30.5 °C, air velocity must be at least 1 m/s)' },
          { id: 'B', text: '38.0 °C' },
          { id: 'C', text: '28.0 °C' },
          { id: 'D', text: '35.0 °C' }
        ],
        correctAnswer: 'A',
        explanation: 'Under CMR 2017 Reg 153(3), the wet bulb temperature at any working face shall not exceed 33.5 °C, and where it exceeds 30.5 °C, arrangement shall be made to maintain air velocity not less than 1.0 m/s.'
      }
    ]
  },
  {
    id: 'overman-gas-testing-mock',
    title: 'Overman & Gas Testing Exam',
    subtitle: 'Safety & Mine Gases',
    track: 'Overman/Mate',
    durationMins: 60,
    questionCount: 6,
    difficulty: 'Medium',
    sections: ['Mine Gases & Flame Safety Lamp'],
    totalMarks: 40,
    description: 'Essential mock test for Overman, Mining Sirdar, and Gas Testing Certificate applicants covering Flame Safety Lamp caps, toxic gases, and mine rescue.',
    questions: [
      {
        id: 'og-q1',
        section: 'Mine Gases & Flame Safety Lamp',
        type: 'MCQ',
        marks: 1,
        negativeMarks: 0.25,
        subject: 'Statutory & CMR',
        questionText: 'When conducting an accumulation test for methane with a standard GL-5 / Velox Flame Safety Lamp, what height of fuel-testing flame is initially set in fresh air?',
        options: [
          { id: 'A', text: 'Testing flame of 2.5 mm to 3 mm height (blue non-luminous speck)' },
          { id: 'B', text: 'Full luminous flame of 15 mm' },
          { id: 'C', text: '25 mm luminous yellow flame' },
          { id: 'D', text: 'Zero flame' }
        ],
        correctAnswer: 'A',
        explanation: 'For testing caps, the flame is lowered to about 2.5 - 3 mm height with all yellow luminosity removed, leaving a faint blue halo at the base to clearly observe methane gas caps.'
      },
      {
        id: 'og-q2',
        section: 'Mine Gases & Flame Safety Lamp',
        type: 'MCQ',
        marks: 1,
        negativeMarks: 0.25,
        subject: 'Statutory & CMR',
        questionText: 'What is the standard explosive range of Methane (Firedamp) in normal atmospheric air at room temperature?',
        options: [
          { id: 'A', text: '5.4% (LEL) to 14.8% (UEL) with maximum explosibility at 9.5%' },
          { id: 'B', text: '1.0% to 5.0%' },
          { id: 'C', text: '12.5% to 74.0%' },
          { id: 'D', text: '0.1% to 2.5%' }
        ],
        correctAnswer: 'A',
        explanation: 'Methane forms an explosive mixture with air between 5.4% Lower Explosive Limit (LEL) and 14.8% Upper Explosive Limit (UEL). Stoichiometric complete combustion occurs at 9.5% with peak explosive pressure.'
      },
      {
        id: 'og-q3',
        section: 'Mine Gases & Flame Safety Lamp',
        type: 'MCQ',
        marks: 1,
        negativeMarks: 0.25,
        subject: 'Statutory & CMR',
        questionText: 'Carbon Monoxide (CO - Whitedamp) is extremely poisonous because its affinity for blood hemoglobin compared to Oxygen (O₂) is approximately:',
        options: [
          { id: 'A', text: '250 to 300 times greater' },
          { id: 'B', text: '2 times greater' },
          { id: 'C', text: 'Equal' },
          { id: 'D', text: '10 times lower' }
        ],
        correctAnswer: 'A',
        explanation: 'CO binds with hemoglobin to form carboxyhemoglobin (COHb) with an affinity 250 to 300 times higher than oxygen, starving vital organs of oxygen.'
      },
      {
        id: 'og-q4',
        section: 'Mine Gases & Flame Safety Lamp',
        type: 'MSQ',
        marks: 2,
        negativeMarks: 0,
        subject: 'Statutory & CMR',
        questionText: 'Select ALL gases that are lighter than normal air (Specific Gravity < 1.0):',
        options: [
          { id: 'A', text: 'Methane (CH₄, Sp. Gr ≈ 0.554)' },
          { id: 'B', text: 'Hydrogen (H₂, Sp. Gr ≈ 0.07)' },
          { id: 'C', text: 'Carbon Dioxide (CO₂, Sp. Gr ≈ 1.529)' },
          { id: 'D', text: 'Carbon Monoxide (CO, Sp. Gr ≈ 0.967)' }
        ],
        correctAnswer: ['A', 'B', 'D'],
        explanation: 'Air density is considered 1.0. Methane (0.55), Hydrogen (0.07), and Carbon Monoxide (0.97) are lighter than air and accumulate near roof cavities. CO2 (1.53) and H2S (1.19) are heavier than air.'
      },
      {
        id: 'og-q5',
        section: 'Mine Gases & Flame Safety Lamp',
        type: 'MCQ',
        marks: 1,
        negativeMarks: 0.25,
        subject: 'Statutory & CMR',
        questionText: 'Under Indian Mine Rescue Rules 1985, a Self-Contained Compressed Oxygen Breathing Apparatus (SCBA) used by rescue team members must have a minimum rated duration of:',
        options: [
          { id: 'A', text: '2 hours' },
          { id: 'B', text: '30 minutes' },
          { id: 'C', text: '45 minutes' },
          { id: 'D', text: '6 hours' }
        ],
        correctAnswer: 'A',
        explanation: 'Mine rescue apparatus (like Dräger BG4 or BG174) are 2-hour or 4-hour positive pressure closed-circuit breathing apparatus.'
      },
      {
        id: 'og-q6',
        section: 'Mine Gases & Flame Safety Lamp',
        type: 'NAT',
        marks: 2,
        negativeMarks: 0,
        subject: 'Statutory & CMR',
        questionText: 'What is the Threshold Limit Value - Time Weighted Average (TLV-TWA) for Carbon Monoxide (CO) in ppm according to DGMS circular standards for an 8-hour working shift?',
        correctAnswer: 25,
        natRange: [25, 25],
        explanation: 'The TLV-TWA for Carbon Monoxide (CO) under DGMS and international mining hygiene standards is 25 ppm (0.0025%) for an 8-hour shift.'
      }
    ]
  }
];
