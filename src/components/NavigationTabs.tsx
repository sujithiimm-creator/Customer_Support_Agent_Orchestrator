import React from 'react';
import { Play, BookOpen, Users, Bot, LineChart } from 'lucide-react';

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
      highlight: true,
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
    <div className="bg-[#0a0a0a]/95 border-b border-neutral-800 backdrop-blur sticky top-[65px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'bg-[#181818] text-white border-[#A100FF] shadow-lg shadow-[#A100FF]/10 font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-[#141414] border-neutral-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#A100FF]' : 'text-neutral-500'}`} />
                <div className="text-left">
                  <div className="leading-tight font-medium text-white">{tab.label}</div>
                  <div className={`text-[10px] ${isActive ? 'text-[#D899FF] font-semibold' : 'text-neutral-500'}`}>
                    {tab.subLabel}
                  </div>
                </div>
                {tab.badge && (
                  <span className="ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#A100FF] text-white border border-purple-400/50 animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
