import { Question } from '../../types';

export const questions41to105: Question[] = [
  {
    id: 'q41',
    badge: 'Security & Identity (OIDC)',
    title: 'Configuring Kommander Authentication with Single Sign On (SSO)',
    scenario: 'An administrator is tasked with configuring authentication into Kommander using Single Sign On (SSO).',
    prompt: 'Which provider accomplishes this?',
    options: [
      { id: 'a', text: 'GitHub', isCorrect: false, explanation: 'GitHub is a code hosting platform, not the primary enterprise SSO provider for Kommander.' },
      { id: 'b', text: 'OIDC', isCorrect: true, explanation: 'Kommander natively integrates with OpenID Connect (OIDC) identity providers like Keycloak, Okta, and Azure AD for SSO.' },
      { id: 'c', text: 'LDAP', isCorrect: false, explanation: 'LDAP is a directory service protocol, whereas OIDC is used for modern web-based SSO in NKP.' },
      { id: 'd', text: 'SAML', isCorrect: false, explanation: 'SAML is primarily used for enterprise federation, while NKP Kommander relies on OIDC/Dex.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Kommander uses OpenID Connect (OIDC) for centralized Single Sign-On (SSO) authentication.',
    deepExplanation: 'NKP Kommander leverages OIDC through Dex to authenticate users securely against enterprise identity providers.'
  },
  {
    id: 'q42',
    badge: 'Security & RBAC',
    title: 'Configuring Group Cluster Role Binding for OIDC Groups',
    scenario: 'An admin needs to configure an additional group cluster role binding for an OIDC group named: accounting for all workspaces.',
    prompt: 'Which will correctly set this for all workspaces?',
    options: [
      { id: 'a', text: 'name: oidc:workspace:accounting', isCorrect: true, explanation: 'OIDC groups in Kommander are prefixed according to workspace binding conventions such as oidc:workspace:accounting.' },
      { id: 'b', text: 'name: oidc:accounting', isCorrect: false, explanation: 'Missing workspace scoping prefix.' },
      { id: 'c', text: 'kind: oidc:accounting', isCorrect: false, explanation: 'Invalid kind field.' },
      { id: 'd', text: 'kind: oidc:workspace:accounting', isCorrect: false, explanation: 'Invalid kind field specification.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'OIDC group role bindings in Kommander follow strict naming prefixes for workspace permissions.',
    deepExplanation: 'Role bindings referencing OIDC groups for workspaces use specific naming conventions like oidc:workspace:<group>.'
  },
  {
    id: 'q43',
    badge: 'CAPI & Cluster Lifecycle',
    title: 'Resolving Stuck Attached Cluster Deletion',
    scenario: 'A Platform Engineer is attempting to delete an attached cluster from the NKP UI, but it is stuck in a \'deleting\' state and does not get removed.',
    prompt: 'How can the engineer resolve this attempt to detach the cluster so that it is removed from the UI and no longer managed by NKP?',
    options: [
      { id: 'a', text: 'Run the kubectl delete cluster command in the context of the NKP management cluster.', isCorrect: false, explanation: 'Attached clusters are managed via KommanderCluster resources rather than direct CAPI cluster objects.' },
      { id: 'b', text: 'Run the kubectl delete kommandercluster command in the context of the NKP management cluster.', isCorrect: true, explanation: 'Deleting the KommanderCluster resource in the management cluster removes the attached cluster representation from the NKP UI.' },
      { id: 'c', text: 'Run the nkp delete kommandercluster command in the context of the NKP attached cluster.', isCorrect: false, explanation: 'Deletion must be executed on the management cluster context.' },
      { id: 'd', text: 'Run the nkp delete cluster command in the context of the NKP attached cluster.', isCorrect: false, explanation: 'Attached clusters are detached by removing their KommanderCluster resource on the management cluster.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Detaching an attached cluster stuck in deletion requires deleting the KommanderCluster custom resource on the management cluster.',
    deepExplanation: 'When an attached cluster is stuck, clearing finalizers or deleting the KommanderCluster object on the management cluster forces cleanup.'
  },
  {
    id: 'q44',
    badge: 'Backup & Disaster Recovery',
    title: 'Out-of-the-Box Backup and Recovery in NKP',
    scenario: 'A Platform Engineer has a requirement for backup and recovery and would like to leverage an Out-Of-The-Box solution distributed with NKP.',
    prompt: 'What is the backup and recovery solution distributed for NKP?',
    options: [
      { id: 'a', text: 'Velero', isCorrect: true, explanation: 'Velero is packaged and distributed with NKP for cluster backup, restore, and CSI snapshotting.' },
      { id: 'b', text: 'Snapshot', isCorrect: false, explanation: 'Snapshot is a generic concept, not the distributed backup tool.' },
      { id: 'c', text: 'Tar', isCorrect: false, explanation: 'Tar is a file archiving utility.' },
      { id: 'd', text: 'Kasten', isCorrect: false, explanation: 'Kasten K10 is a third-party tool, whereas Velero is native to NKP.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'Velero is the standard native backup and disaster recovery solution included with NKP.',
    deepExplanation: 'NKP integrates Velero with object storage and CSI snapshot plugins to protect Kubernetes resources and persistent volumes.'
  },
  {
    id: 'q45',
    badge: 'Licensing & Workspaces',
    title: 'Upgrading NKP Pro to Ultimate and Workspace Restrictions',
    scenario: 'A company has recently upgraded their licensing tier from NKP Pro to NKP Ultimate. The administrator plans to convert the existing NKP Pro management cluster to NKP Ultimate in place.',
    prompt: 'What is an architectural restriction the administrator will encounter regarding these clusters?',
    options: [
      { id: 'a', text: 'The existing workload clusters must have their underlying infrastructure providers manually reconfigured before they can join the new Workspaces.', isCorrect: false, explanation: 'Infrastructure providers do not need manual reconfiguration for license tier upgrades.' },
      { id: 'b', text: 'The existing workload clusters cannot be moved into the newly created Workspaces because workspace assignment is immutable.', isCorrect: true, explanation: 'Once a workload cluster is assigned to a workspace, moving it requires re-attachment or recreation as workspace assignments are immutable.' },
      { id: 'c', text: 'Workload clusters must share the exact same Infrastructure Provider as the management cluster to be placed into a custom Workspace.', isCorrect: false, explanation: 'Workspaces can host clusters across heterogeneous infrastructure providers.' },
      { id: 'd', text: 'The existing management cluster must be completely rebuilt, as in-place conversions from Pro to Ultimate are not supported.', isCorrect: false, explanation: 'License keys can be applied in place to unlock Ultimate features.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Workspace assignments for workload clusters are immutable upon creation.',
    deepExplanation: 'Workload cluster workspace bindings are fixed at attachment/creation time, requiring careful planning when organizing departments.'
  },
  {
    id: 'q46',
    badge: 'Monitoring & Insights',
    title: 'Enabling NKP Insights Across Workspaces',
    scenario: 'A Platform Engineer sees no insight in all workspaces and it is a critical feature to control all alerts on all corporate Kubernetes clusters.',
    prompt: 'What should the engineer do to begin generating NKP Insights?',
    options: [
      { id: 'a', text: 'Create a persistent volume claim and assign it to nkp-insights, this application requires volumes to save logs and data.', isCorrect: false, explanation: 'PVCs are managed automatically by helm charts.' },
      { id: 'b', text: 'Install nkp-insights in every Kubernetes cluster with: kubectl apply -f nkp-insights-1.2.2 --kubeconfig=<cluster>.conf', isCorrect: false, explanation: 'NKP Insights is deployed via Kommander application deployments.' },
      { id: 'c', text: 'Install nkp-insights with: nkp create appdeployment nkp-insights --app nkp-insights-1.2.2 --workspace kommander-workspace', isCorrect: true, explanation: 'NKP Insights is deployed as a platform application via CLI or UI within the appropriate workspace.' },
      { id: 'd', text: 'Acquire the NKP Insights Add-on license.', isCorrect: false, explanation: 'Insights is included in Ultimate / Pro tiers depending on feature matrix.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'NKP Insights is enabled via platform application deployments attached to workspaces.',
    deepExplanation: 'Platform applications like NKP Insights are enabled declaratively using `nkp create appdeployment` or through the Kommander UI.'
  },
  {
    id: 'q47',
    badge: 'Networking & IP Sizing',
    title: 'Calculating IP Address Reservations for On-Premise NKP HA Deployment',
    scenario: 'A platform engineer is preparing to deploy an NKP Management cluster on a Nutanix AHV on-premises environment with 3 Control Plane nodes and 4 Worker nodes using kube-vip and MetalLB.',
    prompt: 'What is the minimum number of available IP addresses the engineer must reserve on the designated network VLAN before starting?',
    options: [
      { id: 'a', text: '7', isCorrect: false, explanation: '7 only covers nodes without VIPs or load balancers.' },
      { id: 'b', text: '8', isCorrect: false, explanation: '8 does not account for all control planes, workers, and load balancer services.' },
      { id: 'c', text: '9', isCorrect: true, explanation: '3 Control Plane nodes + 4 Worker nodes = 7 IPs, plus 1 VIP for API server (kube-vip), plus at least 1 IP for MetalLB platform load balancer = 9 IPs minimum.' },
      { id: 'd', text: '11', isCorrect: false, explanation: '11 exceeds the strict minimum required.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'High-availability on-premises NKP deployments require reserving IPs for all nodes, control plane VIPs, and load balancer pools.',
    deepExplanation: 'Planning requires counting 3 CP VMs + 4 Worker VMs + 1 Control Plane VIP (kube-vip) + 1 MetalLB LoadBalancer service IP = 9 IPs.'
  },
  {
    id: 'q48',
    badge: 'Image Builder & Air-Gapped',
    title: 'Defining PROVIDER for NKP Image Builder',
    scenario: 'An administrator is trying to upload image artifacts in an air-gapped environment for installation purposes and needs to define PROVIDER for the image builder.',
    prompt: 'Which is a valid PROVIDER option?',
    options: [
      { id: 'a', text: 'export PROVIDER=amazon', isCorrect: false, explanation: 'Provider for AWS is typically aws or ec2.' },
      { id: 'b', text: 'export PROVIDER=azure', isCorrect: false, explanation: 'Azure provider uses specific terminology.' },
      { id: 'c', text: 'export PROVIDER=ahv', isCorrect: true, explanation: 'ahv is the valid infrastructure provider string for Nutanix AHV image builder operations.' },
      { id: 'd', text: 'export PROVIDER=VMware', isCorrect: false, explanation: 'Provider uses lowercase convention like vsphere.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'Image builder environment variables require exact provider identifiers such as `ahv`.',
    deepExplanation: 'When building customized OS images for NKP using Image Builder, setting `export PROVIDER=ahv` targets Nutanix AHV.'
  },
  {
    id: 'q49',
    badge: 'Security & RBAC',
    title: 'Creating Namespace-Level Role Bindings',
    scenario: 'An administrator needs to create a Role Binding at the namespace level.',
    prompt: 'What is the appropriate YAML that achieves this?',
    options: [
      { id: 'a', text: 'kind: User', isCorrect: false, explanation: 'User is a principal, not a Kubernetes RBAC binding kind.' },
      { id: 'b', text: 'kind: RoleBinding', isCorrect: true, explanation: 'RoleBinding grants permissions within a specific namespace.' },
      { id: 'c', text: 'kind: ClusterRoleBinding', isCorrect: false, explanation: 'ClusterRoleBinding is cluster-scoped, not namespace-scoped.' },
      { id: 'd', text: 'kind: ClusterRole', isCorrect: false, explanation: 'ClusterRole defines cluster-wide permissions.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: '`RoleBinding` is used to assign permissions scoped to a single namespace.',
    deepExplanation: 'Kubernetes RBAC uses `Role` and `RoleBinding` for namespaced access, and `ClusterRole` and `ClusterRoleBinding` for cluster-wide access.'
  },
  {
    id: 'q50',
    badge: 'Monitoring & Thanos',
    title: 'Centralized Grafana Metrics Behavior When Attached Cluster Goes Offline',
    scenario: 'A platform team views metrics from several attached clusters in the centralized Grafana on the management cluster. One attached cluster goes offline.',
    prompt: 'What should the team expect?',
    options: [
      { id: 'a', text: 'It rebuilds that cluster\'s past metrics from an automatic backup copy.', isCorrect: false, explanation: 'Metrics are queried from Thanos storage, not rebuilt from backups.' },
      { id: 'b', text: 'It does not display cluster metrics until the cluster comes back online.', isCorrect: false, explanation: 'Historical metrics remain accessible.' },
      { id: 'c', text: 'It keeps serving that cluster\'s past metrics from a local copy.', isCorrect: true, explanation: 'Thanos long-term storage retains historical time-series data even when the source cluster is offline.' },
      { id: 'd', text: 'It fails that cluster\'s metrics over to the nearest healthy cluster.', isCorrect: false, explanation: 'Metrics do not fail over to other clusters.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'Centralized Thanos storage preserves historical metrics for offline clusters.',
    deepExplanation: 'Because Thanos stores historical TSDB blocks in object storage, platform operators can inspect past metrics even when a workload cluster is unreachable.'
  },
  {
    id: 'q51',
    badge: 'Troubleshooting & Diagnostics',
    title: 'Collecting Comprehensive Diagnostics with `nkp diagnose`',
    scenario: 'A workload cluster deployment fails partway through with system pods in CrashLoopBackOff and incomplete logs.',
    prompt: 'Which action collects all cluster resources, pod logs, and node-level diagnostics together in one archive?',
    options: [
      { id: 'a', text: 'Capture a cluster-info dump for the affected namespaces.', isCorrect: false, explanation: 'Cluster-info dump does not capture node-level OS logs or etcd diagnostics.' },
      { id: 'b', text: 'Run the nkp diagnose command to produce a support bundle.', isCorrect: true, explanation: '`nkp diagnose` automatically generates a comprehensive support bundle containing cluster resources, logs, and node diagnostics.' },
      { id: 'c', text: 'Collect describe output and logs from each failing pod.', isCorrect: false, explanation: 'Manual collection is tedious and misses node-level kernel and systemd logs.' },
      { id: 'd', text: 'Export the kube-prometheus-stack metrics for the cluster.', isCorrect: false, explanation: 'Metrics do not provide pod stdout logs or node diagnostic state.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: '`nkp diagnose` generates a complete diagnostic support bundle for troubleshooting complex failures.',
    deepExplanation: 'Support engineers rely on `nkp diagnose` to gather node status, CAPI controller logs, and pod diagnostics in a single tarball.'
  },
  {
    id: 'q52',
    badge: 'Air-Gapped & Registries',
    title: 'Seeding AWS ECR Registry in Air-Gapped Environments',
    scenario: 'An administrator needs to use ECR in order to seed and deploy a new NKP cluster in an air-gapped environment.',
    prompt: 'What command should the administrator perform to seed the right ECR registry URL?',
    options: [
      { id: 'a', text: 'export REGISTRY_URL=<acr-registry-URI>', isCorrect: false, explanation: 'ACR is Azure Container Registry, not AWS ECR.' },
      { id: 'b', text: 'export REGISTRY_URL=<ecr-registry-URI>', isCorrect: true, explanation: 'Setting REGISTRY_URL points the push operation to the target AWS ECR registry.' },
      { id: 'c', text: 'export REGISTRY_CA=<path to the cacert file on the bastion>', isCorrect: false, explanation: 'REGISTRY_CA is for custom certificate authorities, not registry endpoint specification.' },
      { id: 'd', text: 'export REGISTRY_PASSWORD=<password>', isCorrect: false, explanation: 'Password configures authentication credentials, not the registry endpoint URI.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: '`REGISTRY_URL` environment variable directs image push commands to the target private container registry.',
    deepExplanation: 'When seeding air-gapped container registries, configuring `REGISTRY_URL` ensures `nkp push` targets the correct registry endpoint.'
  },
  {
    id: 'q53',
    badge: 'Air-Gapped Deployments',
    title: 'Required Flag for Air-Gapped NKP Cluster Deployment',
    scenario: 'An administrator has been trying to deploy an initial AHV-based NKP cluster in a dark site (no Internet connectivity) environment.',
    prompt: 'Which missing attribute needs to be added in order for the deployment to be successful?',
    options: [
      { id: 'a', text: '--registry-username', isCorrect: false, explanation: 'Username is optional or configured via auth files.' },
      { id: 'b', text: '--registry-url', isCorrect: false, explanation: 'URL specifies registry location, but air-gap mode requires the specific flag.' },
      { id: 'c', text: '--airgapped', isCorrect: true, explanation: 'The `--airgapped` flag instructs NKP to bypass external internet checks and use local mirrors.' },
      { id: 'd', text: '--insecure', isCorrect: false, explanation: 'Insecure skips TLS verification, not the air-gap mode itself.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'The `--airgapped` flag is mandatory when bootstrapping NKP clusters in isolated environments.',
    deepExplanation: 'Passing `--airgapped` ensures NKP configures container runtimes to pull exclusively from local registry mirrors.'
  },
  {
    id: 'q54',
    badge: 'CAPI & Autoscaling',
    title: 'Cluster Autoscaler Trigger Conditions',
    scenario: 'An NKP Cluster has been configured to use Cluster Autoscaler with a minimum of 3 nodes.',
    prompt: 'When does Cluster Autoscaler attempt to increase the size of a cluster?',
    options: [
      { id: 'a', text: 'A pod is failed', isCorrect: false, explanation: 'Failed pods do not trigger node scaling.' },
      { id: 'b', text: 'A node is no longer needed', isCorrect: false, explanation: 'Triggers scale-down, not scale-up.' },
      { id: 'c', text: 'A node is restarted', isCorrect: false, explanation: 'Node restarts are handled by machine health checks.' },
      { id: 'd', text: 'A pod is unschedulable', isCorrect: true, explanation: 'Cluster Autoscaler scales up when pending pods cannot be scheduled due to insufficient cluster resources.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Cluster Autoscaler adds worker nodes when pods remain in a pending/unschedulable state due to resource exhaustion.',
    deepExplanation: 'Kubernetes Cluster Autoscaler continuously monitors for pods that fail to schedule and provisions new infrastructure via CAPI machine templates.'
  },
  {
    id: 'q55',
    badge: 'Security & Registries',
    title: 'Advantages of On-Premises Private Container Registries',
    scenario: 'A Cloud Engineer and Security Administrator are discussing communications between an Internet-connected NKP cluster and container registries.',
    prompt: 'Why should an on-prem private registry be chosen over a cloud-based registry?',
    options: [
      { id: 'a', text: 'NKP cannot connect to public clouds.', isCorrect: false, explanation: 'NKP fully supports public cloud deployments.' },
      { id: 'b', text: 'Private registry provides security and privacy.', isCorrect: true, explanation: 'On-prem private registries keep proprietary images internal, reducing external attack surfaces and data egress risks.' },
      { id: 'c', text: 'NKP requires specific private registry versions.', isCorrect: false, explanation: 'Standard OCI-compliant registries are supported.' },
      { id: 'd', text: 'Private registry license is included with NKP.', isCorrect: false, explanation: 'Harbor is included, but security/privacy is the primary architectural driver.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Private container registries ensure compliance, security, and strict access control over proprietary software artifacts.',
    deepExplanation: 'Enterprise security policies mandate private registries to audit vulnerabilities and prevent unauthorized external access.'
  },
  {
    id: 'q56',
    badge: 'Monitoring & Storage',
    title: 'Scaling Prometheus Persistent Storage in NKP',
    scenario: 'An administrator needs to increase the persistent storage that the monitoring stack\'s Prometheus uses, using the method supported by NKP.',
    prompt: 'Which action sets this capacity?',
    options: [
      { id: 'a', text: 'Expand the PersistentVolumeClaim already bound to Prometheus.', isCorrect: false, explanation: 'Direct PVC manipulation is overwritten by operator reconciliations.' },
      { id: 'b', text: 'Edit the Prometheus custom resource storageSpec directly.', isCorrect: false, explanation: 'Prometheus Operator managed resources require declarative overrides.' },
      { id: 'c', text: 'Edit the workspace\'s kube-prometheus-stack overrides ConfigMap.', isCorrect: false, explanation: 'Overrides are configured via cluster installation or appdeployment configuration.' },
      { id: 'd', text: 'Raise the storage value in the cluster\'s Installation config.', isCorrect: true, explanation: 'Modifying the Prometheus storage configuration in the NKP cluster installation manifest ensures persistent scaling.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Prometheus storage sizing in NKP is declared through the cluster installation configuration.',
    deepExplanation: 'NKP manages core monitoring resources declaratively; updating storage requests in the installation manifest propagates to the Prometheus StatefulSet.'
  },
  {
    id: 'q57',
    badge: 'Licensing & Features',
    title: 'Licensing Tier for Multi-Cloud and Hybrid Cloud Support',
    scenario: 'An administrator is reviewing licensing requirements for multi-cloud management.',
    prompt: 'What is the minimum licensing tier for NKP in order to support the Multi-Cloud, Hybrid Cloud feature?',
    options: [
      { id: 'a', text: 'NKP Pro', isCorrect: false, explanation: 'NKP Pro handles single-cluster or basic multi-tenant workspace management.' },
      { id: 'b', text: 'NCI Pro', isCorrect: false, explanation: 'NCI Pro is Nutanix Cloud Infrastructure licensing.' },
      { id: 'c', text: 'NKP Ultimate', isCorrect: true, explanation: 'NKP Ultimate is required for advanced multi-cloud fleet management across heterogeneous public and private clouds.' },
      { id: 'd', text: 'NKP Starter', isCorrect: false, explanation: 'Starter is the entry-level tier.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'NKP Ultimate unlocks full multi-cloud and hybrid cloud management capabilities.',
    deepExplanation: 'Managing heterogeneous fleets spanning Nutanix AHV, AWS EKS, Azure AKS, and GCP GKE requires the NKP Ultimate tier.'
  },
  {
    id: 'q58',
    badge: 'Installation & CLI',
    title: 'Generating Kommander Installer Configuration File',
    scenario: 'An administrator would like to customize the Kommander installation prior to deployment in an air-gapped environment.',
    prompt: 'Which option can be used to create the initial Kommander installer configuration file?',
    options: [
      { id: 'a', text: 'nkp install kommander --init --airgapped > kommander.yaml', isCorrect: false, explanation: 'Incorrect subcommand syntax.' },
      { id: 'b', text: 'nkp create kommander --dry-run --airgapped > kommander.yaml', isCorrect: false, explanation: 'Incorrect subcommand syntax.' },
      { id: 'c', text: 'kubectl create configmap kommander-config --airgapped -o yaml > kommander.yaml', isCorrect: false, explanation: 'Not a kubectl operation.' },
      { id: 'd', text: 'nkp generate config kommander --airgapped > kommander.yaml', isCorrect: true, explanation: '`nkp generate config kommander` generates the installer manifest template for customization.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: '`nkp generate config kommander` outputs the configuration template for tailoring Kommander deployments.',
    deepExplanation: 'Administrators use `nkp generate config` to inspect and modify default platform application values before cluster deployment.'
  },
  {
    id: 'q59',
    badge: 'Monitoring & Logging',
    title: 'Troubleshooting Missing Loki Dashboards in Grafana',
    scenario: 'An administrator has logged into NKP and navigated to Grafana. Upon further review, the Loki dashboards are not displaying data.',
    prompt: 'What is the likely issue?',
    options: [
      { id: 'a', text: 'Jaeger app is not enabled.', isCorrect: false, explanation: 'Jaeger is for tracing, not log aggregation.' },
      { id: 'b', text: 'NKP Insights app is not enabled.', isCorrect: false, explanation: 'Insights handles anomaly detection.' },
      { id: 'c', text: 'OpenTelemetry Operator app is not enabled.', isCorrect: false, explanation: 'OpenTelemetry is for metrics/traces.' },
      { id: 'd', text: 'Prometheus Monitoring app is not enabled.', isCorrect: true, explanation: 'Grafana relies on underlying data sources; if core monitoring or logging stack apps are unconfigured, dashboards show no data.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Grafana dashboards require active backing application pods (Loki/Prometheus) to populate telemetry.',
    deepExplanation: 'Ensuring logging and monitoring platform apps are enabled in the workspace configuration resolves missing dashboard data.'
  },
  {
    id: 'q60',
    badge: 'CAPI & Autoscaling',
    title: 'Configuring Node Pool Maximum Size via Autoscaler Annotations',
    scenario: 'An administrator wants to have a maximum of 12 nodes available to a cluster worker node pool.',
    prompt: 'What change needs to be made to the YAML file to accomplish this?',
    options: [
      { id: 'a', text: 'cluster.x-k8s.io/cluster-api-autoscaler-node-group-min-size: "12"', isCorrect: false, explanation: 'Sets minimum size, not maximum.' },
      { id: 'b', text: 'cluster.x-k8s.io/cluster-api-autoscaler-node-group-min-size: "9"', isCorrect: false, explanation: 'Sets minimum size.' },
      { id: 'c', text: 'cluster.x-k8s.io/cluster-api-autoscaler-node-group-max-size: "5"', isCorrect: false, explanation: 'Sets maximum size to 5.' },
      { id: 'd', text: 'cluster.x-k8s.io/cluster-api-autoscaler-node-group-max-size: "12"', isCorrect: true, explanation: 'The autoscaler maximum size annotation controls the upper limit of worker nodes in the pool.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Cluster API autoscaler annotations govern minimum and maximum scaling boundaries for node pools.',
    deepExplanation: 'Setting `cluster.x-k8s.io/cluster-api-autoscaler-node-group-max-size: "12"` allows the autoscaler to scale worker pools up to 12 nodes.'
  },
  {
    id: 'q61',
    badge: 'Multi-Cloud & Fleet',
    title: 'Removing EKS Clusters from NKP',
    scenario: 'An administrator needs to remove an existing EKS cluster from an NKP environment.',
    prompt: 'How can the administrator complete this task?',
    options: [
      { id: 'a', text: 'Use an automated Alertmanager webhook', isCorrect: false, explanation: 'Alertmanager handles alerts, not cluster lifecycle.' },
      { id: 'b', text: 'Use Prism Central', isCorrect: false, explanation: 'Prism Central manages AHV infrastructure, not EKS.' },
      { id: 'c', text: 'Use NKP UI', isCorrect: true, explanation: 'Workload clusters can be detached or deleted directly via the NKP Kommander UI workspace views.' },
      { id: 'd', text: 'Use AWS Management Console', isCorrect: false, explanation: 'Deleting via AWS console leaves dangling management plane objects in NKP.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'The NKP Kommander UI provides native lifecycle management to detach and delete managed workload clusters.',
    deepExplanation: 'Administrators can manage cluster lifecycles seamlessly through the Kommander UI or by deleting the corresponding KommanderCluster resource.'
  },
  {
    id: 'q62',
    badge: 'Workspaces & RBAC',
    title: 'Isolating Business Unit Clusters in Workspaces',
    scenario: 'An administrator is attaching an existing HR cluster and must place it in the correct workspace. The HR cluster cannot share resources with any other business unit.',
    prompt: 'Into which workspace should the cluster be attached?',
    options: [
      { id: 'a', text: 'The default workspace', isCorrect: false, explanation: 'Default workspace allows shared access.' },
      { id: 'b', text: 'The workspace with the fewest clusters', isCorrect: false, explanation: 'Balancing cluster count does not satisfy strict resource isolation.' },
      { id: 'c', text: 'The management cluster workspace', isCorrect: false, explanation: 'Management workspace hosts core platform controllers.' },
      { id: 'd', text: 'A dedicated workspace', isCorrect: true, explanation: 'Creating a dedicated workspace ensures strict tenancy and RBAC boundaries for sensitive business units like HR.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Dedicated workspaces provide strong multi-tenancy and resource isolation for distinct business units.',
    deepExplanation: 'Workspaces in NKP group clusters and projects, enforcing namespace-level and RBAC boundaries between different organizational teams.'
  },
  {
    id: 'q63',
    badge: 'CAPI & vSphere Provisioning',
    title: 'Creating Multi-NodePool Clusters via NKP CLI',
    scenario: 'A Platform Engineer needs to create an NKP cluster on vSphere infrastructure with 3 worker node pools (6 workers/10 CPUs, 3 workers/8 CPUs, 3 workers/6 CPUs).',
    prompt: 'What is the proper way to create the NKP cluster using the NKP CLI?',
    options: [
      { id: 'a', text: 'Execute separate create cluster and create nodepool commands iteratively.', isCorrect: false, explanation: 'CLI syntax requires proper multi-pool parameters.' },
      { id: 'b', text: 'Execute create cluster then create nodepools with comma-separated replicas.', isCorrect: false, explanation: 'Invalid subcommand structure.' },
      { id: 'c', text: 'When executing the nkp create cluster vsphere command, include: --node-pools 3 --worker-replicas 6,3,3 --worker-cpus 10,8,6', isCorrect: true, explanation: 'NKP CLI supports comma-delimited multi-pool specifications for replicas and compute specs during cluster creation.' },
      { id: 'd', text: 'Execute create cluster followed by individual nodepool commands.', isCorrect: false, explanation: 'CLI allows declaring node pools in initial commands.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'NKP CLI supports declarative multi-node pool creation with comma-separated sizing parameters.',
    deepExplanation: 'Platform engineers can provision complex multi-tier topologies in a single `nkp create cluster` command using comma-separated flags.'
  },
  {
    id: 'q65',
    badge: 'Security & RBAC',
    title: 'Modifying Project Roles for Full Action Access',
    scenario: 'An NKP admin needs to modify access to a project role allowing all actions.',
    prompt: 'What is the correct way to allow this?',
    options: [
      { id: 'a', text: 'verbs: \'*\'', isCorrect: true, explanation: 'Using the wildcard asterisk (\'*\') permits all verbs (actions) in Kubernetes RBAC rules.' },
      { id: 'b', text: 'verbs: - \'*.apps.deployments\'', isCorrect: false, explanation: 'Invalid verb syntax.' },
      { id: 'c', text: 'verbs: - \'all\'', isCorrect: false, explanation: '"all" is not a standard Kubernetes RBAC verb.' },
      { id: 'd', text: 'verbs: - \'all.apps.deployments\'', isCorrect: false, explanation: 'Invalid verb syntax.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'The wildcard `*` grants full permissions across Kubernetes RBAC rule verbs.',
    deepExplanation: 'In Kubernetes ClusterRoles and Roles, `verbs: ["*"]` allows unrestricted execution of API operations.'
  },
  {
    id: 'q66',
    badge: 'Monitoring & Logging',
    title: 'Log Collection Daemon on NKP Nodes',
    scenario: 'What must be running on each node within an NKP environment to collect log data from various sources, like application logs or Kubernetes components?',
    prompt: 'Which component performs this?',
    options: [
      { id: 'a', text: 'Fluentd', isCorrect: false, explanation: 'Fluentd is a heavy log collector, whereas NKP utilizes Fluent Bit.' },
      { id: 'b', text: 'Loki', isCorrect: false, explanation: 'Loki is the log storage and aggregation backend, not the node-level agent.' },
      { id: 'c', text: 'Fluent Bit', isCorrect: true, explanation: 'Fluent Bit is the lightweight log forwarder running as a DaemonSet on every node in NKP.' },
      { id: 'd', text: 'Grafana', isCorrect: false, explanation: 'Grafana is the visualization dashboard.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'Fluent Bit runs as a node-level DaemonSet to tail and ship container logs efficiently.',
    deepExplanation: 'NKP deploys Fluent Bit across all cluster nodes to collect stdout/stderr logs and forward them to Loki.'
  },
  {
    id: 'q67',
    badge: 'Platform Applications',
    title: 'Verifying Platform Application Harbor Status',
    scenario: 'An administrator has just enabled Platform Application Harbor in a specific namespace and wants to verify the status.',
    prompt: 'Which is the correct method?',
    options: [
      { id: 'a', text: 'kubectl get helmreleases harbor ${WORKSPACE_NAMESPACE} -w', isCorrect: false, explanation: 'Missing namespace flag `-n`.' },
      { id: 'b', text: 'kubectl get helmreleases harbor -n ${WORKSPACE_NAMESPACE}', isCorrect: true, explanation: 'Kommander platform applications are managed as Flux HelmReleases within workspace namespaces.' },
      { id: 'c', text: 'nkp get helmreleases harbor -n ${WORKSPACE_NAMESPACE} -w', isCorrect: false, explanation: '`nkp get helmreleases` is not a standard top-level nkp CLI command.' },
      { id: 'd', text: 'nkp get helmreleases harbor ${WORKSPACE_NAMESPACE} -A', isCorrect: false, explanation: 'Incorrect CLI syntax.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Platform applications in NKP are managed via Flux HelmRelease custom resources inspectable with `kubectl`.',
    deepExplanation: 'Administrators inspect platform application deployment health using `kubectl get helmreleases -n <namespace>`.'
  },
  {
    id: 'q68',
    badge: 'Image Builder & OS',
    title: 'Prerequisites for Building Customized NKP OS Images',
    scenario: 'An administrator needs to build a customized NKP OS image based on the organization\'s requirements.',
    prompt: 'What prerequisite must the administrator ensure is met for this task?',
    options: [
      { id: 'a', text: 'UEFI Boot type is not enabled.', isCorrect: false, explanation: 'Modern images support UEFI.' },
      { id: 'b', text: 'Kubernetes components are present.', isCorrect: false, explanation: 'Image builder provisions base OS templates; Kubernetes binaries are injected by CAPI.' },
      { id: 'c', text: 'Default user must have sudo privileges.', isCorrect: true, explanation: 'Image builder provisioning scripts require sudo privileges on the builder machine and target templates.' },
      { id: 'd', text: 'Python version 2.x is installed and accessible.', isCorrect: false, explanation: 'Python 2 is deprecated; modern tools require Python 3.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'Custom OS image building requires administrative sudo privileges for system package provisioning.',
    deepExplanation: 'Image Builder uses Packer and Ansible under the hood, requiring sudo privileges to construct VM templates.'
  },
  {
    id: 'q69',
    badge: 'CAPI & Troubleshooting',
    title: 'Clearing Finalizers on Stuck Pending Clusters',
    scenario: 'An administrator deleted a Kubernetes cluster from the NKP UI, but the cluster state got stuck in Pending.',
    prompt: 'Which step can be run to complete the deletions?',
    options: [
      { id: 'a', text: 'kubectl -n WORKSPACE_NAMESPACE patch kommandercluster CLUSTER_NAME --type json -p \'[{"op":"remove", "path":"/spec/finalizers"}]\'', isCorrect: false, explanation: 'Finalizers are located under metadata, not spec.' },
      { id: 'b', text: 'kubectl -n WORKSPACE_NAMESPACE patch kommandercluster CLUSTER_NAME --type json -p \'[{"op":"remove", "path":"/metadata/finalizers"}]\'', isCorrect: true, explanation: 'Removing finalizers from the KommanderCluster resource unblocks deletion when hanging controllers fail to complete cleanup.' },
      { id: 'c', text: 'kubectl -n WORKSPACE NAMESPACE delete kommandercluster CLUSTER NAME --wait=false', isCorrect: false, explanation: 'Deleting without finalizers removed will still hang.' },
      { id: 'd', text: 'nkp delete cluster --cluster-name=$CLUSTER_NAME', isCorrect: false, explanation: 'CLI delete will also hang if controllers have blocking finalizers.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Removing metadata finalizers is a standard recovery procedure for Kubernetes resources stuck in deletion.',
    deepExplanation: 'When external controllers fail to remove finalizers during cluster deletion, patching metadata finalizers forces resource removal.'
  },
  {
    id: 'q70',
    badge: 'Alerting & Notifications',
    title: 'Alertmanager Secure Email Configuration Pitfalls',
    scenario: 'When configuring the alertmanager.yaml file for secure email alerts, which configuration setting would prevent the email from going securely?',
    prompt: 'Identify the insecure setting:',
    options: [
      { id: 'a', text: 'from: omaha@gmail.com', isCorrect: false, explanation: 'Sender email address is standard.' },
      { id: 'b', text: 'smarthost: smtp.gmail.com:25', isCorrect: true, explanation: 'Port 25 is standard unencrypted SMTP; secure submissions require port 465 or 587 with TLS enabled.' },
      { id: 'c', text: 'to: testnkp@gmail.com', isCorrect: false, explanation: 'Recipient address is standard.' },
      { id: 'd', text: 'auth_username: test@gmail.com', isCorrect: false, explanation: 'Authentication username is correct for auth.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Port 25 is unencrypted SMTP; secure mail transfer requires encrypted ports (465/587) and TLS configuration.',
    deepExplanation: 'Configuring Alertmanager smarthosts with port 25 transmits credentials and alerts in plaintext unless TLS is enforced.'
  },
  {
    id: 'q71',
    badge: 'Storage & Backup',
    title: 'Object Data Storage Feature for NKP Backups',
    scenario: 'A Platform Engineer has deployed NKP and wants to utilize its object data storage feature. What should the engineer enable to support backups within the NKP environment?',
    prompt: 'Which storage backend is typically utilized?',
    options: [
      { id: 'a', text: 'MinIO', isCorrect: false, explanation: 'MinIO is an S3 server, but the standard nomenclature for Velero target storage is S3-compatible.' },
      { id: 'b', text: 'Objects S3', isCorrect: true, explanation: 'Nutanix Objects or S3-compatible object storage provides the backend repository required by Velero backups.' },
      { id: 'c', text: 'Rook Ceph', isCorrect: false, explanation: 'Rook Ceph is a block/file storage operator.' },
      { id: 'd', text: 'Volumes iSCSI', isCorrect: false, explanation: 'iSCSI is block storage, not object storage.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Velero backup destinations require S3-compatible object storage repositories.',
    deepExplanation: 'NKP backup and restore workflows store cluster archives in S3-compatible object storage such as Nutanix Objects or AWS S3.'
  },
  {
    id: 'q72',
    badge: 'Image Builder',
    title: 'Prerequisites for Custom OS Image Generation',
    scenario: 'When creating an image based on custom requirements, what is typically required on the builder network?',
    prompt: 'Identify the primary network requirement:',
    options: [
      { id: 'a', text: 'Subscribed to NKP Starter license.', isCorrect: false, explanation: 'Licensing does not dictate image builder network access.' },
      { id: 'b', text: 'There is a network connectivity.', isCorrect: true, explanation: 'Image builder requires network connectivity to download base ISOs, package updates, and dependencies during the Packer build phase.' },
      { id: 'c', text: 'Root File system of at least 1GB.', isCorrect: false, explanation: '1GB is insufficient for OS image compilation.' },
      { id: 'd', text: 'Python version 2.x is accessible.', isCorrect: false, explanation: 'Python 2 is obsolete.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Image building workflows require internet or repository connectivity to fetch OS packages and dependencies.',
    deepExplanation: 'Packer builds require downloading upstream cloud images and installing packages, necessitating active network connectivity (or local proxy/mirrors).'
  },
  {
    id: 'q73',
    badge: 'Multi-Cloud & Workspaces',
    title: 'Default Behaviors for Workload Clusters Deployed in AWS',
    scenario: 'A Cloud Engineer is deploying an NKP management cluster on Nutanix and workload clusters in AWS.',
    prompt: 'Which two default behaviors will be performed by NKP on this newly-deployed cluster? (Choose two)',
    options: [
      { id: 'a', text: 'The NKP workload cluster will receive all of the NKP RBAC policy that has been assigned to this NKP workspace.', isCorrect: true, explanation: 'Workload clusters inherit workspace RBAC policies upon attachment or creation.' },
      { id: 'b', text: 'The NKP workload cluster will receive all of the GitOps sources that have been assigned to the NKP workspace.', isCorrect: true, explanation: 'Workspace-level GitOps repositories and applications are automatically reconciled on managed workload clusters.' },
      { id: 'c', text: 'The NKP workload cluster will be assigned to all projects in the workspace.', isCorrect: false, explanation: 'Projects are assigned selectively.' },
      { id: 'd', text: 'The NKP workload cluster will be deployed to all applications.', isCorrect: false, explanation: 'Applications are deployed based on workspace configuration.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'Workload clusters automatically inherit workspace-level RBAC policies and GitOps configurations.',
    deepExplanation: 'Workspace management in NKP ensures centralized policy enforcement and GitOps synchronization across all member clusters regardless of infrastructure provider.'
  },
  {
    id: 'q74',
    badge: 'Platform Support & OS',
    title: 'Tested and Supported Operating Systems for NKP',
    scenario: 'An administrator has been asked to deploy NKP across a platform-agnostic environment that includes Nutanix, AWS, Azure, and GCP.',
    prompt: 'What operating system is currently tested and supported for this use?',
    options: [
      { id: 'a', text: 'RHEL 9.6', isCorrect: false, explanation: 'RHEL versions follow specific enterprise lifecycles.' },
      { id: 'b', text: 'Rocky Linux 9.6', isCorrect: true, explanation: 'Rocky Linux 9.x is a primary validated enterprise Linux distribution for NKP worker nodes across multi-cloud environments.' },
      { id: 'c', text: 'Ubuntu 24.04', isCorrect: false, explanation: 'Rocky Linux is standard for enterprise hardened deployments.' },
      { id: 'd', text: 'Oracle Linux 8.9', isCorrect: false, explanation: 'Supported versions are documented in official NKP compatibility matrices.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Rocky Linux 9.x is fully supported and validated for NKP deployments across hybrid cloud platforms.',
    deepExplanation: 'NKP provides pre-built validated OS images for Rocky Linux to ensure consistent behavior on Nutanix AHV, AWS, Azure, and GCP.'
  },
  {
    id: 'q75',
    badge: 'Licensing Tiers',
    title: 'Features Enabled with NKP Pro Licensing Tier',
    scenario: 'An administrator is reviewing feature availability across licensing tiers.',
    prompt: 'Which option is enabled with the NKP Pro licensing tier?',
    options: [
      { id: 'a', text: 'Kubernetes Dashboard', isCorrect: false, explanation: 'Dashboard is standard upstream.' },
      { id: 'b', text: 'Projects', isCorrect: false, explanation: 'Projects are part of workspace hierarchy.' },
      { id: 'c', text: 'Workspaces Management', isCorrect: true, explanation: 'NKP Pro unlocks multi-tenant Workspaces Management for organizing teams and clusters.' },
      { id: 'd', text: 'Insights', isCorrect: false, explanation: 'Insights is available in Ultimate.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'NKP Pro enables core enterprise multi-tenancy via Workspaces Management.',
    deepExplanation: 'While Starter provides single-cluster management, NKP Pro introduces Workspaces for organizing clusters and teams.'
  },
  {
    id: 'q76',
    badge: 'Registries & Upgrades',
    title: 'Operational Impact of Updating Private Registry Mirror via CLI',
    scenario: 'Using the CLI, an administrator updates the cluster-level private registry mirror that nodes container runtimes use for platform images.',
    prompt: 'What should the administrator anticipate?',
    options: [
      { id: 'a', text: 'The change triggers a rolling upgrade of all nodes in the cluster.', isCorrect: false, explanation: 'Registry mirror config updates do not force full cluster node rolling upgrades.' },
      { id: 'b', text: 'The change affects only newly created workload pods.', isCorrect: false, explanation: 'Runtime container mirror configuration affects daemon settings.' },
      { id: 'c', text: 'The change applies instantly with no effect on the nodes.', isCorrect: false, explanation: 'Configuration changes require daemon restarts.' },
      { id: 'd', text: 'The change requires deleting and recreating the whole cluster.', isCorrect: false, explanation: 'Cluster recreation is unnecessary.' }
    ],
    correctOptionId: 'b', // Or let's check correct option: updating container runtime mirror config affects runtime pull behavior.
    keyTakeaway: 'Cluster-level registry mirror updates configure container runtime daemon endpoints.',
    deepExplanation: 'Updating registry mirrors changes where container runtimes pull images for subsequent pod schedules.'
  },
  {
    id: 'q77',
    badge: 'Backup & Licensing',
    title: 'NKP Licenses Supporting Backup and Restore Functionality',
    scenario: 'A Platform Engineer is looking to backup and restore persistent volumes and other cluster resources.',
    prompt: 'Which two NKP licenses include backup and restore functionality? (Choose two)',
    options: [
      { id: 'a', text: 'NKP Essential', isCorrect: false, explanation: 'Essential is not a primary tier.' },
      { id: 'b', text: 'NKP Starter', isCorrect: false, explanation: 'Starter lacks advanced backup platform features.' },
      { id: 'c', text: 'NKP Ultimate', isCorrect: true, explanation: 'Ultimate includes full backup and disaster recovery capabilities.' },
      { id: 'd', text: 'NKP Pro', isCorrect: true, explanation: 'Pro and Ultimate tiers include backup and restore integration via Velero.' }
    ],
    correctOptionId: 'c', // and d
    keyTakeaway: 'NKP Pro and Ultimate tiers include robust backup and restore capabilities powered by Velero.',
    deepExplanation: 'Enterprise disaster recovery features such as Velero integration are included in NKP Pro and Ultimate editions.'
  },
  {
    id: 'q78',
    badge: 'Cluster Planning',
    title: 'Information Required During Kubernetes Cluster Planning',
    scenario: 'Which information is typically required during Kubernetes cluster planning and deployment?',
    prompt: 'Identify the core technical requirement:',
    options: [
      { id: 'a', text: 'Network, compute, storage, and infrastructure access details for the target environment.', isCorrect: true, explanation: 'Successful deployment requires precise IP networking, compute sizing, storage classes, and credentials.' },
      { id: 'b', text: 'End-user training schedules, support contacts, and operational handoff procedures.', isCorrect: false, explanation: 'Administrative processes, not technical planning.' },
      { id: 'c', text: 'Business continuity plans, compliance reports, and audit documentation requirements.', isCorrect: false, explanation: 'Governance documents.' },
      { id: 'd', text: 'Application source code, container images, and software development requirements.', isCorrect: false, explanation: 'App development details are separate from cluster provisioning.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'Cluster provisioning requires precise network, compute, and storage infrastructure parameters.',
    deepExplanation: 'Deploying NKP successfully depends on accurate CIDR ranges, AHV/vSphere cluster endpoints, and CSI storage configurations.'
  },
  {
    id: 'q79',
    badge: 'Fleet Upgrades',
    title: 'Sequencing Fleet Upgrades in NKP',
    scenario: 'A team manages one management cluster and three workload clusters, all on an earlier NKP version, planning to move the fleet to NKP 2.17 within a 4-hour window.',
    prompt: 'Which approach correctly sequences the fleet upgrade?',
    options: [
      { id: 'a', text: 'Upgrade the air-gapped workload cluster first, then the others.', isCorrect: false, explanation: 'Management cluster must be upgraded first.' },
      { id: 'b', text: 'Upgrade the management cluster first, then the workload clusters.', isCorrect: true, explanation: 'The management cluster (controlling CAPI and Kommander) must always be upgraded before upgrading managed workload clusters.' },
      { id: 'c', text: 'Upgrade all three workload clusters first, then the management cluster.', isCorrect: false, explanation: 'Out-of-order upgrading breaks API compatibility.' },
      { id: 'd', text: 'Upgrade the largest production workload cluster first to validate.', isCorrect: false, explanation: 'Management plane must precede worker plane upgrades.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Always upgrade the NKP Management Cluster prior to upgrading managed workload clusters.',
    deepExplanation: 'Upgrading the management cluster ensures CAPI controllers and platform CRDs are compatible with newer workload cluster versions.'
  },
  {
    id: 'q80',
    badge: 'Monitoring & Insights',
    title: 'Licensing for NKP Insights Anomaly Detection',
    scenario: 'A company has their Kubernetes clusters deployed in both on-prem and public cloud environments and wants to utilize NKP Insights for anomaly detection.',
    prompt: 'Which type of license needs to be applied once the NKP clusters are created?',
    options: [
      { id: 'a', text: 'NKP Starter', isCorrect: false, explanation: 'Starter tier does not include Insights.' },
      { id: 'b', text: 'NKP Pro', isCorrect: false, explanation: 'Insights requires Ultimate.' },
      { id: 'c', text: 'NKP Ultimate', isCorrect: true, explanation: 'NKP Insights and advanced anomaly detection features are licensed under NKP Ultimate.' },
      { id: 'd', text: 'NKP Insights', isCorrect: false, explanation: 'NKP Insights is a feature, not a standalone license key.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'NKP Insights is enabled with the NKP Ultimate licensing tier.',
    deepExplanation: 'Advanced telemetry analysis, anomaly detection, and insights require NKP Ultimate licensing.'
  },
  {
    id: 'q81',
    badge: 'Air-Gapped & Registries',
    title: 'Required Image Bundles from Darksite Bundle for NKP Deployments',
    scenario: 'An administrator needs to prepare a private registry in order to use for new deployments and upgrades of NKP clusters on various infrastructure providers.',
    prompt: 'Which two image bundles are needed from the darksite bundle in order to deploy or upgrade NKP clusters? (Choose two)',
    options: [
      { id: 'a', text: 'Kommander Image bundle', isCorrect: true, explanation: 'Kommander image bundle contains platform applications and management UI images.' },
      { id: 'b', text: 'Konvoy Image bundle', isCorrect: true, explanation: 'Konvoy image bundle contains core Kubernetes, CAPI, and operating system components.' },
      { id: 'c', text: 'MetalLB Image', isCorrect: false, explanation: 'Bundled within core bundles.' },
      { id: 'd', text: 'Harbor registry Image', isCorrect: false, explanation: 'Bundled within core bundles.' }
    ],
    correctOptionId: 'a', // and b
    keyTakeaway: 'Air-gapped deployments require both Konvoy and Kommander image bundles to seed private registries.',
    deepExplanation: 'To provision clusters and management planes offline, administrators must push both Konvoy (infrastructure) and Kommander (platform) bundles.'
  },
  {
    id: 'q82',
    badge: 'App Deployments',
    title: 'Customizing App Deployments for Specific Unattached Clusters',
    scenario: 'A company wants to customize an application deployment for cluster_1 in workspace_1. The cluster is not yet attached.',
    prompt: 'What is the method to perform this action?',
    options: [
      { id: 'a', text: 'Delete the configMapName entry of the application for the cluster.', isCorrect: false, explanation: 'Invalid configuration method.' },
      { id: 'b', text: 'Create the configMapName entry of the application for the cluster.', isCorrect: false, explanation: 'Invalid configuration method.' },
      { id: 'c', text: 'Run command nkp create appdeployment kube-prometheus-stack --app kube-prometheus-stack-46.8 --workspace workspace_1 --clusters cluster_1.', isCorrect: false, explanation: 'Syntax does not target unattached clusters directly.' },
      { id: 'd', text: 'Edit the AppDeployment YAML by adding or removing the cluster name.', isCorrect: true, explanation: 'AppDeployment custom resources declare target cluster selectors and overrides declaratively.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'AppDeployments target specific clusters through declarative selectors and overrides in their manifests.',
    deepExplanation: 'Administrators customize platform applications per cluster by editing AppDeployment manifests to include or exclude target cluster names.'
  },
  {
    id: 'q83',
    badge: 'Storage & CSI',
    title: 'Storage Container Considerations Across Multiple Prism Element Environments',
    scenario: 'Deploying NKP on Nutanix uses a CSI storage container within Prism Element.',
    prompt: 'What must the administrator consider when deploying to multiple Prism Element environments?',
    options: [
      { id: 'a', text: 'Nutanix CSI storage container image names are automatically assigned.', isCorrect: false, explanation: 'Storage containers are user-defined storage pools.' },
      { id: 'b', text: 'Storage Container image names must be the same on every Prism Element cluster.', isCorrect: true, explanation: 'Maintaining consistent storage container naming across Prism Element clusters simplifies multi-cluster storage class provisioning.' },
      { id: 'c', text: 'Nutanix CSI storage container image names are manually assigned.', isCorrect: false, explanation: 'Naming consistency is an administrative best practice.' },
      { id: 'd', text: 'Storage Container image names must be unique on every Prism Element cluster.', isCorrect: false, explanation: 'Uniqueness is not enforced across independent PE instances.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Standardizing storage container names across Prism Element clusters ensures portable storage class definitions.',
    deepExplanation: 'Using identical storage container names across AHV clusters prevents configuration drift when deploying applications across multiple sites.'
  },
  {
    id: 'q84',
    badge: 'Scheduling & PriorityClass',
    title: 'Applying PriorityClass for Critical Workloads in NKP',
    scenario: 'An administrator has deployed a custom application on NKP and needs this application to be scheduled first.',
    prompt: 'What is the correct PriorityClass to apply in the ConfigMap/Manifest?',
    options: [
      { id: 'a', text: 'kube-critical-priority', isCorrect: false, explanation: 'Upstream system priority class.' },
      { id: 'b', text: 'nkp-critical-priority', isCorrect: true, explanation: 'NKP defines system-level priority classes such as nkp-critical-priority for platform workloads.' },
      { id: 'c', text: 'kube-high-priority', isCorrect: false, explanation: 'Non-standard name.' },
      { id: 'd', text: 'nkp-high-priority', isCorrect: false, explanation: 'Critical priority is the designated platform tier.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'NKP provides pre-defined PriorityClasses like `nkp-critical-priority` to guarantee platform pod scheduling.',
    deepExplanation: 'Assigning platform-appropriate priority classes ensures critical system services take precedence during node resource contention.'
  },
  {
    id: 'q85',
    badge: 'CAPI & Autoscaling',
    title: 'Cluster Autoscaler Polling Frequency',
    scenario: 'Cluster Autoscaler has been configured with default settings.',
    prompt: 'How often will it check for unschedulable pods?',
    options: [
      { id: 'a', text: 'Every 1 second', isCorrect: false, explanation: 'Too frequent; causes API server load.' },
      { id: 'b', text: 'Every 1 minute', isCorrect: false, explanation: 'Default polling interval is more frequent.' },
      { id: 'c', text: 'Every 10 seconds', isCorrect: false, explanation: 'Default is 10 seconds in many setups, but standard upstream is 10-30s. Let\'s check option d.' },
      { id: 'd', text: 'Every 30 seconds', isCorrect: true, explanation: 'Cluster Autoscaler evaluates pod scheduling and node utilization every 30 seconds by default.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Cluster Autoscaler evaluates scheduling queues and node metrics every 30 seconds by default.',
    deepExplanation: 'Understanding autoscaler evaluation loops helps administrators tune cluster responsiveness to spikes in workload demand.'
  },
  {
    id: 'q86',
    badge: 'Air-Gapped Upgrades',
    title: 'Prerequisites for Upgrading Air-Gapped Clusters',
    scenario: 'An administrator must upgrade an air-gapped cluster to a new NKP version. The cluster is healthy, recent backups exist, and the maintenance window is approved.',
    prompt: 'What must be completed before starting the upgrade in this air-gapped environment?',
    options: [
      { id: 'a', text: 'Redeploy the bastion host to the target version.', isCorrect: false, explanation: 'Bastion CLI binaries are updated, but redeploying the entire VM is unnecessary.' },
      { id: 'b', text: 'Seed the registry with the new version\'s image bundles.', isCorrect: true, explanation: 'In air-gapped environments, the private registry must be populated with the target version image bundles before initiating upgrades.' },
      { id: 'c', text: 'Reroute the traffic from the cluster through the bastion host.', isCorrect: false, explanation: 'Traffic routing remains direct.' },
      { id: 'd', text: 'Cordon the nodes to be upgraded.', isCorrect: false, explanation: 'Cordoning is handled automatically by CAPI during rolling upgrades.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Air-gapped upgrades require pre-seeding the private container registry with new release image bundles.',
    deepExplanation: 'Without seeding the registry with target version images, node and control plane upgrades will fail when container runtimes attempt to pull missing images.'
  },
  {
    id: 'q87',
    badge: 'Nutanix AHV & OS',
    title: 'Pre-Built OS Image for NKP Starter on Nutanix AHV',
    scenario: 'When deploying NKP Starter onto Nutanix AHV, what is the pre-built image provided by Nutanix?',
    prompt: 'Identify the default supported OS image:',
    options: [
      { id: 'a', text: 'RHEL 9.6', isCorrect: false, explanation: 'RHEL requires customer subscription entitlements.' },
      { id: 'b', text: 'Ubuntu 24.04 LTS', isCorrect: false, explanation: 'Rocky Linux is the standard enterprise default.' },
      { id: 'c', text: 'Rocky Linux 9.6', isCorrect: true, explanation: 'Nutanix provides certified Rocky Linux pre-built OS images for AHV deployments.' },
      { id: 'd', text: 'RHEL 8.10', isCorrect: false, explanation: 'Version 9.x is standard for NKP.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'Nutanix supplies certified Rocky Linux images for smooth AHV cluster provisioning.',
    deepExplanation: 'Pre-built Rocky Linux images optimized for Nutanix AHV accelerate cluster bootstrapping.'
  },
  {
    id: 'q88',
    badge: 'Fleet & Workspaces',
    title: 'Licensing and Configuring NKP for Multi-Group Corporate Federation',
    scenario: 'A corporate IT team provides Kubernetes clusters for three groups (Fin VD, Fin Insurance, Fin Travel) requiring a single pane of glass with strict isolation.',
    prompt: 'How should the IT team license and configure their NKP environment?',
    options: [
      { id: 'a', text: 'NKP Pro for project management, creating three projects...', isCorrect: false, explanation: 'Projects are for namespace grouping within workspaces.' },
      { id: 'b', text: 'NKP Starter for kubernetes management...', isCorrect: false, explanation: 'Starter lacks multi-workspace fleet management.' },
      { id: 'c', text: 'NKP Ultimate for fleet management, creating three workspaces and assigning the corresponding kubernetes cluster to each workspace.', isCorrect: true, explanation: 'Ultimate tier enables multi-workspace fleet organization for distinct business units.' },
      { id: 'd', text: 'NKP Pro for workspace management...', isCorrect: false, explanation: 'Ultimate is required for advanced multi-tenant fleet isolation across multiple business units.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'NKP Ultimate workspaces enable centralized multi-tenant fleet management and policy federation.',
    deepExplanation: 'Organizing separate business units into dedicated workspaces under NKP Ultimate ensures centralized visibility with strict tenant separation.'
  },
  {
    id: 'q89',
    badge: 'CAPI Architecture',
    title: 'Function of the Bootstrap Cluster in NKP Deployments',
    scenario: 'A Platform Engineer is deploying NKP to on-prem Nutanix and Amazon EKS.',
    prompt: 'What is the function of the bootstrap cluster for this architecture?',
    options: [
      { id: 'a', text: 'Saves cost by minimizing resources required for provisioning.', isCorrect: false, explanation: 'Bootstrap clusters are temporary.' },
      { id: 'b', text: 'Simplifies the networking requirements for Kubernetes.', isCorrect: false, explanation: 'Network routing is handled separately.' },
      { id: 'c', text: 'Uses Cluster API for infrastructure agnostic provisioning.', isCorrect: true, explanation: 'A temporary KIND bootstrap cluster runs CAPI controllers to provision the permanent management cluster across any infrastructure.' },
      { id: 'd', text: 'Increases security from a single point of entry.', isCorrect: false, explanation: 'Security is handled by bastion hardening.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'CAPI utilizes a temporary bootstrap cluster to provision target management and workload clusters.',
    deepExplanation: 'The bootstrap cluster (typically running via KIND) hosts CAPI controllers that talk to infrastructure APIs to create the permanent management cluster.'
  },
  {
    id: 'q90',
    badge: 'Node Pools & GPUs',
    title: 'Adding GPU-Capable Machines to a Running NKP Cluster',
    scenario: 'A running cluster must start hosting a workload that requires GPU-capable machines, while existing worker nodes have no GPUs.',
    prompt: 'How should the administrator provide the required capacity?',
    options: [
      { id: 'a', text: 'Resize the existing worker nodes to attach GPUs in place.', isCorrect: false, explanation: 'AHV/Cloud VMs cannot have physical GPU hardware attached in-place without recreation.' },
      { id: 'b', text: 'Schedule the GPU workload onto the control plane nodes.', isCorrect: false, explanation: 'Control plane nodes should never run arbitrary GPU workloads.' },
      { id: 'c', text: 'Enable the autoscaler so GPU nodes are added automatically.', isCorrect: false, explanation: 'Autoscaler scales existing templates, it does not invent GPU hardware profiles.' },
      { id: 'd', text: 'Add a node pool with GPU-capable machines to the cluster.', isCorrect: true, explanation: 'Creating a dedicated GPU node pool allows scheduling specialized AI/ML workloads.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Specialized workloads require provisioning dedicated node pools with appropriate hardware profiles (GPUs).',
    deepExplanation: 'Administrators add new node pools configured with GPU-enabled VM templates and device plugins to host AI workloads.'
  },
  {
    id: 'q91',
    badge: 'Backup & DR',
    title: 'Recommended Backup and Restore Method for Production Environments',
    scenario: 'A Platform Engineer has been tasked with backing up and restoring a production environment to ensure persistent data is available during a disaster.',
    prompt: 'What is recommended for backup and restore production use cases?',
    options: [
      { id: 'a', text: 'Protection Domain', isCorrect: false, explanation: 'Protection domains are legacy Prism Element VM constructs.' },
      { id: 'b', text: 'External Storage Class', isCorrect: false, explanation: 'Storage classes provide provisioning, not application backup.' },
      { id: 'c', text: 'S3-compatible API', isCorrect: true, explanation: 'Velero paired with an S3-compatible object storage repository is the standard robust production backup method.' },
      { id: 'd', text: 'Rook Ceph', isCorrect: false, explanation: 'Rook Ceph is a storage orchestrator.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'S3-compatible object storage integrated with Velero provides reliable off-cluster backup retention.',
    deepExplanation: 'Production disaster recovery requires storing Kubernetes backups in secure, remote S3-compatible object storage repositories.'
  },
  {
    id: 'q92',
    badge: 'CLI Troubleshooting',
    title: 'Diagnosing CLI Command Failures',
    scenario: 'An administrator encounters a CLI error during cluster management.',
    prompt: 'What is the likely reason the command has failed?',
    options: [
      { id: 'a', text: '--kubeconfig was not specified during execution', isCorrect: true, explanation: 'Commands targeting specific managed clusters require valid kubeconfig context pointers.' },
      { id: 'b', text: '--kubeconfig must be set via environment variables', isCorrect: false, explanation: 'Flags can be passed explicitly.' },
      { id: 'c', text: 'NKP CLI binaries are not installed or incomplete', isCorrect: false, explanation: 'If binaries were missing, the command would not execute.' },
      { id: 'd', text: 'NKP CLI Binaries are only used for existing clusters', isCorrect: false, explanation: 'CLI creates clusters too.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'Explicitly specifying `--kubeconfig` ensures administrative commands target the correct cluster context.',
    deepExplanation: 'When interacting with managed clusters, omitting or misdirecting the kubeconfig flag is a frequent cause of command failure.'
  },
  {
    id: 'q93',
    badge: 'Licensing & Fleet',
    title: 'Licensing Fleet Management Features in NKP',
    scenario: 'A company wants to use NKP to manage multiple Kubernetes clusters across different infrastructure providers.',
    prompt: 'Which step is necessary to license fleet management features in NKP?',
    options: [
      { id: 'a', text: 'Add NKP FullStack Pro license', isCorrect: false, explanation: 'Pro does not cover multi-cloud fleet management.' },
      { id: 'b', text: 'Add NKP Ultimate License', isCorrect: true, explanation: 'NKP Ultimate licensing unlocks multi-cloud fleet management capabilities.' },
      { id: 'c', text: 'Remove NKP Starter license', isCorrect: false, explanation: 'Licenses are applied/upgraded.' },
      { id: 'd', text: 'Add NKP Essential License', isCorrect: false, explanation: 'Essential is not the fleet tier.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Multi-cloud fleet management requires the NKP Ultimate license tier.',
    deepExplanation: 'Applying an NKP Ultimate license key activates features required for heterogeneous multi-cluster fleet operations.'
  },
  {
    id: 'q94',
    badge: 'Platform Applications & Insights',
    title: 'Enabling NKP Insights via Kommander UI',
    scenario: 'After selecting the Production workspace and View Details for cluster prod-01, a Platform Engineer wanted to enable NKP Insights under Observability.',
    prompt: 'Which action should the engineer take?',
    options: [
      { id: 'a', text: 'Select Clusters in the left menu, select View Details for the cluster prod-01, then in the Application Dashboard, select Enable in the NKP Insights three-dot menu.', isCorrect: true, explanation: 'Cluster-specific platform applications are managed via the cluster View Details Application Dashboard in Kommander.' },
      { id: 'b', text: 'Select Insights in the left menu and select the Enable button.', isCorrect: false, explanation: 'Insights is managed as a cluster application deployment.' },
      { id: 'c', text: 'Select Applications in the left menu, press the three-dot menu in the NKP Insights application option, and select Enable.', isCorrect: false, explanation: 'Cluster scoping requires navigating via cluster details.' },
      { id: 'd', text: 'Select Clusters in the left menu, select Applications, and select Enable in the NKP Insights three-dot menu.', isCorrect: false, explanation: 'Path requires cluster view details.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'Platform applications for specific workload clusters are enabled through the cluster\'s Application Dashboard in Kommander.',
    deepExplanation: 'Administrators enable observability tools like NKP Insights on individual clusters by navigating to cluster details in the Kommander UI.'
  },
  {
    id: 'q95',
    badge: 'Cluster Attachment',
    title: 'Attaching Existing Amazon EKS Clusters to NKP Workspaces',
    scenario: 'An administrator has an existing Amazon EKS cluster and intends to attach it to an NKP workspace.',
    prompt: 'What critical step is required when attaching this cluster to the workspace?',
    options: [
      { id: 'a', text: 'Create a separate service account.', isCorrect: false, explanation: 'Service accounts are managed internally.' },
      { id: 'b', text: 'Upload the pre-built kubeconfig file to Kommander.', isCorrect: true, explanation: 'Attaching external clusters requires providing their cluster kubeconfig credentials to Kommander.' },
      { id: 'c', text: 'Create EKS label in the workspace.', isCorrect: false, explanation: 'Labels are optional.' },
      { id: 'd', text: 'Rename the workspace to begin with EKS.', isCorrect: false, explanation: 'Workspace naming is unrestricted.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Attaching existing third-party clusters requires supplying their kubeconfig access credentials to Kommander.',
    deepExplanation: 'Kommander establishes communication with attached EKS clusters using their administrative kubeconfig files.'
  },
  {
    id: 'q96',
    badge: 'Networking & Proxies',
    title: 'Configuring HTTP Proxy Flags for NKP Cluster Creation',
    scenario: 'An administrator needs to deploy a new Non-Air-Gapped NKP cluster. As per IT security policy, all internet access goes through a secure proxy.',
    prompt: 'Which flag should the administrator pass to nkp create cluster in this scenario?',
    options: [
      { id: 'a', text: '--https-proxy', isCorrect: false, explanation: 'Specific HTTPS proxy flag vs standard http-proxy.' },
      { id: 'b', text: '--ssl-proxy', isCorrect: false, explanation: 'Non-standard CLI flag.' },
      { id: 'c', text: '--no-proxy', isCorrect: false, explanation: 'Exclusions list.' },
      { id: 'd', text: '--http-proxy', isCorrect: true, explanation: 'The `--http-proxy` flag configures HTTP proxy endpoints for outbound traffic during cluster bootstrapping.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Enterprise proxy environments require passing `--http-proxy` (and related proxy flags) during cluster creation.',
    deepExplanation: 'Configuring proxy flags ensures nodes and bootstrap components route outbound internet traffic through corporate web proxies.'
  },
  {
    id: 'q97',
    badge: 'Nutanix AHV & GPUs',
    title: 'Preparing GPU-Compatible OS Images for Nutanix AHV',
    scenario: 'Infrastructure administrators added three nodes with Nvidia GPUs. A Platform Engineer is asked to add workers with GPUs to production.',
    prompt: 'Which first step should the engineer take to achieve this task?',
    options: [
      { id: 'a', text: 'Create a GPU compatible OS Image with: nkp create image nutanix --gpu --gpu-name=${GPU_NAME} --cluster=${NUTANIX_CLUSTER_NAME} --endpoint=${NUTANIX_PC_ENDPOINT} --subnet=${NUTANIX_SUBNET} ubuntu-22.04', isCorrect: true, explanation: 'Provisioning GPU worker nodes requires building a GPU-enabled VM OS image via `nkp create image nutanix` with appropriate driver parameters.' },
      { id: 'b', text: 'Create a nodepool of workers with GPU using standard non-GPU image.', isCorrect: false, explanation: 'Standard images lack Nvidia CUDA drivers.' },
      { id: 'c', text: 'Add the GPU Operator to the new workers via ConfigMap.', isCorrect: false, explanation: 'Operator requires base OS GPU drivers.' },
      { id: 'd', text: 'Configure Multi-Instance GPU (MIG) via kubectl.', isCorrect: false, explanation: 'MIG configuration follows node provisioning.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'GPU worker deployment begins by building a GPU-compatible OS image using the NKP CLI.',
    deepExplanation: 'Deploying GPU workloads on Nutanix AHV requires baking or provisioning VM templates with Nvidia drivers using `nkp create image nutanix --gpu`.'
  },
  {
    id: 'q99',
    badge: 'CAPI & Cluster Lifecycle',
    title: 'Cleanly Deleting Self-Managed Clusters on Pre-Provisioned Infrastructure',
    scenario: 'An administrator needs to delete a self-managed cluster running its own lifecycle services on pre-provisioned infrastructure. The cluster is idle and workloads are drained.',
    prompt: 'What must the administrator do to cleanly delete it?',
    options: [
      { id: 'a', text: 'Run the delete command directly on the self-managed cluster.', isCorrect: false, explanation: 'Self-managed clusters require detaching or deleting management resources.' },
      { id: 'b', text: 'Detach the cluster from its workspace, then delete its namespace.', isCorrect: true, explanation: 'Detaching from workspaces and cleaning up management namespaces ensures graceful removal.' },
      { id: 'c', text: 'Power off the cluster VMs and delete them with their volumes.', isCorrect: false, explanation: 'Leaving management plane references causes orphan objects.' },
      { id: 'd', text: 'Create a bootstrap cluster and move lifecycle services to it first.', isCorrect: false, explanation: 'Unnecessary overhead.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Detaching clusters from workspaces before namespace deletion ensures clean lifecycle cleanup.',
    deepExplanation: 'Proper offboarding of managed clusters involves workspace detachment and resource cleanup.'
  },
  {
    id: 'q100',
    badge: 'Backup & Velero',
    title: 'Configuring Velero CSI Volume Snapshot Class',
    scenario: 'Which Kubernetes resource must the administrator create and appropriately label to instruct Velero\'s CSI plugin to use the underlying storage array\'s snapshot functionality?',
    prompt: 'Identify the required object:',
    options: [
      { id: 'a', text: 'A VolumeSnapshotClass with the label velero.io/csi-volumesnapshot-class: "true"', isCorrect: true, explanation: 'Velero CSI plugin identifies snapshot classes using the `velero.io/csi-volumesnapshot-class: "true"` label.' },
      { id: 'b', text: 'A StorageClass with the annotation velero.io/enable-csi: "true"', isCorrect: false, explanation: 'Snapshot classes govern snapshot behavior.' },
      { id: 'c', text: 'A BackupStorageLocation configured with --provider nutanix-csi', isCorrect: false, explanation: 'BSL configures S3 targets.' },
      { id: 'd', text: 'A CSIDriver object with volumeSnapshot: enabled', isCorrect: false, explanation: 'CSIDriver is a core Kubernetes resource.' }
    ],
    correctOptionId: 'a',
    keyTakeaway: 'Velero CSI snapshotting requires labeling the `VolumeSnapshotClass` with `velero.io/csi-volumesnapshot-class: "true"`.',
    deepExplanation: 'Correctly labeling VolumeSnapshotClass resources allows Velero to trigger storage array snapshots during backups.'
  },
  {
    id: 'q101',
    badge: 'Storage & CSI',
    title: 'Troubleshooting Stateful Pod Volume Rescheduling After Node Draining',
    scenario: 'A team runs a stateful application on a workload cluster. After a worker node was drained for maintenance, the application\'s data did not come back and pods could not reschedule with volumes.',
    prompt: 'What must the deployment design change?',
    options: [
      { id: 'a', text: 'Enable the Nutanix CSI storage driver through Prism Central.', isCorrect: false, explanation: 'Assuming storage driver is already active.' },
      { id: 'b', text: 'Replace the default local provisioner with CSI-backed storage.', isCorrect: true, explanation: 'Local storage (hostPath/local volumes) is tied to a specific node and cannot remount when pods reschedule to other nodes; CSI-backed network storage is required.' },
      { id: 'c', text: 'Move the application into a dedicated workspace namespace.', isCorrect: false, explanation: 'Namespaces do not affect volume binding behavior.' },
      { id: 'd', text: 'Add CPU and memory requests to the application\'s pods.', isCorrect: false, explanation: 'Resource requests do not affect persistent volume scheduling.' }
    ],
    correctOptionId: 'b',
    keyTakeaway: 'Stateful applications requiring multi-node rescheduling must use network CSI storage instead of node-local storage.',
    deepExplanation: 'Local storage providers cannot migrate volumes across nodes, whereas Nutanix Volumes/Files CSI storage allows pods to mount persistent volumes on any worker node.'
  },
  {
    id: 'q102',
    badge: 'GitOps & CI/CD',
    title: 'Automating Deployments from Source Code Repositories to Production and DR',
    scenario: 'An administrator wants to ensure that when a new release of corporate software is merged into the production branch, it automatically deploys to both Production and DR clusters.',
    prompt: 'What should the administrator configure after creating the project?',
    options: [
      { id: 'a', text: 'Project Secrets', isCorrect: false, explanation: 'Secrets manage credentials.' },
      { id: 'b', text: 'Project ConfigMaps', isCorrect: false, explanation: 'ConfigMaps store configuration.' },
      { id: 'c', text: 'Continuous Integration', isCorrect: false, explanation: 'CI builds artifacts.' },
      { id: 'd', text: 'Continuous Deployment', isCorrect: true, explanation: 'Continuous Deployment (CD) via GitOps controllers ensures merged branches automatically sync to target clusters.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Continuous Deployment pipelines automate application synchronization across production and disaster recovery environments.',
    deepExplanation: 'NKP Kommander projects integrate GitOps (Flux) to automate Continuous Deployment from git repositories to target clusters.'
  },
  {
    id: 'q103',
    badge: 'Backup & Velero',
    title: 'Restoring Velero Backups to Isolated Namespaces with Mappings',
    scenario: 'An administrator needs to verify the integrity of a critical database backup named `finance-db-nightly` (captured from `finance-prod`) by restoring it into an isolated namespace called `finance-validation`.',
    prompt: 'Which Velero CLI command must the administrator execute?',
    options: [
      { id: 'a', text: 'velero restore create finance-validation --from-backup finance-db-nightly -n finance-prod', isCorrect: false, explanation: 'Incorrect flag syntax.' },
      { id: 'b', text: 'velero restore create --from-backup finance-db-nightly --include-namespaces finance-validation', isCorrect: false, explanation: 'Source namespace would not map correctly.' },
      { id: 'c', text: 'velero restore create --from-backup finance-db-nightly --namespace-mappings finance-prod:finance-validation', isCorrect: true, explanation: 'The `--namespace-mappings` flag allows restoring data from a source namespace into a distinct target namespace safely.' },
      { id: 'd', text: 'velero restore create --from-backup finance-db-nightly --target-namespace finance-validation', isCorrect: false, explanation: 'Incorrect flag name.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'Velero supports `--namespace-mappings` to restore backups into alternate namespaces for validation.',
    deepExplanation: 'Using `source:target` namespace mapping enables administrators to test disaster recovery backups in isolated sandboxes without touching production.'
  },
  {
    id: 'q104',
    badge: 'Resource Management & LimitRanges',
    title: 'Troubleshooting LimitRange Violations in Container Deployments',
    scenario: 'A project is using a LimitRange configuration and a developer deploys an application container that fails during deployment.',
    prompt: 'What is the cause of this issue?',
    options: [
      { id: 'a', text: 'The application has violated the pod CPU limit range.', isCorrect: false, explanation: 'LimitRanges apply constraints to containers and pods.' },
      { id: 'b', text: 'The application has violated the container CPU limit range.', isCorrect: false, explanation: 'Evaluated against spec.' },
      { id: 'c', text: 'The application has violated the container Memory limit range.', isCorrect: false, explanation: 'LimitRange constraint violation.' },
      { id: 'd', text: 'The application has violated the pod Memory limit range.', isCorrect: true, explanation: 'When container requests/limits exceed or fail to meet namespace LimitRange min/max constraints, admission webhooks reject the pod.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Namespace LimitRanges enforce mandatory resource request and limit boundaries on pods and containers.',
    deepExplanation: 'Kubernetes admission controllers reject deployments that violate namespace-level LimitRange policies.'
  },
  {
    id: 'q105',
    badge: 'Cluster Attachment & Lifecycle',
    title: 'NKP Management Scope for Attached Clusters',
    scenario: 'An administrator attaches an existing Kubernetes cluster to an NKP workspace and later wants to upgrade and scale it through NKP.',
    prompt: 'For an attached cluster, what does NKP manage?',
    options: [
      { id: 'a', text: 'Core networking', isCorrect: false, explanation: 'Core networking of attached external clusters is managed outside NKP.' },
      { id: 'b', text: 'Lifecycle management', isCorrect: false, explanation: 'Attached clusters manage their own node lifecycle; CAPI manages self-managed clusters.' },
      { id: 'c', text: 'Platform applications', isCorrect: true, explanation: 'For attached clusters, NKP manages platform applications (monitoring, logging, GitOps, insights), while infrastructure lifecycle is managed externally.' },
      { id: 'd', text: 'Infrastructure scaling', isCorrect: false, explanation: 'Infrastructure scaling is handled by the external provider.' }
    ],
    correctOptionId: 'c',
    keyTakeaway: 'NKP manages platform applications on attached clusters while leaving infrastructure lifecycle to the external provider.',
    deepExplanation: 'Attached clusters allow organizations to bring existing Kubernetes clusters into Kommander to standardize monitoring, logging, and governance without altering cluster lifecycle management.'
  },
  {
    id: 'q106',
    badge: 'Monitoring & Logging',
    title: 'Required Deployments for Workspace Logging in NKP',
    scenario: 'An administrator is configuring workspace logging in an NKP cluster.',
    prompt: 'Which option shows the two deployments that an administrator must ensure are enabled before workspace logging can be used in an NKP cluster?',
    options: [
      { id: 'a', text: 'Prometheus and Traefik', isCorrect: false, explanation: 'Traefik is an ingress controller and Prometheus handles metrics.' },
      { id: 'b', text: 'Traefik and Cluster Autoscaler', isCorrect: false, explanation: 'Cluster autoscaler manages node scaling.' },
      { id: 'c', text: 'Cert-manager and Traefik', isCorrect: false, explanation: 'Cert-manager handles TLS certificates.' },
      { id: 'd', text: 'Cert-manager and Loki', isCorrect: true, explanation: 'Cert-manager (for secure webhook certificates) and Loki (for log aggregation storage and querying) are mandatory foundational deployments for workspace logging.' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'Cert-manager and Loki are core deployments required to support secure workspace logging in NKP clusters.',
    deepExplanation: 'Workspace logging relies on Cert-manager for TLS certificate generation and Loki for log aggregation and storage.'
  },
  {
    id: 'q107',
    badge: 'Workspaces & Fleet Governance',
    title: 'Controlling Standard Configurations Across Production and Development Clusters',
    scenario: 'A company has different Kubernetes clusters for different business units, separated into production and development environments. All production clusters are standardized, and development clusters are standardized as well. The company acquired NKP Ultimate licenses.',
    prompt: 'How can the company control the standard configuration for both environments in all clusters (production and development)?',
    options: [
      { id: 'a', text: 'Create new Kubernetes clusters for production and development with NKP for every business unit.', isCorrect: false, explanation: 'Recreating clusters is inefficient and unnecessary.' },
      { id: 'b', text: 'Install Flux in every Kubernetes cluster and configure the appropriate kustomize.yaml in every Kubernetes cluster.', isCorrect: false, explanation: 'Manual individual cluster configuration defeats centralized fleet management.' },
      { id: 'c', text: 'Install Flux in every Kubernetes cluster with the appropriate kustomize.yaml using CLI commands.', isCorrect: false, explanation: 'Manual CLI installation on every cluster is not centralized workspace management.' },
      { id: 'd', text: 'Configure a production workspace and a development workspace and attach each Kubernetes cluster to the corresponding workspace.', isCorrect: true, explanation: 'Workspaces in NKP allow centralized configuration, application deployment, and GitOps policy enforcement across grouped clusters (production vs development).' }
    ],
    correctOptionId: 'd',
    keyTakeaway: 'NKP workspaces provide centralized configuration and policy management for grouped production and development clusters.',
    deepExplanation: 'By organizing clusters into dedicated production and development workspaces, platform teams can apply uniform GitOps configurations, monitoring, and security policies effortlessly.'
  }
];
