import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, AlertTriangle, Receipt, X, ChevronRight } from 'lucide-react';
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
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--nh-accent-soft)' }}>
          <Users className="w-4 h-4" />
          Unified Customer Data Platform (CDP)
        </div>
        <h2 className="nh-title text-xl text-white">Customer 360 Context Profiles & 12-Month Ledger Context</h2>
        <p className="text-xs mt-1 max-w-2xl" style={{ color: 'var(--nh-label-tertiary)' }}>
          Real-time customer context and 2-month transaction ledger assembled by the Orchestration Control Plane prior to agent interaction.
        </p>
      </div>

      {/* Segment Filter Bar */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
        {segments.map((seg) => {
          const isActive = selectedSegment === seg;
          return (
            <button
              key={seg}
              onClick={() => setSelectedSegment(seg)}
              className="nh-press px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer"
              style={
                isActive
                  ? { background: 'var(--nh-accent)', color: '#fff', boxShadow: '0 2px 10px rgba(161,0,255,0.28)' }
                  : { background: 'rgba(255,255,255,0.06)', color: 'var(--nh-label-secondary)', border: '1px solid var(--nh-border)' }
              }
            >
              {seg}
            </button>
          );
        })}
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer, idx) => {
          const balance = getLatestBalance(customer.accountNumber);
          const txs = getCustomerTransactions(customer.accountNumber);

          return (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4, delay: idx * 0.04 }}
              whileHover={{ y: -3 }}
              className="nh-material-2 rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-colors"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-base"
                      style={{ background: 'var(--nh-accent)', boxShadow: '0 2px 12px rgba(161,0,255,0.3)' }}
                    >
                      {customer.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{customer.name}</h3>
                      <div className="text-xs font-mono" style={{ color: 'var(--nh-label-tertiary)' }}>{customer.accountNumber}</div>
                    </div>
                  </div>

                  {customer.vulnerabilityStatus !== 'None' ? (
                    <span className="px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1" style={{ background: 'rgba(255,159,10,0.12)', color: 'var(--nh-amber)', border: '1px solid rgba(255,159,10,0.35)' }}>
                      <AlertTriangle className="w-3 h-3" /> Hardship
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--nh-accent-soft)', border: '1px solid var(--nh-border)' }}>
                      {customer.segment}
                    </span>
                  )}
                </div>

                {/* Metrics Grid */}
                <div className="nh-material-inset grid grid-cols-3 gap-2 p-2.5 rounded-xl text-center my-3">
                  <div>
                    <div className="text-[10px] font-semibold uppercase" style={{ color: 'var(--nh-label-tertiary)' }}>Tenure</div>
                    <div className="text-xs font-bold text-white">{customer.tenureYears} Years</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase" style={{ color: 'var(--nh-label-tertiary)' }}>Balance</div>
                    <div className="text-xs font-bold" style={{ color: 'var(--nh-accent-soft)' }}>${balance.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase" style={{ color: 'var(--nh-label-tertiary)' }}>2M Ledger</div>
                    <div className="text-xs font-bold text-white">{txs.length} Txs</div>
                  </div>
                </div>

                {/* Holdings List */}
                <div className="mb-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--nh-label-tertiary)' }}>
                    Product Holdings
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {customer.holdings.map((h, hidx) => (
                      <span key={hidx} className="px-2 py-0.5 rounded text-[11px]" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--nh-label-secondary)', border: '1px solid var(--nh-border)' }}>
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Customer Notes */}
                <div className="nh-material-inset p-3 rounded-xl text-xs leading-relaxed mb-4" style={{ color: 'var(--nh-label-secondary)' }}>
                  <strong className="text-white">Context Note:</strong> {customer.notes}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewingLedgerCustomer(customer)}
                  className="nh-press flex-1 py-2.5 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--nh-label-secondary)', border: '1px solid var(--nh-border)' }}
                >
                  <Receipt className="w-3.5 h-3.5" style={{ color: 'var(--nh-accent-soft)' }} />
                  <span>View Ledger</span>
                </button>
                <button
                  onClick={() => onSelectAndLaunchDemo(customer)}
                  className="nh-press flex-1 py-2.5 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{ background: 'var(--nh-accent)', boxShadow: '0 2px 10px rgba(161,0,255,0.28)' }}
                >
                  <span>Launch Demo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Transaction Ledger Modal */}
      <AnimatePresence>
        {viewingLedgerCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setViewingLedgerCustomer(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 6 }}
              transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
              className="nh-material-3 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden text-white"
            >
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--nh-border)' }}>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Receipt className="w-5 h-5" style={{ color: 'var(--nh-accent-soft)' }} />
                    {viewingLedgerCustomer.name} — 2-Month Transaction Ledger
                  </h3>
                  <p className="text-xs font-mono" style={{ color: 'var(--nh-label-tertiary)' }}>
                    Account: {viewingLedgerCustomer.accountNumber} | Current Running Balance: ${getLatestBalance(viewingLedgerCustomer.accountNumber).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setViewingLedgerCustomer(null)}
                  className="nh-press p-1.5 rounded-lg cursor-pointer"
                  style={{ color: 'var(--nh-label-tertiary)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="rounded-xl overflow-hidden text-xs" style={{ border: '1px solid var(--nh-border)' }}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="font-bold uppercase text-[10px] tracking-wider" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--nh-label-secondary)', borderBottom: '1px solid var(--nh-border)' }}>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Description</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                        <th className="py-2.5 px-3 text-right">Running Balance</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {getCustomerTransactions(viewingLedgerCustomer.accountNumber).map((t, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.03] transition-colors" style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--nh-border)' }}>
                          <td className="py-2 px-3" style={{ color: 'var(--nh-label-tertiary)' }}>{t.date}</td>
                          <td className="py-2 px-3 font-sans font-medium text-white">{t.description}</td>
                          <td className="py-2 px-3 font-sans" style={{ color: 'var(--nh-label-secondary)' }}>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--nh-label-secondary)', border: '1px solid var(--nh-border)' }}>
                              {t.category}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right font-bold" style={{ color: t.amount < 0 ? 'var(--nh-red)' : 'var(--nh-green)' }}>
                            {t.amount < 0 ? `-$${Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `+$${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-white">
                            ${t.running_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="px-6 py-3 flex justify-end" style={{ borderTop: '1px solid var(--nh-border)' }}>
                <button
                  onClick={() => setViewingLedgerCustomer(null)}
                  className="nh-press px-4 py-2 font-bold text-xs rounded-xl cursor-pointer text-white"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--nh-border-strong)' }}
                >
                  Close Ledger
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
