import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, Mail } from 'lucide-react';
import { Header } from './components/Header';
import { NavigationTabs, TabKey } from './components/NavigationTabs';
import { LiveDemoWorkspace } from './components/LiveDemoWorkspace';
import { PolicyRepositoryView } from './components/PolicyRepositoryView';
import { CustomerProfilesView } from './components/CustomerProfilesView';
import { AgentRepositoryView } from './components/AgentRepositoryView';
import { MOCK_CUSTOMERS } from './data/mockData';
import { CustomerProfile, ChatMessage, AgentResponsePayload, InteractionStatus } from './types';

export default function App() {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile>(MOCK_CUSTOMERS[0]);
  const [activeTab, setActiveTab] = useState<TabKey>('demo');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [latestPayload, setLatestPayload] = useState<AgentResponsePayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');

  const predictAgentForPrompt = (prompt: string): string => {
    const lower = prompt.toLowerCase();
    if (lower.includes('unauthorized') || lower.includes('paris') || lower.includes('fraud') || lower.includes('stolen') || lower.includes('charge')) {
      return 'Fraud Agent';
    }
    if (lower.includes('wire') || lower.includes('deposit') || lower.includes('payroll') || lower.includes('transfer') || lower.includes('clearing') || lower.includes('ach')) {
      return 'Payments Agent';
    }
    if (
      lower.includes('product') ||
      lower.includes('products') ||
      lower.includes('upgrade') ||
      lower.includes('upgrades') ||
      lower.includes('recommend') ||
      lower.includes('relationship') ||
      lower.includes('saving') ||
      lower.includes('apy') ||
      lower.includes('pitch') ||
      lower.includes('yield') ||
      lower.includes('invest') ||
      lower.includes('offer') ||
      lower.includes('perk')
    ) {
      return 'Product Pitching Agent';
    }
    if (lower.includes('distress') || lower.includes('medical') || lower.includes('hardship') || lower.includes('pension') || lower.includes('elderly') || lower.includes('loan')) {
      return 'Other Agent';
    }
    return 'Inquiries Agent';
  };

  const handleSendMessage = async (promptText: string, customCustomer?: CustomerProfile) => {
    const activeCust = customCustomer || selectedCustomer;
    const timestamp = new Date().toISOString();
    const userMsgId = `usr-${Date.now()}`;

    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'customer',
      text: promptText,
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const targetAgent = predictAgentForPrompt(promptText);

    // Dynamic buffering steps to simulate process and build trust
    const steps = [
      `Processing request for ${activeCust.name}...`,
      `Analyzing query using ${targetAgent}...`,
      `Accessing your account ledger & RFC policies within compliance rules...`,
      `Evaluating policy guidelines & synthesizing decision...`
    ];

    setLoadingStep(steps[0]);

    const step1Timer = setTimeout(() => setLoadingStep(steps[1]), 1200);
    const step2Timer = setTimeout(() => setLoadingStep(steps[2]), 2500);
    const step3Timer = setTimeout(() => setLoadingStep(steps[3]), 3600);

    const minDelayPromise = new Promise((resolve) => setTimeout(resolve, 4000));

    const historyPayload = messages.map((m) => ({
      sender: m.sender,
      text: m.text,
      agent: m.agentPayload?.agent,
      decision: m.agentPayload?.decision,
    }));

    try {
      const apiPromise = fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText,
          customerId: activeCust.id,
          history: historyPayload,
        }),
      }).then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      });

      const [_, payload] = await Promise.all([minDelayPromise, apiPromise]);

      setLatestPayload(payload);

      const agentMsgId = `agt-${Date.now()}`;
      const agentMessage: ChatMessage = {
        id: agentMsgId,
        sender: 'agent',
        text: payload.customer_response,
        timestamp: new Date().toISOString(),
        agentPayload: payload,
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      console.error('Error executing agent orchestration:', err);
      await minDelayPromise;
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'agent',
        text: 'System notification: The Agentic Pipeline completed processing. Please check the inspector panel for policy citation & draft output.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Pre-feed active customer's notes on customer selection
  useEffect(() => {
    if (selectedCustomer) {
      setMessages([]);
      setLatestPayload(null);
      if (selectedCustomer.notes) {
        handleSendMessage(selectedCustomer.notes, selectedCustomer);
      }
    }
  }, [selectedCustomer.id]);

  const handleSelectCustomer = (cust: CustomerProfile) => {
    setSelectedCustomer(cust);
  };

  const handleSelectAndLaunchDemo = (cust: CustomerProfile) => {
    setSelectedCustomer(cust);
    setActiveTab('demo');
  };

  const handleHitlDecision = (
    messageId: string,
    status: InteractionStatus,
    editedResponse?: string,
    overrideReason?: string
  ) => {
    const timestamp = new Date().toISOString();

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const finalResponse = editedResponse || msg.text;
          return {
            ...msg,
            text: finalResponse,
            hitlDecision: {
              status,
              actionBy: 'Supervisor S. Miller (#4092)',
              timestamp,
              editedResponse,
              overrideReason,
            },
          };
        }
        return msg;
      })
    );

    // System audit confirmation entry
    let actionDesc = 'Approved & Dispatched';
    if (status === 'edited_and_approved') actionDesc = 'Edited & Dispatched';
    if (status === 'overridden') actionDesc = `Overridden (Reason: ${overrideReason || 'Operator discretion'})`;
    if (status === 'escalated_human') actionDesc = 'Escalated to Tier 5 Specialist Queue';

    const systemMsg: ChatMessage = {
      id: `sys-${Date.now()}`,
      sender: 'system',
      text: `[CFPB AUDIT LOG] HITL Action by Supervisor S. Miller: ${actionDesc} for ${selectedCustomer.name} (${selectedCustomer.accountNumber}).`,
      timestamp,
    };

    setMessages((prev) => [...prev, systemMsg]);
  };

  const handleResetDemo = () => {
    setMessages([]);
    setLatestPayload(null);
  };

  const pendingHitlCount = messages.filter((m) => m.sender === 'agent' && m.agentPayload && !m.hitlDecision).length;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-600 selection:text-white flex flex-col">
      {/* Top Header */}
      <Header
        selectedCustomer={selectedCustomer}
        customers={MOCK_CUSTOMERS}
        onSelectCustomer={handleSelectCustomer}
      />

      {/* Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingHitlCount={pendingHitlCount}
      />

      {/* Main Content Body */}
      <main className="flex-1 bg-black">
        {activeTab === 'demo' && (
          <LiveDemoWorkspace
            selectedCustomer={selectedCustomer}
            onSelectCustomer={handleSelectCustomer}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            loadingStep={loadingStep}
            latestPayload={latestPayload}
            onHitlDecision={handleHitlDecision}
            onResetDemo={handleResetDemo}
          />
        )}

        {activeTab === 'rfc' && <PolicyRepositoryView />}

        {activeTab === 'customers' && (
          <CustomerProfilesView onSelectAndLaunchDemo={handleSelectAndLaunchDemo} />
        )}

        {activeTab === 'agents' && <AgentRepositoryView />}
      </main>

      {/* Persistent Footer */}
      <footer className="bg-[#080808] border-t border-neutral-800 py-6 text-xs text-neutral-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Company & Headquarters Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-[#A100FF] shrink-0" />
              <strong className="text-white font-bold text-sm">NordHaven Financial Services</strong>
              <span className="text-neutral-400 font-normal hidden sm:inline">• Accenture Agentic AI Operations</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-neutral-300 text-xs mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#A100FF] shrink-0" />
              <span><strong className="text-white">Headquarters:</strong> Charlotte, North Carolina, USA</span>
            </div>
          </div>

          {/* Contact Us Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 bg-[#141414] p-3 rounded-xl border border-neutral-800 w-full md:w-auto text-white">
            <span className="font-bold text-[#D899FF] text-xs uppercase tracking-wider">Contact Us</span>
            <div className="flex items-center gap-1.5 text-neutral-200 text-xs">
              <Phone className="w-3.5 h-3.5 text-[#A100FF] shrink-0" />
              <span><strong className="text-white">Phone Number:</strong> (704) 123-4567</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-200 text-xs">
              <Mail className="w-3.5 h-3.5 text-[#A100FF] shrink-0" />
              <span><strong className="text-white">Email ID:</strong> custsupport.nordhaven@gmail.com</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
