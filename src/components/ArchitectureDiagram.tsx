import React, { useState } from 'react';
import {
  Server,
  Terminal,
  Cpu,
  Database,
  Layers,
  Shield,
  ArrowRight,
  Info,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

interface TopologyNode {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  role: string;
  ports: string;
  tools: string;
  icon: React.ReactNode;
  isBastion?: boolean;
}

export const ArchitectureDiagram: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('bastion');

  const nodes: TopologyNode[] = [
    {
      id: 'admin',
      title: 'Admin Workstation',
      subtitle: 'Operator Laptop / Terminal',
      badge: 'Client Interface',
      role: 'Initiates secure SSH connection to Bastion Host or accesses NKP Management UI dashboard.',
      ports: 'TCP 22 (SSH Outbound)',
      tools: 'SSH Client, Web Browser',
      icon: <Terminal className="w-5 h-5 text-slate-700" />,
    },
    {
      id: 'bastion',
      title: 'Bastion Host',
      subtitle: 'Central Deployment & Mgmt Jump Host',
      badge: 'Centralized Orchestrator',
      role: 'Holds NKP CLI, runs temporary local Kind bootstrap cluster, manages air-gapped image mirrors, and provisions target clusters.',
      ports: 'TCP 22 (SSH Inbound), TCP 6443 (API), TCP 9443 (CAPI webhooks)',
      tools: 'nkp CLI, Docker / containerd, kubectl, Helm, SSH keypairs',
      icon: <Server className="w-5 h-5 text-emerald-600" />,
      isBastion: true,
    },
    {
      id: 'prism',
      title: 'Nutanix Prism Central & AHV',
      subtitle: 'Hyperconverged Cloud Infrastructure',
      badge: 'Target Hypervisor',
      role: 'Provisions virtual machines, virtual networks (VLANs), and AOS Volume groups dynamically requested by CAPI / CAPX.',
      ports: 'TCP 9443 (Prism Central REST API), TCP 3260 (iSCSI for CSI Volumes)',
      tools: 'Prism Central v4 API, Acropolis OS (AOS), Nutanix Flow SDN',
      icon: <Database className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'mgmt',
      title: 'NKP Management Cluster',
      subtitle: 'Permanent Control Plane',
      badge: 'Cluster API Host',
      role: 'Takes over cluster management via Cluster API (CAPI) after pivoting from the temporary bastion Kind cluster. Governs workload clusters.',
      ports: 'TCP 6443 (kube-apiserver), TCP 2379-2380 (etcd)',
      tools: 'Cluster API (CAPI), CAPX provider, FluxCD / ArgoCD, Prometheus, Dex',
      icon: <Layers className="w-5 h-5 text-purple-600" />,
    },
    {
      id: 'workload',
      title: 'Production Workload Cluster',
      subtitle: 'Worker Nodes & Production Pods',
      badge: 'Application Runtime',
      role: 'Runs production enterprise container workloads. Mounts Nutanix Volumes dynamically via Nutanix CSI Driver.',
      ports: 'TCP 80/443 (Ingress / MetalLB), TCP 6443 (API)',
      tools: 'containerd, Calico / Cilium CNI, Nutanix CSI Driver, Envoy Ingress',
      icon: <Cpu className="w-5 h-5 text-amber-600" />,
    },
  ];

  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[1];

  return (
    <div
      id="architecture-section"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-600" />
            <span>Nutanix Kubernetes Platform (NKP) Deployment Topology</span>
          </h3>
          <p className="text-xs text-slate-500">
            Interactive visual flow showing the Bastion Host as the centralized deployment orchestrator
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
          Click nodes to inspect
        </span>
      </div>

      {/* Visual Workflow Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 relative">
        {nodes.map((node, idx) => {
          const isSelected = node.id === activeNodeId;
          return (
            <div
              key={node.id}
              onClick={() => setActiveNodeId(node.id)}
              className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                node.isBastion
                  ? isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/30'
                    : 'border-emerald-400/80 bg-emerald-50/30 hover:bg-emerald-50/60'
                  : isSelected
                  ? 'border-slate-800 bg-slate-50 shadow-md ring-2 ring-slate-800/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              {node.isBastion && (
                <div className="absolute -top-2.5 left-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  Exam Focus
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    {node.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Step {idx + 1}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 leading-snug">{node.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">{node.subtitle}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-medium text-slate-600 truncate">{node.badge}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Details Box */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
              {activeNode.icon}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{activeNode.title}</h4>
              <p className="text-xs text-slate-500">{activeNode.subtitle}</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
            {activeNode.badge}
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">{activeNode.role}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80 text-xs">
          <div>
            <span className="font-semibold text-slate-800 block mb-0.5">Key Software & Tools:</span>
            <span className="text-slate-600 font-mono text-[11px]">{activeNode.tools}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-800 block mb-0.5">Network Ports & Protocol:</span>
            <span className="text-slate-600 font-mono text-[11px]">{activeNode.ports}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
