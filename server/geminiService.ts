import { GoogleGenAI, Type } from '@google/genai';
import { AgentResponsePayload, AgentType, CustomerProfile, PolicyDocument, ToolCall, AuditLogItem } from '../src/types.js';
import { MOCK_CUSTOMERS, MOCK_POLICIES } from '../src/data/mockData.js';
import { getCustomerTransactions, getLatestBalance } from '../src/data/transactions.js';

export interface ChatHistoryItem {
  sender: 'customer' | 'agent' | 'user';
  text: string;
  agent?: string;
  decision?: string;
}

// Lazy initialization for Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.warn('GEMINI_API_KEY is not configured or using default placeholder.');
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Domain Guardrail Checker for Banking & Financial Services Scope
export function isOutOfScopeBankingQuery(userPrompt: string): boolean {
  const lower = userPrompt.toLowerCase().trim();
  if (!lower) return false;

  // Explicit non-banking subjects
  const nonBankingTopics = [
    'recipe', 'cook', 'bake', 'cake', 'weather', 'movie', 'actor', 'celebrity',
    'song', 'music', 'joke', 'python', 'javascript', 'java', 'html', 'css', 'code',
    'programming', 'write a function', 'capital of', 'who is president', 'sports', 'football',
    'cricket', 'basketball', 'super bowl', 'game', 'poem', 'story', 'solve x',
    'math problem', 'physics', 'chemistry', 'translate', 'french', 'spanish', 'cat', 'dog', 'pet'
  ];

  if (nonBankingTopics.some((topic) => lower.includes(topic))) {
    return true;
  }

  const bankingKeywords = [
    'account', 'balance', 'fee', 'charge', 'overdraft', 'deposit', 'payroll',
    'wire', 'transfer', 'ach', 'card', 'credit', 'debit', 'limit', 'fraud',
    'unauthorized', 'dispute', 'loan', 'mortgage', 'rate', 'apy', 'savings',
    'checking', 'interest', 'cd', 'certificate of deposit', 'invest', 'wealth',
    'pitch', 'hardship', 'pension', 'medical', 'disability', 'cfpb', 'statement',
    'nordhaven', 'bank', 'branch', 'atm', 'transaction', 'ledger', 'imad',
    'omad', 'refund', 'waiver', 'holder', 'recipient', 'merchant', 'withdrawal',
    'foreign', 'travel', 'japan', 'paris', 'hermes', 'chicago', 'money', 'dollar',
    'payment', 'pay', 'customer', 'tenure', 'policy', 'agent', 'service',
    'salary', 'amount', 'help', 'status', 'due', 'bill', 'hello', 'hi', 'thanks'
  ];

  const hasBankingKeyword = bankingKeywords.some((kw) => lower.includes(kw));

  if (!hasBankingKeyword) {
    if (lower.startsWith('what is') || lower.startsWith('who is') || lower.startsWith('how to make') || lower.startsWith('tell me about') || lower.startsWith('can you explain')) {
      return true;
    }
  }

  return false;
}

function generateGuardrailResponse(userPrompt: string, customer: CustomerProfile): AgentResponsePayload {
  const timestamp = new Date().toISOString();
  return {
    agent: 'Orchestrator',
    intent: 'Out-of-Scope Domain Guardrail',
    confidence: 0.99,
    reasoning_summary: 'Guardrail Enforcement: Query falls outside NordHaven banking, customer complaint, and financial operations scope.',
    retrieved_documents: [],
    policy_used: 'NH-GOV-001 - NordHaven Banking Domain Security Guardrail',
    tool_calls: [
      { id: 'tc-g1', name: 'evaluateDomainGuardrail', args: { query: userPrompt }, result: 'Domain violation detected: Request is unrelated to financial services', timestamp },
    ],
    decision: 'guardrail_out_of_scope',
    customer_response: `Dear ${customer.name}, I am NordHaven's specialized Autonomous Banking AI System. My operational capabilities are strictly dedicated to banking services, account management, payment settlements, fraud protection, and financial product options. I cannot assist with non-banking topics, general knowledge, or unrelated queries. Please let me know how I can help you with your NordHaven accounts, transactions, or financial inquiries!`,
    draft_letter: '',
    audit_log: [
      { id: 'al-g1', timestamp, step: '01. Ingress Triage', action: 'Domain Guardrail Check', agent: 'Orchestrator', details: 'Query classified as OUT OF DOMAIN (Unrelated to banking). Guardrail triggered.', status: 'warning' },
      { id: 'al-g2', timestamp, step: '02. Guardrail Enforcement', action: 'Domain Boundary Notice Generated', agent: 'Orchestrator', details: 'Politely redirecting customer back to NordHaven banking capabilities.', status: 'info' }
    ],
    vulnerability_signal_detected: false,
  };
}

// RFC Retrieval Function
export function retrieveContextRFC(query: string, categoryFilter?: string): PolicyDocument[] {
  const lowerQuery = query.toLowerCase();
  
  const matches = MOCK_POLICIES.filter((policy) => {
    if (categoryFilter && policy.category !== categoryFilter) {
      const catMatch = policy.category.toLowerCase().includes(lowerQuery);
      if (!catMatch) return false;
    }
    const textMatch =
      policy.title.toLowerCase().includes(lowerQuery) ||
      policy.summary.toLowerCase().includes(lowerQuery) ||
      policy.fullText.toLowerCase().includes(lowerQuery) ||
      policy.mandatoryRules.some((r) => r.toLowerCase().includes(lowerQuery));

    return textMatch;
  });

  return matches.length > 0 ? matches.slice(0, 2) : [MOCK_POLICIES[0]];
}

