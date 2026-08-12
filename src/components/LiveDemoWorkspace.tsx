import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  User,
  Bot,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  XCircle,
  Terminal,
  Zap,
  RotateCcw,
  BookOpen,
  UserCheck,
  AlertCircle,
  ArrowRight,
  Cpu,
  Layers,
  HelpCircle,
  CreditCard,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Building2,
  Lock,
  Activity,
  Award,
  FileText,
  Calculator,
  Download,
  ChevronRight,
  Info,
  Star,
  Check,
  X,
  PieChart,
  ShieldAlert
} from 'lucide-react';
import {
  AgentResponsePayload,
  CustomerProfile,
  ChatMessage,
  InteractionStatus,
  AgentType,
  AuditLogItem
} from '../types';
import { MOCK_CUSTOMERS } from '../data/mockData';
import { getCustomerTransactions, getLatestBalance } from '../data/transactions';

interface LiveDemoWorkspaceProps {
  selectedCustomer: CustomerProfile;
  onSelectCustomer: (cust: CustomerProfile) => void;
  messages: ChatMessage[];
  onSendMessage: (promptText: string) => Promise<void>;
  isLoading: boolean;
  loadingStep?: string;
  latestPayload: AgentResponsePayload | null;
  onHitlDecision: (messageId: string, status: InteractionStatus, editedResponse?: string, overrideReason?: string) => void;
  onResetDemo: () => void;
}

