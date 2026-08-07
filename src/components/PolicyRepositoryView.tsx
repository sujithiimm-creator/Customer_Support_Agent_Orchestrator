import React, { useState } from 'react';
import { BookOpen, Search, ShieldCheck, CheckCircle2, FileText, ArrowRight, Database } from 'lucide-react';
import { MOCK_POLICIES } from '../data/mockData';
import { PolicyDocument } from '../types';

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
        <div className="flex items-center gap-2 text-[#A100FF] text-xs font-bold uppercase tracking-wider mb-1">
          <Database className="w-4 h-4" />
          Retrieval Function (RFC) Knowledge Base
        </div>
        <h2 className="text-xl font-bold text-white">NordHaven Policy Repository & RAG Index</h2>
        <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
          Deterministic vector index queried by every agent before generating responses. Guarantees 100% regulatory compliance, source citation, and CFPB defensibility.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-4 mb-6 shadow-xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#A100FF]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search policies by keyword, citation code (e.g., NH-POL-FW-402), or CFPB rules..."
            className="w-full bg-[#1c1c1c] border border-neutral-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#A100FF] font-sans"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${
                selectedCategory === cat
                  ? 'bg-[#A100FF] text-white shadow-md shadow-[#A100FF]/20 border border-purple-400/50'
                  : 'bg-[#1c1c1c] text-neutral-300 border border-neutral-700 hover:text-white hover:bg-[#262626]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPolicies.map((policy) => (
          <div
            key={policy.id}
            className="bg-[#121212] border border-neutral-800 rounded-2xl p-5 shadow-xl hover:border-[#A100FF]/60 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 bg-[#1c1c1c] text-[#D899FF] border border-neutral-700 rounded-lg text-[10px] font-mono font-bold">
                  {policy.citationCode}
                </span>
                <span className="text-[10px] text-neutral-400">
                  Updated: {policy.lastUpdated}
                </span>
              </div>

              <h3 className="font-bold text-sm text-white mb-2">{policy.title}</h3>
              <p className="text-xs text-neutral-300 mb-4 leading-relaxed">{policy.summary}</p>

              <div className="bg-[#1a1a1a] p-3 rounded-xl border border-neutral-800 mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Full Policy Text (Retrieved by Agent)
                </div>
                <p className="text-xs text-neutral-200 leading-relaxed font-sans">{policy.fullText}</p>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Mandatory Execution Rules
                </div>
                {policy.mandatoryRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-neutral-200 bg-[#1c1c1c] p-2 rounded-lg border border-neutral-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Category: <strong className="text-white">{policy.category}</strong></span>
              <span className="flex items-center gap-1 text-[#D899FF] font-bold cursor-pointer hover:underline hover:text-white">
                View RAG Embeddings <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
