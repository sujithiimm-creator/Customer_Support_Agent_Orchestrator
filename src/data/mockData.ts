import { CustomerProfile, PolicyDocument, PresetScenario } from '../types';

export const MOCK_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cust-101',
    name: 'Sarah Jenkins',
    accountNumber: 'NH-8823-9012',
    segment: 'Retail',
    tenureYears: 7,
    productsCount: 2,
    holdings: ['NordHaven Checking Plus', 'NordHaven Everyday Rewards Visa'],
    vulnerabilityStatus: 'None',
    riskRating: 'Low',
    relationshipNps: 6,
    openComplaints: 1,
    annualRevenueValue: '$1,450',
    notes: 'I was charged $105 in total overdraft fees ($35 x 3) because your system posted my direct deposit late on Friday. As a loyal customer for 7 years, this is totally unacceptable. Please refund these fees immediately or I will have to file a formal complaint with the CFPB!'
  },
  {
    id: 'cust-102',
    name: 'Eleanor Vance',
    accountNumber: 'NH-4412-0098',
    segment: 'Vulnerable / Hardship',
    tenureYears: 14,
    productsCount: 2,
    holdings: ['NordHaven Senior Choice Checking', 'Fixed Term Savings'],
    vulnerabilityStatus: 'Hardship / Financial Distress',
    riskRating: 'Low',
    relationshipNps: 9,
    openComplaints: 0,
    annualRevenueValue: '$620',
    notes: 'Hello, I am 78 years old and living on a small fixed pension. Due to unexpected medical expenses this month, I missed my $210 loan payment. I am terrified of losing my credit score. Can NordHaven please help me with a payment waiver or hardship relief?'
  },
  {
    id: 'cust-103',
    name: 'David Chen',
    accountNumber: 'NH-9941-2311',
    segment: 'Wealth / Premier',
    tenureYears: 5,
    productsCount: 4,
    holdings: ['NordHaven Premier Checking', 'Wealth Management Account', 'World Elite Mastercard', 'Home Mortgage'],
    vulnerabilityStatus: 'None',
    riskRating: 'Medium',
    relationshipNps: 8,
    openComplaints: 1,
    annualRevenueValue: '$8,900',
    notes: 'Hi, I just received an alert for an unauthorized $2,450 luxury purchase at Hermes Paris on my card. I am sitting in my office in Chicago right now and haven\'t traveled anywhere! Please lock my card immediately and issue provisional credit.'
  },
  {
    id: 'cust-104',
    name: 'Elena Rostova',
    accountNumber: 'NH-3301-8844',
    segment: 'Small Business (SMB)',
    tenureYears: 6,
    productsCount: 3,
    holdings: ['NordHaven SMB Business Checking', 'Merchant Services Terminal', 'Commercial Line of Credit'],
    vulnerabilityStatus: 'None',
    riskRating: 'Low',
    relationshipNps: 7,
    openComplaints: 0,
    annualRevenueValue: '$12,400',
    notes: 'Our $45,000 payroll wire sent at 8:00 AM still hasn\'t reached our employees\' accounts yet. Today is payday and my staff are calling me asking where their salaries are! Could you please trace this wire transfer urgently and confirm when it will clear?'
  },
  {
    id: 'cust-105',
    name: 'Marcus Brody',
    accountNumber: 'NH-1120-7733',
    segment: 'Retail',
    tenureYears: 2,
    productsCount: 1,
    holdings: ['NordHaven Everyday Checking'],
    vulnerabilityStatus: 'None',
    riskRating: 'Low',
    relationshipNps: 5,
    openComplaints: 0,
    annualRevenueValue: '$310',
    notes: 'Hi! I am traveling to Japan next week and wanted to ask about NordHaven\'s foreign transaction fee rates. Also, how can I temporarily increase my daily debit card withdrawal limit to $1,500 for my trip?'
  },
  {
    id: 'cust-106',
    name: 'Tom Miller',
    accountNumber: 'NH-5599-1204',
    segment: 'Vulnerable / Hardship',
    tenureYears: 9,
    productsCount: 2,
    holdings: ['NordHaven Checking', 'Personal Auto Loan'],
    vulnerabilityStatus: 'Health / Disability',
    riskRating: 'High',
    relationshipNps: 4,
    openComplaints: 1,
    annualRevenueValue: '$880',
    notes: 'Hello, I am currently on a temporary medical disability break from work and struggling with mounting medical bills. I am feeling overwhelmed and worried about falling behind on my auto loan payment. Can you please assist me with hardship options?'
  }
];

