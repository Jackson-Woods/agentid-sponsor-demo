import type {
  AgentIdentity,
  DummyUser,
  DummyGroup,
  OwnerSponsorEntry,
  LifecycleWorkflow,
  WorkflowSettings,
  AgentLifecyclePolicy,
  AgentIdLifecyclePolicy,
  CustomExtension,
} from '../models/types';
import { AgentIdentityStatus, getGroupTypeLabel } from '../models/types';
import {
  agentIdentities as seedAgents,
  dummyUsers as seedUsers,
  dummyGroups as seedGroups,
  agentOwnersSponsorsSeed,
  agentBlueprints as seedBlueprints,
  lifecycleWorkflowsSeed,
  workflowSettingsSeed,
  agentLifecyclePoliciesSeed,
  agentIdPolicySeed,
  customExtensionsSeed,
} from '../data/seed';
import type { AgentBlueprint } from '../models/types';

const STORAGE_KEY = 'agentid-prototype';
const STORE_VERSION = 12;

interface StoreData {
  version?: number;
  agents: AgentIdentity[];
  blueprints: AgentBlueprint[];
  users: DummyUser[];
  groups: DummyGroup[];
  // Maps agentId → array of user/group IDs
  ownershipMap: Record<string, string[]>;
  sponsorshipMap: Record<string, string[]>;
  lifecycleWorkflows: LifecycleWorkflow[];
  workflowSettings: WorkflowSettings;
  agentLifecyclePolicies: AgentLifecyclePolicy[];
  agentIdPolicy: AgentIdLifecyclePolicy;
  customExtensions: CustomExtension[];
}

function buildInitialStore(): StoreData {
  const ownershipMap: Record<string, string[]> = {};
  const sponsorshipMap: Record<string, string[]> = {};

  for (const seed of agentOwnersSponsorsSeed) {
    ownershipMap[seed.agentId] = [...seed.owners];
    sponsorshipMap[seed.agentId] = [...seed.sponsors];
  }

  return {
    version: STORE_VERSION,
    agents: structuredClone(seedAgents),
    blueprints: structuredClone(seedBlueprints),
    users: structuredClone(seedUsers),
    groups: structuredClone(seedGroups),
    ownershipMap,
    sponsorshipMap,
    lifecycleWorkflows: structuredClone(lifecycleWorkflowsSeed),
    workflowSettings: structuredClone(workflowSettingsSeed),
    agentLifecyclePolicies: structuredClone(agentLifecyclePoliciesSeed),
    agentIdPolicy: structuredClone(agentIdPolicySeed),
    customExtensions: structuredClone(customExtensionsSeed),
  };
}

function loadStore(): StoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoreData;
      if (parsed.version === STORE_VERSION) {
        if (!parsed.agentLifecyclePolicies) {
          parsed.agentLifecyclePolicies = structuredClone(agentLifecyclePoliciesSeed);
          saveStore(parsed);
        }
        return parsed;
      }
    }
  } catch {
    // corrupt data — reset
  }
  return resetStore();
}

