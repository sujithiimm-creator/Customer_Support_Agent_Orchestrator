import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, Search, CheckCircle2, ArrowRight } from 'lucide-react';
import { MOCK_AGENT_DOCUMENTS } from '../data/agentDocuments';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">

      {/* Page Title & Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--nh-accent-soft)' }}>
          <Bot className="w-4 h-4" />
          Agent Knowledge Engine & RAG Index
        </div>
        <div className="flex items-center gap-3">
          <h2 className="nh-title text-xl text-white">Agent Repository</h2>
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--nh-accent-soft)', border: '1px solid var(--nh-border)' }}>
            Agent RAG Documents
          </span>
        </div>
        <p className="text-xs mt-1 max-w-2xl" style={{ color: 'var(--nh-label-tertiary)' }}>
          Repository of system directives, RAG context vectors, and mandatory operational guidelines powering NordHaven's 5 specialized AI agents.
        </p>
      </div>

      {/* Search & Agent Wise Filter Bar */}
      <div className="nh-material-2 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3" style={{ color: 'var(--nh-accent-soft)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search agent documents by keyword, document code (e.g., AG-INQ-101), or agent rules..."
            className="nh-material-inset w-full rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none font-sans"
          />
        </div>

        {/* Agent Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {agents.map((agent) => {
            const isActive = selectedAgent === agent;
            return (
              <button
                key={agent}
                onClick={() => setSelectedAgent(agent)}
                className="nh-press px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer"
                style={
                  isActive
                    ? { background: 'var(--nh-accent)', color: '#fff', boxShadow: '0 2px 10px rgba(161,0,255,0.28)' }
                    : { background: 'rgba(255,255,255,0.06)', color: 'var(--nh-label-secondary)', border: '1px solid var(--nh-border)' }
                }
              >
                {agent}
              </button>
            );
          })}
        </div>
      </div>

      {/* Agent RAG Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocuments.map((doc, idx) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4, delay: idx * 0.03 }}
            className="nh-material-2 rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--nh-accent-soft)', border: '1px solid var(--nh-border)' }}>
                    {doc.documentCode}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--nh-label-secondary)', border: '1px solid var(--nh-border)' }}>
                    {doc.agent}
                  </span>
                </div>
                <span className="text-[10px]" style={{ color: 'var(--nh-label-tertiary)' }}>
                  Updated: {doc.lastUpdated}
                </span>
              </div>

              <h3 className="font-bold text-sm text-white mb-2">{doc.title}</h3>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--nh-label-secondary)' }}>{doc.summary}</p>

              <div className="nh-material-inset p-3 rounded-xl mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between" style={{ color: 'var(--nh-label-tertiary)' }}>
                  <span>Agent RAG Context Text</span>
                  <span className="text-[9px] font-mono" style={{ color: 'var(--nh-accent-soft)' }}>Vector Injected</span>
                </div>
                <p className="text-xs leading-relaxed font-sans" style={{ color: 'var(--nh-label-secondary)' }}>{doc.fullText}</p>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--nh-label-tertiary)' }}>
                  Mandatory Agent Execution Rules
                </div>
                {doc.mandatoryRules.map((rule, ridx) => (
                  <div key={ridx} className="flex items-start gap-2 text-xs p-2 rounded-lg" style={{ color: 'var(--nh-label-secondary)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--nh-border)' }}>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--nh-green)' }} />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between text-[11px]" style={{ borderTop: '1px solid var(--nh-border)', color: 'var(--nh-label-tertiary)' }}>
              <span>Target Agent: <strong className="text-white">{doc.agent}</strong></span>
              <span className="flex items-center gap-1 font-bold cursor-pointer hover:underline hover:text-white" style={{ color: 'var(--nh-accent-soft)' }}>
                View RAG Vectors <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="nh-material-2 rounded-2xl p-12 text-center text-white">
          <Bot className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--nh-accent)' }} />
          <h3 className="text-sm font-bold text-white">No Agent Documents Found</h3>
          <p className="text-xs mt-1" style={{ color: 'var(--nh-label-tertiary)' }}>
            Try adjusting your search query or selecting a different agent filter.
          </p>
        </div>
      )}

    </div>
  );
};
