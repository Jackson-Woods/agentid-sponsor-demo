import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { OwnerSponsorEntry } from '../../models/types';
import {
  getOwners,
  getSponsors,
  removeEntries as removeEntriesService,
} from '../../services/dataService';

interface OwnersAndSponsorsContextValue {
  owners: OwnerSponsorEntry[];
  sponsors: OwnerSponsorEntry[];
  allEntries: OwnerSponsorEntry[];
  selectedItems: OwnerSponsorEntry[];
  setSelectedItems: (items: OwnerSponsorEntry[]) => void;
  loading: boolean;
  operationInProgress: boolean;
  refreshData: () => Promise<void>;
  removeSelected: () => Promise<void>;
}

const OwnersAndSponsorsContext = createContext<OwnersAndSponsorsContextValue | null>(null);

export function useOwnersAndSponsors() {
  const ctx = useContext(OwnersAndSponsorsContext);
  if (!ctx) throw new Error('useOwnersAndSponsors must be used within provider');
  return ctx;
}

interface ProviderProps {
  agentId: string;
  children: ReactNode;
}

export function OwnersAndSponsorsProvider({ agentId, children }: ProviderProps) {
  const [owners, setOwners] = useState<OwnerSponsorEntry[]>([]);
  const [sponsors, setSponsors] = useState<OwnerSponsorEntry[]>([]);
  const [selectedItems, setSelectedItems] = useState<OwnerSponsorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [operationInProgress, setOperationInProgress] = useState(false);

  const refreshData = useCallback(async () => {
    setLoading(true);
    const [o, s] = await Promise.all([
      getOwners(agentId),
      getSponsors(agentId),
    ]);
    setOwners(o);
    setSponsors(s);
    setSelectedItems([]);
    setLoading(false);
  }, [agentId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const removeSelected = useCallback(async () => {
    if (selectedItems.length === 0) return;
    setOperationInProgress(true);
    await removeEntriesService(agentId, selectedItems);
    await refreshData();
    setOperationInProgress(false);
  }, [agentId, selectedItems, refreshData]);

  const allEntries = [...owners, ...sponsors];

  return (
    <OwnersAndSponsorsContext.Provider
      value={{
        owners,
        sponsors,
        allEntries,
        selectedItems,
        setSelectedItems,
        loading,
        operationInProgress,
        refreshData,
        removeSelected,
      }}
    >
      {children}
    </OwnersAndSponsorsContext.Provider>
  );
}
