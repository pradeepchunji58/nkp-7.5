import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Terminal,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  ClipboardList
} from 'lucide-react';
import { BASTION_PREREQUISITES } from '../data/bastionPrerequisites';

export const PrerequisitesChecklist: React.FC = () => {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set(['prereq-os', 'prereq-docker']));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleCheck = (id: string) => {
    const next = new Set(checkedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCheckedIds(next);
  };

  const copyCommand = (id: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalRequired = BASTION_PREREQUISITES.filter((p) => p.importance === 'Required').length;
  const completedRequired = BASTION_PREREQUISITES.filter(
    (p) => p.importance === 'Required' && checkedIds.has(p.id)
  ).length;
  const progressPercent = Math.round((completedRequired / totalRequired) * 100);

  return (
    <div
      id="prerequisites-section"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-600" />
            <span>Nutanix NKP Bastion Host Deployment Prerequisites Checklist</span>
          </h3>
          <p className="text-xs text-slate-500">
            Official configuration and toolchain readiness checklist for the centralized bastion workstation
          </p>
        </div>

        {/* Readiness Meter */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-800">
              {completedRequired}/{totalRequired} Required Ready
            </span>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-100 text-slate-700">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BASTION_PREREQUISITES.map((prereq) => {
          const isChecked = checkedIds.has(prereq.id);
          return (
            <div
              key={prereq.id}
              className={`p-4 rounded-xl border transition-all ${
                isChecked
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleCheck(prereq.id)}
                  className="mt-0.5 text-emerald-600 hover:text-emerald-700 transition-colors flex-shrink-0"
                  title={isChecked ? 'Mark pending' : 'Mark completed'}
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 fill-emerald-600 text-white" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {prereq.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        prereq.importance === 'Required'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {prereq.importance}
                    </span>
                  </div>

                  <h4
                    onClick={() => toggleCheck(prereq.id)}
                    className={`text-sm font-bold cursor-pointer select-none ${
                      isChecked ? 'text-slate-900 line-through opacity-80' : 'text-slate-900'
                    }`}
                  >
                    {prereq.title}
                  </h4>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{prereq.description}</p>

                  {prereq.commandSnippet && (
                    <div className="mt-3 relative">
                      <div className="rounded-lg bg-slate-950 p-2.5 font-mono text-[11px] text-emerald-400 overflow-x-auto pr-16 border border-slate-800">
                        <code>{prereq.commandSnippet}</code>
                      </div>
                      <button
                        onClick={() => copyCommand(prereq.id, prereq.commandSnippet!)}
                        className="absolute right-2 top-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 transition-colors"
                        title="Copy command"
                      >
                        {copiedId === prereq.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
