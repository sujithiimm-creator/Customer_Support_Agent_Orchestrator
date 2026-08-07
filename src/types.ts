export type AgentType =
  | 'Orchestrator'
  | 'Inquiries Agent'
  | 'Payments Agent'
  | 'Fraud Agent'
  | 'Product Pitching Agent'
  | 'Other Agent';

export type InteractionStatus = 'pending_agent' | 'pending_hitl' | 'approved' | 'edited_and_approved' | 'overridden' | 'escalated_human';

export interface TransactionRecord {
  customer: string;
  customer_id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit' | 'fee' | 'wire';
  category: string;
  status: 'posted' | 'pending';
  running_balance: number;
}

export interface CustomerProfile {
  id: string;
  name: string;
  accountNumber: string;
  segment: 'Retail' | 'Wealth / Premier' | 'Small Business (SMB)' | 'Vulnerable / Hardship';
  tenureYears: number;
  productsCount: number;
  holdings: string[];
  vulnerabilityStatus: 'None' | 'Hardship / Financial Distress' | 'Elderly / Assisted' | 'Health / Disability';
  riskRating: 'Low' | 'Medium' | 'High';
  relationshipNps: number;
  openComplaints: number;
  annualRevenueValue: string;
  avatarUrl?: string;
  notes: string;
}

export interface PolicyDocument {
  id: string;
  category: 'Fee Waiver' | 'CFPB Adverse Action' | 'Fraud & Provisional Credit' | 'Hardship & Vulnerable Protections' | 'Wire & Payment Settlement';
  title: string;
  citationCode: string;
  lastUpdated: string;
  summary: string;
  fullText: string;
  mandatoryRules: string[];
}

export interface AgentDocument {
  id: string;
  agent: 'Inquiries Agent' | 'Payments Agent' | 'Fraud Agent' | 'Product Pitching Agent' | 'Other Agent';
  documentCode: string;
  title: string;
  lastUpdated: string;
  summary: string;
  fullText: string;
  mandatoryRules: string[];
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result: string;
  timestamp: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  step: string;
  action: string;
  agent: AgentType;
  details: string;
  status: 'info' | 'success' | 'warning' | 'error' | 'hitl';
}

export interface AgentResponsePayload {
  agent: AgentType;
  intent: string;
  confidence: number;
  reasoning_summary: string;
  retrieved_documents: PolicyDocument[];
  policy_used: string;
  tool_calls: ToolCall[];
  decision: 'approve_full_waiver' | 'approve_partial_waiver' | 'provisional_credit' | 'account_freeze' | 'route_tier5_specialist' | 'general_info' | 'payment_status_update' | 'deny_request' | 'guardrail_out_of_scope';
  customer_response: string;
  draft_letter?: string;
  audit_log: AuditLogItem[];
  vulnerability_signal_detected: boolean;
  assignedSpecialist?: string;
  isChatLocked?: boolean;
  recovery_recommendation?: {
    productName: string;
    description: string;
    eligibilityReason: string;
    coolingWindowHrs: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  text: string;
  timestamp: string;
  agentPayload?: AgentResponsePayload;
  hitlDecision?: {
    status: InteractionStatus;
    actionBy: string;
    timestamp: string;
    editedResponse?: string;
    overrideReason?: string;
  };
}

export interface PresetScenario {
  id: string;
  title: string;
  category: 'Complaint' | 'Fraud' | 'Payments' | 'Enquiry' | 'Vulnerability';
  customerId: string;
  promptText: string;
  badgeColor: string;
  description: string;
}
