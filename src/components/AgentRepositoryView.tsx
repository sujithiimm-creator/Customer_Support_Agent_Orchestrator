import React, { useState } from 'react';
import { Bot, Search, CheckCircle2, ArrowRight, Cpu, Layers } from 'lucide-react';
import { MOCK_AGENT_DOCUMENTS } from '../data/agentDocuments';
import { AgentDocument } from '../types';

export const AgentRepositoryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('All');

  const agents = [
    'All',
    'Inquiries Agent',
    'Payments Agent',
    'Fraud Agent',
    'Product Pitching Agent',
    'Other Agent',
  ];

  const filteredDocuments = MOCK_AGENT_DOCUMENTS.filter((doc) => {
    const agentMatch = selectedAgent === 'All' || doc.agent === selectedAgent;
    const textMatch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fullText.toLowerCase().includes(searchTerm.toLowerCase());
    return agentMatch && textMatch;
  });

  const getAgentBadgeStyle = (agent: string) => {
    switch (agent) {
      case 'Inquiries Agent':
        return 'bg-purple-950 text-purple-200 border-purple-700/80';
      case 'Payments Agent':
        return 'bg-emerald-950 text-emerald-200 border-emerald-700/80';
      case 'Fraud Agent':
        return 'bg-red-950 text-red-200 border-red-700/80';
      case 'Product Pitching Agent':
        return 'bg-purple-900 text-purple-100 border-purple-600/80';
      case 'Other Agent':
        return 'bg-amber-950 text-amber-200 border-amber-700/80';
      default:
        return 'bg-[#181028] text-purple-200 border-purple-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
      
      {/* Page Title & Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[#A100FF] text-xs font-bold uppercase tracking-wider mb-1">
          <Bot className="w-4 h-4" />
          Agent Knowledge Engine & RAG Index
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Agent Repository</h2>
          <span className="px-2.5 py-1 bg-[#1c1c1c] text-[#D899FF] border border-neutral-700 rounded-lg text-xs font-semibold">
            Agent RAG Documents
          </span>
        </div>
        <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
          Repository of system directives, RAG context vectors, and mandatory operational guidelines powering NordHaven's 5 specialized AI agents.
        </p>
      </div>

      {/* Search & Agent Wise Filter Bar */}
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-4 mb-6 shadow-xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#A100FF]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search agent documents by keyword, document code (e.g., AG-INQ-101), or agent rules..."
            className="w-full bg-[#1c1c1c] border border-neutral-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#A100FF] font-sans"
          />
        </div>

        {/* Agent Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {agents.map((agent) => (
            <button
              key={agent}
              onClick={() => setSelectedAgent(agent)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${
                selectedAgent === agent
                  ? 'bg-[#A100FF] text-white shadow-md shadow-[#A100FF]/20 border border-purple-400/50'
                  : 'bg-[#1c1c1c] text-neutral-300 border border-neutral-700 hover:text-white hover:bg-[#262626]'
              }`}
            >
              {agent}
            </button>
          ))}
        </div>
      </div>

      {/* Agent RAG Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className="bg-[#121212] border border-neutral-800 rounded-2xl p-5 shadow-xl hover:border-[#A100FF]/60 transition flex flex-col justify-between"
          >
            <div>
              {/* Document Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#1c1c1c] text-[#D899FF] border border-neutral-700 rounded-lg text-[10px] font-mono font-bold">
                    {doc.documentCode}
                  </span>
                  <span className={`px-2.5 py-1 border rounded-lg text-[10px] font-bold ${getAgentBadgeStyle(doc.agent)}`}>
                    {doc.agent}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400">
                  Updated: {doc.lastUpdated}
                </span>
              </div>

              {/* Title & Summary */}
              <h3 className="font-bold text-sm text-white mb-2">{doc.title}</h3>
              <p className="text-xs text-neutral-300 mb-4 leading-relaxed">{doc.summary}</p>

              {/* Full RAG Context Text */}
              <div className="bg-[#1a1a1a] p-3 rounded-xl border border-neutral-800 mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 flex items-center justify-between">
                  <span>Agent RAG Context Text</span>
                  <span className="text-[9px] text-[#D899FF] font-mono">Vector Injected</span>
                </div>
                <p className="text-xs text-neutral-200 leading-relaxed font-sans">{doc.fullText}</p>
              </div>

              {/* Mandatory Operational Rules */}
              <div className="space-y-1.5 mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Mandatory Agent Execution Rules
                </div>
                {doc.mandatoryRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-neutral-200 bg-[#1c1c1c] p-2 rounded-lg border border-neutral-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Target Agent: <strong className="text-white">{doc.agent}</strong></span>
              <span className="flex items-center gap-1 text-[#D899FF] font-bold cursor-pointer hover:underline hover:text-white">
                View RAG Vectors <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-12 text-center text-white">
          <Bot className="w-8 h-8 text-[#A100FF] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No Agent Documents Found</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Try adjusting your search query or selecting a different agent filter.
          </p>
        </div>
      )}

    </div>
  );
};
