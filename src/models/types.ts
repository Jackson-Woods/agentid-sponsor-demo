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