// Helper to determine target agent based on query intent
export function classifyTargetAgent(userPrompt: string): AgentType {
  const lower = userPrompt.toLowerCase();

  // Fraud Agent
  if (
    lower.includes('fraud') ||
    lower.includes('unauthorized') ||
    lower.includes('hermes') ||
    lower.includes('paris') ||
    lower.includes('stolen') ||
    lower.includes('suspicious') ||
    lower.includes('lock card') ||
    lower.includes('freeze')
  ) {
    return 'Fraud Agent';
  }

  // Payments Agent
  if (
    lower.includes('wire') ||
    lower.includes('payroll') ||
    lower.includes('payment') ||
    lower.includes('sent') ||
    lower.includes('transfer') ||
    lower.includes('ach') ||
    lower.includes('imad') ||
    lower.includes('fedwire')
  ) {
    return 'Payments Agent';
  }

  // Product Pitching Agent (Detects pitch & product opportunity: products, account upgrades, recommendations, relationship review, savings, APY, high balance, loan, card rewards, wealth, invest)
  if (
    lower.includes('product') ||
    lower.includes('products') ||
    lower.includes('upgrade') ||
    lower.includes('upgrades') ||
    lower.includes('recommend') ||
    lower.includes('recommendation') ||
    lower.includes('relationship') ||
    lower.includes('fit for me') ||
    lower.includes('better fit') ||
    lower.includes('pitch') ||
    lower.includes('invest') ||
    lower.includes('savings') ||
    lower.includes('saving') ||
    lower.includes('apy') ||
    lower.includes('interest rate') ||
    lower.includes('higher return') ||
    lower.includes('credit line') ||
    lower.includes('mortgage') ||
    lower.includes('wealth') ||
    lower.includes('rewards card') ||
    lower.includes('new product') ||
    lower.includes('offer') ||
    lower.includes('perks') ||
    lower.includes('benefit')
  ) {
    return 'Product Pitching Agent';
  }

  // Inquiries Agent (Fee waiver, account balance, terms, travel limits, branches, general account info)
  if (
    lower.includes('fee') ||
    lower.includes('overdraft') ||
    lower.includes('balance') ||
    lower.includes('limit') ||
    lower.includes('travel') ||
    lower.includes('japan') ||
    lower.includes('inquiry') ||
    lower.includes('hours') ||
    lower.includes('branch') ||
    lower.includes('statement') ||
    lower.includes('account number')
  ) {
    return 'Inquiries Agent';
  }

  // Other Agent (Anything else)
  return 'Other Agent';
}

export function cleanCustomerMessageText(text: string): string {
  if (!text) return '';
  let cleaned = text;
  // Remove bracketed handoff and agent headers
  cleaned = cleaned.replace(/\[Orchestrator[^\]]*\]/gi, '');
  cleaned = cleaned.replace(/\[(Inquiries|Payments|Fraud|Product Pitching|Other)\s+Agent\s+Response\]/gi, '');
  cleaned = cleaned.replace(/\[[^\]]*Agent\s+Response\]/gi, '');
  cleaned = cleaned.replace(/\[[^\]]*Shared Memory[^\]]*\]/gi, '');
  // Remove "Dear Customer Name," prefix if present
  cleaned = cleaned.replace(/^Dear\s+[A-Za-z\s]+,?\s*/i, '');
  return cleaned.trim();
}

