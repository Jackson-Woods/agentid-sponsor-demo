import { useEffect, useState } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Switch,
  Radio,
  RadioGroup,
  Input,
  Dropdown,
  Option,
  Button,
  Link,
  Spinner,
} from '@fluentui/react-components';
import {
  ArrowSyncRegular,
  AddRegular,
  DeleteRegular,
  InfoRegular,
} from '@fluentui/react-icons';
import { LifecyclePageHeader } from './LifecyclePageHeader';
import {
  getAgentIdPolicy,
  updateAgentIdPolicy,
} from '../../services/dataService';
import { AgentPickerDialog } from '../../components/PeoplePicker/AgentPickerDialog';
import type {
  AgentIdLifecyclePolicy,
  LifecyclePolicyScope,
} from '../../models/types';

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
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    marginTop: '20px',
    display: 'block',
  },
  sectionDescription: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    marginTop: '2px',
    marginBottom: '8px',
  },
  reconfirmRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  reconfirmLabel: {
    fontSize: '13px',
    minWidth: '200px',
  },
  smallInput: {
    width: '80px',
  },
  infoBar: {
    backgroundColor: '#eff6fc',
    border: `1px solid #cce4f7`,
    borderRadius: '4px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '13px',
    marginTop: '8px',
    marginBottom: '8px',
  },
  infoIcon: {
    color: '#0078d4',
    fontSize: '16px',
    flexShrink: 0,
    marginTop: '1px',
  },
  notificationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
  },
  notificationLabel: {
    fontSize: '13px',
    minWidth: '160px',
  },
  daysDropdown: {
    minWidth: '90px',
  },
  addNotificationRow: {
    marginTop: '12px',
  },
  buttonRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px',
  },
  selectAgentsLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: tokens.colorBrandForeground1,
    fontSize: '13px',
    padding: '4px 0',
    marginLeft: '24px',
    marginTop: '4px',
  },
  selectAgentsCount: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginLeft: '24px',
    marginTop: '4px',
    display: 'block',
  },
});

const DAYS_OPTIONS = ['1', '7', '15', '30', '60', '90'];
const SECOND_DAYS_OPTIONS = ['15', '7', '5', '1'];
const THIRD_DAYS_OPTIONS = ['7', '5', '1'];
const ORDINAL_LABELS = ['First', 'Second', 'Third'];
const POSITION_OPTIONS = [DAYS_OPTIONS, SECOND_DAYS_OPTIONS, THIRD_DAYS_OPTIONS];

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

