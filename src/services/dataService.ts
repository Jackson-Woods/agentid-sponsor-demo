import type {
  AgentIdentity,
  DummyUser,
  DummyGroup,
  OwnerSponsorEntry,
} from '../models/types';
import {
  agentIdentities as seedAgents,
  dummyUsers as seedUsers,
  dummyGroups as seedGroups,
  agentOwnersSponsorsSeed,
  agentBlueprints as seedBlueprints,
} from '../data/seed';
import type { AgentBlueprint } from '../models/types';

const STORAGE_KEY = 'agentid-prototype';

interface StoreData {
  agents: AgentIdentity[];
  blueprints: AgentBlueprint[];
  users: DummyUser[];
  groups: DummyGroup[];
  // Maps agentId → array of user/group IDs
  ownershipMap: Record<string, string[]>;
  sponsorshipMap: Record<string, string[]>;
}

function buildInitialStore(): StoreData {
  const ownershipMap: Record<string, string[]> = {};
  const sponsorshipMap: Record<string, string[]> = {};

  for (const seed of agentOwnersSponsorsSeed) {
    ownershipMap[seed.agentId] = [...seed.owners];
    sponsorshipMap[seed.agentId] = [...seed.sponsors];
  }

  return {
    agents: structuredClone(seedAgents),
    blueprints: structuredClone(seedBlueprints),
    users: structuredClone(seedUsers),
    groups: structuredClone(seedGroups),
    ownershipMap,
    sponsorshipMap,
  };
}

function loadStore(): StoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoreData;
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
    agent.status = agent.status === 'Active' ? 'Disabled' : 'Active';
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
