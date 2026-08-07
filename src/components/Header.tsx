import React from 'react';
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
    <header className="bg-[#050505] border-b border-neutral-800 sticky top-0 z-50 text-white shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A100FF] border border-purple-400/40 flex items-center justify-center text-white shadow-md shadow-[#A100FF]/30 shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[#A100FF] font-black text-xl leading-none select-none">&gt;</span>
                <span className="w-2 h-2 rounded-full bg-[#A100FF] animate-pulse"></span>
                <h1 className="font-bold text-base tracking-tight text-white">NordHaven Financial Services</h1>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                Agentic Operations Platform • Accenture Design System
              </p>
            </div>
          </div>

          {/* Active Customer Selector */}
          <div className="flex items-center gap-2 bg-[#141414] border border-neutral-700 rounded-xl px-3.5 py-1.5 shadow-xs">
            <span className="text-xs text-neutral-400 hidden sm:inline font-medium">Active Customer:</span>
            <select
              value={selectedCustomer.id}
              onChange={(e) => {
                const cust = customers.find((c) => c.id === e.target.value);
                if (cust) onSelectCustomer(cust);
              }}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1 hover:text-[#A100FF] transition"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#141414] text-white font-sans">
                  {c.name} ({c.segment})
                </option>
              ))}
            </select>
            {selectedCustomer.vulnerabilityStatus !== 'None' && (
              <span className="flex h-2 w-2 relative" title="Vulnerability Flagged">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
