import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Spinner,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from '@fluentui/react-components';
import { OwnersAndSponsorsProvider, useOwnersAndSponsors } from './OwnersAndSponsorsContext';
import { OwnersAndSponsorsCommandBar } from './CommandBar';
import { OwnersAndSponsorsTable } from './OwnersAndSponsorsTable';
import { RemoveConfirmationDialog } from './RemoveDialog';
import { PeoplePickerDialog } from '../../components/PeoplePicker/PeoplePickerDialog';
import { ToastContainer } from '../../components/shared/Toast';
import type { ToastMessage } from '../../components/shared/Toast';
import { addOwner, addSponsor, getAgentById } from '../../services/dataService';
import { GroupsIdentityIcon } from '../../components/shared/SvgIcon';
import type { DummyUser, DummyGroup } from '../../models/types';
import { getGroupTypeLabel } from '../../models/types';
import { useAppSettings } from '../../AppSettingsContext';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: '4px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  subtitle: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '8px',
  },
  countText: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    padding: '4px 0',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px',
  },
});

function OwnersAndSponsorsContent({ agentId }: { agentId: string }) {
  const styles = useStyles();
  const navigate = useNavigate();
  const {
    allEntries,
    selectedItems,
    setSelectedItems,
    loading,
    operationInProgress,
    refreshData,
    removeSelected,
  } = useOwnersAndSponsors();

  const [agentName, setAgentName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [pickerMode, setPickerMode] = useState<'owner' | 'sponsor' | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const { limitGroupSponsors, prefilterSponsors } = useAppSettings();
  const limitGroupSponsorsRef = useRef(limitGroupSponsors);
  limitGroupSponsorsRef.current = limitGroupSponsors;

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message: string, variant?: 'error' | 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, variant }]);
  }, []);

  useEffect(() => {
    getAgentById(agentId).then((a) => setAgentName(a?.displayName ?? ''));
  }, [agentId]);

  const handleRemove = useCallback(() => {
    if (selectedItems.length > 0) setShowRemoveDialog(true);
  }, [selectedItems]);

  const handleConfirmRemove = useCallback(async () => {
    await removeSelected();
    setShowRemoveDialog(false);
  }, [removeSelected]);

  const handlePickerConfirm = useCallback(
    async (selected: (DummyUser | DummyGroup)[]) => {
      const mode = pickerMode;
      setPickerMode(null);
      if (!mode || selected.length === 0) return;

      if (mode === 'sponsor' && limitGroupSponsorsRef.current) {
        for (const entity of selected) {
          if (entity['@odata.type'] === '#microsoft.graph.group') {
            const group = entity as DummyGroup;
            const groupType = getGroupTypeLabel(group);

            if (groupType === 'Security' && !group.disableNesting) {
              showToast(
                'Nestable security groups not supported',
                'Only security groups that are non-nestable can be sponsors.',
              );
              return;
            }

            if (
              groupType === 'Microsoft 365' ||
              groupType === 'Role-Assignable Security' ||
              groupType === 'Dynamic Microsoft 365'
            ) {
              showToast(
                'Group type not supported',
                'Only dynamic groups and non-nestable security groups can be sponsors.',
              );
              return;
            }
          }
        }
      }

      for (const entity of selected) {
        if (mode === 'owner') {
          await addOwner(agentId, entity.id);
          showToast('Owner added', `${entity.displayName} has been added as an owner.`, 'success');
        } else {
          await addSponsor(agentId, entity.id);
          showToast('Sponsor added', `${entity.displayName} has been added as a sponsor.`, 'success');
        }
      }
      await refreshData();
    },
    [pickerMode, agentId, refreshData, showToast],
  );

  const busy = loading || operationInProgress;

  return (
    <div className={styles.page}>
      <Breadcrumb size="small">
        <BreadcrumbItem>
          <BreadcrumbButton>Home</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton onClick={() => navigate('/agents')}>Agent ID | All agent identities</BreadcrumbButton>
        </BreadcrumbItem>
      </Breadcrumb>
      <div className={styles.titleRow}>
        <GroupsIdentityIcon fontSize={28} />
        <Text className={styles.title}>{agentName ? `${agentName} | ` : ''}Owners and sponsors</Text>
      </div>
      <Text className={styles.subtitle}>
        Manage agent access and settings
      </Text>

      <OwnersAndSponsorsCommandBar
        selectedItems={selectedItems}
        disabled={busy}
        onAddOwner={() => setPickerMode('owner')}
        onAddSponsor={() => setPickerMode('sponsor')}
        onRemove={handleRemove}
        onSearch={setSearchTerm}
        onRefresh={refreshData}
      />

      <Text className={styles.countText}>
        {allEntries.length} total &middot;{' '}
        {selectedItems.length > 0 ? `${selectedItems.length} selected` : 'None selected'}
      </Text>

      <OwnersAndSponsorsTable
        items={allEntries}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        loading={busy}
        searchTerm={searchTerm}
      />

      <RemoveConfirmationDialog
        isOpen={showRemoveDialog}
        selectedItems={selectedItems}
        loading={operationInProgress}
        onClose={() => setShowRemoveDialog(false)}
        onConfirm={handleConfirmRemove}
      />

      <PeoplePickerDialog
        isOpen={pickerMode !== null}
        mode={pickerMode ?? 'owner'}
        agentId={agentId}
        prefilterSponsors={prefilterSponsors}
        onClose={() => setPickerMode(null)}
        onConfirm={handlePickerConfirm}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export function OwnersAndSponsorsPage() {
  const styles = useStyles();
  const { objectId } = useParams<{ objectId: string }>();

  if (!objectId) {
    return (
      <div className={styles.center}>
        <Text>No agent selected.</Text>
      </div>
    );
  }

  return (
    <OwnersAndSponsorsProvider agentId={objectId}>
      <OwnersAndSponsorsContent agentId={objectId} />
    </OwnersAndSponsorsProvider>
  );
}
