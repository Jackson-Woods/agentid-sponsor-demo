import { useEffect, useState } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Switch,
  Button,
  Link,
  Spinner,
} from '@fluentui/react-components';
import { ArrowSyncRegular } from '@fluentui/react-icons';
import { LifecyclePageHeader } from './LifecyclePageHeader';
import {
  getAgentIdPolicy,
  updateAgentIdPolicy,
} from '../../services/dataService';
import { AgentPickerDialog } from '../../components/PeoplePicker/AgentPickerDialog';
import type { AgentIdLifecyclePolicy } from '../../models/types';
import { PolicyScopePicker } from './policyParts/PolicyScopePicker';
import { NotificationScheduleEditor } from './policyParts/NotificationScheduleEditor';
import { ReEnableInfoBanner } from './policyParts/ReEnableInfoBanner';
import { InactivityWindowPicker } from './policyParts/InactivityWindowPicker';
import { NotifyOwnersToggle } from './policyParts/NotifyOwnersToggle';

const useStyles = makeStyles({
  card: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '4px',
    padding: '24px 28px',
    maxWidth: '760px',
    marginTop: '8px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
  },
  cardDescription: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    marginBottom: '16px',
  },
  enableRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '12px',
  },
  metaText: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginLeft: '52px',
    marginTop: '4px',
    display: 'block',
  },
  buttonRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '24px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px',
  },
});

function formatPolicyDate(iso: string): string {
  const d = new Date(iso);
  const datePart = d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const timePart = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  return `${datePart}, ${timePart}`;
}

export function DefaultDisablePage() {
  const styles = useStyles();
  const [policy, setPolicy] = useState<AgentIdLifecyclePolicy | null>(null);
  const [draft, setDraft] = useState<AgentIdLifecyclePolicy | null>(null);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const load = async () => {
    const p = await getAgentIdPolicy();
    setPolicy(p);
    setDraft(p);
  };

  useEffect(() => {
    load();
  }, []);

  const isDirty =
    policy !== null &&
    draft !== null &&
    JSON.stringify(policy) !== JSON.stringify(draft);

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    const updated = await updateAgentIdPolicy(draft);
    setPolicy(updated);
    setDraft(updated);
    setSaving(false);
  };

  const handleDiscard = () => setDraft(policy);

  const enabled = draft?.inactivityDisableEnabled ?? true;

  return (
    <LifecyclePageHeader
      pageLabel="Default Disable (Preview)"
      iconKind="policy"
      bannerVariant="none"
    >
      {draft === null ? (
        <div className={styles.loading}>
          <Spinner />
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Text className={styles.cardTitle}>Default disable policy</Text>
            <Button
              appearance="subtle"
              icon={<ArrowSyncRegular />}
              aria-label="Refresh"
              onClick={load}
            />
          </div>
          <Text className={styles.cardDescription}>
            Automatically disable inactive agent identities after a configurable period of
            inactivity.{' '}
            <Link href="#" inline>
              Learn more
            </Link>
          </Text>

          <div className={styles.enableRow}>
            <Switch
              checked={enabled}
              onChange={(_, d) =>
                setDraft({ ...draft, inactivityDisableEnabled: d.checked })
              }
              label="Enable default disable"
            />
          </div>
          <Text className={styles.metaText}>
            Created: {formatPolicyDate(draft.createdDateTime)}
          </Text>
          <Text className={styles.metaText}>
            Last Modified: {formatPolicyDate(draft.lastModifiedDateTime)}
          </Text>

          <InactivityWindowPicker
            days={draft.inactivityDays ?? 90}
            disabled={!enabled}
            onChange={(days) => setDraft({ ...draft, inactivityDays: days })}
          />

          <PolicyScopePicker
            title="Policy scope"
            scope={draft.inactivityScope ?? 'All'}
            selectedAgentIds={draft.inactivityExemptAgentIds ?? []}
            disabled={!enabled}
            availableScopes={['All', 'Exclude']}
            onChangeScope={(scope) => setDraft({ ...draft, inactivityScope: scope })}
            onOpenPicker={() => setPickerOpen(true)}
          />

          <NotificationScheduleEditor
            title="Notification schedule"
            customize={draft.inactivityCustomizeNotificationSchedule ?? true}
            firstDays={draft.inactivityFirstNotificationDays ?? 30}
            secondDays={draft.inactivitySecondNotificationDays}
            thirdDays={draft.inactivityThirdNotificationDays}
            disabled={!enabled}
            onChangeCustomize={(v) =>
              setDraft({ ...draft, inactivityCustomizeNotificationSchedule: v })
            }
            onChangeDays={({ first, second, third }) =>
              setDraft({
                ...draft,
                inactivityFirstNotificationDays: first,
                inactivitySecondNotificationDays: second,
                inactivityThirdNotificationDays: third,
              })
            }
            trailingInfoText="Responsible party must have an Exchange license to receive notification emails."
          />

          <NotifyOwnersToggle
            checked={draft.notifyOwners ?? false}
            disabled={!enabled}
            onChange={(v) => setDraft({ ...draft, notifyOwners: v })}
          />

          <ReEnableInfoBanner />

          <div className={styles.buttonRow}>
            <Button appearance="primary" disabled={!isDirty || saving} onClick={handleSave}>
              Save
            </Button>
            <Button disabled={!isDirty || saving} onClick={handleDiscard}>
              Discard
            </Button>
          </div>
        </div>
      )}
      <AgentPickerDialog
        isOpen={pickerOpen}
        initialSelectedIds={draft?.inactivityExemptAgentIds ?? []}
        onClose={() => setPickerOpen(false)}
        onConfirm={(ids) => {
          if (draft) {
            setDraft({ ...draft, inactivityExemptAgentIds: ids });
          }
          setPickerOpen(false);
        }}
      />
    </LifecyclePageHeader>
  );
}