export const MOCK_POLICIES: PolicyDocument[] = [
  {
    id: 'pol-inq-2026',
    category: 'Fee Waiver',
    title: 'Customer Inquiry & Account Fee Policy',
    citationCode: 'NH-POL-INQ-101',
    lastUpdated: '2026-02-15',
    summary: 'Governs general account inquiries, foreign transaction terms, withdrawal limits, and fee waivers.',
    fullText: 'NordHaven Financial Services authorizes Inquiries Agents to explain account terms, adjust daily card limits up to $2,500, and evaluate fee waiver requests up to $150 based on customer tenure and posting context. For long-standing customers (>3 years tenure), full fee waivers are authorized for system posting delays.',
    mandatoryRules: [
      'Customer tenure > 3 years qualifies for 100% posting-delay fee waiver up to $150.',
      'Daily debit withdrawal limit increase requires 2FA mobile verification.',
      'Inquiries Agents must log all account term clarifications in the Central CRM.'
    ]
  },
  {
    id: 'pol-pay-2026',
    category: 'Wire & Payment Settlement',
    title: 'High-Value Payment & Wire Transfer Trace Protocol',
    citationCode: 'NH-POL-PAY-303',
    lastUpdated: '2025-11-20',
    summary: 'Outlines Fedwire & SWIFT tracking procedures, posting delay holds, and payment settlement tracing.',
    fullText: 'For commercial or consumer wire transfers experiencing clearing house delays over 30 minutes, Payments Agents execute automated Fedwire IMAD/OMAD tracing. Real-time updates must be provided to the customer, and bridging credit options evaluated for SMB payroll urgency.',
    mandatoryRules: [
      'Automatic IMAD/OMAD trace execution for wires pending > 30 minutes.',
      'Proactive push notification to customer mobile banking application.',
      'Bridge funding for SMB payroll requires human credit manager authorization.'
    ]
  },
  {
    id: 'pol-fraud-2026',
    category: 'Fraud & Provisional Credit',
    title: 'Unlawful Transaction & Provisional Credit Policy (Reg E)',
    citationCode: 'NH-POL-FRD-204',
    lastUpdated: '2026-03-01',
    summary: 'Specifies Regulation E timelines for provisional credit issuance ($500+ within 10 business days) and card freeze protocols.',
    fullText: 'When a customer reports an unauthorized transaction or location anomaly, Fraud Agents stage an immediate card freeze and evaluate provisional credit under Reg E. For customers with good standing, immediate provisional credit up to $5,000 is authorized upon Human Specialist approval.',
    mandatoryRules: [
      'Immediate card freeze recommended if transaction location mismatches device geofence.',
      'Provisional credit up to $5,000 permitted upon Human Specialist approval under Reg E.',
      'Must issue written fraud investigation notice within 24 hours.'
    ]
  },
  {
    id: 'pol-pitch-2026',
    category: 'CFPB Adverse Action',
    title: 'Responsible Product Recommendation & Cross-Sell Policy',
    citationCode: 'NH-POL-PITCH-505',
    lastUpdated: '2026-04-10',
    summary: 'Governs AI-driven financial product pitching, suitability verification, and mandatory 72-hour cooling-off disclosures.',
    fullText: 'The Product Pitching Agent identifies opportunities to offer relevant NordHaven financial products (e.g. Premier High Yield Savings at 4.85% APY, Commercial Line of Credit, Wealth Portfolio Management, Platinum Rewards Card) when customer queries reveal unmet financial needs, idle cash reserves, or borrowing requirements. Pitching must strictly adhere to suitability criteria and include a clear 72-hour cooling-off disclosure.',
    mandatoryRules: [
      'Suitability assessment mandatory before pitching any financial or credit product.',
      'Must provide 72-hour cooling-off period disclosure on all financial product offers.',
      'No aggressive pitching permitted for accounts flagged with vulnerability or hardship.'
    ]
  },
  {
    id: 'pol-other-2026',
    category: 'Hardship & Vulnerable Protections',
    title: 'General Support & Edge Case Service Safeguards',
    citationCode: 'NH-POL-OTH-909',
    lastUpdated: '2026-01-15',
    summary: 'Handles general customer inquiries outside core domains and escalations to specialized support desks.',
    fullText: 'Queries falling outside standard Inquiries, Payments, Fraud, or Product Pitching categories are routed to the Other Agent. The Other Agent evaluates intent against NordHaven general operating procedures, provides assistance, or escalates to human operations teams if necessary.',
    mandatoryRules: [
      'Categorize non-standard requests and attempt direct resolution using general banking guidelines.',
      'Escalate to human support desk if query cannot be resolved automatically.',
      'Log unknown intent patterns to improve classification model.'
    ]
  },
  {
    id: 'pol-cd-105',
    category: 'Fee Waiver',
    title: 'Certificate of Deposit Products',
    citationCode: 'NH-INQ-105',
    lastUpdated: '2026-05-01',
    summary: 'Governs terms, maturity periods, APY rates, interest compounding, and early withdrawal penalties for NordHaven CD products.',
    fullText: 'NordHaven offers 6 Month CD, 12 Month CD, 24 Month CD, 36 Month CD, and IRA Certificate of Deposit. Customers may withdraw funds before maturity; however, an early withdrawal penalty applies. Interest compounds daily and is credited monthly.',
    mandatoryRules: [
      'Explain maturity period, APY, withdrawal penalty, and renewal options.',
      'Escalate to specialist if customer requests early withdrawal exceeding policy threshold.',
      'Cross-reference interest rate table NH-INQ-108 and product guide NH-PRD-503.'
    ]
  },
  {
    id: 'pol-pay-306',
    category: 'Wire & Payment Settlement',
    title: 'Payroll Direct Deposit Policy',
    citationCode: 'NH-PAY-306',
    lastUpdated: '2026-05-10',
    summary: 'Governs payroll posting delays, ACH clearing house settlement, and customer communication.',
    fullText: 'Payroll direct deposits normally post on the settlement date supplied by the employer. Posting delays may occur because of employer transmission delay, ACH processing delay, federal holiday, or weekend settlement.',
    mandatoryRules: [
      'Verify employer submission date and ACH network status.',
      'Notify customer of expected posting timeline.',
      'Escalate to human operations if payroll is delayed beyond 1 business day.'
    ]
  }
];

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'scen-1',
    title: 'Overdraft Fee Complaint (CFPB Threat)',
    category: 'Complaint',
    customerId: 'cust-101',
    promptText: 'I was charged $105 in overdraft fees because your system posted my salary deposit late on Friday. This is unacceptable. If these fees are not refunded immediately, I am filing a formal complaint with the CFPB today!',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    description: 'Triggers Complaint Agent -> RAG Policy Lookup -> Fee Waiver Analysis -> Draft Resolution Letter -> HITL Approval'
  },
  {
    id: 'scen-2',
    title: 'Unauthorized Luxury Card Fraud Alert',
    category: 'Fraud',
    customerId: 'cust-103',
    promptText: 'I just got a notification for a $2,450 purchase at Hermes Paris on my World Elite card. I am sitting in my office in Chicago right now! Block my card immediately and give me provisional credit.',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'Triggers Fraud Agent -> Geofence Mismatch Detection -> Card Freeze Tool -> Provisional Credit Proposal'
  },
  {
    id: 'scen-3',
    title: 'SMB Payroll Wire Transfer Delay',
    category: 'Payments',
    customerId: 'cust-104',
    promptText: 'Our $45,000 payroll wire sent at 8:00 AM hasn\'t reached our employees\' accounts yet. Today is payday and my staff are calling me! Where is our money and why is it delayed?',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    description: 'Triggers Payments Agent -> Fedwire IMAD/OMAD Trace Tool -> Real-Time Status Update -> SMB Relief Option'
  },
  {
    id: 'scen-4',
    title: 'Elderly Hardship Loan Relief (Tier 5)',
    category: 'Vulnerability',
    customerId: 'cust-102',
    promptText: 'Hello, I am 78 years old and living on a small pension. Due to unexpected medical bills this month, I cannot afford my $210 loan payment. I am terrified of losing my credit score. Can you please help me?',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    description: 'Triggers Vulnerability Agent -> Distress Keyword Scoring -> Immediate Tier 5 Escalation -> Zero AI Adjudication'
  },
  {
    id: 'scen-5',
    title: 'General Fee & Travel Limit Enquiry',
    category: 'Enquiry',
    customerId: 'cust-105',
    promptText: 'Hi! I am traveling to Japan next week. What are NordHaven\'s foreign transaction fees, and how can I temporarily increase my daily debit card withdrawal limit to $1,500?',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'Triggers Enquiry Agent -> Tier 1 Workflow Automation -> Self-Service Travel Notice Activation'
  }
];
