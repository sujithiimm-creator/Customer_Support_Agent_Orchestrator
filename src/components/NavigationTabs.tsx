import React from 'react';
import { motion } from 'motion/react';
import { Play, BookOpen, Users, Bot } from 'lucide-react';

export type TabKey = 'demo' | 'rfc' | 'customers' | 'agents';

interface NavigationTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  pendingHitlCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  pendingHitlCount = 0,
}) => {
  const tabs = [
    {
      key: 'demo' as TabKey,
      label: 'Live Operations Demo',
      subLabel: 'Agent & HITL Workspace',
      icon: Play,
      badge: pendingHitlCount > 0 ? `${pendingHitlCount} HITL` : undefined,
    },
    {
      key: 'rfc' as TabKey,
      label: 'Policy Repository (RFC)',
      subLabel: 'RAG Retrieval Engine',
      icon: BookOpen,
    },
    {
      key: 'customers' as TabKey,
      label: 'Customer 360 Profiles',
      subLabel: 'Account Context Cards',
      icon: Users,
    },
    {
      key: 'agents' as TabKey,
      label: 'Agent Repository',
      subLabel: 'Agent RAG Documents',
      icon: Bot,
    },
  ];

  return (
    <div className="nh-material-1 sticky top-[65px] z-40 border-t-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className="nh-press relative flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs whitespace-nowrap cursor-pointer"
                style={{ color: isActive ? '#fff' : 'var(--nh-label-tertiary)' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nh-active-tab"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--nh-border-strong)' }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                  />
                )}
                <Icon className="relative w-4 h-4" style={{ color: isActive ? 'var(--nh-accent-soft)' : 'var(--nh-label-tertiary)' }} />
                <div className="relative text-left">
                  <div className={`leading-tight ${isActive ? 'font-bold text-white' : 'font-medium'}`}>{tab.label}</div>
                  <div className="text-[10px]" style={{ color: isActive ? 'var(--nh-accent-soft)' : 'var(--nh-label-tertiary)' }}>
                    {tab.subLabel}
                  </div>
                </div>
                {tab.badge && (
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', bounce: 0.5, duration: 0.4 }}
                    className="relative ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full text-white"
                    style={{ background: 'var(--nh-accent)' }}
                  >
                    {tab.badge}
                  </motion.span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