export const LiveDemoWorkspace: React.FC<LiveDemoWorkspaceProps> = ({
  selectedCustomer,
  onSelectCustomer,
  messages,
  onSendMessage,
  isLoading,
  loadingStep,
  latestPayload,
  onHitlDecision,
  onResetDemo,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const [overrideReasonInput, setOverrideReasonInput] = useState('');
  const [showOverrideModal, setShowOverrideModal] = useState<string | null>(null);
  const [draftTab, setDraftTab] = useState<'response' | 'letter'>('response');
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>('Eleanor Vance (Senior Vulnerability Specialist)');
  const [overrideNotice, setOverrideNotice] = useState<string | null>(null);

  // Customer Side Hub & Modal States
  const [activeCustomerModal, setActiveCustomerModal] = useState<'none' | 'insights' | 'planning' | 'statements'>('none');
  const [planningDepositAmount, setPlanningDepositAmount] = useState<number>(25000);
  const [csatScore, setCsatScore] = useState<number | null>(null);
  const [csatSubmitted, setCsatSubmitted] = useState<boolean>(false);
  const [csatStep, setCsatStep] = useState<'rating' | 'high_rating_offers' | 'low_rating_ask' | 'low_rating_feedback_input' | 'ended'>('rating');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [isCustomerSatisfied, setIsCustomerSatisfied] = useState<boolean>(false);
  const [statementSearch, setStatementSearch] = useState<string>('');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Reset resolution states when active customer changes
  useEffect(() => {
    setIsCustomerSatisfied(false);
    setCsatSubmitted(false);
    setCsatScore(null);
    setCsatStep('rating');
    setFeedbackText('');
    setFeedbackSubmitted(false);
  }, [selectedCustomer.id]);

  const cleanCustomerFacingText = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\[Orchestrator[^\]]*\]/gi, '')
      .replace(/\[[^\]]*Agent\s+Response\]/gi, '')
      .replace(/\[[^\]]*Shared Memory[^\]]*\]/gi, '')
      .replace(/^Dear\s+[A-Za-z\s]+,?\s*/i, '')
      .trim();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;
    const text = inputPrompt;
    setInputPrompt('');
    await onSendMessage(text);
  };

  const latestAgentMessage = [...messages].reverse().find((m) => m.sender === 'agent' && m.agentPayload);
  const currentPayload = latestAgentMessage?.agentPayload || latestPayload;

  // Helper badge styles for the 5 agents
  const getAgentBadgeStyle = (agentName?: AgentType | string) => {
    switch (agentName) {
      case 'Inquiries Agent':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Payments Agent':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Fraud Agent':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Product Pitching Agent':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Other Agent':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Agent Icon helper
  const renderAgentIcon = (agentName?: AgentType | string) => {
    switch (agentName) {
      case 'Inquiries Agent':
        return <HelpCircle className="w-3.5 h-3.5 text-blue-600" />;
      case 'Payments Agent':
        return <DollarSign className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Fraud Agent':
        return <CreditCard className="w-3.5 h-3.5 text-red-600" />;
      case 'Product Pitching Agent':
        return <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Other Agent':
        return <MessageSquare className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Session & Customer Toolbar */}
      <div className="nh-material-1 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold" style={{ background: 'var(--nh-accent-wash)', border: '1px solid var(--nh-border)', color: 'var(--nh-accent-soft)' }}>
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Live Operations Workspace & Agent Routing
            </h2>
            <p className="text-[11px]" style={{ color: 'var(--nh-label-tertiary)' }}>
              Orchestration Control Plane automatically routes customer queries to one of the 5 specialist agents.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Customer Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium hidden md:inline" style={{ color: 'var(--nh-label-tertiary)' }}>Account:</span>
            <select
              value={selectedCustomer.id}
              onChange={(e) => {
                const cust = MOCK_CUSTOMERS.find((c) => c.id === e.target.value);
                if (cust) onSelectCustomer(cust);
              }}
              className="nh-material-2 text-xs font-medium text-white rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              {MOCK_CUSTOMERS.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#1c1c1e] text-white">
                  {c.name} ({c.segment})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onResetDemo}
            className="nh-press flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl cursor-pointer text-white"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--nh-border)' }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Session</span>
          </button>
        </div>
      </div>

      {/* Main Balanced 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Customer 360 & Chat Interaction Feed (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          
          {/* Active Customer Profile Box */}
          <div className="nh-material-1 rounded-2xl p-4 shadow-xl text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-purple-950/80">
                  {selectedCustomer.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    {selectedCustomer.name}
                    <span className="text-xs text-white/60 font-normal">({selectedCustomer.accountNumber})</span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-white/60 mt-0.5">
                    <span className="text-white/55 font-medium">{selectedCustomer.segment}</span>
                    <span>•</span>
                    <span>Tenure: {selectedCustomer.tenureYears} yrs</span>
                    <span>•</span>
                    <span>Val: {selectedCustomer.annualRevenueValue}/yr</span>
                  </div>
                </div>
              </div>

              {selectedCustomer.vulnerabilityStatus !== 'None' ? (
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-amber-950/80 text-amber-300 border border-amber-600/80 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  Hardship Flag
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-white/[0.06] text-white/80 border border-white/[0.08]">
                  Standard Account
                </span>
              )}
            </div>
          </div>

          {/* Chat Stream Window */}
          <div className="nh-material-1 rounded-2xl p-4 flex-1 flex flex-col min-h-[480px] shadow-xl text-white">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/80">
                <Terminal className="w-4 h-4 text-purple-400" />
                Customer Interaction Feed
              </div>
              <span className="text-[11px] text-white/50 font-mono">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Chat Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[420px] nh-material-inset p-3 rounded-xl nh-scroll-fade">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/50 my-auto">
                  <Bot className="w-10 h-10 mb-2 text-purple-400" />
                  <p className="text-xs font-medium text-white">No active conversation yet</p>
                  <p className="text-[11px] text-white/60 mt-1 max-w-sm">
                    Type a query below (e.g., fee waivers, wire trace status, unauthorized charge report, savings APY pitch, or general questions) to test Orchestrator routing.
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isUser = msg.sender === 'customer';
                  const activeAgentName = msg.agentPayload?.agent;

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 14, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                          isUser
                            ? 'bg-purple-600 text-white'
                            : 'nh-material-2 text-white/70'
                        }`}
                      >
                        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>

                      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                        {/* Header info with explicit Agent Name Pill */}
                        <div className="flex items-center gap-2 text-[10px] text-white/50 mb-1 px-1">
                          <span className="font-semibold text-white">
                            {isUser ? selectedCustomer.name : 'NordHaven AI'}
                          </span>

                          {!isUser && activeAgentName && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${getAgentBadgeStyle(activeAgentName)}`}>
                              {renderAgentIcon(activeAgentName)}
                              {activeAgentName}
                            </span>
                          )}

                          <span>•</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        {/* Content Bubble */}
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isUser
                              ? 'bg-gradient-to-r from-purple-800 to-purple-700 text-white rounded-tr-none shadow-md border border-purple-500/50'
                              : 'nh-material-2 text-white rounded-tl-none shadow-md'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{isUser ? msg.text : cleanCustomerFacingText(msg.text)}</p>

                          {/* HITL Decision Badge on Agent Message */}
                          {msg.hitlDecision && (
                            <div className="mt-3 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px]">
                              <span className="text-white/60">Supervisor Decision:</span>
                              {msg.hitlDecision.status === 'approved' && (
                                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-700/80 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Approved & Dispatched
                                </span>
                              )}
                              {msg.hitlDecision.status === 'edited_and_approved' && (
                                <span className="px-2 py-0.5 rounded bg-white/[0.06] text-white/80 font-semibold border border-white/[0.08] flex items-center gap-1">
                                  <Edit3 className="w-3 h-3 text-purple-400" /> Edited & Dispatched
                                </span>
                              )}
                              {msg.hitlDecision.status === 'overridden' && (
                                <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 font-semibold border border-red-700/80 flex items-center gap-1">
                                  <XCircle className="w-3 h-3 text-red-400" /> Overridden / Rejected
                                </span>
                              )}
                              {msg.hitlDecision.status === 'escalated_human' && (
                                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-semibold border border-amber-700/80 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 text-amber-400" /> Tier 5 Escalated
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                </AnimatePresence>
              )}

              {isLoading && (
                <div className="nh-material-2 rounded-2xl p-4 my-2 text-white">
                  <div className="flex items-start gap-3.5">
                    {/* NordHaven Brand Icon with pulse effect */}
                    <div className="relative shrink-0 mt-0.5">
                      <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-950/80">
                        <Building2 className="w-5 h-5 animate-pulse" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>NordHaven AI Decision Engine</span>
                          <span className="text-[10px] font-mono text-white/80 bg-white/[0.06] px-1.5 py-0.5 rounded font-semibold border border-white/[0.08]">
                            Autonomous Processing
                          </span>
                        </span>
                        <span className="text-[10px] text-white/60 font-mono">CFPB Compliant</span>
                      </div>

                      {/* Dynamic Buffering Step Message */}
                      <div className="text-xs font-medium text-white/80 flex items-center gap-2 my-1.5 nh-material-inset p-2.5 rounded-xl shadow-inner">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping shrink-0" />
                        <span className="truncate">{loadingStep || 'Processing request...'}</span>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden mt-2">
                        <div className="bg-gradient-to-r from-purple-500 via-purple-400 to-emerald-400 h-full rounded-full animate-pulse transition-all duration-500 w-4/5" />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-white/60 mt-2">
                        <span>Routing, RAG context retrieval & SHAP evaluation...</span>
                        <span className="font-mono text-emerald-400 font-semibold">3-5s Buffer</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FLOATING CSAT & RESOLUTION FEEDBACK CARD */}
              {(() => {
                const hasTypedThankYou = messages.some((m) => {
                  if (m.sender !== 'customer' && m.sender !== 'user') return false;
                  const text = m.text.toLowerCase();
                  return (
                    text.includes('thank you for resolving') ||
                    text.includes('thanks for resolving') ||
                    text.includes('issue is resolved') ||
                    text.includes('my issue is resolved') ||
                    text.includes('problem is resolved') ||
                    text.includes('resolved my issue') ||
                    text.includes('resolved the issue')
                  );
                });

                if (isLoading || !hasTypedThankYou) return null;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
                    className="mt-3 nh-material-3 rounded-2xl p-4 text-white">
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-neutral-800">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white">
                          Resolution Feedback & CSAT Survey
                        </span>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#1c1c1c] text-[#D899FF] border border-neutral-700">
                        Customer Experience
                      </span>
                    </div>

                    {/* QUESTION 1: SCORECARD 1 TO 10 */}
                    {csatStep === 'rating' && (
                      <div>
                        <div className="text-xs font-semibold text-white mb-1">
                          How would you rate this issue resolution?
                        </div>
                        <p className="text-[11px] text-neutral-400 mb-3">
                          Click a rating score from 1 (Poor) to 10 (Exceptional):
                        </p>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                            <button
                              key={score}
                              type="button"
                              onClick={() => {
                                setCsatScore(score);
                                setCsatSubmitted(true);
                                setIsCustomerSatisfied(true);
                                if (score > 5) {
                                  setCsatStep('high_rating_offers');
                                } else {
                                  setCsatStep('low_rating_ask');
                                }
                              }}
                              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center border ${
                                score <= 3
                                  ? 'bg-[#1c1c1c] hover:bg-red-600 hover:text-white border-red-500/50 text-red-300'
                                  : score <= 5
                                  ? 'bg-[#1c1c1c] hover:bg-amber-500 hover:text-white border-amber-500/50 text-amber-300'
                                  : 'bg-[#1c1c1c] hover:bg-[#A100FF] hover:text-white border-purple-500/50 text-white/80'
                              }`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-neutral-400 mt-2 px-1 font-mono">
                          <span className="text-red-300">1-3 Low</span>
                          <span className="text-amber-300">4-5 Neutral</span>
                          <span className="text-[#D899FF] font-semibold">6-10 High</span>
                        </div>
                      </div>
                    )}

                    {/* STEP 2A: RATING > 5 -> OFFERS, STATEMENTS & FINANCIAL PLANNING CTAs */}
                    {csatStep === 'high_rating_offers' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Rating {csatScore}/10 recorded! Thank you for your feedback.</span>
                        </div>
                        <p className="text-xs text-neutral-200 leading-relaxed">
                          Would you like to explore recommended offers, view your account balances & statements, or perform financial planning?
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setActiveCustomerModal('insights')}
                            className="p-2.5 bg-[#222222] hover:bg-[#333333] border border-neutral-700 rounded-xl transition cursor-pointer text-left flex flex-col justify-between group shadow-md"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <Award className="w-4 h-4 text-amber-400" />
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white group-hover:text-amber-300">Recommended Offers</div>
                              <div className="text-[10px] text-neutral-400">Tenure Perks & Health Score</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveCustomerModal('statements')}
                            className="p-2.5 bg-[#222222] hover:bg-[#333333] border border-neutral-700 rounded-xl transition cursor-pointer text-left flex flex-col justify-between group shadow-md"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <FileText className="w-4 h-4 text-[#D899FF]" />
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white group-hover:text-white/80">Balances & Statements</div>
                              <div className="text-[10px] text-neutral-400">2-Mo Ledger & Statements</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveCustomerModal('planning')}
                            className="p-2.5 bg-[#222222] hover:bg-[#333333] border border-neutral-700 rounded-xl transition cursor-pointer text-left flex flex-col justify-between group shadow-md"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <TrendingUp className="w-4 h-4 text-emerald-400" />
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white group-hover:text-emerald-300">Financial Planning</div>
                              <div className="text-[10px] text-neutral-400">Yield Calculator & Goals</div>
                            </div>
                          </button>
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => setCsatStep('ended')}
                            className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
                          >
                            No thanks, my issue is resolved
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2B: RATING <= 5 -> ASK YES OR NO FOR FEEDBACK */}
                    {csatStep === 'low_rating_ask' && (
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                          <span>Rating {csatScore}/10 recorded.</span>
                        </div>
                        <p className="text-xs text-neutral-200 leading-relaxed">
                          We're sorry your resolution experience was not fully satisfying. Would you like to explain what we can improve?
                        </p>

                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => setCsatStep('low_rating_feedback_input')}
                            className="px-4 py-2 bg-[#A100FF] hover:bg-[#8B00DC] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Yes, I'd like to explain</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCsatStep('ended')}
                            className="px-4 py-2 bg-[#222222] hover:bg-[#333333] text-neutral-200 border border-neutral-700 font-semibold text-xs rounded-xl cursor-pointer"
                          >
                            No, thank you
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2B-2: FEEDBACK INPUT CHAT WINDOW (IF YES) */}
                    {csatStep === 'low_rating_feedback_input' && (
                      <div className="space-y-3">
                        <div className="text-xs font-semibold text-neutral-200">
                          Please let us know how we can improve our resolution process or service:
                        </div>
                        <textarea
                          rows={3}
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Type your feedback here..."
                          className="w-full bg-[#111111] border border-neutral-700 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#A100FF] font-sans resize-none"
                        />
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setFeedbackSubmitted(true);
                              setCsatStep('ended');
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Submit Feedback</span>
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: ENDED STATE */}
                    {csatStep === 'ended' && (
                      <div className="p-3 bg-[#222222] rounded-xl border border-neutral-700 text-xs text-neutral-200 leading-relaxed flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <span className="font-bold text-white block mb-0.5">Thank you for trusting NordHaven Financial Services!</span>
                          <span className="text-[11px] text-neutral-300">
                            {feedbackSubmitted
                              ? 'Your feedback has been submitted to our customer quality team. We appreciate your input and are dedicated to continuously improving your experience.'
                              : 'Your feedback is recorded. We are always here to serve you.'}
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })()}
            </div>

            {/* Input Form or Vulnerable Lockout Banner */}
            {selectedCustomer.vulnerabilityStatus !== 'None' || Boolean(currentPayload?.vulnerability_signal_detected) || currentPayload?.decision === 'route_tier5_specialist' || currentPayload?.isChatLocked ? (
              <div className="mt-3 pt-3 border-t border-neutral-800 bg-amber-950/80 p-3.5 rounded-xl border border-amber-600/80 flex items-center justify-between gap-3 text-amber-200 shadow-lg">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 text-xs">
                    <div className="font-bold text-amber-100 flex items-center gap-1.5">
                      <span>Chat Session Locked — Transferred to Human Support</span>
                      <span className="px-1.5 py-0.5 bg-amber-900 text-amber-200 rounded font-mono text-[9px] font-bold border border-amber-700">P1 Protocol</span>
                    </div>
                    <p className="text-[11px] text-amber-300 truncate mt-0.5">
                      Assigned Specialist: <strong>{currentPayload?.assignedSpecialist || selectedSpecialist}</strong>. Automated typing paused.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-200 bg-amber-900/90 px-2.5 py-1 rounded-lg border border-amber-700 shrink-0">
                  Locked for Customer Protection
                </span>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="mt-3 pt-3 border-t border-neutral-800 flex gap-2">
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder={`Type customer message as ${selectedCustomer.name}...`}
                  disabled={isLoading}
                  className="nh-press flex-1 nh-material-inset rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none disabled:opacity-50 font-sans"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputPrompt.trim()}
                  className="px-4 py-2.5 bg-[#A100FF] hover:bg-[#8B00DC] disabled:bg-neutral-800 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer disabled:cursor-not-allowed shadow-md shadow-[#A100FF]/20"
                >
                  <span>Submit</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

          {/* LIVE CASE RESOLUTION CARD */}
          <div className="nh-material-1 rounded-2xl p-4 shadow-xl text-white flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  Live Case Resolution & SLA
                </span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-white/[0.06] text-white/80 border border-white/[0.08] font-mono">
                {currentPayload?.agent || 'Orchestrator Active'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="nh-material-2">
                <div className="text-[10px] uppercase font-bold text-white/60 mb-0.5">Active Inquiry Intent</div>
                <div className="font-semibold text-white truncate">
                  {currentPayload?.intent || 'General Banking Inquiry'}
                </div>
              </div>

              <div className="nh-material-2">
                <div className="text-[10px] uppercase font-bold text-white/60 mb-0.5">Governing Policy Rules</div>
                <div className="font-semibold text-white truncate">
                  {currentPayload?.policy_used || 'NH-POL-INQ-101 - General Service Rules'}
                </div>
              </div>

              <div className="nh-material-2">
                <div className="text-[10px] uppercase font-bold text-white/60 mb-0.5">Assigned Specialist Agent</div>
                <div className="font-semibold text-white truncate flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  {currentPayload?.assignedSpecialist || currentPayload?.agent || 'Autonomous AI Agent'}
                </div>
              </div>

              <div className="nh-material-2">
                <div className="text-[10px] uppercase font-bold text-white/60 mb-0.5">Resolution SLA / Target ETA</div>
                <div className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {selectedCustomer.vulnerabilityStatus !== 'None' || currentPayload?.vulnerability_signal_detected
                    ? 'P1 Protocol — 15 Min Senior Outreach'
                    : currentPayload?.agent === 'Fraud Agent'
                    ? 'Instant Freeze & Reg E Credit Staged'
                    : currentPayload?.agent === 'Payments Agent'
                    ? 'Fedwire IMAD Active (ETA 35 Mins)'
                    : 'Instant Autonomous Resolution'}
                </div>
              </div>
            </div>

            {/* SLA Resolution Progress Steps */}
            <div className="mt-1 pt-2 border-t border-white/[0.08]">
              {(() => {
                const hasHitlApproval = messages.some((m) => m.sender === 'agent' && m.hitlDecision);
                const isVulnerableEscalation = selectedCustomer.vulnerabilityStatus !== 'None' ||
                  Boolean(currentPayload?.vulnerability_signal_detected) ||
                  currentPayload?.decision === 'route_tier5_specialist';
                
                const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user')?.text.toLowerCase() || '';
                const lastAgentMsg = [...messages].reverse().find((m) => m.sender === 'agent')?.text.toLowerCase() || '';

                const userResolutionSignal = [
                  'thank', 'thanks', 'resolved', 'perfect', 'great', 'awesome', 'goodbye', 'bye',
                  'done', 'complete', 'all set', 'that helps', 'cleared'
                ].some((kw) => lastUserMsg.includes(kw));

                const agentResolutionSignal = [
                  'has been resolved', 'issue resolved', 'refund processed', 'credit staged',
                  'card frozen', 'transfer scheduled', 'escalated to senior', 'specialist assigned',
                  'transferred to human support', 'thank you for contacting', 'happy to help'
                ].some((phrase) => lastAgentMsg.includes(phrase));

                const isStage3 = isCustomerSatisfied || csatSubmitted || csatScore !== null || hasHitlApproval ||
                  (isVulnerableEscalation && messages.some((m) => m.sender === 'agent')) ||
                  userResolutionSignal || agentResolutionSignal ||
                  currentPayload?.resolution_status === 'resolved';

                const hasAgentResponse = messages.some((m) => m.sender === 'agent');
                const isStage2 = !isStage3 && (hasAgentResponse || isLoading);
                const stageNum = isStage3 ? 3 : isStage2 ? 2 : 1;

                return (
                  <>
                    <div className="flex items-center justify-between text-[10px] font-semibold mb-1.5">
                      <span className="text-white/75 flex items-center gap-1">
                        <span>Resolution Pipeline:</span>
                        {stageNum === 3 && <span className="text-emerald-400 font-bold">Stage 3 of 3 (Resolution Complete)</span>}
                        {stageNum === 2 && <span className="text-amber-400 font-bold">Stage 2 of 3 (Policy RAG & Processing)</span>}
                        {stageNum === 1 && <span className="text-red-400 font-bold">Stage 1 of 3 (Ingress Triage)</span>}
                      </span>

                      {/* Status Badge */}
                      {stageNum === 3 && (
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-emerald-950 text-emerald-300 border border-emerald-700/80 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> Green: Stage 3 Resolved
                        </span>
                      )}
                      {stageNum === 2 && (
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-amber-950 text-amber-300 border border-amber-700/80 uppercase tracking-wider">
                          Yellow: Stage 2 Processing
                        </span>
                      )}
                      {stageNum === 1 && (
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-red-950 text-red-300 border border-red-700/80 uppercase tracking-wider">
                          Red: Stage 1 Ingress
                        </span>
                      )}
                    </div>

                    {/* Progress Bars */}
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                          stageNum === 1
                            ? 'bg-red-500 shadow-md'
                            : stageNum === 2
                            ? 'bg-amber-400'
                            : 'bg-emerald-500'
                        }`}
                        title="Stage 1: Ingress & Intent Triage"
                      ></div>

                      <div
                        className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                          stageNum === 1
                            ? 'bg-white/[0.06] border border-white/[0.08]'
                            : stageNum === 2
                            ? 'bg-amber-400 shadow-md'
                            : 'bg-emerald-500'
                        }`}
                        title="Stage 2: Policy RAG & Ledger Processing"
                      ></div>

                      <div
                        className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                          stageNum === 3
                            ? 'bg-emerald-500 shadow-md'
                            : 'bg-white/[0.06] border border-white/[0.08]'
                        }`}
                        title="Stage 3: Customer Satisfied & SLA Met"
                      ></div>
                    </div>

                    {/* Stage Step Descriptions */}
                    <div className="grid grid-cols-3 gap-1 mt-1.5 text-[9px]">
                      <div className={`font-semibold text-left ${stageNum === 1 ? 'text-red-400' : stageNum === 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        01. Ingress Triage
                      </div>
                      <div className={`font-semibold text-center ${stageNum === 1 ? 'text-purple-400/60' : stageNum === 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        02. RAG & Ledger
                      </div>
                      <div className={`font-semibold text-right ${stageNum === 3 ? 'text-emerald-400 font-bold' : 'text-purple-400/60'}`}>
                        03. Resolved & Escalated
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* FINANCIAL HEALTH SNAPSHOT CARD */}
          <div className="nh-material-1 rounded-2xl p-4 shadow-xl text-white flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Customer Financial Health Snapshot
                </span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-white/[0.06] text-white/80 border border-white/[0.08]">
                CSAT Protection Active
              </span>
            </div>

            <div className="flex items-center justify-between bg-gradient-to-r from-purple-950 via-[#1e0f38] to-[#120724] border border-white/[0.08] text-white p-3.5 rounded-xl shadow-md">
              <div>
                <div className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Overall Financial Wellness Score</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-extrabold text-emerald-400">88</span>
                  <span className="text-xs text-white/60">/ 100</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-950 text-emerald-300 rounded border border-emerald-700/80">
                    Excellent Health
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-white/60">Tenure Tier</div>
                <div className="text-xs font-bold text-amber-300 mt-0.5 flex items-center gap-1 justify-end">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  {selectedCustomer.tenureYears}-Yr Gold Member
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="nh-material-2 text-center">
                <div className="text-[9px] uppercase font-bold text-white/60">Available Balance</div>
                <div className="font-bold text-white mt-0.5">
                  ${getLatestBalance(selectedCustomer.accountNumber).toLocaleString()}
                </div>
              </div>
              <div className="nh-material-2 text-center">
                <div className="text-[9px] uppercase font-bold text-white/60">Savings APY</div>
                <div className="font-bold text-emerald-400 mt-0.5">4.85% APY</div>
              </div>
              <div className="nh-material-2 text-center">
                <div className="text-[9px] uppercase font-bold text-white/60">Security Shield</div>
                <div className="font-bold text-white/55 mt-0.5">100% Protected</div>
              </div>
            </div>
          </div>

          {/* CUSTOMER ACTION HUB - 3 INTERACTIVE CTAs */}
          <div className="nh-material-1 rounded-2xl p-4 shadow-xl text-white flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                  Customer Self-Service Action Hub
                </span>
              </div>
              <span className="text-[10px] text-white/60 font-medium">CSAT & Loyalty Boosters</span>
            </div>

            <p className="text-[11px] text-white/65 leading-normal">
              Empower customers with transparent insights, financial planning tools, and ledger statements—improving CSAT and retention without pushy mis-selling:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setActiveCustomerModal('insights')}
                className="nh-press p-3 nh-material-2 hover:border-[#A100FF]/50 rounded-xl transition-colors cursor-pointer text-left flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <ChevronRight className="w-3.5 h-3.5 text-white/55 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-white/80 transition-colors">
                    Obtain Deeper Insights
                  </div>
                  <div className="text-[10px] text-white/60 mt-0.5">
                    Health Rating & Tenure Rewards
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveCustomerModal('planning')}
                className="nh-press p-3 nh-material-2 hover:border-emerald-500/50 rounded-xl transition-colors cursor-pointer text-left flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <ChevronRight className="w-3.5 h-3.5 text-white/55 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Financial Planning
                  </div>
                  <div className="text-[10px] text-white/60 mt-0.5">
                    CD Yield Calculator & Goals
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveCustomerModal('statements')}
                className="nh-press p-3 nh-material-2 hover:border-[#D899FF]/50 rounded-xl transition-colors cursor-pointer text-left flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-4 h-4 text-white/55 group-hover:scale-110 transition-transform" />
                  <ChevronRight className="w-3.5 h-3.5 text-white/55 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-white/80 transition-colors">
                    Balances & Statements
                  </div>
                  <div className="text-[10px] text-white/60 mt-0.5">
                    2-Mo Ledger & e-Statements
                  </div>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: AI Agent Reasoner & HITL Control Center (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          
          {/* AI Operational Inspector */}
          <div className="nh-material-1 rounded-2xl p-5 shadow-xl text-white flex-1 flex flex-col justify-between">
            <div>
              {/* Header Badge & Explicit Routed Agent Display */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div>
                  <div className="text-[10px] uppercase font-bold text-white/60 tracking-wider flex items-center gap-1.5 mb-1">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    Orchestrator Control Plane
                  </div>

                  {currentPayload ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/65">Routed Agent:</span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${getAgentBadgeStyle(currentPayload.agent)}`}>
                        {renderAgentIcon(currentPayload.agent)}
                        {currentPayload.agent}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-purple-400/80 italic">Waiting for query...</span>
                  )}
                </div>

                {currentPayload && (
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-white/65">Confidence:</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 bg-white/[0.06] rounded-full h-2 overflow-hidden border border-white/[0.08]">
                        <div
                          className="bg-emerald-400 h-full rounded-full"
                          style={{ width: `${(currentPayload.confidence * 100).toFixed(0)}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-emerald-400">
                        {(currentPayload.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {!currentPayload ? (
                <div className="py-16 text-center text-white/50 flex flex-col items-center">
                  <ShieldCheck className="w-12 h-12 mb-3 text-purple-400/80" />
                  <p className="text-sm font-semibold text-white">Backend Operational Inspector Idle</p>
                  <p className="text-xs text-white/60 max-w-md mt-1">
                    Send a query on the left. The Orchestrator will route it to either Inquiries Agent, Payments Agent, Fraud Agent, Product Pitching Agent, or Other Agent, displaying full RAG policy citations and SHAP rationale here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  
                  {/* Explicit Routing Architecture Banner */}
                  <div className="nh-material-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1.5">
                      Orchestrator Routing & Intent Classification
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-white nh-material-inset">
                      <span className="px-2 py-0.5 bg-white/[0.06] text-white/80 rounded border border-white/[0.08]">
                        Orchestrator
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className={`px-2 py-0.5 rounded border ${getAgentBadgeStyle(currentPayload.agent)}`}>
                        {currentPayload.agent}
                      </span>
                      <span className="text-white/60 font-normal ml-auto text-[11px] truncate">
                        Intent: {currentPayload.intent}
                      </span>
                    </div>
                  </div>

                  {/* Hardship Alert Banner */}
                  {currentPayload.vulnerability_signal_detected && (
                    <div className="p-3.5 bg-red-950/80 border border-red-700/80 rounded-xl text-xs text-red-200">
                      <div className="font-bold flex items-center gap-2 text-red-300 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        TIER 5 SPECIALIST MANDATE DETECTED
                      </div>
                      <p>
                        Distress keywords detected. System has auto-staged immediate transfer to a Certified Vulnerability Specialist.
                      </p>
                    </div>
                  )}

                  {/* Retrieved Policy (RAG Engine Context) */}
                  <div className="nh-material-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                        Retrieved Policy Document (RAG Context for {currentPayload.agent})
                      </span>
                      <span className="text-[11px] font-mono text-white/80 bg-white/[0.06] px-2 py-0.5 rounded border border-white/[0.08]">
                        {currentPayload.policy_used}
                      </span>
                    </div>

                    {currentPayload.retrieved_documents.map((doc) => (
                      <div key={doc.id} className="text-xs text-white nh-material-inset mb-1.5">
                        <div className="font-semibold text-white">{doc.title}</div>
                        <p className="text-[11px] text-white/60 mt-1">{doc.summary}</p>
                        <div className="mt-2 space-y-1">
                          {doc.mandatoryRules.map((rule, idx) => (
                            <div key={idx} className="text-[10px] text-white/80 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>{rule}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SHAP Reasoning Summary */}
                  <div className="nh-material-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      SHAP Reasoning & Rationale Summary ({currentPayload.agent})
                    </div>
                    <p className="text-xs text-white leading-relaxed font-sans nh-material-inset/80">
                      {currentPayload.reasoning_summary}
                    </p>
                  </div>

                  {/* Executed Tool Calls */}
                  <div className="nh-material-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-2 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      Executed Tool Invocations ({currentPayload.tool_calls.length})
                    </div>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {currentPayload.tool_calls.map((tc) => (
                        <div key={tc.id} className="flex items-start justify-between gap-2 p-2 rounded nh-material-inset text-[11px] font-mono">
                          <div>
                            <span className="text-white/55 font-bold">{tc.name}()</span>
                            <span className="text-white/50 ml-2">{JSON.stringify(tc.args)}</span>
                          </div>
                          <span className="text-emerald-400 font-bold shrink-0 text-[10px]">{tc.result}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Draft Customer Response & Resolution Letter */}
                  <div className="nh-material-2">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDraftTab('response')}
                          className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition ${
                            draftTab === 'response' ? 'bg-purple-600 text-white' : 'text-white/55 hover:text-white'
                          }`}
                        >
                          Customer Response Draft
                        </button>
                        {currentPayload.draft_letter && (
                          <button
                            onClick={() => setDraftTab('letter')}
                            className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition ${
                              draftTab === 'letter' ? 'bg-purple-600 text-white' : 'text-white/55 hover:text-white'
                            }`}
                          >
                            CFPB Formal Letter Draft
                          </button>
                        )}
                      </div>

                      <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-700/80">
                        Awaiting Human Approval
                      </span>
                    </div>

                    <div className="nh-material-inset text-xs text-white font-sans whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                      {draftTab === 'response' ? currentPayload.customer_response : currentPayload.draft_letter}
                    </div>
                  </div>

                  {/* Product Recommendation if Product Pitching Agent or Recovery */}
                  {currentPayload.recovery_recommendation && (
                    <div className="bg-white/[0.06] p-3 rounded-xl border border-white/[0.08] text-xs text-white">
                      <div className="font-bold flex items-center gap-1.5 text-white/80 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Product Opportunity ({currentPayload.recovery_recommendation.productName})
                      </div>
                      <p className="text-[11px] text-white/75">{currentPayload.recovery_recommendation.description}</p>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Human-in-the-Loop (HITL) Action Control Bar */}
            {latestAgentMessage && (
              <div className="mt-5 pt-4 border-t border-white/[0.08] nh-material-2 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Human-in-the-Loop (HITL) Approval Gateway
                    </span>
                  </div>
                  <span className="text-[11px] text-white/60">
                    Supervisor: <strong className="text-white">S. Miller (#4092)</strong>
                  </span>
                </div>

                {/* Supervisor Vulnerability Alert & Specialist Override Panel */}
                {(selectedCustomer.vulnerabilityStatus !== 'None' || currentPayload?.vulnerability_signal_detected || currentPayload?.decision === 'route_tier5_specialist') && (
                  <div className="mb-4 p-4 bg-amber-950/80 border border-amber-600/80 rounded-xl text-xs text-amber-200 shadow-md">
                    <div className="flex items-center justify-between font-bold text-amber-100 mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
                        <span>SUPERVISOR ALERT: VULNERABLE CASE ASSIGNED</span>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-900 text-amber-200 rounded font-mono text-[10px] border border-amber-700">
                        Priority: P1 Tier 5
                      </span>
                    </div>

                    <p className="text-[11px] text-amber-200/90 mb-3 leading-relaxed">
                      This customer query has triggered Policy NH-POL-INQ-104 (Vulnerability Guardrail). Customer chat input is locked. Below, supervisor can approve or override specialist assignment:
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 nh-material-inset p-3 rounded-lg" style={{ borderColor: 'rgba(255,159,10,0.35)' }}>
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">
                          Assigned Human Specialist:
                        </label>
                        <select
                          value={selectedSpecialist}
                          onChange={(e) => setSelectedSpecialist(e.target.value)}
                          className="w-full nh-material-2 rounded-lg p-2 text-xs font-bold text-white focus:outline-none"
                        >
                          <option value="Eleanor Vance (Senior Vulnerability Specialist)">Eleanor Vance (Senior Vulnerability Specialist)</option>
                          <option value="Marcus Vance (Hardship Lead Specialist)">Marcus Vance (Hardship Lead Specialist)</option>
                          <option value="Sarah Jenkins (Elderly Advocate)">Sarah Jenkins (Elderly Advocate)</option>
                          <option value="David Ross (Tier 5 Escalation Manager)">David Ross (Tier 5 Escalation Manager)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setOverrideNotice(`Assignment Approved: ${selectedSpecialist} confirmed and notified.`);
                          }}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-md"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve Assignment
                        </button>
                        <button
                          onClick={() => {
                            setOverrideNotice(`Specialist Overridden: Case re-assigned to ${selectedSpecialist}. System updated.`);
                          }}
                          className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-md"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Override Specialist
                        </button>
                      </div>
                    </div>

                    {overrideNotice && (
                      <div className="mt-2.5 text-[11px] font-bold text-emerald-300 bg-emerald-950 p-2 rounded-lg border border-emerald-700/80 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{overrideNotice}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Approve */}
                  <button
                    onClick={() => onHitlDecision(latestAgentMessage.id, 'approved')}
                    className="flex-1 min-w-[120px] px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve & Dispatch
                  </button>

                  {/* Edit & Approve */}
                  <button
                    onClick={() => {
                      setEditingMessageId(latestAgentMessage.id);
                      setEditedText(latestAgentMessage.agentPayload?.customer_response || '');
                    }}
                    className="flex-1 min-w-[120px] px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit & Approve
                  </button>

                  {/* Override / Reject */}
                  <button
                    onClick={() => setShowOverrideModal(latestAgentMessage.id)}
                    className="px-3.5 py-2 bg-red-950 hover:bg-red-900 border border-red-700/80 text-red-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 text-red-400" />
                    Override
                  </button>

                  {/* Escalate Human */}
                  <button
                    onClick={() => onHitlDecision(latestAgentMessage.id, 'escalated_human')}
                    className="px-3.5 py-2 bg-amber-950 hover:bg-amber-900 border border-amber-700/80 text-amber-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    Tier 5 Escalate
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Audit Trail Log with explicit Agent column & multi-turn vertical + horizontal scrollable view */}
          {(() => {
            type EnrichedAuditLog = AuditLogItem & { turnNumber: number };
            const accumulatedAuditLogs = messages.reduce((acc: EnrichedAuditLog[], msg) => {
              if (msg.sender === 'agent' && msg.agentPayload?.audit_log) {
                const turnNum =
                  messages
                    .filter((m) => m.sender === 'agent')
                    .findIndex((m) => m.id === msg.id) + 1;
                const logsWithTurn: EnrichedAuditLog[] = msg.agentPayload.audit_log.map((log) => ({
                  ...log,
                  turnNumber: turnNum > 0 ? turnNum : 1,
                }));
                return [...acc, ...logsWithTurn];
              }
              return acc;
            }, [] as EnrichedAuditLog[]);

            const displayAuditLogs =
              accumulatedAuditLogs.length > 0
                ? accumulatedAuditLogs
                : currentPayload?.audit_log
                ? currentPayload.audit_log.map((log) => ({ ...log, turnNumber: 1 }))
                : [];

            if (displayAuditLogs.length === 0) return null;

            const totalTurns = messages.filter((m) => m.sender === 'agent').length || 1;

            return (
              <div className="nh-material-1 rounded-2xl p-4 text-white">
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#A100FF]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Live CFPB Compliance Audit Trail & Multi-Turn Agent Trace
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-300 font-mono bg-[#1c1c1c] px-2 py-0.5 rounded border border-neutral-700">
                      Total Steps: {displayAuditLogs.length}
                    </span>
                    <span className="text-[10px] text-[#D899FF] font-mono bg-[#28134a] px-2 py-0.5 rounded border border-white/[0.08] font-semibold">
                      {totalTurns} Turn(s) Tracked
                    </span>
                  </div>
                </div>

                {/* Horizontally and vertically scrollable logs table container */}
                <div className="overflow-x-auto overflow-y-auto max-h-72 nh-material-inset rounded-xl p-2">
                  <table className="w-full text-left text-[11px] font-mono min-w-[720px]">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold text-neutral-400 border-b border-neutral-800">
                        <th className="py-1.5 px-2.5 w-16">Turn</th>
                        <th className="py-1.5 px-2.5 w-20">Step</th>
                        <th className="py-1.5 px-2.5 w-32">Action</th>
                        <th className="py-1.5 px-2.5 w-36">Agent</th>
                        <th className="py-1.5 px-2.5">Audit Details & Policy Execution Trace</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80">
                      {displayAuditLogs.map((log, idx) => (
                        <tr key={`${log.id}-${idx}`} className="hover:bg-[#222222] transition-colors">
                          <td className="py-2 px-2.5 text-[#D899FF] font-bold whitespace-nowrap">
                            Turn {log.turnNumber}
                          </td>
                          <td className="py-2 px-2.5 text-neutral-400 font-bold whitespace-nowrap">{log.step}</td>
                          <td className="py-2 px-2.5 text-white font-bold whitespace-nowrap">{log.action}</td>
                          <td className="py-2 px-2.5 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getAgentBadgeStyle(log.agent)}`}>
                              {log.agent}
                            </span>
                          </td>
                          <td className="py-2 px-2.5 text-neutral-300 font-sans whitespace-normal min-w-[320px] leading-relaxed">
                            {log.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                  <span>Scroll vertically ↑↓ and horizontally → to inspect complete multi-agent trace history</span>
                  <span>CFPB Reg E / Reg Z Compliant Audit Trail</span>
                </div>
              </div>
            );
          })()}

        </div>

      </div>

      {/* Edit Response Modal */}
      <AnimatePresence>
      {editingMessageId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
            className="nh-material-3 rounded-2xl p-6 max-w-xl w-full text-white">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Edit3 className="w-4 h-4 text-purple-400" />
              Edit Response Before Customer Dispatch
            </h3>

            <p className="text-xs text-white/65 mb-3">
              Modify the draft text below. All human edits are permanently logged in the CFPB Audit Trail.
            </p>

            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={6}
              className="w-full nh-material-inset rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 font-sans leading-relaxed"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditingMessageId(null)}
                className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-white/80 font-semibold text-xs rounded-xl cursor-pointer border border-white/[0.08]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onHitlDecision(editingMessageId, 'edited_and_approved', editedText);
                  setEditingMessageId(null);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md"
              >
                Save & Dispatch
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Override Reason Modal */}
      <AnimatePresence>
      {showOverrideModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
            className="nh-material-3 rounded-2xl p-6 max-w-md w-full text-white">
            <h3 className="text-sm font-bold text-red-300 flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-400" />
              Mandatory Override Reason Logging
            </h3>

            <p className="text-xs text-white/65 mb-3">
              To satisfy rubber-stamping audit requirements, specify why you are overriding the AI decision.
            </p>

            <input
              type="text"
              value={overrideReasonInput}
              onChange={(e) => setOverrideReasonInput(e.target.value)}
              placeholder="e.g., Customer has undisclosed secondary deposit account; fee waiver denied."
              className="w-full nh-material-inset rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowOverrideModal(null)}
                className="px-4 py-2 bg-white/[0.06] text-white/80 text-xs font-semibold rounded-xl border border-white/[0.08]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onHitlDecision(showOverrideModal, 'overridden', undefined, overrideReasonInput || 'Operator discretionary override');
                  setShowOverrideModal(null);
                  setOverrideReasonInput('');
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Record Override
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* CUSTOMER ACTION HUB MODALS */}

      {/* MODAL 1: DEEPER INSIGHTS & REWARDS */}
      <AnimatePresence>
      {activeCustomerModal === 'insights' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
            className="nh-material-3 rounded-2xl p-6 max-w-xl w-full text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] text-amber-300 border border-white/[0.08] flex items-center justify-center font-bold">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Customer Health Rating & Tenure Rewards
                  </h3>
                  <p className="text-xs text-white/65">
                    Detailed CSAT score breakdown & unlocked loyalty benefits for {selectedCustomer.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveCustomerModal('none')}
                className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/80 flex items-center justify-center cursor-pointer transition border border-white/[0.08]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Wellness Score Card */}
              <div className="bg-gradient-to-br from-purple-950 via-[#1e0f38] to-[#120724] border border-white/[0.08] text-white p-4 rounded-xl flex items-center justify-between shadow-lg">
                <div>
                  <div className="text-[10px] uppercase font-bold text-white/55">Financial Wellness Gauge</div>
                  <div className="text-3xl font-black text-emerald-400 mt-0.5">88 <span className="text-sm font-normal text-white/55">/ 100</span></div>
                  <p className="text-[11px] text-white/75 mt-1">
                    Strong liquidity reserves, zero fraud disputes, 7-year account stability.
                  </p>
                </div>
                <div className="bg-white/[0.06] p-3 rounded-xl border border-white/[0.08] text-center shrink-0">
                  <span className="text-xs font-bold text-amber-300 block">{selectedCustomer.tenureYears} Years</span>
                  <span className="text-[10px] text-white/80">Gold Tier Status</span>
                </div>
              </div>

              {/* Unlocked Loyalty Benefits */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Unlocked Gold Customer Perks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white/[0.06] border border-white/[0.08] rounded-lg flex items-center gap-2 text-white/90 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>$0 Fee Domestic Wire Transfers</span>
                  </div>
                  <div className="p-2.5 bg-white/[0.06] border border-white/[0.08] rounded-lg flex items-center gap-2 text-white/90 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>4.85% High Yield Savings Qualification</span>
                  </div>
                  <div className="p-2.5 bg-white/[0.06] border border-white/[0.08] rounded-lg flex items-center gap-2 text-white/90 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>24/7 Priority Human Escalation Queue</span>
                  </div>
                  <div className="p-2.5 bg-white/[0.06] border border-white/[0.08] rounded-lg flex items-center gap-2 text-white/90 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Express Overseas Card Dispatch</span>
                  </div>
                </div>
              </div>

              {/* Interactive CSAT Survey Feedback */}
              <div className="nh-material-2 text-center">
                <div className="text-xs font-bold text-white mb-1">
                  How would you rate your AI resolution experience today?
                </div>
                <p className="text-[11px] text-white/60 mb-2">
                  Your rating directly measures our CSAT and customer trust scores.
                </p>

                {csatSubmitted ? (
                  <div className="p-2.5 bg-emerald-950 text-emerald-300 rounded-lg font-bold text-xs flex items-center justify-center gap-2 border border-emerald-700/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Thank you! Your CSAT rating of {csatScore}/10 was recorded.</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => {
                          setCsatScore(star * 2);
                          setCsatSubmitted(true);
                        }}
                        className={`p-2 rounded-lg transition cursor-pointer flex items-center justify-center ${
                          csatScore && csatScore >= star * 2
                            ? 'bg-amber-400 text-black'
                            : 'nh-material-inset hover:border-amber-400 text-white/40 hover:text-amber-300'
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-white/[0.08]">
              <button
                onClick={() => setActiveCustomerModal('none')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Close Insights
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* MODAL 2: FINANCIAL PLANNING & YIELD CALCULATOR */}
      <AnimatePresence>
      {activeCustomerModal === 'planning' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
            className="nh-material-3 rounded-2xl p-6 max-w-xl w-full text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700/80 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Transparent Financial Planning & Yield Calculator
                  </h3>
                  <p className="text-xs text-white/65">
                    Simulate savings yield growth and emergency reserves without mis-selling
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveCustomerModal('none')}
                className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/80 flex items-center justify-center cursor-pointer transition border border-white/[0.08]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Deposit Slider */}
              <div className="nh-material-2 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                    Simulated Deposit Amount:
                  </label>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">
                    ${planningDepositAmount.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={100000}
                  step={1000}
                  value={planningDepositAmount}
                  onChange={(e) => setPlanningDepositAmount(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/50 font-mono mt-1">
                  <span>$1,000</span>
                  <span>$50,000</span>
                  <span>$100,000</span>
                </div>
              </div>

              {/* Yield Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-white/[0.06] border border-white/[0.08] rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-emerald-400">4.85% APY High-Yield Savings</div>
                  <div className="text-xl font-extrabold text-emerald-300 mt-1">
                    +${(planningDepositAmount * 0.0485).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-white/75 mt-1">
                    Annual Interest Earnings (Flexible Liquid Access)
                  </div>
                </div>

                <div className="p-4 bg-white/[0.06] border border-white/[0.08] rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-white/55">5.10% APY 12-Month CD Yield</div>
                  <div className="text-xl font-extrabold text-white/80 mt-1">
                    +${(planningDepositAmount * 0.0510).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-white/75 mt-1">
                    Guaranteed Rate Lock (FDIC Insured up to $250k)
                  </div>
                </div>
              </div>

              {/* Safety Buffer Indicator */}
              <div className="p-3 nh-material-inset text-white rounded-xl text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Emergency Fund Cushion: <strong>4.5 Months Expense Coverage</strong></span>
                </div>
                <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700/80">
                  Optimal Protection
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                onClick={() => setActiveCustomerModal('none')}
                className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-white/80 text-xs font-semibold rounded-xl cursor-pointer border border-white/[0.08]"
              >
                Close Planner
              </button>
              <button
                onClick={() => {
                  alert(`Goal simulation saved for ${selectedCustomer.name}. No credit inquiry created.`);
                  setActiveCustomerModal('none');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Save Financial Goal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* MODAL 3: BALANCES & STATEMENTS */}
      <AnimatePresence>
      {activeCustomerModal === 'statements' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
            className="nh-material-3 rounded-2xl p-6 max-w-2xl w-full text-white max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] text-white/80 border border-white/[0.08] flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5 text-white/55" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    2-Month Transaction Ledger & e-Statements
                  </h3>
                  <p className="text-xs text-white/65">
                    Account {selectedCustomer.accountNumber} ({selectedCustomer.name})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveCustomerModal('none')}
                className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/80 flex items-center justify-center cursor-pointer transition border border-white/[0.08]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification alert */}
            {downloadNotice && (
              <div className="mt-3 p-3 bg-emerald-950 border border-emerald-700/80 rounded-xl text-xs text-emerald-200 font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{downloadNotice}</span>
                </div>
                <button onClick={() => setDownloadNotice(null)} className="text-emerald-300 hover:text-white font-bold text-xs">
                  Dismiss
                </button>
              </div>
            )}

            <div className="py-3 flex-1 overflow-y-auto space-y-3">
              {/* Search input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={statementSearch}
                  onChange={(e) => setStatementSearch(e.target.value)}
                  placeholder="Filter transactions by merchant, fee, or payroll..."
                  className="flex-1 nh-material-inset rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500 font-sans"
                />
                <button
                  onClick={() => {
                    setDownloadNotice(`Official e-Statement (NordHaven-Statement-${selectedCustomer.accountNumber}.pdf) generated successfully!`);
                  }}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>

              {/* Transactions table */}
              <div className="nh-material-inset rounded-xl overflow-hidden">
                <div className="bg-white/[0.06] px-3 py-2 text-[10px] uppercase font-bold text-white/55 grid grid-cols-12 gap-2 border-b border-white/[0.08]">
                  <span className="col-span-3">Date</span>
                  <span className="col-span-4">Description</span>
                  <span className="col-span-2 text-right">Amount</span>
                  <span className="col-span-3 text-right">Running Bal</span>
                </div>

                <div className="divide-y divide-purple-900/60 max-h-72 overflow-y-auto text-xs font-sans">
                  {getCustomerTransactions(selectedCustomer.accountNumber)
                    .filter((tx) =>
                      !statementSearch.trim() ||
                      tx.description.toLowerCase().includes(statementSearch.toLowerCase()) ||
                      tx.category.toLowerCase().includes(statementSearch.toLowerCase())
                    )
                    .map((tx, idx) => (
                      <div key={idx} className="px-3 py-2.5 grid grid-cols-12 gap-2 items-center hover:bg-white/[0.05]">
                        <span className="col-span-3 text-white/60 text-[11px] font-mono">{tx.date}</span>
                        <div className="col-span-4 font-medium text-white truncate">
                          {tx.description}
                          <span className="block text-[10px] text-white/50 font-normal">{tx.category}</span>
                        </div>
                        <span className={`col-span-2 text-right font-bold font-mono ${tx.amount < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {tx.amount < 0 ? `-$${Math.abs(tx.amount).toLocaleString()}` : `+$${tx.amount.toLocaleString()}`}
                        </span>
                        <span className="col-span-3 text-right text-white/75 font-mono text-[11px]">
                          ${tx.running_balance.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-white/[0.08]">
              <span className="text-[11px] text-white/60">
                Official Ledger • Reg E & Reg Z Encrypted
              </span>
              <button
                onClick={() => setActiveCustomerModal('none')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md"
              >
                Close Statement View
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

    </div>
  );
};
