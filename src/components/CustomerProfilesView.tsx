import React, { useState } from 'react';
import { Users, AlertTriangle, ShieldCheck, DollarSign, Clock, FileText, ChevronRight, Receipt, X } from 'lucide-react';
import { MOCK_CUSTOMERS } from '../data/mockData';
import { CustomerProfile } from '../types';
import { getCustomerTransactions, getLatestBalance } from '../data/transactions';

interface CustomerProfilesViewProps {
  onSelectAndLaunchDemo: (customer: CustomerProfile) => void;
}

export const CustomerProfilesView: React.FC<CustomerProfilesViewProps> = ({
  onSelectAndLaunchDemo,
}) => {
  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [viewingLedgerCustomer, setViewingLedgerCustomer] = useState<CustomerProfile | null>(null);

  const segments = ['All', 'Retail', 'Wealth / Premier', 'Small Business (SMB)', 'Vulnerable / Hardship'];

  const filteredCustomers = MOCK_CUSTOMERS.filter(
    (c) => selectedSegment === 'All' || c.segment === selectedSegment
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
      
      {/* Page Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[#A100FF] text-xs font-bold uppercase tracking-wider mb-1">
          <Users className="w-4 h-4" />
          Unified Customer Data Platform (CDP)
        </div>
        <h2 className="text-xl font-bold text-white">Customer 360 Context Profiles & 12-Month Ledger Context</h2>
        <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
          Real-time customer context and 2-month transaction ledger assembled by the Orchestration Control Plane prior to agent interaction.
        </p>
      </div>

      {/* Segment Filter Bar */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
        {segments.map((seg) => (
          <button
            key={seg}
            onClick={() => setSelectedSegment(seg)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${
              selectedSegment === seg
                ? 'bg-[#A100FF] text-white shadow-md shadow-[#A100FF]/20 border border-purple-400/50'
                : 'bg-[#181818] text-neutral-300 border border-neutral-700 hover:text-white hover:bg-[#262626]'
            }`}
          >
            {seg}
          </button>
        ))}
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => {
          const balance = getLatestBalance(customer.accountNumber);
          const txs = getCustomerTransactions(customer.accountNumber);

          return (
            <div
              key={customer.id}
              className="bg-[#121212] border border-neutral-800 rounded-2xl p-5 shadow-xl hover:border-[#A100FF]/60 transition flex flex-col justify-between group"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#A100FF] text-white flex items-center justify-center font-bold text-base shadow-md shadow-[#A100FF]/30">
                      {customer.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{customer.name}</h3>
                      <div className="text-xs text-neutral-400 font-mono">{customer.accountNumber}</div>
                    </div>
                  </div>

                  {customer.vulnerabilityStatus !== 'None' ? (
                    <span className="px-2 py-1 bg-amber-950/80 text-amber-300 border border-amber-600/80 rounded-lg text-[10px] font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400" /> Hardship
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-[#1c1c1c] text-[#D899FF] border border-neutral-700 rounded text-[10px] font-semibold">
                      {customer.segment}
                    </span>
                  )}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 bg-[#1a1a1a] p-2.5 rounded-xl border border-neutral-800 text-center my-3">
                  <div>
                    <div className="text-[10px] text-neutral-400 font-semibold uppercase">Tenure</div>
                    <div className="text-xs font-bold text-white">{customer.tenureYears} Years</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400 font-semibold uppercase">Balance</div>
                    <div className="text-xs font-bold text-[#D899FF]">${balance.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400 font-semibold uppercase">2M Ledger</div>
                    <div className="text-xs font-bold text-white">{txs.length} Txs</div>
                  </div>
                </div>

                {/* Holdings List */}
                <div className="mb-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Product Holdings
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {customer.holdings.map((h, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-[#1c1c1c] text-neutral-200 border border-neutral-700 rounded text-[11px]">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Customer Notes */}
                <div className="bg-[#1a1a1a] p-3 rounded-xl border border-neutral-800 text-xs text-neutral-300 leading-relaxed mb-4">
                  <strong className="text-white">Context Note:</strong> {customer.notes}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewingLedgerCustomer(customer)}
                  className="flex-1 py-2.5 bg-[#1c1c1c] hover:bg-[#262626] text-neutral-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer border border-neutral-700"
                >
                  <Receipt className="w-3.5 h-3.5 text-[#A100FF]" />
                  <span>View Ledger</span>
                </button>
                <button
                  onClick={() => onSelectAndLaunchDemo(customer)}
                  className="flex-1 py-2.5 bg-[#A100FF] hover:bg-[#8B00DC] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-[#A100FF]/20"
                >
                  <span>Launch Demo</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction Ledger Modal */}
      {viewingLedgerCustomer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-neutral-700 overflow-hidden text-white">
            <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-[#181818]">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#A100FF]" />
                  {viewingLedgerCustomer.name} — 2-Month Transaction Ledger
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Account: {viewingLedgerCustomer.accountNumber} | Current Running Balance: ${getLatestBalance(viewingLedgerCustomer.accountNumber).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setViewingLedgerCustomer(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg cursor-pointer hover:bg-[#262626] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-[#121212]">
              <div className="border border-neutral-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1c1c1c] text-neutral-300 font-bold uppercase text-[10px] tracking-wider border-b border-neutral-800">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-right">Running Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 font-mono">
                    {getCustomerTransactions(viewingLedgerCustomer.accountNumber).map((t, idx) => (
                      <tr key={idx} className="hover:bg-[#1a1a1a] transition">
                        <td className="py-2 px-3 text-neutral-400">{t.date}</td>
                        <td className="py-2 px-3 font-sans font-medium text-white">{t.description}</td>
                        <td className="py-2 px-3 text-neutral-300 font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1a1a1a] text-neutral-200 border border-neutral-700">
                            {t.category}
                          </span>
                        </td>
                        <td className={`py-2 px-3 text-right font-bold ${t.amount < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {t.amount < 0 ? `-$${Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `+$${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                        </td>
                        <td className="py-2 px-3 text-right text-neutral-200 font-bold">
                          ${t.running_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-3 bg-[#181818] border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setViewingLedgerCustomer(null)}
                className="px-4 py-2 bg-[#262626] hover:bg-[#333333] text-white font-bold text-xs rounded-xl cursor-pointer transition border border-neutral-700"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
