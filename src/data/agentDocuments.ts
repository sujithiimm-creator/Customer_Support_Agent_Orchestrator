import { AgentDocument } from '../types';

export const MOCK_AGENT_DOCUMENTS: AgentDocument[] = [
  // Inquiries Agent Documents
  {
    id: 'ag-doc-inq-1',
    agent: 'Inquiries Agent',
    documentCode: 'AG-INQ-101',
    title: 'Inquiries Agent System Directives & Fee Waiver Protocol',
    lastUpdated: '2026-04-12',
    summary: 'System directives for evaluating account inquiries, overdraft fee waiver eligibility, transaction ledger verification, and daily debit card limit adjustments.',
    fullText: 'The Inquiries Agent handles account balance inquiries, transaction queries, daily withdrawal limit updates, and fee refund requests. Before approving a fee waiver, the agent MUST inspect the customer\'s 2-month transaction ledger and check account tenure. Customers with >3 years tenure qualify for 100% fee waivers for posting delays up to $150.',
    mandatoryRules: [
      'Inspect 2-month transaction ledger to verify exact dates, amounts, and running balances.',
      'Verify customer tenure > 3 years to authorize 100% posting-delay fee waiver up to $150.',
      'Require 2FA mobile authorization for daily debit withdrawal limit increases up to $2,500.',
      'Log all account term disclosures and fee adjustments in Central CRM.'
    ]
  },
  {
    id: 'ag-doc-inq-2',
    agent: 'Inquiries Agent',
    documentCode: 'AG-INQ-105',
    title: 'Certificate of Deposit (CD) Products & Terms Guidance',
    lastUpdated: '2026-05-01',
    summary: 'Specifications for 6-Month, 12-Month, 24-Month, 36-Month, and IRA Certificates of Deposit terms, compounding rates, and penalty rules.',
    fullText: 'Provides complete information regarding NordHaven CD maturity terms, APY schedules, daily interest compounding, monthly interest crediting, and early withdrawal penalties. Refers high-yield liquid savings inquiries to the Product Pitching Agent.',
    mandatoryRules: [
      'Provide complete maturity term duration, APY rates, and early withdrawal penalty warnings.',
      'Cross-reference interest rate table NH-INQ-108 and product guide NH-PRD-503.',
      'Escalate early withdrawal penalty waiver requests exceeding $500 to Tier 2 operations.'
    ]
  },

  // Payments Agent Documents
  {
    id: 'ag-doc-pay-1',
    agent: 'Payments Agent',
    documentCode: 'AG-PAY-301',
    title: 'Payments Agent Wire Transfer & Fedwire IMAD/OMAD Trace Protocol',
    lastUpdated: '2026-03-18',
    summary: 'RAG knowledge base for high-value Fedwire & SWIFT payment settlement tracing, clearing house hold resolution, and IMAD/OMAD tracking.',
    fullText: 'The Payments Agent executes automated IMAD/OMAD traces for consumer and commercial wire transfers experiencing clearing delays over 30 minutes. Sends proactive push updates to customer mobile banking apps and stages bridge funding options for SMB payroll emergencies.',
    mandatoryRules: [
      'Execute automated IMAD/OMAD trace for wire transfers pending > 30 minutes.',
      'Send real-time push notification with estimated release window.',
      'Bridge credit for SMB payroll urgency requires Human Credit Manager authorization.'
    ]
  },
  {
    id: 'ag-doc-pay-2',
    agent: 'Payments Agent',
    documentCode: 'AG-PAY-306',
    title: 'Payroll Direct Deposit & Settlement Timeline Protocol',
    lastUpdated: '2026-05-10',
    summary: 'Rules for evaluating direct deposit postings, employer ACH transmission windows, and weekend/holiday posting holds.',
    fullText: 'Analyzes ACH network posting logs and customer transaction ledgers to confirm payroll deposit status (Policy NH-PAY-306). Explains employer transmission timing, ACH clearing windows, and federal holiday posting adjustments.',
    mandatoryRules: [
      'Verify employer ACH transmission batch date and settlement clearing status.',
      'Quote exact deposit date, merchant description, and amount from customer 2-month ledger.',
      'Escalate payroll posting delays exceeding 1 business day to Operations Tier 3.'
    ]
  },

  // Fraud Agent Documents
  {
    id: 'ag-doc-frd-1',
    agent: 'Fraud Agent',
    documentCode: 'AG-FRD-201',
    title: 'Fraud Agent Geofence Anomaly & Reg E Provisional Credit Protocol',
    lastUpdated: '2026-04-05',
    summary: 'Directives for detecting card geofence mismatches, executing instant card freezes, and staging Regulation E provisional credit.',
    fullText: 'When a transaction location deviates from customer device geofence or active travel notices, Fraud Agent triggers an immediate card freeze recommendation and evaluates Reg E provisional credit up to $5,000 pending Human Specialist approval.',
    mandatoryRules: [
      'Recommend immediate card freeze if geofence mismatch is verified.',
      'Stage provisional credit up to $5,000 under Reg E upon Human Specialist approval.',
      'Issue written fraud investigation notice within 24 hours of report.'
    ]
  },
  {
    id: 'ag-doc-frd-2',
    agent: 'Fraud Agent',
    documentCode: 'AG-FRD-205',
    title: 'Unauthorized Electronic Fund Transfer & Card Dispute Manual',
    lastUpdated: '2026-02-28',
    summary: 'Procedures for filing card disputes, merchant hold backs, zero-liability protection checks, and replacement card dispatch.',
    fullText: 'Outlines consumer zero-liability protections under Visa/Mastercard network rules and Regulation E dispute filing timelines ($50 liability cap if reported within 2 business days). Guides merchant hold-back generation.',
    mandatoryRules: [
      'Verify customer zero-liability status for unauthorized online transactions.',
      'Dispatch expedited replacement card with tokenized digital wallet update.',
      'Stage merchant chargeback documentation in central fraud repository.'
    ]
  },

  // Product Pitching Agent Documents
  {
    id: 'ag-doc-pitch-1',
    agent: 'Product Pitching Agent',
    documentCode: 'AG-PITCH-501',
    title: 'Product Pitching Agent Suitability & 72-Hour Cooling-Off Protocol',
    lastUpdated: '2026-04-10',
    summary: 'Rules for analyzing customer liquidity, presenting relevant financial offers (Premier Savings 4.85% APY, CDs), and enforcing 72-hour cooling-off disclosures.',
    fullText: 'Identifies cross-sell suitability when customer account context indicates idle liquid cash (> $10,000) or borrowing needs. Presents tailored product recommendations (Premier High Yield Savings, Certificate of Deposit, Commercial Line of Credit) with mandatory 72-hour cooling-off window disclosure.',
    mandatoryRules: [
      'Perform mandatory suitability check prior to pitching any financial product.',
      'Attach mandatory 72-hour cooling-off period cancellation disclosure on all offers.',
      'Strictly prohibit product pitches on accounts flagged for vulnerability or hardship.'
    ]
  },
  {
    id: 'ag-doc-pitch-2',
    agent: 'Product Pitching Agent',
    documentCode: 'AG-PITCH-503',
    title: 'High Yield Savings & Business Credit Rate Matrix',
    lastUpdated: '2026-04-18',
    summary: 'Product terms, yield formulas, APY tiers, and cross-sell projection models for sales synthesis.',
    fullText: 'Contains interest rate calculations and APY tier disclosures for NordHaven Premier High Yield Savings (4.85% APY) and Commercial Lines of Credit. Guides projection math based on customer running balance.',
    mandatoryRules: [
      'Calculate projected annual earnings using customer\'s current running balance.',
      'Cross-reference credit score and deposit history for Line of Credit pre-qualification.',
      'Provide transparent yield comparison against standard checking accounts.'
    ]
  },

  // Other Agent Documents
  {
    id: 'ag-doc-oth-1',
    agent: 'Other Agent',
    documentCode: 'AG-OTH-901',
    title: 'Other Agent General Support & Edge Case Routing Framework',
    lastUpdated: '2026-01-15',
    summary: 'Directives for resolving non-standard customer queries, general branch inquiries, and escalating complex edge cases.',
    fullText: 'Handles queries falling outside core Inquiries, Payments, Fraud, or Product Pitching specialist domains. Uses general NordHaven banking procedures to assist customers or escalate to Tier 5 Specialist Queue.',
    mandatoryRules: [
      'Categorize non-standard requests and attempt resolution via general procedures.',
      'Route complex or unknown intent queries to Tier 5 Human Specialist Queue.',
      'Log unclassified intent patterns for continuous model training.'
    ]
  },
  {
    id: 'ag-doc-oth-2',
    agent: 'Other Agent',
    documentCode: 'AG-OTH-905',
    title: 'Financial Hardship Signal Detection & Vulnerability Safeguards',
    lastUpdated: '2026-03-22',
    summary: 'Safety protocols for detecting customer distress indicators and overriding automated decisions for human empathy review.',
    fullText: 'Monitors customer conversations for severe distress or hardship keywords (e.g., medical bills, fixed pension, disability, bereavement). Automatically flags vulnerability status and transfers case to Human Supervisor with zero automated AI denial.',
    mandatoryRules: [
      'Set vulnerability_signal_detected = true upon detecting distress keywords.',
      'Bypass automated denial and stage case for immediate Human Supervisor review.',
      'Provide empathetic, supportive communication tone adhering to CFPB fairness guidelines.'
    ]
  }
];