function saveStore(store: StoreData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function resetStore(): StoreData {
  const store = buildInitialStore();
  saveStore(store);
  return store;
}

function delay(ms = 150): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Recalculate owner/sponsor counts on agent objects from the maps. */
function syncCounts(store: StoreData): void {
  for (const agent of store.agents) {
    agent.ownerCount = (store.ownershipMap[agent.id] ?? []).length;
    agent.sponsorCount = (store.sponsorshipMap[agent.id] ?? []).length;
  }
}

function findEntity(store: StoreData, entityId: string): DummyUser | DummyGroup | undefined {
  return (
    store.users.find((u) => u.id === entityId) ??
    store.groups.find((g) => g.id === entityId)
  );
}

function toEntry(
  entity: DummyUser | DummyGroup,
  type: 'Owner' | 'Sponsor',
): OwnerSponsorEntry {
  const isUser = entity['@odata.type'] === '#microsoft.graph.user';
  const user = isUser ? (entity as DummyUser) : undefined;
  const group = !isUser ? (entity as DummyGroup) : undefined;
  return {
    id: entity.id,
    key: `${type.toLowerCase()}-${entity.id}`,
    name: entity.displayName,
    email: user?.mail ?? group?.mail ?? '',
    type,
    objectType: isUser ? 'User' : 'Group',
    rawData: entity,
  };
}

// ─── Public API ───

let store = loadStore();

export function initialize(): void {
  store = loadStore();
}

export function resetData(): void {
  store = resetStore();
}

export async function getAgentIdentities(): Promise<AgentIdentity[]> {
  await delay();
  syncCounts(store);
  return [...store.agents];
}

export async function getAgentById(id: string): Promise<AgentIdentity | undefined> {
  await delay();
  syncCounts(store);
  return store.agents.find((a) => a.id === id);
}

export async function getBlueprintById(id: string): Promise<AgentBlueprint | undefined> {
  await delay(50);
  return store.blueprints.find((b) => b.id === id);
}

export async function getOwners(agentId: string): Promise<OwnerSponsorEntry[]> {
  await delay();
  const ids = store.ownershipMap[agentId] ?? [];
  return ids
    .map((id) => {
      const entity = findEntity(store, id);
      return entity ? toEntry(entity, 'Owner') : undefined;
    })
    .filter(Boolean) as OwnerSponsorEntry[];
}

export async function getSponsors(agentId: string): Promise<OwnerSponsorEntry[]> {
  await delay();
  const ids = store.sponsorshipMap[agentId] ?? [];
  return ids
    .map((id) => {
      const entity = findEntity(store, id);
      return entity ? toEntry(entity, 'Sponsor') : undefined;
    })
    .filter(Boolean) as OwnerSponsorEntry[];
}

export async function addOwner(agentId: string, userId: string): Promise<void> {
  await delay(200);
  if (!store.ownershipMap[agentId]) store.ownershipMap[agentId] = [];
  if (!store.ownershipMap[agentId].includes(userId)) {
    store.ownershipMap[agentId].push(userId);
  }
  syncCounts(store);
  saveStore(store);
}

export async function addSponsor(agentId: string, entityId: string): Promise<void> {
  await delay(200);
  if (!store.sponsorshipMap[agentId]) store.sponsorshipMap[agentId] = [];
  if (!store.sponsorshipMap[agentId].includes(entityId)) {
    store.sponsorshipMap[agentId].push(entityId);
  }
  syncCounts(store);
  saveStore(store);
}

export async function removeOwner(agentId: string, userId: string): Promise<void> {
  await delay(200);
  const list = store.ownershipMap[agentId];
  if (list) {
    store.ownershipMap[agentId] = list.filter((id) => id !== userId);
  }
  syncCounts(store);
  saveStore(store);
}

export async function removeSponsor(agentId: string, entityId: string): Promise<void> {
  await delay(200);
  const list = store.sponsorshipMap[agentId];
  if (list) {
    store.sponsorshipMap[agentId] = list.filter((id) => id !== entityId);
  }
  syncCounts(store);
  saveStore(store);
}

export async function removeEntries(
  agentId: string,
  entries: OwnerSponsorEntry[],
): Promise<void> {
  await delay(300);
  for (const entry of entries) {
    if (entry.type === 'Owner') {
      const list = store.ownershipMap[agentId];
      if (list) store.ownershipMap[agentId] = list.filter((id) => id !== entry.id);
    } else {
      const list = store.sponsorshipMap[agentId];
      if (list) store.sponsorshipMap[agentId] = list.filter((id) => id !== entry.id);
    }
  }
  syncCounts(store);
  saveStore(store);
}

export async function toggleAgentStatus(agentId: string): Promise<AgentIdentity | undefined> {
  await delay(200);
  const agent = store.agents.find((a) => a.id === agentId);
  if (agent) {
    agent.status = agent.status === AgentIdentityStatus.Active ? AgentIdentityStatus.Disabled : AgentIdentityStatus.Active;
    saveStore(store);
  }
  return agent;
}

/** Get users not already assigned as owners for a given agent. */
export async function getAvailableOwnerUsers(agentId: string): Promise<DummyUser[]> {
  await delay(80);
  const existing = new Set(store.ownershipMap[agentId] ?? []);
  return store.users.filter((u) => !existing.has(u.id));
}

/** Get users and groups not already assigned as sponsors for a given agent. */
export async function getAvailableSponsors(
  agentId: string,
): Promise<(DummyUser | DummyGroup)[]> {
  await delay(80);
  const existing = new Set(store.sponsorshipMap[agentId] ?? []);
  const available: (DummyUser | DummyGroup)[] = [
    ...store.users.filter((u) => !existing.has(u.id)),
    ...store.groups.filter((g) => !existing.has(g.id)),
  ];
  return available;
}

export function searchEntities(
  entities: (DummyUser | DummyGroup)[],
  term: string,
): (DummyUser | DummyGroup)[] {
  if (!term) return entities;
  const lower = term.toLowerCase();
  return entities.filter((e) => {
    const name = e.displayName.toLowerCase();
    const mail =
      e['@odata.type'] === '#microsoft.graph.user'
        ? (e as DummyUser).mail.toLowerCase()
        : (e as DummyGroup).mail.toLowerCase();
    return name.includes(lower) || mail.includes(lower);
  });
}

export async function getUsers(): Promise<DummyUser[]> {
  await delay(80);
  return [...store.users];
}

export async function getBlueprints(): Promise<AgentBlueprint[]> {
  await delay(80);
  return [...store.blueprints];
}

export async function getBlueprintAgentCounts(): Promise<Record<string, number>> {
  await delay(80);
  const counts: Record<string, number> = {};
  for (const bp of store.blueprints) {
    counts[bp.id] = store.agents.filter((a) => a.blueprintId === bp.id).length;
  }
  return counts;
}

// ─── Groups API ───

export async function getGroups(): Promise<DummyGroup[]> {
  await delay();
  return [...store.groups];
}

export interface GroupStats {
  total: number;
  security: number;
  m365: number;
  dynamic: number;
  cloudGroups: number;
  onPremGroups: number;
}

export async function getGroupStats(): Promise<GroupStats> {
  await delay();
  const groups = store.groups;
  const total = groups.length;
  let security = 0;
  let m365 = 0;
  let dynamic = 0;
  for (const g of groups) {
    const label = getGroupTypeLabel(g);
    if (label === 'Security' || label === 'Role-Assignable Security' || label === 'Mail-Enabled Security') security++;
    if (label === 'Microsoft 365' || label === 'Dynamic Microsoft 365') m365++;
    if (label === 'Dynamic Security' || label === 'Dynamic Microsoft 365') dynamic++;
  }
  return { total, security, m365, dynamic, cloudGroups: total, onPremGroups: 0 };
}

export async function addGroup(group: DummyGroup): Promise<DummyGroup> {
  await delay(200);
  store.groups.push(group);
  saveStore(store);
  return group;
}

export async function getGroupById(id: string): Promise<DummyGroup | undefined> {
  await delay(80);
  return store.groups.find((g) => g.id === id);
}

export async function deleteGroups(ids: string[]): Promise<void> {
  await delay(200);
  store.groups = store.groups.filter((g) => !ids.includes(g.id));
  saveStore(store);
}

// ─── Lifecycle Workflows API ───

export async function getLifecycleWorkflows(): Promise<LifecycleWorkflow[]> {
  await delay(80);
  return store.lifecycleWorkflows.filter((w) => !w.isDeleted);
}

export async function getDeletedLifecycleWorkflows(): Promise<LifecycleWorkflow[]> {
  await delay(80);
  return store.lifecycleWorkflows.filter((w) => w.isDeleted);
}

export async function getWorkflowSettings(): Promise<WorkflowSettings> {
  await delay(60);
  return { ...store.workflowSettings };
}

export async function updateWorkflowSettings(
  patch: Partial<WorkflowSettings>,
): Promise<WorkflowSettings> {
  await delay(150);
  store.workflowSettings = { ...store.workflowSettings, ...patch };
  saveStore(store);
  return { ...store.workflowSettings };
}

export async function getAgentIdPolicy(): Promise<AgentIdLifecyclePolicy> {
  await delay(60);
  return {
    ...store.agentIdPolicy,
    selectedAgentIds: [...store.agentIdPolicy.selectedAgentIds],
  };
}

export async function getAgentLifecyclePolicies(): Promise<AgentLifecyclePolicy[]> {
  await delay(60);
  return structuredClone(store.agentLifecyclePolicies);
}

export async function createAgentLifecyclePolicy(
  input: Pick<AgentLifecyclePolicy, 'name' | 'enabled' | 'scope' | 'selectedAgentIds'>,
): Promise<AgentLifecyclePolicy> {
  await delay(150);
  const now = new Date().toISOString();
  const policy: AgentLifecyclePolicy = {
    ...input,
    id: crypto.randomUUID(),
    description: 'Custom agent lifecycle policy.',
    selectedAgentIds: [...input.selectedAgentIds],
    createdDateTime: now,
    lastModifiedDateTime: now,
  };
  store.agentLifecyclePolicies.push(policy);
  saveStore(store);
  return structuredClone(policy);
}

export async function moveAgentLifecyclePolicy(
  policyId: string,
  direction: 'up' | 'down',
): Promise<AgentLifecyclePolicy[]> {
  await delay(100);
  const currentIndex = store.agentLifecyclePolicies.findIndex((policy) => policy.id === policyId);
  const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (
    currentIndex < 0 ||
    nextIndex < 0 ||
    nextIndex >= store.agentLifecyclePolicies.length
  ) {
    return structuredClone(store.agentLifecyclePolicies);
  }
  const [policy] = store.agentLifecyclePolicies.splice(currentIndex, 1);
  store.agentLifecyclePolicies.splice(nextIndex, 0, policy);
  saveStore(store);
  return structuredClone(store.agentLifecyclePolicies);
}

export async function updateAgentIdPolicy(
  patch: Partial<AgentIdLifecyclePolicy>,
): Promise<AgentIdLifecyclePolicy> {
  await delay(150);
  store.agentIdPolicy = {
    ...store.agentIdPolicy,
    ...patch,
    selectedAgentIds: patch.selectedAgentIds
      ? [...patch.selectedAgentIds]
      : [...store.agentIdPolicy.selectedAgentIds],
    lastModifiedDateTime: new Date().toISOString(),
  };
  saveStore(store);
  return {
    ...store.agentIdPolicy,
    selectedAgentIds: [...store.agentIdPolicy.selectedAgentIds],
  };
}

export async function getCustomExtensions(): Promise<CustomExtension[]> {
  await delay(60);
  return [...store.customExtensions];
}
