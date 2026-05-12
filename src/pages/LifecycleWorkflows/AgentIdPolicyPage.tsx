import { useEffect, useState } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Switch,
  Input,
  Button,
  Link,
  Spinner,
  Checkbox,
} from '@fluentui/react-components';
import {
  ArrowSyncRegular,
} from '@fluentui/react-icons';
import { LifecyclePageHeader } from './LifecyclePageHeader';
import {
  getAgentIdPolicy,
  updateAgentIdPolicy,
} from '../../services/dataService';
import { AgentPickerDialog } from '../../components/PeoplePicker/AgentPickerDialog';
import { useAppSettings } from '../../AppSettingsContext';
import type {
  AgentIdLifecyclePolicy,
  LifecyclePolicyScope,
} from '../../models/types';
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
  sectionDivider: {
    height: '1px',
    backgroundColor: tokens.colorNeutralStroke2,
    marginTop: '24px',
    marginBottom: '8px',
  },
  sectionHeader: {
    fontSize: '15px',
    fontWeight: 600,
    marginTop: '8px',
    display: 'block',
  },
  modesHint: {
    fontSize: '12px',
    color: tokens.colorPaletteRedForeground1,
    marginTop: '4px',
    display: 'block',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginTop: '12px',
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

type PickerTarget = 'reconfirm' | 'inactivity';

export function AgentIdPolicyPage() {
  const styles = useStyles();
  const { showDefaultDisableUx, defaultDisableVariant } = useAppSettings();
  const [policy, setPolicy] = useState<AgentIdLifecyclePolicy | null>(null);
  const [draft, setDraft] = useState<AgentIdLifecyclePolicy | null>(null);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>('reconfirm');

  const load = async () => {
    const p = await getAgentIdPolicy();
    setPolicy(p);
    setDraft(p);
  };

  useEffect(() => {
    load();
  }, []);

  // Normalize: in Variant 2, inactivity mode disallows "Specific" scope.
  // If a loaded policy or a leftover state has scope "Specific" while
  // inactivity is on, reset to "All" so the RadioGroup has a valid selection.
  useEffect(() => {
    if (!draft) return;
    if (!showDefaultDisableUx || defaultDisableVariant !== 2) return;
    const inactivityOn = draft.lifecycleModes?.inactivity ?? false;
    if (inactivityOn && draft.scope === 'Specific') {
      setDraft({ ...draft, scope: 'All' });
    }
  }, [draft, showDefaultDisableUx, defaultDisableVariant]);

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

  // Which variant body to render. When flag is off, render the existing
  // single-toggle layout (variant 0). Variant 1 also uses the existing layout
  // because the new UI lives on a parallel page.
  const variant = showDefaultDisableUx ? defaultDisableVariant : 0;

  const openPicker = (target: PickerTarget) => {
    setPickerTarget(target);
    setPickerOpen(true);
  };

  // For Variant 2, the policy is "enabled" if any mode is checked.
  const modes = draft?.lifecycleModes ?? { reconfirm: true, inactivity: false };
  const anyModeOn = modes.reconfirm || modes.inactivity;

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

          {/* ---------- Variants 0 / 1: existing single-toggle layout ---------- */}
          {(variant === 0 || variant === 1) && (
            <>
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

              <PolicyScopePicker
                scope={draft.scope}
                selectedAgentIds={draft.selectedAgentIds}
                disabled={!draft.enabled}
                onChangeScope={(scope) => setDraft({ ...draft, scope })}
                onOpenPicker={() => openPicker('reconfirm')}
              />

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
                  disabled={!draft.enabled}
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

              <NotificationScheduleEditor
                customize={draft.customizeNotificationSchedule}
                firstDays={draft.firstNotificationDays}
                secondDays={draft.secondNotificationDays}
                thirdDays={draft.thirdNotificationDays}
                disabled={!draft.enabled}
                onChangeCustomize={(v) =>
                  setDraft({ ...draft, customizeNotificationSchedule: v })
                }
                onChangeDays={({ first, second, third }) =>
                  setDraft({
                    ...draft,
                    firstNotificationDays: first,
                    secondNotificationDays: second,
                    thirdNotificationDays: third,
                  })
                }
                trailingInfoText="Responsible party must have an Exchange license to receive notification emails."
              />
            </>
          )}

          {/* ---------- Variant 2: integrated mode picker ---------- */}
          {variant === 2 && (
            <>
              <Text className={styles.metaText} style={{ marginLeft: 0 }}>
                Created: {formatPolicyDate(draft.createdDateTime)}
              </Text>
              <Text className={styles.metaText} style={{ marginLeft: 0 }}>
                Last Modified: {formatPolicyDate(draft.lastModifiedDateTime)}
              </Text>

              <Text className={styles.sectionTitle}>Lifecycle modes</Text>
              <Text className={styles.sectionDescription}>
                Choose one or both ways agent identities are governed.
              </Text>
              <div className={styles.checkboxGroup}>
                <Checkbox
                  checked={modes.inactivity}
                  onChange={(_, d) => {
                    const turningOn = !!d.checked;
                    // Inactivity mode does not support "Specific agents" scope.
                    // If user enables inactivity while scope is "Specific", reset to "All".
                    const nextScope =
                      turningOn && draft.scope === 'Specific' ? 'All' : draft.scope;
                    setDraft({
                      ...draft,
                      scope: nextScope,
                      lifecycleModes: { ...modes, inactivity: turningOn },
                    });
                  }}
                  label="Disable agents after inactivity (default disable)"
                />
                <Checkbox
                  checked={modes.reconfirm}
                  onChange={(_, d) =>
                    setDraft({
                      ...draft,
                      lifecycleModes: { ...modes, reconfirm: !!d.checked },
                    })
                  }
                  label="Require periodic re-confirmation"
                />
              </div>
              {!anyModeOn && (
                <Text className={styles.modesHint}>
                  Select at least one lifecycle mode to save the policy.
                </Text>
              )}

              <InactivityWindowPicker
                days={draft.inactivityDays ?? 90}
                disabled={!modes.inactivity}
                onChange={(days) => setDraft({ ...draft, inactivityDays: days })}
              />
              <ReEnableInfoBanner />

              <Text className={styles.sectionTitle}>Periodic Re-confirmation</Text>
              <Text className={styles.sectionDescription}>
                Set how often Sponsors need to periodically re-confirm that agents they sponsor
                are needed
              </Text>
              <div className={styles.reconfirmRow}>
                <Text className={styles.reconfirmLabel}>
                  Require re-confirmation every:
                </Text>
                <Input
                  className={styles.smallInput}
                  type="number"
                  min={1}
                  disabled={!modes.reconfirm}
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

              <PolicyScopePicker
                scope={draft.scope}
                selectedAgentIds={draft.selectedAgentIds}
                disabled={!anyModeOn}
                availableScopes={
                  modes.inactivity ? ['All', 'Exclude'] : ['All', 'Specific', 'Exclude']
                }
                onChangeScope={(scope) => setDraft({ ...draft, scope })}
                onOpenPicker={() => openPicker('reconfirm')}
              />

              <NotificationScheduleEditor
                customize={draft.customizeNotificationSchedule}
                firstDays={draft.firstNotificationDays}
                secondDays={draft.secondNotificationDays}
                thirdDays={draft.thirdNotificationDays}
                disabled={!anyModeOn}
                onChangeCustomize={(v) =>
                  setDraft({ ...draft, customizeNotificationSchedule: v })
                }
                onChangeDays={({ first, second, third }) =>
                  setDraft({
                    ...draft,
                    firstNotificationDays: first,
                    secondNotificationDays: second,
                    thirdNotificationDays: third,
                  })
                }
                infoText="By default, Email notifications will be sent automatically 30, 15, and 1 day prior to action being taken. These windows apply to whichever lifecycle modes are active."
                trailingInfoText="Responsible party must have an Exchange license to receive notification emails."
              />

              <NotifyOwnersToggle
                checked={draft.notifyOwners ?? false}
                disabled={!anyModeOn}
                onChange={(v) => setDraft({ ...draft, notifyOwners: v })}
              />
            </>
          )}

          {/* ---------- Variant 3: two distinct sections ---------- */}
          {variant === 3 && (
            <>
              <Text className={styles.metaText} style={{ marginLeft: 0 }}>
                Created: {formatPolicyDate(draft.createdDateTime)}
              </Text>
              <Text className={styles.metaText} style={{ marginLeft: 0 }}>
                Last Modified: {formatPolicyDate(draft.lastModifiedDateTime)}
              </Text>

              {/* Section A — Inactivity-based disable */}
              <div className={styles.sectionDivider} />
              <Text className={styles.sectionHeader}>Inactivity-based disable</Text>
              <Text className={styles.sectionDescription}>
                Automatically disable inactive agent identities after a configurable period.
              </Text>
              <div className={styles.enableRow}>
                <Switch
                  checked={draft.inactivityDisableEnabled ?? true}
                  onChange={(_, d) =>
                    setDraft({ ...draft, inactivityDisableEnabled: d.checked })
                  }
                  label="Enable inactivity-based disable"
                />
              </div>

              <InactivityWindowPicker
                days={draft.inactivityDays ?? 90}
                disabled={!(draft.inactivityDisableEnabled ?? true)}
                onChange={(days) => setDraft({ ...draft, inactivityDays: days })}
              />

              <PolicyScopePicker
                title="Inactivity policy scope"
                scope={draft.inactivityScope ?? 'All'}
                selectedAgentIds={draft.inactivityExemptAgentIds ?? []}
                disabled={!(draft.inactivityDisableEnabled ?? true)}
                availableScopes={['All', 'Exclude']}
                onChangeScope={(scope) => setDraft({ ...draft, inactivityScope: scope })}
                onOpenPicker={() => openPicker('inactivity')}
              />

              <NotificationScheduleEditor
                title="Inactivity notification schedule"
                customize={draft.inactivityCustomizeNotificationSchedule ?? true}
                firstDays={draft.inactivityFirstNotificationDays ?? 30}
                secondDays={draft.inactivitySecondNotificationDays}
                thirdDays={draft.inactivityThirdNotificationDays}
                disabled={!(draft.inactivityDisableEnabled ?? true)}
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
              />

              <NotifyOwnersToggle
                checked={draft.notifyOwners ?? false}
                disabled={!(draft.inactivityDisableEnabled ?? true)}
                onChange={(v) => setDraft({ ...draft, notifyOwners: v })}
              />

              <ReEnableInfoBanner />

              {/* Section B — Periodic re-confirmation */}
              <div className={styles.sectionDivider} />
              <Text className={styles.sectionHeader}>Periodic re-confirmation</Text>
              <Text className={styles.sectionDescription}>
                Set how often Sponsors need to periodically re-confirm that agents they sponsor are
                needed.
              </Text>
              <div className={styles.enableRow}>
                <Switch
                  checked={draft.enabled}
                  onChange={(_, d) => setDraft({ ...draft, enabled: d.checked })}
                  label="Enable periodic re-confirmation"
                />
              </div>

              <div className={styles.reconfirmRow} style={{ marginTop: '16px' }}>
                <Text className={styles.reconfirmLabel}>Require re-confirmation every:</Text>
                <Input
                  className={styles.smallInput}
                  type="number"
                  min={1}
                  disabled={!draft.enabled}
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

              <PolicyScopePicker
                title="Re-confirmation policy scope"
                scope={draft.scope}
                selectedAgentIds={draft.selectedAgentIds}
                disabled={!draft.enabled}
                onChangeScope={(scope) => setDraft({ ...draft, scope })}
                onOpenPicker={() => openPicker('reconfirm')}
              />

              <NotificationScheduleEditor
                title="Re-confirmation notification schedule"
                customize={draft.customizeNotificationSchedule}
                firstDays={draft.firstNotificationDays}
                secondDays={draft.secondNotificationDays}
                thirdDays={draft.thirdNotificationDays}
                disabled={!draft.enabled}
                onChangeCustomize={(v) =>
                  setDraft({ ...draft, customizeNotificationSchedule: v })
                }
                onChangeDays={({ first, second, third }) =>
                  setDraft({
                    ...draft,
                    firstNotificationDays: first,
                    secondNotificationDays: second,
                    thirdNotificationDays: third,
                  })
                }
                trailingInfoText="Responsible party must have an Exchange license to receive notification emails."
              />
            </>
          )}

          <div className={styles.buttonRow}>
            <Button
              appearance="primary"
              disabled={!isDirty || saving || (variant === 2 && !anyModeOn)}
              onClick={handleSave}
            >
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
        initialSelectedIds={
          pickerTarget === 'inactivity'
            ? draft?.inactivityExemptAgentIds ?? []
            : draft?.selectedAgentIds ?? []
        }
        onClose={() => setPickerOpen(false)}
        onConfirm={(ids) => {
          if (draft) {
            if (pickerTarget === 'inactivity') {
              setDraft({ ...draft, inactivityExemptAgentIds: ids });
            } else {
              setDraft({ ...draft, selectedAgentIds: ids });
            }
          }
          setPickerOpen(false);
        }}
      />
    </LifecyclePageHeader>
  );
}

// Re-export type to keep imports stable (was previously referenced via this file).
export type { LifecyclePolicyScope };
