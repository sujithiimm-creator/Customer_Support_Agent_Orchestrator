import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, CheckCircle2, ArrowRight, Database } from 'lucide-react';
import { MOCK_POLICIES } from '../data/mockData';

export const PolicyRepositoryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Fee Waiver', 'CFPB Adverse Action', 'Fraud & Provisional Credit', 'Hardship & Vulnerable Protections', 'Wire & Payment Settlement'];

  const filteredPolicies = MOCK_POLICIES.filter((p) => {
    const catMatch = selectedCategory === 'All' || p.category === selectedCategory;
    const textMatch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.citationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.fullText.toLowerCase().includes(searchTerm.toLowerCase());
    return catMatch && textMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">

      {/* Page Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--nh-accent-soft)' }}>
          <Database className="w-4 h-4" />
          Retrieval Function (RFC) Knowledge Base
        </div>
        <h2 className="nh-title text-xl text-white">NordHaven Policy Repository & RAG Index</h2>
        <p className="text-xs mt-1 max-w-2xl" style={{ color: 'var(--nh-label-tertiary)' }}>
          Deterministic vector index queried by every agent before generating responses. Guarantees 100% regulatory compliance, source citation, and CFPB defensibility.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="nh-material-2 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3" style={{ color: 'var(--nh-accent-soft)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search policies by keyword, citation code (e.g., NH-POL-FW-402), or CFPB rules..."
            className="nh-material-inset w-full rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none font-sans"
            style={{ borderColor: 'var(--nh-border)' }}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="nh-press px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer"
                style={
                  isActive
                    ? { background: 'var(--nh-accent)', color: '#fff', boxShadow: '0 2px 10px rgba(161,0,255,0.28)' }
                    : { background: 'rgba(255,255,255,0.06)', color: 'var(--nh-label-secondary)', border: '1px solid var(--nh-border)' }
                }
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPolicies.map((policy, idx) => (
          <motion.div
            key={policy.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4, delay: idx * 0.03 }}
            className="nh-material-2 rounded-2xl p-5 flex flex-col justify-between transition-colors hover:border-white/20"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--nh-accent-soft)', border: '1px solid var(--nh-border)' }}>
                  {policy.citationCode}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--nh-label-tertiary)' }}>
                  Updated: {policy.lastUpdated}
                </span>
              </div>

              <h3 className="font-bold text-sm text-white mb-2">{policy.title}</h3>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--nh-label-secondary)' }}>{policy.summary}</p>

              <div className="nh-material-inset p-3 rounded-xl mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--nh-label-tertiary)' }}>
                  Full Policy Text (Retrieved by Agent)
                </div>
                <p className="text-xs leading-relaxed font-sans" style={{ color: 'var(--nh-label-secondary)' }}>{policy.fullText}</p>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--nh-label-tertiary)' }}>
                  Mandatory Execution Rules
                </div>
                {policy.mandatoryRules.map((rule, ridx) => (
                  <div key={ridx} className="flex items-start gap-2 text-xs p-2 rounded-lg" style={{ color: 'var(--nh-label-secondary)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--nh-border)' }}>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--nh-green)' }} />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between text-[11px]" style={{ borderTop: '1px solid var(--nh-border)', color: 'var(--nh-label-tertiary)' }}>
              <span>Category: <strong className="text-white">{policy.category}</strong></span>
              <span className="flex items-center gap-1 font-bold cursor-pointer hover:underline hover:text-white" style={{ color: 'var(--nh-accent-soft)' }}>
                View RAG Embeddings <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
