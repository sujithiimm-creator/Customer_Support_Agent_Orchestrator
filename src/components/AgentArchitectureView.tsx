import React from 'react';
import { Bot, Cpu, Layers, ShieldAlert, Zap, ArrowDown, CheckCircle2, Terminal } from 'lucide-react';
import { TECH_TIERS_INFO } from '../data/strategyData';

export const AgentArchitectureView: React.FC = () => {
  const agents = [
    {
      name: 'Complaint Agent',
      tier: 'Tier 3 (Gen AI) + Tier 2 (RAG)',
      wave: 'Wave 2 (Most Complex)',
      role: 'Synthesizes complaint text, RAG policies, customer history, and CFPB rules into plain-language resolution letters with SHAP explainability.',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      keyTools: ['retrieveContextRFC', 'checkTenureEligibility', 'generateDraftLetter'],
    },
    {
      name: 'Fraud Agent',
      tier: 'Tier 1 (Workflow) + Tier 3 (Gen AI)',
      wave: 'Wave 1 & 2',
      role: 'Executes push-confirm fraud verification, analyzes geofence mismatches, stages card freezes, and prepares Reg E provisional credit packages.',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      keyTools: ['checkDeviceGeofence', 'stageCardFreeze', 'calculateProvisionalCredit'],
    },
    {
      name: 'Payments Agent',
      tier: 'Tier 1 (Workflow Automation)',
      wave: 'Wave 1',
      role: 'Executes automated Fedwire & SWIFT IMAD/OMAD traces, monitors clearing house delays, and dispatches proactive push updates.',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      keyTools: ['executeFedwireTrace', 'checkClearingStatus', 'dispatchPushNotification'],
    },
    {
      name: 'Enquiry Agent',
      tier: 'Tier 1 (NLU Intent Routing)',
      wave: 'Wave 1',
      role: 'Handles high-volume general inquiries (fee schedules, travel notices, balance checks) with improved intent routing to deflect 132K human calls/mo.',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      keyTools: ['lookupFeeMatrix', 'activateSelfServiceNotice'],
    },
    {
      name: 'Vulnerability Agent',
      tier: 'Tier 5 (Human-Only Gateway)',
      wave: 'Wave 3 (Data-Dependent)',
      role: 'Scores hardship and distress keywords at intake. Immediately routes to Certified Vulnerability Specialists with zero autonomous AI adjudication.',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      keyTools: ['scoreVulnerabilitySignals', 'assembleSpecialistBrief', 'routeTier5Queue'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-900">
      
      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Bot className="w-4 h-4" />
          Autonomous Multi-Agent System
        </div>
        <h2 className="text-xl font-bold text-slate-900">Orchestrator Control Plane & 5 Specialist Agents</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Every agent has direct access to Gemini 3.6 Flash, customer profiles, and RFC policy retrieval. Every interaction passes through the Orchestration Control Plane.
        </p>
      </div>

      {/* Orchestrator Diagram */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Orchestrator Control Plane (Gemini 3.6)</h3>
              <p className="text-xs text-slate-500">Classifies intent • Computes confidence • Detects hardship • Coordinates specialist routing</p>
            </div>
          </div>

          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
            Live Gateway Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {agents.map((agent, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-blue-400 transition flex flex-col justify-between"
            >
              <div>
                <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded border mb-2 ${
                  agent.badgeColor.includes('purple') ? 'bg-purple-50 text-purple-700 border-purple-200' :
                  agent.badgeColor.includes('red') ? 'bg-red-50 text-red-700 border-red-200' :
                  agent.badgeColor.includes('blue') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  agent.badgeColor.includes('emerald') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {agent.name}
                </span>

                <div className="text-[11px] font-bold text-slate-800 mb-1">{agent.tier}</div>
                <div className="text-[10px] text-blue-600 mb-2">{agent.wave}</div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">{agent.role}</p>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Key Tool Calls
                </div>
                <div className="space-y-1">
                  {agent.keyTools.map((t, i) => (
                    <div key={i} className="text-[10px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {t}()
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Tier Technology Stack Breakdown */}
      <div className="mb-6">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          5-Tier Technology Architecture & Token Cost Allocation
        </h3>

        <div className="space-y-3">
          {TECH_TIERS_INFO.map((tierItem, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="max-w-xl">
                <h4 className="font-bold text-sm text-slate-900">{tierItem.tier}</h4>
                <p className="text-xs text-slate-500 mt-1">{tierItem.description}</p>
                <div className="text-[11px] text-slate-400 mt-2 font-mono">
                  Tech: <span className="text-blue-600 font-semibold">{tierItem.techType}</span>
                </div>
              </div>

              <div className="text-right md:min-w-[200px] shrink-0 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold uppercase text-slate-400">Token Cost</div>
                <div className="text-xs font-bold text-emerald-700">{tierItem.tokenCost}</div>
                <div className="text-[10px] text-slate-500 mt-1">{tierItem.volumeShare}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
