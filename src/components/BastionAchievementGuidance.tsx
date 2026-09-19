import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Award,
  Terminal,
  ShieldCheck,
  Server,
  PlayCircle,
  ExternalLink,
  BookOpen,
  Cpu,
  Database,
  ArrowRight,
  HardDrive,
  Network,
  Flame,
  Info
} from 'lucide-react';
import { BASTION_PREREQUISITES } from '../data/bastionPrerequisites';
import { NutanixLogo } from './NutanixLogo';

interface BastionAchievementGuidanceProps {
  onStartSimulation?: () => void;
}

export const BastionAchievementGuidance: React.FC<BastionAchievementGuidanceProps> = ({
  onStartSimulation,
}) => {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    new Set(['prereq-os', 'prereq-docker', 'prereq-nkp-cli', 'prereq-kubectl', 'prereq-ssh', 'prereq-prism', 'prereq-ports', 'prereq-airgap'])
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeGuidanceTab, setActiveGuidanceTab] = useState<'blueprint' | 'checklist' | 'airgap-rules'>('blueprint');

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
  const isFullyQualified = progressPercent === 100;

  return (
    <div id="bastion-guidance-section" className="space-y-6 w-full pb-12">
      {/* ========================================================================= */}
      {/* MANDATORY TOP SECTION: REAL-TIME STATUS & NCP-CN 7.5 SIMULATION READINESS */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl border border-slate-700 p-6 sm:p-7 shadow-lg relative overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Top Status Indicators Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex-shrink-0">
                <NutanixLogo className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                    Nutanix Certification Track
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-extrabold border border-emerald-400/40">
                    REQUIRED: NCP-CN 7.5
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                  Bastion Hosting Examination Achievement Guidance
                </h1>
              </div>
            </div>

            {/* Real-time Status Badge & Simulation Action */}
            <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  isFullyQualified
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'bg-amber-500/20 text-amber-300 border-amber-400/60'
                }`}
              >
                {isFullyQualified ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                )}
                <span>
                  {isFullyQualified
                    ? 'STATUS: QUALIFIED FOR NCP-CN 7.5 SIMULATION'
                    : `STATUS: IN PROGRESS (${totalRequired - completedRequired} PREREQUISITES REMAINING)`}
                </span>
              </div>

              {onStartSimulation && (
                <button
                  onClick={onStartSimulation}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 transition-all shadow-md active:scale-95 flex-shrink-0 cursor-pointer"
                  title="Launch the NCP-CN 7.5 Pre-Examination Simulation Mode"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Start Pre-Exam Simulation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar at Top */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80">
              <div className="text-[11px] text-slate-400 font-medium">Exam Target Version</div>
              <div className="text-base sm:text-lg font-extrabold text-white mt-0.5">NCP-CN 7.5</div>
              <div className="text-[10px] text-emerald-400 font-mono">Nutanix Cloud Native</div>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80">
              <div className="text-[11px] text-slate-400 font-medium">Bastion Readiness</div>
              <div className="text-base sm:text-lg font-extrabold text-emerald-400 mt-0.5">
                {completedRequired}/{totalRequired} Cleared
              </div>
              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80">
              <div className="text-[11px] text-slate-400 font-medium">Air-Gap Storage Spec</div>
              <div className="text-base sm:text-lg font-extrabold text-indigo-300 mt-0.5">200–500 GB</div>
              <div className="text-[10px] text-slate-400">Darksite tarballs & registry</div>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80">
              <div className="text-[11px] text-slate-400 font-medium">Simulation Mode</div>
              <div className="text-base sm:text-lg font-extrabold text-teal-300 mt-0.5">75 Questions</div>
              <div className="text-[10px] text-slate-400">75% Passing (2100/3000)</div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <strong>NCP-CN 7.5 Examination Requirement Note:</strong> Candidates preparing for the Nutanix Certified Professional - Cloud Native (NCP-CN 7.5) exam must demonstrate proficiency in configuring the centralized Bastion Host workstation. This includes the ephemeral bootstrap Kind cluster lifecycle, darksite air-gapped image mirroring, CAPI management pivot, and Nutanix Prism Central IAM authorization before entering the Pre-Examination Simulation Mode.
          </p>
        </div>
      </div>

      {/* Guidance Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveGuidanceTab('blueprint')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeGuidanceTab === 'blueprint'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-500" />
          <span>NCP-CN 7.5 Bastion Blueprint & Objectives</span>
        </button>

        <button
          onClick={() => setActiveGuidanceTab('checklist')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeGuidanceTab === 'checklist'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
          <span>Interactive Prerequisites Checklist ({completedRequired}/{totalRequired})</span>
        </button>

        <button
          onClick={() => setActiveGuidanceTab('airgap-rules')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeGuidanceTab === 'airgap-rules'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Air-Gapped & Dark-Site Rules</span>
        </button>
      </div>

      {/* TAB 1: NCP-CN 7.5 Bastion Blueprint & Core Objectives */}
      {activeGuidanceTab === 'blueprint' && (
        <div className="space-y-6">
          {/* Exam Core Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                <HardDrive className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">1. Bastion Storage & Sizing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                In standard online deployments, 100 GB is sufficient. In <strong>NCP-CN 7.5 air-gapped exams</strong>, candidates must allocate <strong>200–500 GB</strong> because the bastion stages multi-gigabyte tarball bundles for Konvoy, Kommander, and the local container registry (Harbor/Docker registry).
              </p>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700">
                df -h /var/lib/docker
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">2. Bootstrap Kind Lifecycle</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                NKP launches an ephemeral Kubernetes-in-Docker (Kind) container on the bastion to initialize Cluster API (CAPI). Once the target Nutanix AHV management cluster is healthy, CAPI state pivots and <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-800">nkp delete bootstrap</code> cleanly removes the Kind container.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700">
                nkp delete bootstrap --kubeconfig
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">3. Firewall & Port Matrix</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The bastion requires outbound access to <strong>TCP 9443</strong> (Prism Central REST API v3), <strong>TCP 6443</strong> (Kube-apiserver VIP), and <strong>TCP 22</strong> (SSH key pair injection). Subnet collisions with default Pod CIDR (<code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-800">192.168.0.0/16</code>) cause fatal packet drops.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700">
                nc -zv prism-central.corp 9443
              </div>
            </div>
          </div>

          {/* Domain Weightings Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>NCP-CN 7.5 Examination Domain Objectives & Blueprint Weights</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                    <th className="py-2.5 px-3">Domain</th>
                    <th className="py-2.5 px-3">Objective & Bastion Relevance</th>
                    <th className="py-2.5 px-3 text-center">Weight</th>
                    <th className="py-2.5 px-3">Exam Focus Areas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Section 1: Architecture & Planning</td>
                    <td className="py-2.5 px-3">Bastion host sizing, Kind bootstrap lifecycle, and CAPI controllers</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">24%</td>
                    <td className="py-2.5 px-3">Sizing specs (4 vCPU, 16 GB, 200GB disk), cluster pivoting</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Section 2: Air-Gapped / Darksite</td>
                    <td className="py-2.5 px-3">Air-gapped tarball staging, local Harbor mirror, darksite bundles</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">22%</td>
                    <td className="py-2.5 px-3">nkp push bundle, seed registry, image content policies</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Section 3: Nutanix AHV & CAPI</td>
                    <td className="py-2.5 px-3">Prism Central IPAM, AHV subnet isolation, CAPX provider</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">20%</td>
                    <td className="py-2.5 px-3">Prism Central v3 REST API, VM templates, MachineDeployments</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Section 4: OS Prerequisites & Tools</td>
                    <td className="py-2.5 px-3">Rocky Linux/RHEL 8/9, yum-utils, bzip2, Docker Engine, containerd</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">18%</td>
                    <td className="py-2.5 px-3">OS utilities, cgroup v2 compatibility, systemctl status</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Section 5: Day-2 Ops & Troubleshooting</td>
                    <td className="py-2.5 px-3">Thanos federation, cert-manager expiry, backup restore with Velero</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">16%</td>
                    <td className="py-2.5 px-3">Kommander workspace federation, Velero PVC snapshots</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Checklist */}
      {activeGuidanceTab === 'checklist' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                <span>NCP-CN 7.5 Bastion Host Deployment Prerequisites Checklist</span>
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
      )}

      {/* TAB 3: Air-Gapped & Dark-Site Rules */}
      {activeGuidanceTab === 'airgap-rules' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                NCP-CN 7.5 Air-Gapped & Darksite Bastion Host Governance
              </h3>
              <p className="text-xs text-slate-500">
                Crucial exam questions revolve around the strict rules of air-gapped environments
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Rule 1: OS Packages Must Be Pre-Installed (Rocky/RHEL)</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Before severing external internet access, the bastion host must have <code className="bg-white px-1 py-0.5 rounded border text-slate-800 font-mono">yum-utils</code>, <code className="bg-white px-1 py-0.5 rounded border text-slate-800 font-mono">bzip2</code>, <code className="bg-white px-1 py-0.5 rounded border text-slate-800 font-mono">wget</code>, and Docker CE/EE installed.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Rule 2: Bastion Storage Expansion (200GB–500GB)</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Workload cluster nodes will pull images directly from the local private registry hosted on or seeded by the bastion. The darksite image bundle alone is &gt;40 GB uncompressed.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Rule 3: No Public IPs on Bastion in Air-Gap</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Air-gapped security policies strictly forbid assigning public routable IPs to the bastion host VM. All management and package transfers must occur via secure internal jump hosts or local repository mirrors.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Rule 4: Safe Ephemeral Kind Cluster Teardown</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                After the management cluster on Nutanix AHV is healthy, running <code className="bg-white px-1 py-0.5 rounded border text-slate-800 font-mono">nkp delete bootstrap</code> safely terminates the Kind container, freeing CPU and memory on the bastion.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
