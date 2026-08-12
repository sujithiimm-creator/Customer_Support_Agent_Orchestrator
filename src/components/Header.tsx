import React from 'react';
import { motion } from 'motion/react';
import { Building2 } from 'lucide-react';
import { CustomerProfile } from '../types';

interface HeaderProps {
  selectedCustomer: CustomerProfile;
  customers: CustomerProfile[];
  onSelectCustomer: (cust: CustomerProfile) => void;
  onOpenScenarioModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCustomer,
  customers,
  onSelectCustomer,
}) => {
  return (
    <header className="nh-material-1 sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">

          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
              style={{ background: 'var(--nh-accent)', boxShadow: '0 2px 12px rgba(161,0,255,0.35)' }}
            >
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--nh-accent-soft)' }} className="font-black text-xl leading-none select-none">&gt;</span>
                <motion.span
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'var(--nh-accent)' }}
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <h1 className="nh-headline text-base text-white">NordHaven Financial Services</h1>
              </div>
              <p className="nh-caption text-[11px] hidden sm:block" style={{ color: 'var(--nh-label-tertiary)' }}>
                Agentic Operations Platform
              </p>
            </div>
          </div>

          {/* Active Customer Selector */}
          <div className="nh-material-2 flex items-center gap-2 rounded-xl px-3.5 py-1.5">
            <span className="text-xs hidden sm:inline font-medium" style={{ color: 'var(--nh-label-tertiary)' }}>Active Customer:</span>
            <select
              value={selectedCustomer.id}
              onChange={(e) => {
                const cust = customers.find((c) => c.id === e.target.value);
                if (cust) onSelectCustomer(cust);
              }}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1 transition-colors"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#1c1c1e] text-white font-sans">
                  {c.name} ({c.segment})
                </option>
              ))}
            </select>
            {selectedCustomer.vulnerabilityStatus !== 'None' && (
              <span className="flex h-2 w-2 relative" title="Vulnerability Flagged">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--nh-amber)' }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--nh-amber)' }}></span>
              </span>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
