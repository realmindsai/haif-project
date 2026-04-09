export interface InterventionRow {
  id: string;
  label: string;
  invasiveness: 'Non-invasive' | 'Needle-based' | 'Mixed';
  evidence: string;
  cost: string;
  training: string;
  advantages: string[];
  disadvantages: string[];
  effectiveness: string[];
}

export const interventionComparison: InterventionRow[] = [
  {
    id: 'manualAcupressure',
    label: 'Manual Acupressure',
    invasiveness: 'Non-invasive',
    evidence: 'Practical low-cost option with reduced nausea and vomiting in the legacy source.',
    cost: 'No equipment',
    training: 'Low',
    advantages: ['Avoids needles', 'Requires no equipment', 'Easily trained staff'],
    disadvantages: ['Effectiveness varies by practitioner skill', 'Legacy source offered less detail than other modalities'],
    effectiveness: [
      'Lee et al., 2015: nausea reduced from 45% to 30% (RR 0.71, 95% CI 0.62-0.81).',
      'Lee et al., 2015: vomiting reduced from 30% to 18% (RR 0.60, 95% CI 0.50-0.73).',
    ],
  },
  {
    id: 'transcutaneousElectrostimulation',
    label: 'Transcutaneous Electrostimulation',
    invasiveness: 'Non-invasive',
    evidence: 'Strong non-invasive option with adjustable stimulation and extended-use potential.',
    cost: '$40-$200 equipment',
    training: 'Moderate',
    advantages: ['Can be used over extended periods', 'Adjustable intensity', 'Avoids needles'],
    disadvantages: ['Requires equipment', 'Requires staff training'],
    effectiveness: [
      'Legacy source describes it as the strongest non-invasive stimulation option.',
      'Lee et al., 2015 pooled PC6 evidence: nausea reduced from 45% to 30% and vomiting reduced from 30% to 18%.',
    ],
  },
  {
    id: 'auricularAcupuncture',
    label: 'Auricular Acupuncture',
    invasiveness: 'Needle-based',
    evidence: 'Procedure-specific evidence in gynaecological surgery and laparoscopic cholecystectomy.',
    cost: 'Few cents per needle or bead',
    training: 'Moderate',
    advantages: [
      'Economical',
      'Individualized point selection',
      'Low risk of misplaced needles',
      'Remote from most surgical sites',
    ],
    disadvantages: ['Requires staff training or a qualified acupuncturist'],
    effectiveness: [
      'Huang et al., 2005: effective following gynaecological surgery.',
      'Kim et al., 2003: effective following gynaecological surgery.',
      'Sahmeddini and Fazelzadeh, 2008: effective following laparoscopic cholecystectomy.',
    ],
  },
  {
    id: 'needleAcupuncture',
    label: 'Body Acupuncture',
    invasiveness: 'Needle-based',
    evidence: 'Direct body acupuncture with clear reductions in nausea, vomiting, and total PONV.',
    cost: '$0.05 per needle',
    training: 'Moderate',
    advantages: [
      'Economical',
      'Individualized point selection',
      'Strong reduction when PC6 is paired with additional points',
    ],
    disadvantages: [
      'Requires staff training or a qualified acupuncturist',
      'Requires monitoring for misplaced needles',
    ],
    effectiveness: [
      'Lee et al., 2015: nausea reduced from 54% to 29% (RR 0.56, 95% CI 0.39-0.80).',
      'Lee et al., 2015: vomiting reduced from 41% to 20% (RR 0.51, 95% CI 0.34-0.76).',
      'Cheong et al., 2013: PC6 plus other acupoints reduced PONV from 21% to 6% (RR 0.29, 95% CI 0.17-0.49).',
    ],
  },
  {
    id: 'electroAcupuncture',
    label: 'Electroacupuncture',
    invasiveness: 'Needle-based',
    evidence: 'Body acupuncture with adjustable electrical stimulus and reusable stimulation units.',
    cost: '$200-$800 equipment plus needles',
    training: 'Moderate',
    advantages: [
      'Reusable stimulation units',
      'Adjustable intensity',
      'Individualized point selection',
      'Strong combined-point evidence',
    ],
    disadvantages: [
      'Requires staff training or a qualified acupuncturist',
      'Requires equipment purchase',
      'Requires monitoring for misplaced needles',
    ],
    effectiveness: [
      'Legacy source describes outcomes as equivalent to body acupuncture with easier stimulus control.',
      'Cheong et al., 2013 combined-point evidence: PONV reduced from 21% to 6% (RR 0.29, 95% CI 0.17-0.49).',
    ],
  },
  {
    id: 'bandOrPatch',
    label: 'Acupressure Band or Patch',
    invasiveness: 'Non-invasive',
    evidence: 'Improves nausea, vomiting, and rescue antiemetic use with low training burden.',
    cost: 'About $5 AUD',
    training: 'Low',
    advantages: ['Extended use', 'No infection risk', 'Flexible delivery', 'Can continue at home'],
    disadvantages: [
      'Not suitable for some wrist sizes or injuries',
      'Can be awkward with multiple IV or arterial lines',
    ],
    effectiveness: [
      'Shiao and Dune, 2006: nausea reduced from 36% to 24%.',
      'Shiao and Dune, 2006: vomiting reduced from 20% to 15%.',
      'Shiao and Dune, 2006: rescue antiemetics reduced from 22% to 13%.',
    ],
  },
  {
    id: 'pc6AllModalities',
    label: 'PC6 Acupoint Stimulation (All Modalities)',
    invasiveness: 'Mixed',
    evidence: 'Strong pooled effect across modalities with mild transient side effects.',
    cost: 'Varies by modality',
    training: 'Moderate',
    advantages: [
      'Equivalent effectiveness to common antiemetics',
      'Mild transient side effects',
      'Can be combined with antiemetics for additional benefit',
    ],
    disadvantages: ['Requires staff training or a qualified acupuncturist'],
    effectiveness: [
      'Lee et al., 2015: nausea reduced from 47% to 31%.',
      'Lee et al., 2015: vomiting reduced from 33% to 19%.',
      'Lee et al., 2015: rescue antiemetics reduced from 33% to 20%.',
    ],
  },
];
