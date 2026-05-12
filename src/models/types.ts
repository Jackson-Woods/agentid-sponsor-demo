export enum AgentIdentityStatus {
  Active = 'Active',
  Disabled = 'Disabled',
}

export interface AgentIdentity {
  id: string;
  displayName: string;
  status: AgentIdentityStatus;
  createdDateTime: string;
  blueprintId?: string;
  blueprintName?: string;
  ownerCount: number;
  sponsorCount: number;
  hasAgentUser: boolean;
}

export interface AgentBlueprint {
  id: string;
  displayName: string;
  createdDateTime: string;
}

export interface DummyUser {
  id: string;
  displayName: string;
  userPrincipalName: string;
  mail: string;
  userType: 'Member' | 'Guest';
  isAgent?: boolean;
  onPremisesSyncEnabled?: boolean;
  identities?: string;
  '@odata.type': '#microsoft.graph.user';
}

export type GroupType =
  | 'Security'
  | 'Microsoft 365'
  | 'Dynamic Security'
  | 'Role-Assignable Security'
  | 'Mail-Enabled Security'
  | 'Dynamic Microsoft 365';

export interface DummyGroup {
  id: string;
  displayName: string;
  mail: string;
  description?: string;
  groupTypes: string[];
  securityEnabled: boolean;
  mailEnabled: boolean;
  membershipRule?: string;
  membershipRuleProcessingState?: 'On' | 'Paused';
  isAssignableToRole?: boolean;
  disableNesting?: boolean;
  '@odata.type': '#microsoft.graph.group';
}

export interface OwnerSponsorEntry {
  id: string;
  key: string; // "owner-{id}" or "sponsor-{id}"
  name: string;
  email: string;
  type: 'Owner' | 'Sponsor';
  objectType: 'User' | 'Group';
  rawData: DummyUser | DummyGroup;
}

export interface SignedInUser {
  displayName: string;
  email: string;
  initials: string;
}

// ─── Lifecycle Workflows ───

export type LifecycleWorkflowCategory = 'Joiner' | 'Mover' | 'Leaver';

export interface LifecycleWorkflow {
  id: string;
  displayName: string;
  description: string;
  category: LifecycleWorkflowCategory;
  createdDateTime: string;
  lastModifiedDateTime: string;
  scheduleEnabled: boolean;
  isDeleted?: boolean;
}

export interface WorkflowSettings {
  workflowScheduleHours: number;
  emailDomain: string;
  useCompanyBrandingLogo: boolean;
}

export type LifecyclePolicyScope = 'All' | 'Specific' | 'Exclude';

export interface AgentIdLifecyclePolicy {
  enabled: boolean;
  createdDateTime: string;
  lastModifiedDateTime: string;
  scope: LifecyclePolicyScope;
  selectedAgentIds: string[];
  reconfirmationDays: number;
  customizeNotificationSchedule: boolean;
  firstNotificationDays: number;
  secondNotificationDays?: number;
  thirdNotificationDays?: number;
  // Default-disable (inactivity) policy fields. Optional so existing
  // persisted policies stay backward compatible until STORE_VERSION bump.
  inactivityDisableEnabled?: boolean;
  inactivityDays?: number;
  inactivityScope?: LifecyclePolicyScope;
  inactivityExemptAgentIds?: string[];
  inactivityCustomizeNotificationSchedule?: boolean;
  inactivityFirstNotificationDays?: number;
  inactivitySecondNotificationDays?: number;
  inactivityThirdNotificationDays?: number;
  notifyOwners?: boolean;
  // Variant 2 — which lifecycle modes are active when integrated mode picker
  // is used. Independent of variant toggle persistence.
  lifecycleModes?: { reconfirm: boolean; inactivity: boolean };
}

export interface CustomExtension {
  id: string;
  name: string;
  logicAppName: string;
  tokenSecurity: string;
}

export function getGroupTypeLabel(group: DummyGroup): GroupType {
  const isUnified = group.groupTypes.includes('Unified');
  const isDynamic = group.groupTypes.includes('DynamicMembership') ||
    group.membershipRuleProcessingState === 'On';

  if (isUnified && isDynamic) return 'Dynamic Microsoft 365';
  if (isUnified) return 'Microsoft 365';
  if (group.isAssignableToRole) return 'Role-Assignable Security';
  if (isDynamic) return 'Dynamic Security';
  if (group.securityEnabled && group.mailEnabled) return 'Mail-Enabled Security';
  return 'Security';
}