export function AgentIdPolicyPage() {
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

  const handleDiscard = () => {
    setDraft(policy);
  };

  return (
    <LifecyclePageHeader
      pageLabel="Agent ID (Preview)"
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
            <Text className={styles.cardTitle}>Lifecycle policy settings</Text>
            <Button
              appearance="subtle"
              icon={<ArrowSyncRegular />}
              aria-label="Refresh"
              onClick={load}
            />
          </div>
          <Text className={styles.cardDescription}>
            Configure lifecycle policy settings to manage the lifecycle of agent identities in your
            organization.{' '}
            <Link href="#" inline>
              Learn more
            </Link>
          </Text>

          <div className={styles.enableRow}>
            <Switch
              checked={draft.enabled}
              onChange={(_, d) => setDraft({ ...draft, enabled: d.checked })}
              label="Enable lifecycle policies"
            />
          </div>
          <Text className={styles.metaText}>
            Created: {formatPolicyDate(draft.createdDateTime)}
          </Text>
          <Text className={styles.metaText}>
            Last Modified: {formatPolicyDate(draft.lastModifiedDateTime)}
          </Text>

          <Text className={styles.sectionTitle}>Select policy scope</Text>
          <RadioGroup
            value={draft.scope}
            onChange={(_, d) =>
              setDraft({ ...draft, scope: d.value as LifecyclePolicyScope })
            }
          >
            <Radio value="All" label="All agents" />
            <Radio value="Specific" label="Specific agents" />
            <Radio value="Exclude" label="Exclude agents" />
          </RadioGroup>
          {draft.scope !== 'All' && (
            <>
              <button
                className={styles.selectAgentsLink}
                onClick={() => setPickerOpen(true)}
              >
                <AddRegular fontSize={14} />
                Select agents
              </button>
              {draft.selectedAgentIds.length > 0 && (
                <Text className={styles.selectAgentsCount}>
                  {draft.selectedAgentIds.length} agent
                  {draft.selectedAgentIds.length === 1 ? '' : 's'} selected
                </Text>
              )}
            </>
          )}

          <Text className={styles.sectionTitle}>Periodic Re-confirmation</Text>
          <Text className={styles.sectionDescription}>
            Set how often Sponsors need to periodically re-confirm that agents they sponsor are
            needed
          </Text>
          <div className={styles.reconfirmRow}>
            <Text className={styles.reconfirmLabel}>Require re-confirmation every:</Text>
            <Input
              className={styles.smallInput}
              type="number"
              min={1}
              value={String(draft.reconfirmationDays)}
              onChange={(_, d) => {
                const n = parseInt(d.value, 10);
                if (!isNaN(n) && n > 0) {
                  setDraft({ ...draft, reconfirmationDays: n });
                }
              }}
            />
            <Text style={{ fontSize: '13px' }}>days</Text>
          </div>

          <Text className={styles.sectionTitle}>Notification schedule</Text>
          <div className={styles.infoBar} role="status">
            <InfoRegular className={styles.infoIcon} />
            <Text style={{ flex: 1 }}>
              By default, Email notifications will be sent automatically 30, 15, and 1 day prior to
              agent identity is disabled.
            </Text>
          </div>

          <div className={styles.enableRow}>
            <Switch
              checked={draft.customizeNotificationSchedule}
              onChange={(_, d) =>
                setDraft({ ...draft, customizeNotificationSchedule: d.checked })
              }
              label="Customize Notification schedule"
            />
          </div>

          {draft.customizeNotificationSchedule && (() => {
            const days = [
              draft.firstNotificationDays,
              draft.secondNotificationDays,
              draft.thirdNotificationDays,
            ].filter((d): d is number => d !== undefined);

            const writeDays = (newDays: number[]) => {
              setDraft({
                ...draft,
                firstNotificationDays: newDays[0] ?? draft.firstNotificationDays,
                secondNotificationDays: newDays[1],
                thirdNotificationDays: newDays[2],
              });
            };

            const removeAt = (idx: number) => {
              writeDays(days.filter((_, i) => i !== idx));
            };

            const addNotification = () => {
              if (days.length >= 3) return;
              writeDays([...days, 1]);
            };

            return (
              <>
                {days.map((value, idx) => {
                  const options = POSITION_OPTIONS[idx] ?? DAYS_OPTIONS;
                  return (
                    <div key={idx} className={styles.notificationRow}>
                      <Text className={styles.notificationLabel}>
                        {ORDINAL_LABELS[idx]} notification:
                      </Text>
                      <Dropdown
                        className={styles.daysDropdown}
                        value={String(value)}
                        selectedOptions={[String(value)]}
                        onOptionSelect={(_, d) => {
                          if (!d.optionValue) return;
                          const next = [...days];
                          next[idx] = parseInt(d.optionValue, 10);
                          writeDays(next);
                        }}
                      >
                        {options.map((opt) => (
                          <Option key={opt} value={opt}>
                            {opt}
                          </Option>
                        ))}
                      </Dropdown>
                      <Text style={{ fontSize: '13px' }}>Days before</Text>
                      {idx > 0 && (
                        <Button
                          appearance="subtle"
                          icon={
                            <DeleteRegular style={{ color: tokens.colorBrandForeground1 }} />
                          }
                          aria-label={`Remove ${ORDINAL_LABELS[idx].toLowerCase()} notification`}
                          onClick={() => removeAt(idx)}
                        />
                      )}
                    </div>
                  );
                })}

                {days.length < 3 && (
                  <div className={styles.addNotificationRow}>
                    <Button
                      icon={<AddRegular style={{ color: tokens.colorBrandForeground1 }} />}
                      onClick={addNotification}
                    >
                      Add notification
                    </Button>
                  </div>
                )}
              </>
            );
          })()}

          <div className={styles.infoBar} role="status">
            <InfoRegular className={styles.infoIcon} />
            <Text style={{ flex: 1 }}>
              Responsible party must have an Exchange license to receive notification emails.
            </Text>
          </div>

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
        initialSelectedIds={draft?.selectedAgentIds ?? []}
        onClose={() => setPickerOpen(false)}
        onConfirm={(ids) => {
          if (draft) {
            setDraft({ ...draft, selectedAgentIds: ids });
          }
          setPickerOpen(false);
        }}
      />
    </LifecyclePageHeader>
  );
}
