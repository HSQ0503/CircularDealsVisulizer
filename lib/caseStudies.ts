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
  // Preset node positions for beautiful geometric layouts (keyed by company slug)
  nodePositions?: Record<string, { x: number; y: number }>;
}

// Layout constants
const RADIUS = 280;
const SQRT3_2 = Math.sqrt(3) / 2; // ~0.866 for equilateral triangles

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
    // Equilateral triangle: Microsoft top, OpenAI bottom-left, NVIDIA bottom-right
    nodePositions: {
      'microsoft': { x: 0, y: -RADIUS },
      'openai': { x: -RADIUS * SQRT3_2, y: RADIUS * 0.5 },
      'nvidia': { x: RADIUS * SQRT3_2, y: RADIUS * 0.5 },
    },
  },
  {
    id: 'stargate',
    title: 'Project Stargate',
    subtitle: 'OpenAI × SoftBank × Oracle',
    description:
      'A $500 billion bet on AI infrastructure. SoftBank funds it, OpenAI operates it, Oracle and NVIDIA build it. The biggest AI infrastructure project ever announced.',
    companySlugs: ['openai', 'softbank', 'oracle', 'nvidia'],
    highlightColor: 'from-purple-500 to-orange-500',
    stats: [
      { label: 'Commitment', value: '$500B' },
      { label: 'Companies', value: '4' },
      { label: 'Compute', value: '10 GW' },
    ],
    // Diamond: OpenAI top, Oracle right, NVIDIA bottom, SoftBank left
    nodePositions: {
      'openai': { x: 0, y: -RADIUS },
      'oracle': { x: RADIUS, y: 0 },
      'nvidia': { x: 0, y: RADIUS },
      'softbank': { x: -RADIUS, y: 0 },
    },
  },
  {
    id: 'anthropic-war',
    title: 'The Anthropic Proxy War',
    subtitle: 'Amazon vs Google',
    description:
      'Two cloud giants each invest billions in the same AI startup—then compete to be its cloud provider. The money flows in, then flows right back out as cloud spend.',
    companySlugs: ['amazon', 'google', 'anthropic'],
    highlightColor: 'from-orange-500 to-blue-500',
    stats: [
      { label: 'Investment', value: '$11B+' },
      { label: 'Valuation', value: '$61.5B' },
      { label: 'Revenue', value: '$7B run' },
    ],
    // Inverted triangle: Amazon top-left, Google top-right, Anthropic bottom center
    nodePositions: {
      'amazon': { x: -RADIUS * SQRT3_2, y: -RADIUS * 0.5 },
      'google': { x: RADIUS * SQRT3_2, y: -RADIUS * 0.5 },
      'anthropic': { x: 0, y: RADIUS },
    },
  },
  {
    id: 'coreweave-loop',
    title: 'The GPU Cloud Loop',
    subtitle: 'CoreWeave × NVIDIA × OpenAI',
    description:
      'NVIDIA invests in CoreWeave. CoreWeave buys NVIDIA GPUs. NVIDIA buys back $6.3B of compute. OpenAI signs a $12B contract. The same chips, endlessly resold.',
    companySlugs: ['coreweave', 'nvidia', 'microsoft', 'openai'],
    highlightColor: 'from-lime-500 to-purple-500',
    stats: [
      { label: 'GPU Fleet', value: '250K+' },
      { label: 'Debt', value: '$14.5B' },
      { label: 'IPO Value', value: '$35B' },
    ],
    // Square: NVIDIA top-left, OpenAI top-right, Microsoft bottom-right, CoreWeave bottom-left
    nodePositions: {
      'nvidia': { x: -RADIUS * 0.7, y: -RADIUS * 0.7 },
      'openai': { x: RADIUS * 0.7, y: -RADIUS * 0.7 },
      'microsoft': { x: RADIUS * 0.7, y: RADIUS * 0.7 },
      'coreweave': { x: -RADIUS * 0.7, y: RADIUS * 0.7 },
    },
  },
];

export function getCaseStudyById(id: string): CaseStudy | undefined {
  return CASE_STUDIES.find(cs => cs.id === id);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return CASE_STUDIES.filter(cs => cs.featured);
}
