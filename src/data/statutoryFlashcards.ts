import { StatutoryRule } from '../types';

export const STATUTORY_RULES: StatutoryRule[] = [
  {
    id: 'rule-1',
    regulationNo: 'Reg 153(2)',
    actOrRegulation: 'CMR 2017',
    category: 'Ventilation',
    title: 'Minimum Air Quantity Standards',
    summary: 'Minimum air delivered to every ventilating district in underground coal mines.',
    keyLimit: '≥ 6 m³/min per person in largest shift, OR ≥ 2.5 m³/min per tonne daily output'
  },
  {
    id: 'rule-2',
    regulationNo: 'Reg 153(3)',
    actOrRegulation: 'CMR 2017',
    category: 'Ventilation',
    title: 'Wet Bulb Temperature Limit',
    summary: 'Environmental temperature limits at underground coal mine faces.',
    keyLimit: 'Max 33.5 °C. If > 30.5 °C, air velocity must be ≥ 1.0 m/s'
  },
  {
    id: 'rule-3',
    regulationNo: 'Reg 169',
    actOrRegulation: 'CMR 2017',
    category: 'Ventilation',
    title: 'Permissible Inflammable Gas (CH4) Concentration',
    summary: 'Max methane allowable in return airways and general body of air.',
    keyLimit: '≤ 0.75% in district return, ≤ 1.25% in any other mine air current'
  },
  {
    id: 'rule-4',
    regulationNo: 'Reg 166',
    actOrRegulation: 'CMR 2017',
    category: 'Blasting & Explosives',
    title: 'Blasting Danger Zone Radius',
    summary: 'Safety exclusion zone cleared of all personnel during shotfiring in opencast mines.',
    keyLimit: 'Radius ≥ 300 meters from blast hole'
  },
  {
    id: 'rule-5',
    regulationNo: 'Reg 88',
    actOrRegulation: 'CMR 2017',
    category: 'Haulage & Winding',
    title: 'Factor of Safety for Winding Ropes',
    summary: 'Minimum safety factor for new headgear wire ropes hoisting personnel.',
    keyLimit: 'Factor of Safety ≥ 10 for persons, ≥ 8 for mineral/material only'
  },
  {
    id: 'rule-6',
    regulationNo: 'Reg 144',
    actOrRegulation: 'CMR 2017',
    category: 'Safety & Dust',
    title: 'Incombustible Dust (Stone Dusting) Percentage',
    summary: 'Minimum incombustible content of mine dust on roof, sides, and floor.',
    keyLimit: '≥ 75% incombustible matter (≥ 85% if volatile matter > 35%)'
  },
  {
    id: 'rule-7',
    regulationNo: 'Reg 111',
    actOrRegulation: 'CMR 2017',
    category: 'Management & Staff',
    title: 'Opencast Bench Height in Hard Rock',
    summary: 'Geometric limitation on bench heights in mechanized opencast mines.',
    keyLimit: 'Bench height ≤ Max digging reach/boom height of excavator'
  },
  {
    id: 'rule-8',
    regulationNo: 'Cir. 7/1997',
    actOrRegulation: 'DGMS Circular',
    category: 'Blasting & Explosives',
    title: 'Ground Vibration PPV Safe Thresholds',
    summary: 'Permissible Peak Particle Velocity for domestic residential structures.',
    keyLimit: '5 mm/s (< 8 Hz), 10 mm/s (8-25 Hz), 15 mm/s (> 25 Hz)'
  }
];
