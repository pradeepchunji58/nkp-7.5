import { PrerequisiteCheck } from '../types';

export const BASTION_PREREQUISITES: PrerequisiteCheck[] = [
  {
    id: 'prereq-os',
    category: 'Hardware & OS',
    title: 'Linux Operating System & Specifications',
    description:
      'A dedicated 64-bit Linux virtual or physical machine (RHEL 8/9, Rocky Linux 8/9, or Ubuntu 20.04/22.04 LTS). Recommended minimum: 4 vCPU, 16 GB RAM, and at least 100 GB free disk space.',
    commandSnippet: 'cat /etc/os-release && lscpu | grep "CPU(s):" && free -h && df -h /',
    importance: 'Required',
  },
  {
    id: 'prereq-docker',
    category: 'Binaries & Tools',
    title: 'Container Runtime Engine (Docker / containerd)',
    description:
      'Docker Engine (CE or EE) or containerd must be active and enabled so NKP can spawn the local temporary Kind bootstrap cluster during deployment.',
    commandSnippet: 'sudo systemctl enable --now docker && docker run --rm hello-world',
    importance: 'Required',
  },
  {
    id: 'prereq-nkp-cli',
    category: 'Binaries & Tools',
    title: 'NKP CLI Binary in System PATH',
    description:
      'The official Nutanix Kubernetes Platform binary (nkp) downloaded from Nutanix Support Portal, extracted and placed in /usr/local/bin with executable permissions.',
    commandSnippet: 'tar -zxvf nkp_v2.12.0_linux_amd64.tar.gz && sudo mv nkp /usr/local/bin/ && nkp version',
    importance: 'Required',
  },
  {
    id: 'prereq-kubectl',
    category: 'Binaries & Tools',
    title: 'Kubectl CLI & Helm Tools',
    description:
      'Kubernetes standard management CLI (kubectl) matching the target Kubernetes minor version, plus Helm 3 for package management operations.',
    commandSnippet: 'curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && sudo install -m 0755 kubectl /usr/local/bin/kubectl',
    importance: 'Required',
  },
  {
    id: 'prereq-ssh',
    category: 'Security & Auth',
    title: 'SSH Key Pair for Node Access',
    description:
      'An RSA or ED25519 SSH key pair generated on the bastion host. The public key is injected into target VM cloud-init configurations for passwordless root/admin troubleshooting.',
    commandSnippet: 'ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""',
    importance: 'Required',
  },
  {
    id: 'prereq-prism',
    category: 'Networking & Ports',
    title: 'Nutanix Prism Central & Element Network Reachability',
    description:
      'HTTPS connectivity (TCP port 9443) to Prism Central VIP and target Prism Element clusters, with verified cluster administrator credentials or service account.',
    commandSnippet: 'curl -k -v https://prism-central.corp.internal:9443/v3/clusters/list',
    importance: 'Required',
  },
  {
    id: 'prereq-ports',
    category: 'Networking & Ports',
    title: 'Kubernetes Control Plane Ports & Firewalls',
    description:
      'Outbound and bidirectional communication on TCP 6443 (kube-apiserver), TCP 22 (SSH), TCP 2379-2380 (etcd), and TCP 9443 (CAPI webhook & admission controllers).',
    commandSnippet: 'nc -zv 10.100.20.10 6443 && nc -zv 10.100.20.10 22',
    importance: 'Required',
  },
  {
    id: 'prereq-airgap',
    category: 'Air-Gapped',
    title: 'Private Registry Mirror & Preloaded Image Bundle',
    description:
      'For disconnected sites, the NKP air-gapped image tarball loaded onto the bastion host and pushed to the internal Harbor or private Docker registry.',
    commandSnippet: 'nkp push bundle --bundle ./nkp-airgapped-bundle-v2.12.0.tar.gz --to-registry registry.internal.corp:5000',
    importance: 'Recommended',
  },
];
