/**
 * Case Studies Configuration
 *
 * Predefined company groupings that highlight interesting deal relationships.
 * Add new case studies here as you expand the database.
 */

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  companySlugs: string[];
  highlightColor: string; // Tailwind gradient or color class
  stats?: {
    label: string;
    value: string;
  }[];
  featured?: boolean;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'triangle',
    title: 'The AI Triangle',
    subtitle: 'OpenAI ↔ Microsoft ↔ NVIDIA',
    description:
      'Microsoft invests billions in OpenAI. OpenAI spends it on Microsoft Azure and NVIDIA GPUs. NVIDIA sells to Microsoft. The same money flows in circles—trace the loop yourself.',
    companySlugs: ['openai', 'microsoft', 'nvidia'],
    highlightColor: 'from-emerald-500 to-blue-500',
    stats: [
      { label: 'Investment', value: '$13B+' },
      { label: 'Companies', value: '3' },
      { label: 'Key Deals', value: '5' },
    ],
    featured: true,
  },
  // Add more case studies here as you expand the database
  // Example:
  // {
  //   id: 'stargate',
  //   title: 'Project Stargate',
  //   subtitle: 'The $500B AI Infrastructure Play',
  //   description: 'A massive AI infrastructure project...',
  //   companySlugs: ['openai', 'softbank', 'oracle', 'mgx'],
  //   highlightColor: 'from-purple-500 to-pink-500',
  //   stats: [
  //     { label: 'Investment', value: '$500B' },
  //     { label: 'Companies', value: '4' },
  //   ],
  // },
];

export function getCaseStudyById(id: string): CaseStudy | undefined {
  return CASE_STUDIES.find(cs => cs.id === id);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return CASE_STUDIES.filter(cs => cs.featured);
}
