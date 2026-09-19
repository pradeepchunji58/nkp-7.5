import { Question } from '../../types';

export const questions1to40: Question[] = [
  {
    id: 'q1',
    badge: 'Monitoring & Thanos',
    title: 'Identifying Attached Cluster Metrics in Centralized Monitoring',
    scenario: 'In the centralized monitoring view on the management cluster, a team needs to tell which attached cluster a given metric or alert came from.',
    prompt: 'What identifies each attached cluster there?',
    options: [
      { id: 'a', text: 'The external IP address of the cluster\'s load balancer', isCorrect: false, explanation: 'IP addresses change and are not the primary label identifiers in Prometheus.' },
      { id: 'b', text: 'A hostname of the cluster\'s management control plane node', isCorrect: false, explanation: 'Hostnames are node-specific, not cluster-wide identifiers.' },
      { id: 'c', text: 'The name assigned to the cluster at creation time', isCorrect: true, explanation: 'Prometheus metrics include cluster labels corresponding to the cluster name assigned during creation.' },
      { id: 'd', text: 'A monitoring ID matching the kube-system namespace UID', isCorrect: false, explanation: 'Namespaces UIDs are internal Kubernetes objects, not cluster labels.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'Centralized Thanos and Prometheus monitoring distinguishes metrics across fleets using the cluster name.',
    deepExplanation: 'When Prometheus scrapes federated or remote-written metrics from attached clusters, it tags time-series data with the cluster name label.'
  },
  {
    id: 'q2',
    badge: 'Security & OIDC / AD',
    title: 'Troubleshooting NKP-Cluster-Admin AD Group Login Failures',
    scenario: 'NKP-Cluster-Admin AD Group users cannot login to Kommander and the appropriate role binding is completed. AD Groups Demo Users and NKP-Admins are working fine.',
    prompt: 'What is the issue?',
    options: [
      { id: 'a', text: 'NKP-Cluster-Admin is a reserved group requiring SAML', isCorrect: false, explanation: 'Reserved group naming conventions require specific prefixes in Kommander.' },
      { id: 'b', text: 'NKP-Cluster-Admin is a system group and cannot be used', isCorrect: false, explanation: 'System groups follow specific prefixing rules.' },
      { id: 'c', text: 'OIDC is only compatible with GitHub IDP, not Active Directory', isCorrect: false, explanation: 'OIDC works with AD via Keycloak / Dex.' },
      { id: 'd', text: 'NKP-Cluster-Admin added without pre-seeding it with OIDC:', isCorrect: true, explanation: 'External OIDC group names in Kommander must be prefixed correctly (e.g. oidc:) or match pre-seeded identity mappings.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'External OIDC and Active Directory group bindings in Kommander require proper prefixing and pre-seeding.',
    deepExplanation: 'Role bindings referencing external identity provider groups must match the exact string format emitted by the OIDC token claims.'
  },
  {
    id: 'q3',
    badge: 'Bastion Guidance',
    title: 'Primary Purpose of the Bastion Host in NKP',
    scenario: 'An administrator is preparing to deploy a Kubernetes cluster using Nutanix Kubernetes Platform (NKP) and configuring a bastion host.',
    prompt: 'What is the primary purpose of the bastion host?',
    options: [
      { id: 'a', text: 'Provide a storage platform for Kubernetes persistent volume provisioning.', isCorrect: false, explanation: 'Storage is provided by Nutanix Volumes/Files CSI.' },
      { id: 'b', text: 'Provide a dedicated platform for running production containerized applications.', isCorrect: false, explanation: 'Workload clusters run applications, not the bastion.' },
      { id: 'c', text: 'Provide a centralized system for deployment and management operations.', isCorrect: true, explanation: 'The bastion host acts as the operational jumpbox and CLI execution environment for bootstrapping.' },
      { id: 'd', text: 'Provide a backup platform for recovering failed Kubernetes workloads.', isCorrect: false, explanation: 'Velero and object storage handle backups.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'The bastion host serves as the secure operational staging and management jumpbox for NKP deployments.',
    deepExplanation: 'Administrators log into the bastion host to execute `nkp create cluster`, manage air-gapped image bundles, and hold kubeconfig files.'
  },
  {
    id: 'q4',
    badge: 'CAPI & Cluster Lifecycle',
    title: 'Sequencing Decommissioning of an NKP Environment',
    scenario: 'A team plans to decommission an entire NKP environment that includes a management cluster and several managed clusters, all created through Kommander.',
    prompt: 'To remove everything cleanly, how should the deletion be sequenced?',
    options: [
      { id: 'a', text: 'Delete only the management cluster, which removes the rest.', isCorrect: false, explanation: 'Orphaning workload clusters by deleting management planes first causes hanging cloud resources.' },
      { id: 'b', text: 'Delete the managed clusters first, then the management cluster.', isCorrect: true, explanation: 'Managed workload clusters must be deleted while the CAPI management cluster is active to ensure proper infrastructure teardown.' },
      { id: 'c', text: 'Delete the management cluster first, then the managed clusters.', isCorrect: false, explanation: 'Deleting management clusters first leaves workload infrastructure unmanaged.' },
      { id: 'd', text: 'Delete all clusters simultaneously from the bastion VM.', isCorrect: false, explanation: 'Simultaneous deletion causes race conditions.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Always delete managed workload clusters before destroying the CAPI management cluster.',
    deepExplanation: 'CAPI controllers on the management cluster orchestrate cloud and AHV resource cleanup; destroying them first leaves dangling VMs.'
  },
  {
    id: 'q5',
    badge: 'Security & RBAC',
    title: 'Troubleshooting AD Observability Group Authorization Failures',
    scenario: 'An administrator configured an AD IDP and added an AD group named "NKP Observability", but login to the Kommander UI fails with authorization errors.',
    prompt: 'What is the likely reason?',
    options: [
      { id: 'a', text: 'Observability groups can only access Prometheus directly.', isCorrect: false, explanation: 'UI access requires RBAC role bindings.' },
      { id: 'b', text: 'All users by default have access to K8 resources and is likely an issue connecting to AD.', isCorrect: false, explanation: 'Default access is restricted.' },
      { id: 'c', text: 'Observability groups can only access Grafana directly.', isCorrect: false, explanation: 'Authorization is governed by Kubernetes RBAC.' },
      { id: 'd', text: 'The Role Binding was never created allowing access to the NKP UI.', isCorrect: true,explanation: 'Authentication succeeds via AD/OIDC, but without a corresponding WorkspaceRoleBinding or ClusterRoleBinding, authorization fails.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Successful authentication via IDP still requires explicit RoleBindings or WorkspaceRoleBindings for UI authorization.',
    deepExplanation: 'Even when users authenticate successfully against Active Directory, Kommander denies access unless a corresponding RBAC binding exists.'
  },
  {
    id: 'q6',
    badge: 'Bastion & Bootstrap',
    title: 'STORAGE_CONTAINER_NAME Reference in NKP Bootstrap',
    scenario: 'A Platform engineer is creating a new bootstrap cluster to deploy NKP on Nutanix.',
    prompt: 'What does the STORAGE_CONTAINER_NAME reference when setting the environment variables?',
    options: [
      { id: 'a', text: 'The CSI name used for provisioning initial pods', isCorrect: false, explanation: 'Not a CSI name.' },
      { id: 'b', text: 'The storage container name needed in an Air-Gapped environment', isCorrect: false, explanation: 'It references Nutanix AHV storage containers.' },
      { id: 'c', text: 'The Docker Container used by the bootstap VM', isCorrect: false, explanation: 'Not a docker container.' },
      { id: 'd', text: 'The name of the Storage Container in Prism Element', isCorrect: true, explanation: '`STORAGE_CONTAINER_NAME` specifies the target Nutanix Prism Element storage container where VM disks are provisioned.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Environment variables for Nutanix provisioning reference storage containers configured in Prism Element.',
    deepExplanation: 'During NKP AHV bootstrap, `STORAGE_CONTAINER_NAME` tells CAPI where to store virtual machine disks.'
  },
  {
    id: 'q7',
    badge: 'CAPI & Autoscaling',
    title: 'Preventing Cluster Autoscaler Scale-Down Actions',
    scenario: 'An administrator is observing a 4-node NKP cluster with Cluster Autoscaling configured with very low utilization, but the cluster has not scaled down.',
    prompt: 'What is preventing the scale-down action from occurring?',
    options: [
      { id: 'a', text: 'A node has "cluster-autoscaler.kubernetes.io/scale-down-disabled": "true" set.', isCorrect: true, explanation: 'Annotation `cluster-autoscaler.kubernetes.io/scale-down-disabled: "true"` explicitly prevents autoscaler from removing nodes.' },
      { id: 'b', text: 'The sum of the CPU requests and Memory requests are smaller than 50% of the node\'s allocatable flag.', isCorrect: false, explanation: 'Low utilization normally encourages scale-down.' },
      { id: 'c', text: 'cluster.x-k8s.io/cluster-api-autoscaler-node-group-min-size is set to 3.', isCorrect: false, explanation: '4 nodes is above min size 3.' },
      { id: 'd', text: 'A node has been in the unneeded state for 15 minutes.', isCorrect: false, explanation: 'Unneeded timeout triggers scale-down after 10-15m unless blocked.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'Specific annotations on nodes can disable scale-down operations in Kubernetes Cluster Autoscaler.',
    deepExplanation: 'Administrators use scale-down-disabled annotations to protect specific worker nodes from being drained and terminated.'
  },
  {
    id: 'q8',
    badge: 'Workspaces & Fleet',
    title: 'Primary Benefit of Attaching Clusters to a Workspace',
    scenario: 'An administrator has successfully deployed multiple Kubernetes clusters and wants to manage them through a centralized workspace in Kommander.',
    prompt: 'What is the primary benefit of attaching clusters to a workspace?',
    options: [
      { id: 'a', text: 'Organizing and managing clusters through a common administrative and operational context.', isCorrect: true, explanation: 'Workspaces group clusters and teams together for unified RBAC, GitOps, and platform applications.' },
      { id: 'b', text: 'Automatically migrating application workloads between clusters without administrator input.', isCorrect: false, explanation: 'Workloads do not migrate automatically.' },
      { id: 'c', text: 'Replacing cluster networking with a single network configuration across all clusters.', isCorrect: false, explanation: 'Networking remains cluster-specific.' },
      { id: 'd', text: 'Converting multiple clusters into a single Kubernetes control plane for workload scheduling.', isCorrect: false, explanation: 'Control planes remain distinct.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'Workspaces provide a unified administrative, security, and operational boundary for multiple clusters.',
    deepExplanation: 'Kommander workspaces allow platform teams to manage access control, applications, and policies across multiple clusters simultaneously.'
  },
  {
    id: 'q9',
    badge: 'Platform Applications',
    title: 'Foundational Platform Applications Required for NKP',
    scenario: 'For an administrator to enable any application, which foundational applications must be enabled for Platform Applications to work properly?',
    prompt: 'Identify the core foundational stack:',
    options: [
      { id: 'a', text: 'Flux, Reloader, Traefik', isCorrect: false, explanation: 'Traefik is ingress.' },
      { id: 'b', text: 'Reloader, Dex, Harbor', isCorrect: false, explanation: 'Harbor is registry.' },
      { id: 'c', text: 'Helm, Reloader, External DNS', isCorrect: false, explanation: 'Missing core controller.' },
      { id: 'd', text: 'Gatekeeper, Helm, Flux', isCorrect: true, explanation: 'Flux (GitOps engine), Helm (package manager), and Gatekeeper (policy engine) form the core foundational platform applications.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Flux, Helm, and Gatekeeper are foundational controllers required to manage platform applications in NKP.',
    deepExplanation: 'Kommander relies on Flux for GitOps reconciliation, Helm for chart management, and Gatekeeper for policy enforcement.'
  },
  {
    id: 'q10',
    badge: 'Cluster Attachment & Networking',
    title: 'Resolving Cluster Attachment API Inaccessibility',
    scenario: 'A cluster attachment has failed due to the cluster\'s API not being accessible from the same network as the Management Cluster.',
    prompt: 'Which action must be taken to allow a successful attachment of the cluster?',
    options: [
      { id: 'a', text: 'Select No additional networking restrictions.', isCorrect: false, explanation: 'Does not solve network reachability.' },
      { id: 'b', text: 'Create a secure tunnel using NKP and kubetunnel.', isCorrect: true, explanation: 'When management and workload clusters reside across isolated networks, NKP secure tunnel bridges API connectivity.' },
      { id: 'c', text: 'Create a service account.', isCorrect: false, explanation: 'Service accounts do not solve L3 network isolation.' },
      { id: 'd', text: 'Update the kubeconfig file to have an external IP address.', isCorrect: false, explanation: 'Updating kubeconfig without routing does not enable connectivity.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'NKP secure tunnels enable cluster attachment across isolated enterprise networks.',
    deepExplanation: 'When direct TCP/443 reachability to the workload cluster API server is blocked, secure tunneling relays traffic securely.'
  },
  {
    id: 'q11',
    badge: 'Bastion Guidance',
    title: 'Required Container Engine on Bastion Host',
    scenario: 'An administrator is preparing the host that will run the NKP Konvoy CLI to bootstrap an air-gapped cluster.',
    prompt: 'Which component must be present on that host before starting?',
    options: [
      { id: 'a', text: 'A CNI plugin such as Cilium', isCorrect: false, explanation: 'CNI runs on Kubernetes nodes.' },
      { id: 'b', text: 'A container engine such as Docker', isCorrect: true, explanation: 'Konvoy CLI uses Docker or container runtime to run bootstrap installers and manage container images.' },
      { id: 'c', text: 'An etcd cluster for storing state', isCorrect: false, explanation: 'Etcd runs inside the Kubernetes control plane.' },
      { id: 'd', text: 'The Cluster API (CAPI) controller manager', isCorrect: false, explanation: 'CAPI controllers run on the management cluster.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'A container engine (Docker / Podman) is required on the bastion host for NKP bootstrap operations.',
    deepExplanation: 'Konvoy uses container runtimes on the operator machine to execute bootstrap containers and unpack air-gapped bundles.'
  },
  {
    id: 'q12',
    badge: 'Cluster Sizing & Storage',
    title: 'Minimum System Disk Sizing for Worker Nodes',
    scenario: 'An administrator is sizing the system disk of each worker machine in an NKP cluster, which holds /var/lib/kubelet and /var/lib/containerd.',
    prompt: 'What is the minimum approximate size NKP requires for this action?',
    options: [
      { id: 'a', text: '32 GiB', isCorrect: false, explanation: '32 GiB is too small for production container layers and logs.' },
      { id: 'b', text: '80 GiB', isCorrect: true, explanation: 'NKP recommended minimum system disk size for worker nodes is 80 GiB to accommodate container images and logs.' },
      { id: 'c', text: '120 GiB', isCorrect: false, explanation: 'Exceeds strict minimum recommendation.' },
      { id: 'd', text: '150 GiB', isCorrect: false, explanation: 'Exceeds standard sizing guidelines.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Worker nodes require at least 80 GiB of system disk space for container runtimes and logs.',
    deepExplanation: 'Adequate disk sizing prevents node pressure eviction caused by filled containerd image stores.'
  },
  {
    id: 'q13',
    badge: 'CAPI & Autoscaling',
    title: 'Cluster Autoscaler Configuration Level',
    scenario: 'An administrator wants to configure Cluster Autoscaler for an NKP cluster with multiple Worker Node Pools.',
    prompt: 'On what level should the administrator configure the Cluster Autoscaler?',
    options: [
      { id: 'a', text: 'Worker Node Pool', isCorrect: true, explanation: 'Cluster autoscaling rules and min/max limits are configured per Worker Node Pool.' },
      { id: 'b', text: 'Kubernetes Cluster', isCorrect: false, explanation: 'Configured granularly per node pool.' },
      { id: 'c', text: 'Worker Pod', isCorrect: false, explanation: 'Pods do not configure autoscaler.' },
      { id: 'd', text: 'Worker Node', isCorrect: false, explanation: 'Configured at node pool level.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'Cluster Autoscaler is configured at the individual Worker Node Pool level in CAPI.',
    deepExplanation: 'Administrators define minimum and maximum node counts for each specific worker node pool via annotations or machine deployment specs.'
  },
  {
    id: 'q14',
    badge: 'Licensing Tiers',
    title: 'NKP Full Stack Ultimate License Inclusions',
    scenario: 'A review of licensing tiers for hybrid cloud capabilities.',
    prompt: 'What is included in NKP Full Stack Ultimate license?',
    options: [
      { id: 'a', text: 'NCI Starter', isCorrect: false, explanation: 'NCI is Nutanix Cloud Infrastructure.' },
      { id: 'b', text: 'NCI Pro', isCorrect: false, explanation: 'NCI Pro tier.' },
      { id: 'c', text: 'NCI Ultimate', isCorrect: false, explanation: 'NCI Ultimate tier.' },
      { id: 'd', text: 'NCI-C Ultimate', isCorrect: true, explanation: 'NKP Full Stack Ultimate includes comprehensive enterprise capabilities and infrastructure tiers.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'NKP Ultimate licenses bundle complete enterprise feature sets for multi-cloud fleet management.',
    deepExplanation: 'Ultimate tier licensing unlocks multi-cloud provisioning and advanced platform insights.'
  },
  {
    id: 'q15',
    badge: 'Platform Applications & CLI',
    title: 'Verifying Helm Release Status',
    scenario: 'After a successful initial implementation, the operations team faces the challenge of validating Helm Releases to ensure applications run correctly.',
    prompt: 'Which command should the company execute to know the right status of their Helm Releases?',
    options: [
      { id: 'a', text: 'kubectl get namespaces', isCorrect: false, explanation: 'Namespaces do not show helm release sync health.' },
      { id: 'b', text: 'kubectl apply -f fluent-bit-overrides.yaml', isCorrect: false, explanation: 'Apply modifies resources.' },
      { id: 'c', text: 'kubectl get helmreleases -n ${PROJECT_NAMESPACE}', isCorrect: true, explanation: 'Flux HelmRelease custom resources report synchronization and reconciliation status.' },
      { id: 'd', text: 'kubectl edit helmreleases -n ${PROJECT_NAMESPACE}', isCorrect: false, explanation: 'Edit opens manifests for modification.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: '`kubectl get helmreleases` inspects the deployment status of Flux-managed Helm applications.',
    deepExplanation: 'Platform applications deployed via Kommander are backed by Flux HelmReleases, which indicate ready status and revision history.'
  },
  {
    id: 'q16',
    badge: 'Monitoring & Logging',
    title: 'Safely Enabling FluentBit on NKP Management Cluster',
    scenario: 'What should an administrator do to safely enable Fluentbit on an NKP management cluster?',
    prompt: 'Identify the proper prerequisite:',
    options: [
      { id: 'a', text: 'Configure additional storage on the rook-ceph-cluster.', isCorrect: false, explanation: 'Rook ceph is not mandatory for logging.' },
      { id: 'b', text: 'Configure additional storage on the rook-grafana-cluster.', isCorrect: false, explanation: 'No rook-grafana cluster exists.' },
      { id: 'c', text: 'Create an NFS share and mount to all pods in the cluster.', isCorrect: false, explanation: 'Fluent Bit forwards logs to Loki, not NFS.' },
      { id: 'd', text: 'Create an S3 object share, then update the default storage service.', isCorrect: false, explanation: 'Loki backend storage requires persistent object storage or PVCs.' }
    ],
    correctOptionId: 'd', // or standard logging setup prerequisite
    keyTakeaway: 'Log aggregation backends require persistent storage configuration to retain logs reliably.',
    deepExplanation: 'Enabling logging stacks requires provisioning adequate storage backends for Loki log aggregation.'
  },
  {
    id: 'q17',
    badge: 'Image Builder & OS',
    title: 'Using Ubuntu 24.04 with Nutanix Image Builder in NKP 2.17',
    scenario: 'An NKP administrator is using Nutanix Image Builder (NIB) and wants to utilize an Ubuntu 24.04 base image for a new NKP machine image on Nutanix AHV (NKP version 2.15).',
    prompt: 'What is the best supported course of action?',
    options: [
      { id: 'a', text: 'Upgrade NKP to 2.16 and use NIB to create the new Ubuntu machine image.', isCorrect: false, explanation: 'Ubuntu 24.04 support is tied to later releases.' },
      { id: 'b', text: 'Use NIB to create the new Ubuntu machine image and manually add to Prism Central.', isCorrect: false, explanation: 'Version compatibility requires matching CLI tools.' },
      { id: 'c', text: 'Use NIB to create the new Ubuntu machine image and manually add to Prism Element.', isCorrect: false, explanation: 'Prism Central manages AHV images.' },
      { id: 'd', text: 'Upgrade NKP to 2.17 and use NIB to create the new Ubuntu machine image.', isCorrect: true, explanation: 'Newer OS base images like Ubuntu 24.04 require upgrading to NKP 2.17 where Image Builder fully validates and supports them.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Upgrading NKP to version 2.17 ensures support for modern base operating system images like Ubuntu 24.04.',
    deepExplanation: 'Compatibility matrices dictate that newer OS templates are certified and built using corresponding NIB releases.'
  },
  {
    id: 'q18',
    badge: 'Workspaces & Fleet',
    title: 'Benefits of Attaching Clusters to Workspaces',
    scenario: 'An administrator has attached a Kubernetes cluster to an NKP workspace that contains other clusters.',
    prompt: 'What is a benefit of attaching this new cluster to that workspace?',
    options: [
      { id: 'a', text: 'Combines all nodes into one cluster', isCorrect: false, explanation: 'Clusters remain independent control planes.' },
      { id: 'b', text: 'Allows Centralized Platform application deployment', isCorrect: true, explanation: 'Workspace grouping allows deploying platform apps (monitoring, logging, etc.) across all member clusters simultaneously.' },
      { id: 'c', text: 'Spans workloads across workspaces', isCorrect: false, explanation: 'Workloads are scoped to workspaces.' },
      { id: 'd', text: 'Eliminates the need to authenticate to the cluster', isCorrect: false, explanation: 'Authentication is managed via OIDC.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Workspace attachment enables centralized platform application deployment and unified policy management.',
    deepExplanation: 'Attaching clusters to workspaces lets platform teams roll out applications and GitOps configurations across the fleet.'
  },
  {
    id: 'q19',
    badge: 'CAPI & Cluster Lifecycle',
    title: 'Prerequisites for Deleting a Self-Managed Cluster',
    scenario: 'A platform engineer needs to delete a self-managed cluster.',
    prompt: 'What should the engineer do prior to completing this task?',
    options: [
      { id: 'a', text: 'Delete the bootstrap cluster.', isCorrect: false, explanation: 'Bootstrap clusters are temporary.' },
      { id: 'b', text: 'Delete the workload cluster.', isCorrect: false, explanation: 'Self-managed clusters manage themselves.' },
      { id: 'c', text: 'Create a Bootstrap cluster.', isCorrect: false, explanation: 'Bootstrap cluster is for initial provisioning.' },
      { id: 'd', text: 'Move the CAPI resources.', isCorrect: true, explanation: 'Before deleting a self-managed cluster or transferring control, CAPI management resources must be properly accounted for or moved.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'CAPI resource state must be managed when lifecycle-managing self-managed clusters.',
    deepExplanation: 'Cluster API relies on custom resources representing nodes and infrastructure providers.'
  },
  {
    id: 'q20',
    badge: 'Licensing Tiers',
    title: 'Prerequisite for Upgrading NKP License to Ultimate',
    scenario: 'Reviewing prerequisites for upgrading NKP license tiers.',
    prompt: 'What is a prerequisite for upgrading an NKP license to Ultimate?',
    options: [
      { id: 'a', text: 'Size the ETCD nodes appropriately to support the installation of default platform services.', isCorrect: false, explanation: 'Licensing key upgrades do not mandate etcd hardware resizing.' },
      { id: 'b', text: 'Size the Worker nodes appropriately to support the installation of default platform services.', isCorrect: false, explanation: 'Worker sizing depends on workloads.' },
      { id: 'c', text: 'Size the Sidecar containers appropriately to support the installation of default platform services.', isCorrect: false, explanation: 'Sidecars scale automatically.' },
      { id: 'd', text: 'Size the Control Plane nodes appropriately to support the installation of default platform services.', isCorrect: true, explanation: 'Enabling enterprise Ultimate features (Insights, advanced logging) requires ensuring control plane and management nodes meet resource sizing guidelines.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Upgrading feature tiers requires verifying control plane node sizing to support additional controllers.',
    deepExplanation: 'Additional platform services introduced in Ultimate editions consume cluster control plane resources.'
  },
  {
    id: 'q21',
    badge: 'Networking & Air-Gapped',
    title: 'Avoiding Pod CIDR Collisions in Air-Gapped AWS Deployments',
    scenario: 'A Platform Engineer is deploying an NKP cluster within an air-gapped AWS environment where the default pod CIDR range conflicts with existing subnets.',
    prompt: 'How can the engineer ensure there are no collisions between NKP pod traffic and the existing network?',
    options: [
      { id: 'a', text: 'Configure pod CIDR via advanced network options in the NKP UI during cluster creation manifest generation.', isCorrect: true, explanation: 'Custom pod CIDR blocks can be specified in cluster configuration manifests or UI network settings.' },
      { id: 'b', text: 'Rely on automatic collision avoidance.', isCorrect: false, explanation: 'Kubernetes does not automatically avoid existing corporate IP collisions.' },
      { id: 'c', text: 'Air-gapped environments do not require CIDR configuration.', isCorrect: false, explanation: 'CIDR ranges are always required.' },
      { id: 'd', text: 'Modify the VPC subnet after cluster bootstrap.', isCorrect: false, explanation: 'VPC subnets cannot be easily changed post-deployment.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'Customizing pod CIDR ranges during cluster creation prevents network routing collisions with corporate subnets.',
    deepExplanation: 'Administrators must specify non-overlapping pod and service network CIDRs in cluster configuration manifests before bootstrapping.'
  },
  {
    id: 'q22',
    badge: 'Bastion & Air-Gapped',
    title: 'Causes of Increased Storage Requirements on Air-Gapped Bastion VMs',
    scenario: 'What causes an air-gapped bastion VM to have increased storage requirements?',
    prompt: 'Identify the primary storage consumer:',
    options: [
      { id: 'a', text: 'The cluster etcd datastore and control-plane certificates', isCorrect: false, explanation: 'Etcd is on control plane nodes.' },
      { id: 'b', text: 'The workload pods\' persistent volumes and CSI data', isCorrect: false, explanation: 'CSI provisions storage on backend arrays.' },
      { id: 'c', text: 'The Kommander management components and dashboard', isCorrect: false, explanation: 'Kommander runs on the cluster.' },
      { id: 'd', text: 'The Konvoy air-gapped bundles and the local image registry', isCorrect: true, explanation: 'Air-gapped bastion hosts store gigabytes of container image tarballs, helm charts, and local registry storage.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Air-gapped bastion hosts require substantial disk space to host local image registries and software bundles.',
    deepExplanation: 'Downloading complete NKP software bundles (`nkp pull bundle`) requires dozens of gigabytes of local bastion storage.'
  },
  {
    id: 'q23',
    badge: 'Installation & CLI',
    title: 'Installing Kommander with Custom Installer Configuration',
    scenario: 'An administrator created the initial Kommander installer configuration file and is now installing Kommander.',
    prompt: 'Which option can be used to create Kommander with the installer configuration file?',
    options: [
      { id: 'a', text: 'nkp install kommander --installer-config kommander.yaml --kubeconfig=${CLUSTER_NAME}.conf', isCorrect: true, explanation: 'The correct CLI flag to pass custom installer configurations is `--installer-config`.' },
      { id: 'b', text: 'nkp create kommander -f kommander.yaml', isCorrect: false, explanation: 'Incorrect subcommand syntax.' },
      { id: 'c', text: 'kubectl apply -f kommander.yaml', isCorrect: false, explanation: 'Installer configurations are processed via the `nkp` CLI.' },
      { id: 'd', text: 'nkp install kommander -c kommander.yaml', isCorrect: false, explanation: 'Incorrect flag name.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'Use `nkp install kommander --installer-config <file>` to deploy customized Kommander manifests.',
    deepExplanation: 'Passing custom YAML configuration files via `--installer-config` customizes platform application parameters during installation.'
  },
  {
    id: 'q24',
    badge: 'Platform Applications & CLI',
    title: 'Enabling Applications via NKP CLI',
    scenario: 'An admin is enabling app kiali-2.18 using the NKP CLI.',
    prompt: 'Which command correctly identifies the <App-ID> and <Version>?',
    options: [
      { id: 'a', text: 'nkp create appdeployment kiali --app kiali-2.18 --workspace ${WORKSPACE_NAME}', isCorrect: true, explanation: '`nkp create appdeployment <name> --app <app-version> --workspace <workspace>` is the correct CLI syntax.' },
      { id: 'b', text: 'nkp apply appdeployment kiali', isCorrect: false, explanation: 'Incorrect subcommand.' },
      { id: 'c', text: 'nkp run appdeployment', isCorrect: false, explanation: 'Incorrect subcommand.' },
      { id: 'd', text: 'kubectl create appdeployment', isCorrect: false, explanation: 'Appdeployment is managed via `nkp` or custom resources.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: '`nkp create appdeployment` deploys workspace-scoped platform applications.',
    deepExplanation: 'Administrators use `nkp create appdeployment` to enable applications like Kiali, Harbor, or Prometheus within specific workspaces.'
  },
  {
    id: 'q25',
    badge: 'Monitoring & Thanos',
    title: 'Collecting Centralized Metrics with Thanos and Grafana',
    scenario: 'A Cloud Engineer has been tasked with collecting and reviewing centralized metrics across various platform environments to identify OOM errors.',
    prompt: 'What should the engineer do to address this request?',
    options: [
      { id: 'a', text: 'Utilize Fluentd for metrics.', isCorrect: false, explanation: 'Fluentd is for logs, not metrics.' },
      { id: 'b', text: 'Utilize Prometheus to collect metrics and Thanos Query to federate them across attached clusters, visualized in Grafana.', isCorrect: true, explanation: 'Thanos collects and queries metrics across all attached clusters, and Grafana visualizes them.' },
      { id: 'c', text: 'Use Fluent Bit for metrics.', isCorrect: false, explanation: 'Fluent Bit is for logs.' },
      { id: 'd', text: 'Use standalone Prometheus without Thanos.', isCorrect: false, explanation: 'Standalone Prometheus does not federate multi-cluster fleets centrally.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Thanos and Prometheus combine with Grafana to provide centralized multi-cluster metrics and dashboards.',
    deepExplanation: 'NKP integrates Prometheus on workload clusters with Thanos Query on the management cluster to aggregate time-series telemetry globally.'
  },
  {
    id: 'q26',
    badge: 'Bootstrap & Networking',
    title: 'Resolving Bootstrap CIDR Conflicts (172.18.0.0/16)',
    scenario: 'A company network already uses 172.18.0.0/16, which is the NKP bootstrap default. However, the administrator has not yet run the nkp create bootstrap command.',
    prompt: 'What is the correct action?',
    options: [
      { id: 'a', text: 'Edit /etc/cloud/cloud.cfg.d/ on the operator machine.', isCorrect: false, explanation: 'Does not configure Docker bridge networks.' },
      { id: 'b', text: 'Change the company\'s network off 172.18.0.0/16.', isCorrect: false, explanation: 'Changing corporate subnets is impractical.' },
      { id: 'c', text: 'Export a non-conflicting subnet and gateway environment variable before running bootstrap.', isCorrect: true, explanation: 'Setting environment variables or flags overrides default Docker/bootstrap IP subnets to prevent routing conflicts.' },
      { id: 'd', text: 'Run nkp create bootstrap first, then renumber.', isCorrect: false, explanation: 'Cannot renumber post-creation easily.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'Export custom network variables to prevent IP subnet collisions with the NKP bootstrap network.',
    deepExplanation: 'When 172.18.0.0/16 conflicts with corporate networks, operators configure alternative subnets prior to running bootstrap.'
  },
  {
    id: 'q27',
    badge: 'Bootstrap & Networking',
    title: 'Handling Bootstrap Subnet Conflicts',
    scenario: 'A company network uses 172.18.0.0/16, conflicting with the NKP bootstrap default before running bootstrap.',
    prompt: 'What is the correct action?',
    options: [
      { id: 'a', text: 'Export non-conflicting subnet variables prior to bootstrap execution.', isCorrect: true, explanation: 'Configuring custom subnets beforehand avoids routing overlaps.' },
      { id: 'b', text: 'Ignore the warning.', isCorrect: false, explanation: 'Ignoring leads to packet dropping.' },
      { id: 'c', text: 'Reboot bastion.', isCorrect: false, explanation: 'Rebooting does not change default subnets.' },
      { id: 'd', text: 'Reinstall Docker.', isCorrect: false, explanation: 'Docker bridge networks must be configured.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'Prevent network overlap by configuring custom subnets before bootstrapping.',
    deepExplanation: 'Setting environment variables overrides default bridge ranges.'
  },
  {
    id: 'q28',
    badge: 'Monitoring & Workspaces',
    title: 'Enabling Logging Stack Components for Cluster Deployments',
    scenario: 'A Kubernetes administrator needs to ensure Grafana Logging, Grafana Loki, and Project Logging are deployed whenever a new workload cluster is deployed to a workspace.',
    prompt: 'Where should the administrator enable these components?',
    options: [
      { id: 'a', text: 'Enable them in the Insights section under workspace.', isCorrect: false, explanation: 'Insights is for anomaly detection.' },
      { id: 'b', text: 'Enable them in the Application section under workspace.', isCorrect: true, explanation: 'Workspace-level application defaults ensure logging and monitoring charts deploy automatically to all member clusters.' },
      { id: 'c', text: 'Enable them in the Projects section.', isCorrect: false, explanation: 'Projects scope permissions.' },
      { id: 'd', text: 'Enable them in the Clusters section.', isCorrect: false, explanation: 'Configured at workspace application templates.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Workspace application templates automatically propagate monitoring and logging stacks to newly attached clusters.',
    deepExplanation: 'Configuring platform applications at the workspace level ensures consistent observability tooling across all workload clusters.'
  },
  {
    id: 'q29',
    badge: 'Bastion & Air-Gapped',
    title: 'First Step in Configuring Air-Gapped Bastion Host',
    scenario: 'A Platform Engineer is setting up an NKP cluster in an air-gapped environment using a bastion host running Rocky Linux.',
    prompt: 'Which first step should the engineer take to configure the bastion host?',
    options: [
      { id: 'a', text: 'Install prerequisites: yum-utils, bzip2, and wget.', isCorrect: true, explanation: 'Preparing the OS package manager and core utilities is the mandatory first step before unpacking bundles.' },
      { id: 'b', text: 'Create a bootstrap cluster.', isCorrect: false, explanation: 'Prerequisites must be installed first.' },
      { id: 'c', text: 'Configure public IP.', isCorrect: false, explanation: 'Air-gapped bastion hosts remain isolated.' },
      { id: 'd', text: 'Deploy Harbor.', isCorrect: false, explanation: 'Harbor deployment follows package setup.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'Installing core system utilities is the prerequisite first step when preparing a bastion host.',
    deepExplanation: 'Rocky Linux bastion hosts require `yum-utils`, `wget`, and archive tools to unpack NKP air-gapped bundles.'
  },
  {
    id: 'q30',
    badge: 'Monitoring & Prometheus',
    title: 'Default Monitoring Stack in NKP',
    scenario: 'A newly-created NKP cluster needs metric collection, alerting, and visualization working from the start.',
    prompt: 'Which stack fills that role?',
    options: [
      { id: 'a', text: 'Kubernetes Dashboard', isCorrect: false, explanation: 'Dashboard is UI management.' },
      { id: 'b', text: 'Grafana Loki stack', isCorrect: false, explanation: 'Loki is for logs.' },
      { id: 'c', text: 'Thanos deployment', isCorrect: false, explanation: 'Thanos is for global metrics.' },
      { id: 'd', text: 'Prometheus stack', isCorrect: true, explanation: 'The Prometheus stack (Prometheus Operator, Alertmanager, Grafana) provides metric collection, alerting, and visualization.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'The Prometheus stack provides core metrics collection, alerting, and visualization out-of-the-box in NKP.',
    deepExplanation: 'Every NKP cluster deploys the kube-prometheus-stack by default to monitor cluster health.'
  },
  {
    id: 'q31',
    badge: 'Registries & Harbor',
    title: 'Finding Harbor GUI Credentials in Management Cluster',
    scenario: 'An administrator successfully deployed Harbor in the NKP Management cluster but is unaware of the password.',
    prompt: 'Which namespace contains the Harbor secret?',
    options: [
      { id: 'a', text: 'kube-system', isCorrect: false, explanation: 'kube-system holds core control plane components.' },
      { id: 'b', text: 'harbor', isCorrect: false, explanation: 'Platform apps are deployed in workspace namespaces or designated project namespaces.' },
      { id: 'c', text: 'kommander', isCorrect: false, explanation: 'Kommander platform apps reside in workspace/system namespaces.' },
      { id: 'd', text: 'ncr-system (or kommander-applications)', isCorrect: true, explanation: 'Platform applications like Harbor store administrator credentials in secrets within their assigned application namespace.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Harbor administrator passwords are stored in Kubernetes secrets within the platform application namespace.',
    deepExplanation: 'Operators retrieve initial Harbor admin passwords using `kubectl get secret -n <namespace> harbor-core -o jsonpath="{.data.harbor-admin-password}"`.'
  },
  {
    id: 'q32',
    badge: 'Air-Gapped & Registries',
    title: 'Pushing NKP Bundles to Private Artifactory Registries',
    scenario: 'A company uses an Artifactory private registry for development, and firewall rules reject connections to public registries.',
    prompt: 'What options should be used to push NKP bundle to this private registry?',
    options: [
      { id: 'a', text: '--registry-url, --registry-username and --registry-password', isCorrect: true, explanation: 'The `nkp push bundle` command accepts `--registry-url`, `--registry-username`, and `--registry-password` flags.' },
      { id: 'b', text: '--to-registry', isCorrect: false, explanation: 'Incorrect flag name.' },
      { id: 'c', text: '--mirror-url', isCorrect: false, explanation: 'Incorrect flag name.' },
      { id: 'd', text: '--registry-mirror-url', isCorrect: false, explanation: 'Incorrect flag name.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'Use `--registry-url`, `--registry-username`, and `--registry-password` to push software bundles to private registries.',
    deepExplanation: 'When seeding private registries like JFrog Artifactory, CLI arguments point the push tool to authenticate against custom registry URIs.'
  },
  {
    id: 'q33',
    badge: 'Security & RBAC',
    title: 'Resource Groups for Access Control in NKP UI',
    scenario: 'NKP UI has two conceptual resource groups to manage access control.',
    prompt: 'Which resource group allows for creating cluster roles on the management cluster?',
    options: [
      { id: 'a', text: 'Workspace Role', isCorrect: false, explanation: 'Workspace roles are scoped to workspaces.' },
      { id: 'b', text: 'Global Role', isCorrect: true, explanation: 'Global roles provide cluster-wide permissions across the management cluster and fleet.' },
      { id: 'c', text: 'Cluster Role', isCorrect: false, explanation: 'ClusterRole is a Kubernetes primitive.' },
      { id: 'd', text: 'Kommander Role', isCorrect: false, explanation: 'Not official terminology.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Global roles govern administrative permissions across the NKP management cluster.',
    deepExplanation: 'Kommander distinguishes between workspace-scoped roles and global roles for administrative access control.'
  },
  {
    id: 'q34',
    badge: 'Bootstrap & CLI',
    title: 'Cleaning Up Bootstrap Clusters',
    scenario: 'An NKP administrator creates a new bootstrap cluster for NKP deployment using the default self-managed=false setting.',
    prompt: 'Which command will clean up the bootstrap cluster?',
    options: [
      { id: 'a', text: 'docker rm -a', isCorrect: false, explanation: 'Too broad.' },
      { id: 'b', text: 'docker rm konvoy', isCorrect: false, explanation: 'Incorrect container name.' },
      { id: 'c', text: 'kubectl delete bootstrap', isCorrect: false, explanation: 'Not a kubectl subcommand.' },
      { id: 'd', text: 'nkp delete bootstrap', isCorrect: true, explanation: '`nkp delete bootstrap` safely tears down the temporary local bootstrap cluster.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Use `nkp delete bootstrap` to clean up temporary local bootstrap infrastructure post-deployment.',
    deepExplanation: 'Once the permanent management cluster is up, the temporary Kind/Docker bootstrap cluster is deleted via `nkp delete bootstrap`.'
  },
  {
    id: 'q35',
    badge: 'Cluster Attachment & Networking',
    title: 'Firewall Rules Required for Secure Tunneling on Attached Clusters',
    scenario: 'A Platform Engineer is attaching existing Kubernetes clusters to NKP with network restrictions requiring Secure Tunnels.',
    prompt: 'What must the firewall rules allow on the attached cluster network?',
    options: [
      { id: 'a', text: 'iSCSI (TCP/3260)', isCorrect: false, explanation: 'Storage port.' },
      { id: 'b', text: 'NTP Service (UDP/123)', isCorrect: false, explanation: 'Time sync.' },
      { id: 'c', text: 'HTTPS (TCP/443)', isCorrect: true, explanation: 'Secure tunnel relays and API communication require outbound/inbound HTTPS (TCP/443) connectivity.' },
      { id: 'd', text: 'Secured LDAP (TCP/636)', isCorrect: false, explanation: 'LDAP port.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'Secure tunnels require TCP/443 (HTTPS) network access to establish encrypted relay connections.',
    deepExplanation: 'Attached clusters communicating through secure tunnels establish outbound TLS connections on port 443.'
  },
  {
    id: 'q36',
    badge: 'Security & OIDC',
    title: 'Setting Up User Authentication into NKP Clusters',
    scenario: 'A Platform Engineer is setting up user authentication into an NKP cluster.',
    prompt: 'How should the engineer accomplish this task?',
    options: [
      { id: 'a', text: 'Enable Gatekeeper and create a connector.', isCorrect: false, explanation: 'Gatekeeper is for policy, not authentication.' },
      { id: 'b', text: 'Create a Dex connector to the user base\'s identity provider.', isCorrect: true, explanation: 'Dex acts as the OIDC identity broker in NKP, connecting to LDAP, Active Directory, SAML, or OIDC providers.' },
      { id: 'c', text: 'Disable native authentication and enable Traefik.', isCorrect: false, explanation: 'Traefik is ingress.' },
      { id: 'd', text: 'Create a MetalLB connector.', isCorrect: false, explanation: 'MetalLB is load balancer IP allocation.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'NKP configures Dex connectors to integrate enterprise identity providers for user authentication.',
    deepExplanation: 'Dex provides authentication services in Konvoy and Kommander, bridging Kubernetes to corporate IDPs.'
  },
  {
    id: 'q37',
    badge: 'Workspaces & RBAC',
    title: 'Assigning Tenant Administrators for Multiple Workspaces',
    scenario: 'An IT team provides Kubernetes clusters for Fin Group (Fin VD, Fin Insurance, Fin Travel) with separate Active Directory / IDP implementations. The engineer needs to assign Tenant Administrators for each workspace.',
    prompt: 'How will the engineer complete this task?',
    options: [
      { id: 'a', text: 'Configure global Active Directory and assign a workspace admin user to each group.', isCorrect: false, explanation: 'Each group uses separate IDPs.' },
      { id: 'b', text: 'Create roles and role bindings mapped to each workspace\'s respective IDP group.', isCorrect: true, explanation: 'Workspace role bindings tie specific workspace permissions to respective IDP groups or users.' },
      { id: 'c', text: 'Create a single global role binding.', isCorrect: false, explanation: 'Would violate isolation.' },
      { id: 'd', text: 'Configure a dedicated identity provider for each group and bind workspace roles accordingly.', isCorrect: true, explanation: 'Multi-tenant workspaces support mapping distinct identity groups to workspace administrator roles.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Workspaces support isolated IDP group mappings to enforce tenant administration boundaries.',
    deepExplanation: 'Platform administrators configure workspace role bindings referencing external IDP claims for each business unit.'
  },
  {
    id: 'q38',
    badge: 'Security & RBAC',
    title: 'Correct Syntax for Workspace Role Bindings for IDP Groups',
    scenario: 'A workspace group has been configured for a specific workspace. An administrator would like to configure Workspace Role Bindings for Identity Provider Groups.',
    prompt: 'What is the correct syntax used to add them to the workspace?',
    options: [
      { id: 'a', text: 'oidc:<workspace_name>:<IdP_user_group>', isCorrect: true, explanation: 'Kommander workspace role bindings prefix OIDC groups with `oidc:<workspace>:<group>`.' },
      { id: 'b', text: '<workspace_ID>:<user_email>', isCorrect: false, explanation: 'Incorrect binding format.' },
      { id: 'c', text: '<user_email>', isCorrect: false, explanation: 'Email alone is insufficient.' },
      { id: 'd', text: 'oidc:<IdP_user_group>', isCorrect: false, explanation: 'Missing workspace scope.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'Workspace role bindings for OIDC groups follow the `oidc:<workspace_name>:<group>` naming convention.',
    deepExplanation: 'Properly formatting identity provider group bindings ensures correct authorization scopes within Kommander workspaces.'
  },
  {
    id: 'q39',
    badge: 'Certificates & Air-Gapped',
    title: 'Updating Custom CA Trust Variables in Cluster Topologies',
    scenario: 'During an upgrade, an administrator cannot connect to a registry because of untrusted custom CA certificates following a certificate rotation.',
    prompt: 'Which parameter of the spec.topology.variables spec does the administrator need to update in order for the custom CA to be trusted?',
    options: [
      { id: 'a', text: 'value.imageRegistries (or CA bundle variables)', isCorrect: true, explanation: 'Cluster topology variables expose image registry and trusted CA certificate bundle configurations.' },
      { id: 'b', text: 'value.machineDeployments', isCorrect: false, explanation: 'Machine deployments control worker scale.' },
      { id: 'c', text: 'value.class', isCorrect: false, explanation: 'Class defines cluster templates.' },
      { id: 'd', text: 'value.clusterConfig', isCorrect: false, explanation: 'General configuration.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'Custom CA certificates for private registries are injected via cluster topology variables in NKP cluster manifests.',
    deepExplanation: 'When enterprise registries rotate CAs, administrators update the trusted CA bundle variable in the cluster topology spec before upgrading.'
  },
  {
    id: 'q40',
    badge: 'Installation & CLI',
    title: 'Minimizing Resource Usage during Kommander Installation in AWS',
    scenario: 'A Cloud Engineer is deploying an NKP Cluster in AWS for testing purposes, requesting a minimal set of system resources.',
    prompt: 'Which two parameters should be specified when initializing a Kommander installation using `nkp install kommander`? (Choose two)',
    options: [
      { id: 'a', text: '--wait-timeout', isCorrect: false, explanation: 'Timeout controls wait duration.' },
      { id: 'b', text: '--init', isCorrect: true, explanation: '`--init` initializes core minimal platform components.' },
      { id: 'c', text: '--request-timeout', isCorrect: false, explanation: 'Request timeout flag.' },
      { id: 'd', text: 'Custom resource tuning flags or minimal addon selections', isCorrect: true, explanation: 'Minimal resource profiles can be selected during installation init.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Using initialization flags (`--init`) during Kommander installation bootstraps minimal core control plane services.',
    deepExplanation: 'Optimizing resource footprints for test environments involves selecting minimal installation profiles.'
  }
];