// System prompt builder with history context
function buildAgentSystemPrompt(
  agent: AgentType,
  customer: CustomerProfile,
  retrievedDocs: PolicyDocument[],
  history: ChatHistoryItem[] = []
) {
  const docsText = retrievedDocs
    .map((d) => `[${d.citationCode}] ${d.title}: ${d.fullText}\nMandatory Rules: ${d.mandatoryRules.join('; ')}`)
    .join('\n\n');

  const txs = getCustomerTransactions(customer.accountNumber);
  const currentBalance = getLatestBalance(customer.accountNumber);
  const txLedgerText = txs.length > 0
    ? txs.map((t) => `${t.date} | ${t.description} | Amount: $${t.amount} | Type: ${t.type} | Running Balance: $${t.running_balance}`).join('\n')
    : 'No transactions recorded.';

  const formattedHistory = history.length > 0
    ? history.map((h, i) => `Turn ${i + 1} [${(h.sender || 'USER').toUpperCase()}${h.agent ? ` (${h.agent})` : ''}]: ${h.text}`).join('\n')
    : 'No prior turn history in this session.';

  return `
You are NordHaven Financial Services' Autonomous Banking AI System.
You are currently operating inside the [${agent}] specialist module.

CROSS-AGENT CONVERSATION MEMORY & CONTINUITY:
The Orchestrator maintains complete session memory across all 5 specialist agents (Inquiries Agent, Payments Agent, Fraud Agent, Product Pitching Agent, Other Agent).
Below is the conversation history of previous turns in this customer session:
${formattedHistory}

ORCHESTRATION & CROSS-AGENT MEMORY DIRECTIVES:
1. You have complete context of what other specialist agents resolved or discussed in previous turns.
2. If the user transitions from one topic to another (e.g. from a payment wire issue resolved by Payments Agent to asking about high-yield savings APY, or asking for a fee waiver after discussing a fraud incident), ACKNOWLEDGE the prior agent's actions and build upon that shared memory seamlessly in reasoning_summary.
3. If the user's prompt is completely UNRELATED to banking or financial services (e.g., recipes, trivia, sports, code), trigger DOMAIN GUARDRAIL: return agent = "Orchestrator", decision = "guardrail_out_of_scope".

CRITICAL CUSTOMER RESPONSE FORMATTING RULES:
1. NEVER include internal technical tags, bracketed headers (e.g., "[Product Pitching Agent Response]", "[Orchestrator Shared Memory Active]"), or "Dear [Customer Name]," in customer_response.
2. Provide a clean, natural, empathetic 1-2 sentence response explaining the resolution directly to the customer.
3. Keep all cross-agent handoff details, routing rationale, and backend technical metadata strictly inside reasoning_summary and audit_log.
4. IF a vulnerability or hardship signal is detected (e.g., medical, disability, pension, fixed income, severe hardship):
   - Set vulnerability_signal_detected = true
   - Set decision = "route_tier5_specialist"
   - Return customer_response EXCLUSIVELY as: "Your case has been flagged for prioritized care under NordHaven's Vulnerability Protection Protocol. Senior Support Specialist Eleanor Vance has been assigned to your account and will contact you directly within 15 minutes."

CUSTOMER CONTEXT:
- Name: ${customer.name} (Account: ${customer.accountNumber})
- Current Calculated Running Balance: $${currentBalance.toLocaleString()}
- Segment: ${customer.segment}
- Tenure: ${customer.tenureYears} years
- Holdings: ${customer.holdings.join(', ')}
- Vulnerability Status: ${customer.vulnerabilityStatus}
- Risk Rating: ${customer.riskRating}
- Open Complaints: ${customer.openComplaints}
- Initial Complaint / Note: ${customer.notes}

CUSTOMER 2-MONTH TRANSACTION LEDGER (June - July 2026):
${txLedgerText}

RETRIEVED POLICIES (RFC Context):
${docsText}

AGENT RESPONSIBILITIES:
- If running as [Inquiries Agent]: Answer account inquiries, CD products (NH-INQ-105), fee questions, limit increases, account balance, or transaction history queries. Refer directly to the customer's 2-month transaction ledger provided above for accurate dates, descriptions, amounts, and running balances.
- If running as [Payments Agent]: Process wire/ACH traces, direct deposit status (NH-PAY-306), clearing times, or payment delays. Refer directly to the payroll/deposit transactions in the ledger.
- If running as [Fraud Agent]: Handle unauthorized charges, card freezes, Regulation E provisional credit staging.
- If running as [Product Pitching Agent]: Identify cross-sell suitability (e.g. Premier High-Yield Savings 4.85% APY, Certificate of Deposit products, Business Line of Credit) and present a tailored product pitch with 72-hour cooling period disclosure.
- If running as [Other Agent]: Resolve non-standard customer requests or escalate to general support.

ORCHESTRATION RULES:
1. Always state the active agent as "${agent}".
2. Quote exact numbers, dates, and merchant names from the ledger when answering account queries.
3. Detect if customer is expressing severe financial distress/hardship keywords. Set vulnerability_signal_detected to true if found.
4. Reference retrieved RFC policies.
5. Produce structured JSON response adhering strictly to the schema.
`;
}

