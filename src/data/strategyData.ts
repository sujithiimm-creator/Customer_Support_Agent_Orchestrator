export interface StrategyMetric {
  label: string;
  before: string;
  target: string;
  unit: string;
  status: 'critical' | 'improving' | 'achieved';
  description: string;
}

export interface ValueWaterfallItem {
  category: string;
  amount: string;
  type: 'cost' | 'saving' | 'revenue';
  detail: string;
}

export const STRATEGY_METRICS: StrategyMetric[] = [
  {
    label: 'Complaint Resolution Time',
    before: '18.4 Days',
    target: '6.0 Days',
    unit: 'days',
    status: 'improving',
    description: 'Manual drafting takes 60-70% of time. Agentic drafting cuts handle time from 41m to 12m.'
  },
  {
    label: 'Customer Satisfaction (CSAT)',
    before: '58%',
    target: '82%',
    unit: '%',
    status: 'improving',
    description: 'Complaints CSAT lifted from 58% to 82%, Vulnerable cases CSAT from 67% to 78%.'
  },
  {
    label: 'Annual Revenue at Risk',
    before: '$45.0M',
    target: '$13.5M',
    unit: 'USD',
    status: 'critical',
    description: 'Service-driven churn accounts for 40% of 11% annual retail churn. Intercepted via Wave 3 prediction.'
  },
  {
    label: 'Cost Per Interaction',
    before: '$10.00',
    target: '$4.05',
    unit: 'USD',
    status: 'improving',
    description: 'Deflection of 132K routine enquiries/mo + payments automation lowers average cost across 685K volume.'
  },
  {
    label: 'CFPB Escalation YoY Growth',
    before: '+38%',
    target: '-15%',
    unit: '%',
    status: 'critical',
    description: 'Proactive regulatory drafting and 24h complaint response stops CFPB formal examination risk.'
  },
  {
    label: 'Contact Centre Annual Attrition',
    before: '27%',
    target: '15%',
    unit: '%',
    status: 'improving',
    description: 'Early reskilling into AI Case Supervisor roles transforms fear into empowerment, protecting governance talent.'
  }
];

export const VALUE_WATERFALL: ValueWaterfallItem[] = [
  { category: '3-Year Program Investment', amount: '-$57.0M', type: 'cost', detail: 'Wave 1 ($11M), Wave 2 ($29M), Wave 3 ($17M). Token costs <1%.' },
  { category: 'Routine Enquiry Deflection', amount: '+$25.5M', type: 'saving', detail: '132K monthly human contacts deflected via Tier 1 improved intent routing.' },
  { category: 'Payments Automation Savings', amount: '+$18.6M', type: 'saving', detail: 'Proactive push notifications eliminate 84K monthly status inquiry calls.' },
  { category: 'Complaint Handle Time (-71%)', amount: '+$14.7M', type: 'saving', detail: 'Drafting time reduced from 25 min to 3 min review per case.' },
  { category: 'Fraud Inbound Call Reduction', amount: '+$9.2M', type: 'saving', detail: 'Push-confirm workflow resolves 70% of fraud alerts without human calls.' },
  { category: 'Staff Attrition Cost Reduction', amount: '+$11.2M', type: 'saving', detail: 'Lower recruitment & onboarding costs as attrition drops from 27% to 15%.' },
  { category: 'Regulatory Remediation Savings', amount: '+$14.7M', type: 'saving', detail: 'Eliminating manual remediation and audit compliance penalties.' },
  { category: 'Service Churn Retention', amount: '+$40.5M', type: 'revenue', detail: '30% capture of $45M/yr revenue at risk via Service Recovery Paradox.' },
  { category: 'New Relationship Revenue', amount: '+$50.0M', type: 'revenue', detail: 'Post-resolution cooling window triggers appropriate cross-sell offers.' },
  { category: 'SMB Cross-Sell Uplift', amount: '+$8.0M', type: 'revenue', detail: '3-5x revenue per relationship across 90K small business clients.' }
];