export async function processAgentOrchestration(
  userPrompt: string,
  customerId: string,
  requestedAgent: AgentType = 'Orchestrator',
  history: ChatHistoryItem[] = []
): Promise<AgentResponsePayload> {
  const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId) || MOCK_CUSTOMERS[0];
  const timestamp = new Date().toISOString();

  // Guardrail Check for domain scope
  if (isOutOfScopeBankingQuery(userPrompt)) {
    return generateGuardrailResponse(userPrompt, customer);
  }

  // Classify target specialist agent via Orchestrator
  const routedAgent: AgentType = requestedAgent === 'Orchestrator' ? classifyTargetAgent(userPrompt) : requestedAgent;

  // RAG Policy Lookup specifically for routed agent
  const retrievedDocs = retrieveContextRFC(userPrompt);

  // Detect hardship signal
  const hardshipKeywords = ['pension', 'medical', 'disability', 'hardship', 'can\'t pay', 'terrified', 'eviction', 'disqualified', 'elderly'];
  const hasHardshipSignal = customer.vulnerabilityStatus !== 'None' || hardshipKeywords.some((k) => userPrompt.toLowerCase().includes(k));

  const ai = getGeminiClient();

  if (ai) {
    try {
      const systemPrompt = buildAgentSystemPrompt(routedAgent, customer, retrievedDocs, history);

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              agent: { type: Type.STRING },
              intent: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              reasoning_summary: { type: Type.STRING },
              policy_used: { type: Type.STRING },
              decision: { type: Type.STRING },
              customer_response: { type: Type.STRING },
              draft_letter: { type: Type.STRING },
              vulnerability_signal_detected: { type: Type.BOOLEAN },
              recovery_recommendation: {
                type: Type.OBJECT,
                properties: {
                  productName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  eligibilityReason: { type: Type.STRING },
                  coolingWindowHrs: { type: Type.NUMBER },
                },
              },
            },
            required: ['agent', 'intent', 'confidence', 'reasoning_summary', 'policy_used', 'decision', 'customer_response', 'vulnerability_signal_detected'],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        const activeAgent: AgentType = (parsed.agent as AgentType) || routedAgent;

        const toolCalls: ToolCall[] = [
          { id: `tc-1`, name: 'orchestratorClassifyIntent', args: { userPrompt }, result: `Routed to ${activeAgent}`, timestamp },
          { id: `tc-2`, name: 'retrieveContextRFC', args: { query: userPrompt, agent: activeAgent }, result: `Retrieved ${retrievedDocs.length} policy documents`, timestamp },
          { id: `tc-3`, name: 'fetchCustomerProfile', args: { accountNumber: customer.accountNumber }, result: `Loaded profile for ${customer.name}`, timestamp },
          { id: `tc-4`, name: 'executeAgentRules', args: { agent: activeAgent, policyCode: retrievedDocs[0]?.citationCode }, result: `Rule check passed. Decision: ${parsed.decision}`, timestamp },
        ];

        const auditLog: AuditLogItem[] = [
          { id: 'al-1', timestamp, step: '01. Ingress Triage', action: 'Orchestrator Routing Decision', agent: 'Orchestrator', details: `Classified query & routed to [${activeAgent}] (Confidence: ${(parsed.confidence * 100).toFixed(0)}%)`, status: 'info' },
          { id: 'al-2', timestamp, step: '02. Context Retrieval', action: 'RAG Policy Vector Search', agent: activeAgent, details: `[${activeAgent}] retrieved RFC Policy: ${parsed.policy_used || retrievedDocs[0].citationCode}`, status: 'info' },
          { id: 'al-3', timestamp, step: '03. Vulnerability Guardrail', action: 'Hardship Signal Audit', agent: activeAgent, details: parsed.vulnerability_signal_detected ? 'DISTRESS SIGNAL DETECTED: Routing to Tier 5 Specialist Queue' : 'No vulnerability distress detected.', status: parsed.vulnerability_signal_detected ? 'warning' : 'success' },
          { id: 'al-4', timestamp, step: '04. Reasoning Engine', action: 'SHAP Rationale Synthesis', agent: activeAgent, details: `[${activeAgent}] synthesized decision: ${parsed.reasoning_summary}`, status: 'info' },
          { id: 'al-5', timestamp, step: '05. HITL Gateway', action: 'Draft Response Prepared', agent: activeAgent, details: `Awaiting Human Supervisor Approval for action: ${parsed.decision}`, status: 'hitl' },
        ];

        const isVulnerable = Boolean(parsed.vulnerability_signal_detected || hasHardshipSignal);
        const cleanResponse = isVulnerable
          ? "Your case has been flagged for prioritized care under NordHaven's Vulnerability Protection Protocol. Senior Support Specialist Eleanor Vance has been assigned to your account and will contact you directly within 15 minutes."
          : cleanCustomerMessageText(parsed.customer_response);

        return {
          agent: activeAgent,
          intent: isVulnerable ? 'Vulnerable Customer Protection & Senior Care Escalation' : (parsed.intent || `${activeAgent} Processing`),
          confidence: parsed.confidence || 0.95,
          reasoning_summary: parsed.reasoning_summary,
          retrieved_documents: retrievedDocs,
          policy_used: parsed.policy_used || retrievedDocs[0]?.title,
          tool_calls: toolCalls,
          decision: isVulnerable ? 'route_tier5_specialist' : (parsed.decision || 'general_info'),
          customer_response: cleanResponse,
          draft_letter: parsed.draft_letter,
          audit_log: auditLog,
          vulnerability_signal_detected: isVulnerable,
          assignedSpecialist: isVulnerable ? 'Eleanor Vance (Senior Vulnerability Specialist)' : undefined,
          isChatLocked: isVulnerable,
          recovery_recommendation: parsed.recovery_recommendation,
        };
      }
    } catch (err) {
      console.error('Gemini API call failed, generating deterministic response:', err);
    }
  }

  // Fallback / Deterministic Engine when offline or GEMINI_API_KEY is not set
  return generateDeterministicAgentResponse(userPrompt, customer, retrievedDocs, routedAgent, hasHardshipSignal, history);
}

function generateDeterministicAgentResponse(
  userPrompt: string,
  customer: CustomerProfile,
  retrievedDocs: PolicyDocument[],
  routedAgent: AgentType,
  hasHardshipSignal: boolean,
  history: ChatHistoryItem[] = []
): AgentResponsePayload {
  const timestamp = new Date().toISOString();
  const lowerPrompt = userPrompt.toLowerCase();
  const customerTxs = getCustomerTransactions(customer.accountNumber);
  const currentBalance = getLatestBalance(customer.accountNumber);

  // Check if previous turns involved another agent for cross-agent backend trace
  let crossAgentAuditDetails = '';
  if (history && history.length > 0) {
    const prevTurn = [...history].reverse().find((h) => h.sender === 'agent' && h.agent && h.agent !== routedAgent);
    if (prevTurn) {
      crossAgentAuditDetails = `Context transferred from ${prevTurn.agent} to ${routedAgent}. Prior customer context retained.`;
    }
  }

  // 1. VULNERABLE & HARDSHIP CASE INTERCEPTION
  if (hasHardshipSignal) {
    const policy = MOCK_POLICIES.find((p) => p.citationCode === 'NH-POL-INQ-104') || retrievedDocs[0];
    const specialistName = 'Eleanor Vance (Senior Vulnerability Specialist)';
    return {
      agent: 'Inquiries Agent',
      intent: 'Vulnerable Customer Protection & Senior Care Escalation',
      confidence: 0.99,
      reasoning_summary: `Vulnerability Guardrail Triggered: Customer ${customer.name} expressed financial distress/vulnerability signal (${customer.vulnerabilityStatus}). Case automatically routed to Senior Vulnerability Specialist Eleanor Vance under Policy NH-POL-INQ-104. Customer chat session locked pending specialist contact.`,
      retrieved_documents: [policy],
      policy_used: `${policy.citationCode} - ${policy.title}`,
      tool_calls: [
        { id: 'tc-v1', name: 'triggerVulnerabilityGuardrail', args: { vulnerabilityStatus: customer.vulnerabilityStatus }, result: 'Distress signal verified', timestamp },
        { id: 'tc-v2', name: 'assignSpecialistCase', args: { specialist: 'Eleanor Vance', priority: 'P1-EMERGENCY' }, result: 'Case assigned to Senior Specialist Eleanor Vance', timestamp },
        { id: 'tc-v3', name: 'lockCustomerSession', args: { reason: 'Vulnerable care protocol active' }, result: 'Customer chat input locked', timestamp },
      ],
      decision: 'route_tier5_specialist',
      customer_response: `Your case has been flagged for prioritized care under NordHaven's Vulnerability Protection Protocol. Senior Support Specialist Eleanor Vance has been assigned to your account and will contact you directly within 15 minutes.`,
      draft_letter: `EMERGENCY VULNERABILITY ESCALATION TICKET\nAccount: ${customer.accountNumber}\nCustomer: ${customer.name}\nVulnerability Flag: ${customer.vulnerabilityStatus}\nAssigned Specialist: Eleanor Vance (Senior Vulnerability Lead)\nPriority: P1 - Emergency Outreach Required within 15 Minutes.`,
      audit_log: [
        { id: 'al-v1', timestamp, step: '01. Ingress Triage', action: 'Hardship Guardrail Triggered', agent: 'Orchestrator', details: `Distress signal detected. Policy NH-POL-INQ-104 invoked.`, status: 'warning' },
        { id: 'al-v2', timestamp, step: '02. Specialist Assignment', action: 'Auto-Assign Specialist', agent: 'Orchestrator', details: `Assigned case to Senior Specialist Eleanor Vance.`, status: 'info' },
        { id: 'al-v3', timestamp, step: '03. Session Lock', action: 'Customer Interface Guardrail', agent: 'Orchestrator', details: `Customer chat input locked pending specialist contact.`, status: 'info' },
      ],
      vulnerability_signal_detected: true,
      assignedSpecialist: specialistName,
      isChatLocked: true,
    };
  }

  // 2. Fraud Agent Logic
  if (routedAgent === 'Fraud Agent') {
    const policy = MOCK_POLICIES.find((p) => p.category === 'Fraud & Provisional Credit') || retrievedDocs[0];
    return {
      agent: 'Fraud Agent',
      intent: 'Unauthorized Transaction & Provisional Credit Claim',
      confidence: 0.96,
      reasoning_summary: `SHAP Analysis (Fraud Agent): Transaction location mismatched customer's device geofence. Customer tenure (${customer.tenureYears}y) and Premier status qualify for immediate card freeze and staged provisional credit of $2,450 under Reg E guidelines (NH-POL-FRD-204). ${crossAgentAuditDetails}`,
      retrieved_documents: [policy],
      policy_used: `${policy.citationCode} - ${policy.title}`,
      tool_calls: [
        { id: 'tc-f1', name: 'checkDeviceGeofence', args: { location: 'Location Verification' }, result: 'Mismatch detected. Mobile device in Chicago IL', timestamp },
        { id: 'tc-f2', name: 'stageCardFreeze', args: { cardEnding: '9012' }, result: 'Temporary card freeze staged pending HITL confirmation', timestamp },
        { id: 'tc-f3', name: 'calculateProvisionalCredit', args: { amountUSD: 2450 }, result: 'Provisional credit of $2,450 eligible under Reg E', timestamp },
      ],
      decision: 'provisional_credit',
      customer_response: `We have received your report regarding the $2,450 unauthorized transaction. For your security, an immediate card freeze has been staged on card ending in 9012, and a $2,450 provisional credit is being prepared for your account while our investigation completes.`,
      draft_letter: `OFFICIAL FRAUD NOTICE\nAccount: ${customer.accountNumber}\nDisputed Transaction: $2,450.00\nAction Taken: Temporary card freeze active. Provisional credit of $2,450.00 posted under Regulation E guidelines. Replacement card dispatched via 1-day express courier.`,
      audit_log: [
        { id: 'al-f1', timestamp, step: '01. Ingress Triage', action: 'Orchestrator Routing', agent: 'Orchestrator', details: 'Query classified as unauthorized charge. Routed to [Fraud Agent].', status: 'info' },
        { id: 'al-f2', timestamp, step: '02. Geofence Check', action: 'Location Verification', agent: 'Fraud Agent', details: 'Geofence mismatch verified (Paris vs Chicago).', status: 'warning' },
        { id: 'al-f3', timestamp, step: '03. Policy Validation', action: 'Reg E Compliance Check', agent: 'Fraud Agent', details: 'NH-POL-FRD-204 requirements satisfied.', status: 'success' },
        { id: 'al-f4', timestamp, step: '04. HITL Gateway', action: 'Provisional Credit Staged', agent: 'Fraud Agent', details: 'Awaiting Human Supervisor approval to dispatch replacement card and credit.', status: 'hitl' },
      ],
      vulnerability_signal_detected: false,
    };
  }

  // 3. Payments Agent Logic
  if (routedAgent === 'Payments Agent') {
    const isPayrollQuery = lowerPrompt.includes('payroll') || lowerPrompt.includes('direct deposit') || lowerPrompt.includes('salary');
    const policy = isPayrollQuery
      ? MOCK_POLICIES.find((p) => p.citationCode === 'NH-PAY-306') || retrievedDocs[0]
      : MOCK_POLICIES.find((p) => p.category === 'Wire & Payment Settlement') || retrievedDocs[0];

    const payrollTxs = customerTxs.filter((t) => t.category === 'Income' || t.description.toLowerCase().includes('payroll') || t.description.toLowerCase().includes('deposit'));
    const latestPayroll = payrollTxs[payrollTxs.length - 1];

    const customerResponseText = isPayrollQuery && latestPayroll
      ? `According to our ACH direct deposit ledger, your most recent payroll deposit of $${latestPayroll.amount.toLocaleString()} was posted on ${latestPayroll.date} ("${latestPayroll.description}"). Your current account balance is $${currentBalance.toLocaleString()}.`
      : `We have performed a Fedwire trace (IMAD #20260805NH88921) on your transfer. The funds are currently in final clearing validation and will post to the recipient account within approximately 35 minutes.`;

    return {
      agent: 'Payments Agent',
      intent: isPayrollQuery ? 'Payroll Direct Deposit & Settlement Status Inquiry' : 'Commercial & Wire Transfer Status Trace',
      confidence: 0.95,
      reasoning_summary: isPayrollQuery
        ? `SHAP Analysis (Payments Agent): Evaluated ACH direct deposit policy NH-PAY-306 for ${customer.name}. Verified latest deposit on ${latestPayroll?.date || '2026-07-27'} ($${latestPayroll?.amount || 0}). Running balance: $${currentBalance}. ${crossAgentAuditDetails}`
        : `SHAP Analysis (Payments Agent): Wire transfer for ${customer.name} was traced through Fedwire IMAD/OMAD clearing channels. Fedwire trace confirms release within 35 minutes. ${crossAgentAuditDetails}`,
      retrieved_documents: [policy],
      policy_used: `${policy.citationCode} - ${policy.title}`,
      tool_calls: [
        { id: 'tc-p1', name: 'queryACHLedger', args: { accountNumber: customer.accountNumber }, result: `Retrieved ${payrollTxs.length} income transactions`, timestamp },
        { id: 'tc-p2', name: 'checkDirectDepositPolicy', args: { citation: 'NH-PAY-306' }, result: 'Posting delay rules checked. ACH status verified', timestamp },
      ],
      decision: 'payment_status_update',
      customer_response: customerResponseText,
      draft_letter: `PAYMENT & DEPOSIT SUMMARY\nAccount: ${customer.accountNumber}\nCustomer: ${customer.name}\nLatest Deposit: ${latestPayroll ? `${latestPayroll.date} - $${latestPayroll.amount} (${latestPayroll.description})` : 'N/A'}\nCurrent Balance: $${currentBalance.toLocaleString()}`,
      audit_log: [
        { id: 'al-p1', timestamp, step: '01. Ingress Triage', action: 'Orchestrator Routing', agent: 'Orchestrator', details: `Query classified as Payment/Deposit inquiry. Routed to [Payments Agent].`, status: 'info' },
        { id: 'al-p2', timestamp, step: '02. Ledger Check', action: 'ACH / Wire API Search', agent: 'Payments Agent', details: `Retrieved customer deposit records. Policy ${policy.citationCode} applied.`, status: 'success' },
        { id: 'al-p3', timestamp, step: '03. Customer Notice', action: 'Status Update Generated', agent: 'Payments Agent', details: 'Prepared direct response with settlement timeline.', status: 'info' },
      ],
      vulnerability_signal_detected: false,
    };
  }

  // 4. Product Pitching Agent Logic
  if (routedAgent === 'Product Pitching Agent') {
    const policy = MOCK_POLICIES.find((p) => p.citationCode === 'NH-POL-PITCH-505') || retrievedDocs[0];
    const isRelationshipReview =
      lowerPrompt.includes('relationship') ||
      lowerPrompt.includes('recommend') ||
      lowerPrompt.includes('product') ||
      lowerPrompt.includes('upgrade') ||
      lowerPrompt.includes('fit');

    const yieldAmount = Math.round(currentBalance * 0.0485);
    const customerResponseText = isRelationshipReview
      ? `Thank you for being a valued NordHaven customer for ${customer.tenureYears} years! Based on your ${customer.segment} relationship and current liquid balance of $${currentBalance.toLocaleString()}, we recommend upgrading to our NordHaven Premier High Yield Savings account (4.85% APY), projected to earn +$${yieldAmount.toLocaleString()}/year in guaranteed interest, paired with our Apex Checking tier featuring automated monthly fee waivers. All product upgrades include a mandatory 72-hour cooling-off window with zero obligation.`
      : `Based on your current liquid balance of $${currentBalance.toLocaleString()} and ${customer.tenureYears}-year tenure with NordHaven, you qualify for our Premier High Yield Savings account at 4.85% APY (earning +$${yieldAmount.toLocaleString()}/year) or our 12-Month Certificate of Deposit. All product offers include a mandatory 72-hour cooling-off period under policy NH-POL-PITCH-505.`;

    return {
      agent: 'Product Pitching Agent',
      intent: 'Financial Product Suitability Pitch & Relationship Review',
      confidence: 0.96,
      reasoning_summary: `SHAP Analysis (Product Pitching Agent): Conducted relationship review for ${customer.name} (Segment: ${customer.segment}, Tenure: ${customer.tenureYears}y, Balance: $${currentBalance.toLocaleString()}). Verified suitability under NH-POL-PITCH-505. Staged offer for NordHaven Premier High Yield Savings (4.85% APY) & Apex Checking with 72-hour cooling period disclosure. ${crossAgentAuditDetails}`,
      retrieved_documents: [policy],
      policy_used: `${policy.citationCode} - ${policy.title}`,
      tool_calls: [
        { id: 'tc-pp1', name: 'conductRelationshipReview', args: { tenureYears: customer.tenureYears, segment: customer.segment }, result: `Verified ${customer.tenureYears}-year tenure & ${customer.segment} status`, timestamp },
        { id: 'tc-pp2', name: 'evaluateSuitabilityMatrix', args: { balance: currentBalance }, result: 'Eligible for Premier High Yield Savings (4.85% APY) & Apex Checking', timestamp },
        { id: 'tc-pp3', name: 'calculateYieldProjection', args: { balance: currentBalance }, result: `Projected annual yield: +$${yieldAmount.toLocaleString()}`, timestamp },
        { id: 'tc-pp4', name: 'attachCoolingPeriodDisclosure', args: { windowHrs: 72 }, result: 'Attached mandatory 72h cooling-off disclosure', timestamp },
      ],
      decision: 'general_info',
      customer_response: customerResponseText,
      draft_letter: `RELATIONSHIP REVIEW & PRODUCT RECOMMENDATION SUMMARY\nAccount: ${customer.accountNumber}\nCustomer: ${customer.name} (Tenure: ${customer.tenureYears} Years, Segment: ${customer.segment})\nCurrent Balance: $${currentBalance.toLocaleString()}\n\nRECOMMENDED UPGRADES:\n1. NordHaven Premier High Yield Savings (4.85% APY) - Est. Annual Earnings: +$${yieldAmount.toLocaleString()}\n2. Apex Checking Upgrade (Automated Fee Waiver)\n\nMandatory Compliance Disclosure: Includes a 72-hour risk-free cooling-off period under NH-POL-PITCH-505.`,
      audit_log: [
        { id: 'al-pp1', timestamp, step: '01. Ingress Triage', action: 'Orchestrator Routing', agent: 'Orchestrator', details: 'Query identified as Product / Relationship Review opportunity. Routed to [Product Pitching Agent].', status: 'info' },
        { id: 'al-pp2', timestamp, step: '02. Relationship Audit', action: 'Customer Profile Assessment', agent: 'Product Pitching Agent', details: `Analyzed ${customer.tenureYears}y tenure & $${currentBalance.toLocaleString()} liquid balance.`, status: 'success' },
        { id: 'al-pp3', timestamp, step: '03. Suitability Engine', action: 'NH-POL-PITCH-505 Compliance Check', agent: 'Product Pitching Agent', details: 'Product suitability verified against customer financial profile. Zero mis-selling detected.', status: 'success' },
        { id: 'al-pp4', timestamp, step: '04. Pitch Generation', action: 'Tailored Offer & Disclosure', agent: 'Product Pitching Agent', details: 'Synthesized tailored, non-aggressive product pitch with 72h cooling-off window.', status: 'info' },
      ],
      vulnerability_signal_detected: false,
      recovery_recommendation: {
        productName: 'NordHaven Premier High Yield Savings (4.85% APY)',
        description: 'Earn 4.85% APY on liquid cash reserves with instant transfer capability to checking.',
        eligibilityReason: `Qualified by ${customer.tenureYears}-year tenure and $${currentBalance.toLocaleString()} balance`,
        coolingWindowHrs: 72,
      },
    };
  }

  // 5. Other Agent Logic
  if (routedAgent === 'Other Agent') {
    const policy = MOCK_POLICIES.find((p) => p.citationCode === 'NH-POL-OTH-909') || retrievedDocs[0];
    return {
      agent: 'Other Agent',
      intent: 'General Support & Edge Case Customer Query',
      confidence: 0.91,
      reasoning_summary: `SHAP Analysis (Other Agent): Query received for ${customer.name} fell outside core Fraud, Payments, Inquiries, or Product Pitching categories. Handled via general support guidelines under NH-POL-OTH-909. ${crossAgentAuditDetails}`,
      retrieved_documents: [policy],
      policy_used: `${policy.citationCode} - ${policy.title}`,
      tool_calls: [
        { id: 'tc-o1', name: 'classifyEdgeCaseQuery', args: { userPrompt }, result: 'Categorized under general customer support', timestamp },
        { id: 'tc-o2', name: 'lookupGeneralKnowledgeBase', args: { keywords: 'general' }, result: 'Found matching general support standard operating procedure', timestamp },
      ],
      decision: 'general_info',
      customer_response: `Thank you for contacting NordHaven. We have received your query. Our General Support Team is reviewing your request and will assist you shortly. If you need immediate assistance, you can also reach us at 1-800-NORDHAVEN.`,
      draft_letter: `GENERAL CUSTOMER SUPPORT MEMORANDUM\nAccount: ${customer.accountNumber}\nQuery Type: Non-Standard / General Inquiry\nStatus: Logged into General Customer Support Queue.`,
      audit_log: [
        { id: 'al-o1', timestamp, step: '01. Ingress Triage', action: 'Orchestrator Routing', agent: 'Orchestrator', details: 'Query did not match specific categories. Routed to [Other Agent].', status: 'info' },
        { id: 'al-o2', timestamp, step: '02. General Search', action: 'General KB Retrieval', agent: 'Other Agent', details: 'Applied standard operating procedure NH-POL-OTH-909.', status: 'info' },
        { id: 'al-o3', timestamp, step: '03. Response Staging', action: 'General Response Drafted', agent: 'Other Agent', details: 'Drafted general support response for customer.', status: 'success' },
      ],
      vulnerability_signal_detected: false,
    };
  }

  // 6. Inquiries Agent Logic
  const isCDQuery = lowerPrompt.includes('cd') || lowerPrompt.includes('certificate of deposit') || lowerPrompt.includes('ira cd');
  const isBalanceOrTxQuery = lowerPrompt.includes('balance') || lowerPrompt.includes('transaction') || lowerPrompt.includes('recent') || lowerPrompt.includes('last week') || lowerPrompt.includes('statement');
  
  const policy = isCDQuery
    ? MOCK_POLICIES.find((p) => p.citationCode === 'NH-INQ-105') || retrievedDocs[0]
    : MOCK_POLICIES.find((p) => p.category === 'Fee Waiver') || retrievedDocs[0];

  let customerResponseText = '';
  let decision: AgentResponsePayload['decision'] = 'general_info';

  if (isCDQuery) {
    customerResponseText = `NordHaven offers 6 Month, 12 Month, 24 Month, 36 Month CDs, and an IRA Certificate of Deposit. Interest compounds daily and is credited monthly to your account. Funds may be withdrawn prior to maturity subject to an early withdrawal penalty. Would you like to view current APY rates or open a CD today?`;
  } else if (isBalanceOrTxQuery) {
    const recent5 = customerTxs.slice(-5).reverse();
    const txSummaryLines = recent5.map((t) => `• ${t.date}: ${t.description} — ${t.amount < 0 ? `-$${Math.abs(t.amount)}` : `+$${t.amount}`} (Balance: $${t.running_balance.toLocaleString()})`).join('\n');

    customerResponseText = `Here is your account snapshot for ${customer.accountNumber}:\n\n` +
      `• Current Available Balance: $${currentBalance.toLocaleString()}\n` +
      `• Total 2-Month Ledger Records: ${customerTxs.length} transactions\n\n` +
      `Recent Transactions:\n${txSummaryLines}`;
  } else {
    decision = 'approve_full_waiver';
    const feeTxs = customerTxs.filter((t) => t.type === 'fee' || t.description.toLowerCase().includes('fee'));
    const totalFees = feeTxs.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 105;

    customerResponseText = `Thank you for inquiring about your account. Based on your ${customer.tenureYears}-year tenure with NordHaven and Policy NH-POL-INQ-101, our Inquiries Agent has approved a full $${totalFees}.00 refund of fees to your account (${customer.accountNumber}). Your current available balance is $${currentBalance.toLocaleString()}.`;
  }

  return {
    agent: 'Inquiries Agent',
    intent: isCDQuery ? 'Certificate of Deposit Terms Inquiry' : isBalanceOrTxQuery ? 'Account Balance & Recent Transactions Retrieval' : 'Account Fee Waiver Analysis',
    confidence: 0.96,
    reasoning_summary: `SHAP Analysis (Inquiries Agent): Queried account ledger for ${customer.name} (${customer.accountNumber}). Available balance: $${currentBalance.toLocaleString()}. Verified against RFC Policy ${policy.citationCode}. ${crossAgentAuditDetails}`,
    retrieved_documents: [policy],
    policy_used: `${policy.citationCode} - ${policy.title}`,
    tool_calls: [
      { id: 'tc-i1', name: 'fetchAccountBalance', args: { accountNumber: customer.accountNumber }, result: `Current balance: $${currentBalance.toLocaleString()}`, timestamp },
      { id: 'tc-i2', name: 'queryTransactionLedger', args: { customerId: customer.id, count: customerTxs.length }, result: `Loaded ${customerTxs.length} transaction entries`, timestamp },
      { id: 'tc-i3', name: 'checkPolicyRule', args: { citationCode: policy.citationCode }, result: 'Policy rules validated successfully', timestamp },
    ],
    decision,
    customer_response: customerResponseText,
    draft_letter: `NORDHAVEN FINANCIAL SERVICES - INQUIRY STATEMENT\nDate: ${new Date().toLocaleDateString()}\nAccount: ${customer.accountNumber}\nCustomer: ${customer.name}\nCurrent Balance: $${currentBalance.toLocaleString()}\nPolicy Reference: ${policy.citationCode} - ${policy.title}`,
    audit_log: [
      { id: 'al-i1', timestamp, step: '01. Ingress Triage', action: 'Orchestrator Routing', agent: 'Orchestrator', details: 'Query classified as Account Inquiry. Routed to [Inquiries Agent].', status: 'info' },
      { id: 'al-i2', timestamp, step: '02. Context Retrieval', action: 'RFC Policy Lookup', agent: 'Inquiries Agent', details: `Retrieved ${policy.citationCode}. Loaded ${customerTxs.length} ledger items.`, status: 'info' },
      { id: 'al-i3', timestamp, step: '03. Ledger Processing', action: 'Balance & Tx Lookup', agent: 'Inquiries Agent', details: `Calculated balance $${currentBalance.toLocaleString()}.`, status: 'success' },
      { id: 'al-i4', timestamp, step: '04. HITL Gateway', action: 'Approval Staged', agent: 'Inquiries Agent', details: 'Response prepared for customer.', status: 'hitl' },
    ],
    vulnerability_signal_detected: false,
  };
}