export const TECH_TIERS_INFO = [
  {
    tier: 'Tier 1 — Workflow Automation & Intent Routing',
    tokenCost: '$0.00 / Zero Tokens',
    volumeShare: '72% of total volume (412K Enquiries + 188K Payments)',
    techType: 'NLU, Pattern Matching, Workflow Triggers, Push Notifications',
    description: 'Deterministic rules, zero hallucination risk. Handles balance checks, wire status push, and simple self-serve.'
  },
  {
    tier: 'Tier 2 — RAG Policy Retrieval (RFC)',
    tokenCost: '~$0.001 / Query',
    volumeShare: 'Retrieval on all complaints & regulatory inquiries',
    techType: 'Vector Embeddings, Semantic Search, Document Citation',
    description: 'Retrieves verified policy documents with source citations. Cheap, deterministic, and 100% auditable.'
  },
  {
    tier: 'Tier 3 — Generative AI with SHAP Explainability',
    tokenCost: '~$5.00 / Complaint Case',
    volumeShare: '21.5K Complaints/mo + 12K Fraud Evidence Summaries',
    techType: 'Gemini 3.6 Flash, Feature Attribution (SHAP), Draft Synthesis',
    description: 'Generates plain-language complaint letters and evidence briefs. Every output features SHAP explainability.'
  },
  {
    tier: 'Tier 4 — Agentic Multi-Step Workflow Orchestration',
    tokenCost: 'Complex Workflow Token Allocation',
    volumeShare: 'Orchestrates Complaint Agent, Fraud Agent, Payments Agent',
    techType: 'Autonomous State Machines, Goal-Directed Execution, HITL Gateways',
    description: 'Agent evaluates goal, gathers context, calls RAG, triggers Gen AI, and presents package to Human Operator.'
  },
  {
    tier: 'Tier 5 — Human Only (Zero Autonomous AI Adjudication)',
    tokenCost: 'N/A (Human Specialist Time)',
    volumeShare: '9,800 Vulnerable Cases/mo + High-Stakes Escalations',
    techType: 'Intake Scoring & Routing ONLY -> 100% Certified Specialist Handling',
    description: 'AI scores distress & routes within 60s with a pre-loaded briefing. Interaction and decision are 100% human.'
  }
];

export const FOUR_TENSIONS_RESOLVED = [
  {
    title: 'Speed vs. Fairness',
    problem: 'Automating triage risks hasty or biased decisions, yet regulators demand rapid resolution.',
    resolution: 'AI scores vulnerability at intake and routes high-risk cases to specialists first. Triage accelerates fairness.'
  },
  {
    title: 'Automation vs. Trust',
    problem: 'Removing humans during sensitive complaints erodes relationship trust and alienates staff.',
    resolution: 'AI acts as pre-work assistant, never decision maker. Human Approval Gateway maintains human as legal fiduciary.'
  },
  {
    title: 'Scale vs. Explainability',
    problem: 'Black-box AI models fail regulatory examination and CFPB defensibility checks.',
    resolution: 'Tiered XAI overhead. RAG citations for rules, SHAP feature attribution for Gen AI text generation.'
  },
  {
    title: 'Growth vs. Trust',
    problem: 'Cross-selling during customer complaints feels exploitative and triggers mis-selling complaints.',
    resolution: 'Service Recovery Paradox cooling window. Offers trigger strictly 72h post-resolution only if CSAT >= 4/5.'
  }
];

export const COMPETITIVE_EDGES_LIST = [
  { num: 1, title: 'Algorithmic Fiduciary', text: 'Human agent remains legal decision maker at every HITL junction, ensuring CFPB compliance.' },
  { num: 2, title: 'Rubber-Stamping Guardrail', text: 'Monitors override rate (8-12% target). Drops below 5% trigger mandatory supervisor review.' },
  { num: 3, title: 'Service Recovery Paradox', text: 'Excellently resolved complaints create higher trust peaks, unlocking $25M/yr organic growth.' },
  { num: 4, title: '185K Preventable Departures', text: 'Wave 3 predictive engine flags churn risk 30-60 days ahead for proactive intervention.' },
  { num: 5, title: 'CFPB Trajectory Insurance', text: 'Stopping +38% CFPB complaint growth avoids $50M-$100M formal examination penalties.' },
  { num: 6, title: '14,200 Backlog as Training Data', text: 'Historical complaint backlog labelled and used as fine-tuning dataset before go-live.' },
  { num: 7, title: 'Knowledge Retention Protocol', text: 'Captures departing agents override patterns to prevent AI drift as staff transition.' },
  { num: 8, title: 'Attrition Asymmetry Target', text: 'Reskilling prioritizes senior tier 3-4 handlers whose judgment AI supervision requires.' },
  { num: 9, title: 'SMB Hidden Prize', text: '90K small business clients yield 3-5x revenue value per account via RM copilot.' },
  { num: 10, title: 'NPS Deposit Growth Dividend', text: 'Moving NPS from +8 to +18 drives 84% faster deposit CAGR (McKinsey benchmark).' },
  { num: 11, title: 'Token Cost Optimization', text: 'RAG ($0.001) vs Gen AI ($5.00) tiering keeps annual token expenditure under $550K.' },
  { num: 12, title: 'Consent-Based AI Triage', text: 'Customer confirms AI classification before processing: "I classified this as X, do you agree?"' },
  { num: 13, title: 'Mid-Tier Agility Advantage', text: '210 branches / 3 contact centers enable rapid 90-day pilot loops compared to megabanks.' },
  { num: 14, title: 'Staff Trust Before Customer AI', text: 'Wave 1 deploys internal copilot first so staff experience AI benefits before public launch.' }
];
